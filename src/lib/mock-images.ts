/**
 * Curated Unsplash photos for mock/demo content (youth, sports, culture, Algeria/Mediterranean).
 * Use ?w=900&q=85 for crisp card covers without huge payloads.
 */
function photo(id: string, width = 900): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
}

export const MOCK_IMG = {
  youthGroup: photo("photo-1529156069898-49953e39b3ac"),
  youthWorkshop: photo("photo-1552664730-d307ca884978"),
  codingClass: photo("photo-1516321318523-4074690f784a"),
  sportsField: photo("photo-1574629810360-7efbbe195018"),
  football: photo("photo-1431324155629-1a6deb468deb"),
  basketball: photo("photo-1546519633-50713ba3e343"),
  beachCamp: photo("photo-1507525428034-b723cf961d3e"),
  coastline: photo("photo-1590486803833-64459eca88de"),
  cultureTheater: photo("photo-1503095396549-807759245b35"),
  artExhibit: photo("photo-1460667734057-599f7dcc2e42"),
  musicWorkshop: photo("photo-1511671782779-c97d03d35b04"),
  library: photo("photo-1492684223066-81342ee5ff30"),
  community: photo("photo-1523580491-0c8b0a3432d0"),
  scienceLab: photo("photo-1532094349886-492a6a974b66"),
  counselling: photo("photo-1573497019940-1c28c88b3318"),
  healthAwareness: photo("photo-1576091160399-112ba8d25d1d"),
  environment: photo("photo-1542601906990-4a7e6a7b5a5e"),
  cityYouth: photo("photo-1529156069898-49953e39b3ac"),
  summerFestival: photo("photo-1511795409834-f02f18d1373f"),
  leadership: photo("photo-1522202176988-66273c2fd55f"),
  volunteer: photo("photo-1559027615-cd4628903323"),
  reading: photo("photo-1481627834876-b7833e8f5570"),
  gym: photo("photo-1534438327276-14e5300c3a48"),
  partnership: photo("photo-1521737711862-ea379b3e0c3b"),
} as const;

/** Hero carousel — wide crops */
export const MOCK_HERO = {
  slide1: photo("photo-1529156069898-49953e39b3ac", 1600),
  slide2: photo("photo-1573497019940-1c28c88b3318", 1600),
  slide3: photo("photo-1522202176988-66273c2fd55f", 1600),
} as const;

export const MOCK_GALLERY: string[] = [
  MOCK_IMG.youthGroup,
  MOCK_IMG.sportsField,
  MOCK_IMG.beachCamp,
  MOCK_IMG.artExhibit,
  MOCK_IMG.codingClass,
  MOCK_IMG.musicWorkshop,
  MOCK_IMG.environment,
  MOCK_IMG.community,
];
