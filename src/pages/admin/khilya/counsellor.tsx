import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  useListAppointments,
  useUpdateAppointment,
  useListAppointmentSlots,
  useCreateAppointmentSlot,
  useDeleteAppointmentSlot,
  getListAppointmentsQueryKey,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useListCounsellors } from "@/lib/api";
import { Link } from "wouter";

export default function CounsellorPortal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: counsellorsRes } = useListCounsellors();
  const counsellor = counsellorsRes?.data.find((c) => c.userId === user?.id);

  if (user && user.role !== "khilya_staff" && user.role !== "admin" && user.role !== "super_admin") {
    return (
      <AdminLayout>
        <p className="p-8">غير مصرح. <Link href="/admin">العودة</Link></p>
      </AdminLayout>
    );
  }
  const counsellorId = counsellor?.id ?? 1;

  const { data: apts } = useListAppointments({ counsellorId });
  const { data: slots } = useListAppointmentSlots({
    counsellorId,
    institutionId: counsellor?.institutionId ?? 1,
  });
  const updateApt = useUpdateAppointment();
  const createSlot = useCreateAppointmentSlot();
  const deleteSlot = useDeleteAppointmentSlot();

  const handleStatus = async (id: number, status: string) => {
    await updateApt.mutateAsync({ id, data: { status } });
    qc.invalidateQueries({ queryKey: getListAppointmentsQueryKey() });
    toast({ title: "تم التحديث" });
  };

  const addSlot = async () => {
    const start = new Date();
    start.setDate(start.getDate() + 7);
    start.setHours(10, 0, 0, 0);
    const end = new Date(start);
    end.setHours(11, 0, 0, 0);
    await createSlot.mutateAsync({
      data: {
        counsellorId,
        institutionId: counsellor?.institutionId ?? 1,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      },
    });
    toast({ title: "تمت إضافة موعد" });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">بوابة المستشار — {counsellor?.nameAr ?? user?.name}</h1>

        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle>المواعيد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {apts?.data.map((a) => (
              <div
                key={a.id}
                className="flex flex-wrap justify-between items-center gap-2 p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{a.userName}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(a.dateTime).toLocaleString("ar-DZ")} — {a.type}
                  </p>
                </div>
                <Select
                  value={a.status}
                  onValueChange={(v) => handleStatus(a.id, v)}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">قيد الانتظار</SelectItem>
                    <SelectItem value="confirmed">مؤكد</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="cancelled">ملغى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>الأوقات المتاحة</CardTitle>
            <Button size="sm" onClick={addSlot}>
              إضافة موعد
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {slots?.data.map((s) => (
              <div
                key={s.id}
                className="flex justify-between items-center p-2 border rounded text-sm"
              >
                <span>
                  {new Date(s.startTime).toLocaleString("ar-DZ")}
                  {s.booked ? " (محجوز)" : ""}
                </span>
                {!s.booked && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600"
                    onClick={() => deleteSlot.mutateAsync(s.id)}
                  >
                    حذف
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
