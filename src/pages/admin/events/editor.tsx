import { AdminLayout } from "@/components/layout/AdminLayout";
import { useCreateEvent, useUpdateEvent, useGetEvent, getListEventsQueryKey, useListInstitutions } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "wouter";
import { ArrowRight, Save, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

export default function EventEditor() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id && id !== "new";
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    capacity: undefined as number | undefined,
    featuredImage: "",
    status: "draft" as "draft" | "published" | "cancelled" | "completed",
    institutionId: undefined as number | undefined,
    categoryId: 2 // Default category ID for events
  });

  const [saving, setSaving] = useState(false);

  // Fetch institutions for the dropdown
  const { data: instRes } = useListInstitutions({ limit: 100 });

  const { data: existingEvent, isLoading } = useGetEvent(isEdit ? id : "", {
    query: {
      enabled: isEdit
    }
  });

  useEffect(() => {
    if (existingEvent) {
      setFormData({
        title: existingEvent.title,
        slug: existingEvent.slug,
        description: existingEvent.description || "",
        // HTML datetime-local inputs expect format YYYY-MM-DDThh:mm
        startDate: existingEvent.startDate ? new Date(existingEvent.startDate).toISOString().slice(0, 16) : "",
        endDate: existingEvent.endDate ? new Date(existingEvent.endDate).toISOString().slice(0, 16) : "",
        location: existingEvent.location || "",
        capacity: existingEvent.capacity || undefined,
        featuredImage: existingEvent.featuredImage || "",
        status: existingEvent.status,
        institutionId: existingEvent.institutionId || undefined,
        categoryId: existingEvent.categoryId || 2
      });
    }
  }, [existingEvent]);

  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const payload = {
        ...formData,
        // Convert empty strings to undefined to satisfy API typings if needed
        endDate: formData.endDate || undefined,
        location: formData.location || undefined,
        capacity: formData.capacity ? Number(formData.capacity) : undefined,
        institutionId: formData.institutionId ? Number(formData.institutionId) : undefined,
      };

      if (isEdit) {
        await updateMutation.mutateAsync({ 
          slug: existingEvent?.slug || id, 
          data: payload 
        });
        toast({ title: "تم التحديث", description: "تم حفظ التعديلات بنجاح" });
      } else {
        await createMutation.mutateAsync({ data: payload });
        toast({ title: "تم الإنشاء", description: "تم إنشاء النشاط بنجاح" });
      }
      queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
      setLocation("/admin/events");
    } catch (error: any) {
      toast({ title: "خطأ", description: error.message || "حدث خطأ أثناء الحفظ", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (val: string) => {
    if (!isEdit && !formData.slug) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, title: val, slug: generatedSlug }));
    } else {
      setFormData(prev => ({ ...prev, title: val }));
    }
  };

  if (isEdit && isLoading) {
    return <AdminLayout><div className="p-8 text-center text-gray-500">جاري تحميل البيانات...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/events">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? "تعديل النشاط" : "نشاط جديد"}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="title">العنوان <span className="text-red-500">*</span></Label>
                    <Input 
                      id="title" 
                      required 
                      className="text-lg font-bold"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>الوصف والتفاصيل</Label>
                    <RichTextEditor
                      value={formData.description}
                      onChange={(description) => setFormData({ ...formData, description })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">تاريخ ووقت الانطلاق <span className="text-red-500">*</span></Label>
                      <Input 
                        id="startDate" 
                        type="datetime-local"
                        required 
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">تاريخ الاختتام (اختياري)</Label>
                      <Input 
                        id="endDate" 
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">المكان <span className="text-red-500">*</span></Label>
                      <Input 
                        id="location" 
                        required 
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity">طاقة الاستيعاب (المقاعد)</Label>
                      <Input 
                        id="capacity" 
                        type="number" 
                        min="1"
                        value={formData.capacity || ''}
                        onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || undefined})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">الإعدادات</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="status">الحالة</Label>
                    <Select value={formData.status} onValueChange={(v: any) => setFormData({...formData, status: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">مسودة</SelectItem>
                        <SelectItem value="published">منشور (متاح للتسجيل)</SelectItem>
                        <SelectItem value="completed">منتهي</SelectItem>
                        <SelectItem value="cancelled">ملغى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>المؤسسة المنظمة</Label>
                    <Select 
                      value={formData.institutionId ? formData.institutionId.toString() : "none"} 
                      onValueChange={(v) => setFormData({...formData, institutionId: v === "none" ? undefined : parseInt(v)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="غير مرتبط بمؤسسة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">غير مرتبط بمؤسسة</SelectItem>
                        {instRes?.data?.map((inst) => (
                          <SelectItem key={inst.id} value={inst.id.toString()}>{inst.nameAr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">الرابط (Slug) <span className="text-red-500">*</span></Label>
                    <Input 
                      id="slug" 
                      required 
                      dir="ltr"
                      className="text-left"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <Button type="submit" className="w-full gap-2" disabled={saving}>
                      <Save className="h-4 w-4" /> {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">صورة الغلاف</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.featuredImage ? (
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                      <img src={formData.featuredImage} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-50 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 gap-2">
                      <ImageIcon className="h-8 w-8" />
                      <span className="text-sm">لا توجد صورة</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="image">رابط الصورة (URL)</Label>
                    <Input 
                      id="image" 
                      dir="ltr" 
                      className="text-left"
                      value={formData.featuredImage}
                      onChange={(e) => setFormData({...formData, featuredImage: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
