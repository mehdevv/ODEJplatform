import { SiteLayout } from "@/components/layout/SiteLayout";
import { useGetInstitution, getGetInstitutionQueryKey } from "@/lib/api";
import { useParams, Link } from "wouter";
import { MapPin, Phone, Mail, Clock, Users, User, ArrowRight, Building, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useTranslation } from "react-i18next";
import { useLocalized } from "@/lib/localized-content";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ActivitiesSection } from "@/components/institutions/ActivitiesSection";

const TYPE_KEYS: Record<string, string> = {
  youth_house: "institutions.typeYouthHouse",
  culture_center: "institutions.typeCulture",
  sports_complex: "institutions.typeSports",
  camp: "institutions.typeCamp",
};

export default function InstitutionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const [galleryOpen, setGalleryOpen] = useState<string | null>(null);

  const { data: institution, isLoading } = useGetInstitution(slug ?? "", {
    query: {
      enabled: !!slug,
    },
  });

  usePageMeta(
    institution ? pick(institution, "name") : t("institutions.detailFallback"),
  );

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="h-[400px] w-full bg-gray-200 animate-pulse" />
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-[400px] w-full" />
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const handleContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: t("contact.successTitle"),
      description: t("contact.successDesc"),
    });
    (e.target as HTMLFormElement).reset();
  };

  if (!institution) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-700">{t("institutions.notFound")}</h2>
          <Link href="/institutions">
            <Button className="mt-4">{t("common.back")}</Button>
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const institutionName = pick(institution, "name");
  const institutionDescription = pick(institution, "description");
  const typeKey = TYPE_KEYS[institution.type];

  return (
    <SiteLayout>
      {/* Hero */}
      <div className="relative h-[400px] bg-primary flex flex-col justify-end overflow-hidden">
        {institution.coverImage && (
          <img 
            src={institution.coverImage} 
            alt={institutionName}
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="container relative z-10 mx-auto px-4 pb-12">
          <Link href="/institutions" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
            <ArrowRight className="h-4 w-4" /> {t("common.back")}
          </Link>
          <div className="flex items-center gap-3 mb-3">
             <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                {typeKey ? t(typeKey) : institution.type}
             </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{institutionName}</h1>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="h-5 w-5" />
            <span className="text-lg">{institution.commune}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                <Building className="h-6 w-6" /> {t("institutions.about")}
              </h2>
              <div className="prose max-w-none text-gray-700 leading-loose">
                {institutionDescription ? (
                  <p>{institutionDescription}</p>
                ) : null}
              </div>
            </section>

            {institution.services && institution.services.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-primary mb-6">{t("institutions.services")}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {institution.services.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white border rounded-lg p-4 shadow-sm">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span className="font-medium text-gray-800">{service}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {institution.images && institution.images.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-primary mb-6">{t("institutions.gallery")}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {institution.images.map((img, idx) => (
                    <Dialog key={idx} open={galleryOpen === img} onOpenChange={(o) => !o && setGalleryOpen(null)}>
                      <DialogTrigger asChild>
                        <button type="button" onClick={() => setGalleryOpen(img)} className="rounded-lg overflow-hidden border shadow-sm focus:ring-2 focus:ring-primary">
                          <img src={img} alt="" className="w-full aspect-video object-cover hover:opacity-90 transition-opacity" loading="lazy" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl p-2">
                        <img src={img} alt="" className="w-full rounded-lg" />
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </section>
            )}

            {institution && (
              <ActivitiesSection
                institutionId={institution.id}
                institutionSlug={institution.slug}
              />
            )}

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t("contact.mapTitle")}</h2>
              <div className="rounded-xl overflow-hidden border aspect-video bg-gray-100">
                <iframe
                  title={t("contact.mapTitle")}
                  className="w-full h-full min-h-[280px]"
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=5.04%2C36.73%2C5.08%2C36.77&layer=mapnik&marker=36.75%2C5.06`}
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">{t("institutions.contact")}</h2>
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleContact} className="space-y-4 max-w-lg">
                    <div>
                      <Label htmlFor="contact-name">{t("contact.name")}</Label>
                      <Input id="contact-name" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="contact-email">{t("contact.email")}</Label>
                      <Input id="contact-email" type="email" required className="mt-1" dir="ltr" />
                    </div>
                    <div>
                      <Label htmlFor="contact-msg">{t("contact.message")}</Label>
                      <Textarea id="contact-msg" required className="mt-1" rows={4} />
                    </div>
                    <Button type="submit">{t("contact.submit")}</Button>
                  </form>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-24 border-primary/20 shadow-lg">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-bold text-xl border-b pb-4">{t("institutions.info")}</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-3 text-gray-700">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm">{t("contact.addressLabel")}</div>
                      <div className="text-sm">{institution.address}، {institution.commune}</div>
                    </div>
                  </div>
                  
                  {institution.phone && (
                    <div className="flex gap-3 text-gray-700">
                      <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-sm">{t("contact.phoneLabel")}</div>
                        <div className="text-sm" dir="ltr">{institution.phone}</div>
                      </div>
                    </div>
                  )}

                  {institution.email && (
                    <div className="flex gap-3 text-gray-700">
                      <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-sm">{t("contact.emailLabel")}</div>
                        <div className="text-sm">{institution.email}</div>
                      </div>
                    </div>
                  )}

                  {institution.openingHours && (
                    <div className="flex gap-3 text-gray-700">
                      <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-sm">{t("contact.hoursLabel")}</div>
                        <div className="text-sm">{institution.openingHours}</div>
                      </div>
                    </div>
                  )}

                  {institution.directorName && (
                    <div className="flex gap-3 text-gray-700">
                      <User className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-sm">{t("about.director")}</div>
                        <div className="text-sm">{institution.directorName}</div>
                      </div>
                    </div>
                  )}

                  {institution.capacity && (
                    <div className="flex gap-3 text-gray-700">
                      <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div className="text-sm">
                        {t("institutions.capacityPeople", { count: institution.capacity })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t">
                  <Link href={`/activites?institutionId=${institution.id}`}>
                    <Button className="w-full" variant="outline">{t("institutions.viewActivities")}</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
