import type {
  Article,
  Campaign,
  DiwanProject,
  Event,
  Institution,
  Partnership,
  TrainingProgram,
} from "../types";
import { MOCK_IMG } from "@/lib/mock-images";

const IMG_POOL = Object.values(MOCK_IMG);

function pickImg(index: number): string {
  return IMG_POOL[index % IMG_POOL.length]!;
}

function daysFromNow(days: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

const BEJAIA_COMMUNES = [
  "بجاية",
  "أميزور",
  "أقبو",
  "تيشي",
  "تودجة",
  "القصر",
  "سيدي عيش",
  "تيمزريت",
  "سوق الإثنين",
  "أوقاس",
  "شميني",
  "فرعون",
  "برباشة",
  "خنشلة",
  "ملبو",
] as const;

const INSTITUTION_TYPES: Institution["type"][] = [
  "youth_house",
  "culture_center",
  "sports_complex",
  "camp",
];

const EVENT_TITLES = [
  { ar: "ورشة الرسم والألوان", fr: "Atelier dessin et couleurs", en: "Drawing and colors workshop" },
  { ar: "دورة كرة السلة للشباب", fr: "Stage basketball jeunesse", en: "Youth basketball course" },
  { ar: "ملتقى الشعر الشبابي", fr: "Rencontre poésie jeunesse", en: "Youth poetry meetup" },
  { ar: "يوم التطوع البيئي", fr: "Journée volontariat vert", en: "Green volunteer day" },
  { ar: "تكوين في الإسعافات الأولية", fr: "Formation premiers secours", en: "First aid training" },
  { ar: "مسابقة الشطرنج", fr: "Tournoi d'échecs", en: "Chess tournament" },
  { ar: "معسكر تسلق وتنزه", fr: "Camp randonnée", en: "Hiking camp" },
  { ar: "ورشة التصوير الفوتوغرافي", fr: "Atelier photo", en: "Photography workshop" },
  { ar: "يوم العلوم المفتوح", fr: "Journée sciences ouvertes", en: "Open science day" },
  { ar: "بطولة كرة اليد", fr: "Tournoi handball", en: "Handball tournament" },
  { ar: "ليلة سينما الشباب", fr: "Cinéma jeunesse", en: "Youth cinema night" },
  { ar: "تكوين في الحاسوب", fr: "Formation informatique", en: "IT training session" },
  { ar: "مهرجان الموسيقى المحلية", fr: "Festival musique locale", en: "Local music festival" },
  { ar: "ورشة الخط العربي", fr: "Atelier calligraphie", en: "Arabic calligraphy workshop" },
  { ar: "يوم رياضي للفتيات", fr: "Journée sportive filles", en: "Girls sports day" },
];

const ARTICLE_TITLES = [
  { ar: "انطلاق برنامج المخيمات الصيفية", cat: "أخبار" },
  { ar: "تكريم المتطوعين الشباب", cat: "أخبار" },
  { ar: "افتتاح ملعب خماسي جديد", cat: "رياضة" },
  { ar: "معرض الكتاب الشبابي", cat: "ثقافة" },
  { ar: "حملة التطعيم والوقاية", cat: "صحة" },
  { ar: "بطولة الشطرنج المدرسية", cat: "رياضة" },
  { ar: "ورشة الإعلام البديل", cat: "ثقافة" },
  { ar: "شراكة مع القطاع الخاص", cat: "أخبار" },
  { ar: "دورة تكوينية للمدربين", cat: "أخبار" },
  { ar: "يوم التراث الأمازيغي", cat: "ثقافة" },
  { ar: "مسابقة الابتكار العلمي", cat: "أخبار" },
  { ar: "توسيع ساعات بيوت الشباب", cat: "أخبار" },
];

const TRAINING_TITLES = [
  { ar: "تكوين في التصميم الجرافيكي", format: "course" as const },
  { ar: "ورشة الخطابة والتواصل", format: "workshop" as const },
  { ar: "دورة اللغة الإنجليزية", format: "course" as const },
  { ar: "تكوين حرفي — النجارة", format: "workshop" as const },
  { ar: "مخيم القيادة الشبابية", format: "camp" as const },
  { ar: "تكوين في الصحافة الشبابية", format: "course" as const },
  { ar: "ورشة الرياضيات التطبيقية", format: "workshop" as const },
  { ar: "دورة التصوير الرقمي", format: "course" as const },
];

export function buildExtraInstitutions(startId: number): Institution[] {
  return BEJAIA_COMMUNES.map((commune, i) => {
    const id = startId + i;
    const type = INSTITUTION_TYPES[i % INSTITUTION_TYPES.length]!;
    const slug = `institution-bejaia-${id}`;
    const img = pickImg(id);
    return {
      id,
      name: `Youth space ${commune}`,
      nameAr: `فضاء الشباب — ${commune}`,
      nameEn: `Youth space — ${commune}`,
      slug,
      wilayaCode: "06",
      type,
      descriptionAr: `مؤسسة شبانية نشطة في بلدية ${commune} — أنشطة ثقافية ورياضية وتكوينية.`,
      descriptionEn: `Active youth institution in ${commune} commune.`,
      coverImage: img,
      featuredImage: img,
      images: [img],
      activitiesCount: 8 + (i % 20),
      address: `وسط البلدية`,
      commune,
      phone: `+213 34 ${20 + (i % 70)} ${10 + (i % 80)} ${(i % 90).toString().padStart(2, "0")}`,
      capacity: 120 + i * 25,
      services: ["أنشطة ثقافية", "رياضة", "تكوين"],
      coordinates: { lat: 36.75 + i * 0.02, lng: 5.05 + i * 0.03 },
    };
  });
}

export function buildExtraEvents(startId: number, institutionIds: number[]): Event[] {
  return EVENT_TITLES.map((t, i) => {
    const id = startId + i;
    const instId = institutionIds[i % institutionIds.length] ?? 1;
    const start = daysFromNow(5 + i * 4, 9 + (i % 6));
    return {
      id,
      title: t.ar,
      titleFr: t.fr,
      titleEn: t.en,
      slug: `activite-bejaia-${id}`,
      description: `نشاط مفتوح للشباب — التسجيل عبر المنصة.`,
      descriptionFr: "Activité ouverte aux jeunes — inscription en ligne.",
      descriptionEn: "Open youth activity — register online.",
      institutionId: instId,
      institutionName: `مؤسسة #${instId}`,
      startDate: start,
      endDate: i % 3 === 0 ? daysFromNow(5 + i * 4 + 2, 17) : undefined,
      location: BEJAIA_COMMUNES[i % BEJAIA_COMMUNES.length],
      capacity: 30 + (i % 5) * 15,
      registrationCount: 5 + (i % 20),
      status: "published" as const,
      featuredImage: pickImg(id + 3),
    };
  });
}

export function buildExtraArticles(startId: number): Article[] {
  const catMap: Record<string, number> = { أخبار: 1, رياضة: 3, ثقافة: 4, صحة: 2 };
  return ARTICLE_TITLES.map((t, i) => {
    const id = startId + i;
    return {
      id,
      title: t.ar,
      titleFr: `Actualité ${id}`,
      titleEn: `News item ${id}`,
      slug: `actualite-${id}`,
      excerpt: `ملخص خبر يهم شباب ولاية بجاية — ${t.ar}.`,
      excerptFr: "Brève actualité jeunesse.",
      excerptEn: "Youth news brief.",
      body: `<p>${t.ar} — تفاصيل النشاط والبرنامج الزمني متاحة على المنصة.</p>`,
      featuredImage: pickImg(id + 1),
      categoryId: catMap[t.cat] ?? 1,
      categoryNameAr: t.cat,
      authorName: "فريق ODEJ",
      status: "published" as const,
      publishedAt: daysAgo(i + 1),
      readingTimeMinutes: 2 + (i % 4),
    };
  });
}

export function buildExtraTrainingPrograms(startId: number): TrainingProgram[] {
  return TRAINING_TITLES.map((t, i) => {
    const id = startId + i;
    const start = daysFromNow(20 + i * 7);
    return {
      id,
      slug: `formation-bejaia-${id}`,
      title: t.ar,
      titleFr: `Formation ${id}`,
      titleEn: `Training ${id}`,
      descriptionAr: `${t.ar} — برنامج تكويني معتمد من ODEJ بجاية.`,
      clubName: i % 2 === 0 ? "جمعية شباب بجاية" : "ODEJ — مديرية الشباب بجاية",
      clubProfileId: i % 2 === 0 ? 1 : undefined,
      institutionId: i % 2 === 1 ? 1 : undefined,
      wilayaCode: "06",
      format: t.format,
      level: (["beginner", "intermediate", "all"] as const)[i % 3],
      capacity: 20 + (i % 4) * 5,
      enrollmentCount: 3 + (i % 12),
      startDate: start,
      endDate: daysFromNow(20 + i * 7 + 3),
      location: BEJAIA_COMMUNES[i % BEJAIA_COMMUNES.length],
      status: "published" as const,
      featuredImage: pickImg(id + 5),
      createdAt: daysAgo(30 - i),
      reviewedAt: daysAgo(25 - i),
    };
  });
}

export function buildExtraCampaigns(startId: number): Campaign[] {
  const titles = [
    "وقاية من الإدمان",
    "الصحة الإنجابية",
    "مكافحة التنمر",
    "التوجيه الدراسي",
    "الرياضة للجميع",
    "الصحة النفسية في الامتحانات",
  ];
  const categories = ["addiction", "health", "violence", "guidance", "sports", "mental_health"];
  return titles.map((title, i) => ({
    id: startId + i,
    title,
    description: `حملة توعوية في المؤسسات الشبانية — ${title}.`,
    coverImage: pickImg(i + 8),
    category: categories[i],
    startDate: "2026-03-01",
    endDate: "2026-12-31",
  }));
}

export function buildExtraPartnerships(startId: number): Partnership[] {
  const names = [
    "جمعية أقبو للتنمية",
    "نادي أميزور الثقافي",
    "جمعية تيشي الرياضية",
    "منتدى الشباب التكنولوجي",
    "جمعية تودجة الخضراء",
    "نادي القراءة الشبابي",
    "جمعية الفنون الرقمية",
    "اتحاد جمعيات الشباب",
  ];
  return names.map((name, i) => ({
    id: startId + i,
    associationName: name,
    logo: pickImg(i + 2),
    description: `شراكة نشطة مع ODEJ في تنظيم الأنشطة.`,
    category: ["ثقافة", "رياضة", "بيئة", "تكنولوجيا"][i % 4],
    status: (i % 5 === 0 ? "pending" : "approved") as Partnership["status"],
    startDate: "2025-01-01",
    endDate: i % 2 === 0 ? "2027-12-31" : undefined,
  }));
}

export function buildExtraDiwanProjects(startId: number): DiwanProject[] {
  const projects = [
    { title: "حديقة الحي الأخضر", desc: "تشجير وتجميل فضاءات الأحياء." },
    { title: "ورشة إعادة التدوير", desc: "تحويل النفايات إلى أعمال فنية." },
    { title: "دعم التمدرس القروي", desc: "دروس دعم في الرياضيات والفرنسية." },
    { title: "راديو الشباب المحلي", desc: "بث بودكاست من بيت الشباب." },
    { title: "مكتبة متنقلة", desc: "كتب وقصص للأطفال في القرى." },
    { title: "مشروع الرياضة للجميع", desc: "تمكين الفتيات من الأنشطة الرياضية." },
    { title: "تصوير التراث المحلي", desc: "أرشيف رقمي للعادات والمواقع." },
    { title: "ورشة الطبخ الصحي", desc: "تغذية سليمة للشباب." },
  ];
  const members = ["ياسين", "سارة", "أمين", "نور", "رضا", "هاجر", "كريم", "لمياء"];
  return projects.map((p, i) => ({
    id: startId + i,
    title: p.title,
    description: p.desc,
    image: pickImg(i + 4),
    status: "active",
    memberName: members[i % members.length],
  }));
}
