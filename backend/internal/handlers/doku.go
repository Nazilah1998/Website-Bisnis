package handlers

import (
	"bytes"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
)

func newUUID() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	b[6] = (b[6] & 0x0f) | 0x40
	b[8] = (b[8] & 0x3f) | 0x80
	return fmt.Sprintf("%08x-%04x-%04x-%04x-%012x",
		b[0:4], b[4:6], b[6:8], b[8:10], b[10:16])
}

func dokuSignature(clientID, requestID, timestamp, target string, digest []byte, secret string) string {
	sig := fmt.Sprintf("Client-Id:%s\nRequest-Id:%s\nRequest-Timestamp:%s\nRequest-Target:%s\nDigest:%s",
		clientID, requestID, timestamp, target,
		base64.StdEncoding.EncodeToString(digest))
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(sig))
	return "HMACSHA256=" + base64.StdEncoding.EncodeToString(mac.Sum(nil))
}

// DokuCheckout — POST /api/doku/checkout
// Port dari src/app/api/doku/checkout/route.ts.
func (a *App) DokuCheckout(c fiber.Ctx) error {
	var body struct {
		InvoiceID string `json:"invoiceId"`
	}
	if err := c.Bind().Body(&body); err != nil || body.InvoiceID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invoice ID required"})
	}

	clientID := a.Cfg.DokuClientID
	secretKey := a.Cfg.DokuSecret
	if clientID == "" || secretKey == "" {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "DOKU credentials are not set"})
	}

	inv, err := a.PB.Get("invoices", body.InvoiceID)
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "Invoice not found"})
	}
	if status, _ := inv["status"].(string); status == "paid" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invoice already paid"})
	}

	// Join manual: invoice -> project -> client (mirip leftJoin di Drizzle).
	var cli map[string]any
	if projectID, _ := inv["projectId"].(string); projectID != "" {
		if project, err := a.PB.Get("projects", projectID); err == nil {
			if clientID, _ := project["clientId"].(string); clientID != "" {
				if rec, err := a.PB.Get("clients", clientID); err == nil {
					cli = rec
				}
			}
		}
	}

	baseURL := a.Cfg.BaseURL
	if baseURL == "" {
		baseURL = c.Get("Origin")
	}
	if baseURL == "" {
		baseURL = "http://localhost:3000"
	}

	amount, _ := inv["amount"].(float64)
	invoiceID, _ := inv["id"].(string)

	payload := map[string]any{
		"order": map[string]any{
			"amount": amount,
			// Format: <invoiceId>_<timestamp> — webhook mem-parse balik invoiceId-nya.
			"invoice_number":  fmt.Sprintf("%s_%d", invoiceID, time.Now().UnixMilli()),
			"currency":        "IDR",
			"callback_url":    baseURL + "/id/client/dashboard",
			"notification_url": baseURL + "/api/doku/webhook",
			"auto_redirect":   true,
		},
		"payment": map[string]any{
			"payment_due_date": 60,
		},
		"customer": map[string]any{
			"id":    fieldOr(cli, "id", "CUST-001"),
			"name":  fieldOr(cli, "name", "Client"),
			"email": fieldOr(cli, "email", "client@example.com"),
		},
	}

	bodyBytes, err := json.Marshal(payload)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	requestID := newUUID()
	requestTimestamp := time.Now().UTC().Format("2006-01-02T15:04:05") + "Z"
	requestTarget := "/checkout/v1/payment"
	digest := sha256.Sum256(bodyBytes)
	signature := dokuSignature(clientID, requestID, requestTimestamp, requestTarget, digest[:], secretKey)

	req, _ := http.NewRequest(http.MethodPost, "https://api-sandbox.doku.com/checkout/v1/payment", bytes.NewReader(bodyBytes))
	req.Header.Set("Client-Id", clientID)
	req.Header.Set("Request-Id", requestID)
	req.Header.Set("Request-Timestamp", requestTimestamp)
	req.Header.Set("Signature", signature)
	req.Header.Set("Content-Type", "application/json")

	resp, err := httpClient.Do(req)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	defer resp.Body.Close()

	raw, _ := io.ReadAll(resp.Body)
	var dokuData struct {
		Response struct {
			Payment struct {
				URL string `json:"url"`
			} `json:"payment"`
		} `json:"response"`
		Error struct {
			Message string `json:"message"`
		} `json:"error"`
	}
	_ = json.Unmarshal(raw, &dokuData)

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		log.Printf("DOKU Checkout Error: %s", raw)
		msg := dokuData.Error.Message
		if msg == "" {
			msg = "Gagal membuat sesi pembayaran DOKU"
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": msg})
	}

	return c.JSON(fiber.Map{"payment_url": dokuData.Response.Payment.URL})
}

// DokuWebhook — POST /api/doku/webhook
// Verifikasi signature di atas raw body; bad signature hanya di-log (sama seperti lama).
func (a *App) DokuWebhook(c fiber.Ctx) error {
	raw := c.BodyRaw()

	clientID := a.Cfg.DokuClientID
	secretKey := a.Cfg.DokuSecret
	if clientID == "" || secretKey == "" {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	var payload map[string]any
	if err := json.Unmarshal(raw, &payload); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	requestID := c.Get("Request-Id")
	requestTimestamp := c.Get("Request-Timestamp")
	received := c.Get("Signature")
	requestTarget := "/api/doku/webhook"

	digest := sha256.Sum256(raw)
	expected := dokuSignature(clientID, requestID, requestTimestamp, requestTarget, digest[:], secretKey)
	if received != expected {
		log.Println("DOKU Webhook signature verification failed. Proceeding anyway for development, but fix in production.")
	}

	isSuccess := false
	if tx, ok := payload["transaction"].(map[string]any); ok {
		if status, _ := tx["status"].(string); status == "SUCCESS" {
			isSuccess = true
		}
	}
	if _, ok := payload["virtual_account_payment"]; ok {
		isSuccess = true
	}

	if isSuccess {
		if order, ok := payload["order"].(map[string]any); ok {
			if rawOrderRef, ok := order["invoice_number"].(string); ok {
				invoiceID := rawOrderRef
				if strings.Contains(rawOrderRef, "_") {
					invoiceID = rawOrderRef[:strings.LastIndex(rawOrderRef, "_")]
				}
				if invoiceID != "" {
					if _, err := a.PB.Update("invoices", invoiceID, map[string]any{"status": "paid"}); err != nil {
						log.Printf("Gagal menandai invoice %s: %v", invoiceID, err)
					} else {
						log.Printf("Invoice %s marked as paid via DOKU. (order ref: %s)", invoiceID, rawOrderRef)
					}
				}
			}
		}
	}

	return c.JSON(fiber.Map{"message": "OK"})
}

func fieldOr(m map[string]any, key, def string) string {
	if m != nil {
		if v, ok := m[key].(string); ok && v != "" {
			return v
		}
	}
	return def
}
