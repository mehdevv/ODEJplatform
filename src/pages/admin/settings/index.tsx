import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetSiteSettings, useUpdateSiteSettings } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: settings, isLoading } = useGetSiteSettings();
  const updateMutation = useUpdateSiteSettings();
  const [form, setForm] = useState(settings);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const isSuper = user?.role === "super_admin" || user?.role === "admin";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    try {
      await updateMutation.mutateAsync({ data: form });
      toast({ title: "تم حفظ الإعدادات" });
    } catch {
      toast({ title: "خطأ", variant: "destructive" });
    }
  };

  if (isLoading || !form) {
    return (
      <AdminLayout>
        <Skeleton className="h-96 w-full" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        <h1 className="text-2xl font-bold">إعدادات الموقع</h1>

        <Card>
          <CardHeader>
            <CardTitle>عام</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>اسم الموقع (عربي)</Label>
              <Input
                className="mt-1"
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
              />
            </div>
            <div>
              <Label>اسم الموقع (فرنسي)</Label>
              <Input
                className="mt-1"
                value={form.siteNameFr ?? ""}
                onChange={(e) => setForm({ ...form, siteNameFr: e.target.value })}
              />
            </div>
            <div>
              <Label>الشعار</Label>
              <Input
                className="mt-1"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              />
            </div>
            <div>
              <Label>البريد</Label>
              <Input
                className="mt-1"
                dir="ltr"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <Label>رابط Facebook</Label>
              <Input
                className="mt-1"
                dir="ltr"
                value={form.facebookUrl ?? ""}
                onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
              />
            </div>
            <div>
              <Label>رابط الموقع (QR)</Label>
              <Input
                className="mt-1"
                dir="ltr"
                value={form.siteUrl}
                onChange={(e) => setForm({ ...form, siteUrl: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO افتراضي</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>عنوان SEO</Label>
              <Input
                className="mt-1"
                value={form.seoDefaultTitle ?? ""}
                onChange={(e) => setForm({ ...form, seoDefaultTitle: e.target.value })}
              />
            </div>
            <div>
              <Label>وصف SEO</Label>
              <Textarea
                className="mt-1"
                value={form.seoDefaultDesc ?? ""}
                onChange={(e) => setForm({ ...form, seoDefaultDesc: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {isSuper && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>شريط الإعلان</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>تفعيل</Label>
                  <Switch
                    checked={form.announcementBanner?.enabled ?? false}
                    onCheckedChange={(v) =>
                      setForm({
                        ...form,
                        announcementBanner: {
                          enabled: v,
                          text: form.announcementBanner?.text ?? "",
                        },
                      })
                    }
                  />
                </div>
                <Textarea
                  value={form.announcementBanner?.text ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      announcementBanner: {
                        enabled: form.announcementBanner?.enabled ?? false,
                        text: e.target.value,
                      },
                    })
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>وضع الصيانة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>تفعيل</Label>
                  <Switch
                    checked={form.maintenanceMode?.enabled ?? false}
                    onCheckedChange={(v) =>
                      setForm({
                        ...form,
                        maintenanceMode: {
                          enabled: v,
                          message: form.maintenanceMode?.message ?? "",
                        },
                      })
                    }
                  />
                </div>
                <Textarea
                  value={form.maintenanceMode?.message ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      maintenanceMode: {
                        enabled: form.maintenanceMode?.enabled ?? false,
                        message: e.target.value,
                      },
                    })
                  }
                />
              </CardContent>
            </Card>
          </>
        )}

        <Button type="submit" disabled={updateMutation.isPending}>
          حفظ الإعدادات
        </Button>
      </form>
    </AdminLayout>
  );
}
