import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListAppointments, useUpdateAppointment, getListAppointmentsQueryKey } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminKhilya() {
  const [status, setStatus] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: res, isLoading } = useListAppointments({
    status: status !== "all" ? status : undefined
  });

  const updateMutation = useUpdateAppointment();

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateMutation.mutateAsync({ id, data: { status: newStatus as any } });
      toast({ title: "تم التحديث", description: "تم تغيير حالة الموعد بنجاح" });
      queryClient.invalidateQueries({ queryKey: getListAppointmentsQueryKey() });
    } catch (error: any) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء التحديث", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">إدارة مواعيد خلية الإصغاء</h1>
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
                  <SelectItem value="pending">في الانتظار</SelectItem>
                  <SelectItem value="confirmed">مؤكد</SelectItem>
                  <SelectItem value="completed">منتهي</SelectItem>
                  <SelectItem value="cancelled">ملغى</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">نوع الاستشارة</TableHead>
                  <TableHead className="text-right">التاريخ والوقت</TableHead>
                  <TableHead className="text-right">المؤسسة</TableHead>
                  <TableHead className="text-right w-[180px]">تغيير الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : res?.data && res.data.length > 0 ? (
                  res.data.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-medium">
                        {apt.type === 'mental_health' ? 'صحة نفسية' : 
                         apt.type === 'addiction' ? 'وقاية من الإدمان' : 
                         apt.type === 'violence' ? 'مناهضة العنف' : 'توجيه مهني'}
                      </TableCell>
                      <TableCell className="text-gray-600" dir="ltr">
                        <div className="text-right">
                          {new Date(apt.dateTime).toLocaleString('ar-DZ')}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {apt.institutionNameAr || 'غير محدد'}
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={apt.status} 
                          onValueChange={(v) => handleStatusChange(apt.id, v)}
                          disabled={updateMutation.isPending}
                        >
                          <SelectTrigger className={`h-8 ${
                            apt.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                            apt.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            apt.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">في الانتظار</SelectItem>
                            <SelectItem value="confirmed">مؤكد</SelectItem>
                            <SelectItem value="completed">منتهي</SelectItem>
                            <SelectItem value="cancelled">ملغى</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                      لا توجد مواعيد
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
