import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useApplyDiwan, useListDiwanProjects } from "@/lib/api";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { Users, Lightbulb, Target, MessagesSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { usePageMetaI18n } from "@/hooks/usePageMetaI18n";
import { ScrollCarousel } from "@/components/carousel/ScrollCarousel";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/Motion";
import { MOCK_GALLERY } from "@/lib/mock-images";

export default function Diwan() {
  const { t } = useTranslation();
  usePageMetaI18n("diwan.pageTitle", "diwan.pageDesc");
  const { user } = useAuth();
  const { toast } = useToast();
  const applyMutation = useApplyDiwan();
  const { data: projectsRes, isLoading: isLoadingProjects } = useListDiwanProjects({ limit: 20 });

  const [applicationText, setApplicationText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "تنبيه", description: "يجب تسجيل الدخول لتقديم طلب الانضمام", variant: "destructive" });
      return;
    }
    
    setSubmitting(true);
    try {
      await applyMutation.mutateAsync({ data: { applicationText } });
      toast({ title: "تم إرسال الطلب بنجاح", description: "سيتم مراجعة طلبك من قبل الإدارة" });
      setApplicationText("");
    } catch (error: any) {
      toast({ title: "خطأ", description: error.message || "حدث خطأ أثناء إرسال الطلب", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <FadeIn className="relative overflow-hidden bg-primary py-20 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80')] mix-blend-overlay opacity-20 object-cover bg-center" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-flex h-20 w-20 bg-white rounded-2xl items-center justify-center text-primary mb-6 shadow-xl transform rotate-3">
            <Users className="h-10 w-10" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{t("diwan.pageTitle")}</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed mb-8">
            {t("diwan.heroSubtitle")}
          </p>
          <a href="#apply">
            <Button size="lg" variant="secondary" className="text-primary font-bold text-lg h-14 px-8 shadow-lg">
              {t("diwan.heroCta")}
            </Button>
          </a>
        </div>
      </FadeIn>

      <div className="container mx-auto px-4 py-16">
        <Stagger className="grid gap-8 md:grid-cols-3">
          <StaggerItem>
          <Card className="bg-surface border-0 shadow-md hover:-translate-y-1 transition-transform">
            <CardContent className="p-8 text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                <MessagesSquare className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("diwan.pillarConsult")}</h3>
              <p className="text-gray-600 leading-relaxed">
                إشراك الشباب في صياغة ومتابعة وتقييم السياسات العمومية المتعلقة بالشباب على المستوى المحلي.
              </p>
            </CardContent>
          </Card>
          </StaggerItem>

          <StaggerItem>
          <Card className="bg-surface border-0 shadow-md hover:-translate-y-1 transition-transform">
            <CardContent className="p-8 text-center">
              <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto mb-6">
                <Lightbulb className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("diwan.pillarProjects")}</h3>
              <p className="text-gray-600 leading-relaxed">
                توفير منصة للشباب لتقديم أفكارهم ومشاريعهم المبتكرة التي تخدم المجتمع وتساهم في التنمية.
              </p>
            </CardContent>
          </Card>
          </StaggerItem>

          <StaggerItem>
          <Card className="bg-surface border-0 shadow-md hover:-translate-y-1 transition-transform">
            <CardContent className="p-8 text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("diwan.pillarVolunteer")}</h3>
              <p className="text-gray-600 leading-relaxed">
                ترسيخ ثقافة التطوع والعمل الجمعوي، وتشجيع المبادرات الشبانية الهادفة في مختلف الميادين.
              </p>
            </CardContent>
          </Card>
          </StaggerItem>
        </Stagger>
      </div>

      <FadeIn className="border-y bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("diwan.projectsTitle")}</h2>
              <p className="text-muted-foreground">أبرز الأفكار والمشاريع المقترحة من قبل أعضاء الديوان</p>
            </div>
          </div>

          {isLoadingProjects ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          ) : projectsRes?.data && projectsRes.data.length > 0 ? (
            <ScrollCarousel
              slideClassName="min-w-0 shrink-0 grow-0 basis-[88%] sm:basis-[48%] lg:basis-[24%]"
              autoPlay
              autoPlayDelay={4500}
              dragFree
              loop
            >
              {projectsRes.data.map((project) => (
                <Card
                  key={project.id}
                  className="group overflow-hidden border-transparent shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] min-h-[180px] overflow-hidden bg-gray-200">
                    {(project.image ?? project.coverImage) ? (
                      <img
                        src={project.image ?? project.coverImage}
                        alt={project.title}
                        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-secondary text-primary/30">
                        <Lightbulb className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="mb-2 line-clamp-2 text-lg font-bold">{project.title}</h3>
                    <p className="mb-4 line-clamp-2 text-sm text-gray-500">{project.description}</p>
                    <div className="flex items-center gap-2 border-t pt-3 text-xs font-medium text-primary">
                      <User className="h-3 w-3" />
                      مقدم المشروع: {project.memberName || "عضو"}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollCarousel>
          ) : (
            <div className="rounded-xl border border-dashed bg-white py-12 text-center">
              <p className="text-gray-500">{t("diwan.projectsEmpty")}</p>
            </div>
          )}
        </div>
      </FadeIn>

      <FadeIn className="container mx-auto px-4 py-16">
        <h2 className="mb-8 border-r-4 border-primary pr-4 text-2xl font-bold text-gray-900">
          معرض الصور
        </h2>
        <ScrollCarousel
          slideClassName="min-w-0 shrink-0 grow-0 basis-[72%] sm:basis-[48%] md:basis-[24%]"
          autoPlay
          autoPlayDelay={3500}
          dragFree
          loop
          showDots
        >
          {MOCK_GALLERY.map((src, i) => (
              <div key={i} className="aspect-[4/3] min-h-[200px] overflow-hidden rounded-xl border shadow-sm">
                <img src={src} alt="" className="h-full w-full object-cover object-center" loading="lazy" />
              </div>
            ),
          )}
        </ScrollCarousel>
      </FadeIn>

      <FadeIn id="apply" className="container mx-auto max-w-3xl px-4 py-20">
        <Card className="border-t-4 border-accent shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-4">
              <Users className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">{t("diwan.applyTitle")}</CardTitle>
            <CardDescription className="text-base mt-2">
              {t("diwan.heroSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!user ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
                <p className="text-gray-600 mb-4">{t("events.loginRequired")}</p>
                <Link href="/auth/login">
                  <Button>{t("auth.login")}</Button>
                </Link>
                <div className="mt-4 text-sm text-gray-500">
                  {t("auth.noAccount")}{" "}<Link href="/auth/register" className="text-primary hover:underline">{t("auth.registerNow")}</Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="application" className="text-base">لماذا ترغب في الانضمام لديوان الشباب؟ وماهي الأفكار أو المشاريع التي تود اقتراحها؟</Label>
                  <Textarea 
                    id="application" 
                    required 
                    placeholder="اكتب رسالتك التحفيزية هنا (لا تقل عن 50 كلمة)..."
                    className="min-h-[200px] text-base leading-relaxed"
                    value={applicationText}
                    onChange={(e) => setApplicationText(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-lg bg-accent hover:bg-accent/90" disabled={submitting || applicationText.length < 20}>
                  {submitting ? t("contact.submitting") : t("diwan.applySubmit")}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </SiteLayout>
  );
}

function User({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
