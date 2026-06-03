import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListPartnerships, useUpdatePartnershipStatus, getListPartnershipsQueryKey } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPartnerships() {
  const [status, setStatus] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: res, isLoading } = useListPartnerships({
    status: status !== "all" ? (status as any) : undefined
  });

  const updateMutation = useUpdatePartnershipStatus();

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateMutation.mutateAsync({ id, data: { status: newStatus as any } });
      toast({ title: "تم التحديث", description: "تم تغيير حالة الشراكة بنجاح" });
      queryClient.invalidateQueries({ queryKey: getListPartnershipsQueryKey() });
    } catch (error: any) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء التحديث", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">إدارة الشراكات والجمعيات</h1>
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
                  <SelectItem value="under_review">قيد الدراسة</SelectItem>
                  <SelectItem value="active">نشطة</SelectItem>
                  <SelectItem value="expired">منتهية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الجمعية</TableHead>
                  <TableHead className="text-right">مجال النشاط</TableHead>
                  <TableHead className="text-right">تاريخ الطلب</TableHead>
                  <TableHead className="text-right w-[180px]">تغيير الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : res?.data && res.data.length > 0 ? (
                  res.data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.associationName}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {item.category || '-'}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString('ar-DZ')}
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={item.status} 
                          onValueChange={(v) => handleStatusChange(item.id, v)}
                          disabled={updateMutation.isPending}
                        >
                          <SelectTrigger className={`h-8 ${
                            item.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                            item.status === 'under_review' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under_review">قيد الدراسة</SelectItem>
                            <SelectItem value="active">نشطة</SelectItem>
                            <SelectItem value="expired">منتهية</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                      لا توجد طلبات شراكة
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
