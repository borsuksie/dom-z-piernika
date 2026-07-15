import { Redis } from '@upstash/redis';
import { put } from '@vercel/blob';
import { houseFacts } from '../data/house';
import { pois } from '../data/guide/pois';

export interface SiteSettings {
  bookingUrl: string;
  contactEmail: string;
  /** Raw text, paragraphs separated by a blank line. Overrides the default About text when set. */
  aboutText?: string;
  /** Overrides the default hero background photo when set. */
  heroPhotoUrl?: string;
  updatedAt?: string;
}

export interface PoiOverride {
  forWhom?: string;
  description?: string;
  hours?: string;
  image?: string;
  /** Lower sorts first within its category. Falls back to the static data order when unset. */
  order?: number;
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

/** Updates site settings (booking link, contact, about text, hero photo). Used by the admin panel. */
export async function setSiteSettings(entry: {
  bookingUrl: string;
  contactEmail: string;
  aboutText?: string;
  heroPhotoUrl?: string;
}): Promise<void> {
  const client = getRedis();
  if (!client) throw new Error('Brak konfiguracji bazy danych (UPSTASH_REDIS_REST_URL / TOKEN).');

  const value: SiteSettings = {
    bookingUrl: entry.bookingUrl.trim(),
    contactEmail: entry.contactEmail.trim(),
    aboutText: entry.aboutText?.trim() || undefined,
    heroPhotoUrl: entry.heroPhotoUrl?.trim() || undefined,
    updatedAt: new Date().toISOString(),
  };
  await client.set('site:settings', value);
}

/** Photos curated for the homepage gallery grid, in display order. Empty means "use the default featured set". */
export async function getGalleryPhotos(): Promise<string[]> {
  const client = getRedis();
  if (!client) return [];
  return (await client.get<string[]>('site:galleryPhotos')) ?? [];
}

export async function setGalleryPhotos(urls: string[]): Promise<void> {
  const client = getRedis();
  if (!client) throw new Error('Brak konfiguracji bazy danych (UPSTASH_REDIS_REST_URL / TOKEN).');
  await client.set('site:galleryPhotos', urls);
}

/** Every photo ever uploaded through the admin panel (house photos pool, in addition to the built-in set). */
export async function getUploadedPhotos(): Promise<string[]> {
  const client = getRedis();
  if (!client) return [];
  return (await client.get<string[]>('site:uploadedPhotos')) ?? [];
}

async function addUploadedPhoto(url: string): Promise<void> {
  const client = getRedis();
  if (!client) return;
  const current = (await client.get<string[]>('site:uploadedPhotos')) ?? [];
  await client.set('site:uploadedPhotos', [...current, url]);
}

/** Uploads a file to Vercel Blob storage and returns its public URL. */
export async function uploadPhoto(file: File, pathPrefix: string): Promise<string> {
  // Variables named BLOB_* mysteriously never reach this function's runtime env
  // on this project (neither import.meta.env nor process.env sees them), even
  // though they're visibly configured in Vercel. Using a differently-named var
  // for the same token as a workaround.
  const token =
    import.meta.env.PHOTO_UPLOAD_TOKEN ||
    process.env.PHOTO_UPLOAD_TOKEN ||
    import.meta.env.BLOB_READ_WRITE_TOKEN ||
    process.env.BLOB_READ_WRITE_TOKEN;
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const filename = `${pathPrefix}/${crypto.randomUUID()}.${ext}`;
  try {
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
      ...(token ? { token } : {}),
    });
    return blob.url;
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    const check = (obj: Record<string, unknown>, key: string) =>
      `${key} in=${key in obj} truthy=${Boolean(obj[key])} len=${String(obj[key] ?? '').length}`;
    const report = [
      check(process.env, 'PHOTO_UPLOAD_TOKEN'),
      check(process.env, 'BLOB_READ_WRITE_TOKEN'),
      check(import.meta.env as unknown as Record<string, unknown>, 'PHOTO_UPLOAD_TOKEN'),
      check(import.meta.env as unknown as Record<string, unknown>, 'BLOB_READ_WRITE_TOKEN'),
    ].join(' | ');
    throw new Error(
      `Nie udało się wgrać zdjęcia do Vercel Blob: ${detail} [${report}]`
    );
  }
}

/** Uploads a house photo and records it in the uploaded-photos pool. */
export async function uploadHousePhoto(file: File): Promise<string> {
  const url = await uploadPhoto(file, 'house');
  await addUploadedPhoto(url);
  return url;
}

/** Returns text/photo/order overrides for every POI (empty object if nothing was overridden). */
export async function getAllPoiOverrides(): Promise<Record<string, PoiOverride>> {
  const result: Record<string, PoiOverride> = {};
  for (const poi of pois) result[poi.id] = {};

  const client = getRedis();
  if (!client) return result;

  const keys = pois.map((poi) => `poi:${poi.id}:override`);
  const values = await client.mget<(PoiOverride | null)[]>(...keys);
  pois.forEach((poi, i) => {
    result[poi.id] = values[i] ?? {};
  });

  return result;
}

/** Merges the given fields into a single POI's override, keeping any fields not passed in. */
export async function setPoiOverride(poiId: string, patch: Partial<PoiOverride>): Promise<void> {
  const client = getRedis();
  if (!client) throw new Error('Brak konfiguracji bazy danych (UPSTASH_REDIS_REST_URL / TOKEN).');

  const key = `poi:${poiId}:override`;
  const current = (await client.get<PoiOverride>(key)) ?? {};
  const next: PoiOverride = { ...current, ...patch };

  // Drop empty/undefined fields so the override object doesn't accumulate cruft.
  (Object.keys(next) as (keyof PoiOverride)[]).forEach((field) => {
    if (next[field] === '' || next[field] === undefined) delete next[field];
  });

  if (Object.keys(next).length === 0) {
    await client.del(key);
  } else {
    await client.set(key, next);
  }
}

/** Uploads a photo for a specific POI and stores it as that POI's image override. */
export async function uploadPoiPhoto(poiId: string, file: File): Promise<string> {
  const url = await uploadPhoto(file, `guide/${poiId}`);
  await setPoiOverride(poiId, { image: url });
  return url;
}
