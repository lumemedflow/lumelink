export interface BusinessProfile {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  about: string;
  logoUrl?: string;
  contact: {
    phone?: string;
    email?: string;
    whatsapp?: string;
    address?: string;
    mapUrl?: string;
    website?: string;
  };
  social: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
    justdial?: string;
    gmb?: string;
  };
  services: Array<{
    title: string;
    description: string;
    price: string;
  }>;
  gallery: string[];
  testimonials: Array<{
    name: string;
    text: string;
    rating: number;
  }>;
  offers: Array<{
    title: string;
    description: string;
  }>;
  createdAt: number;
  updatedAt: number;
  scanCount: number;
  clickCounts: Record<string, number>;
}
