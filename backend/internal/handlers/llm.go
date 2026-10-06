package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"
)

// tryProviders menjalankan rantai fallback provider persis seperti urutan lama:
// Gemini -> Groq -> Mistral -> OpenRouter.
func (a *App) tryProviders(systemPrompt, message string) string {
	type provider struct {
		name string
		fn   func() (string, error)
	}
	providers := []provider{
		{"gemini", func() (string, error) { return a.tryGemini(systemPrompt, message) }},
		{"groq", func() (string, error) { return a.tryOpenAICompat(
			"https://api.groq.com/openai/v1/chat/completions",
			a.Cfg.GroqKey, "llama3-8b-8192", systemPrompt, message)}},
		{"mistral", func() (string, error) { return a.tryOpenAICompat(
			"https://api.mistral.ai/v1/chat/completions",
			a.Cfg.MistralKey, "mistral-small-latest", systemPrompt, message)}},
		{"openrouter", func() (string, error) { return a.tryOpenAICompat(
			"https://openrouter.ai/api/v1/chat/completions",
			a.Cfg.OpenRouterKey, "google/gemini-2.0-flash-lite-preview-02-05:free", systemPrompt, message)}},
	}

	for _, p := range providers {
		reply, err := p.fn()
		if err == nil && strings.TrimSpace(reply) != "" {
			return reply
		}
	}
	return ""
}

func (a *App) tryGemini(systemPrompt, message string) (string, error) {
	apiKey := a.Cfg.GeminiKey
	if apiKey == "" {
		return "", fmt.Errorf("no Gemini key")
	}

	payload := map[string]any{
		"contents": []map[string]any{
			{
				"role":  "user",
				"parts": []map[string]string{{"text": systemPrompt + "\n\nPertanyaan pengunjung: " + message}},
			},
		},
		"generationConfig": map[string]any{"maxOutputTokens": 200, "temperature": 0.7},
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost,
		"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="+apiKey,
		bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := httpClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("Gemini API error")
	}

	var data struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
		} `json:"candidates"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return "", err
	}
	if len(data.Candidates) == 0 || len(data.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("empty candidates")
	}
	return data.Candidates[0].Content.Parts[0].Text, nil
}

func (a *App) tryOpenAICompat(endpoint, apiKey, model, systemPrompt, message string) (string, error) {
	if apiKey == "" {
		return "", fmt.Errorf("no api key")
	}

	payload := map[string]any{
		"model": model,
		"messages": []map[string]string{
			{"role": "system", "content": systemPrompt},
			{"role": "user", "content": message},
		},
		"max_tokens": 200,
		"temperature": 0.7,
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost, endpoint, bytes.NewReader(body))
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	resp, err := httpClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("provider error %d", resp.StatusCode)
	}

	var data struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return "", err
	}
	if len(data.Choices) == 0 {
		return "", fmt.Errorf("empty choices")
	}
	return data.Choices[0].Message.Content, nil
}

var httpClient = &http.Client{Timeout: 45 * time.Second}
