import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    message: "تم تأكيد تسجيلك في ورشة البرمجة",
    isRead: false,
    link: "/dashboard/bookings",
  },
  {
    id: 2,
    message: "فعالية جديدة: يوم رياضي مفتوح",
    isRead: false,
    link: "/activites/journee-sportive",
  },
  {
    id: 3,
    message: "مرحباً بك في منصة ODEJ بجاية",
    isRead: true,
    link: "/",
  },
];

export function NotificationBell() {
  const { user } = useAuth();
  const { t } = useTranslation();
  if (!user) return null;

  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary-dark relative"
          aria-label={t("notifications.title")}
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -start-0.5 h-4 w-4 rounded-full bg-accent text-[10px] font-bold flex items-center justify-center text-white">
              {unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>{t("notifications.title")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MOCK_NOTIFICATIONS.map((n) => (
          <DropdownMenuItem key={n.id} asChild>
            <Link
              href={n.link}
              className={`cursor-pointer ${!n.isRead ? "font-semibold" : ""}`}
            >
              {n.message}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="text-primary text-center w-full">
            {t("notifications.viewAll")}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
