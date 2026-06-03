export type UserRole =
  | "public"
  | "club"
  | "staff"
  | "khilya_staff"
  | "admin"
  | "super_admin";

export type ClubProfileStatus = "pending" | "approved" | "rejected";

export type TrainingProgramStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "published";

export type TrainingProgramFormat = "workshop" | "course" | "camp";

export type TrainingProgramLevel = "beginner" | "intermediate" | "advanced" | "all";

export type TrainingEnrollmentStatus = "confirmed" | "waitlist" | "cancelled";

export interface NotificationPreferences {
  eventReminders?: boolean;
  appointmentUpdates?: boolean;
  diwanUpdates?: boolean;
  newsletter?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  phone?: string | null;
  wilaya?: string | null;
  birthdate?: string | null;
  createdAt: string;
  verified?: boolean;
  bannedAt?: string | null;
  notificationPreferences?: NotificationPreferences;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  wilaya?: string;
  birthdate?: string;
}

export interface ClubAgreementUpload {
  fileName: string;
  mimeType: string;
  dataUrl: string;
}

export interface RegisterClubInput {
  organizationName: string;
  contactName: string;
  email: string;
  password: string;
  phone?: string;
  wilayaCode: string;
  category: string;
  address?: string;
  registrationNumber?: string;
  agreement: ClubAgreementUpload;
}

export interface ClubProfile {
  id: number;
  userId: number;
  organizationName: string;
  registrationNumber?: string;
  category: string;
  wilayaCode: string;
  address?: string;
  logo?: string;
  status: ClubProfileStatus;
  partnershipId?: number;
  agreementFileName?: string;
  agreementMimeType?: string;
  agreementDataUrl?: string;
  agreementUploadedAt?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export interface TrainingProgram {
  id: number;
  slug: string;
  title: string;
  titleFr?: string;
  titleEn?: string;
  titleKab?: string;
  description?: string;
  descriptionAr?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  clubProfileId?: number;
  clubName?: string;
  institutionId?: number;
  wilayaCode: string;
  format: TrainingProgramFormat;
  level: TrainingProgramLevel;
  capacity: number;
  enrollmentCount?: number;
  startDate: string;
  endDate?: string;
  location: string;
  status: TrainingProgramStatus;
  featuredImage?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewNote?: string;
  createdAt: string;
}

export interface TrainingEnrollment {
  id: number;
  userId: number;
  programId: number;
  status: TrainingEnrollmentStatus;
  enrolledAt: string;
  cancelledAt?: string;
  programTitle?: string;
  programStartDate?: string;
  programLocation?: string;
}

export interface Institution {
  id: number;
  name: string;
  nameAr: string;
  nameEn?: string;
  nameKab?: string;
  slug: string;
  type: string;
  description?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  descriptionKab?: string;
  /** Two-digit wilaya code (01–69) */
  wilayaCode?: string;
  address: string;
  commune: string;
  phone?: string;
  email?: string;
  capacity?: number;
  directorName?: string;
  openingHours?: string;
  images?: string[];
  services?: string[];
  coordinates?: { lat: number; lng: number };
  featuredImage?: string;
  coverImage?: string;
  activitiesCount?: number;
}

export interface Article {
  id: number;
  title: string;
  titleFr?: string;
  titleEn?: string;
  titleKab?: string;
  slug: string;
  excerpt?: string;
  excerptFr?: string;
  excerptEn?: string;
  excerptKab?: string;
  body?: string;
  featuredImage?: string;
  categoryId?: number;
  categoryNameAr?: string;
  authorId?: number;
  authorName?: string;
  status: "draft" | "published" | "archived";
  publishedAt?: string;
  scheduledAt?: string;
  createdAt?: string;
  readingTimeMinutes?: number;
  readingTime?: number;
  tags?: string[];
  seoTitle?: string;
  seoDesc?: string;
}

export interface Event {
  id: number;
  title: string;
  titleFr?: string;
  titleEn?: string;
  titleKab?: string;
  slug: string;
  description?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  descriptionKab?: string;
  institutionId?: number;
  institutionName?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  capacity?: number;
  registrationCount?: number;
  status: "draft" | "published" | "archived" | "cancelled" | "completed";
  categoryId?: number;
  featuredImage?: string;
  categoryNameAr?: string;
  institutionNameAr?: string;
  isDiwan?: boolean;
}

export interface Registration {
  id: number;
  userId: number;
  eventId: number;
  status: "confirmed" | "waitlist" | "cancelled";
  qrCode?: string;
  registeredAt: string;
  cancelledAt?: string;
  eventTitle?: string;
  eventStartDate?: string;
  eventLocation?: string;
}

export interface Appointment {
  id: number;
  userId: number;
  userName?: string;
  counsellorId?: number;
  institutionId?: number;
  institutionName?: string;
  type: string;
  dateTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  createdAt: string;
}

export interface Counsellor {
  id: number;
  userId?: number;
  name: string;
  nameAr?: string;
  specialty: string;
  institutionId: number;
  photo?: string;
  active: boolean;
}

export interface AppointmentSlot {
  id: number;
  counsellorId: number;
  institutionId: number;
  startTime: string;
  endTime: string;
  booked: boolean;
}

export interface Campaign {
  id: number;
  title: string;
  description?: string;
  coverImage?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface Partnership {
  id: number;
  associationName: string;
  logo?: string;
  description?: string;
  category?: string;
  status: "pending" | "approved" | "rejected";
  startDate?: string;
  endDate?: string;
  conventionDoc?: string;
}

export interface DiwanProject {
  id: number;
  title: string;
  description?: string;
  image?: string;
  coverImage?: string;
  status?: string;
  memberName?: string;
}

export interface DiwanMember {
  id: number;
  userId: number;
  userName?: string;
  applicationText?: string;
  status: "pending" | "approved" | "rejected";
  acceptedAt?: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  type: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface StaticPage {
  id: string;
  titleAr: string;
  titleFr: string;
  path: string;
  excerptAr?: string;
  excerptFr?: string;
}

export interface MediaFile {
  id: number;
  url: string;
  type: "image" | "pdf" | "video";
  name: string;
  size?: number;
  alt?: string;
  uploadedBy?: number;
  folder?: string;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  siteNameFr?: string;
  tagline: string;
  taglineFr?: string;
  contactEmail: string;
  contactPhone?: string;
  facebookUrl?: string;
  siteUrl: string;
  seoDefaultTitle?: string;
  seoDefaultDesc?: string;
  announcementBanner?: { enabled: boolean; text: string };
  maintenanceMode?: { enabled: boolean; message: string };
}

export interface ApplicationSummary {
  type: "khilya" | "diwan";
  id: number;
  title: string;
  status: string;
  date: string;
}

export interface DashboardStats {
  totalUsers: number;
  eventsThisMonth: number;
  newRegistrationsThisMonth: number;
  activeInstitutions: number;
  registrationsByMonth?: { month: string; count: number }[];
  usersByRole?: { role: string; count: number }[];
  usersByMonth?: { month: string; count: number }[];
  eventsByCategory?: { category: string; count: number }[];
  totalArticles?: number;
  totalEvents?: number;
  pendingAppointments?: number;
  pendingPartnerships?: number;
}

export interface AdminPortalSummary {
  pendingClubAccounts: number;
  pendingTrainingPrograms: number;
  pendingPartnerships: number;
  pendingAppointments: number;
  pendingDiwanApplications: number;
  recentPendingClubs: ClubProfile[];
  recentSubmittedPrograms: TrainingProgram[];
}

export interface UserDashboard {
  upcomingRegistrations: Registration[];
  recentNotifications: Notification[];
  unreadNotificationsCount: number;
  applications?: ApplicationSummary[];
  recommendedEvents?: Event[];
  trainingEnrollments?: TrainingEnrollment[];
  recommendedTrainingPrograms?: TrainingProgram[];
}

export interface ClubDashboard {
  profile: ClubProfile;
  programsByStatus: Record<TrainingProgramStatus, number>;
  recentPrograms: TrainingProgram[];
}

export interface GlobalSearchResult {
  total: number;
  articles?: Article[];
  events?: Event[];
  institutions?: Institution[];
  pages?: StaticPage[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
