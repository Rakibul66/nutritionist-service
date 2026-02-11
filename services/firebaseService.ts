import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  type DocumentData,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import {
  Ebook,
  EbookOrder,
  EbookPublishPayload,
  EbookReview,
} from '../types';
import {
  firebaseFirestore,
  isFirebaseReady,
} from './firebaseClient';
import { fetchEbooks, fetchSampleOrders, fetchSampleReviews } from './dataService';

const asIsoString = (value: unknown) => {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return new Date().toISOString();
};

const mapDocToReview = (doc: DocumentData & { id?: string }): EbookReview => ({
  id: doc.id ?? 'reviews-unknown',
  bookId: doc.bookId,
  bookTitle: doc.bookTitle ?? 'Uncategorized ebook',
  message: doc.message ?? '',
  rating: doc.rating ?? 5,
  userName: doc.userName ?? 'Anonymous',
  userEmail: doc.userEmail ?? 'anonymous@email.com',
  submittedAt: asIsoString(doc.createdAt),
});

const mapDocToOrder = (doc: DocumentData & { id?: string }): EbookOrder => ({
  id: doc.id ?? 'orders-unknown',
  ebookId: doc.ebookId ?? 'unknown',
  ebookTitle: doc.ebookTitle ?? 'Unknown ebook',
  price: doc.price ?? 0,
  userName: doc.userName ?? 'Anonymous',
  userEmail: doc.userEmail ?? 'anonymous@email.com',
  paymentMethod: doc.paymentMethod ?? 'Unknown',
  phone: doc.phone,
  status: doc.status ?? 'pending',
  createdAt: asIsoString(doc.createdAt),
});

export const fetchRemoteEbooks = async (): Promise<Ebook[]> => {
  if (!firebaseFirestore) {
    return fetchEbooks();
  }
  const ebookSnap = await getDocs(collection(firebaseFirestore, 'ebooks'));
  return ebookSnap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Ebook, 'id'>),
  }));
};

export const submitReview = async ({
  book,
  message,
  rating,
  user,
}: {
  book: Ebook;
  message: string;
  rating: number;
  user: User | null;
}): Promise<void> => {
  if (!firebaseFirestore) {
    console.warn('Firebase not configured, review saved locally only');
    return;
  }
  await addDoc(collection(firebaseFirestore, 'reviews'), {
    bookId: book.id,
    bookTitle: book.title,
    message,
    rating,
    userName: user?.displayName ?? 'Guest',
    userEmail: user?.email ?? 'guest@local',
    createdAt: serverTimestamp(),
  });
};

export const fetchRecentReviews = async (): Promise<EbookReview[]> => {
  if (!firebaseFirestore) {
    return fetchSampleReviews();
  }
  const reviewsQuery = query(
    collection(firebaseFirestore, 'reviews'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(reviewsQuery);
  return snapshot.docs.map((doc) => mapDocToReview({ ...doc.data(), id: doc.id }));
};

export const placeOrder = async ({
  book,
  user,
  phone,
  paymentMethod,
}: {
  book: Ebook;
  user: User | null;
  phone?: string;
  paymentMethod: string;
}): Promise<void> => {
  if (!firebaseFirestore) {
    console.warn('Firebase not configured, order stored locally only');
    return;
  }
  await addDoc(collection(firebaseFirestore, 'orders'), {
    ebookId: book.id,
    ebookTitle: book.title,
    price: book.price,
    userName: user?.displayName ?? 'Guest',
    userEmail: user?.email ?? 'guest@local',
    phone,
    paymentMethod,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
};

export const fetchOrders = async (): Promise<EbookOrder[]> => {
  if (!firebaseFirestore) {
    return fetchSampleOrders();
  }
  const ordersQuery = query(
    collection(firebaseFirestore, 'orders'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(ordersQuery);
  return snapshot.docs.map((doc) => mapDocToOrder({ ...doc.data(), id: doc.id }));
};

export const publishEbook = async (payload: EbookPublishPayload): Promise<void> => {
  if (!firebaseFirestore) {
    console.warn('Firebase not configured, ebook publish skipped');
    return;
  }
  await addDoc(collection(firebaseFirestore, 'ebooks'), {
    ...payload,
    createdAt: serverTimestamp(),
  });
};
