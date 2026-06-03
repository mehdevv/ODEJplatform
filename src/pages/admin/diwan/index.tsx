import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListDiwanMembers, useUpdateDiwanMemberStatus, getListDiwanMembersQueryKey } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminDiwan() {
  const [status, setStatus] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: res, isLoading } = useListDiwanMembers({
    status: status !== "all" ? (status as any) : undefined
  });

  const updateMutation = useUpdateDiwanMemberStatus();

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateMutation.mutateAsync({ id, data: { status: newStatus as any } });
      toast({ title: "تم التحديث", description: "تم تغيير حالة الطلب بنجاح" });
      queryClient.invalidateQueries({ queryKey: getListDiwanMembersQueryKey() });
    } catch (error: any) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء التحديث", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">إدارة ديوان الشباب</h1>
        </div>

        <Card>
          <CardContent className="p-4 border-b bg-gray-50/50">
            <div className="flex w-full md:w-[300px]">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="تصفية حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="pending">قيد الدراسة</SelectItem>
                  <SelectItem value="accepted">مقبول</SelectItem>
                  <SelectItem value="rejected">مرفوض</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المستخدم</TableHead>
                  <TableHead className="text-right">تاريخ الطلب</TableHead>
                  <TableHead className="text-right text-center w-[120px]">الرسالة التحفيزية</TableHead>
                  <TableHead className="text-right w-[180px]">تغيير الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-8 w-8 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : res?.data && res.data.length > 0 ? (
                  res.data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.userName}
                        <div className="text-xs text-gray-500 font-normal">{item.userEmail}</div>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString('ar-DZ')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="text-right">الرسالة التحفيزية لـ {item.userName}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-gray-700 leading-relaxed text-sm">
                              {item.applicationText || "لم يكتب رسالة تحفيزية."}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={item.status} 
                          onValueChange={(v) => handleStatusChange(item.id, v)}
                          disabled={updateMutation.isPending}
                        >
                          <SelectTrigger className={`h-8 ${
                            item.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-200' :
                            item.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">قيد الدراسة</SelectItem>
                            <SelectItem value="accepted">مقبول</SelectItem>
                            <SelectItem value="rejected">مرفوض</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                      لا توجد طلبات انضمام
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
