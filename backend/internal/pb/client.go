// Package pb adalah client REST sederhana untuk PocketBase.
// Semua operasi data memakai token superuser; token user (cookie) hanya
// dipakai untuk auth-refresh guna memvalidasi sesi.
package pb

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"sync"
	"time"
)

type Client struct {
	BaseURL  string
	Identity string
	Password string

	http  *http.Client
	mu    sync.Mutex
	token string
}

func New(baseURL, identity, password string) *Client {
	return &Client{
		BaseURL:  strings.TrimRight(baseURL, "/"),
		Identity: identity,
		Password: password,
		http:     &http.Client{Timeout: 30 * time.Second},
	}
}

// APIError adalah error non-2xx dari PocketBase.
type APIError struct {
	Status  int
	Message string
}

func (e *APIError) Error() string {
	if e.Message != "" {
		return e.Message
	}
	return fmt.Sprintf("pocketbase error %d", e.Status)
}

type AuthResult struct {
	Record map[string]any `json:"record"`
	Token  string         `json:"token"`
}

func (c *Client) raw(method, path string, query url.Values, body any, auth string) (int, []byte, error) {
	var rdr io.Reader
	if body != nil {
		b, err := json.Marshal(body)
		if err != nil {
			return 0, nil, err
		}
		rdr = bytes.NewReader(b)
	}

	u := c.BaseURL + path
	if len(query) > 0 {
		u += "?" + query.Encode()
	}

	req, err := http.NewRequest(method, u, rdr)
	if err != nil {
		return 0, nil, err
	}
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	if auth != "" {
		req.Header.Set("Authorization", auth)
	}

	resp, err := c.http.Do(req)
	if err != nil {
		return 0, nil, err
	}
	defer resp.Body.Close()

	b, err := io.ReadAll(resp.Body)
	if err != nil {
		return resp.StatusCode, nil, err
	}
	return resp.StatusCode, b, nil
}

func parseError(status int, body []byte) error {
	var e struct {
		Message string `json:"message"`
	}
	_ = json.Unmarshal(body, &e)
	return &APIError{Status: status, Message: e.Message}
}

// --- Superuser ---

func (c *Client) Superuser() (string, error) {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.token != "" {
		return c.token, nil
	}

	payload := map[string]string{"identity": c.Identity, "password": c.Password}
	// Endpoint baru (v0.23+) dan endpoint lama sebagai fallback.
	for _, path := range []string{
		"/api/collections/_superusers/auth-with-password",
		"/api/admins/auth-with-password",
	} {
		st, body, err := c.raw(http.MethodPost, path, nil, payload, "")
		if err != nil || st != 200 {
			continue
		}
		var res AuthResult
		if json.Unmarshal(body, &res) == nil && res.Token != "" {
			c.token = res.Token
			return res.Token, nil
		}
	}
	return "", fmt.Errorf("gagal autentikasi superuser PocketBase (%s)", c.BaseURL)
}

func (c *Client) invalidateSuperuser() {
	c.mu.Lock()
	c.token = ""
	c.mu.Unlock()
}

// superuserDo menjalankan request dengan token superuser;
// otomatis mengulang sekali bila token kedaluwarsa (401).
func (c *Client) superuserDo(method, path string, query url.Values, body any) (int, []byte, error) {
	var st int
	var b []byte
	var err error
	for attempt := 0; attempt < 2; attempt++ {
		tok, err := c.Superuser()
		if err != nil {
			return 0, nil, err
		}
		st, b, err = c.raw(method, path, query, body, tok)
		if err != nil {
			return st, b, err
		}
		if st == 401 && attempt == 0 {
			c.invalidateSuperuser()
			continue
		}
		return st, b, nil
	}
	return st, b, err
}

func (c *Client) superuserJSON(method, path string, query url.Values, body any, out any) error {
	st, b, err := c.superuserDo(method, path, query, body)
	if err != nil {
		return err
	}
	if st < 200 || st >= 300 {
		return parseError(st, b)
	}
	if out != nil {
		return json.Unmarshal(b, out)
	}
	return nil
}

// --- Operasi data ---

// List mengambil seluruh record (autopaginasi) dengan query sort/filter opsional.
func (c *Client) List(collection string, query url.Values) ([]map[string]any, error) {
	if query == nil {
		query = url.Values{}
	}
	page := 1
	perPage := 200
	query.Set("perPage", strconv.Itoa(perPage))

	var all []map[string]any
	for {
		query.Set("page", strconv.Itoa(page))

		var res struct {
			Items      []map[string]any `json:"items"`
			TotalPages int              `json:"totalPages"`
		}
		if err := c.superuserJSON(http.MethodGet, "/api/collections/"+collection+"/records", query, nil, &res); err != nil {
			return nil, err
		}
		all = append(all, res.Items...)
		if len(res.Items) == 0 || page >= res.TotalPages {
			break
		}
		page++
	}
	return all, nil
}

// Count mengembalikan total record (opsional filter PB).
func (c *Client) Count(collection, filter string) (int, error) {
	q := url.Values{}
	q.Set("perPage", "1")
	if filter != "" {
		q.Set("filter", filter)
	}
	var res struct {
		TotalItems int `json:"totalItems"`
	}
	if err := c.superuserJSON(http.MethodGet, "/api/collections/"+collection+"/records", q, nil, &res); err != nil {
		return 0, err
	}
	return res.TotalItems, nil
}

func (c *Client) Get(collection, id string) (map[string]any, error) {
	var rec map[string]any
	err := c.superuserJSON(http.MethodGet, "/api/collections/"+collection+"/records/"+url.PathEscape(id), nil, nil, &rec)
	return rec, err
}

func (c *Client) Create(collection string, payload map[string]any) (map[string]any, error) {
	var rec map[string]any
	err := c.superuserJSON(http.MethodPost, "/api/collections/"+collection+"/records", nil, payload, &rec)
	return rec, err
}

func (c *Client) Update(collection, id string, payload map[string]any) (map[string]any, error) {
	var rec map[string]any
	err := c.superuserJSON(http.MethodPatch, "/api/collections/"+collection+"/records/"+url.PathEscape(id), nil, payload, &rec)
	return rec, err
}

func (c *Client) Delete(collection, id string) error {
	return c.superuserJSON(http.MethodDelete, "/api/collections/"+collection+"/records/"+url.PathEscape(id), nil, nil, nil)
}

// --- Auth user ---

func (c *Client) AuthWithPassword(collection, identity, password string) (*AuthResult, error) {
	var res AuthResult
	payload := map[string]string{"identity": identity, "password": password}
	st, b, err := c.raw(http.MethodPost, "/api/collections/"+collection+"/auth-with-password", nil, payload, "")
	if err != nil {
		return nil, err
	}
	if st != 200 {
		return nil, parseError(st, b)
	}
	if err := json.Unmarshal(b, &res); err != nil {
		return nil, err
	}
	if res.Token == "" {
		return nil, &APIError{Status: st, Message: "token kosong"}
	}
	return &res, nil
}

// AuthRefresh memvalidasi token user terhadap koleksi tertentu
// dan mengembalikan record user-nya.
// Catatan: PB v0.23+ hanya menerima POST untuk auth-refresh.
func (c *Client) AuthRefresh(collection, token string) (map[string]any, error) {
	st, b, err := c.raw(http.MethodPost, "/api/collections/"+collection+"/auth-refresh", nil, nil, token)
	if err != nil {
		return nil, err
	}
	if st != 200 {
		return nil, parseError(st, b)
	}
	var res AuthResult
	if err := json.Unmarshal(b, &res); err != nil {
		return nil, err
	}
	return res.Record, nil
}
