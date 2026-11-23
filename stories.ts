// Stories for Monday 23 November 2026 — researched and verified 23 Nov 2026
// (AP, Reuters, AFP, BBC, Al Jazeera, Dawn, Washington Post, NAMPA/AFP wire).
// Every item was first reported, confirmed or developed on Mon 23 Nov 2026,
// or broke Fri-Sun and is tagged with its real day in `when`.
// Regions: EUR Europe, MID Middle East, ASP Asia-Pacific, AFR Africa,
// AME Americas, OCE Oceania, WLD World / space.
// 12 drawn stories (3 leads + 9 features) + 25 one-line briefs = 37 stories.

export type Region = 'EUR' | 'MID' | 'ASP' | 'AFR' | 'AME' | 'OCE' | 'WLD';

export interface Story {
  id: number;
  region: Region;
  kind: 'lead' | 'tile' | 'brief';
  tag: string;
  headline: string;
  sub: string;
  when: string;
  // map pin in the 64 x 32 dot-map grid (drawn stories only)
  mapX: number;
  mapY: number;
  icon: string;
}

export const DRAWN: Story[] = [
  {
    id: 1, region: 'WLD', kind: 'lead', tag: 'COP31',
    headline: 'COP31 COLLAPSES',
    sub: 'Climate talks fail in Antalya after record overtime. No fossil-fuel deal.',
    when: 'MON 23 NOV',
    mapX: 36, mapY: 8, icon: 'globe',
  },
  {
    id: 2, region: 'MID', kind: 'lead', tag: 'HORMUZ',
    headline: 'TANKERS HIT IN THE STRAIT',
    sub: 'Ships hit Fri-Sun; two more catch fire on mines.',
    when: 'MON 23 NOV',
    mapX: 39, mapY: 10, icon: 'tanker',
  },
  {
    id: 3, region: 'AFR', kind: 'lead', tag: 'LIBYA',
    headline: 'DRONES SINK RUSSIAN WARSHIP',
    sub: 'Sea drones hit the Merkury at Benghazi. Ship capsizes; 10 hurt.',
    when: 'SUN 22 NOV',
    mapX: 33, mapY: 10, icon: 'warship',
  },
  {
    id: 4, region: 'EUR', kind: 'tile', tag: 'POLAND',
    headline: 'POLAND: FALLEN OBJECTS WERE RUSSIAN MISSILES',
    sub: 'Three cruise missiles fell on Friday. NATO to meet.',
    when: 'CONFIRMED TODAY',
    mapX: 34, mapY: 6, icon: 'missile',
  },
  {
    id: 5, region: 'EUR', kind: 'tile', tag: 'UKRAINE',
    headline: 'DRONE HITS FLATS NEAR KYIV',
    sub: '2 dead, 11 missing in Dymer, incl. two children.',
    when: 'SUN 22 NOV',
    mapX: 35, mapY: 6, icon: 'drone',
  },
  {
    id: 6, region: 'WLD', kind: 'tile', tag: 'MERCURY',
    headline: 'BEPICOLOMBO REACHES MERCURY',
    sub: 'After 8 years in space, only the 2nd mission ever to orbit the planet.',
    when: 'SAT 21 NOV',
    mapX: 60, mapY: 3, icon: 'planet',
  },
  {
    id: 7, region: 'AME', kind: 'tile', tag: 'MEXICO',
    headline: 'CARTEL BOSS CAPTURED',
    sub: "'El Chapo Isidro' seized in Sinaloa. 11 dead in firefights.",
    when: 'MON 23 NOV',
    mapX: 12, mapY: 12, icon: 'shield',
  },
  {
    id: 8, region: 'ASP', kind: 'tile', tag: 'SOUTH KOREA',
    headline: 'MINISTER QUITS OVER AI CHEATING',
    sub: 'Education chief resigns as exam scandal spreads.',
    when: 'MON 23 NOV',
    mapX: 53, mapY: 8, icon: 'cap',
  },
  {
    id: 9, region: 'ASP', kind: 'tile', tag: 'TAIWAN',
    headline: 'TAIWAN BANS SHORT SALES',
    sub: 'Stocks down 17.5% in a week. Short sales banned from today.',
    when: 'BAN FROM TODAY',
    mapX: 52, mapY: 10, icon: 'chart',
  },
  {
    id: 10, region: 'ASP', kind: 'tile', tag: 'JAPAN',
    headline: 'SHURI CASTLE REBORN',
    sub: 'Main hall restored 7 years after the fire. Opens today.',
    when: 'MON 23 NOV',
    mapX: 54, mapY: 9, icon: 'castle',
  },
  {
    id: 11, region: 'ASP', kind: 'tile', tag: 'LAHORE',
    headline: 'LAHORE CHOKES AGAIN',
    sub: "World's most polluted major city. AQI 538 on Sunday morning.",
    when: 'SUN 22 NOV',
    mapX: 44, mapY: 10, icon: 'smog',
  },
  {
    id: 12, region: 'AFR', kind: 'tile', tag: 'SUDAN',
    headline: 'DRONES HIT KHARTOUM',
    sub: 'Strikes damage a UN facility with staff inside. 3 killed in Omdurman.',
    when: 'SUN 22 NOV',
    mapX: 34, mapY: 13, icon: 'un',
  },
];

export interface Brief {
  region: Region;
  text: string;
}

export const BRIEFS: Brief[] = [
  { region: 'ASP', text: 'NEPAL PM SHAH HOLDS TALKS WITH MODI IN DELHI' },
  { region: 'OCE', text: 'INDIA POSTS RECORD 720/9 IN WELLINGTON TEST' },
  { region: 'EUR', text: 'MARQUEZ WINS RECORD-TYING 8TH MOTOGP TITLE' },
  { region: 'WLD', text: '128 STATES AGREE KILLER-ROBOT RULES BY 2028' },
  { region: 'AME', text: 'HEGSETH MEMO CURBS US-CANADA DEFENCE TIES' },
  { region: 'MID', text: 'SETTLERS TORCH 12 VEHICLES NEAR RAMALLAH' },
  { region: 'AFR', text: '24 CIVILIANS KILLED IN SOUTH SUDAN VIOLENCE' },
  { region: 'AFR', text: 'WHO CHIEF PLEADS FOR PEACE IN EBOLA-HIT DR CONGO' },
  { region: 'AME', text: "BOLSONARO 'STABLE' IN INTENSIVE CARE" },
  { region: 'MID', text: 'SAUDI COALITION INTERCEPTS HOUTHI MISSILE' },
  { region: 'MID', text: 'IRAN STRIKE WOUNDS TWO IN BAHRAIN' },
  { region: 'AFR', text: '35 FULANIS KILLED IN NIGERIA REVENGE ATTACKS' },
  { region: 'AME', text: 'DELTA GROUNDS THOUSANDS OF US FLIGHTS' },
  { region: 'AME', text: 'TRUMP: NO RUSH TO STRIKE IRAN AGAIN' },
  { region: 'WLD', text: 'CHINA AND US AGREE AI TALKS MECHANISM' },
  { region: 'EUR', text: 'UK TO BUILD UKRAINIAN DRONES IN NEW DEAL' },
  { region: 'EUR', text: "DENMARK PM: HAMAS BACKERS 'ENEMY WITHIN'" },
  { region: 'EUR', text: 'LITHUANIA DENIES ROLE IN KALININGRAD DRONE ATTACK' },
  { region: 'AME', text: 'THREE KILLED IN OHIO BABY-SHOWER SHOOTING' },
  { region: 'EUR', text: 'THOUSANDS MARCH IN LISBON OVER LIVING COSTS' },
  { region: 'ASP', text: "MYANMAR CALLS ASEAN DECISION 'UNFAIR'" },
  { region: 'EUR', text: 'RUSSIAN CARGO SHIP STILL BURNING OFF FINLAND' },
  { region: 'MID', text: 'NETANYAHU-EISENKOT TALKS FAIL, NO GOVT DEAL' },
  { region: 'AME', text: 'MAN RESCUED AFTER 11 DAYS LOST IN AMAZON' },
  { region: 'OCE', text: 'AUSTRALIA PM: COP31 FAILURE SIGN OF HARD TIMES' },
];

export const TOTAL_STORIES = DRAWN.length + BRIEFS.length; // 37

export const REGION_ORDER: Region[] = ['EUR', 'MID', 'ASP', 'AFR', 'AME', 'OCE', 'WLD'];

export const REGION_NAMES: Record<Region, string> = {
  EUR: 'EUROPE',
  MID: 'MIDDLE EAST',
  ASP: 'ASIA-PACIFIC',
  AFR: 'AFRICA',
  AME: 'AMERICAS',
  OCE: 'OCEANIA',
  WLD: 'WORLD',
};

export function regionCounts(): Record<Region, number> {
  const counts: Record<Region, number> = { EUR: 0, MID: 0, ASP: 0, AFR: 0, AME: 0, OCE: 0, WLD: 0 };
  for (const s of DRAWN) counts[s.region]++;
  for (const b of BRIEFS) counts[b.region]++;
  return counts;
}
