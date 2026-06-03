import type {
  Article,
  AuthResponse,
  Counsellor,
  DashboardStats,
  Event,
  GlobalSearchResult,
  Institution,
  LoginInput,
  MediaFile,
  PaginatedResponse,
  RegisterInput,
  SiteSettings,
  StaticPage,
  User,
  UserDashboard,
} from "../types";
import {
  DEMO_PASSWORDS,
  SEED_CAMPAIGNS,
  SEED_DIWAN_PROJECTS,
  SEED_NOTIFICATIONS,
  SEED_STATIC_PAGES,
} from "./seed";
import { getStore, getUsers, persistStore, withDelay } from "./store";

export function processScheduledArticles() {
  const store = getStore();
  const now = new Date();
  let changed = false;
  for (const a of store.articles) {
    if (
      a.status === "draft" &&
      a.scheduledAt &&
      new Date(a.scheduledAt) <= now
    ) {
      a.status = "published";
      a.publishedAt = a.scheduledAt;
      changed = true;
    }
  }
  if (changed) persistStore();
}

function paginate<T>(items: T[], page = 1, limit = 12): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages,
  };
}

function getCurrentUserId(): number | null {
  const token = localStorage.getItem("odej_token");
  if (!token) return null;
  const match = token.match(/^user-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

// Auth
export async function login(data: LoginInput): Promise<AuthResponse> {
  return withDelay(() => {
    const password = DEMO_PASSWORDS[data.email];
    if (!password || password !== data.password) {
      throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
    const user = getUsers().find((u) => u.email === data.email);
    if (!user) throw new Error("المستخدم غير موجود");
    if (user.bannedAt) throw new Error("تم تعليق هذا الحساب");
    const token = `user-${user.id}`;
    return { token, user };
  });
}

export async function register(data: RegisterInput): Promise<AuthResponse> {
  return withDelay(() => {
    if (getUsers().some((u) => u.email === data.email)) {
      throw new Error("البريد الإلكتروني مستخدم مسبقاً");
    }
    const store = getStore();
    const id = store.nextIds.user++;
    const user: User = {
      id,
      name: data.name,
      email: data.email,
      role: "public",
      phone: data.phone,
      wilaya: data.wilaya,
      birthdate: data.birthdate,
      createdAt: new Date().toISOString(),
      verified: false,
    };
    DEMO_PASSWORDS[data.email] = data.password;
    store.users.push(user);
    persistStore();
    return { token: `user-${id}`, user };
  });
}

export async function logout(): Promise<void> {
  return withDelay(() => undefined, 100);
}

export async function getCurrentUser(): Promise<User | null> {
  return withDelay(() => {
    const id = getCurrentUserId();
    if (!id) return null;
    return getUsers().find((u) => u.id === id) ?? null;
  }, 150);
}

export async function forgotPassword(email: string): Promise<{ resetToken: string }> {
  return withDelay(() => {
    const user = getUsers().find((u) => u.email === email);
    if (!user) throw new Error("البريد الإلكتروني غير مسجل");
    const token = `reset-${user.id}-${Date.now()}`;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("odej_reset_token", token);
      console.info("[Mock] Reset link:", `${window.location.origin}/auth/reset-password?token=${token}`);
    }
    return { resetToken: token };
  });
}

export async function resetPassword(data: {
  token: string;
  password: string;
}): Promise<void> {
  return withDelay(() => {
    const match = data.token.match(/^reset-(\d+)-/);
    if (!match) throw new Error("رابط غير صالح أو منتهي");
    const userId = parseInt(match[1], 10);
    const user = getUsers().find((u) => u.id === userId);
    if (!user) throw new Error("المستخدم غير موجود");
    DEMO_PASSWORDS[user.email] = data.password;
    sessionStorage.removeItem("odej_reset_token");
  });
}

export async function changePassword(data: {
  userId: number;
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  return withDelay(() => {
    const user = getUsers().find((u) => u.id === data.userId);
    if (!user) throw new Error("المستخدم غير موجود");
    if (DEMO_PASSWORDS[user.email] !== data.currentPassword) {
      throw new Error("كلمة المرور الحالية غير صحيحة");
    }
    DEMO_PASSWORDS[user.email] = data.newPassword;
  });
}

export async function verifyEmail(userId: number): Promise<User> {
  return withDelay(() => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx < 0) throw new Error("المستخدم غير موجود");
    users[idx].verified = true;
    persistStore();
    return users[idx];
  });
}

export async function resendVerificationEmail(_userId: number): Promise<void> {
  return withDelay(() => {
    console.info("[Mock] Verification email sent (simulated)");
  });
}

export async function deleteUserAccount(userId: number): Promise<void> {
  return withDelay(() => {
    const store = getStore();
    const idx = store.users.findIndex((u) => u.id === userId);
    if (idx < 0) throw new Error("المستخدم غير موجود");
    store.users[idx] = {
      ...store.users[idx],
      name: "مستخدم محذوف",
      email: `deleted-${userId}@odej.local`,
      phone: undefined,
      avatar: undefined,
      bannedAt: new Date().toISOString(),
    };
    persistStore();
    localStorage.removeItem("odej_token");
  });
}

export async function updateUser(
  id: number,
  data: Partial<User>,
): Promise<User> {
  return withDelay(() => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx < 0) throw new Error("المستخدم غير موجود");
    users[idx] = { ...users[idx], ...data };
    persistStore();
    return users[idx];
  });
}

// Articles
export async function listArticles(params?: {
  status?: string;
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Article>> {
  return withDelay(() => {
    let items = [...getStore().articles];
    if (params?.status) items = items.filter((a) => a.status === params.status);
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt?.toLowerCase().includes(q),
      );
    }
    if (params?.category) {
      items = items.filter(
        (a) =>
          a.categoryNameAr === params.category ||
          String(a.categoryId) === params.category,
      );
    }
    items.sort(
      (a, b) =>
        new Date(b.publishedAt || 0).getTime() -
        new Date(a.publishedAt || 0).getTime(),
    );
    return paginate(items, params?.page, params?.limit);
  });
}

export async function getArticle(slug: string): Promise<Article | null> {
  return withDelay(() => {
    const store = getStore();
    return (
      store.articles.find((a) => a.slug === slug || String(a.id) === slug) ??
      null
    );
  });
}

export async function getRelatedArticles(slug: string): Promise<Article[]> {
  return withDelay(() => {
    const current = getStore().articles.find((a) => a.slug === slug);
    return getStore()
      .articles.filter(
        (a) =>
          a.slug !== slug &&
          a.status === "published" &&
          (!current?.categoryId || a.categoryId === current.categoryId),
      )
      .slice(0, 3);
  });
}

export async function createArticle(
  data: Omit<Article, "id">,
): Promise<Article> {
  return withDelay(() => {
    const store = getStore();
    const article: Article = {
      ...data,
      id: store.nextIds.article++,
      publishedAt:
        data.status === "published"
          ? new Date().toISOString()
          : data.publishedAt,
      createdAt: new Date().toISOString(),
    };
    store.articles.unshift(article);
    persistStore();
    return article;
  });
}

export async function updateArticle(
  slug: string,
  data: Partial<Article>,
): Promise<Article> {
  return withDelay(() => {
    const store = getStore();
    const idx = store.articles.findIndex((a) => a.slug === slug);
    if (idx < 0) throw new Error("المقال غير موجود");
    store.articles[idx] = { ...store.articles[idx], ...data };
    persistStore();
    return store.articles[idx];
  });
}

export async function deleteArticle(slug: string): Promise<void> {
  return withDelay(() => {
    const store = getStore();
    store.articles = store.articles.filter((a) => a.slug !== slug);
    persistStore();
  });
}

// Institutions
export async function listInstitutions(params?: {
  search?: string;
  type?: string;
  wilayaCode?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Institution>> {
  return withDelay(() => {
    let items = [...getStore().institutions];
    if (params?.wilayaCode) {
      const code = params.wilayaCode.padStart(2, "0");
      items = items.filter(
        (i) => (i.wilayaCode ?? "06").padStart(2, "0") === code,
      );
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.nameAr.includes(params.search!) ||
          i.name.toLowerCase().includes(q) ||
          i.commune.includes(params.search!),
      );
    }
    if (params?.type) items = items.filter((i) => i.type === params.type);
    return paginate(items, params?.page, params?.limit);
  });
}

export async function getInstitution(slug: string): Promise<Institution | null> {
  return withDelay(() =>
    getStore().institutions.find((i) => i.slug === slug) ?? null,
  );
}

export async function createInstitution(
  data: Omit<Institution, "id">,
): Promise<Institution> {
  return withDelay(() => {
    const store = getStore();
    const inst: Institution = { ...data, id: store.nextIds.institution++ };
    store.institutions.push(inst);
    persistStore();
    return inst;
  });
}

export async function updateInstitution(
  id: number,
  data: Partial<Institution>,
): Promise<Institution> {
  return withDelay(() => {
    const store = getStore();
    const idx = store.institutions.findIndex((i) => i.id === id);
    if (idx < 0) throw new Error("المؤسسة غير موجودة");
    store.institutions[idx] = { ...store.institutions[idx], ...data };
    persistStore();
    return store.institutions[idx];
  });
}

export async function deleteInstitution(id: number): Promise<void> {
  return withDelay(() => {
    const store = getStore();
    store.institutions = store.institutions.filter((i) => i.id !== id);
    persistStore();
  });
}

// Events
export async function listEvents(params?: {
  search?: string;
  status?: string;
  category?: string;
  institutionId?: number;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Event>> {
  return withDelay(() => {
    let items = [...getStore().events];
    if (params?.institutionId)
      items = items.filter((e) => e.institutionId === params.institutionId);
    if (params?.status) items = items.filter((e) => e.status === params.status);
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q),
      );
    }
    items.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
    return paginate(items, params?.page, params?.limit);
  });
}

export async function getEvent(slug: string): Promise<Event | null> {
  return withDelay(() =>
    getStore().events.find((e) => e.slug === slug) ?? null,
  );
}

export async function createEvent(data: Omit<Event, "id">): Promise<Event> {
  return withDelay(() => {
    const store = getStore();
    const event: Event = { ...data, id: store.nextIds.event++ };
    store.events.unshift(event);
    persistStore();
    return event;
  });
}

export async function updateEvent(
  slug: string,
  data: Partial<Event>,
): Promise<Event> {
  return withDelay(() => {
    const store = getStore();
    const idx = store.events.findIndex((e) => e.slug === slug);
    if (idx < 0) throw new Error("النشاط غير موجود");
    store.events[idx] = { ...store.events[idx], ...data };
    persistStore();
    return store.events[idx];
  });
}

export async function deleteEvent(slug: string): Promise<void> {
  return withDelay(() => {
    const store = getStore();
    store.events = store.events.filter((e) => e.slug !== slug);
    persistStore();
  });
}

// Registrations
export async function createRegistration(data: {
  eventId: number;
}): Promise<void> {
  return withDelay(() => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("يجب تسجيل الدخول");
    const store = getStore();
    const event = store.events.find((e) => e.id === data.eventId);
    if (!event) throw new Error("النشاط غير موجود");
    if (
      store.registrations.some(
        (r) =>
          r.userId === userId &&
          r.eventId === data.eventId &&
          r.status !== "cancelled",
      )
    ) {
      throw new Error("أنت مسجل مسبقاً في هذا النشاط");
    }
    const isFull =
      event.capacity &&
      (event.registrationCount ?? 0) >= event.capacity;
    const regId = store.nextIds.registration++;
    const reg = {
      id: regId,
      userId,
      eventId: data.eventId,
      status: isFull ? ("waitlist" as const) : ("confirmed" as const),
      qrCode: `ODEJ-${data.eventId}-${userId}-${Date.now()}`,
      registeredAt: new Date().toISOString(),
      eventTitle: event.title,
      eventStartDate: event.startDate,
      eventLocation: event.location,
    };
    store.registrations.push(reg);
    if (!isFull) event.registrationCount = (event.registrationCount ?? 0) + 1;
    persistStore();
  });
}

export async function listRegistrations(params?: {
  userId?: number;
  eventId?: number;
  status?: string;
  past?: boolean;
}) {
  return withDelay(() => {
    let items = [...getStore().registrations];
    if (params?.userId) items = items.filter((r) => r.userId === params.userId);
    if (params?.eventId) items = items.filter((r) => r.eventId === params.eventId);
    if (params?.status) items = items.filter((r) => r.status === params.status);
    if (params?.past !== undefined) {
      const now = new Date();
      items = items.filter((r) => {
        if (!r.eventStartDate) return false;
        const isPast = new Date(r.eventStartDate) < now;
        return params.past ? isPast : !isPast;
      });
    }
    return { data: items };
  });
}

export async function exportRegistrationsCsv(eventId: number): Promise<string> {
  return withDelay(() => {
    const store = getStore();
    const regs = store.registrations.filter(
      (r) => r.eventId === eventId && r.status !== "cancelled",
    );
    const header = "id,userId,status,registeredAt,eventTitle\n";
    const rows = regs
      .map(
        (r) =>
          `${r.id},${r.userId},${r.status},${r.registeredAt},"${r.eventTitle ?? ""}"`,
      )
      .join("\n");
    return header + rows;
  });
}

export async function cancelRegistration(id: number): Promise<void> {
  return withDelay(() => {
    const store = getStore();
    const reg = store.registrations.find((r) => r.id === id);
    if (reg) {
      reg.status = "cancelled";
      const event = store.events.find((e) => e.id === reg.eventId);
      if (event && event.registrationCount)
        event.registrationCount = Math.max(0, event.registrationCount - 1);
    }
    persistStore();
  });
}

// Appointments & Khilya
export async function listCounsellors(params?: { institutionId?: number }) {
  return withDelay(() => {
    let items = getStore().counsellors.filter((c) => c.active);
    if (params?.institutionId)
      items = items.filter((c) => c.institutionId === params.institutionId);
    return { data: items };
  });
}

export async function listAppointmentSlots(params: {
  counsellorId: number;
  institutionId?: number;
}) {
  return withDelay(() => {
    const now = new Date();
    const items = getStore().appointmentSlots.filter(
      (s) =>
        s.counsellorId === params.counsellorId &&
        !s.booked &&
        new Date(s.startTime) > now &&
        (!params.institutionId || s.institutionId === params.institutionId),
    );
    return { data: items };
  });
}

export async function createAppointmentSlot(data: {
  counsellorId: number;
  institutionId: number;
  startTime: string;
  endTime: string;
}) {
  return withDelay(() => {
    const store = getStore();
    const slot = {
      id: store.nextIds.slot++,
      ...data,
      booked: false,
    };
    store.appointmentSlots.push(slot);
    persistStore();
    return slot;
  });
}

export async function deleteAppointmentSlot(id: number): Promise<void> {
  return withDelay(() => {
    const store = getStore();
    store.appointmentSlots = store.appointmentSlots.filter((s) => s.id !== id);
    persistStore();
  });
}

export async function createAppointment(data: {
  type: string;
  institutionId?: number;
  counsellorId?: number;
  slotId?: number;
  dateTime: string;
  notes?: string;
}) {
  return withDelay(() => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("يجب تسجيل الدخول");
    const store = getStore();
    if (data.slotId) {
      const slot = store.appointmentSlots.find((s) => s.id === data.slotId);
      if (!slot || slot.booked) throw new Error("الموعد غير متاح");
      slot.booked = true;
      data.dateTime = slot.startTime;
      data.counsellorId = slot.counsellorId;
      data.institutionId = slot.institutionId;
    }
    const user = getUsers().find((u) => u.id === userId);
    const inst = store.institutions.find((i) => i.id === data.institutionId);
    const apt = {
      id: store.nextIds.appointment++,
      userId,
      userName: user?.name,
      counsellorId: data.counsellorId,
      institutionId: data.institutionId,
      institutionName: inst?.nameAr,
      type: data.type,
      dateTime: data.dateTime,
      status: "pending" as const,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };
    store.appointments.push(apt);
    persistStore();
    return apt;
  });
}

export async function listAppointments(params?: {
  status?: string;
  userId?: number;
  counsellorId?: number;
  page?: number;
  limit?: number;
}) {
  return withDelay(() => {
    let items = [...getStore().appointments];
    if (params?.status) items = items.filter((a) => a.status === params.status);
    if (params?.userId) items = items.filter((a) => a.userId === params.userId);
    if (params?.counsellorId) {
      const counsellor = getStore().counsellors.find(
        (c) => c.id === params.counsellorId,
      );
      if (counsellor?.userId) {
        items = items.filter((a) => a.counsellorId === params.counsellorId);
      }
    }
    return paginate(items, params?.page, params?.limit ?? 20);
  });
}

export async function updateAppointment(
  id: number,
  data: { status: string },
): Promise<void> {
  return withDelay(() => {
    const store = getStore();
    const apt = store.appointments.find((a) => a.id === id);
    if (apt) apt.status = data.status as typeof apt.status;
    persistStore();
  });
}

// Campaigns, Diwan, Partnerships
export async function listCampaigns(params?: { limit?: number }) {
  return withDelay(() => ({
    data: SEED_CAMPAIGNS.slice(0, params?.limit ?? 10),
  }));
}

export async function listDiwanProjects(params?: { limit?: number }) {
  return withDelay(() => ({
    data: SEED_DIWAN_PROJECTS.slice(0, params?.limit ?? 10),
  }));
}

export async function applyDiwan(data: { applicationText: string }) {
  return withDelay(() => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("يجب تسجيل الدخول");
    const store = getStore();
    const user = getUsers().find((u) => u.id === userId);
    store.diwanMembers.push({
      id: store.nextIds.diwanMember++,
      userId,
      userName: user?.name,
      applicationText: data.applicationText,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    persistStore();
  });
}

export async function listDiwanMembers(params?: { page?: number; limit?: number }) {
  return withDelay(() => paginate(getStore().diwanMembers, params?.page, params?.limit ?? 15));
}

export async function updateDiwanMemberStatus(
  id: number,
  data: { status: string },
) {
  return withDelay(() => {
    const store = getStore();
    const m = store.diwanMembers.find((d) => d.id === id);
    if (m) {
      m.status = data.status as typeof m.status;
      if (data.status === "approved") m.acceptedAt = new Date().toISOString();
    }
    persistStore();
  });
}

export async function listPartnerships(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  return withDelay(() => {
    let items = [...getStore().partnerships];
    if (params?.status) items = items.filter((p) => p.status === params.status);
    return paginate(items, params?.page, params?.limit ?? 12);
  });
}

export async function createPartnership(data: {
  associationName: string;
  description?: string;
}) {
  return withDelay(() => {
    const store = getStore();
    const p = {
      id: store.nextIds.partnership++,
      associationName: data.associationName,
      description: data.description,
      status: "pending" as const,
      startDate: new Date().toISOString().split("T")[0],
    };
    store.partnerships.push(p);
    persistStore();
    return p;
  });
}

export async function updatePartnershipStatus(
  id: number,
  data: { status: string },
) {
  return withDelay(() => {
    const store = getStore();
    const p = store.partnerships.find((x) => x.id === id);
    if (p) p.status = data.status as typeof p.status;
    persistStore();
  });
}

export async function submitContact(_data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return withDelay(() => undefined);
}

export async function getRecommendedEvents(userId: number): Promise<Event[]> {
  return withDelay(() => {
    const store = getStore();
    const user = getUsers().find((u) => u.id === userId);
    const userRegs = store.registrations.filter((r) => r.userId === userId);
    const instIds = new Set(
      userRegs
        .map((r) => store.events.find((e) => e.id === r.eventId)?.institutionId)
        .filter(Boolean) as number[],
    );
    const registeredEventIds = new Set(userRegs.map((r) => r.eventId));
    return store.events
      .filter(
        (e) =>
          e.status === "published" &&
          !registeredEventIds.has(e.id) &&
          new Date(e.startDate) > new Date() &&
          (instIds.has(e.institutionId ?? -1) ||
            user?.wilaya === "بجاية" ||
            user?.wilaya === "Bejaia"),
      )
      .slice(0, 4);
  });
}

// Dashboard & search
export async function getUserDashboard(): Promise<UserDashboard> {
  return withDelay(() => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("غير مصرح");
    const store = getStore();
    const regs = store.registrations.filter(
      (r) => r.userId === userId && r.status !== "cancelled",
    );
    const upcoming = regs.filter(
      (r) => r.eventStartDate && new Date(r.eventStartDate) > new Date(),
    );
    const notifs = SEED_NOTIFICATIONS.filter((n) => n.userId === userId);
    const appointments = store.appointments.filter((a) => a.userId === userId);
    const diwan = store.diwanMembers.find((d) => d.userId === userId);
    const applications = [
      ...appointments.slice(0, 3).map((a) => ({
        type: "khilya" as const,
        id: a.id,
        title: `موعد ${a.type}`,
        status: a.status,
        date: a.dateTime,
      })),
      ...(diwan
        ? [
            {
              type: "diwan" as const,
              id: diwan.id,
              title: "طلب انضمام ديوان شباب",
              status: diwan.status,
              date: diwan.createdAt,
            },
          ]
        : []),
    ];
    const recommendedEvents = store.events
      .filter(
        (e) =>
          e.status === "published" &&
          !regs.some((r) => r.eventId === e.id) &&
          new Date(e.startDate) > new Date(),
      )
      .slice(0, 3);
    const trainingEnrollments = (store.trainingEnrollments ?? [])
      .filter((e) => e.userId === userId && e.status !== "cancelled")
      .sort(
        (a, b) =>
          new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime(),
      );
    const enrolledIds = new Set(trainingEnrollments.map((e) => e.programId));
    const recommendedTrainingPrograms = (store.trainingPrograms ?? [])
      .filter(
        (p) =>
          p.status === "published" &&
          !enrolledIds.has(p.id) &&
          new Date(p.startDate) > new Date(),
      )
      .slice(0, 3);
    return {
      upcomingRegistrations: upcoming,
      recentNotifications: notifs.slice(0, 5),
      unreadNotificationsCount: notifs.filter((n) => !n.isRead).length,
      applications,
      recommendedEvents,
      trainingEnrollments,
      recommendedTrainingPrograms,
    };
  });
}

export * from "./training-services";

export async function getDashboardStats(): Promise<DashboardStats> {
  return withDelay(() => {
    const store = getStore();
    return {
      totalUsers: getUsers().length + 48,
      eventsThisMonth: 12,
      newRegistrationsThisMonth: 34,
      activeInstitutions: store.institutions.length,
      totalArticles: store.articles.filter((a) => a.status === "published").length,
      totalEvents: store.events.filter((e) => e.status === "published").length,
      pendingAppointments: store.appointments.filter((a) => a.status === "pending")
        .length,
      pendingPartnerships: store.partnerships.filter((p) => p.status === "pending")
        .length,
      registrationsByMonth: [
        { month: "جانفي", count: 20 },
        { month: "فيفري", count: 28 },
        { month: "مارس", count: 35 },
        { month: "أفريل", count: 42 },
        { month: "ماي", count: 34 },
        { month: "جوان", count: 18 },
      ],
      usersByMonth: [
        { month: "جانفي", count: 20 },
        { month: "فيفري", count: 28 },
        { month: "مارس", count: 35 },
        { month: "أفريل", count: 42 },
        { month: "ماي", count: 34 },
        { month: "جوان", count: 18 },
      ],
      usersByRole: [
        { role: "public", count: 120 },
        { role: "club", count: 8 },
        { role: "staff", count: 15 },
        { role: "admin", count: 3 },
      ],
      eventsByCategory: [
        { category: "رياضة", count: 14 },
        { category: "ثقافة", count: 9 },
        { category: "تكوين", count: 11 },
        { category: "ترفيه", count: 6 },
      ],
    };
  });
}

export * from "./admin-portal-services";

export async function listUsers(params?: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}) {
  return withDelay(() => {
    let items = [...getUsers()];
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (u) =>
          u.name.includes(params.search!) ||
          u.email.toLowerCase().includes(q),
      );
    }
    if (params?.role) items = items.filter((u) => u.role === params.role);
    return paginate(items, params?.page, params?.limit ?? 15);
  });
}

export async function updateUserRole(id: number, data: { role: string }) {
  return withDelay(() => {
    const users = getUsers();
    const u = users.find((x) => x.id === id);
    if (u) u.role = data.role as User["role"];
    persistStore();
    return u;
  });
}

export async function banUser(id: number, banned: boolean): Promise<User> {
  return withDelay(() => {
    const users = getUsers();
    const u = users.find((x) => x.id === id);
    if (!u) throw new Error("المستخدم غير موجود");
    u.bannedAt = banned ? new Date().toISOString() : null;
    persistStore();
    return u;
  });
}

export async function exportUsersCsv(): Promise<string> {
  return withDelay(() => {
    const header = "id,name,email,role,verified,createdAt\n";
    const rows = getUsers()
      .map(
        (u) =>
          `${u.id},"${u.name}",${u.email},${u.role},${u.verified ?? false},${u.createdAt}`,
      )
      .join("\n");
    return header + rows;
  });
}

export async function bulkUpdateArticles(data: {
  slugs: string[];
  status: Article["status"];
}): Promise<void> {
  return withDelay(() => {
    const store = getStore();
    for (const slug of data.slugs) {
      const a = store.articles.find((x) => x.slug === slug);
      if (a) {
        a.status = data.status;
        if (data.status === "published" && !a.publishedAt) {
          a.publishedAt = new Date().toISOString();
        }
      }
    }
    persistStore();
  });
}

// Media & settings
export async function listMedia(params?: {
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return withDelay(() => {
    let items = [...getStore().mediaFiles];
    if (params?.type) items = items.filter((m) => m.type === params.type);
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (m) => m.name.toLowerCase().includes(q) || m.alt?.toLowerCase().includes(q),
      );
    }
    return paginate(items, params?.page, params?.limit ?? 24);
  });
}

export async function uploadMedia(data: {
  name: string;
  url: string;
  type: MediaFile["type"];
  alt?: string;
  folder?: string;
}): Promise<MediaFile> {
  return withDelay(() => {
    const store = getStore();
    const userId = getCurrentUserId();
    const file: MediaFile = {
      id: store.nextIds.media++,
      ...data,
      uploadedBy: userId ?? undefined,
      createdAt: new Date().toISOString(),
    };
    store.mediaFiles.unshift(file);
    persistStore();
    return file;
  });
}

export async function deleteMedia(id: number): Promise<void> {
  return withDelay(() => {
    const store = getStore();
    store.mediaFiles = store.mediaFiles.filter((m) => m.id !== id);
    persistStore();
  });
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return withDelay(() => ({ ...getStore().siteSettings }));
}

export async function updateSiteSettings(
  data: Partial<SiteSettings>,
): Promise<SiteSettings> {
  return withDelay(() => {
    const store = getStore();
    store.siteSettings = { ...store.siteSettings, ...data };
    persistStore();
    return store.siteSettings;
  });
}

export function listStaticPages(): StaticPage[] {
  return SEED_STATIC_PAGES;
}

export async function globalSearch(params: {
  q: string;
  type?: string;
}): Promise<GlobalSearchResult> {
  return withDelay(() => {
    const q = params.q.toLowerCase();
    const store = getStore();
    const articles = store.articles.filter(
      (a) =>
        a.status === "published" &&
        (a.title.toLowerCase().includes(q) || a.excerpt?.toLowerCase().includes(q)),
    );
    const events = store.events.filter(
      (e) =>
        e.status === "published" &&
        (e.title.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q)),
    );
    const institutions = store.institutions.filter(
      (i) =>
        i.nameAr.includes(params.q) ||
        i.name.toLowerCase().includes(q) ||
        i.commune.includes(params.q),
    );
    const pages = SEED_STATIC_PAGES.filter(
      (p) =>
        p.titleAr.includes(params.q) ||
        p.titleFr.toLowerCase().includes(q) ||
        p.excerptAr?.includes(params.q) ||
        p.excerptFr?.toLowerCase().includes(q),
    );
    const result: GlobalSearchResult = {
      total: articles.length + events.length + institutions.length + pages.length,
      articles:
        params.type === "all" || !params.type || params.type === "articles"
          ? articles
          : undefined,
      events:
        params.type === "all" || !params.type || params.type === "events"
          ? events
          : undefined,
      institutions:
        params.type === "all" || !params.type || params.type === "institutions"
          ? institutions
          : undefined,
      pages:
        params.type === "all" || !params.type || params.type === "pages"
          ? pages
          : undefined,
    };
    if (params.type === "articles") result.total = articles.length;
    else if (params.type === "events") result.total = events.length;
    else if (params.type === "institutions") result.total = institutions.length;
    else if (params.type === "pages") result.total = pages.length;
    return result;
  });
}
