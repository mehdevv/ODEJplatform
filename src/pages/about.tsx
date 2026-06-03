import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Users, Building, Activity, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageMetaI18n } from "@/hooks/usePageMetaI18n";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/Motion";

export default function About() {
  const { t } = useTranslation();
  usePageMetaI18n("about.title", "about.subtitle");

  return (
    <SiteLayout>
      <FadeIn className="relative overflow-hidden border-b bg-primary py-20 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&q=80')] mix-blend-overlay opacity-10 object-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("about.title")}</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed">
            {t("about.subtitle")}
          </p>
        </div>
      </FadeIn>

      <div className="container mx-auto space-y-16 px-4 py-16">
        <Stagger className="grid gap-8 md:grid-cols-2">
          <StaggerItem>
          <Card className="border-t-4 border-primary shadow-lg transition-shadow hover:shadow-xl">
            <CardContent className="p-8">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <Target className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("about.missionTitle")}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {t("about.missionBody")}
              </p>
            </CardContent>
          </Card>
          </StaggerItem>

          <StaggerItem>
          <Card className="border-t-4 border-accent shadow-lg transition-shadow hover:shadow-xl">
            <CardContent className="p-8">
              <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6">
                <Eye className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("about.visionTitle")}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {t("about.visionBody")}
              </p>
            </CardContent>
          </Card>
          </StaggerItem>
        </Stagger>

        <FadeIn className="rounded-2xl border border-gray-100 bg-gray-50 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-center mb-10">{t("about.statsTitle")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex h-16 w-16 bg-white rounded-full items-center justify-center text-primary shadow-sm mb-4">
                <Building className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">+45</div>
              <div className="text-gray-500 font-medium">{t("about.statsInstitutions")}</div>
            </div>
            <div className="text-center">
              <div className="inline-flex h-16 w-16 bg-white rounded-full items-center justify-center text-primary shadow-sm mb-4">
                <Users className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">+25,000</div>
              <div className="text-gray-500 font-medium">{t("about.statsYouth")}</div>
            </div>
            <div className="text-center">
              <div className="inline-flex h-16 w-16 bg-white rounded-full items-center justify-center text-primary shadow-sm mb-4">
                <Activity className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">+120</div>
              <div className="text-gray-500 font-medium">{t("about.statsPartners")}</div>
            </div>
            <div className="text-center">
              <div className="inline-flex h-16 w-16 bg-white rounded-full items-center justify-center text-primary shadow-sm mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">+500</div>
              <div className="text-gray-500 font-medium">{t("about.statsEvents")}</div>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 border-r-4 border-primary pr-4">
            {t("about.orgTitle")}
          </h2>
          <div className="flex flex-col items-center gap-4">
            <Card className="w-full max-w-md border-primary shadow-md">
              <CardContent className="p-4 text-center font-bold text-primary">
                {t("about.director")}
              </CardContent>
            </Card>
            <div className="w-px h-8 bg-primary/30" />
            <div className="grid sm:grid-cols-3 gap-4 w-full max-w-3xl">
              {[
                t("about.deptManagement"),
                t("about.deptActivities"),
                t("about.deptTraining"),
              ].map((dept) => (
                <Card key={dept} className="border-primary/20">
                  <CardContent className="p-4 text-center text-sm font-semibold">
                    {dept}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {[
                t("about.facYouthHouses"),
                t("about.facCulture"),
                t("about.facSports"),
                t("about.facCamps"),
              ].map(
                (item) => (
                  <div
                    key={item}
                    className="text-center text-xs bg-secondary/50 rounded-lg py-3 px-2 font-medium text-primary-dark"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
        </FadeIn>

        <FadeIn>
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-r-4 border-primary pr-4">
            {t("about.docsTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: t("about.docAnnual2025"), href: "#" },
              { title: t("about.docDirectory"), href: "#" },
              { title: t("about.docRegulations"), href: "#" },
            ].map((doc) => (
              <a
                key={doc.title}
                href={doc.href}
                className="flex items-center gap-3 p-4 border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <Calendar className="h-8 w-8 text-primary shrink-0" />
                <span className="font-medium">{doc.title}</span>
              </a>
            ))}
          </div>
        </section>
        </FadeIn>

        <FadeIn>
        <section>
           <h2 className="text-2xl font-bold text-gray-900 mb-8 border-r-4 border-primary pr-4">{t("about.historyTitle")}</h2>
           <div className="relative border-r-2 border-primary/20 pr-8 mr-4 space-y-12">
             <div className="relative">
               <div className="absolute -right-[41px] top-1 h-5 w-5 rounded-full border-4 border-white bg-primary shadow" />
               <h3 className="text-xl font-bold text-primary mb-2">2007</h3>
               <p className="text-gray-600">{t("about.timeline2007")}</p>
             </div>
             <div className="relative">
               <div className="absolute -right-[41px] top-1 h-5 w-5 rounded-full border-4 border-white bg-primary shadow" />
               <h3 className="text-xl font-bold text-primary mb-2">2012</h3>
               <p className="text-gray-600">{t("about.timeline2012")}</p>
             </div>
             <div className="relative">
               <div className="absolute -right-[41px] top-1 h-5 w-5 rounded-full border-4 border-white bg-primary shadow" />
               <h3 className="text-xl font-bold text-primary mb-2">2018</h3>
               <p className="text-gray-600">{t("about.timeline2018")}</p>
             </div>
             <div className="relative">
               <div className="absolute -right-[41px] top-1 h-5 w-5 rounded-full border-4 border-white bg-accent shadow" />
               <h3 className="text-xl font-bold text-accent mb-2">2024</h3>
               <p className="text-gray-600">{t("about.timeline2024")}</p>
             </div>
           </div>
        </section>
        </FadeIn>
      </div>
    </SiteLayout>
  );
}
