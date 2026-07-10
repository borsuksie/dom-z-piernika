export const categorySlugs = [
  'restauracje',
  'sklepy',
  'dla-dzieci',
  'natura',
  'rowery',
  'niepogoda',
  'zamki',
  'kultura',
  'lokalne-produkty',
  'wycieczki',
] as const;

export type CategorySlug = (typeof categorySlugs)[number];

export const categoryIcons: Record<CategorySlug, string> = {
  restauracje: '🍽️',
  sklepy: '🛒',
  'dla-dzieci': '👨‍👩‍👧‍👦',
  natura: '🌳',
  rowery: '🚴',
  niepogoda: '🌧️',
  zamki: '🏰',
  kultura: '🏛️',
  'lokalne-produkty': '🧺',
  wycieczki: '🗺️',
};

export function isCategorySlug(value: string): value is CategorySlug {
  return (categorySlugs as readonly string[]).includes(value);
}
