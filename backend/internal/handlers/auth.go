package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"zilyadigital/backend/internal/pb"

	"github.com/gofiber/fiber/v3"
)

const weekSeconds = 60 * 60 * 24 * 7

var errNoAuth = errors.New("kredensial tidak valid")

func (a *App) secureCookies() bool {
	return strings.HasPrefix(os.Getenv("BASE_URL"), "https://")
}

// AdminLogin — POST /api/auth/admin/login
// Kredensial identik dengan halaman login admin lama.
func (a *App) AdminLogin(c fiber.Ctx) error {
	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := c.Bind().Body(&body); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"success": false, "error": "Username dan password wajib diisi"})
	}
	if body.Username == "" || body.Password == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"success": false, "error": "Username dan password wajib diisi"})
	}

	res, err := a.PB.AuthWithPassword("users", body.Username, body.Password)
	if err != nil {
		// Fallback: bila identityFields username tidak didukung PB,
		// cari user by username lalu autentikasi via email.
		res, err = a.adminLoginFallback(body.Username, body.Password)
		if err != nil {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"success": false, "error": "Kredensial tidak valid"})
		}
	}

	if role, _ := res.Record["role"].(string); role != "admin" {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"success": false, "error": "Kredensial tidak valid"})
	}

	c.Cookie(&fiber.Cookie{
		Name:     "admin_token",
		Value:    res.Token,
		Path:     "/",
		MaxAge:   weekSeconds,
		HTTPOnly: true,
		SameSite: fiber.CookieSameSiteLaxMode,
		Secure:   a.secureCookies(),
	})
	return c.JSON(fiber.Map{"success": true})
}

func (a *App) adminLoginFallback(username, password string) (*pb.AuthResult, error) {
	q := url.Values{}
	q.Set("filter", fmt.Sprintf("username = %q", strings.ReplaceAll(username, `"`, ``)))
	users, err := a.PB.List("users", q)
	if err != nil || len(users) == 0 {
		return nil, errNoAuth
	}
	email, _ := users[0]["email"].(string)
	if email == "" {
		return nil, errNoAuth
	}
	return a.PB.AuthWithPassword("users", email, password)
}

// ClientLogin — POST /api/auth/client/login
func (a *App) ClientLogin(c fiber.Ctx) error {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.Bind().Body(&body); err != nil || body.Email == "" || body.Password == "" {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"success": false, "error": "invalid"})
	}

	res, err := a.PB.AuthWithPassword("clients", body.Email, body.Password)
	if err != nil {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"success": false, "error": "invalid"})
	}

	c.Cookie(&fiber.Cookie{
		Name:     "client_token",
		Value:    res.Token,
		Path:     "/",
		MaxAge:   weekSeconds,
		HTTPOnly: true,
		SameSite: fiber.CookieSameSiteLaxMode,
		Secure:   a.secureCookies(),
	})
	return c.JSON(fiber.Map{"success": true})
}

// Logout — POST /api/auth/logout (hapus kedua sesi)
func (a *App) Logout(c fiber.Ctx) error {
	a.clearCookie(c, "admin_token")
	a.clearCookie(c, "client_token")
	return c.JSON(fiber.Map{"success": true})
}

// AdminLogout — POST /api/admin/logout (kompatibel dengan route lama)
func (a *App) AdminLogout(c fiber.Ctx) error {
	a.clearCookie(c, "admin_token")
	return c.JSON(fiber.Map{"success": true})
}

func (a *App) clearCookie(c fiber.Ctx, name string) {
	c.Cookie(&fiber.Cookie{
		Name:     name,
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		Expires:  time.Unix(0, 0),
		HTTPOnly: true,
		SameSite: fiber.CookieSameSiteLaxMode,
		Secure:   a.secureCookies(),
	})
}
