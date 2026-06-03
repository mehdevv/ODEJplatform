import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { usePageMetaI18n } from "@/hooks/usePageMetaI18n";
import { WILAYAS } from "@/data/wilayas";
import { AgreementUploadField } from "@/components/club/AgreementUploadField";
import type { ClubAgreementUpload } from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";

export default function RegisterClub() {
  const { t } = useTranslation();
  usePageMetaI18n("auth.registerClubTitle");
  const { registerClub } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [agreement, setAgreement] = useState<ClubAgreementUpload | null>(null);
  const [agreementError, setAgreementError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [form, setForm] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    password: "",
    phone: "",
    wilayaCode: "06",
    category: "association",
    address: "",
    registrationNumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAgreementError("");
    if (!agreement) {
      setAgreementError(t("club.agreementRequired"));
      return;
    }
    if (!acceptedTerms) {
      toast({
        title: t("common.error"),
        description: t("club.agreementTermsRequired"),
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const path = await registerClub({ ...form, agreement });
      toast({
        title: t("auth.registerClubSuccess"),
        description: t("club.pendingAfterRegister"),
      });
      setLocation(path);
    } catch (error: unknown) {
      toast({
        title: t("common.error"),
        description: error instanceof Error ? error.message : t("common.error"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <div className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50">
        <Card className="w-full max-w-xl shadow-xl border-t-4 border-accent border-2 border-primary">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              {t("auth.registerClubTitle")}
            </CardTitle>
            <CardDescription>{t("auth.registerClubSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{t("club.orgName")}</Label>
                <Input
                  required
                  value={form.organizationName}
                  onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("auth.fullName")}</Label>
                <Input
                  required
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("auth.email")}</Label>
                  <Input
                    type="email"
                    required
                    dir="ltr"
                    className="text-left"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("auth.password")}</Label>
                  <Input
                    type="password"
                    required
                    dir="ltr"
                    className="text-left"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("club.category")}</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="association">{t("club.catAssociation")}</SelectItem>
                      <SelectItem value="club">{t("club.catClub")}</SelectItem>
                      <SelectItem value="ngo">{t("club.catNgo")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("club.wilaya")}</Label>
                  <Select
                    value={form.wilayaCode}
                    onValueChange={(v) => setForm({ ...form, wilayaCode: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WILAYAS.map((w) => (
                        <SelectItem key={w.code} value={w.code}>
                          {w.nameAr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("club.regNumber")}</Label>
                <Input
                  value={form.registrationNumber}
                  onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("club.address")}</Label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>

              <AgreementUploadField
                value={agreement}
                onChange={(f) => {
                  setAgreement(f);
                  if (f) setAgreementError("");
                }}
                onFileError={setAgreementError}
                disabled={loading}
                error={agreementError}
              />

              <div className="flex items-start gap-3 rounded-lg border p-3 bg-muted/30">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(v) => setAcceptedTerms(v === true)}
                />
                <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                  {t("club.agreementTerms")}
                </label>
              </div>

              <Button type="submit" className="w-full h-12" disabled={loading}>
                {loading ? t("common.loading") : t("auth.registerClub")}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {t("club.approvalNotice")}
              </p>
              <p className="text-center text-sm">
                <Link href="/auth/login/club" className="text-primary hover:underline">
                  {t("auth.haveAccount")}
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </SiteLayout>
  );
}
