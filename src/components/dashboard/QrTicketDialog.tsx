import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import type { Registration } from "@/lib/api/types";

interface QrTicketDialogProps {
  registration: Registration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QrTicketDialog({
  registration,
  open,
  onOpenChange,
}: QrTicketDialogProps) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!registration?.qrCode || !open) return;
    QRCode.toDataURL(registration.qrCode, { width: 220, margin: 2 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [registration?.qrCode, open]);

  const handleCopy = async () => {
    if (!registration?.qrCode) return;
    await navigator.clipboard.writeText(registration.qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!registration) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle>تذكرة الدخول</DialogTitle>
        </DialogHeader>
        <p className="font-bold text-lg text-gray-900">{registration.eventTitle}</p>
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="رمز QR للتذكرة"
            className="mx-auto rounded-lg border p-2 bg-white"
          />
        ) : (
          <div className="h-[220px] w-[220px] mx-auto bg-gray-100 animate-pulse rounded-lg" />
        )}
        <p className="font-mono text-sm text-muted-foreground break-all">
          {registration.qrCode}
        </p>
        <Button variant="outline" onClick={handleCopy} className="gap-2">
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          نسخ الرمز
        </Button>
      </DialogContent>
    </Dialog>
  );
}
