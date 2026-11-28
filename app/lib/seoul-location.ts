const DISTRICTS = [
  '종로구', '중구', '용산구', '성동구', '광진구', '동대문구', '중랑구', '성북구', '강북구',
  '도봉구', '노원구', '은평구', '서대문구', '마포구', '양천구', '강서구', '구로구', '금천구',
  '영등포구', '동작구', '관악구', '서초구', '강남구', '송파구', '강동구',
] as const;

export type SeoulDistrict = (typeof DISTRICTS)[number];

export function isSeoulDistrict(value: unknown): value is SeoulDistrict {
  return typeof value === 'string' && DISTRICTS.some((name) => name === value);
}

type Point = [longitude: number, latitude: number];
type Ring = Point[];
type Polygon = Ring[];
export type DistrictBoundaries = {
  features: {
    properties: { district: SeoulDistrict };
    geometry: { type: 'Polygon'; coordinates: Polygon } | { type: 'MultiPolygon'; coordinates: Polygon[] };
  }[];
};

function ringContains(ring: Ring, [x, y]: Point) {
  let inside = false;
  for (let index = 1; index < ring.length; index++) {
    const [ax, ay] = ring[index - 1];
    const [bx, by] = ring[index];
    if ((ay > y) !== (by > y) && x < ax + ((bx - ax) * (y - ay)) / (by - ay)) inside = !inside;
  }
  return inside;
}

function polygonContains([outer, ...holes]: Polygon, point: Point) {
  return ringContains(outer, point) && holes.every((ring) => !ringContains(ring, point));
}

/** 경계에서 충분히 떨어진 경우에만 구를 반환한다. 위치 좌표의 오차는 미터 단위다. */
function clearOfBoundary(polygon: Polygon, [longitude, latitude]: Point, accuracy: number) {
  const metersPerDegree = 111_132;
  const longitudeScale = metersPerDegree * Math.cos(latitude * Math.PI / 180);
  const clearanceSquared = (accuracy + 25) ** 2;
  for (const ring of polygon) {
    for (let index = 1; index < ring.length; index++) {
      const [previousLongitude, previousLatitude] = ring[index - 1];
      const [nextLongitude, nextLatitude] = ring[index];
      const ax = (previousLongitude - longitude) * longitudeScale;
      const ay = (previousLatitude - latitude) * metersPerDegree;
      const dx = (nextLongitude - previousLongitude) * longitudeScale;
      const dy = (nextLatitude - previousLatitude) * metersPerDegree;
      const lengthSquared = dx * dx + dy * dy;
      const fraction = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, -(ax * dx + ay * dy) / lengthSquared));
      if ((ax + fraction * dx) ** 2 + (ay + fraction * dy) ** 2 <= clearanceSquared) return false;
    }
  }
  return true;
}

export function locateSeoulDistrict(
  boundaries: DistrictBoundaries,
  { latitude, longitude, accuracy }: Pick<GeolocationCoordinates, 'latitude' | 'longitude' | 'accuracy'>,
): SeoulDistrict | null {
  if (![latitude, longitude, accuracy].every(Number.isFinite) || accuracy <= 0 || accuracy > 1500) return null;
  const point: Point = [longitude, latitude];
  let match: SeoulDistrict | null = null;
  for (const { geometry, properties } of boundaries.features) {
    const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
    const polygon = polygons.find((candidate) => polygonContains(candidate, point));
    if (!polygon) continue;
    if (match || !clearOfBoundary(polygon, point, accuracy)) return null;
    match = properties.district;
  }
  return match;
}
