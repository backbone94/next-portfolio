/** 우정사업본부의 우편번호 앞 3자리 부여내역에 나온 서울 범위. */
const DISTRICTS = [
  [10, 12, '강북구', 'gangbuk'],
  [13, 15, '도봉구', 'dobong'],
  [16, 19, '노원구', 'nowon'],
  [20, 23, '중랑구', 'jungnang'],
  [24, 26, '동대문구', 'dongdaemun'],
  [27, 29, '성북구', 'seongbuk'],
  [30, 32, '종로구', 'jongno'],
  [33, 35, '은평구', 'eunpyeong'],
  [36, 38, '서대문구', 'seodaemun'],
  [39, 42, '마포구', 'mapo'],
  [43, 44, '용산구', 'yongsan'],
  [45, 46, '중구', 'jung'],
  [47, 48, '성동구', 'seongdong'],
  [49, 51, '광진구', 'gwangjin'],
  [52, 54, '강동구', 'gangdong'],
  [55, 59, '송파구', 'songpa'],
  [60, 64, '강남구', 'gangnam'],
  [65, 68, '서초구', 'seocho'],
  [69, 71, '동작구', 'dongjak'],
  [72, 74, '영등포구', 'yeongdeungpo'],
  [75, 78, '강서구', 'gangseo'],
  [79, 81, '양천구', 'yangcheon'],
  [82, 84, '구로구', 'guro'],
  [85, 86, '금천구', 'geumcheon'],
  [87, 89, '관악구', 'gwanak'],
] as const;

const SEOUL_REGION = '11';
const SEOUL_CITY_NAMES = new Set(['seoul', 'seoulspecialcity', 'seoulteugbyeolsi', '서울', '서울특별시']);

type Location = {
  country: string | null;
  region: string | null;
  city: string | null;
  postalCode: string | null;
};

export function isSeoulDistrict(name: string | null) {
  return DISTRICTS.some(([, , district]) => district === name);
}

/** 서로 어긋난 IP 위치 단서를 만나면 구 추정을 생략한다. */
export function estimateSeoulDistrict({ country, region, city, postalCode }: Location): string | null {
  if (country !== 'KR' || (region && region !== SEOUL_REGION)) return null;

  const cityName = city?.toLowerCase().replace(/[\s-]/g, '') ?? '';
  const named = DISTRICTS.find(([, , korean, romanized]) =>
    cityName === korean || cityName === `${romanized}gu` || cityName === `${romanized}district`,
  );
  const prefix = postalCode && /^\d{5}$/.test(postalCode) ? Number(postalCode.slice(0, 3)) : null;
  if (prefix !== null && (prefix < 10 || prefix > 99)) return null;
  const postal = prefix === null ? undefined : DISTRICTS.find(([start, end]) => prefix >= start && prefix <= end);
  if (postal && named && postal !== named) return null;

  if (postal && (!cityName || SEOUL_CITY_NAMES.has(cityName) || named)) {
    return postal[2];
  }
  // 같은 이름의 구가 다른 시도에도 있어, 이름만 있을 때는 서울 지역 코드가 필요하다.
  return region === SEOUL_REGION ? named?.[2] ?? null : null;
}
