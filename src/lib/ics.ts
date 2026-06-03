import type { Registration } from "@/lib/api/types";

function formatIcsDate(iso: string): string {
  const d = new Date(iso);
  return d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

export function buildEventIcs(reg: Registration): string {
  const start = reg.eventStartDate
    ? formatIcsDate(reg.eventStartDate)
    : formatIcsDate(new Date().toISOString());
  const end = reg.eventStartDate
    ? formatIcsDate(
        new Date(
          new Date(reg.eventStartDate).getTime() + 2 * 60 * 60 * 1000,
        ).toISOString(),
      )
    : start;
  const uid = `odej-reg-${reg.id}@odejbejaia.dz`;
  const title = reg.eventTitle ?? "نشاط ODEJ";
  const location = reg.eventLocation ?? "بجاية";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ODEJ Bejaia//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatIcsDate(new Date().toISOString())}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    `DESCRIPTION:تسجيل ODEJ - ${reg.qrCode ?? ""}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadEventIcs(reg: Registration, filename?: string) {
  const ics = buildEventIcs(reg);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename ?? `odej-event-${reg.id}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
