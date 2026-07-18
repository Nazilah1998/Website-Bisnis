'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileUp, Link as LinkIcon, Trash2 } from 'lucide-react';
import { addProjectAssetAction, deleteProjectAssetAction } from './assetActions';

type Asset = { id: string; fileName: string; fileUrl: string; uploadedAt: Date };

export default function ProjectAssetsDialog({ projectId, projectTitle, existingAssets }: { projectId: string; projectTitle: string; existingAssets: Asset[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState(existingAssets);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append('projectId', projectId);
    
    const res = await addProjectAssetAction(formData);
    setLoading(false);
    if (res.success) {
      toast.success(res.message);
      // Optimistic update
      setAssets([...assets, {
        id: crypto.randomUUID(),
        fileName: formData.get('fileName') as string,
        fileUrl: formData.get('fileUrl') as string,
        uploadedAt: new Date()
      }]);
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(res.error);
    }
  };

  const handleDelete = async (assetId: string) => {
    if (!confirm('Hapus aset ini?')) return;
    const res = await deleteProjectAssetAction(assetId);
    if (res.success) {
      toast.success(res.message);
      setAssets(assets.filter(a => a.id !== assetId));
    } else {
      toast.error(res.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={<Button variant="ghost" size="sm" className="text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30" title="Kelola Aset (File)" />}
      >
        <FileUp className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>File Master & Aset</DialogTitle>
          <p className="text-sm text-zinc-500">Kirim file atau tautan dokumen untuk proyek: <strong>{projectTitle}</strong></p>
        </DialogHeader>
        
        <div className="space-y-6 py-2">
          {/* List existing */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Aset Tersimpan ({assets.length})</h4>
            {assets.length === 0 ? (
              <p className="text-xs text-zinc-400 italic bg-zinc-900/50 p-3 rounded-lg border border-dashed border-zinc-800 text-center">Belum ada aset ditambahkan.</p>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {assets.map(a => (
                  <li key={a.id} className="flex items-center justify-between p-2 rounded-lg border border-zinc-800 bg-zinc-900/50">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <LinkIcon className="w-4 h-4 text-zinc-400 shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-medium truncate">{a.fileName}</p>
                        <a href={a.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline truncate inline-block w-48">{a.fileUrl}</a>
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleDelete(a.id)} className="text-red-500 hover:bg-red-950/30 h-8 w-8">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-zinc-800 my-2" />

          {/* Add form */}
          <form onSubmit={handleAdd} className="space-y-4">
            <h4 className="text-sm font-semibold mb-2">Tambah Aset Baru</h4>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama File / Dokumen</label>
              <Input name="fileName" required placeholder="Cth: Source Code Lengkap (ZIP)" className="border-zinc-800" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tautan (URL GDrive / Figma / Dropbox)</label>
              <Input name="fileUrl" type="url" required placeholder="https://..." className="border-zinc-800" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-4">
              {loading ? 'Menyimpan...' : 'Tambahkan Tautan'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
