import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileText, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ClubAgreementUpload } from "@/lib/api";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp";

interface AgreementUploadFieldProps {
  value: ClubAgreementUpload | null;
  onChange: (file: ClubAgreementUpload | null) => void;
  onFileError?: (message: string) => void;
  disabled?: boolean;
  error?: string;
}

export function AgreementUploadField({
  value,
  onChange,
  onFileError,
  disabled,
  error,
}: AgreementUploadFieldProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) {
      onChange(null);
      return;
    }
    if (file.size > MAX_BYTES) {
      onChange(null);
      onFileError?.(t("club.agreementTooLarge"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onChange({
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        dataUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <Label>{t("club.agreementLabel")}</Label>
      <p className="text-xs text-muted-foreground">{t("club.agreementHint")}</p>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      {value ? (
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-primary/5 border-primary/20">
          <FileText className="h-8 w-8 text-primary shrink-0" />
          <div className="flex-1 min-w-0 text-start">
            <p className="text-sm font-medium truncate" dir="ltr">
              {value.fileName}
            </p>
            <p className="text-xs text-muted-foreground">{t("club.agreementReady")}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            onClick={() => {
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            aria-label={t("club.agreementRemove")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full h-24 border-dashed border-2 flex flex-col gap-2"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <span className="text-sm">{t("club.agreementChoose")}</span>
        </Button>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function openAgreementDocument(profile: {
  agreementDataUrl?: string;
  agreementFileName?: string;
}) {
  if (!profile.agreementDataUrl) return;
  const w = window.open(profile.agreementDataUrl, "_blank");
  if (!w && profile.agreementFileName) {
    const a = document.createElement("a");
    a.href = profile.agreementDataUrl;
    a.download = profile.agreementFileName;
    a.click();
  }
}
