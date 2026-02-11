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
  driveLink?: string;
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

export interface EbookReview {
  id: string;
  bookId?: string;
  bookTitle: string;
  message: string;
  rating: number;
  userName: string;
  userEmail: string;
  submittedAt: string;
}

export interface EbookOrder {
  id: string;
  ebookId: string;
  ebookTitle: string;
  price: number;
  userName: string;
  userEmail: string;
  paymentMethod: string;
  phone?: string;
  status?: 'pending' | 'paid' | 'completed';
  createdAt: string;
}

export type EbookPublishPayload = Omit<Ebook, 'id'>;
