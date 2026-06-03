import { AdminLayout } from "@/components/layout/AdminLayout";
import { useCreateArticle, useUpdateArticle, useGetArticle, getListArticlesQueryKey } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "wouter";
import { ArrowRight, Save } from "lucide-react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { slugify } from "@/lib/slugify";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function ArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id && id !== "new";
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    featuredImage: "",
    status: "draft" as "draft" | "published" | "archived",
    categoryId: 1,
    seoTitle: "",
    seoDesc: "",
    scheduledAt: "",
  });

  const [saving, setSaving] = useState(false);

  // Since our getArticle API uses slug, we have a small issue if id is numeric ID.
  // In a real app we'd fetch by ID or slug properly. 
  // Let's assume id param here is actually the slug for simplicity if it's not "new".
  const { data: existingArticle, isLoading } = useGetArticle(isEdit ? id : "", {
    query: {
      enabled: isEdit
    }
  });

  useEffect(() => {
    if (existingArticle) {
      setFormData({
        title: existingArticle.title,
        slug: existingArticle.slug,
        excerpt: existingArticle.excerpt || "",
        body: existingArticle.body || "",
        featuredImage: existingArticle.featuredImage || "",
        status: existingArticle.status,
        categoryId: existingArticle.categoryId || 1,
        seoTitle: existingArticle.seoTitle || "",
        seoDesc: existingArticle.seoDesc || "",
        scheduledAt: existingArticle.scheduledAt?.slice(0, 16) || "",
      });
    }
  }, [existingArticle]);

  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (isEdit) {
        // Here we update by existing slug since the API uses slug for patches
        await updateMutation.mutateAsync({ 
          slug: existingArticle?.slug || id, 
          data: formData 
        });
        toast({ title: "تم التحديث", description: "تم حفظ التعديلات بنجاح" });
      } else {
        await createMutation.mutateAsync({ data: formData });
        toast({ title: "تم الإنشاء", description: "تم إنشاء المقال بنجاح" });
      }
      queryClient.invalidateQueries({ queryKey: getListArticlesQueryKey() });
      setLocation("/admin/news");
    } catch (error: any) {
      toast({ title: "خطأ", description: error.message || "حدث خطأ أثناء الحفظ", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (val: string) => {
    // Auto-generate slug from title if it's new
    if (!isEdit && !formData.slug) {
      const generatedSlug = slugify(val);
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
          <Link href="/admin/news">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? "تعديل المقال" : "مقال جديد"}
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
                    <Label htmlFor="excerpt">ملخص (مقتطف)</Label>
                    <Textarea 
                      id="excerpt" 
                      className="resize-none h-20"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>المحتوى</Label>
                    <RichTextEditor
                      value={formData.body}
                      onChange={(body) => setFormData({ ...formData, body })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">معاينة</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <h2>{formData.title || "عنوان المقال"}</h2>
                  {formData.excerpt && (
                    <p className="text-muted-foreground italic">{formData.excerpt}</p>
                  )}
                  <div dangerouslySetInnerHTML={{ __html: formData.body || "<p>المحتوى...</p>" }} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">النشر والإعدادات</CardTitle>
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
                        <SelectItem value="published">منشور</SelectItem>
                        <SelectItem value="archived">مؤرشف</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scheduledAt">جدولة النشر</Label>
                    <Input
                      id="scheduledAt"
                      type="datetime-local"
                      dir="ltr"
                      value={formData.scheduledAt}
                      onChange={(e) =>
                        setFormData({ ...formData, scheduledAt: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seoTitle">عنوان SEO</Label>
                    <Input
                      id="seoTitle"
                      value={formData.seoTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, seoTitle: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seoDesc">وصف SEO</Label>
                    <Textarea
                      id="seoDesc"
                      className="h-16"
                      value={formData.seoDesc}
                      onChange={(e) =>
                        setFormData({ ...formData, seoDesc: e.target.value })
                      }
                    />
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
                    <p className="text-xs text-gray-500">الرابط الدائم للمقال (مثال: my-article)</p>
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
                <CardContent>
                  <ImageUploadField
                    value={formData.featuredImage}
                    onChange={(featuredImage) =>
                      setFormData({ ...formData, featuredImage })
                    }
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">معاينة OG</CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-1 text-muted-foreground">
                  <p className="font-bold text-primary truncate">
                    {formData.seoTitle || formData.title || "العنوان"}
                  </p>
                  <p className="line-clamp-2">
                    {formData.seoDesc || formData.excerpt || "الوصف"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
