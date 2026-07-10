export type AmenityKey =
  | 'threeBedrooms'
  | 'twoKitchens'
  | 'fireplace'
  | 'garden'
  | 'terrace'
  | 'wifi'
  | 'parking'
  | 'evCharger'
  | 'petsFriendly'
  | 'library';

export const amenityIcons: Record<AmenityKey, string> = {
  threeBedrooms: '🛏️',
  twoKitchens: '🍳',
  fireplace: '🔥',
  garden: '🌳',
  terrace: '☀️',
  wifi: '📶',
  parking: '🚗',
  evCharger: '🔋',
  petsFriendly: '🐾',
  library: '📚',
};

export const amenityOrder: AmenityKey[] = [
  'threeBedrooms',
  'twoKitchens',
  'fireplace',
  'garden',
  'terrace',
  'wifi',
  'parking',
  'evCharger',
  'petsFriendly',
  'library',
];

export const houseFacts = {
  name: 'Dom z Piernika',
  address: 'Plac 3 Maja 18, 58-310 Szczawno-Zdrój',
  builtYear: 1932,
  bedrooms: 3,
  bathrooms: 3,
  kitchens: 2,
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Plac%203%20Maja%2018%2C%20Szczawno-Zdr%C3%B3j',
  bookingUrl:
    'https://www.booking.com/hotel/pl/dom-z-piernika-szczawno-zdroj.pl.html?label=gen173bo-10CAsotgFCHWRvbS16LXBpZXJuaWthLXN6Y3phd25vLXpkcm9qSDNYA2i2AYgBAZgBM7gBF8gBDNgBA-gBAfgBAYgCAZgCBqgCAbgCrYLD0gbAAgHSAiRlMmEzZmE0Mi1iM2M5LTRkMWMtOWZhZC0zZGNiMGMzOWIyZWTYAgHgAgE&sid=4f4ca90d33d643daf0e9827fde0ba261&dist=0&keep_landing=1&sb_price_type=total&type=total&',
  contactEmail: 'tomzaremba@gmail.com',
};
