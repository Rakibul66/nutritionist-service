export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: 'HeartPulse' | 'Baby' | 'Apple' | 'Brain';
  price: string;
  features: string[];
}

export enum BookCategory {
  CHILD = 'Child Nutrition',
  BEAUTY = 'Beauty & Wellness',
  THERAPEUTIC = 'Therapeutic Guides',
}

export interface Ebook {
  id: string;
  title: string;
  category: BookCategory;
  price: number;
  coverImage: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string; // e.g., "PCOS Patient" or "Mother"
  content: string;
  image: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}