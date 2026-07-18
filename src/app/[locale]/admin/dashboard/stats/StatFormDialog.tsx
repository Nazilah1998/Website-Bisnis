"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Edit } from "lucide-react";
import { saveStatAction } from "../../actions";

type StatFormDialogProps = {
  editItem?: {
    id: string;
    labelId: string;
    labelEn: string;
    value: string;
    orderIdx: number;
  };
};

export default function StatFormDialog({ editItem }: StatFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await saveStatAction(formData);
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
            <Button
              variant="ghost"
              size="sm"
              title="Edit"
              className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
            />
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
            Tambah Statistik
          </>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editItem ? "Edit Statistik" : "Tambah Statistik"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 py-4 max-h-[70vh] overflow-y-auto px-1"
        >
          <input
            type="hidden"
            name="isEdit"
            value={editItem ? "true" : "false"}
          />
          {editItem && <input type="hidden" name="id" value={editItem.id} />}

          <div className="space-y-2">
            <Label htmlFor="labelId">
              Label (ID)
            </Label>
            <Input
              id="labelId"
              name="labelId"
              defaultValue={editItem?.labelId || ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="labelEn">
              Label (EN)
            </Label>
            <Input
              id="labelEn"
              name="labelEn"
              defaultValue={editItem?.labelEn || ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">
              Nilai (contoh: 100+)
            </Label>
            <Input
              id="value"
              name="value"
              defaultValue={editItem?.value || ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orderIdx">
              Urutan Tampil
            </Label>
            <Input
              type="number"
              id="orderIdx"
              name="orderIdx"
              defaultValue={editItem?.orderIdx ?? "0"}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`w-full text-white mt-4 ${editItem ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading
              ? "Menyimpan..."
              : editItem
                ? "Simpan Perubahan"
                : "Simpan Statistik"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
