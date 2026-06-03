import { ClubLayout } from "@/components/layout/ClubLayout";
import { useGetMyClubProfile, useUpdateClubProfile } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export default function ClubProfilePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: profile, isLoading } = useGetMyClubProfile();
  const updateMutation = useUpdateClubProfile();
  const [form, setForm] = useState({
    organizationName: "",
    address: "",
    registrationNumber: "",
    logo: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        organizationName: profile.organizationName,
        address: profile.address ?? "",
        registrationNumber: profile.registrationNumber ?? "",
        logo: profile.logo ?? "",
      });
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      await updateMutation.mutateAsync({ id: profile.id, data: form });
      toast({ title: t("club.profileSaved") });
    } catch {
      toast({ title: t("common.error"), variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <ClubLayout>
        <Skeleton className="h-64 w-full" />
      </ClubLayout>
    );
  }

  return (
    <ClubLayout>
      <Card>
        <CardHeader>
          <CardTitle>{t("club.navProfile")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4 max-w-lg">
            <div className="space-y-2">
              <Label>{t("club.orgName")}</Label>
              <Input
                value={form.organizationName}
                onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
              />
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
            <div className="space-y-2">
              <Label>{t("club.logoUrl")}</Label>
              <Input
                placeholder="https://..."
                dir="ltr"
                className="text-left"
                value={form.logo}
                onChange={(e) => setForm({ ...form, logo: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={updateMutation.isPending}>
              {t("common.save")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </ClubLayout>
  );
}
