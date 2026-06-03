/** Algeria's 69 wilayas (2024 administrative map) — codes match SVG path `id` attributes */
export interface Wilaya {
  code: string;
  slug: string;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  /** Approximate institution count for map stats (demo) */
  institutionsCount?: number;
}

export const WILAYAS: Wilaya[] = [
  { code: "01", slug: "adrar", nameAr: "أدرار", nameFr: "Adrar", nameEn: "Adrar" },
  { code: "02", slug: "chlef", nameAr: "الشلف", nameFr: "Chlef", nameEn: "Chlef" },
  { code: "03", slug: "laghouat", nameAr: "الأغواط", nameFr: "Laghouat", nameEn: "Laghouat" },
  { code: "04", slug: "oum-el-bouaghi", nameAr: "أم البواقي", nameFr: "Oum El Bouaghi", nameEn: "Oum El Bouaghi" },
  { code: "05", slug: "batna", nameAr: "باتنة", nameFr: "Batna", nameEn: "Batna" },
  { code: "06", slug: "bejaia", nameAr: "بجاية", nameFr: "Béjaïa", nameEn: "Béjaïa", institutionsCount: 92 },
  { code: "07", slug: "biskra", nameAr: "بسكرة", nameFr: "Biskra", nameEn: "Biskra" },
  { code: "08", slug: "bechar", nameAr: "بشار", nameFr: "Béchar", nameEn: "Béchar" },
  { code: "09", slug: "blida", nameAr: "البليدة", nameFr: "Blida", nameEn: "Blida" },
  { code: "10", slug: "bouira", nameAr: "البويرة", nameFr: "Bouira", nameEn: "Bouira" },
  { code: "11", slug: "tamanrasset", nameAr: "تمنراست", nameFr: "Tamanrasset", nameEn: "Tamanrasset" },
  { code: "12", slug: "tebessa", nameAr: "تبسة", nameFr: "Tébessa", nameEn: "Tébessa" },
  { code: "13", slug: "tlemcen", nameAr: "تلمسان", nameFr: "Tlemcen", nameEn: "Tlemcen" },
  { code: "14", slug: "tiaret", nameAr: "تيارت", nameFr: "Tiaret", nameEn: "Tiaret" },
  { code: "15", slug: "tizi-ouzou", nameAr: "تيزي وزو", nameFr: "Tizi Ouzou", nameEn: "Tizi Ouzou" },
  { code: "16", slug: "algiers", nameAr: "الجزائر", nameFr: "Alger", nameEn: "Algiers", institutionsCount: 120 },
  { code: "17", slug: "djelfa", nameAr: "الجلفة", nameFr: "Djelfa", nameEn: "Djelfa" },
  { code: "18", slug: "jijel", nameAr: "جيجل", nameFr: "Jijel", nameEn: "Jijel" },
  { code: "19", slug: "setif", nameAr: "سطيف", nameFr: "Sétif", nameEn: "Sétif", institutionsCount: 85 },
  { code: "20", slug: "saida", nameAr: "سعيدة", nameFr: "Saïda", nameEn: "Saida" },
  { code: "21", slug: "skikda", nameAr: "سكيكدة", nameFr: "Skikda", nameEn: "Skikda" },
  { code: "22", slug: "sidi-bel-abbes", nameAr: "سيدي بلعباس", nameFr: "Sidi Bel Abbès", nameEn: "Sidi Bel Abbès" },
  { code: "23", slug: "annaba", nameAr: "عنابة", nameFr: "Annaba", nameEn: "Annaba" },
  { code: "24", slug: "guelma", nameAr: "قالمة", nameFr: "Guelma", nameEn: "Guelma" },
  { code: "25", slug: "constantine", nameAr: "قسنطينة", nameFr: "Constantine", nameEn: "Constantine", institutionsCount: 78 },
  { code: "26", slug: "medea", nameAr: "المدية", nameFr: "Médéa", nameEn: "Medea" },
  { code: "27", slug: "mostaganem", nameAr: "مستغانم", nameFr: "Mostaganem", nameEn: "Mostaganem" },
  { code: "28", slug: "msila", nameAr: "المسيلة", nameFr: "M'Sila", nameEn: "M'Sila" },
  { code: "29", slug: "mascara", nameAr: "معسكر", nameFr: "Mascara", nameEn: "Mascara" },
  { code: "30", slug: "ouargla", nameAr: "ورقلة", nameFr: "Ouargla", nameEn: "Ouargla" },
  { code: "31", slug: "oran", nameAr: "وهران", nameFr: "Oran", nameEn: "Oran", institutionsCount: 95 },
  { code: "32", slug: "el-bayadh", nameAr: "البيض", nameFr: "El Bayadh", nameEn: "El Bayadh" },
  { code: "33", slug: "illizi", nameAr: "إليزي", nameFr: "Illizi", nameEn: "Illizi" },
  { code: "34", slug: "bordj-bou-arreridj", nameAr: "برج بوعريريج", nameFr: "Bordj Bou Arreridj", nameEn: "Bordj Bou Arreridj" },
  { code: "35", slug: "boumerdes", nameAr: "بومرداس", nameFr: "Boumerdès", nameEn: "Boumerdes" },
  { code: "36", slug: "el-tarf", nameAr: "الطارف", nameFr: "El Tarf", nameEn: "El Tarf" },
  { code: "37", slug: "tindouf", nameAr: "تندوف", nameFr: "Tindouf", nameEn: "Tindouf" },
  { code: "38", slug: "tissemsilt", nameAr: "تيسمسيلت", nameFr: "Tissemsilt", nameEn: "Tissemsilt" },
  { code: "39", slug: "el-oued", nameAr: "الوادي", nameFr: "El Oued", nameEn: "El Oued" },
  { code: "40", slug: "khenchela", nameAr: "خنشلة", nameFr: "Khenchela", nameEn: "Khenchela" },
  { code: "41", slug: "souk-ahras", nameAr: "سوق أهراس", nameFr: "Souk Ahras", nameEn: "Souk Ahras" },
  { code: "42", slug: "tipaza", nameAr: "تيبازة", nameFr: "Tipaza", nameEn: "Tipaza" },
  { code: "43", slug: "mila", nameAr: "ميلة", nameFr: "Mila", nameEn: "Mila" },
  { code: "44", slug: "ain-defla", nameAr: "عين الدفلى", nameFr: "Aïn Defla", nameEn: "Ain Defla" },
  { code: "45", slug: "naama", nameAr: "النعامة", nameFr: "Naâma", nameEn: "Naama" },
  { code: "46", slug: "ain-temouchent", nameAr: "عين تموشنت", nameFr: "Aïn Témouchent", nameEn: "Ain Temouchent" },
  { code: "47", slug: "ghardaia", nameAr: "غرداية", nameFr: "Ghardaïa", nameEn: "Ghardaia" },
  { code: "48", slug: "relizane", nameAr: "غليزان", nameFr: "Relizane", nameEn: "Relizane" },
  { code: "49", slug: "timimoun", nameAr: "تيميمون", nameFr: "Timimoun", nameEn: "Timimoun" },
  { code: "50", slug: "bordj-badji-mokhtar", nameAr: "برج باجي مختار", nameFr: "Bordj Badji Mokhtar", nameEn: "Bordj Badji Mokhtar" },
  { code: "51", slug: "ouled-djellal", nameAr: "أولاد جلال", nameFr: "Ouled Djellal", nameEn: "Ouled Djellal" },
  { code: "52", slug: "beni-abbes", nameAr: "بني عباس", nameFr: "Béni Abbès", nameEn: "Beni Abbes" },
  { code: "53", slug: "in-salah", nameAr: "عين صالح", nameFr: "In Salah", nameEn: "In Salah" },
  { code: "54", slug: "in-guezzam", nameAr: "عين قزام", nameFr: "In Guezzam", nameEn: "In Guezzam" },
  { code: "55", slug: "touggourt", nameAr: "تقرت", nameFr: "Touggourt", nameEn: "Touggourt" },
  { code: "56", slug: "djanet", nameAr: "جانت", nameFr: "Djanet", nameEn: "Djanet" },
  { code: "57", slug: "el-mghair", nameAr: "المغير", nameFr: "El M'Ghair", nameEn: "El M'Ghair" },
  { code: "58", slug: "el-meniaa", nameAr: "المنيعة", nameFr: "El Meniaa", nameEn: "El Meniaa" },
  { code: "59", slug: "aflou", nameAr: "أفلو", nameFr: "Aflou", nameEn: "Aflou" },
  { code: "60", slug: "el-abiodh-sidi-cheikh", nameAr: "الأبيض سيدي الشيخ", nameFr: "El Abiodh Sidi Cheikh", nameEn: "El Abiodh Sidi Cheikh" },
  { code: "61", slug: "el-aricha", nameAr: "العريشة", nameFr: "El Aricha", nameEn: "El Aricha" },
  { code: "62", slug: "el-kantara", nameAr: "القنطرة", nameFr: "El Kantara", nameEn: "El Kantara" },
  { code: "63", slug: "barika", nameAr: "بريكة", nameFr: "Barika", nameEn: "Barika" },
  { code: "64", slug: "bou-saada", nameAr: "بوسعادة", nameFr: "Bou Saâda", nameEn: "Bou Saada" },
  { code: "65", slug: "bir-el-ater", nameAr: "بئر العاتر", nameFr: "Bir El Ater", nameEn: "Bir El Ater" },
  { code: "66", slug: "ksar-el-boukhari", nameAr: "قصر البخاري", nameFr: "Ksar El Boukhari", nameEn: "Ksar El Boukhari" },
  { code: "67", slug: "ksar-chellala", nameAr: "قصر الشلالة", nameFr: "Ksar Chellala", nameEn: "Ksar Chellala" },
  { code: "68", slug: "ain-oussara", nameAr: "عين وسارة", nameFr: "Aïn Oussara", nameEn: "Ain Oussara" },
  { code: "69", slug: "msaad", nameAr: "مسعد", nameFr: "M'saâd", nameEn: "M'saad" },
];

const byCode = new Map(WILAYAS.map((w) => [w.code, w]));
const bySlug = new Map(WILAYAS.map((w) => [w.slug, w]));

export function getWilayaByCode(code: string | null | undefined): Wilaya | undefined {
  if (!code) return undefined;
  const normalized = code.padStart(2, "0");
  return byCode.get(normalized);
}

export function getWilayaBySlug(slug: string): Wilaya | undefined {
  return bySlug.get(slug);
}

export function getWilayaLabel(w: Wilaya, lang: string): string {
  if (lang === "ar") return w.nameAr;
  if (lang === "fr") return w.nameFr;
  if (lang === "kab") return w.nameFr;
  return w.nameEn;
}
