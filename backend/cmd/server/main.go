package main

import (
	"log"

	"zilyadigital/backend/internal/config"
	"zilyadigital/backend/internal/handlers"
	"zilyadigital/backend/internal/pb"

	"github.com/gofiber/fiber/v3"
)

func main() {
	cfg := config.Load()
	client := pb.New(cfg.PBURL, cfg.PBSuperEmail, cfg.PBSuperPass)
	app := handlers.New(cfg, client)

	f := fiber.New(fiber.Config{
		AppName: "zilyadigital-api",
	})

	f.Get("/health", func(c fiber.Ctx) error {
		return c.SendString("ok")
	})

	// --- Publik ---
	f.Post("/api/leads", app.CreateLead)
	f.Post("/api/chatbot", app.Chatbot)
	f.Post("/api/doku/checkout", app.DokuCheckout)
	f.Post("/api/doku/webhook", app.DokuWebhook)

	// --- Auth ---
	f.Post("/api/auth/admin/login", app.AdminLogin)
	f.Post("/api/auth/client/login", app.ClientLogin)
	f.Post("/api/auth/logout", app.Logout)
	f.Post("/api/admin/logout", app.AdminLogout) // path lama, tanpa middleware

	// --- Read publik ---
	f.Get("/api/public/:collection", app.PublicList)

	// --- Admin (dilindungi cookie admin_token) ---
	f.Use("/api/admin/*", app.AdminOnly)
	f.Get("/api/admin/dashboard/stats", app.AdminStats)
	// Static harus terdaftar sebelum route param (FastRouter: yang pertama menang).
	f.Post("/api/admin/reorder", app.Reorder)
	f.Get("/api/admin/:collection", app.AdminList)
	f.Post("/api/admin/:collection", app.AdminSave)
	f.Delete("/api/admin/:collection/:id", app.AdminDelete)
	f.Put("/api/admin/:collection/:id/toggle", app.AdminToggle)
	f.Put("/api/admin/:collection/:id/status", app.AdminStatus)

	// --- Client portal (dilindungi cookie client_token) ---
	f.Use("/api/client/*", app.ClientOnly)
	f.Get("/api/client/dashboard", app.ClientDashboard)
	f.Post("/api/client/tickets", app.CreateClientTicket)

	log.Printf("API listening on :%s (pocketbase: %s)", cfg.Port, cfg.PBURL)
	if err := f.Listen(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
