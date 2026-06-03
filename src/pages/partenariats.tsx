import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListPartnerships, useCreatePartnership, type Partnership } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { HeartHandshake, CheckCircle2, FileText, ArrowRight, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { usePageMetaI18n } from "@/hooks/usePageMetaI18n";

export default function Partnerships() {
  const { t } = useTranslation();
  usePageMetaI18n("partnerships.title", "partnerships.subtitle");
  const { toast } = useToast();
  const { data: partnersRes, isLoading } = useListPartnerships({ status: 'approved', limit: 48 });
  const [selectedPartner, setSelectedPartner] = useState<Partnership | null>(null);
  const createPartnershipMutation = useCreatePartnership();

  const [formData, setFormData] = useState({
    associationName: "",
    category: "",
    description: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createPartnershipMutation.mutateAsync({ data: formData });
      toast({ title: t("contact.successTitle"), description: t("contact.successDesc") });
      setFormData({ associationName: "", category: "", description: "" });
    } catch (error: any) {
      toast({ title: t("common.error"), description: error.message || t("common.error"), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <div className="bg-primary/5 py-16 border-b">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex h-16 w-16 bg-primary text-white rounded-full items-center justify-center mb-6 shadow-md">
            <HeartHandshake className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">{t("partnerships.title")}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            {t("partnerships.subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Active Partners */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 border-r-4 border-primary pr-4">{t("partnerships.listTitle")}</h2>
            
            {isLoading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {Array(6).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : partnersRes?.data && partnersRes.data.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {partnersRes.data.map(partner => (
                  <Card
                    key={partner.id}
                    className="overflow-hidden hover:border-primary/30 transition-colors cursor-pointer hover-elevate"
                    onClick={() => setSelectedPartner(partner)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      {partner.logo ? (
                        <div className="h-16 w-16 rounded-lg bg-gray-100 p-2 shrink-0 border">
                          <img src={partner.logo} className="w-full h-full object-contain" alt={partner.associationName} />
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-secondary text-primary flex items-center justify-center shrink-0 border border-primary/20">
                          <HeartHandshake className="h-8 w-8" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900 line-clamp-1">{partner.associationName}</h3>
                        {partner.category && (
                          <span className="text-xs text-muted-foreground mt-1 inline-block">{partner.category}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
                <p className="text-gray-500">{t("partnerships.empty")}</p>
              </div>
            )}
          </div>

          {/* Apply Form */}
          <div>
            <Card className="sticky top-24 shadow-lg border-t-4 border-accent">
              <CardHeader className="bg-gray-50/50 border-b pb-4">
                <CardTitle className="text-xl">{t("partnerships.applyTitle")}</CardTitle>
                <CardDescription>{t("partnerships.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("partnerships.orgName")}</Label>
                    <Input 
                      id="name" 
                      required 
                      value={formData.associationName}
                      onChange={(e) => setFormData({...formData, associationName: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">{t("partnerships.category")}</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(v) => setFormData({...formData, category: v})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("partnerships.category")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="شباني">{t("partnerships.catYouth")}</SelectItem>
                        <SelectItem value="ثقافي">{t("partnerships.catCulture")}</SelectItem>
                        <SelectItem value="رياضي">{t("partnerships.catSports")}</SelectItem>
                        <SelectItem value="علمي">علمي وتكنولوجي</SelectItem>
                        <SelectItem value="بيئي">بيئي</SelectItem>
                        <SelectItem value="اجتماعي">خيري وتطوعي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desc">{t("contact.message")}</Label>
                    <Textarea 
                      id="desc" 
                      required
                      placeholder="ما هي أهداف الشراكة المقترحة؟"
                      className="resize-none h-32"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? t("contact.submitting") : t("partnerships.submit")}
                  </Button>
                </form>
                
                <div className="mt-6 pt-6 border-t text-sm text-gray-500 space-y-2">
                  <p className="font-bold text-gray-700">الوثائق المطلوبة لاحقاً:</p>
                  <ul className="list-disc pr-5 space-y-1">
                    <li>{t("partnerships.docApproval")}</li>
                    <li>القانون الأساسي للجمعية</li>
                    <li>التقرير الأدبي والمالي الأخير</li>
                    <li>مشروع الاتفاقية</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedPartner} onOpenChange={(o) => !o && setSelectedPartner(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPartner?.associationName}</DialogTitle>
          </DialogHeader>
          {selectedPartner && (
            <div className="space-y-4">
              {selectedPartner.logo && (
                <img src={selectedPartner.logo} alt="" className="h-24 object-contain mx-auto" />
              )}
              <p className="text-muted-foreground">{selectedPartner.description}</p>
              {selectedPartner.startDate && (
                <p className="text-sm">
                  <span className="font-bold">بداية الاتفاقية:</span>{" "}
                  {selectedPartner.startDate}
                </p>
              )}
              {selectedPartner.conventionDoc && (
                <Button variant="outline" className="w-full gap-2" asChild>
                  <a
                    href={selectedPartner.conventionDoc}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4" />
                    {t("partnerships.downloadPdf")}
                  </a>
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}
