package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port  string
	PBURL string

	PBSuperEmail string
	PBSuperPass  string

	BaseURL string

	DokuClientID string
	DokuSecret   string

	ResendAPIKey string
	AdminEmail   string

	GeminiKey     string
	GroqKey       string
	MistralKey    string
	OpenRouterKey string
}

func Load() *Config {
	_ = godotenv.Load(".env", ".env.local", "../.env", "../.env.local")

	first := func(keys ...string) string {
		for _, k := range keys {
			if v := os.Getenv(k); v != "" {
				return v
			}
		}
		return ""
	}
	getenv := func(key, def string) string {
		if v := os.Getenv(key); v != "" {
			return v
		}
		return def
	}

	port := first("BACKEND_PORT", "PORT")
	if port == "" {
		port = "8080"
	}

	return &Config{
		Port:         port,
		PBURL:        getenv("PB_URL", "http://127.0.0.1:8090"),
		PBSuperEmail: first("PB_SUPERUSER_EMAIL", "PB_EMAIL"),
		PBSuperPass:  first("PB_SUPERUSER_PASSWORD", "PB_PASSWORD"),

		// Kosong secara default: handler DOKU memakai Origin request sebagai fallback
		// (persis perilaku lama NEXT_PUBLIC_BASE_URL || origin || localhost).
		BaseURL: os.Getenv("BASE_URL"),

		DokuClientID: os.Getenv("DOKU_CLIENT_ID"),
		DokuSecret:   os.Getenv("DOKU_SECRET_KEY"),

		ResendAPIKey: os.Getenv("RESEND_API_KEY"),
		AdminEmail:   getenv("ADMIN_EMAIL", "admin@ZilyaDigital.com"),

		GeminiKey:     first("GOOGLE_GEMINI_API_KEY", "GEMINI_API_KEY"),
		GroqKey:       os.Getenv("GROQ_API_KEY"),
		MistralKey:    os.Getenv("MISTRAL_API_KEY"),
		OpenRouterKey: os.Getenv("OPENROUTER_API_KEY"),
	}
}
