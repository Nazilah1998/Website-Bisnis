package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

type leadMail struct {
	Name    string
	Email   string
	Phone   string
	Service string
	Message string
}

// sendLeadNotification — port dari src/lib/email.ts (Resend HTTP API).
// Bila RESEND_API_KEY kosong, notifikasi dilewati (sama seperti perilaku lama).
func (a *App) sendLeadNotification(lead leadMail) {
	if a.Cfg.ResendAPIKey == "" {
		log.Printf("Skipping email notification because RESEND_API_KEY is not set. %+v", lead)
		return
	}

	html := fmt.Sprintf(`
        <h2>Anda mendapatkan prospek baru dari ZilyaDigital!</h2>
        <p><strong>Nama:</strong> %s</p>
        <p><strong>Email:</strong> %s</p>
        <p><strong>WhatsApp:</strong> %s</p>
        <p><strong>Layanan:</strong> %s</p>
        <p><strong>Pesan:</strong> %s</p>
        <br/>
        <p>Segera hubungi klien melalui WhatsApp untuk menindaklanjuti.</p>
    `, lead.Name, lead.Email, lead.Phone, lead.Service, lead.Message)

	payload := map[string]any{
		"from":    "ZilyaDigital <onboarding@resend.dev>",
		"to":      []string{a.Cfg.AdminEmail},
		"subject": fmt.Sprintf("Prospek Baru: %s - %s", lead.Name, lead.Service),
		"html":    html,
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost, "https://api.resend.com/emails", bytes.NewReader(body))
	req.Header.Set("Authorization", "Bearer "+a.Cfg.ResendAPIKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := httpClient.Do(req)
	if err != nil {
		log.Println("Failed to send email:", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		b, _ := io.ReadAll(resp.Body)
		log.Printf("Resend error: %s", b)
	}
}
