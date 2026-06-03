import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListEvents, useDeleteEvent, getListEventsQueryKey } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Link } from "wouter";
import { Plus, Search, Edit, Trash2, Eye, Download } from "lucide-react";
import { useExportRegistrationsCsv } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminEvents() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: res, isLoading } = useListEvents({
    search,
    status: status !== "all" ? (status as any) : undefined,
    page,
    limit: 10
  });

  const deleteMutation = useDeleteEvent();
  const exportCsv = useExportRegistrationsCsv();

  const downloadCsv = async (eventId: number, title: string) => {
    const csv = await exportCsv.mutateAsync(eventId);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${title.slice(0, 20)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا النشاط؟ لا يمكن التراجع.")) return;
    try {
      await deleteMutation.mutateAsync({ slug });
      toast({ title: "تم الحذف", description: "تم حذف النشاط بنجاح" });
      queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
    } catch (error: any) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء الحذف", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">إدارة الأنشطة والفعاليات</h1>
          <Link href="/admin/events/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> نشاط جديد
            </Button>
          </Link>
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
                  <SelectItem value="cancelled">ملغى</SelectItem>
                  <SelectItem value="completed">منتهي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">العنوان</TableHead>
                  <TableHead className="text-right">تاريخ الانطلاق</TableHead>
                  <TableHead className="text-right">المؤسسة</TableHead>
                  <TableHead className="text-right">التسجيلات</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right w-[150px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-full max-w-[200px]" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : res?.data && res.data.length > 0 ? (
                  res.data.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium max-w-[250px] truncate">
                        {event.title}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div dir="ltr" className="text-right">
                          {new Date(event.startDate).toLocaleString('ar-DZ', { dateStyle: 'short', timeStyle: 'short' })}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 truncate max-w-[150px]">
                        {event.institutionNameAr || "غير محدد"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-mono font-medium">
                          {event.registrationCount || 0}
                          {event.capacity ? ` / ${event.capacity}` : ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          event.status === 'published' ? 'bg-green-100 text-green-700' :
                          event.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                          event.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {event.status === 'published' ? 'منشور' : event.status === 'draft' ? 'مسودة' : event.status === 'cancelled' ? 'ملغى' : 'منتهي'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/activites/${event.slug}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" title="معاينة">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="تصدير CSV"
                            onClick={() => downloadCsv(event.id, event.title)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Link href={`/admin/events/${event.id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500" title="تعديل">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500" 
                            onClick={() => handleDelete(event.slug)}
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
