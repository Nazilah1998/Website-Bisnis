import type { ReactNode } from "react";
import type { Row } from "@/components/admin/CollectionManager";
import ProjectAssetsDialog from "@/components/admin/ProjectAssetsDialog";

/* ------------------------------------------------------------------ */
/*  Tipe deklarasi untuk koleksi CRUD admin                            */
/* ------------------------------------------------------------------ */

export type Field =
  | {
      type: "text";
      key: string;
      label: string;
      required?: boolean;
      span?: 1 | 2;
      editOnly?: boolean;
      readonlyOnEdit?: boolean;
      placeholder?: string;
      mono?: boolean;
    }
  | { type: "textarea"; key: string; label: string; required?: boolean; span?: 1 | 2; editOnly?: boolean; rows?: number; mono?: boolean }
  | { type: "number"; key: string; label: string; required?: boolean; span?: 1 | 2; editOnly?: boolean; min?: number; max?: number; value?: number }
  | { type: "select"; key: string; label: string; options: { value: string; label: string }[]; required?: boolean; span?: 1 | 2; editOnly?: boolean; hint?: string }
  | { type: "date"; key: string; label: string; required?: boolean; span?: 1 | 2; editOnly?: boolean }
  | { type: "amount"; key: string; label: string; required?: boolean; span?: 1 | 2; editOnly?: boolean }
  | { type: "password"; key: string; label: string; required?: boolean; span?: 1 | 2; editOnly?: boolean; placeholder?: string };

export interface Column {
  label: string;
  kind: "text" | "title2" | "img" | "accent" | "amount" | "date" | "progress" | "badge" | "pill";
  keys?: [string, string?];
  key?: string;
  badgeKey?: string;
  badgeMap?: Record<string, { label: string; cls: string }>;
  truncate?: boolean;
  secondaryCls?: string;
  prefix?: string;
  right?: boolean;
  widthCls?: string;
  round?: boolean;
  contain?: boolean;
  capitalize?: boolean;
}

export interface CollectionMeta {
  collection: string;
  title: string;
  description: string;
  addLabel?: string;
  emptyIcon: "settings" | "briefcase" | "creditcard" | "star" | "helpcircle" | "image" | "barchart" | "bookopen" | "users" | "folderopen" | "filetext" | "lifebuoy";
  emptyTitle: string;
  emptySub: string;
  reorder?: boolean;
  toggleField?: string;
  resolveStatus?: string;
  columns: Column[];
  fields: (ctx: Record<string, unknown>) => Field[];
  extraActions?: (row: Row, ctx: Record<string, unknown>) => ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Koleksi                                                            */
/* ------------------------------------------------------------------ */

export const META: Record<string, CollectionMeta> = {
  services: {
    collection: "services",
    title: "Kelola Layanan",
    description: "Tambahkan atau edit layanan yang ditawarkan oleh agensi Anda.",
    addLabel: "Tambah Layanan",
    emptyIcon: "settings",
    emptyTitle: "Belum ada layanan",
    emptySub: "Layanan perusahaan Anda akan ditampilkan di sini.",
    reorder: true,
    toggleField: "isActive",
    columns: [
      { label: "ID Layanan", kind: "text", key: "id" },
      { label: "Judul", kind: "title2", keys: ["titleId", "titleEn"] },
      {
        label: "Status",
        kind: "badge",
        badgeKey: "isActive",
        badgeMap: {
          true: { label: "Aktif", cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50" },
          false: { label: "Nonaktif", cls: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700" },
        },
      },
    ],
    fields: () => [
      { type: "text", key: "id", label: "ID Layanan (contoh: ecommerce)", required: true, readonlyOnEdit: true },
      { type: "text", key: "titleId", label: "Judul (ID)", required: true },
      { type: "text", key: "titleEn", label: "Judul (EN)", required: true },
      { type: "text", key: "descId", label: "Deskripsi (ID)", required: true },
      { type: "text", key: "descEn", label: "Deskripsi (EN)", required: true },
      { type: "text", key: "iconName", label: "Nama Ikon (Lucide)", required: true, placeholder: "Contoh: Monitor, Code..." },
    ],
  },

  portfolios: {
    collection: "portfolios",
    title: "Kelola Portofolio",
    description: "Daftar proyek dan karya terbaik yang sudah diselesaikan.",
    addLabel: "Tambah Portofolio",
    emptyIcon: "briefcase",
    emptyTitle: "Belum ada portofolio",
    emptySub: "Portofolio Anda akan ditampilkan di sini.",
    reorder: true,
    columns: [
      { label: "Gambar", kind: "img", key: "imageUrl", widthCls: "w-24" },
      { label: "Klien & Judul", kind: "title2", keys: ["clientName", "titleId"] },
      { label: "Kategori", kind: "pill", key: "category" },
    ],
    fields: () => [
      { type: "text", key: "titleId", label: "Judul (ID)", required: true, span: 1 },
      { type: "text", key: "titleEn", label: "Judul Proyek (EN)", required: true, span: 1 },
      { type: "text", key: "descId", label: "Deskripsi Singkat (ID)", required: true, span: 2 },
      { type: "text", key: "descEn", label: "Deskripsi Singkat (EN)", required: true, span: 2 },
      { type: "text", key: "imageUrl", label: "URL Gambar/Thumbnail", required: true, placeholder: "https://...", span: 2 },
      { type: "text", key: "category", label: "Kategori", required: true, placeholder: "Web, Mobile...", span: 1 },
      { type: "text", key: "clientName", label: "Nama Klien", required: true, span: 1 },
      { type: "text", key: "techStack", label: "Tech Stack (pisahkan dengan koma)", required: true, placeholder: "React, Node.js...", span: 2 },
    ],
  },

  pricingPlans: {
    collection: "pricingPlans",
    title: "Kelola Paket Harga",
    description: "Atur penawaran harga dan fitur yang ditampilkan di website.",
    addLabel: "Tambah Paket Baru",
    emptyIcon: "creditcard",
    emptyTitle: "Belum ada paket",
    emptySub: "Paket harga akan ditampilkan di sini.",
    reorder: true,
    columns: [
      { label: "Nama Paket", kind: "title2", keys: ["name", "type"] },
      { label: "Harga", kind: "text", key: "price" },
      {
        label: "Status Populer",
        kind: "badge",
        badgeKey: "isPopular",
        badgeMap: {
          true: { label: "Terpopuler", cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50" },
          false: { label: "Standar", cls: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700" },
        },
      },
    ],
    fields: () => [
      { type: "text", key: "name", label: "Nama Paket", required: true, placeholder: "contoh: Starter", span: 2 },
      { type: "text", key: "price", label: "Harga (Teks)", required: true, placeholder: "contoh: Rp 1.500.000", span: 1 },
      {
        type: "select", key: "type", label: "Tipe Layanan", span: 1,
        options: [
          { value: "template", label: "Template" },
          { value: "custom", label: "Custom" },
        ],
      },
      { type: "textarea", key: "featuresJson", label: "Fitur (JSON Array)", required: true, placeholder: '["Fitur 1", "Fitur 2"]', mono: true, span: 2 },
      {
        type: "select", key: "isPopular", label: "Status Populer", span: 2,
        options: [
          { value: "false", label: "Biasa / Standar" },
          { value: "true", label: "Ya, Jadikan Populer (Highlight)" },
        ],
        hint: "Paket populer akan lebih ditonjolkan secara visual di website.",
      },
    ],
  },

  testimonials: {
    collection: "testimonials",
    title: "Kelola Testimoni",
    description: "Tambahkan ulasan dan pendapat dari klien Anda.",
    addLabel: "Tambah Testimoni",
    emptyIcon: "star",
    emptyTitle: "Belum ada testimoni",
    emptySub: "Ulasan dari klien Anda akan ditampilkan di sini.",
    reorder: true,
    columns: [
      { label: "Avatar", kind: "img", key: "avatarUrl", widthCls: "w-16", round: true },
      { label: "Klien", kind: "title2", keys: ["clientName", "role"] },
      { label: "Ulasan", kind: "text", key: "contentId", truncate: true },
    ],
    fields: () => [
      { type: "text", key: "clientName", label: "Nama Klien", required: true },
      { type: "text", key: "role", label: "Peran/Jabatan", required: true },
      { type: "textarea", key: "contentId", label: "Isi Testimoni (ID)", required: true, rows: 4 },
      { type: "textarea", key: "contentEn", label: "Isi Testimoni (EN)", required: true, rows: 4 },
      { type: "text", key: "avatarUrl", label: "URL Avatar", required: true, placeholder: "https://..." },
    ],
  },

  faqs: {
    collection: "faqs",
    title: "Kelola FAQ",
    description: "Atur daftar pertanyaan yang sering diajukan beserta jawabannya.",
    addLabel: "Tambah FAQ Baru",
    emptyIcon: "helpcircle",
    emptyTitle: "Belum ada FAQ",
    emptySub: "Silakan tambah FAQ baru melalui form di atas.",
    reorder: true,
    columns: [
      { label: "Pertanyaan (ID)", kind: "text", key: "questionId" },
      { label: "Pratinjau Jawaban", kind: "text", key: "answerId", truncate: true },
    ],
    fields: () => [
      { type: "text", key: "questionId", label: "Pertanyaan (ID)", required: true },
      { type: "text", key: "questionEn", label: "Pertanyaan (EN)", required: true },
      { type: "textarea", key: "answerId", label: "Jawaban (ID)", required: true, rows: 4 },
      { type: "textarea", key: "answerEn", label: "Jawaban (EN)", required: true, rows: 4 },
      { type: "number", key: "orderIdx", label: "Urutan Tampil", value: 0 },
    ],
  },

  clientLogos: {
    collection: "clientLogos",
    title: "Kelola Logo Klien",
    description: "Tambahkan logo klien atau logo teknologi yang digunakan.",
    addLabel: "Tambah Logo",
    emptyIcon: "image",
    emptyTitle: "Belum ada logo",
    emptySub: "Logo klien akan ditampilkan di sini.",
    reorder: true,
    toggleField: "isActive",
    columns: [
      { label: "Preview", kind: "img", key: "logoUrl", widthCls: "w-24", contain: true },
      { label: "Nama", kind: "text", key: "name" },
      {
        label: "Status",
        kind: "badge",
        badgeKey: "isActive",
        badgeMap: {
          true: { label: "Aktif", cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50" },
          false: { label: "Nonaktif", cls: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700" },
        },
      },
    ],
    fields: () => [
      { type: "text", key: "name", label: "Nama Klien / Teknologi", required: true },
      { type: "text", key: "logoUrl", label: "URL Gambar Logo", required: true, placeholder: "https://..." },
    ],
  },

  stats: {
    collection: "stats",
    title: "Kelola Statistik",
    description: "Data metrik yang muncul di bagian statistik website.",
    addLabel: "Tambah Statistik",
    emptyIcon: "barchart",
    emptyTitle: "Belum ada statistik",
    emptySub: "Data statistik akan ditampilkan di sini.",
    reorder: true,
    columns: [
      { label: "Nilai", kind: "accent", key: "value" },
      { label: "Label", kind: "title2", keys: ["labelId", "labelEn"] },
    ],
    fields: () => [
      { type: "text", key: "labelId", label: "Label (ID)", required: true },
      { type: "text", key: "labelEn", label: "Label (EN)", required: true },
      { type: "text", key: "value", label: "Nilai (contoh: 100+)", required: true },
      { type: "number", key: "orderIdx", label: "Urutan Tampil", value: 0 },
    ],
  },

  posts: {
    collection: "posts",
    title: "Kelola Blog & Artikel",
    description: "Tulis dan kelola konten blog untuk meningkatkan SEO website.",
    addLabel: "Tulis Artikel Baru",
    emptyIcon: "bookopen",
    emptyTitle: "Belum ada artikel",
    emptySub: "Mulai tulis artikel pertama Anda.",
    toggleField: "isPublished",
    columns: [
      { label: "Judul Artikel", kind: "title2", keys: ["titleId", "slug"], secondaryCls: "text-xs text-zinc-400 font-mono", prefix: "/" },
      { label: "Kategori", kind: "pill", key: "category", capitalize: true },
      {
        label: "Status",
        kind: "badge",
        badgeKey: "isPublished",
        badgeMap: {
          true: { label: "Terbit", cls: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400" },
          false: { label: "Draft", cls: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400" },
        },
      },
      { label: "Tanggal", kind: "date", key: "createdAt" },
    ],
    fields: () => [
      { type: "text", key: "slug", label: "Slug URL", required: true, placeholder: "contoh: cara-buat-website", span: 2 },
      { type: "text", key: "titleId", label: "Judul (Indonesia)", required: true, span: 1 },
      { type: "text", key: "titleEn", label: "Judul (English)", required: true, span: 1 },
      { type: "textarea", key: "excerptId", label: "Ringkasan (ID)", required: true, rows: 2, span: 1 },
      { type: "textarea", key: "excerptEn", label: "Ringkasan (EN)", required: true, rows: 2, span: 1 },
      { type: "textarea", key: "contentId", label: "Konten Artikel (Markdown - Indonesia)", required: true, rows: 6, mono: true, span: 2 },
      { type: "textarea", key: "contentEn", label: "Konten Artikel (Markdown - English)", required: true, rows: 6, mono: true, span: 2 },
      { type: "text", key: "coverImageUrl", label: "URL Gambar Cover", required: true, placeholder: "https://...", span: 2 },
      {
        type: "select", key: "category", label: "Kategori", span: 1,
        options: [
          { value: "tips", label: "Tips & Trik" },
          { value: "tutorial", label: "Tutorial" },
          { value: "bisnis", label: "Bisnis" },
          { value: "desain", label: "Desain" },
          { value: "teknologi", label: "Teknologi" },
        ],
      },
      { type: "text", key: "tags", label: "Tags (JSON Array)", mono: true, span: 1, placeholder: '["SEO", "Website"]' },
      {
        type: "select", key: "isPublished", label: "Status Publikasi", span: 2,
        options: [
          { value: "false", label: "Draft – Belum Dipublikasikan" },
          { value: "true", label: "Publish – Tampilkan ke Publik" },
        ],
      },
    ],
  },

  clients: {
    collection: "clients",
    title: "Kelola Klien Portal",
    description: "Buat dan kelola akun klien untuk Client Portal.",
    addLabel: "Tambah Klien",
    emptyIcon: "users",
    emptyTitle: "Belum ada klien",
    emptySub: "Tambah akun klien untuk Client Portal.",
    columns: [
      { label: "Nama Klien", kind: "text", key: "name" },
      { label: "Email", kind: "text", key: "email" },
      { label: "Perusahaan", kind: "text", key: "company" },
      { label: "WhatsApp", kind: "text", key: "phone" },
    ],
    fields: () => [
      { type: "text", key: "name", label: "Nama Lengkap", required: true, span: 1 },
      { type: "text", key: "email", label: "Email", required: true, span: 1 },
      { type: "text", key: "company", label: "Perusahaan", span: 1 },
      { type: "text", key: "phone", label: "No. WhatsApp", span: 1 },
      { type: "password", key: "password", label: "Password", span: 2, placeholder: "Buat password" },
    ],
  },

  projects: {
    collection: "projects",
    title: "Kelola Proyek Klien",
    description: "Update progres dan fase pengerjaan proyek untuk setiap klien.",
    addLabel: "Tambah Proyek",
    emptyIcon: "folderopen",
    emptyTitle: "Belum ada proyek",
    emptySub: "Tambahkan proyek untuk klien Anda.",
    columns: [
      { label: "Judul Proyek", kind: "title2", keys: ["title", "phase"], secondaryCls: "text-xs text-zinc-500 capitalize" },
      { label: "Klien", kind: "text", key: "_client" },
      { label: "Status", kind: "badge", badgeKey: "status", badgeMap: {
          pending: { label: "Menunggu", cls: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400" },
          in_progress: { label: "Dikerjakan", cls: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400" },
          review: { label: "Review", cls: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400" },
          done: { label: "Selesai", cls: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400" },
        } },
      { label: "Progres", kind: "progress", key: "progressPercent" },
    ],
    fields: (ctx) => [
      {
        type: "select", key: "clientId", label: "Klien", required: true, span: 2,
        options: ((ctx.clients as { id: string; name: string }[]) ?? []).map((c) => ({ value: c.id, label: c.name })),
      },
      { type: "text", key: "title", label: "Judul Proyek", required: true, placeholder: "contoh: Website Company Profile PT. ABC", span: 2 },
      { type: "textarea", key: "description", label: "Deskripsi Singkat", required: true, rows: 2, span: 2 },
      {
        type: "select", key: "status", label: "Status", span: 1,
        options: [
          { value: "pending", label: "Menunggu" },
          { value: "in_progress", label: "Dikerjakan" },
          { value: "review", label: "Review" },
          { value: "done", label: "Selesai" },
        ],
      },
      {
        type: "select", key: "phase", label: "Fase Saat Ini", span: 1,
        options: [
          { value: "desain", label: "Desain" },
          { value: "development", label: "Development" },
          { value: "testing", label: "Testing" },
          { value: "launch", label: "Launch" },
        ],
      },
      { type: "number", key: "progressPercent", label: "Progres (%)", min: 0, max: 100, span: 1 },
      { type: "date", key: "startedAt", label: "Tanggal Mulai", span: 1 },
      { type: "date", key: "deliveredAt", label: "Estimasi Selesai", span: 2 },
      { type: "textarea", key: "notes", label: "Catatan untuk Klien", rows: 3, placeholder: "Update terkini, atau hal yang perlu diketahui klien...", span: 2 },
    ],
    extraActions: (row, ctx) => (
      <ProjectAssetsDialog
        projectId={row.id}
        projectTitle={row.title}
        existingAssets={(ctx.assets as Record<string, unknown>[])?.filter((a) => a.projectId === row.id) ?? []}
      />
    ),
  },

  invoices: {
    collection: "invoices",
    title: "Sistem Tagihan (Invoice)",
    description: "Kelola tagihan proyek dan status pembayaran klien.",
    addLabel: "Buat Tagihan",
    emptyIcon: "filetext",
    emptyTitle: "Belum ada tagihan",
    emptySub: "Buat tagihan baru melalui tombol Buat Tagihan.",
    columns: [
      { label: "Deskripsi Tagihan", kind: "text", key: "description" },
      { label: "Klien / Proyek", kind: "title2", keys: ["_client", "_project"] },
      { label: "Nominal", kind: "amount", key: "amount" },
      { label: "Tgl. Jatuh Tempo", kind: "date", key: "dueDate" },
      { label: "Status", kind: "badge", badgeKey: "status", badgeMap: {
          unpaid: { label: "Belum Lunas", cls: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400" },
          paid: { label: "Lunas", cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400" },
          overdue: { label: "Jatuh Tempo", cls: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400" },
        } },
    ],
    fields: (ctx) => {
      const options = ((ctx.projectOptions as { id: string; title: string; clientName: string }[]) ?? []).map((p) => ({
        value: p.id,
        label: `${p.title} (${p.clientName})`,
      }));
      return [
        { type: "select", key: "projectId", label: "Proyek", required: true, options, span: 2 },
        { type: "text", key: "description", label: "Deskripsi / Judul Tagihan", required: true, placeholder: "Cth: DP 50% Website Profile", span: 2 },
        { type: "amount", key: "amount", label: "Jumlah (Rp)", required: true, span: 2 },
        { type: "date", key: "dueDate", label: "Jatuh Tempo", required: true, span: 2 },
        {
          type: "select", key: "status", label: "Status Pembayaran", editOnly: true, span: 2,
          options: [
            { value: "unpaid", label: "Belum Dibayar (Unpaid)" },
            { value: "paid", label: "Lunas (Paid)" },
            { value: "overdue", label: "Terlambat (Overdue)" },
          ],
        },
      ];
    },
  },

  tickets: {
    collection: "tickets",
    title: "Tiket Bantuan (Support)",
    description: "Kelola pertanyaan, keluhan, atau revisi dari klien.",
    emptyIcon: "lifebuoy",
    emptyTitle: "Belum ada tiket bantuan.",
    emptySub: "Tiket dari klien akan muncul di sini.",
    resolveStatus: "resolved",
    columns: [
      { label: "Klien", kind: "title2", keys: ["_client", "_date"], secondaryCls: "text-xs text-zinc-500 mt-1" },
      { label: "Subjek & Pesan", kind: "title2", keys: ["subject", "message"], secondaryCls: "text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap max-w-lg line-clamp-3" },
      { label: "Status", kind: "badge", badgeKey: "status", badgeMap: {
          open: { label: "Menunggu (Open)", cls: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400" },
          resolved: { label: "Selesai (Resolved)", cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400" },
        } },
    ],
    fields: () => [],
  },
};

export const EMPTY_ICONS = {
  settings: "Settings",
  briefcase: "Briefcase",
  creditcard: "CreditCard",
  star: "Star",
  helpcircle: "HelpCircle",
  image: "Image",
  barchart: "BarChart3",
  bookopen: "BookOpen",
  users: "Users",
  folderopen: "FolderOpen",
  filetext: "FileText",
  lifebuoy: "LifeBuoy",
} as const;