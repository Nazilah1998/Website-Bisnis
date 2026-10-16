package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/gofiber/fiber/v3"
)

type googleTokenResponse struct {
	AccessToken string `json:"access_token"`
	IDToken     string `json:"id_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int    `json:"expires_in"`
}

type googleUserInfo struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	VerifiedEmail bool   `json:"verified_email"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
}

func (a *App) getGoogleConfig() (clientID, clientSecret, redirectURI string, ok bool) {
	clientID = os.Getenv("GOOGLE_CLIENT_ID")
	clientSecret = os.Getenv("GOOGLE_CLIENT_SECRET")
	baseURL := os.Getenv("BASE_URL")
	if baseURL == "" {
		baseURL = "http://localhost:3000"
	}
	baseURL = strings.TrimRight(baseURL, "/")

	redirectURI = os.Getenv("GOOGLE_REDIRECT_URI")
	if redirectURI == "" {
		redirectURI = baseURL + "/auth/callback"
	}

	if clientID == "" || clientSecret == "" {
		return "", "", "", false
	}
	return clientID, clientSecret, redirectURI, true
}

// GoogleAuthURL — GET /api/auth/google/url
func (a *App) GoogleAuthURL(c fiber.Ctx) error {
	clientID, _, redirectURI, ok := a.getGoogleConfig()
	if !ok {
		return c.JSON(fiber.Map{
			"configured": false,
			"url":        "",
			"message":    "GOOGLE_CLIENT_ID atau GOOGLE_CLIENT_SECRET belum diset di environment",
		})
	}

	scope := url.QueryEscape("openid email profile")
	authURL := fmt.Sprintf("https://accounts.google.com/o/oauth2/v2/auth?client_id=%s&redirect_uri=%s&response_type=code&scope=%s&prompt=select_account",
		url.QueryEscape(clientID),
		url.QueryEscape(redirectURI),
		scope,
	)

	return c.JSON(fiber.Map{
		"configured": true,
		"url":        authURL,
	})
}

// GoogleCallback — GET /api/auth/google/callback
func (a *App) GoogleCallback(c fiber.Ctx) error {
	code := c.Query("code")
	if code == "" {
		return c.Redirect().To("/client/login?error=no_code")
	}

	clientID, clientSecret, redirectURI, ok := a.getGoogleConfig()
	if !ok {
		return c.Redirect().To("/client/login?error=not_configured")
	}

	// 1. Tukar authorization code dengan access token
	tokenURL := "https://oauth2.googleapis.com/token"
	data := url.Values{}
	data.Set("code", code)
	data.Set("client_id", clientID)
	data.Set("client_secret", clientSecret)
	data.Set("redirect_uri", redirectURI)
	data.Set("grant_type", "authorization_code")

	resp, err := http.PostForm(tokenURL, data)
	if err != nil || resp.StatusCode != http.StatusOK {
		return c.Redirect().To("/client/login?error=token_exchange_failed")
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var tokenRes googleTokenResponse
	if err := json.Unmarshal(body, &tokenRes); err != nil || tokenRes.AccessToken == "" {
		return c.Redirect().To("/client/login?error=invalid_token_response")
	}

	// 2. Ambil profil pengguna dari Google
	userReq, _ := http.NewRequest(http.MethodGet, "https://www.googleapis.com/oauth2/v2/userinfo", nil)
	userReq.Header.Set("Authorization", "Bearer "+tokenRes.AccessToken)
	userResp, err := http.DefaultClient.Do(userReq)
	if err != nil || userResp.StatusCode != http.StatusOK {
		return c.Redirect().To("/client/login?error=userinfo_failed")
	}
	defer userResp.Body.Close()

	userBody, _ := io.ReadAll(userResp.Body)
	var gUser googleUserInfo
	if err := json.Unmarshal(userBody, &gUser); err != nil || gUser.Email == "" {
		return c.Redirect().To("/client/login?error=invalid_user_data")
	}

	// 3. Cari klien di PocketBase berdasarkan email
	q := url.Values{}
	q.Set("filter", fmt.Sprintf(`email = "%s"`, gUser.Email))
	q.Set("perPage", "1")
	existing, _ := a.PB.List("clients", q)

	var targetPassword string
	randBytes := make([]byte, 16)
	_, _ = rand.Read(randBytes)
	targetPassword = hex.EncodeToString(randBytes) + "A1!"

	if len(existing) > 0 {
		// Update password via superuser untuk membuat sesi login
		clientIDStr, _ := existing[0]["id"].(string)
		_, _ = a.PB.Update("clients", clientIDStr, map[string]any{
			"password":        targetPassword,
			"passwordConfirm": targetPassword,
		})
	} else {
		// Daftarkan klien baru via Google
		newRecord := map[string]any{
			"name":            gUser.Name,
			"email":           gUser.Email,
			"emailVisibility": true,
			"password":        targetPassword,
			"passwordConfirm": targetPassword,
			"company":         "",
			"phone":           "",
		}
		_, err = a.PB.Create("clients", newRecord)
		if err != nil {
			return c.Redirect().To("/client/login?error=client_creation_failed")
		}
	}

	// 4. Autentikasi klien untuk mendapatkan token sesi PocketBase
	authRes, err := a.PB.AuthWithPassword("clients", gUser.Email, targetPassword)
	if err != nil {
		return c.Redirect().To("/client/login?error=auth_failed")
	}

	// 5. Pasang cookie client_token
	c.Cookie(&fiber.Cookie{
		Name:     "client_token",
		Value:    authRes.Token,
		Path:     "/",
		MaxAge:   weekSeconds,
		HTTPOnly: true,
		SameSite: fiber.CookieSameSiteLaxMode,
		Secure:   a.secureCookies(),
	})

	return c.Redirect().To("/client/dashboard")
}
