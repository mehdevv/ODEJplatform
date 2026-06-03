import type {
  Appointment,
  AppointmentSlot,
  Article,
  ClubProfile,
  Counsellor,
  DiwanMember,
  Event,
  Institution,
  MediaFile,
  Partnership,
  Registration,
  SiteSettings,
  TrainingEnrollment,
  TrainingProgram,
  User,
} from "../types";
import {
  DEFAULT_SITE_SETTINGS,
  DEMO_USERS,
  SEED_APPOINTMENTS,
  SEED_APPOINTMENT_SLOTS,
  SEED_ARTICLES,
  SEED_CLUB_PROFILES,
  SEED_COUNSELLORS,
  SEED_DIWAN_MEMBERS,
  SEED_EVENTS,
  SEED_INSTITUTIONS,
  SEED_MEDIA,
  SEED_PARTNERSHIPS,
  SEED_REGISTRATIONS,
  SEED_TRAINING_ENROLLMENTS,
  SEED_TRAINING_PROGRAMS,
} from "./seed";

const STORAGE_KEY = "odej_mock_store_v4";

/** Bump when seed catalog (articles, events, images, etc.) changes */
const MOCK_CATALOG_VERSION = 3;

interface StoreState {
  mockCatalogVersion?: number;
  users: User[];
  articles: Article[];
  institutions: Institution[];
  events: Event[];
  registrations: Registration[];
  appointments: Appointment[];
  partnerships: Partnership[];
  diwanMembers: DiwanMember[];
  counsellors: Counsellor[];
  appointmentSlots: AppointmentSlot[];
  mediaFiles: MediaFile[];
  siteSettings: SiteSettings;
  clubProfiles: ClubProfile[];
  trainingPrograms: TrainingProgram[];
  trainingEnrollments: TrainingEnrollment[];
  nextIds: {
    article: number;
    institution: number;
    event: number;
    registration: number;
    appointment: number;
    partnership: number;
    diwanMember: number;
    user: number;
    media: number;
    slot: number;
    clubProfile: number;
    trainingProgram: number;
    trainingEnrollment: number;
  };
}

function refreshCatalogFromSeed(parsed: StoreState): StoreState {
  if (parsed.mockCatalogVersion === MOCK_CATALOG_VERSION) return parsed;
  const fresh = defaultState();
  return {
    ...parsed,
    mockCatalogVersion: MOCK_CATALOG_VERSION,
    articles: fresh.articles,
    institutions: fresh.institutions,
    events: fresh.events,
    partnerships: fresh.partnerships,
    diwanMembers: parsed.diwanMembers?.length ? parsed.diwanMembers : fresh.diwanMembers,
    counsellors: fresh.counsellors,
    appointmentSlots: fresh.appointmentSlots,
    mediaFiles: fresh.mediaFiles,
    clubProfiles: parsed.clubProfiles?.length ? parsed.clubProfiles : fresh.clubProfiles,
    trainingPrograms: fresh.trainingPrograms,
    trainingEnrollments: parsed.trainingEnrollments?.length
      ? parsed.trainingEnrollments
      : fresh.trainingEnrollments,
  };
}

function defaultState(): StoreState {
  return {
    mockCatalogVersion: MOCK_CATALOG_VERSION,
    users: [...DEMO_USERS],
    articles: [...SEED_ARTICLES],
    institutions: [...SEED_INSTITUTIONS],
    events: [...SEED_EVENTS],
    registrations: [...SEED_REGISTRATIONS],
    appointments: [...SEED_APPOINTMENTS],
    partnerships: [...SEED_PARTNERSHIPS],
    diwanMembers: [...SEED_DIWAN_MEMBERS],
    counsellors: [...SEED_COUNSELLORS],
    appointmentSlots: [...SEED_APPOINTMENT_SLOTS],
    mediaFiles: [...SEED_MEDIA],
    siteSettings: { ...DEFAULT_SITE_SETTINGS },
    clubProfiles: [...SEED_CLUB_PROFILES],
    trainingPrograms: [...SEED_TRAINING_PROGRAMS],
    trainingEnrollments: [...SEED_TRAINING_ENROLLMENTS],
    nextIds: {
      article: 100,
      institution: 100,
      event: 100,
      registration: 100,
      appointment: 100,
      partnership: 100,
      diwanMember: 100,
      user: 100,
      media: 100,
      slot: 100,
      clubProfile: 100,
      trainingProgram: 100,
      trainingEnrollment: 100,
    },
  };
}

function mergeTrainingState(parsed: StoreState): StoreState {
  if (!parsed.clubProfiles?.length) parsed.clubProfiles = [...SEED_CLUB_PROFILES];
  if (!parsed.trainingPrograms?.length) {
    parsed.trainingPrograms = [...SEED_TRAINING_PROGRAMS];
  }
  if (!parsed.trainingEnrollments) {
    parsed.trainingEnrollments = [...SEED_TRAINING_ENROLLMENTS];
  }
  if (!parsed.nextIds.clubProfile) parsed.nextIds.clubProfile = 100;
  if (!parsed.nextIds.trainingProgram) parsed.nextIds.trainingProgram = 100;
  if (!parsed.nextIds.trainingEnrollment) parsed.nextIds.trainingEnrollment = 100;
  const clubUserIds = new Set([4, 5]);
  const hasClubUsers = parsed.users.some((u) => clubUserIds.has(u.id));
  if (!hasClubUsers) {
    parsed.users = [...DEMO_USERS];
  }
  return parsed;
}

function loadState(): StoreState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoreState;
      if (!parsed.users) parsed.users = [...DEMO_USERS];
      if (!parsed.counsellors) parsed.counsellors = [...SEED_COUNSELLORS];
      if (!parsed.appointmentSlots) parsed.appointmentSlots = [...SEED_APPOINTMENT_SLOTS];
      if (!parsed.mediaFiles) parsed.mediaFiles = [...SEED_MEDIA];
      if (!parsed.siteSettings) parsed.siteSettings = { ...DEFAULT_SITE_SETTINGS };
      return refreshCatalogFromSeed(mergeTrainingState(parsed));
    }
    const legacyV3 = localStorage.getItem("odej_mock_store_v3");
    if (legacyV3) {
      const old = JSON.parse(legacyV3) as Partial<StoreState>;
      return refreshCatalogFromSeed(
        mergeTrainingState({
          ...defaultState(),
          ...old,
          users: old.users?.length ? old.users : [...DEMO_USERS],
        } as StoreState),
      );
    }
    const legacyV2 = localStorage.getItem("odej_mock_store_v2");
    if (legacyV2) {
      const old = JSON.parse(legacyV2) as Partial<StoreState>;
      return refreshCatalogFromSeed(
        mergeTrainingState({
          ...defaultState(),
          ...old,
          users: [...DEMO_USERS],
        } as StoreState),
      );
    }
    const legacy = localStorage.getItem("odej_mock_store_v1");
    if (legacy) {
      const old = JSON.parse(legacy) as Partial<StoreState>;
      return refreshCatalogFromSeed(
        mergeTrainingState({
          ...defaultState(),
          ...old,
          users: [...DEMO_USERS],
        } as StoreState),
      );
    }
  } catch {
    /* ignore */
  }
  return defaultState();
}

let state = loadState();

export function persistStore() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

export function resetStore() {
  state = defaultState();
  persistStore();
}

export function getStore(): StoreState {
  return state;
}

export function getUsers(): User[] {
  return state.users;
}

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function withDelay<T>(fn: () => T, ms = 300): Promise<T> {
  await delay(ms);
  return fn();
}

export function getCurrentUserId(): number | null {
  const token = localStorage.getItem("odej_token");
  if (!token) return null;
  const match = token.match(/^user-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}
