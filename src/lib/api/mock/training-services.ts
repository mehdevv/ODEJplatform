import type {
  AuthResponse,
  ClubDashboard,
  ClubProfile,
  PaginatedResponse,
  RegisterClubInput,
  TrainingEnrollment,
  TrainingProgram,
  TrainingProgramStatus,
  User,
} from "../types";
import { DEMO_PASSWORDS } from "./seed";
import {
  getCurrentUserId,
  getStore,
  getUsers,
  persistStore,
  slugify,
  withDelay,
} from "./store";

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

function enrichProgram(p: TrainingProgram): TrainingProgram {
  const store = getStore();
  if (p.clubProfileId) {
    const club = store.clubProfiles.find((c) => c.id === p.clubProfileId);
    if (club && !p.clubName) p = { ...p, clubName: club.organizationName };
  }
  const count = store.trainingEnrollments.filter(
    (e) => e.programId === p.id && e.status !== "cancelled",
  ).length;
  return { ...p, enrollmentCount: count };
}

export async function registerClub(data: RegisterClubInput): Promise<AuthResponse> {
  return withDelay(() => {
    if (!data.agreement?.dataUrl || !data.agreement.fileName) {
      throw new Error("يجب رفع اتفاقية الشراكة أو التسجيل");
    }
    if (getUsers().some((u) => u.email === data.email)) {
      throw new Error("البريد الإلكتروني مستخدم مسبقاً");
    }
    const store = getStore();
    const userId = store.nextIds.user++;
    const user: User = {
      id: userId,
      name: data.contactName,
      email: data.email,
      role: "club",
      phone: data.phone,
      wilaya: data.wilayaCode,
      createdAt: new Date().toISOString(),
      verified: false,
    };
    DEMO_PASSWORDS[data.email] = data.password;
    store.users.push(user);
    const profile: ClubProfile = {
      id: store.nextIds.clubProfile++,
      userId,
      organizationName: data.organizationName,
      registrationNumber: data.registrationNumber,
      category: data.category,
      wilayaCode: data.wilayaCode,
      address: data.address,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    store.clubProfiles.push(profile);
    persistStore();
    return { token: `user-${userId}`, user };
  });
}

export async function getClubProfileByUserId(
  userId: number,
): Promise<ClubProfile | null> {
  return withDelay(
    () => getStore().clubProfiles.find((c) => c.userId === userId) ?? null,
    150,
  );
}

export async function getMyClubProfile(): Promise<ClubProfile | null> {
  return withDelay(() => {
    const userId = getCurrentUserId();
    if (!userId) return null;
    return getStore().clubProfiles.find((c) => c.userId === userId) ?? null;
  }, 150);
}

export async function updateClubProfile(
  id: number,
  data: Partial<ClubProfile>,
): Promise<ClubProfile> {
  return withDelay(() => {
    const store = getStore();
    const idx = store.clubProfiles.findIndex((c) => c.id === id);
    if (idx < 0) throw new Error("الملف غير موجود");
    store.clubProfiles[idx] = { ...store.clubProfiles[idx], ...data };
    persistStore();
    return store.clubProfiles[idx];
  });
}

export async function reviewClubProfile(
  id: number,
  data: { status: "approved" | "rejected"; reviewNote?: string },
): Promise<ClubProfile> {
  return withDelay(() => {
    const store = getStore();
    const idx = store.clubProfiles.findIndex((c) => c.id === id);
    if (idx < 0) throw new Error("الملف غير موجود");
    const current = store.clubProfiles[idx];
    if (data.status === "approved" && !current.agreementDataUrl) {
      throw new Error("لا يمكن الاعتماد دون اتفاقية مرفوعة");
    }
    store.clubProfiles[idx] = {
      ...store.clubProfiles[idx],
      status: data.status,
      reviewNote: data.reviewNote,
      reviewedAt: new Date().toISOString(),
    };
    if (data.status === "approved") {
      const user = store.users.find((u) => u.id === store.clubProfiles[idx].userId);
      if (user) user.verified = true;
    }
    persistStore();
    return store.clubProfiles[idx];
  });
}

export async function listClubProfiles(params?: {
  status?: string;
  search?: string;
}) {
  return withDelay(() => {
    let items = [...getStore().clubProfiles];
    if (params?.status) items = items.filter((c) => c.status === params.status);
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter((c) => c.organizationName.toLowerCase().includes(q));
    }
    return items;
  });
}

export async function listTrainingPrograms(params?: {
  status?: TrainingProgramStatus | TrainingProgramStatus[];
  clubProfileId?: number;
  wilayaCode?: string;
  format?: string;
  level?: string;
  search?: string;
  publicOnly?: boolean;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<TrainingProgram>> {
  return withDelay(() => {
    let items = getStore().trainingPrograms.map(enrichProgram);
    if (params?.publicOnly) {
      items = items.filter((p) => p.status === "published");
    }
    if (params?.status) {
      const statuses = Array.isArray(params.status) ? params.status : [params.status];
      items = items.filter((p) => statuses.includes(p.status));
    }
    if (params?.clubProfileId) {
      items = items.filter((p) => p.clubProfileId === params.clubProfileId);
    }
    if (params?.wilayaCode) {
      const code = params.wilayaCode.padStart(2, "0");
      items = items.filter((p) => p.wilayaCode.padStart(2, "0") === code);
    }
    if (params?.format) items = items.filter((p) => p.format === params.format);
    if (params?.level) items = items.filter((p) => p.level === params.level);
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.titleFr?.toLowerCase().includes(q) ||
          p.clubName?.toLowerCase().includes(q),
      );
    }
    items.sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );
    return paginate(items, params?.page, params?.limit);
  });
}

export async function getTrainingProgram(
  slugOrId: string,
): Promise<TrainingProgram | null> {
  return withDelay(() => {
    const store = getStore();
    const p =
      store.trainingPrograms.find(
        (x) => x.slug === slugOrId || String(x.id) === slugOrId,
      ) ?? null;
    return p ? enrichProgram({ ...p }) : null;
  });
}

export async function createTrainingProgram(
  data: Omit<TrainingProgram, "id" | "slug" | "createdAt" | "status"> & {
    slug?: string;
  },
): Promise<TrainingProgram> {
  return withDelay(() => {
    const store = getStore();
    const userId = getCurrentUserId();
    if (!userId) throw new Error("غير مصرح");
    const profile = store.clubProfiles.find((c) => c.userId === userId);
    if (!profile) throw new Error("ملف النادي غير موجود");
    if (profile.status !== "approved") {
      throw new Error("يجب الموافقة على حساب النادي أولاً");
    }
    const baseSlug = data.slug ?? slugify(data.title);
    let slug = baseSlug;
    let n = 1;
    while (store.trainingPrograms.some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${n++}`;
    }
    const program: TrainingProgram = {
      ...data,
      id: store.nextIds.trainingProgram++,
      slug,
      clubProfileId: profile.id,
      clubName: profile.organizationName,
      status: "draft",
      enrollmentCount: 0,
      createdAt: new Date().toISOString(),
    };
    store.trainingPrograms.unshift(program);
    persistStore();
    return enrichProgram(program);
  });
}

export async function updateTrainingProgram(
  id: number,
  data: Partial<TrainingProgram>,
): Promise<TrainingProgram> {
  return withDelay(() => {
    const store = getStore();
    const idx = store.trainingPrograms.findIndex((p) => p.id === id);
    if (idx < 0) throw new Error("البرنامج غير موجود");
    const current = store.trainingPrograms[idx];
    const userId = getCurrentUserId();
    const profile = store.clubProfiles.find((c) => c.userId === userId);
    const isAdmin = getUsers().find((u) => u.id === userId)?.role === "admin";
    if (!isAdmin && profile && current.clubProfileId === profile.id) {
      if (!["draft", "rejected"].includes(current.status)) {
        throw new Error("لا يمكن تعديل البرنامج في هذه الحالة");
      }
    }
    store.trainingPrograms[idx] = { ...current, ...data };
    persistStore();
    return enrichProgram(store.trainingPrograms[idx]);
  });
}

export async function submitTrainingProgram(id: number): Promise<TrainingProgram> {
  return withDelay(() => {
    const store = getStore();
    const idx = store.trainingPrograms.findIndex((p) => p.id === id);
    if (idx < 0) throw new Error("البرنامج غير موجود");
    const p = store.trainingPrograms[idx];
    if (!["draft", "rejected"].includes(p.status)) {
      throw new Error("لا يمكن إرسال البرنامج في هذه الحالة");
    }
    const profile = store.clubProfiles.find((c) => c.id === p.clubProfileId);
    if (profile && profile.status !== "approved") {
      throw new Error("حساب النادي غير معتمد");
    }
    store.trainingPrograms[idx] = {
      ...p,
      status: "submitted",
      submittedAt: new Date().toISOString(),
      reviewNote: undefined,
    };
    persistStore();
    return enrichProgram(store.trainingPrograms[idx]);
  });
}

export async function reviewTrainingProgram(
  id: number,
  data: {
    action: "approve" | "reject" | "publish";
    reviewNote?: string;
  },
): Promise<TrainingProgram> {
  return withDelay(() => {
    const store = getStore();
    const idx = store.trainingPrograms.findIndex((p) => p.id === id);
    if (idx < 0) throw new Error("البرنامج غير موجود");
    const p = store.trainingPrograms[idx];
    const now = new Date().toISOString();
    if (data.action === "approve") {
      if (p.status !== "submitted") throw new Error("البرنامج ليس قيد المراجعة");
      store.trainingPrograms[idx] = {
        ...p,
        status: "approved",
        reviewedAt: now,
        reviewNote: data.reviewNote,
      };
    } else if (data.action === "reject") {
      if (!["submitted", "approved"].includes(p.status)) {
        throw new Error("لا يمكن رفض البرنامج في هذه الحالة");
      }
      store.trainingPrograms[idx] = {
        ...p,
        status: "rejected",
        reviewedAt: now,
        reviewNote: data.reviewNote ?? "مرفوض",
      };
    } else if (data.action === "publish") {
      if (!["approved", "submitted"].includes(p.status)) {
        throw new Error("يجب الموافقة على البرنامج قبل النشر");
      }
      store.trainingPrograms[idx] = {
        ...p,
        status: "published",
        reviewedAt: now,
      };
    }
    persistStore();
    return enrichProgram(store.trainingPrograms[idx]);
  });
}

export async function deleteTrainingProgram(id: number): Promise<void> {
  return withDelay(() => {
    const store = getStore();
    const p = store.trainingPrograms.find((x) => x.id === id);
    if (!p) throw new Error("البرنامج غير موجود");
    if (p.status !== "draft") throw new Error("يمكن حذف المسودات فقط");
    store.trainingPrograms = store.trainingPrograms.filter((x) => x.id !== id);
    persistStore();
  });
}

export async function enrollInTrainingProgram(programId: number): Promise<TrainingEnrollment> {
  return withDelay(() => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("يجب تسجيل الدخول");
    const user = getUsers().find((u) => u.id === userId);
    if (user?.role === "club") throw new Error("حساب النادي لا يمكنه التسجيل");
    const store = getStore();
    const program = store.trainingPrograms.find((p) => p.id === programId);
    if (!program || program.status !== "published") {
      throw new Error("البرنامج غير متاح للتسجيل");
    }
    const existing = store.trainingEnrollments.find(
      (e) => e.userId === userId && e.programId === programId && e.status !== "cancelled",
    );
    if (existing) throw new Error("أنت مسجل مسبقاً في هذا البرنامج");
    const confirmed = store.trainingEnrollments.filter(
      (e) => e.programId === programId && e.status === "confirmed",
    ).length;
    const status = confirmed >= program.capacity ? "waitlist" : "confirmed";
    const enrollment: TrainingEnrollment = {
      id: store.nextIds.trainingEnrollment++,
      userId,
      programId,
      status,
      enrolledAt: new Date().toISOString(),
      programTitle: program.title,
      programStartDate: program.startDate,
      programLocation: program.location,
    };
    store.trainingEnrollments.push(enrollment);
    persistStore();
    return enrollment;
  });
}

export async function cancelTrainingEnrollment(id: number): Promise<TrainingEnrollment> {
  return withDelay(() => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("غير مصرح");
    const store = getStore();
    const idx = store.trainingEnrollments.findIndex(
      (e) => e.id === id && e.userId === userId,
    );
    if (idx < 0) throw new Error("التسجيل غير موجود");
    store.trainingEnrollments[idx] = {
      ...store.trainingEnrollments[idx],
      status: "cancelled",
      cancelledAt: new Date().toISOString(),
    };
    persistStore();
    return store.trainingEnrollments[idx];
  });
}

export async function listMyTrainingEnrollments(): Promise<TrainingEnrollment[]> {
  return withDelay(() => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("غير مصرح");
    return getStore()
      .trainingEnrollments.filter(
        (e) => e.userId === userId && e.status !== "cancelled",
      )
      .sort(
        (a, b) =>
          new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime(),
      );
  });
}

export async function getClubDashboard(): Promise<ClubDashboard> {
  return withDelay(() => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("غير مصرح");
    const store = getStore();
    const profile = store.clubProfiles.find((c) => c.userId === userId);
    if (!profile) throw new Error("ملف النادي غير موجود");
    const programs = store.trainingPrograms.filter(
      (p) => p.clubProfileId === profile.id,
    );
    const programsByStatus = {
      draft: 0,
      submitted: 0,
      approved: 0,
      rejected: 0,
      published: 0,
    } as Record<TrainingProgramStatus, number>;
    for (const p of programs) programsByStatus[p.status]++;
    return {
      profile,
      programsByStatus,
      recentPrograms: programs
        .map(enrichProgram)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5),
    };
  });
}

export function getPostLoginPath(user: User): string {
  if (user.role === "admin" || user.role === "super_admin") return "/admin";
  if (user.role === "club") return "/club";
  if (user.role === "khilya_staff") return "/admin/khilya/counsellor";
  return "/dashboard";
}
