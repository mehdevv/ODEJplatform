import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  useListInstitutions,
  useDeleteInstitution,
  useCreateInstitution,
  useUpdateInstitution,
  getListInstitutionsQueryKey,
  type Institution,
} from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slugify";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Link } from "wouter";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminInstitutions() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("all");
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: res, isLoading } = useListInstitutions({
    search,
    type: type !== "all" ? type : undefined,
    page,
    limit: 10
  });

  const deleteMutation = useDeleteInstitution();
  const createMutation = useCreateInstitution();
  const updateMutation = useUpdateInstitution();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Institution | null>(null);
  const [form, setForm] = useState({
    name: "",
    nameAr: "",
    slug: "",
    type: "youth_house",
    address: "",
    commune: "بجاية",
    descriptionAr: "",
    services: "",
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      nameAr: "",
      slug: "",
      type: "youth_house",
      address: "",
      commune: "بجاية",
      descriptionAr: "",
      services: "",
    });
    setEditorOpen(true);
  };

  const openEdit = (inst: Institution) => {
    setEditing(inst);
    setForm({
      name: inst.name,
      nameAr: inst.nameAr,
      slug: inst.slug,
      type: inst.type,
      address: inst.address,
      commune: inst.commune,
      descriptionAr: inst.descriptionAr || "",
      services: (inst.services || []).join(", "),
    });
    setEditorOpen(true);
  };

  const saveInstitution = async () => {
    const payload = {
      ...form,
      services: form.services.split(",").map((s) => s.trim()).filter(Boolean),
    };
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: payload });
    } else {
      await createMutation.mutateAsync({
        data: {
          ...payload,
          slug: form.slug || slugify(form.nameAr),
        } as Omit<Institution, "id">,
      });
    }
    setEditorOpen(false);
    queryClient.invalidateQueries({ queryKey: getListInstitutionsQueryKey() });
    toast({ title: "تم الحفظ" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه المؤسسة؟")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "تم الحذف", description: "تم الحذف بنجاح" });
      queryClient.invalidateQueries({ queryKey: getListInstitutionsQueryKey() });
    } catch (error: any) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء الحذف", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">إدارة المؤسسات الشبانية</h1>
          <Button className="gap-2" onClick={openCreate}>
            <Plus className="h-4 w-4" /> إضافة مؤسسة
          </Button>
        </div>

        <Card>
          <CardContent className="p-4 border-b bg-gray-50/50">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="ابحث بالاسم..." 
                  className="pl-4 pr-10"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="youth_house">بيت الشباب</SelectItem>
                  <SelectItem value="culture_center">مركز ثقافي</SelectItem>
                  <SelectItem value="sports_complex">مركب رياضي</SelectItem>
                  <SelectItem value="camp">مخيم</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">البلدية</TableHead>
                  <TableHead className="text-right">طاقة الاستيعاب</TableHead>
                  <TableHead className="text-right w-[150px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-full max-w-[200px]" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : res?.data && res.data.length > 0 ? (
                  res.data.map((inst) => (
                    <TableRow key={inst.id}>
                      <TableCell className="font-medium">
                        {inst.nameAr}
                      </TableCell>
                      <TableCell>
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-700">
                          {inst.type === 'youth_house' ? 'بيت الشباب' : inst.type === 'culture_center' ? 'مركز ثقافي' : inst.type === 'sports_complex' ? 'مركب رياضي' : inst.type === 'camp' ? 'مخيم' : 'مؤسسة'}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {inst.commune}
                      </TableCell>
                      <TableCell>
                        {inst.capacity || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/institutions/${inst.slug}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" title="معاينة">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500"
                            title="تعديل"
                            onClick={() => openEdit(inst)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => handleDelete(inst.id)}
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
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
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

        <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "تعديل مؤسسة" : "مؤسسة جديدة"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>الاسم (عربي)</Label>
                <Input
                  className="mt-1"
                  value={form.nameAr}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nameAr: e.target.value,
                      slug: editing ? form.slug : slugify(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label>الاسم (فرنسي)</Label>
                <Input
                  className="mt-1"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  className="mt-1"
                  dir="ltr"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
              <div>
                <Label>النوع</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youth_house">بيت شباب</SelectItem>
                    <SelectItem value="culture_center">مركز ثقافي</SelectItem>
                    <SelectItem value="sports_complex">مركب رياضي</SelectItem>
                    <SelectItem value="camp">مخيم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>العنوان / البلدية</Label>
                <Input
                  className="mt-1 mb-2"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
                <Input
                  value={form.commune}
                  onChange={(e) => setForm({ ...form, commune: e.target.value })}
                />
              </div>
              <div>
                <Label>الخدمات (مفصولة بفاصلة)</Label>
                <Input
                  className="mt-1"
                  value={form.services}
                  onChange={(e) => setForm({ ...form, services: e.target.value })}
                />
              </div>
              <div>
                <Label>الوصف</Label>
                <Textarea
                  className="mt-1"
                  value={form.descriptionAr}
                  onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={saveInstitution}>
                حفظ
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
