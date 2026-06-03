import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetDashboardStats, useGetAdminPortalSummary } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Users, Calendar, Building, TrendingUp, GraduationCap, HeartHandshake, MessageCircle, Handshake, ChevronLeft } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTranslation } from "react-i18next";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useGetDashboardStats();
  const { data: summary, isLoading: summaryLoading } = useGetAdminPortalSummary();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: "إجمالي المستخدمين",
      value: stats?.totalUsers || 0,
      icon: Users,
      trend: "+12%",
      trendUp: true
    },
    {
      title: "نشاطات هذا الشهر",
      value: stats?.eventsThisMonth || 0,
      icon: Calendar,
      trend: "+5%",
      trendUp: true
    },
    {
      title: "تسجيلات جديدة",
      value: stats?.newRegistrationsThisMonth || 0,
      icon: TrendingUp,
      trend: "+18%",
      trendUp: true
    },
    {
      title: "المؤسسات النشطة",
      value: stats?.activeInstitutions || 0,
      icon: Building,
      trend: "0%",
      trendUp: true
    }
  ];

  const reviewTasks = [
    {
      key: "clubs",
      count: summary?.pendingClubAccounts ?? 0,
      href: "/admin/users",
      icon: Users,
      label: t("admin.taskClubs"),
    },
    {
      key: "training",
      count: summary?.pendingTrainingPrograms ?? 0,
      href: "/admin/training-programs",
      icon: GraduationCap,
      label: t("admin.taskTraining"),
    },
    {
      key: "partnerships",
      count: summary?.pendingPartnerships ?? 0,
      href: "/admin/partnerships",
      icon: Handshake,
      label: t("admin.taskPartnerships"),
    },
    {
      key: "khilya",
      count: summary?.pendingAppointments ?? 0,
      href: "/admin/khilya",
      icon: HeartHandshake,
      label: t("admin.taskKhilya"),
    },
    {
      key: "diwan",
      count: summary?.pendingDiwanApplications ?? 0,
      href: "/admin/diwan",
      icon: MessageCircle,
      label: t("admin.taskDiwan"),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("admin.overviewTitle")}</h1>
          <p className="text-muted-foreground mt-1">{t("admin.overviewDesc")}</p>
        </div>

        {!summaryLoading && reviewTasks.some((x) => x.count > 0) && (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-amber-900">
                {t("admin.reviewQueue")}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {reviewTasks
                .filter((x) => x.count > 0)
                .map((task) => (
                  <Link key={task.key} href={task.href}>
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <task.icon className="h-5 w-5 text-primary" />
                        <span className="font-medium text-sm">{task.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">{task.count}</Badge>
                        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
            </CardContent>
          </Card>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${i === 0 ? 'bg-blue-100 text-blue-600' : i === 1 ? 'bg-green-100 text-green-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend}
                  </span>
                  <span className="text-sm text-gray-500">مقارنة بالشهر الماضي</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users over time */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">تطور التسجيلات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {stats?.usersByMonth && stats.usersByMonth.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" dir="ltr">
                    <AreaChart data={stats.usersByMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
                      />
                      <Area type="monotone" dataKey="count" name="المستخدمين" stroke="#2E7D32" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">لا تتوفر بيانات كافية</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Events by category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">توزيع الأنشطة حسب التصنيف</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {stats?.eventsByCategory && stats.eventsByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" dir="ltr">
                    <BarChart data={stats.eventsByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip 
                        cursor={{ fill: '#f3f4f6' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="count" name="الأنشطة" fill="#E65100" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">لا تتوفر بيانات كافية</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">نظرة عامة على المحتوى</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-gray-800">{stats?.totalArticles || 0}</div>
                  <div className="text-sm text-gray-500">مقال منشور</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-gray-800">{stats?.totalEvents || 0}</div>
                  <div className="text-sm text-gray-500">فعالية مسجلة</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-gray-800">{stats?.pendingAppointments || 0}</div>
                  <div className="text-sm text-gray-500">موعد في الانتظار</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-gray-800">{stats?.pendingPartnerships || 0}</div>
                  <div className="text-sm text-gray-500">طلب شراكة</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-white border-0">
            <CardHeader>
              <CardTitle className="text-lg">تنبيهات النظام</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-accent mt-2 shrink-0" />
                  <div>
                     <p className="font-medium text-white/90">تحديث المنصة</p>
                     <p className="text-sm text-white/70">تم إطلاق النسخة الجديدة من البوابة الرقمية لولاية بجاية.</p>
                  </div>
                </div>
                {stats?.pendingAppointments ? (
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-red-400 mt-2 shrink-0" />
                    <div>
                       <p className="font-medium text-white/90">مواعيد بانتظار التأكيد</p>
                       <p className="text-sm text-white/70">هناك {stats.pendingAppointments} مواعيد في خلية الإصغاء بانتظار التأكيد.</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
