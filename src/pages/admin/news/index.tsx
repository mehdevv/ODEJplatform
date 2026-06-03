import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListArticles, useDeleteArticle, getListArticlesQueryKey } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { useBulkUpdateArticles } from "@/lib/api";
import { processScheduledArticles } from "@/lib/api/mock/services";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminNews() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const bulkMutation = useBulkUpdateArticles();

  useEffect(() => {
    processScheduledArticles();
    queryClient.invalidateQueries({ queryKey: getListArticlesQueryKey() });
  }, []);

  const { data: res, isLoading } = useListArticles({
    search,
    status: status !== "all" ? (status as any) : undefined,
    page,
    limit: 10
  });

  const deleteMutation = useDeleteArticle();

  const handleDelete = async (slug: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.")) return;
    try {
      await deleteMutation.mutateAsync({ slug });
      toast({ title: "تم الحذف", description: "تم حذف المقال بنجاح" });
      queryClient.invalidateQueries({ queryKey: getListArticlesQueryKey() });
    } catch (error: any) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء الحذف", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">إدارة الأخبار والمقالات</h1>
          <div className="flex flex-wrap gap-2">
            {selected.size > 0 && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await bulkMutation.mutateAsync({
                      data: { slugs: [...selected], status: "published" },
                    });
                    setSelected(new Set());
                    toast({ title: "تم النشر" });
                  }}
                >
                  نشر ({selected.size})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await bulkMutation.mutateAsync({
                      data: { slugs: [...selected], status: "archived" },
                    });
                    setSelected(new Set());
                  }}
                >
                  أرشفة
                </Button>
              </>
            )}
            <Link href="/admin/news/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> مقال جديد
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardContent className="p-4 border-b bg-gray-50/50">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="ابحث بالعنوان..." 
                  className="pl-4 pr-10"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="published">منشور</SelectItem>
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="archived">مؤرشف</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={res?.data?.length ? selected.size === res.data.length : false}
                      onCheckedChange={(c) => {
                        if (c && res?.data)
                          setSelected(new Set(res.data.map((a) => a.slug)));
                        else setSelected(new Set());
                      }}
                    />
                  </TableHead>
                  <TableHead className="text-right">العنوان</TableHead>
                  <TableHead className="text-right">التصنيف</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">تاريخ النشر</TableHead>
                  <TableHead className="text-right w-[150px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-full max-w-[200px]" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : res?.data && res.data.length > 0 ? (
                  res.data.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell>
                        <Checkbox
                          checked={selected.has(article.slug)}
                          onCheckedChange={(c) => {
                            const next = new Set(selected);
                            if (c) next.add(article.slug);
                            else next.delete(article.slug);
                            setSelected(next);
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium max-w-[300px] truncate">
                        {article.title}
                      </TableCell>
                      <TableCell>
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {article.categoryNameAr || "بدون تصنيف"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          article.status === 'published' ? 'bg-green-100 text-green-700' :
                          article.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {article.status === 'published' ? 'منشور' : article.status === 'draft' ? 'مسودة' : 'مؤرشف'}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('ar-DZ') : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/actualites/${article.slug}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" title="معاينة">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/news/${article.id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500" title="تعديل">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500" 
                            onClick={() => handleDelete(article.slug)}
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                      لا توجد نتائج
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {res && res.total > res.limit && (
            <div className="p-4 border-t flex justify-center items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>السابق</Button>
              <span className="text-sm">صفحة {page} من {Math.ceil(res.total / res.limit)}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(res.total / res.limit)}>التالي</Button>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
