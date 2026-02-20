export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: 'HeartPulse' | 'Baby' | 'Apple' | 'Brain';
  price: string;
  features: string[];
  image?: string;
}

export type ServicePublishPayload = Omit<Service, 'id'>;

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
  downloadLink?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string; // e.g., "PCOS Patient" or "Mother"
  content: string;
  image: string;
}

export type FeedbackStatus = 'pending' | 'approved' | 'rejected';

export interface Feedback {
  id: string;
  name: string;
  role: string;
  content: string;
  image: string;
  status: FeedbackStatus;
  submittedAt: string;
}

export type FeedbackSubmitPayload = Pick<Feedback, 'name' | 'role' | 'content' | 'image'>;

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export type FaqPublishPayload = Omit<FaqItem, 'id'>;

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
  paymentMethod: 'bkash' | 'nagad' | string;
  phone?: string;
  paymentNumber?: string;
  transactionId?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'paid' | 'completed';
  createdAt: string;
}

export type EbookPublishPayload = Omit<Ebook, 'id'>;

export type ServiceOrderStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface ServiceOrder {
  id: string;
  serviceId: string;
  serviceTitle: string;
  servicePrice: string;
  userId: string;
  userName: string;
  userEmail: string;
  paymentMethod: 'bkash' | 'nagad';
  paymentNumber: string;
  transactionId: string;
  status: ServiceOrderStatus;
  createdAt: string;
}

export type ServiceOrderPayload = Omit<ServiceOrder, 'id' | 'status' | 'createdAt'>;

export interface ServiceIntakeFormData {
  consentAccepted: boolean;
  fullName: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  waist: string;
  bloodGroup: string;
  dailyWorkType: string;
  exerciseFrequency: string;
  exerciseDetails: string;
  goal: string;
  healthProblems: string;
  currentMedications: string;
  recentBloodTest: string;
  fastingGlucoseHbA1c: string;
  familyHistory: string;
  foodPattern: string;
  mealFrequency: string;
  foodDiary3Days: string;
  waterIntake: string;
  junkFoodFrequency: string;
  carbsCraving: string;
  fastingGapHours: string;
  sleepHours: string;
  stressLevel: string;
  stressHandling: string;
  digestiveIssues: string;
  allergyInfo: string;
  intoleranceInfo: string;
  preferredFoods: string;
  avoidFoods: string;
  additionalNotes: string;
  extendedAnswers: Record<string, string>;
  medicalReportUrls: string[];
}

export interface ServiceIntakeForm {
  orderId: string;
  userId: string;
  userEmail: string;
  serviceId: string;
  serviceTitle: string;
  data: ServiceIntakeFormData;
  submitted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ServiceIntakeFormPayload = Omit<ServiceIntakeForm, 'createdAt' | 'updatedAt'>;
