import type { AdminPortalSummary } from "../types";
import { getStore, withDelay } from "./store";

export async function getAdminPortalSummary(): Promise<AdminPortalSummary> {
  return withDelay(() => {
    const store = getStore();
    const pendingClubs = store.clubProfiles.filter((c) => c.status === "pending");
    const pendingPrograms = store.trainingPrograms.filter(
      (p) => p.status === "submitted",
    );
    const pendingPartnerships = store.partnerships.filter(
      (p) => p.status === "pending",
    );
    const pendingAppointments = store.appointments.filter(
      (a) => a.status === "pending",
    );
    const pendingDiwan = store.diwanMembers.filter((d) => d.status === "pending");

    return {
      pendingClubAccounts: pendingClubs.length,
      pendingTrainingPrograms: pendingPrograms.length,
      pendingPartnerships: pendingPartnerships.length,
      pendingAppointments: pendingAppointments.length,
      pendingDiwanApplications: pendingDiwan.length,
      recentPendingClubs: pendingClubs.slice(0, 5),
      recentSubmittedPrograms: pendingPrograms.slice(0, 5),
    };
  });
}
