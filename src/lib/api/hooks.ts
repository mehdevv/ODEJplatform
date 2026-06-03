import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type {
  Article,
  AuthResponse,
  ClubDashboard,
  ClubProfile,
  DashboardStats,
  Event,
  GlobalSearchResult,
  Institution,
  LoginInput,
  PaginatedResponse,
  RegisterClubInput,
  RegisterInput,
  TrainingEnrollment,
  TrainingProgram,
  User,
  UserDashboard,
  AdminPortalSummary,
} from "./types";
import * as api from "./mock/services";

type QueryOpts<T> = Omit<UseQueryOptions<T>, "queryKey" | "queryFn">;

// Query keys
export const getListArticlesQueryKey = () => ["articles"] as const;
export const getGetArticleQueryKey = (slug: string) => ["articles", slug] as const;
export const getListInstitutionsQueryKey = () => ["institutions"] as const;
export const getGetInstitutionQueryKey = (slug: string) =>
  ["institutions", slug] as const;
export const getListEventsQueryKey = () => ["events"] as const;
export const getGetEventQueryKey = (slug: string) => ["events", slug] as const;
export const getListRegistrationsQueryKey = () => ["registrations"] as const;
export const getListUsersQueryKey = () => ["users"] as const;
export const getListPartnershipsQueryKey = () => ["partnerships"] as const;
export const getListAppointmentsQueryKey = () => ["appointments"] as const;
export const getListDiwanMembersQueryKey = () => ["diwanMembers"] as const;

// Auth
export function useGetCurrentUser(options?: { query?: QueryOpts<User | null> }) {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => api.getCurrentUser(),
    ...options?.query,
  });
}

export function useLogin(
  options?: UseMutationOptions<AuthResponse, Error, { data: LoginInput }>,
) {
  return useMutation({
    mutationFn: ({ data }) => api.login(data),
    ...options,
  });
}

export function useRegister(
  options?: UseMutationOptions<AuthResponse, Error, { data: RegisterInput }>,
) {
  return useMutation({
    mutationFn: ({ data }) => api.register(data),
    ...options,
  });
}

export function useLogout(options?: UseMutationOptions<void, Error, void>) {
  return useMutation({
    mutationFn: () => api.logout(),
    ...options,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: ({ data }: { data: { email: string } }) =>
      api.forgotPassword(data.email),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      api.updateUser(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

// Articles
export function useListArticles(
  params?: Parameters<typeof api.listArticles>[0],
  options?: { query?: QueryOpts<PaginatedResponse<Article>> },
) {
  return useQuery({
    queryKey: [...getListArticlesQueryKey(), params],
    queryFn: () => api.listArticles(params),
    ...options?.query,
  });
}

export function useGetArticle(
  slug: string,
  options?: { query?: QueryOpts<Article | null> },
) {
  return useQuery({
    queryKey: getGetArticleQueryKey(slug),
    queryFn: () => api.getArticle(slug),
    ...options?.query,
  });
}

export function useGetRelatedArticles(
  slug: string,
  options?: { query?: QueryOpts<Article[]> },
) {
  return useQuery({
    queryKey: ["articles", slug, "related"],
    queryFn: () => api.getRelatedArticles(slug),
    ...options?.query,
  });
}

export function useCreateArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: Omit<Article, "id"> }) =>
      api.createArticle(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListArticlesQueryKey() }),
  });
}

export function useUpdateArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<Article> }) =>
      api.updateArticle(slug, data),
    onSuccess: (_, { slug }) => {
      qc.invalidateQueries({ queryKey: getListArticlesQueryKey() });
      qc.invalidateQueries({ queryKey: getGetArticleQueryKey(slug) });
    },
  });
}

export function useDeleteArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (arg: string | { slug: string }) =>
      api.deleteArticle(typeof arg === "string" ? arg : arg.slug),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListArticlesQueryKey() }),
  });
}

// Institutions
export function useListInstitutions(
  params?: Parameters<typeof api.listInstitutions>[0],
  options?: { query?: QueryOpts<PaginatedResponse<Institution>> },
) {
  return useQuery({
    queryKey: [...getListInstitutionsQueryKey(), params],
    queryFn: () => api.listInstitutions(params),
    ...options?.query,
  });
}

export function useGetInstitution(
  slug: string,
  options?: { query?: QueryOpts<Institution | null> },
) {
  return useQuery({
    queryKey: getGetInstitutionQueryKey(slug),
    queryFn: () => api.getInstitution(slug),
    ...options?.query,
  });
}

export function useDeleteInstitution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteInstitution(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: getListInstitutionsQueryKey() }),
  });
}

// Events
export function useListEvents(
  params?: Parameters<typeof api.listEvents>[0],
  options?: { query?: QueryOpts<PaginatedResponse<Event>> },
) {
  return useQuery({
    queryKey: [...getListEventsQueryKey(), params],
    queryFn: () => api.listEvents(params),
    ...options?.query,
  });
}

export function useGetEvent(
  slug: string,
  options?: { query?: QueryOpts<Event | null> },
) {
  return useQuery({
    queryKey: getGetEventQueryKey(slug),
    queryFn: () => api.getEvent(slug),
    ...options?.query,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: Omit<Event, "id"> }) => api.createEvent(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListEventsQueryKey() }),
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<Event> }) =>
      api.updateEvent(slug, data),
    onSuccess: (_, { slug }) => {
      qc.invalidateQueries({ queryKey: getListEventsQueryKey() });
      qc.invalidateQueries({ queryKey: getGetEventQueryKey(slug) });
    },
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (arg: string | { slug: string }) =>
      api.deleteEvent(typeof arg === "string" ? arg : arg.slug),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListEventsQueryKey() }),
  });
}

// Registrations
export function useCreateRegistration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: { eventId: number } }) =>
      api.createRegistration(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListRegistrationsQueryKey() });
      qc.invalidateQueries({ queryKey: getListEventsQueryKey() });
      qc.invalidateQueries({ queryKey: ["userDashboard"] });
    },
  });
}

export function useListRegistrations(
  params?: Parameters<typeof api.listRegistrations>[0],
  options?: { query?: QueryOpts<{ data: import("./types").Registration[] }> },
) {
  return useQuery({
    queryKey: [...getListRegistrationsQueryKey(), params],
    queryFn: () => api.listRegistrations(params),
    ...options?.query,
  });
}

export function useCancelRegistration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => api.cancelRegistration(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListRegistrationsQueryKey() });
      qc.invalidateQueries({ queryKey: ["userDashboard"] });
    },
  });
}

// Appointments
export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: Parameters<typeof api.createAppointment>[0] }) =>
      api.createAppointment(data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: getListAppointmentsQueryKey() }),
  });
}

export function useListAppointments(
  params?: Parameters<typeof api.listAppointments>[0],
) {
  return useQuery({
    queryKey: [...getListAppointmentsQueryKey(), params],
    queryFn: () => api.listAppointments(params),
  });
}

export function useUpdateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { status: string } }) =>
      api.updateAppointment(id, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: getListAppointmentsQueryKey() }),
  });
}

// Campaigns, Diwan, Partnerships
export function useListCampaigns(params?: { limit?: number }) {
  return useQuery({
    queryKey: ["campaigns", params],
    queryFn: () => api.listCampaigns(params),
  });
}

export function useListDiwanProjects(params?: { limit?: number }) {
  return useQuery({
    queryKey: ["diwanProjects", params],
    queryFn: () => api.listDiwanProjects(params),
  });
}

export function useApplyDiwan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: { applicationText: string } }) =>
      api.applyDiwan(data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: getListDiwanMembersQueryKey() }),
  });
}

export function useListDiwanMembers(
  params?: Parameters<typeof api.listDiwanMembers>[0],
) {
  return useQuery({
    queryKey: [...getListDiwanMembersQueryKey(), params],
    queryFn: () => api.listDiwanMembers(params),
  });
}

export function useUpdateDiwanMemberStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { status: string } }) =>
      api.updateDiwanMemberStatus(id, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: getListDiwanMembersQueryKey() }),
  });
}

export function useListPartnerships(
  params?: Parameters<typeof api.listPartnerships>[0],
) {
  return useQuery({
    queryKey: [...getListPartnershipsQueryKey(), params],
    queryFn: () => api.listPartnerships(params),
  });
}

export function useCreatePartnership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: { associationName: string; description?: string } }) =>
      api.createPartnership(data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: getListPartnershipsQueryKey() }),
  });
}

export function useUpdatePartnershipStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { status: string } }) =>
      api.updatePartnershipStatus(id, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: getListPartnershipsQueryKey() }),
  });
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: ({ data }: { data: { name: string; email: string; subject: string; message: string } }) =>
      api.submitContact(data),
  });
}

// Dashboard & search
export function useGetUserDashboard(options?: {
  query?: QueryOpts<UserDashboard>;
}) {
  return useQuery({
    queryKey: ["userDashboard"],
    queryFn: () => api.getUserDashboard(),
    ...options?.query,
  });
}

export function useGetDashboardStats() {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => api.getDashboardStats(),
  });
}

export function useListUsers(params?: Parameters<typeof api.listUsers>[0]) {
  return useQuery({
    queryKey: [...getListUsersQueryKey(), params],
    queryFn: () => api.listUsers(params),
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { role: string } }) =>
      api.updateUserRole(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListUsersQueryKey() }),
  });
}

export function useGlobalSearch(
  params: { q: string; type?: string },
  options?: { query?: QueryOpts<GlobalSearchResult> },
) {
  return useQuery({
    queryKey: ["search", params],
    queryFn: () => api.globalSearch(params),
    ...options?.query,
  });
}

export function useVerifyEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId }: { userId: number }) => api.verifyEmail(userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUser"] }),
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: ({ userId }: { userId: number }) =>
      api.resendVerificationEmail(userId),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ data }: { data: { token: string; password: string } }) =>
      api.resetPassword(data),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      data,
    }: {
      data: { userId: number; currentPassword: string; newPassword: string };
    }) => api.changePassword(data),
  });
}

export function useDeleteUserAccount() {
  return useMutation({
    mutationFn: (userId: number) => api.deleteUserAccount(userId),
  });
}

export function useCreateInstitution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: Omit<import("./types").Institution, "id"> }) =>
      api.createInstitution(data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: getListInstitutionsQueryKey() }),
  });
}

export function useUpdateInstitution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<import("./types").Institution> }) =>
      api.updateInstitution(id, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: getListInstitutionsQueryKey() }),
  });
}

export function useBulkUpdateArticles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      data,
    }: {
      data: { slugs: string[]; status: import("./types").Article["status"] };
    }) => api.bulkUpdateArticles(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListArticlesQueryKey() }),
  });
}

export function useExportRegistrationsCsv() {
  return useMutation({
    mutationFn: (eventId: number) => api.exportRegistrationsCsv(eventId),
  });
}

export function useExportUsersCsv() {
  return useMutation({
    mutationFn: () => api.exportUsersCsv(),
  });
}

export function useBanUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, banned }: { id: number; banned: boolean }) =>
      api.banUser(id, banned),
    onSuccess: () => qc.invalidateQueries({ queryKey: getListUsersQueryKey() }),
  });
}

export function useListCounsellors(params?: { institutionId?: number }) {
  return useQuery({
    queryKey: ["counsellors", params],
    queryFn: () => api.listCounsellors(params),
  });
}

export function useListAppointmentSlots(
  params: { counsellorId: number; institutionId?: number },
  options?: { query?: QueryOpts<{ data: import("./types").AppointmentSlot[] }> },
) {
  return useQuery({
    queryKey: ["appointmentSlots", params],
    queryFn: () => api.listAppointmentSlots(params),
    ...options?.query,
  });
}

export function useCreateAppointmentSlot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      data,
    }: {
      data: {
        counsellorId: number;
        institutionId: number;
        startTime: string;
        endTime: string;
      };
    }) => api.createAppointmentSlot(data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["appointmentSlots"] }),
  });
}

export function useDeleteAppointmentSlot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteAppointmentSlot(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["appointmentSlots"] }),
  });
}

export function useListMedia(
  params?: Parameters<typeof api.listMedia>[0],
) {
  return useQuery({
    queryKey: ["media", params],
    queryFn: () => api.listMedia(params),
  });
}

export function useUploadMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      data,
    }: {
      data: Parameters<typeof api.uploadMedia>[0];
    }) => api.uploadMedia(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });
}

export function useDeleteMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteMedia(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });
}

export function useGetSiteSettings() {
  return useQuery({
    queryKey: ["siteSettings"],
    queryFn: () => api.getSiteSettings(),
  });
}

export function useUpdateSiteSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: Partial<import("./types").SiteSettings> }) =>
      api.updateSiteSettings(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["siteSettings"] }),
  });
}

// Club & training
export const getListTrainingProgramsQueryKey = () => ["trainingPrograms"] as const;
export const getGetTrainingProgramQueryKey = (slug: string) =>
  ["trainingPrograms", slug] as const;
export const getMyClubProfileQueryKey = () => ["clubProfile", "me"] as const;
export const getClubDashboardQueryKey = () => ["clubDashboard"] as const;

export function useRegisterClub(
  options?: UseMutationOptions<AuthResponse, Error, { data: RegisterClubInput }>,
) {
  return useMutation({
    mutationFn: ({ data }) => api.registerClub(data),
    ...options,
  });
}

export function useGetMyClubProfile(options?: { query?: QueryOpts<ClubProfile | null> }) {
  return useQuery({
    queryKey: getMyClubProfileQueryKey(),
    queryFn: () => api.getMyClubProfile(),
    ...options?.query,
  });
}

export function useGetClubProfileByUserId(
  userId: number,
  options?: { query?: QueryOpts<ClubProfile | null> },
) {
  return useQuery({
    queryKey: ["clubProfile", userId],
    queryFn: () => api.getClubProfileByUserId(userId),
    enabled: userId > 0,
    ...options?.query,
  });
}

export function useUpdateClubProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ClubProfile> }) =>
      api.updateClubProfile(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getMyClubProfileQueryKey() });
      qc.invalidateQueries({ queryKey: getClubDashboardQueryKey() });
    },
  });
}

export function useReviewClubProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { status: "approved" | "rejected"; reviewNote?: string };
    }) => api.reviewClubProfile(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clubProfiles"] });
      qc.invalidateQueries({ queryKey: getListUsersQueryKey() });
    },
  });
}

export function useListClubProfiles() {
  return useQuery({
    queryKey: ["clubProfiles"],
    queryFn: () => api.listClubProfiles(),
  });
}

export function useListTrainingPrograms(
  params?: Parameters<typeof api.listTrainingPrograms>[0],
  options?: { query?: QueryOpts<PaginatedResponse<TrainingProgram>> },
) {
  return useQuery({
    queryKey: [...getListTrainingProgramsQueryKey(), params],
    queryFn: () => api.listTrainingPrograms(params),
    ...options?.query,
  });
}

export function useGetTrainingProgram(
  slug: string,
  options?: { query?: QueryOpts<TrainingProgram | null> },
) {
  return useQuery({
    queryKey: getGetTrainingProgramQueryKey(slug),
    queryFn: () => api.getTrainingProgram(slug),
    enabled: !!slug,
    ...options?.query,
  });
}

export function useCreateTrainingProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      data,
    }: {
      data: Parameters<typeof api.createTrainingProgram>[0];
    }) => api.createTrainingProgram(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListTrainingProgramsQueryKey() });
      qc.invalidateQueries({ queryKey: getClubDashboardQueryKey() });
    },
  });
}

export function useUpdateTrainingProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TrainingProgram> }) =>
      api.updateTrainingProgram(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListTrainingProgramsQueryKey() });
      qc.invalidateQueries({ queryKey: getClubDashboardQueryKey() });
    },
  });
}

export function useSubmitTrainingProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.submitTrainingProgram(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListTrainingProgramsQueryKey() });
      qc.invalidateQueries({ queryKey: getClubDashboardQueryKey() });
    },
  });
}

export function useReviewTrainingProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Parameters<typeof api.reviewTrainingProgram>[1];
    }) => api.reviewTrainingProgram(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListTrainingProgramsQueryKey() });
    },
  });
}

export function useDeleteTrainingProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteTrainingProgram(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListTrainingProgramsQueryKey() });
      qc.invalidateQueries({ queryKey: getClubDashboardQueryKey() });
    },
  });
}

export function useEnrollInTrainingProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (programId: number) => api.enrollInTrainingProgram(programId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trainingEnrollments"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: getListTrainingProgramsQueryKey() });
    },
  });
}

export function useCancelTrainingEnrollment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.cancelTrainingEnrollment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trainingEnrollments"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useListMyTrainingEnrollments(
  options?: { query?: QueryOpts<TrainingEnrollment[]> },
) {
  return useQuery({
    queryKey: ["trainingEnrollments", "me"],
    queryFn: () => api.listMyTrainingEnrollments(),
    ...options?.query,
  });
}

export function useGetClubDashboard(options?: { query?: QueryOpts<ClubDashboard> }) {
  return useQuery({
    queryKey: getClubDashboardQueryKey(),
    queryFn: () => api.getClubDashboard(),
    ...options?.query,
  });
}

export { getPostLoginPath } from "./mock/training-services";

export const getAdminPortalSummaryQueryKey = () => ["adminPortalSummary"] as const;

export function useGetAdminPortalSummary(
  options?: { query?: QueryOpts<AdminPortalSummary> },
) {
  return useQuery({
    queryKey: getAdminPortalSummaryQueryKey(),
    queryFn: () => api.getAdminPortalSummary(),
    ...options?.query,
  });
}
