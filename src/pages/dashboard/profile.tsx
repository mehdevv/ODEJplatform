import { SiteLayout } from "@/components/layout/SiteLayout";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import {
  useUpdateUser,
  useChangePassword,
  useDeleteUserAccount,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";
import type { NotificationPreferences } from "@/lib/api/types";

export default function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const updateUserMutation = useUpdateUser();
  const changePasswordMutation = useChangePassword();
  const deleteAccountMutation = useDeleteUserAccount();
  const fileRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    wilaya: "",
    birthdate: "",
  });
  const [avatar, setAvatar] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    eventReminders: true,
    appointmentUpdates: true,
    diwanUpdates: true,
    newsletter: false,
  });
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setLocation("/auth/login");
    } else {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        wilaya: user.wilaya || "",
        birthdate: user.birthdate ? user.birthdate.split("T")[0] : "",
      });
      setAvatar(user.avatar ?? null);
      setPrefs(user.notificationPreferences ?? prefs);
    }
  }, [user, setLocation]);

  if (!user) return null;

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        data: { ...formData, avatar, notificationPreferences: prefs },
      });
      await refreshUser();
      toast({ title: "تم الحفظ بنجاح" });
    } catch (error: unknown) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل الحفظ",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      toast({ title: "كلمتا المرور غير متطابقتين", variant: "destructive" });
      return;
    }
    try {
      await changePasswordMutation.mutateAsync({
        data: {
          userId: user.id,
          currentPassword: passwords.current,
          newPassword: passwords.next,
        },
      });
      toast({ title: "تم تغيير كلمة المرور" });
      setPasswords({ current: "", next: "", confirm: "" });
    } catch (error: unknown) {
      toast({
        title: error instanceof Error ? error.message : "خطأ",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "هل أنت متأكد من حذف حسابك؟ سيتم إخفاء بياناتك ولا يمكن التراجع.",
      )
    )
      return;
    try {
      await deleteAccountMutation.mutateAsync(user.id);
      await logout();
      setLocation("/");
      toast({ title: "تم حذف الحساب" });
    } catch {
      toast({ title: "خطأ", variant: "destructive" });
    }
  };

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">إعدادات الحساب</h1>
        </div>

        <Card className="shadow-md border-t-4 border-primary">
          <CardHeader className="border-b">
            <CardTitle>المعلومات الشخصية</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-6 mb-8 items-center">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="h-24 w-24 rounded-full overflow-hidden bg-primary/10 shrink-0 border-2 border-primary/20"
                aria-label="تغيير الصورة"
              >
                {avatar ? (
                  <img src={avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-primary flex items-center justify-center h-full">
                    {user.name.charAt(0)}
                  </span>
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatar}
              />
              <div>
                <p className="font-bold">{user.email}</p>
                <p className="text-sm text-muted-foreground">لا يمكن تغيير البريد</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input
                  id="name"
                  required
                  className="mt-1"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="phone">الهاتف</Label>
                  <Input
                    id="phone"
                    className="mt-1"
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="wilaya">الولاية</Label>
                  <Input
                    id="wilaya"
                    className="mt-1"
                    value={formData.wilaya}
                    onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="birthdate">تاريخ الميلاد</Label>
                <Input
                  id="birthdate"
                  type="date"
                  className="mt-1"
                  value={formData.birthdate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthdate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-3 pt-4 border-t">
                <p className="font-medium">تفضيلات الإشعارات</p>
                {(
                  [
                    ["eventReminders", "تذكيرات الأنشطة"],
                    ["appointmentUpdates", "تحديثات المواعيد"],
                    ["diwanUpdates", "ديوان شباب"],
                    ["newsletter", "النشرة الإخبارية"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={key}>{label}</Label>
                    <Switch
                      id={key}
                      checked={!!prefs[key]}
                      onCheckedChange={(v) => setPrefs({ ...prefs, [key]: v })}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setLocation("/dashboard")}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "جاري الحفظ..." : "حفظ"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تغيير كلمة المرور</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label>كلمة المرور الحالية</Label>
                <Input
                  type="password"
                  className="mt-1"
                  dir="ltr"
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>كلمة المرور الجديدة</Label>
                <Input
                  type="password"
                  className="mt-1"
                  dir="ltr"
                  value={passwords.next}
                  onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                />
              </div>
              <div>
                <Label>تأكيد كلمة المرور</Label>
                <Input
                  type="password"
                  className="mt-1"
                  dir="ltr"
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                />
              </div>
              <Button type="submit" disabled={changePasswordMutation.isPending}>
                تحديث كلمة المرور
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">حذف الحساب</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              سيتم إخفاء بياناتك الشخصية. هذا الإجراء لا يمكن التراجع عنه في الوضع التجريبي.
            </p>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              حذف حسابي
            </Button>
          </CardContent>
        </Card>
      </div>
    </SiteLayout>
  );
}
