import { Redis } from '@upstash/redis';
import { houseFacts } from '../data/house';
import { pois } from '../data/guide/pois';

export interface SiteSettings {
  bookingUrl: string;
  contactEmail: string;
  updatedAt?: string;
}

let redis: Redis | null | undefined;

/** Lazily creates the Upstash client. Returns null if env vars are missing (local dev without a DB). */
function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const url = import.meta.env.UPSTASH_REDIS_REST_URL;
  const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;
  redis = url && token ? new Redis({ url, token }) : null;
  return redis;
}

function defaultSettings(): SiteSettings {
  return {
    bookingUrl: houseFacts.bookingUrl,
    contactEmail: houseFacts.contactEmail,
  };
}

/** Returns the current site settings, falling back to defaults in data/house.ts. */
export async function getSiteSettings(): Promise<SiteSettings> {
  const client = getRedis();
  if (!client) return defaultSettings();

  const stored = await client.get<SiteSettings>('site:settings');
  return stored ? { ...defaultSettings(), ...stored } : defaultSettings();
}

/** Updates site settings. Used by the admin panel. */
export async function setSiteSettings(entry: { bookingUrl: string; contactEmail: string }): Promise<void> {
  const client = getRedis();
  if (!client) throw new Error('Brak konfiguracji bazy danych (UPSTASH_REDIS_REST_URL / TOKEN).');

  const value: SiteSettings = {
    bookingUrl: entry.bookingUrl.trim(),
    contactEmail: entry.contactEmail.trim(),
    updatedAt: new Date().toISOString(),
  };
  await client.set('site:settings', value);
}

/** Returns hours/price notice overrides for every POI (empty string if not overridden). */
export async function getAllPoiNotices(): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  for (const poi of pois) result[poi.id] = '';

  const client = getRedis();
  if (!client) return result;

  const keys = pois.map((poi) => `poi:${poi.id}:notice`);
  const values = await client.mget<(string | null)[]>(...keys);
  pois.forEach((poi, i) => {
    result[poi.id] = values[i] ?? '';
  });

  return result;
}

/** Updates the hours/price notice override for a single POI. Empty string clears the override. */
export async function setPoiNotice(poiId: string, notice: string): Promise<void> {
  const client = getRedis();
  if (!client) throw new Error('Brak konfiguracji bazy danych (UPSTASH_REDIS_REST_URL / TOKEN).');

  const trimmed = notice.trim();
  if (trimmed) {
    await client.set(`poi:${poiId}:notice`, trimmed);
  } else {
    await client.del(`poi:${poiId}:notice`);
  }
}
