export interface Photo {
  id: string;
  src: string;
  /** Featured photos are shown first in the hero gallery by default. */
  featured?: boolean;
}

const count = 57;

export const photos: Photo[] = Array.from({ length: count }, (_, i) => {
  const n = String(i + 1).padStart(3, '0');
  return {
    id: `house-${n}`,
    src: `/images/house/house-${n}.webp`,
    featured: i < 12,
  };
});
