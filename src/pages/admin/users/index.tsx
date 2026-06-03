import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  useListUsers,
  useUpdateUserRole,
  useBanUser,
  useExportUsersCsv,
  getListUsersQueryKey,
  useListClubProfiles,
  useReviewClubProfile,
} from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Search, ShieldAlert, Download, FileText } from "lucide-react";
import { openAgreementDocument } from "@/components/club/AgreementUploadField";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUsers() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: res, isLoading } = useListUsers({
    search,
    role: roleFilter !== "all" ? roleFilter : undefined,
    page,
    limit: 15
  });

  const updateRoleMutation = useUpdateUserRole();
  const banMutation = useBanUser();
  const exportCsv = useExportUsersCsv();
  const { data: clubProfiles } = useListClubProfiles();
  const reviewClubMutation = useReviewClubProfile();

  const handleExport = async () => {
    const csv = await exportCsv.mutateAsync();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    if (!confirm("تغيير صلاحيات المستخدم قد يؤثر على وصوله للمنصة. هل أنت متأكد؟")) return;
    try {
      await updateRoleMutation.mutateAsync({ id: userId, data: { role: newRole as any } });
      toast({ title: "تم التحديث", description: "تم تغيير صلاحيات المستخدم بنجاح" });
      queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
    } catch (error: any) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء التحديث", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" /> تصدير CSV
          </Button>
        </div>

        <Card>
          <CardContent className="p-4 border-b bg-gray-50/50">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="ابحث بالاسم أو البريد..." 
                  className="pl-4 pr-10"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="الصلاحية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="public">مستخدم عادي</SelectItem>
                  <SelectItem value="club">نادي / جمعية</SelectItem>
                  <SelectItem value="admin">مدير (Admin)</SelectItem>
                  <SelectItem value="staff">موظف (Staff)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المستخدم</TableHead>
                  <TableHead className="text-right">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right">تاريخ الانضمام</TableHead>
                  <TableHead className="text-right w-[200px]">الصلاحيات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : res?.data && res.data.length > 0 ? (
                  res.data.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        {user.name}
                        {user.role === 'super_admin' && <ShieldAlert className="h-4 w-4 text-red-500" title="Super Admin" />}
                      </TableCell>
                      <TableCell className="text-gray-600 font-mono text-sm" dir="ltr">
                        <div className="text-right">{user.email}</div>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('ar-DZ')}
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={user.role} 
                          onValueChange={(v) => handleRoleChange(user.id, v)}
                          disabled={user.role === 'super_admin' || updateRoleMutation.isPending}
                        >
                          <SelectTrigger className={`h-8 ${user.role === 'admin' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">مستخدم عادي</SelectItem>
                            <SelectItem value="club">نادي / جمعية</SelectItem>
                            <SelectItem value="staff">موظف (Staff)</SelectItem>
                            <SelectItem value="khilya_staff">أخصائي خلية (Khilya)</SelectItem>
                            <SelectItem value="admin">مدير (Admin)</SelectItem>
                          </SelectContent>
                        </Select>
                        {user.role === "club" && (() => {
                          const cp = clubProfiles?.find((c) => c.userId === user.id);
                          if (!cp) return null;
                          return (
                            <div className="mt-2 space-y-2">
                              {cp.agreementDataUrl ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs gap-1 w-full"
                                  onClick={() => openAgreementDocument(cp)}
                                >
                                  <FileText className="h-3 w-3" />
                                  {t("club.agreementView")}
                                </Button>
                              ) : (
                                <span className="text-xs text-amber-600 block">
                                  {t("club.agreementMissing")}
                                </span>
                              )}
                              <div className="flex flex-wrap gap-1">
                                {cp.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="h-7 text-xs"
                                      disabled={!cp.agreementDataUrl}
                                      onClick={async () => {
                                        try {
                                          await reviewClubMutation.mutateAsync({
                                            id: cp.id,
                                            data: { status: "approved" },
                                          });
                                          toast({
                                            title: t("club.approvedToast"),
                                          });
                                          queryClient.invalidateQueries({
                                            queryKey: ["clubProfiles"],
                                          });
                                        } catch (err: unknown) {
                                          toast({
                                            title: t("common.error"),
                                            description:
                                              err instanceof Error
                                                ? err.message
                                                : undefined,
                                            variant: "destructive",
                                          });
                                        }
                                      }}
                                    >
                                      {t("club.approve")}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="h-7 text-xs"
                                      onClick={async () => {
                                        try {
                                          await reviewClubMutation.mutateAsync({
                                            id: cp.id,
                                            data: { status: "rejected" },
                                          });
                                          queryClient.invalidateQueries({
                                            queryKey: ["clubProfiles"],
                                          });
                                        } catch {
                                          toast({
                                            title: t("common.error"),
                                            variant: "destructive",
                                          });
                                        }
                                      }}
                                    >
                                      {t("club.reject")}
                                    </Button>
                                  </>
                                )}
                                {cp.status !== "pending" && (
                                  <span className="text-xs text-muted-foreground">
                                    {cp.status === "approved"
                                      ? t("club.statusApproved")
                                      : t("club.statusRejected")}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-gray-500">
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
