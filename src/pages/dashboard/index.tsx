import { SiteLayout } from "@/components/layout/SiteLayout";
import { useAuth } from "@/lib/auth";
import { useLocation, Link } from "wouter";
import { useGetUserDashboard } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Bell, Settings, LogOut, ArrowLeft, QrCode, FileText, Sparkles, GraduationCap } from "lucide-react";
import { TrainingProgramCard } from "@/components/cards/TrainingProgramCard";
import { Skeleton } from "@/components/ui/skeleton";
import { QrTicketDialog } from "@/components/dashboard/QrTicketDialog";
import type { Registration } from "@/lib/api/types";
import { useState } from "react";
import { EventCard } from "@/components/cards/EventCard";
import { useTranslation } from "react-i18next";
import { useLocalized } from "@/lib/localized-content";

export default function Dashboard() {
  const { t } = useTranslation();
  const { dateLocale } = useLocalized();
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [qrReg, setQrReg] = useState<Registration | null>(null);

  const { data: dashData, isLoading } = useGetUserDashboard({
    query: {
      enabled: !!user
    }
  });

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-primary text-white p-8 rounded-2xl mb-8 shadow-lg">
          <div className="flex items-center gap-6 mb-6 md:mb-0">
            <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold border-2 border-white/50 shadow-inner">
              {user?.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {t("dashboard.welcome", { name: user?.name ?? "" })}
              </h1>
              <p className="text-primary-light opacity-90">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <Link href="/dashboard/profile">
               <Button variant="secondary" className="flex-1 md:flex-none gap-2 text-primary font-bold">
                 <Settings className="h-4 w-4" /> {t("dashboard.accountSettings")}
               </Button>
             </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <Card className="border-t-4 border-primary shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  {t("dashboard.upcomingRegistrations")}
                </CardTitle>
                <div className="flex gap-3">
                  <Link href="/dashboard/training" className="text-sm text-primary hover:underline flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    {t("training.myEnrollments")}
                  </Link>
                  <Link href="/dashboard/bookings" className="text-sm text-primary hover:underline flex items-center gap-1">
                    {t("dashboard.viewAll")} <ArrowLeft className="h-3 w-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : dashData?.upcomingRegistrations && dashData.upcomingRegistrations.length > 0 ? (
                  <div className="space-y-4">
                    {dashData.upcomingRegistrations.map(reg => (
                      <div key={reg.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-xl hover:border-primary/50 transition-colors">
                        <div className="bg-primary/10 text-primary p-3 rounded-lg self-start sm:self-center">
                           <Calendar className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{reg.eventTitle}</h4>
                          <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            <span>{reg.eventStartDate ? new Date(reg.eventStartDate).toLocaleDateString(dateLocale) : ''}</span>
                            <span>•</span>
                            <span>{reg.eventLocation}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                           {reg.qrCode && reg.status === "confirmed" && (
                             <Button
                               variant="outline"
                               size="sm"
                               className="gap-2"
                               onClick={() => setQrReg(reg)}
                             >
                               <QrCode className="h-4 w-4" /> {t("dashboard.ticket")}
                             </Button>
                           )}
                           <span className={`px-3 py-1.5 rounded text-xs font-bold self-center ${
                             reg.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                             reg.status === 'waitlist' ? 'bg-yellow-100 text-yellow-700' :
                             'bg-gray-100 text-gray-700'
                           }`}>
                             {reg.status === 'confirmed'
                               ? t("dashboard.statusConfirmed")
                               : reg.status === 'waitlist'
                                 ? t("dashboard.statusWaitlist")
                                 : t("dashboard.statusCancelled")}
                           </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>{t("dashboard.noRegistrations")}</p>
                    <Link href="/activites">
                      <Button variant="link" className="text-primary mt-2">{t("dashboard.browseActivities")}</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {dashData?.applications && dashData.applications.length > 0 && (
              <Card className="border-t-4 border-accent shadow-sm">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <FileText className="h-5 w-5 text-accent" />
                    {t("dashboard.myApplications")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {dashData.applications.map((app) => (
                    <div
                      key={`${app.type}-${app.id}`}
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{app.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(app.date).toLocaleDateString(dateLocale)}
                        </p>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded bg-primary/10 text-primary">
                        {app.status}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {dashData?.trainingEnrollments && dashData.trainingEnrollments.length > 0 && (
              <Card className="shadow-sm border-t-4 border-secondary">
                <CardHeader className="pb-2 border-b flex flex-row justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-secondary" />
                    {t("training.myEnrollments")}
                  </CardTitle>
                  <Link href="/dashboard/training" className="text-sm text-primary hover:underline">
                    {t("dashboard.viewAll")}
                  </Link>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {dashData.trainingEnrollments.slice(0, 3).map((e) => (
                    <div key={e.id} className="p-3 border rounded-lg">
                      <p className="font-medium">{e.programTitle}</p>
                      <p className="text-xs text-muted-foreground">{e.programLocation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {dashData?.recommendedTrainingPrograms &&
              dashData.recommendedTrainingPrograms.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {t("training.recommended")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 grid sm:grid-cols-2 gap-4">
                  {dashData.recommendedTrainingPrograms.map((p) => (
                    <TrainingProgramCard key={p.id} program={p} />
                  ))}
                </CardContent>
              </Card>
            )}

            {dashData?.recommendedEvents && dashData.recommendedEvents.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {t("dashboard.recommended")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 grid sm:grid-cols-2 gap-4">
                  {dashData.recommendedEvents.map((ev) => (
                    <EventCard key={ev.id} event={ev} />
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="shadow-sm">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-accent" />
                  {t("dashboard.notifications")}
                  {dashData?.unreadNotificationsCount ? (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full mr-auto">
                      {dashData.unreadNotificationsCount}
                    </span>
                  ) : null}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 p-0">
                {isLoading ? (
                  <div className="p-4 space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : dashData?.recentNotifications && dashData.recentNotifications.length > 0 ? (
                  <div className="divide-y">
                    {dashData.recentNotifications.map(notif => (
                      <div key={notif.id} className={`p-4 hover:bg-gray-50 transition-colors ${!notif.isRead ? 'bg-blue-50/30' : ''}`}>
                        <p className={`text-sm ${!notif.isRead ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                          {notif.message}
                        </p>
                        <span className="text-xs text-gray-400 mt-2 block">
                          {new Date(notif.createdAt).toLocaleDateString(dateLocale)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 px-4">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">{t("dashboard.noNotifications")}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm bg-gray-50 border-dashed">
              <CardContent className="p-6">
                <Button 
                  variant="outline" 
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 gap-2 border-red-200"
                  onClick={() => {
                    logout();
                    setLocation("/");
                  }}
                >
                  <LogOut className="h-4 w-4" /> {t("dashboard.signOut")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <QrTicketDialog
        registration={qrReg}
        open={!!qrReg}
        onOpenChange={(o) => !o && setQrReg(null)}
      />
    </SiteLayout>
  );
}
