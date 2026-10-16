package handlers

import (
	"encoding/json"
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

// TurnstileSiteKey — GET /api/auth/turnstile/sitekey
func (a *App) TurnstileSiteKey(c fiber.Ctx) error {
	siteKey := os.Getenv("TURNSTILE_SITE_KEY")
	if siteKey == "" {
		siteKey = "0x4AAAAAAFPmeHthhMli5uB_"
	}
	return c.JSON(fiber.Map{
		"siteKey": siteKey,
	})
}

func (a *App) verifyTurnstile(token, ip string) bool {
	secret := os.Getenv("TURNSTILE_SECRET_KEY")
	if secret == "" {
		// Jika secret belum diset di environment, loloskan untuk mencegah blokir dev
		return true
	}
	if token == "" {
		return false
	}

	data := url.Values{}
	data.Set("secret", secret)
	data.Set("response", token)
	if ip != "" {
		data.Set("remoteip", ip)
	}

	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.PostForm("https://challenges.cloudflare.com/turnstile/v0/siteverify", data)
	if err != nil || resp.StatusCode != http.StatusOK {
		return false
	}
	defer resp.Body.Close()

	var result struct {
		Success bool `json:"success"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return false
	}
	return result.Success
}

// ClientLogin — POST /api/auth/client/login
func (a *App) ClientLogin(c fiber.Ctx) error {
	var body struct {
		Email          string `json:"email"`
		Password       string `json:"password"`
		TurnstileToken string `json:"turnstileToken"`
	}
	if err := c.Bind().Body(&body); err != nil || body.Email == "" || body.Password == "" {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"success": false, "error": "Email dan password wajib diisi"})
	}

	if !a.verifyTurnstile(body.TurnstileToken, c.IP()) {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Verifikasi Cloudflare Turnstile gagal atau kedaluwarsa. Silakan centang kembali.",
		})
	}

	res, err := a.PB.AuthWithPassword("clients", body.Email, body.Password)
	if err != nil {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"success": false, "error": "Email atau password tidak valid"})
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

// ClientRegister — POST /api/auth/client/register
func (a *App) ClientRegister(c fiber.Ctx) error {
	var body struct {
		Name           string `json:"name"`
		Email          string `json:"email"`
		Password       string `json:"password"`
		Company        string `json:"company"`
		Phone          string `json:"phone"`
		TurnstileToken string `json:"turnstileToken"`
	}
	if err := c.Bind().Body(&body); err != nil || body.Email == "" || body.Password == "" || body.Name == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"success": false, "error": "Nama, email, dan password wajib diisi"})
	}

	if !a.verifyTurnstile(body.TurnstileToken, c.IP()) {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Verifikasi Cloudflare Turnstile gagal atau kedaluwarsa. Silakan centang kembali.",
		})
	}

	record := map[string]any{
		"name":            body.Name,
		"email":           body.Email,
		"emailVisibility": true,
		"password":        body.Password,
		"passwordConfirm": body.Password,
		"company":         body.Company,
		"phone":           body.Phone,
	}

	_, err := a.PB.Create("clients", record)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"success": false, "error": "Email sudah terdaftar atau gagal membuat akun"})
	}

	res, err := a.PB.AuthWithPassword("clients", body.Email, body.Password)
	if err != nil {
		return c.JSON(fiber.Map{"success": true, "message": "Pendaftaran berhasil, silakan masuk"})
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
