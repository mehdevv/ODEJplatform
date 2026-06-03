import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  useCreateAppointment,
  useListCampaigns,
  useListCounsellors,
  useListAppointmentSlots,
  useListInstitutions,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { HeartHandshake, Phone, Brain, ShieldAlert, GraduationCap, MapPin, Calendar as CalendarIcon, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { usePageMetaI18n } from "@/hooks/usePageMetaI18n";
import { useLocalized } from "@/lib/localized-content";
import { FadeIn } from "@/components/motion/Motion";
import { ScrollCarousel } from "@/components/carousel/ScrollCarousel";
import { CardMedia } from "@/components/ui/card-media";

export default function Khilya() {
  const { t } = useTranslation();
  const { pick, dateLocale } = useLocalized();
  usePageMetaI18n("khilya.pageTitle", "khilya.pageDesc");
  const { toast } = useToast();
  const { user } = useAuth();
  const createAppointmentMutation = useCreateAppointment();

  const { data: campaignsRes, isLoading: isLoadingCampaigns } = useListCampaigns({ limit: 20 });
  const { data: institutionsRes } = useListInstitutions({ limit: 50 });
  const { data: counsellorsRes } = useListCounsellors();

  const [formData, setFormData] = useState({
    type: "mental_health" as "mental_health" | "addiction" | "violence" | "vocational",
    institutionId: "1",
    counsellorId: "",
    slotId: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const counsellorIdNum = formData.counsellorId
    ? parseInt(formData.counsellorId, 10)
    : 0;
  const { data: slotsRes } = useListAppointmentSlots(
    {
      counsellorId: counsellorIdNum,
      institutionId: formData.institutionId
        ? parseInt(formData.institutionId, 10)
        : undefined,
    },
    { query: { enabled: counsellorIdNum > 0 } },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: t("khilya.loginRequired"),
        description: t("khilya.loginRequiredDesc"),
        variant: "destructive",
      });
      return;
    }
    if (!formData.slotId) {
      toast({ title: t("khilya.selectSlot"), variant: "destructive" });
      return;
    }
    const slot = slotsRes?.data?.find((s) => s.id === parseInt(formData.slotId, 10));
    setSubmitting(true);
    try {
      await createAppointmentMutation.mutateAsync({
        data: {
          type: formData.type,
          institutionId: formData.institutionId
            ? parseInt(formData.institutionId, 10)
            : undefined,
          counsellorId: counsellorIdNum,
          slotId: parseInt(formData.slotId, 10),
          dateTime: slot?.startTime ?? new Date().toISOString(),
          notes: formData.notes,
        },
      });
      toast({
        title: t("khilya.bookSuccess"),
        description: t("khilya.bookSuccessDesc"),
      });
      setFormData({ ...formData, slotId: "", notes: "" });
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : t("khilya.bookError");
      toast({ title: t("common.error"), description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const services = [
    {
      id: "mental_health",
      titleKey: "khilya.mentalHealth",
      icon: Brain,
    },
    {
      id: "addiction",
      titleKey: "khilya.addiction",
      icon: ShieldAlert,
    },
    {
      id: "violence",
      titleKey: "khilya.mentalHealth",
      icon: HeartHandshake,
    },
    {
      id: "vocational",
      titleKey: "home.hero2Subtitle",
      icon: GraduationCap,
    }
  ];

  return (
    <SiteLayout>
      <FadeIn className="border-b bg-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-primary text-white rounded-lg flex items-center justify-center shadow-sm">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">{t("khilya.pageTitle")}</h1>
          </div>
          <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed">
            {t("khilya.heroSubtitle")}
          </p>
        </div>
      </FadeIn>

      <div className="container mx-auto px-4 py-12">
        <FadeIn className="mb-12">
          <h2 className="mb-6 border-r-4 border-primary pr-4 text-2xl font-bold text-gray-900">
            {t("khilya.teamTitle")}
          </h2>
          <ScrollCarousel
            slideClassName="min-w-0 shrink-0 grow-0 basis-[72%] sm:basis-[48%] lg:basis-[24%]"
            autoPlay={false}
            dragFree
            loop={false}
            showArrows={(counsellorsRes?.data?.length ?? 0) > 1}
          >
            {(counsellorsRes?.data ?? []).map((c) => (
              <Card key={c.id} className="text-center hover-elevate">
                <CardContent className="pt-6 pb-6">
                  {c.photo ? (
                    <img
                      src={c.photo}
                      alt=""
                      className="h-16 w-16 mx-auto rounded-full object-cover mb-4"
                    />
                  ) : (
                    <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <Brain className="h-8 w-8" />
                    </div>
                  )}
                  <h3 className="font-bold">{pick(c, "name") || c.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{c.specialty}</p>
                </CardContent>
              </Card>
            ))}
          </ScrollCarousel>
        </FadeIn>

        <FadeIn className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-r-4 border-accent pr-4">
            موارد للتحميل
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {["دليل الصحة النفسية.pdf", "ملصق الوقاية من التدخين.pdf", "دليل التوجيه المهني.pdf"].map(
              (file) => (
                <a
                  key={file}
                  href="#"
                  className="flex items-center gap-3 p-4 border rounded-xl hover:border-primary/50 bg-white"
                >
                  <FileText className="h-6 w-6 text-primary shrink-0" />
                  <span className="text-sm font-medium">{file}</span>
                </a>
              ),
            )}
          </div>
        </FadeIn>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Services & Campaigns */}
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-r-4 border-primary pr-4">{t("khilya.servicesTitle")}</h2>
              <Accordion type="single" collapsible className="w-full">
                {services.map((service) => (
                  <AccordionItem key={service.id} value={service.id}>
                    <AccordionTrigger className="text-lg font-bold hover:text-primary transition-colors">
                      <div className="flex items-center gap-3">
                        <service.icon className="h-5 w-5 text-primary" />
                        {t(service.titleKey)}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed text-base pr-8">
                      {t("khilya.heroSubtitle")}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <section>
              <h2 className="mb-6 border-r-4 border-accent pr-4 text-2xl font-bold text-gray-900">{t("khilya.campaignsTitle")}</h2>
              {isLoadingCampaigns ? (
                <div className="grid gap-4">
                  {Array(2).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                  ))}
                </div>
              ) : campaignsRes?.data && campaignsRes.data.length > 0 ? (
                <ScrollCarousel
                  slideClassName="min-w-0 shrink-0 grow-0 basis-full"
                  autoPlay
                  autoPlayDelay={6000}
                  dragFree={false}
                  loop
                  showDots
                  showArrows={false}
                >
                  {campaignsRes.data.map((campaign) => (
                    <Card key={campaign.id} className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
                        <CardMedia
                          src={campaign.coverImage}
                          alt={campaign.title}
                          className="aspect-[16/10] min-h-[200px] w-full"
                          imageClassName="transition-transform duration-500 group-hover:scale-105"
                          fallback={<HeartHandshake className="h-10 w-10" />}
                        />
                        <CardContent className="flex flex-1 flex-col p-5">
                          <div className="text-xs text-accent font-bold mb-1">{campaign.category === 'mental_health' ? 'صحة نفسية' : campaign.category === 'addiction' ? 'إدمان' : campaign.category === 'violence' ? 'عنف' : 'توجيه'}</div>
                          <h3 className="font-bold text-lg mb-2">{campaign.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{campaign.description}</p>
                        </CardContent>
                    </Card>
                  ))}
                </ScrollCarousel>
              ) : (
                <p className="text-gray-500 italic">لا توجد حملات توعية حالياً.</p>
              )}
            </section>
          </div>

          {/* Booking Form & Contact */}
          <div className="space-y-8">
            <Card className="border-t-4 border-primary shadow-lg sticky top-24">
              <CardHeader className="bg-gray-50/50 border-b pb-4">
                <CardTitle className="text-2xl text-primary">{t("khilya.bookingTitle")}</CardTitle>
                <CardDescription>{t("khilya.heroSubtitle")}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="type">{t("khilya.bookingType")}</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(v: "mental_health" | "addiction" | "violence" | "vocational") => setFormData({...formData, type: v})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("khilya.bookingType")} />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map(s => (
                          <SelectItem key={s.id} value={s.id}>{t(s.titleKey)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution">{t("nav.institutions")}</Label>
                    <Select
                      value={formData.institutionId}
                      onValueChange={(v) =>
                        setFormData({ ...formData, institutionId: v, counsellorId: "", slotId: "" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("institutions.searchPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {institutionsRes?.data?.map((inst) => (
                          <SelectItem key={inst.id} value={inst.id.toString()}>
                            {pick(inst, "name")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>المستشار</Label>
                    <Select
                      value={formData.counsellorId}
                      onValueChange={(v) =>
                        setFormData({ ...formData, counsellorId: v, slotId: "" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المستشار" />
                      </SelectTrigger>
                      <SelectContent>
                        {(counsellorsRes?.data ?? [])
                          .filter(
                            (c) =>
                              !formData.institutionId ||
                              c.institutionId === parseInt(formData.institutionId, 10),
                          )
                          .map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.nameAr ?? c.name} — {c.specialty}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>الموعد المتاح</Label>
                    <Select
                      value={formData.slotId}
                      onValueChange={(v) => setFormData({ ...formData, slotId: v })}
                      disabled={!formData.counsellorId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر وقتاً" />
                      </SelectTrigger>
                      <SelectContent>
                        {(slotsRes?.data ?? []).map((slot) => (
                          <SelectItem key={slot.id} value={slot.id.toString()}>
                            {new Date(slot.startTime).toLocaleString(dateLocale, {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {!user && (
                    <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                      <Link href="/auth/login" className="text-primary font-bold underline">
                        {t("auth.login")}
                      </Link>{" "}
                      {t("khilya.bookingTitle")}
                    </p>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="أي معلومات إضافية تود مشاركتها..."
                      className="resize-none h-24"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 text-lg" disabled={submitting}>
                    {submitting ? t("contact.submitting") : t("khilya.bookingSubmit")}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="bg-primary-light/20 border border-primary/20 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                الاتصال السريع بالخلية
              </h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                في حالات الطوارئ أو الاستفسارات السريعة، يمكنك الاتصال مباشرة بالأخصائيين المداومين على الأرقام التالية:
              </p>
              <div className="space-y-2 font-bold text-primary text-lg" dir="ltr">
                <div className="text-right">+213 34 XX XX XX</div>
                <div className="text-right">رقم أخضر: 10XX</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
