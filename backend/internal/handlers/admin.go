package handlers

import (
	"net/http"
	"net/url"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
)

func toBool(v any) bool {
	switch t := v.(type) {
	case bool:
		return t
	case string:
		return t == "true"
	}
	return false
}

func coerceBool(payload map[string]any, key string) {
	if v, ok := payload[key]; ok {
		if _, isBool := v.(bool); !isBool {
			payload[key] = toBool(v)
		}
	}
}

func coerceInt(payload map[string]any, key string) {
	v, ok := payload[key]
	if !ok {
		return
	}
	switch t := v.(type) {
	case float64:
		payload[key] = int(t)
	case string:
		if n, err := strconv.Atoi(strings.TrimSpace(t)); err == nil {
			payload[key] = n
		} else {
			payload[key] = 0
		}
	}
}

func str(v any) string {
	s, _ := v.(string)
	return s
}

func errMessage(err error, fallback string) string {
	if err == nil {
		return fallback
	}
	if msg := err.Error(); msg != "" && msg != "pocketbase error 0" {
		return msg
	}
	return fallback
}

// AdminList — GET /api/admin/:collection
func (a *App) AdminList(c fiber.Ctx) error {
	collection := c.Params("collection")
	if !adminCollections[collection] {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"success": false, "error": "unknown collection"})
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
		return c.JSON(fiber.Map{"success": false, "error": errMessage(err, "Gagal memuat data")})
	}
	if items == nil {
		items = []map[string]any{}
	}
	return c.JSON(dtoList(collection, items))
}

// AdminSave — POST /api/admin/:collection
// Body meniru server actions lama: {id?, isEdit, ...fields}.
// Selalu merespons 200 dengan {success, message?, error?} seperti server action.
func (a *App) AdminSave(c fiber.Ctx) error {
	collection := c.Params("collection")
	if !adminCollections[collection] {
		return c.JSON(fiber.Map{"success": false, "error": "Gagal menyimpan data"})
	}

	var body map[string]any
	if err := c.Bind().Body(&body); err != nil {
		return c.JSON(fiber.Map{"success": false, "error": "Gagal menyimpan data"})
	}

	id := str(body["id"])
	isEdit := toBool(body["isEdit"]) && id != ""

	payload := map[string]any{}
	for k, v := range body {
		if k == "id" || k == "isEdit" {
			continue
		}
		payload[k] = v
	}
	coerceBool(payload, "isPopular")
	coerceBool(payload, "isActive")
	coerceBool(payload, "isPublished")
	coerceInt(payload, "amount")
	coerceInt(payload, "progressPercent")
	coerceInt(payload, "orderIdx")

	switch collection {
	case "posts":
		if toBool(payload["isPublished"]) {
			payload["publishedAt"] = nowISO()
		} else {
			payload["publishedAt"] = nil
		}
	case "clients":
		pw := str(payload["password"])
		delete(payload, "passwordHash")
		if isEdit {
			if pw == "" {
				delete(payload, "password")
			} else {
				// PB menuntut konfirmasi password saat password di-set.
				payload["passwordConfirm"] = pw
			}
		} else if pw == "" {
			return c.JSON(fiber.Map{"success": false, "error": "Password wajib diisi untuk klien baru"})
		} else {
			payload["passwordConfirm"] = pw
		}
	case "invoices":
		if str(payload["projectId"]) == "" || str(payload["description"]) == "" ||
			str(payload["dueDate"]) == "" || toFloat(payload["amount"]) == 0 {
			return c.JSON(fiber.Map{"success": false, "error": "Semua kolom wajib diisi"})
		}
	case "projectAssets":
		if str(payload["projectId"]) == "" || str(payload["fileName"]) == "" || str(payload["fileUrl"]) == "" {
			return c.JSON(fiber.Map{"success": false, "error": "Data tidak lengkap"})
		}
	case "projects":
		if _, ok := payload["progressPercent"]; !ok {
			payload["progressPercent"] = 0
		}
		for _, k := range []string{"notes", "startedAt", "deliveredAt"} {
			if s, ok := payload[k].(string); ok && s == "" {
				payload[k] = nil
			}
		}
	}

	if isEdit {
		if _, err := a.PB.Update(collection, id, payload); err != nil {
			return c.JSON(fiber.Map{"success": false, "error": errMessage(err, "Gagal menyimpan data")})
		}
		return c.JSON(fiber.Map{"success": true, "message": saveMessages[collection][0]})
	}

	// Create
	if !ignoreClientID[collection] && id != "" {
		payload["id"] = id
	}
	if autoOrderCollections[collection] {
		if idx, err := a.nextOrderIdx(collection); err == nil {
			payload["orderIdx"] = idx
		}
	}
	if _, err := a.PB.Create(collection, payload); err != nil {
		return c.JSON(fiber.Map{"success": false, "error": errMessage(err, "Gagal menyimpan data")})
	}
	return c.JSON(fiber.Map{"success": true, "message": saveMessages[collection][1]})
}

func toFloat(v any) float64 {
	switch t := v.(type) {
	case float64:
		return t
	case int:
		return float64(t)
	case string:
		if f, err := strconv.ParseFloat(strings.TrimSpace(t), 64); err == nil {
			return f
		}
	}
	return 0
}

func (a *App) nextOrderIdx(collection string) (int, error) {
	q := url.Values{}
	q.Set("sort", "-orderIdx")
	q.Set("perPage", "1")
	items, err := a.PB.List(collection, q)
	if err != nil || len(items) == 0 {
		return 0, err
	}
	if f, ok := items[0]["orderIdx"].(float64); ok {
		return int(f) + 1, nil
	}
	return 0, nil
}

// AdminDelete — DELETE /api/admin/:collection/:id
func (a *App) AdminDelete(c fiber.Ctx) error {
	collection := c.Params("collection")
	id := c.Params("id")
	if !adminCollections[collection] {
		return c.JSON(fiber.Map{"success": false, "error": "Gagal menghapus data"})
	}
	if err := a.PB.Delete(collection, id); err != nil {
		return c.JSON(fiber.Map{"success": false, "error": errMessage(err, "Gagal menghapus data")})
	}
	return c.JSON(fiber.Map{"success": true, "message": deleteMessages[collection]})
}

// AdminToggle — PUT /api/admin/:collection/:id/toggle  body: {field}
func (a *App) AdminToggle(c fiber.Ctx) error {
	collection := c.Params("collection")
	id := c.Params("id")

	var body struct {
		Field string `json:"field"`
	}
	if err := c.Bind().Body(&body); err != nil || !toggleableFields[collection][body.Field] {
		return c.JSON(fiber.Map{"success": false, "error": "Gagal memperbarui status"})
	}

	rec, err := a.PB.Get(collection, id)
	if err != nil {
		return c.JSON(fiber.Map{"success": false, "error": errMessage(err, "Gagal memperbarui status")})
	}

	newVal := !toBool(rec[body.Field])
	payload := map[string]any{body.Field: newVal}

	msg := toggleMessages[collection][body.Field]
	if collection == "posts" && body.Field == "isPublished" {
		if newVal {
			payload["publishedAt"] = nowISO()
			msg = "Artikel dipublikasikan!"
		} else {
			payload["publishedAt"] = nil
			msg = "Artikel dijadikan draft!"
		}
	}
	if msg == "" {
		msg = "Status diperbarui!"
	}

	if _, err := a.PB.Update(collection, id, payload); err != nil {
		return c.JSON(fiber.Map{"success": false, "error": errMessage(err, "Gagal memperbarui status")})
	}
	return c.JSON(fiber.Map{"success": true, "message": msg})
}

// AdminStatus — PUT /api/admin/:collection/:id/status  body: {status}
// Dipakai leads (ubah status) dan tickets (resolve).
func (a *App) AdminStatus(c fiber.Ctx) error {
	collection := c.Params("collection")
	id := c.Params("id")
	if !adminCollections[collection] {
		return c.JSON(fiber.Map{"success": false, "error": "Gagal update status"})
	}

	var body struct {
		Status string `json:"status"`
	}
	if err := c.Bind().Body(&body); err != nil || body.Status == "" {
		return c.JSON(fiber.Map{"success": false, "error": "Gagal update status"})
	}

	if _, err := a.PB.Update(collection, id, map[string]any{"status": body.Status}); err != nil {
		return c.JSON(fiber.Map{"success": false, "error": errMessage(err, "Gagal update status")})
	}

	msg := "Status diperbarui!"
	if collection == "tickets" {
		msg = "Tiket ditandai selesai"
	}
	return c.JSON(fiber.Map{"success": true, "message": msg})
}

// Reorder — POST /api/admin/reorder  body: {table, items: [{id, orderIdx}]}
func (a *App) Reorder(c fiber.Ctx) error {
	var body struct {
		Table string `json:"table"`
		Items []struct {
			ID       string `json:"id"`
			OrderIdx int    `json:"orderIdx"`
		} `json:"items"`
	}
	if err := c.Bind().Body(&body); err != nil {
		return c.JSON(fiber.Map{"success": false, "error": err.Error()})
	}
	if !reorderCollections[body.Table] {
		return c.JSON(fiber.Map{"success": false, "error": "Invalid table"})
	}

	for _, item := range body.Items {
		if item.ID == "" {
			continue
		}
		if _, err := a.PB.Update(body.Table, item.ID, map[string]any{"orderIdx": item.OrderIdx}); err != nil {
			return c.JSON(fiber.Map{"success": false, "error": err.Error()})
		}
	}
	return c.JSON(fiber.Map{"success": true})
}

var reorderCollections = map[string]bool{
	"pricingPlans": true,
	"services":     true,
	"portfolios":   true,
	"testimonials": true,
	"faqs":         true,
	"clientLogos":  true,
	"stats":        true,
}

// AdminStats — GET /api/admin/dashboard/stats
// agregat dashboard utama (pengganti query SQL mentah Postgres).
func (a *App) AdminStats(c fiber.Ctx) error {
	q := url.Values{}
	q.Set("sort", "-created")
	leads, err := a.PB.List("leads", q)
	if err != nil {
		return c.Status(http.StatusBadGateway).JSON(fiber.Map{"error": err.Error()})
	}

	totalPosts, _ := a.PB.Count("posts", "")
	totalPortfolios, _ := a.PB.Count("portfolios", "")
	totalClients, _ := a.PB.Count("clients", "")

	wib := time.FixedZone("Asia/Jakarta", 7*3600)
	now := time.Now().In(wib)
	cutoff := now.AddDate(0, -6, 0)

	type monthKey struct{ year, month int }
	counts := map[monthKey]int{}
	leadsThisMonth := 0

	for _, lead := range leads {
		created, _ := lead["created"].(string)
		t, err := time.Parse(time.RFC3339, created)
		if err != nil {
			continue
		}
		t = t.In(wib)
		if t.Year() == now.Year() && int(t.Month()) == int(now.Month()) {
			leadsThisMonth++
		}
		if t.Before(cutoff) {
			continue
		}
		counts[monthKey{t.Year(), int(t.Month())}]++
	}

	keys := make([]monthKey, 0, len(counts))
	for k := range counts {
		keys = append(keys, k)
	}
	sort.Slice(keys, func(i, j int) bool {
		if keys[i].year != keys[j].year {
			return keys[i].year < keys[j].year
		}
		return keys[i].month < keys[j].month
	})
	barData := make([]fiber.Map, 0, len(keys))
	for _, k := range keys {
		label := time.Date(k.year, time.Month(k.month), 1, 0, 0, 0, 0, time.UTC).Format("Jan")
		barData = append(barData, fiber.Map{"month": label, "count": counts[k]})
	}

	statusCounts := map[string]int{}
	for _, lead := range leads {
		status, _ := lead["status"].(string)
		statusCounts[status]++
	}
	type statusVal struct {
		name  string
		value int
	}
	pie := make([]statusVal, 0, len(statusCounts))
	for name, value := range statusCounts {
		pie = append(pie, statusVal{name, value})
	}
	sort.Slice(pie, func(i, j int) bool {
		if pie[i].value != pie[j].value {
			return pie[i].value > pie[j].value
		}
		return pie[i].name < pie[j].name
	})
	pieData := make([]fiber.Map, 0, len(pie))
	for _, p := range pie {
		pieData = append(pieData, fiber.Map{"name": p.name, "value": p.value})
	}

	recent := leads
	if len(recent) > 8 {
		recent = recent[:8]
	}

	return c.JSON(fiber.Map{
		"barData":         barData,
		"pieData":         pieData,
		"recentLeads":     dtoList("leads", recent),
		"totalLeads":      len(leads),
		"leadsThisMonth":  leadsThisMonth,
		"totalPosts":      totalPosts,
		"totalPortfolios": totalPortfolios,
		"totalClients":    totalClients,
	})
}
