import { describe, it, expect } from "vitest";
import { buildEventIcs } from "./ics";

describe("buildEventIcs", () => {
  it("includes event title and VCALENDAR", () => {
    const ics = buildEventIcs({
      id: 1,
      userId: 2,
      eventId: 3,
      status: "confirmed",
      registeredAt: "2026-01-01T00:00:00Z",
      eventTitle: "ورشة البرمجة",
      eventStartDate: "2026-06-15T09:00:00Z",
      eventLocation: "بجاية",
      qrCode: "ODEJ-3-2-1",
    });
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("ورشة البرمجة");
    expect(ics).toContain("END:VEVENT");
  });
});
