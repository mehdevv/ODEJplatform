import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadMedia } from "@/lib/api";
import { Image as ImageIcon } from "lucide-react";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploadField({
  value,
  onChange,
  label = "صورة",
}: ImageUploadFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadMedia();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const url = reader.result as string;
      try {
        const media = await uploadMutation.mutateAsync({
          data: {
            name: file.name,
            url,
            type: "image",
            alt: file.name,
          },
        });
        onChange(media.url);
      } catch {
        onChange(url);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/..."
          dir="ltr"
          className="flex-1"
        />
        <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {value && (
        <img src={value} alt="" className="h-24 rounded border object-cover" />
      )}
    </div>
  );
}
