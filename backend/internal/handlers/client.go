package handlers

import (
	"net/http"
	"net/url"

	"github.com/gofiber/fiber/v3"
)

// ClientDashboard — GET /api/client/dashboard
// Data dasbor klien: profil, proyek, aset, invoice (milik proyek klien), tiket.
// Seleksi data identik dengan halaman dasbor klien lama.
func (a *App) ClientDashboard(c fiber.Ctx) error {
	client, _ := c.Locals("client").(map[string]any)
	clientID, _ := client["id"].(string)
	if clientID == "" {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"success": false, "error": "Unauthorized"})
	}

	q := url.Values{}
	q.Set("filter", `clientId = "`+clientID+`"`)
	q.Set("sort", "created")
	clientProjects, err := a.PB.List("projects", q)
	if err != nil {
		return c.Status(http.StatusBadGateway).JSON(fiber.Map{"error": err.Error()})
	}

	// Halaman lama mengambil SEMUA aset dan invoice, lalu menyaring di sisi klien.
	allAssets, _ := a.PB.List("projectAssets", nil)
	allInvoices, _ := a.PB.List("invoices", nil)
	if allAssets == nil {
		allAssets = []map[string]any{}
	}

	myProjectIDs := map[string]bool{}
	for _, p := range clientProjects {
		if id, _ := p["id"].(string); id != "" {
			myProjectIDs[id] = true
		}
	}

	myInvoices := []map[string]any{}
	for _, inv := range allInvoices {
		if pid, _ := inv["projectId"].(string); myProjectIDs[pid] {
			myInvoices = append(myInvoices, inv)
		}
	}

	tq := url.Values{}
	tq.Set("filter", `clientId = "`+clientID+`"`)
	tq.Set("sort", "created")
	myTickets, err := a.PB.List("tickets", tq)
	if err != nil {
		myTickets = []map[string]any{}
	}

	return c.JSON(fiber.Map{
		"client":   dto("clients", client),
		"projects": dtoList("projects", clientProjects),
		"assets":   dtoList("projectAssets", allAssets),
		"invoices": dtoList("invoices", myInvoices),
		"tickets":  dtoList("tickets", myTickets),
	})
}

// CreateClientTicket — POST /api/client/tickets
// Identik dengan createTicketAction lama (clientId dari sesi, bukan body).
func (a *App) CreateClientTicket(c fiber.Ctx) error {
	client, _ := c.Locals("client").(map[string]any)
	clientID, _ := client["id"].(string)
	if clientID == "" {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"success": false, "error": "Unauthorized"})
	}

	var body struct {
		Subject string `json:"subject"`
		Message string `json:"message"`
	}
	if err := c.Bind().Body(&body); err != nil || body.Subject == "" || body.Message == "" {
		return c.JSON(fiber.Map{"success": false, "error": "Harap isi subjek dan pesan"})
	}

	if _, err := a.PB.Create("tickets", fiber.Map{
		"clientId": clientID,
		"subject":  body.Subject,
		"message":  body.Message,
		"status":   "open",
	}); err != nil {
		return c.JSON(fiber.Map{"success": false, "error": err.Error()})
	}
	return c.JSON(fiber.Map{"success": true, "message": "Tiket bantuan berhasil dikirim"})
}
