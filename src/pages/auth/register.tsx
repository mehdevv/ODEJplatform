import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { usePageMetaI18n } from "@/hooks/usePageMetaI18n";

export default function Register() {
  const { t } = useTranslation();
  usePageMetaI18n("auth.registerTitle", "auth.registerSubtitle");
  const { register } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    wilaya: "Bejaia",
    birthdate: ""
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast({ title: t("common.error"), description: t("auth.termsRequired"), variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const path = await register(formData);
      toast({ title: t("auth.loginSuccess"), variant: "default" });
      setLocation(path === "/dashboard" ? "/auth/verify-email" : path);
    } catch (error: any) {
      toast({ 
        title: t("common.error"), 
        description: error.message || t("common.error"), 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <SiteLayout>
      <div className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50">
        <Card className="w-full max-w-xl shadow-xl border-t-4 border-primary">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-primary">{t("auth.registerTitle")}</CardTitle>
            <CardDescription>{t("auth.registerSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("auth.fullName")}</Label>
                <Input id="name" required value={formData.name} onChange={handleChange} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("auth.email")}</Label>
                  <Input id="email" type="email" required value={formData.email} onChange={handleChange} className="text-left" dir="ltr" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("auth.phoneOptional")}</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} className="text-left" dir="ltr" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input id="password" type="password" required value={formData.password} onChange={handleChange} className="text-left" dir="ltr" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wilaya">{t("auth.wilaya")}</Label>
                  <Input id="wilaya" required value={formData.wilaya} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthdate">تاريخ الميلاد (اختياري)</Label>
                  <Input id="birthdate" type="date" value={formData.birthdate} onChange={handleChange} />
                </div>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse mt-6">
                <Checkbox 
                  id="terms" 
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm font-normal">
                  {t("auth.termsAgree")}
                </Label>
              </div>

              <Button type="submit" className="w-full h-12 text-lg mt-6" disabled={loading}>
                {loading ? t("auth.registering") : t("auth.registerSubmit")}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">{t("auth.hasAccount")} </span>
              <Link href="/auth/login" className="text-primary font-bold hover:underline">
                {t("auth.loginLink")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </SiteLayout>
  );
}
