import type { PoiDistance } from '../data/guide/pois';
import type { Dictionary } from '../i18n';

export interface DistancePart {
  icon: string;
  label: string;
}

/** Builds the small "🚶 12 min · 🚴 4 min · 🚗 2 min" pieces shown on a POI card. */
export function distanceParts(distance: PoiDistance, t: Dictionary['guideCategory']): DistancePart[] {
  if (distance.onSite) {
    return [{ icon: '🏡', label: t.onSiteLabel }];
  }
  const parts: DistancePart[] = [];
  if (distance.walkMin != null) parts.push({ icon: '🚶', label: `${distance.walkMin} min` });
  if (distance.bikeMin != null) parts.push({ icon: '🚴', label: `${distance.bikeMin} min` });
  if (distance.carMin != null) parts.push({ icon: '🚗', label: `${distance.carMin} min` });
  return parts;
}

export function distanceKmLabel(distance: PoiDistance): string | null {
  if (distance.onSite) return null;
  const km = distance.km % 1 === 0 ? distance.km.toFixed(0) : distance.km.toFixed(1);
  return `${km} km`;
}
