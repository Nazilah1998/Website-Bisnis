import { useState } from "react";
import { toast } from "sonner";
import { post, del, type MessageResult } from "@/lib/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { FileUp, Link as LinkIcon, Trash2 } from "lucide-react";

interface Asset {
  id: string;
  projectId?: string;
  fileName: string;
  fileUrl: string;
  uploadedAt?: string | null;
}

interface Props {
  projectId: string;
  projectTitle: string;
  existingAssets: Asset[];
}

export default function ProjectAssetsDialog({ projectId, projectTitle, existingAssets }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<Asset[]>(existingAssets);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("projectId", projectId);
    formData.append("isEdit", "false");

    try {
      const res = await post<MessageResult & { id?: string }>("/api/admin/projectAssets", Object.fromEntries(formData));
      toast.success(res.message ?? "Aset berhasil ditambahkan");
      setAssets((prev) => [
        ...prev,
        {
          id: res.id ?? crypto.randomUUID(),
          projectId,
          fileName: String(formData.get("fileName") ?? ""),
          fileUrl: String(formData.get("fileUrl") ?? ""),
          uploadedAt: new Date().toISOString(),
        },
      ]);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menambah aset");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assetId: string) => {
    if (!confirm("Hapus aset ini?")) return;
    try {
      const res = await del<MessageResult>(`/api/admin/projectAssets/${assetId}`);
      toast.success(res.message ?? "Aset berhasil dihapus");
      setAssets((prev) => prev.filter((a) => a.id !== assetId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus aset");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="sm" className="text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30" title="Kelola Aset (File)" />}>
        <FileUp className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>File Master & Aset</DialogTitle>
          <p className="text-sm text-zinc-500">Kirim file atau tautan dokumen untuk proyek: <strong>{projectTitle}</strong></p>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Aset Tersimpan ({assets.length})</h4>
            {assets.length === 0 ? (
              <p className="text-xs text-zinc-400 italic bg-zinc-100 dark:bg-zinc-900 p-3 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 text-center">Belum ada aset ditambahkan.</p>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {assets.map((a) => (
                  <li key={a.id} className="flex items-center justify-between p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <LinkIcon className="w-4 h-4 text-zinc-400 shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-medium truncate">{a.fileName}</p>
                        <a href={a.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline truncate inline-block w-48">{a.fileUrl}</a>
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleDelete(a.id)} className="text-red-500 hover:bg-red-100 dark:hover:bg-red-950/30 h-8 w-8">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 my-2" />

          <form onSubmit={handleAdd} className="space-y-4">
            <h4 className="text-sm font-semibold mb-2">Tambah Aset Baru</h4>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama File / Dokumen</label>
              <Input name="fileName" required placeholder="Cth: Source Code Lengkap (ZIP)" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tautan (URL GDrive / Figma / Dropbox)</label>
              <Input name="fileUrl" type="url" required placeholder="https://..." />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-4">
              {loading ? "Menyimpan..." : "Tambahkan Tautan"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}