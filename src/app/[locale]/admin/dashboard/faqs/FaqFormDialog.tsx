'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Edit } from 'lucide-react';
import { saveFaqAction } from '../../actions';

type FaqFormDialogProps = {
  editItem?: { id: string; questionId: string; questionEn: string; answerId: string; answerEn: string; orderIdx: number };
};

export default function FaqFormDialog({ editItem }: FaqFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await saveFaqAction(formData);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          editItem ? (
            <Button variant="ghost" size="sm" title="Edit" className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30" />
          ) : (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2" />
          )
        }
      >
        {editItem ? (
          <>
            <Edit className="w-4 h-4" />
            <span className="sr-only">Edit</span>
          </>
        ) : (
          <>
            <PlusCircle className="w-4 h-4" />
            Tambah FAQ Baru
          </>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit FAQ' : 'Tambah FAQ Baru'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto px-1">
          <input type="hidden" name="isEdit" value={editItem ? 'true' : 'false'} />
          {editItem && <input type="hidden" name="id" value={editItem.id} />}
          
          <div className="space-y-2">
            <Label htmlFor="questionId">Pertanyaan (ID)</Label>
            <Input id="questionId" name="questionId" defaultValue={editItem?.questionId || ''} className="border-zinc-200 dark:border-zinc-800" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="questionEn">Pertanyaan (EN)</Label>
            <Input id="questionEn" name="questionEn" defaultValue={editItem?.questionEn || ''} className="border-zinc-200 dark:border-zinc-800" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="answerId">Jawaban (ID)</Label>
            <Textarea id="answerId" name="answerId" defaultValue={editItem?.answerId || ''} className="border-zinc-200 dark:border-zinc-800 resize-none h-24" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="answerEn">Jawaban (EN)</Label>
            <Textarea id="answerEn" name="answerEn" defaultValue={editItem?.answerEn || ''} className="border-zinc-200 dark:border-zinc-800 resize-none h-24" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orderIdx">Urutan Tampil</Label>
            <Input type="number" id="orderIdx" name="orderIdx" defaultValue={editItem?.orderIdx ?? '0'} className="border-zinc-200 dark:border-zinc-800" required />
          </div>
          
          <Button type="submit" disabled={loading} className={`w-full text-white mt-4 ${editItem ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {loading ? 'Menyimpan...' : (editItem ? 'Simpan Perubahan' : 'Simpan FAQ')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
