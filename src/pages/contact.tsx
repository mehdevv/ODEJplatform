import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitContact } from "@/lib/api";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageMetaI18n } from "@/hooks/usePageMetaI18n";

export default function Contact() {
  const { t } = useTranslation();
  usePageMetaI18n("contact.title", "contact.subtitle");
  const { toast } = useToast();
  const contactMutation = useSubmitContact();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactMutation.mutateAsync({ data: formData });
      toast({ title: t("contact.successTitle"), description: t("contact.successDesc") });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : t("common.error");
      toast({ title: t("common.error"), description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <div className="bg-primary/5 py-12 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t("contact.title")}</h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            {t("contact.subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 border-r-4 border-primary pr-4">{t("contact.infoTitle")}</h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold mb-2">{t("contact.addressLabel")}</h3>
                  <p className="text-gray-600 text-sm">{t("contact.address")}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                    <Phone className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold mb-2">{t("contact.phoneLabel")}</h3>
                  <p className="text-gray-600 text-sm" dir="ltr">+213 34 XX XX XX<br/>+213 34 XX XX XY</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold mb-2">{t("contact.emailLabel")}</h3>
                  <p className="text-gray-600 text-sm">contact@odejbejaia.dz</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md sm:col-span-2">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold mb-2">{t("contact.hoursLabel")}</h3>
                  <p className="text-gray-600 text-sm">
                    {t("contact.hoursWeekdays")}<br />
                    {t("contact.hoursWeekend")}
                  </p>
                </CardContent>
              </Card>

            </div>

            <div className="h-64 rounded-xl overflow-hidden border shadow-inner">
              <iframe
                title={t("contact.mapTitle")}
                className="w-full h-full min-h-[256px]"
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=5.04%2C36.73%2C5.08%2C36.77&layer=mapnik&marker=36.75%2C5.06"
              />
            </div>
          </div>

          <div>
            <Card className="border-t-4 border-primary shadow-xl h-full">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("contact.formTitle")}</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("contact.name")}</Label>
                    <Input 
                      id="name" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("contact.email")}</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="text-left"
                      dir="ltr"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">{t("contact.subject")}</Label>
                    <Input 
                      id="subject" 
                      required 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t("contact.message")}</Label>
                    <Textarea 
                      id="message" 
                      required
                      placeholder={t("contact.messagePlaceholder")}
                      className="resize-none h-32"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <div className="p-4 border border-dashed rounded-lg bg-gray-50 text-center text-sm text-muted-foreground">
                    {t("contact.captcha")}
                  </div>

                  <Button type="submit" className="w-full h-12 text-lg" disabled={submitting}>
                    {submitting ? t("contact.submitting") : t("contact.submit")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
