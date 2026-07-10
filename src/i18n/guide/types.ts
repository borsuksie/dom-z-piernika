export interface PoiCopy {
  forWhom: string;
  description: string;
  hours: string;
}

export type GuideDictionary = Record<string, PoiCopy>;
