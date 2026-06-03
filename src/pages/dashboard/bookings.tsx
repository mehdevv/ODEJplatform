import { SiteLayout } from "@/components/layout/SiteLayout";
import { useAuth } from "@/lib/auth";
import { useListRegistrations, useCancelRegistration, getListRegistrationsQueryKey } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, MapPin, QrCode, XCircle, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { QrTicketDialog } from "@/components/dashboard/QrTicketDialog";
import { downloadEventIcs } from "@/lib/ics";
import type { Registration } from "@/lib/api/types";

type TabValue = "upcoming" | "past" | "waitlist" | "cancelled";

export default function Bookings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<TabValue>("upcoming");
  const [qrReg, setQrReg] = useState<Registration | null>(null);
  const cancelMutation = useCancelRegistration();

  const params =
    tab === "upcoming"
      ? { userId: user!.id, status: "confirmed" as const, past: false }
      : tab === "past"
        ? { userId: user!.id, status: "confirmed" as const, past: true }
        : tab === "waitlist"
          ? { userId: user!.id, status: "waitlist" as const }
          : { userId: user!.id, status: "cancelled" as const };

  const { data: regsRes, isLoading } = useListRegistrations(params, {
    query: { enabled: !!user },
  });

  const regs = regsRes?.data ?? [];

  const handleCancel = async (id: number) => {
    if (!confirm("هل أنت متأكد من إلغاء التسجيل؟")) return;
    try {
      await cancelMutation.mutateAsync({ id });
      toast({ title: "تم الإلغاء", description: "تم إلغاء تسجيلك بنجاح" });
      queryClient.invalidateQueries({ queryKey: getListRegistrationsQueryKey() });
    } catch (error: unknown) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ",
        variant: "destructive",
      });
    }
  };

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">تسجيلاتي في الأنشطة</h1>

        <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="upcoming">القادمة</TabsTrigger>
            <TabsTrigger value="past">السابقة</TabsTrigger>
            <TabsTrigger value="waitlist">الانتظار</TabsTrigger>
            <TabsTrigger value="cancelled">الملغاة</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        ) : regs.length > 0 ? (
          <div className="space-y-4">
            {regs.map((reg) => (
              <Card
                key={reg.id}
                className="overflow-hidden border-s-4"
                style={{
                  borderInlineStartColor:
                    reg.status === "confirmed"
                      ? "#22c55e"
                      : reg.status === "waitlist"
                        ? "#eab308"
                        : "#9ca3af",
                }}
              >
                <CardContent className="p-0 flex flex-col sm:flex-row">
                  <div className="p-6 flex-1 border-b sm:border-b-0 sm:border-s border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{reg.eventTitle}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                          {reg.eventStartDate
                            ? new Date(reg.eventStartDate).toLocaleDateString("ar-DZ", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{reg.eventLocation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 flex flex-col items-center justify-center sm:w-56 gap-3 shrink-0">
                    {reg.status === "confirmed" && tab !== "past" ? (
                      <>
                        <Button
                          variant="outline"
                          className="w-full gap-2 border-primary text-primary"
                          onClick={() => setQrReg(reg)}
                        >
                          <QrCode className="h-4 w-4" /> التذكرة
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full gap-2"
                          onClick={() => downloadEventIcs(reg)}
                        >
                          <Download className="h-4 w-4" /> تصدير .ics
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleCancel(reg.id)}
                          disabled={cancelMutation.isPending}
                        >
                          إلغاء المشاركة
                        </Button>
                      </>
                    ) : reg.status === "waitlist" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleCancel(reg.id)}
                      >
                        إلغاء الطلب
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <XCircle className="h-5 w-5" /> ملغى
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
            <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد تسجيلات</h3>
          </div>
        )}
      </div>
      <QrTicketDialog
        registration={qrReg}
        open={!!qrReg}
        onOpenChange={(o) => !o && setQrReg(null)}
      />
    </SiteLayout>
  );
}
