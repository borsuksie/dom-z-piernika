import type { CategorySlug } from '../data/guide/categories';
import type { AmenityKey } from '../data/house';

export interface CategoryCopy {
  name: string;
  description: string;
}

export interface RecommendationCopy {
  label: string;
  value: string;
}

export interface Dictionary {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    selectLanguage: string;
    home: string;
    guide: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaBook: string;
    ctaGuide: string;
  };
  about: {
    heading: string;
    paragraphs: string[];
    addressLabel: string;
    mapLabel: string;
  };
  highlights: {
    heading: string;
    items: string[];
  };
  amenities: {
    heading: string;
    items: Record<AmenityKey, string>;
  };
  houseRules: {
    heading: string;
    intro: string;
    items: string[];
  };
  booking: {
    heading: string;
    text: string;
    button: string;
    contactLabel: string;
  };
  guideTeaser: {
    heading: string;
    text: string;
    button: string;
  };
  guideIndex: {
    title: string;
    description: string;
    intro: string;
    disclaimer: string;
    categoriesHeading: string;
    recommendationsHeading: string;
    recommendations: RecommendationCopy[];
    historyHeading: string;
    historyParagraphs: string[];
  };
  categories: Record<CategorySlug, CategoryCopy>;
  guideCategory: {
    backToGuide: string;
    walkLabel: string;
    bikeLabel: string;
    carLabel: string;
    onSiteLabel: string;
    forWhomLabel: string;
    hoursLabel: string;
    mapButton: string;
    websiteButton: string;
    badgeTop: string;
    badgeUnesco: string;
    badgeRecommended: string;
    placesCount: string;
  };
  footer: {
    disclaimer: string;
    rights: string;
  };
}
