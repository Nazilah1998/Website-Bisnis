package handlers

import (
	"net/http"
	"time"

	"zilyadigital/backend/internal/config"
	"zilyadigital/backend/internal/pb"

	"github.com/gofiber/fiber/v3"
)

type App struct {
	Cfg *config.Config
	PB  *pb.Client
}

func New(cfg *config.Config, client *pb.Client) *App {
	return &App{Cfg: cfg, PB: client}
}

// Koleksi yang boleh diakses publik (read).
var publicCollections = map[string]bool{
	"services":     true,
	"portfolios":   true,
	"pricingPlans": true,
	"testimonials": true,
	"faqs":         true,
	"clientLogos":  true,
	"stats":        true,
	"posts":        true,
}

// Semua koleksi yang dikelola lewat /api/admin.
var adminCollections = map[string]bool{
	"services":      true,
	"portfolios":    true,
	"pricingPlans":  true,
	"leads":         true,
	"testimonials":  true,
	"faqs":          true,
	"clientLogos":   true,
	"stats":         true,
	"posts":         true,
	"projects":      true,
	"projectAssets": true,
	"invoices":      true,
	"tickets":       true,
	"clients":       true,
}

// Koleksi yang orderIdx-nya otomatis = max+1 saat create (sesuai server actions lama).
var autoOrderCollections = map[string]bool{
	"pricingPlans": true,
	"portfolios":   true,
	"testimonials": true,
	"faqs":         true,
	"clientLogos":  true,
	"stats":        true,
	"posts":        true,
}

// Koleksi yang id-nya selalu di-generate PocketBase (id form diabaikan).
var ignoreClientID = map[string]bool{
	"faqs":         true,
	"stats":        true,
	"posts":        true,
	"clients":      true,
	"projects":     true,
	"invoices":     true,
	"tickets":      true,
	"leads":        true,
	"projectAssets": true,
}

// Pesan sukses identik dengan server actions lama: {update, create}.
var saveMessages = map[string][2]string{
	"pricingPlans":  {"Paket berhasil diperbarui!", "Paket baru berhasil ditambahkan!"},
	"services":      {"Layanan berhasil diperbarui!", "Layanan baru berhasil ditambahkan!"},
	"portfolios":    {"Portofolio diperbarui!", "Portofolio ditambahkan!"},
	"testimonials":  {"Testimoni diperbarui!", "Testimoni ditambahkan!"},
	"faqs":          {"FAQ diperbarui!", "FAQ ditambahkan!"},
	"clientLogos":   {"Logo diperbarui!", "Logo ditambahkan!"},
	"stats":         {"Statistik diperbarui!", "Statistik ditambahkan!"},
	"posts":         {"Artikel diperbarui!", "Artikel berhasil disimpan!"},
	"clients":       {"Klien diperbarui!", "Klien baru berhasil ditambahkan!"},
	"projects":      {"Proyek diperbarui!", "Proyek baru ditambahkan!"},
	"invoices":      {"Tagihan diperbarui", "Tagihan ditambahkan"},
	"projectAssets": {"Aset diperbarui", "Aset berhasil ditambahkan"},
	"tickets":       {"Tiket diperbarui", "Tiket berhasil ditambahkan"},
	"leads":         {"Lead diperbarui", "Lead berhasil disimpan"},
}

var deleteMessages = map[string]string{
	"pricingPlans":  "Paket berhasil dihapus!",
	"services":      "Layanan berhasil dihapus!",
	"portfolios":    "Portofolio dihapus!",
	"testimonials":  "Testimoni dihapus!",
	"faqs":          "FAQ dihapus!",
	"clientLogos":   "Logo dihapus!",
	"stats":         "Statistik dihapus!",
	"posts":         "Artikel dihapus!",
	"clients":       "Klien berhasil dihapus!",
	"projects":      "Proyek berhasil dihapus!",
	"invoices":      "Tagihan dihapus",
	"projectAssets": "Aset berhasil dihapus",
	"tickets":       "Tiket berhasil dihapus",
	"leads":         "Lead dihapus!",
}

var toggleMessages = map[string]map[string]string{
	"pricingPlans": {"isPopular": "Status populer diperbarui!"},
	"services":     {"isActive": "Status layanan diperbarui!"},
	"clientLogos":  {"isActive": "Status logo diperbarui!"},
}

// Field boolean yang valid untuk di-toggle per koleksi.
var toggleableFields = map[string]map[string]bool{
	"pricingPlans": {"isPopular": true},
	"services":     {"isActive": true},
	"clientLogos":  {"isActive": true},
	"posts":        {"isPublished": true},
}

// dtoMenyamakan record PocketBase dengan objek Drizzle lama:
// sistem `created` -> createdAt (projectAssets -> uploadedAt),
// field sistem & rahasia dibuang.
func dto(collection string, rec map[string]any) map[string]any {
	out := make(map[string]any, len(rec)+1)
	for k, v := range rec {
		switch k {
		case "collectionId", "created", "updated", "password", "passwordHash":
			continue
		}
		out[k] = v
	}
	out["id"] = rec["id"]
	if collection == "projectAssets" {
		out["uploadedAt"] = rec["created"]
	} else {
		out["createdAt"] = rec["created"]
	}
	return out
}

func dtoList(collection string, recs []map[string]any) []map[string]any {
	out := make([]map[string]any, 0, len(recs))
	for _, r := range recs {
		out = append(out, dto(collection, r))
	}
	return out
}

// --- Middleware ---

// AdminOnly memvalidasi cookie admin_token (JWT koleksi users dengan role admin).
// /api/admin/logout di-skip agar sesi kadaluwarsa tetap bisa logout.
func (a *App) AdminOnly(c fiber.Ctx) error {
	if c.Path() == "/api/admin/logout" {
		return c.Next()
	}

	token := c.Cookies("admin_token")
	if token == "" {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"success": false, "error": "Unauthorized"})
	}
	record, err := a.PB.AuthRefresh("users", token)
	if err != nil {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"success": false, "error": "Unauthorized"})
	}
	if role, _ := record["role"].(string); role != "admin" {
		return c.Status(http.StatusForbidden).JSON(fiber.Map{"success": false, "error": "Forbidden"})
	}
	c.Locals("admin", record)
	return c.Next()
}

// ClientOnly memvalidasi cookie client_token (JWT koleksi clients).
func (a *App) ClientOnly(c fiber.Ctx) error {
	if c.Path() == "/api/client/logout" {
		return c.Next()
	}

	token := c.Cookies("client_token")
	if token == "" {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"success": false, "error": "Unauthorized"})
	}
	record, err := a.PB.AuthRefresh("clients", token)
	if err != nil {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"success": false, "error": "Unauthorized"})
	}
	c.Locals("client", record)
	return c.Next()
}

// --- Util ---

func nowISO() string {
	return time.Now().UTC().Format(time.RFC3339)
}
