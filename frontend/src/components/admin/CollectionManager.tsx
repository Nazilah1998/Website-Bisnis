import { useState } from "react";
import { toast } from "sonner";
import type { Locale } from "@/i18n/ui";
import { post, put, del, toDate, type MessageResult } from "@/lib/api";
import { META, type CollectionMeta, type Field, type Column } from "@/lib/adminMeta";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DatePicker } from "../ui/date-picker";
import { Table, TableHead, TableHeader, TableRow } from "../ui/table";
import { SortableTableBody } from "../ui/SortableTableBody";
import { SortableTableRow } from "../ui/SortableTableRow";
import { PlusCircle, Edit, Trash2, RefreshCcw, CheckCircle, Eye, EyeOff, Settings, Briefcase, CreditCard, Star, HelpCircle, Image, BarChart3, BookOpen, Users, FolderOpen, FileText, LifeBuoy } from "lucide-react";

export type Row = Record<string, unknown> & { id: string };

interface Props {
  lang: Locale;
  collection: string;
  rows: Row[];
  ctx?: Record<string, unknown>;
}

const EMPTY_ICON_MAP: Record<string, typeof Settings> = {
  settings: Settings,
  briefcase: Briefcase,
  creditcard: CreditCard,
  star: Star,
  helpcircle: HelpCircle,
  image: Image,
  barchart: BarChart3,
  bookopen: BookOpen,
  users: Users,
  folderopen: FolderOpen,
  filetext: FileText,
  lifebuoy: LifeBuoy,
};

function toBool(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true" || value === "1";
  if (typeof value === "number") return value === 1;
  return fallback;
}

function formatDate(value?: unknown): string {
  const d = toDate(typeof value === "string" ? value : undefined);
  if (!d) return "-";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function CellContent({ col, row, meta, ctx }: { col: Column; row: Row; meta: CollectionMeta; ctx: Record<string, unknown> }) {
  const value = col.key ? row[col.key] : undefined;
  const valueOf = (key?: string) => (key ? row[key] : undefined);

  switch (col.kind) {
    case "text": {
      const text = value == null ? "-" : String(value);
      return (
        <div className={`text-sm ${col.truncate ? "truncate max-w-[200px] text-zinc-500 dark:text-zinc-400" : "text-zinc-600 dark:text-zinc-400"}`} title={col.truncate ? text : undefined}>
          {text}
        </div>
      );
    }
    case "title2": {
      const primary = valueOf(col.keys?.[0]);
      const secondary = valueOf(col.keys?.[1]);
      return (
        <div>
          <div className="font-semibold text-zinc-900 dark:text-zinc-100">{primary == null ? "-" : String(primary)}</div>
          {secondary != null && String(secondary) !== "" && (
            <div className={`text-sm text-zinc-500 dark:text-zinc-400 ${col.secondaryCls ?? ""}`}>
              {col.prefix ?? ""}
              {col.truncate ? <span className="truncate block max-w-[280px]" title={String(secondary)}>{String(secondary)}</span> : String(secondary)}
            </div>
          )}
        </div>
      );
    }
    case "img": {
      const src = String(value ?? "");
      return (
        <div className={`${col.round ? "w-10 h-10 rounded-full" : "w-16 h-12 rounded-md rounded-lg overflow-hidden"} bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center ${col.contain ? "p-1" : ""}`}>
          {src ? <img src={src} alt={String(valueOf(col.keys?.[0]) ?? "")} className={`${col.round ? "w-full h-full object-cover" : "w-full h-full object-cover"} ${col.contain ? "object-contain" : ""}`} /> : null}
        </div>
      );
    }
    case "accent":
      return <div className="font-bold text-lg text-blue-600 dark:text-blue-400">{value == null ? "-" : String(value)}</div>;
    case "amount":
      return <div className="font-semibold text-zinc-900 dark:text-zinc-100">Rp {Number(value ?? 0).toLocaleString("id-ID")}</div>;
    case "date":
      return <div className="text-zinc-500 text-xs whitespace-nowrap">{formatDate(value)}</div>;
    case "progress": {
      const pct = Number(value ?? 0);
      return (
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs text-zinc-500">{pct}%</span>
        </div>
      );
    }
    case "pill": {
      const label = value == null ? "-" : String(value);
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 ${col.capitalize ? "capitalize" : ""}`}>
          {label}
        </span>
      );
    }
    case "badge": {
      const key = col.badgeKey ? String(row[col.badgeKey] ?? "") : "";
      const fallback = { label: String(row[col.badgeKey] ?? "-"), cls: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700" };
      const entry = col.badgeMap?.[key] ?? (col.badgeMap ? fallback : undefined);
      if (!entry) return <div className="text-sm text-zinc-500">{String(row[col.badgeKey] ?? "-")}</div>;
      return <Badge variant="outline" className={entry.cls}>{entry.label}</Badge>;
    }
    default:
      return null;
  }
}

function FormField({ field, editItem, ctx }: { field: Field; editItem: Row | null; ctx: Record<string, unknown> }) {
  const [showPassword, setShowPassword] = useState(false);
  const isEdit = editItem != null;
  if (field.editOnly && !isEdit) return null;
  const value = isEdit ? (editItem[field.key] as string | number | null | undefined) : undefined;
  const spanCls = `md:col-span-${field.span ?? 1} space-y-1.5`;
  const baseInput = "h-10";

  switch (field.type) {
    case "text":
      return (
        <div className={spanCls}>
          <Label htmlFor={field.key}>{field.label}</Label>
          <Input
            id={field.key}
            name={field.key}
            type="text"
            defaultValue={value == null ? "" : String(value)}
            readOnly={field.readonlyOnEdit && isEdit}
            required={field.required && !(field.readonlyOnEdit && isEdit)}
            placeholder={field.placeholder ?? (field.mono ? '["..." ]' : "")}
            className={`${baseInput} ${field.mono ? "font-mono text-sm" : ""} ${field.readonlyOnEdit && isEdit ? "opacity-70 cursor-not-allowed" : ""}`}
          />
        </div>
      );
    case "password":
      return (
        <div className={spanCls}>
          <Label htmlFor={field.key}>{field.label}{isEdit ? " (kosongkan jika tidak diubah)" : ""}</Label>
          <div className="relative">
            <Input
              id={field.key}
              name={field.key}
              type={showPassword ? "text" : "password"}
              defaultValue={value == null ? "" : String(value)}
              required={field.required && !isEdit}
              placeholder={isEdit ? "Kosongkan jika tidak diubah" : field.placeholder}
              className="pr-10 h-10"
            />
            <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-10 w-10 text-zinc-400 hover:text-zinc-600" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      );
    case "textarea":
      return (
        <div className={spanCls}>
          <Label htmlFor={field.key}>{field.label}</Label>
          <Textarea
            id={field.key}
            name={field.key}
            defaultValue={value == null ? "" : String(value)}
            required={field.required}
            rows={field.rows ?? 4}
            placeholder={field.placeholder ?? ""}
            className={`${field.mono ? "font-mono text-sm" : ""} resize-none`}
          />
        </div>
      );
    case "number":
      return (
        <div className={spanCls}>
          <Label htmlFor={field.key}>{field.label}</Label>
          <Input
            id={field.key}
            name={field.key}
            type="number"
            min={field.min}
            max={field.max}
            defaultValue={value == null ? String(field.value ?? 0) : String(value)}
            required={field.required}
            className={baseInput}
          />
        </div>
      );
    case "select": {
      const [val, setVal] = useState<string>(() => {
        if (value != null) return String(value);
        if (field.options.length > 0 && field.key !== "clientId" && field.key !== "projectId") return field.options[0].value;
        return "";
      });
      return (
        <div className={spanCls}>
          <Label htmlFor={field.key}>{field.label}</Label>
          <input type="hidden" name={field.key} value={val} />
          <Select value={val} onValueChange={(v) => setVal(String(v))}>
            <SelectTrigger className="w-full" id={field.key}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.hint && <p className="text-xs text-zinc-500 mt-1">{field.hint}</p>}
        </div>
      );
    }
    case "date":
      return (
        <div className={spanCls}>
          <Label>{field.label}</Label>
          <DatePicker name={field.key} defaultValue={value ? String(value) : ""} required={field.required} />
        </div>
      );
    case "amount": {
      const [display, setDisplay] = useState(() => (value ? Number(value).toLocaleString("id-ID") : ""));
      return (
        <div className={spanCls}>
          <Label>{field.label}</Label>
          <input type="hidden" name={field.key} value={display.replace(/\./g, "")} />
          <Input
            type="text"
            value={display}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              setDisplay(raw ? Number(raw).toLocaleString("id-ID") : "");
            }}
            required={field.required}
            placeholder="5.000.000"
          />
        </div>
      );
    }
    default:
      return null;
  }
}

export default function CollectionManager({ lang, collection, rows, ctx = {} }: Props) {
  const meta = META[collection];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Row | null>(null);
  const [loading, setLoading] = useState(false);

  const fields = meta.fields(ctx).filter((f) => !(f.editOnly && editItem == null));

  const openCreate = () => {
    setEditItem(null);
    setDialogOpen(true);
  };
  const openEdit = (row: Row) => {
    setEditItem(row);
    setDialogOpen(true);
  };

  const handleDelete = async (row: Row) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${meta.title.toLowerCase()} ini?`)) return;
    try {
      const res = await del<MessageResult>(`/api/admin/${meta.collection}/${row.id}`);
      toast.success(res.message ?? "Data dihapus!");
      setTimeout(() => window.location.reload(), 400);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus data");
    }
  };

  const handleToggle = async (row: Row) => {
    try {
      const res = await put<MessageResult>(`/api/admin/${meta.collection}/${row.id}/toggle`, { field: meta.toggleField });
      toast.success(res.message ?? "Status diperbarui!");
      setTimeout(() => window.location.reload(), 400);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal update status");
    }
  };

  const handleResolve = async (row: Row) => {
    if (!confirm("Tandai tiket ini sebagai selesai (resolved)?")) return;
    try {
      const res = await put<MessageResult>(`/api/admin/${meta.collection}/${row.id}/status`, { status: meta.resolveStatus });
      toast.success(res.message ?? "Tiket ditandai selesai");
      setTimeout(() => window.location.reload(), 400);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal update status");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {};
    form.forEach((v, k) => (body[k] = v));
    body.isEdit = editItem != null;
    if (editItem) body.id = editItem.id;

    try {
      const res = await post<MessageResult>(`/api/admin/${meta.collection}`, body);
      toast.success(res.message ?? "Data disimpan!");
      setDialogOpen(false);
      setTimeout(() => window.location.reload(), 400);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  const onReorder = async (items: { id: string; orderIdx: number }[]) => {
    const res = await post<MessageResult>("/api/admin/reorder", { table: meta.collection, items });
    return { success: res.success };
  };

  const EmptyIcon = EMPTY_ICON_MAP[meta.emptyIcon];

  const hasGrip = meta.reorder || false;
  const renderCells = (row: Row) =>
    meta.columns.map((col) => (
      <TableCell key={col.label}>
        <CellContent col={col} row={row} meta={meta} ctx={ctx} />
      </TableCell>
    ));

  const renderActions = (row: Row) => (
    <TableCell className="text-right">
      <div className="flex items-center justify-end gap-1">
        {meta.extraActions?.(row, ctx)}
        {meta.toggleField && (
          <Button type="button" variant="ghost" size="sm" title="Ubah Status" className="text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30" onClick={() => handleToggle(row)}>
            <RefreshCcw className="w-4 h-4" />
            <span className="sr-only">Ubah Status</span>
          </Button>
        )}
        {meta.resolveStatus && row.status !== meta.resolveStatus && (
          <Button type="button" variant="outline" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 gap-1.5 h-8 text-xs font-medium border-emerald-200 dark:border-emerald-800" onClick={() => handleResolve(row)}>
            <CheckCircle className="w-3.5 h-3.5" /> Selesai
          </Button>
        )}
        <Button type="button" variant="ghost" size="sm" title="Edit" className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30" onClick={() => openEdit(row)}>
          <Edit className="w-4 h-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" title="Hapus" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => handleDelete(row)}>
          <Trash2 className="w-4 h-4" />
          <span className="sr-only">Hapus</span>
        </Button>
      </div>
    </TableCell>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{meta.title}</h1>
          <p className="text-sm text-zinc-500 mt-1">{meta.description}</p>
        </div>
        {meta.addLabel && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger render={<Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={openCreate}><PlusCircle className="w-4 h-4" /> {meta.addLabel}</Button>} />
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editItem ? "Edit Data" : meta.addLabel}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                <input type="hidden" name="isEdit" value={editItem ? "true" : "false"} />
                {editItem && <input type="hidden" name="id" value={editItem.id} />}
                {fields.map((field) => (
                  <FormField key={field.key + field.type} field={field} editItem={editItem} ctx={ctx} />
                ))}
                <Button type="submit" disabled={loading} className={`w-full text-white mt-2 md:col-span-2 ${editItem ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700"}`}>
                  {loading ? "Menyimpan..." : editItem ? "Simpan Perubahan" : "Simpan Data"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow className="border-zinc-200 dark:border-zinc-800">
                {hasGrip && <TableHead className="w-[40px]"></TableHead>}
                {meta.columns.map((col) => (
                  <TableHead key={col.label} className={`font-semibold text-zinc-600 dark:text-zinc-400 ${col.right ? "text-right" : ""} ${col.widthCls ?? ""}`}>
                    {col.label}
                  </TableHead>
                ))}
                <TableHead className="text-right font-semibold text-zinc-600 dark:text-zinc-400">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            {hasGrip ? (
              <SortableTableBody items={rows} onReorder={onReorder}>
                {rows.map((row) => (
                  <SortableTableRow id={row.id} key={row.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 transition-colors">
                    {renderCells(row)}
                    {renderActions(row)}
                  </SortableTableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow key="empty">
                    <TableCell colSpan={hasGrip ? 1 + meta.columns.length : meta.columns.length + 1} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center text-zinc-500">
                        <EmptyIcon className="w-12 h-12 mb-3 text-zinc-300 dark:text-zinc-700" />
                        <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">{meta.emptyTitle}</p>
                        <p className="text-sm">{meta.emptySub}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </SortableTableBody>
            ) : (
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    {renderCells(row)}
                    {renderActions(row)}
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={meta.columns.length + 1} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center text-zinc-500">
                        <EmptyIcon className="w-12 h-12 mb-3 text-zinc-300 dark:text-zinc-700" />
                        <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">{meta.emptyTitle}</p>
                        <p className="text-sm">{meta.emptySub}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </Table>
        </div>
      </div>
    </div>
  );
}