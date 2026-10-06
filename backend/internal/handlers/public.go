package handlers

import (
	"log"
	"net/http"
	"net/url"
	"strings"

	"github.com/gofiber/fiber/v3"
)

// PublicList — GET /api/public/:collection?sort=&filter=
// Read publik dengan token superuser; aturan koleksi tidak berpengaruh di sini.
func (a *App) PublicList(c fiber.Ctx) error {
	collection := c.Params("collection")
	if !publicCollections[collection] {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "unknown collection"})
	}

	q := url.Values{}
	if sort := c.Query("sort"); sort != "" {
		q.Set("sort", sort)
	}
	if filter := c.Query("filter"); filter != "" {
		q.Set("filter", filter)
	}

	items, err := a.PB.List(collection, q)
	if err != nil {
		return c.Status(http.StatusBadGateway).JSON(fiber.Map{"error": err.Error()})
	}
	if items == nil {
		items = []map[string]any{}
	}
	return c.JSON(dtoList(collection, items))
}

// CreateLead — POST /api/leads
// Body & respons identik dengan src/app/api/leads/route.ts lama.
func (a *App) CreateLead(c fiber.Ctx) error {
	var body struct {
		ClientName       string `json:"clientName"`
		WhatsappNumber   string `json:"whatsappNumber"`
		Company          string `json:"company"`
		Requirements     string `json:"requirements"`
		EstimatedBudget  string `json:"estimatedBudget"`
		Email            string `json:"email"`
	}
	if err := c.Bind().Body(&body); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"success": false, "error": "Failed to save lead"})
	}

	company := body.Company
	if company == "" {
		company = "-"
	}

	rec, err := a.PB.Create("leads", fiber.Map{
		"clientName":      body.ClientName,
		"whatsappNumber":  body.WhatsappNumber,
		"company":         company,
		"requirements":    body.Requirements,
		"estimatedBudget": body.EstimatedBudget,
		"status":          "New",
	})
	if err != nil {
		log.Println("Error saving lead:", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"success": false, "error": "Failed to save lead"})
	}

	email := body.Email
	if email == "" {
		email = "-"
	}
	go a.sendLeadNotification(leadMail{
		Name:    body.ClientName,
		Email:   email,
		Phone:   body.WhatsappNumber,
		Service: "Web Development / Lead Form",
		Message: body.Requirements,
	})

	id, _ := rec["id"].(string)
	return c.JSON(fiber.Map{"success": true, "id": id})
}

// Chatbot — POST /api/chatbot
// Port dari src/app/api/chatbot/route.ts: konteks DB + fallback rantai provider LLM.
func (a *App) Chatbot(c fiber.Ctx) error {
	var body struct {
		Message string `json:"message"`
	}
	if err := c.Bind().Body(&body); err != nil || body.Message == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Message required"})
	}

	faqs, errF := a.PB.List("faqs", nil)
	services, errS := a.PB.List("services", nil)
	pricing, errP := a.PB.List("pricingPlans", nil)
	if errF != nil || errS != nil || errP != nil {
		return c.JSON(fiber.Map{"reply": maintenanceReply})
	}

	var faqLines []string
	for _, f := range faqs {
		q, _ := f["questionId"].(string)
		ans, _ := f["answerId"].(string)
		faqLines = append(faqLines, "Q: "+q+"\nA: "+ans)
	}
	var serviceLines []string
	for _, s := range services {
		title, _ := s["titleId"].(string)
		desc, _ := s["descId"].(string)
		serviceLines = append(serviceLines, "- "+title+": "+desc)
	}
	var priceLines []string
	for _, p := range pricing {
		name, _ := p["name"].(string)
		typ, _ := p["type"].(string)
		price, _ := p["price"].(string)
		priceLines = append(priceLines, "- "+name+" ("+typ+"): "+price)
	}

	systemPrompt := `Kamu adalah asisten virtual untuk ZilyaDigital, sebuah agensi jasa pembuatan website dan aplikasi profesional di Indonesia.

Jawab pertanyaan pengunjung dengan ramah, singkat, dan profesional dalam bahasa Indonesia. Jika pertanyaan tidak relevan dengan layanan kami, arahkan mereka untuk menghubungi kami langsung.

=== DATA LAYANAN KAMI ===
` + strings.Join(serviceLines, "\n") + `

=== PAKET HARGA ===
` + strings.Join(priceLines, "\n") + `

=== FAQ ===
` + strings.Join(faqLines, "\n\n") + `

=== ATURAN ===
- Jawab HANYA dalam bahasa Indonesia
- Maksimal 3 kalimat per jawaban
- Jika tidak yakin atau butuh info lebih lanjut, arahkan pengunjung untuk klik tab "WhatsApp" di atas kotak chat ini, atau hubungi nomor 082157204572.
- Selalu akhiri dengan ajakan ramah untuk berkonsultasi lebih lanjut.
- Jangan buat janji di luar kapabilitas yang sudah disebutkan`

	reply := a.tryProviders(systemPrompt, body.Message)
	if reply == "" {
		reply = maintenanceReply
	}
	return c.JSON(fiber.Map{"reply": reply})
}

const maintenanceReply = "Maaf, sistem chatbot sedang dalam pemeliharaan. Silakan hubungi kami langsung via WhatsApp ya!"
const chatbotErrorReply = "Maaf, terjadi kesalahan. Silakan hubungi kami langsung via WhatsApp ya! 😊"
