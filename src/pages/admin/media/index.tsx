import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListMedia, useUploadMedia, useDeleteMedia } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Copy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminMedia() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { data: res, isLoading } = useListMedia({ search, limit: 48 });
  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMedia();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          await uploadMutation.mutateAsync({
            data: {
              name: file.name,
              url: reader.result as string,
              type: file.type.includes("pdf") ? "pdf" : "image",
            },
          });
          toast({ title: `تم رفع ${file.name}` });
        } catch {
          toast({ title: "فشل الرفع", variant: "destructive" });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "تم نسخ الرابط" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <h1 className="text-2xl font-bold">مكتبة الوسائط</h1>
          <div className="flex gap-2">
            <Input
              placeholder="بحث..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={() => fileRef.current?.click()} className="gap-2">
              <Upload className="h-4 w-4" /> رفع
            </Button>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {res?.data.map((m) => (
              <div key={m.id} className="border rounded-lg overflow-hidden group relative">
                {m.type === "image" ? (
                  <img src={m.url} alt={m.alt ?? m.name} className="w-full h-28 object-cover" />
                ) : (
                  <div className="h-28 flex items-center justify-center bg-gray-100 text-sm">
                    PDF
                  </div>
                )}
                <div className="p-2 text-xs truncate">{m.name}</div>
                <div className="absolute top-1 end-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => copyUrl(m.url)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-7 w-7"
                    onClick={async () => {
                      if (confirm("حذف؟")) {
                        await deleteMutation.mutateAsync(m.id);
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
