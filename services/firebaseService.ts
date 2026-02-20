import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  type DocumentData,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { User } from 'firebase/auth';
import {
  Ebook,
  EbookOrder,
  EbookPublishPayload,
  EbookReview,
  FaqItem,
  FaqPublishPayload,
  Feedback,
  FeedbackStatus,
  FeedbackSubmitPayload,
  Service,
  ServiceOrder,
  ServiceOrderPayload,
  ServiceOrderStatus,
  ServiceIntakeForm,
  ServiceIntakeFormPayload,
  Testimonial,
  ServicePublishPayload,
} from '../types';
import {
  firebaseFirestore,
  firebaseStorage,
} from './firebaseClient';
import {
  fetchEbooks,
  deleteEbookOrder as deleteLocalEbookOrder,
  fetchEbookOrderById as fetchLocalEbookOrderById,
  submitEbookOrder as submitLocalEbookOrder,
  updateEbookOrderStatus as updateLocalEbookOrderStatus,
  fetchFaqs,
  deleteServiceOrder as deleteLocalServiceOrder,
  fetchServiceOrders as fetchLocalServiceOrders,
  deleteFeedbackEntry as deleteLocalFeedbackEntry,
  fetchFeedbackEntries as fetchLocalFeedbackEntries,
  fetchSampleOrders,
  fetchSampleReviews,
  fetchServices,
  fetchServiceIntakeFormByOrderId as fetchLocalServiceIntakeFormByOrderId,
  publishFaq as publishLocalFaq,
  removeFaq as removeLocalFaq,
  submitServiceOrder as submitLocalServiceOrder,
  fetchTestimonials as fetchLocalTestimonials,
  submitFeedbackEntry,
  upsertServiceIntakeForm as upsertLocalServiceIntakeForm,
  updateFaq as updateLocalFaq,
  updateFeedbackStatus as updateLocalFeedbackStatus,
  updateServiceOrderStatus as updateLocalServiceOrderStatus,
} from './dataService';

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
  paymentNumber: doc.paymentNumber ?? '',
  transactionId: doc.transactionId ?? '',
  status:
    doc.status === 'approved' ||
    doc.status === 'rejected' ||
    doc.status === 'pending' ||
    doc.status === 'paid' ||
    doc.status === 'completed'
      ? doc.status
      : 'pending',
  createdAt: asIsoString(doc.createdAt),
});

const mapDocToFeedback = (docData: DocumentData & { id?: string }): Feedback => ({
  id: docData.id ?? `feedback-${crypto.randomUUID()}`,
  name: docData.name ?? 'Anonymous',
  role: docData.role ?? 'Visitor',
  content: docData.content ?? '',
  image: docData.image ?? 'https://picsum.photos/100/100?random=99',
  status: docData.status ?? 'pending',
  submittedAt: asIsoString(docData.createdAt),
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

export const submitFeedback = async (payload: FeedbackSubmitPayload): Promise<void> => {
  if (!firebaseFirestore) {
    await submitFeedbackEntry(payload);
    return;
  }

  await addDoc(collection(firebaseFirestore, 'feedbacks'), {
    ...payload,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
};

export const fetchFeedbackEntries = async (): Promise<Feedback[]> => {
  if (!firebaseFirestore) {
    return fetchLocalFeedbackEntries();
  }

  const feedbackQuery = query(collection(firebaseFirestore, 'feedbacks'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(feedbackQuery);
  return snapshot.docs.map((feedbackDoc) => mapDocToFeedback({ ...feedbackDoc.data(), id: feedbackDoc.id }));
};

export const updateFeedbackStatus = async (
  feedbackId: string,
  status: FeedbackStatus
): Promise<void> => {
  if (!firebaseFirestore) {
    await updateLocalFeedbackStatus(feedbackId, status);
    return;
  }

  await updateDoc(doc(firebaseFirestore, 'feedbacks', feedbackId), {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const removeFeedback = async (feedbackId: string): Promise<void> => {
  if (!firebaseFirestore) {
    await deleteLocalFeedbackEntry(feedbackId);
    return;
  }

  await deleteDoc(doc(firebaseFirestore, 'feedbacks', feedbackId));
};

export const fetchApprovedTestimonials = async (): Promise<Testimonial[]> => {
  if (!firebaseFirestore) {
    return fetchLocalTestimonials();
  }

  const feedbackList = await fetchFeedbackEntries();
  return feedbackList
    .filter((item) => item.status === 'approved')
    .map((item) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      content: item.content,
      image: item.image,
    }));
};

export const placeOrder = async ({
  book,
  user,
  phone,
  paymentMethod,
  paymentNumber,
  transactionId,
}: {
  book: Ebook;
  user: User | null;
  phone?: string;
  paymentMethod: 'bkash' | 'nagad' | string;
  paymentNumber: string;
  transactionId: string;
}): Promise<EbookOrder> => {
  if (!firebaseFirestore) {
    return submitLocalEbookOrder({
      ebookId: book.id,
      ebookTitle: book.title,
      price: book.price,
      userName: user?.displayName ?? 'Guest',
      userEmail: user?.email ?? 'guest@local',
      phone,
      paymentMethod,
      paymentNumber,
      transactionId,
    });
  }
  const docRef = await addDoc(collection(firebaseFirestore, 'orders'), {
    ebookId: book.id,
    ebookTitle: book.title,
    price: book.price,
    userName: user?.displayName ?? 'Guest',
    userEmail: user?.email ?? 'guest@local',
    phone,
    paymentMethod,
    paymentNumber,
    transactionId,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return {
    id: docRef.id,
    ebookId: book.id,
    ebookTitle: book.title,
    price: book.price,
    userName: user?.displayName ?? 'Guest',
    userEmail: user?.email ?? 'guest@local',
    phone,
    paymentMethod,
    paymentNumber,
    transactionId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
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

export const fetchEbookOrderById = async (orderId: string): Promise<EbookOrder | null> => {
  if (!firebaseFirestore) {
    return fetchLocalEbookOrderById(orderId);
  }
  const orderSnap = await getDoc(doc(firebaseFirestore, 'orders', orderId));
  if (!orderSnap.exists()) {
    return null;
  }
  return mapDocToOrder({ ...orderSnap.data(), id: orderSnap.id });
};

export const updateEbookOrderStatus = async (
  orderId: string,
  status: 'pending' | 'approved' | 'rejected'
): Promise<void> => {
  if (!firebaseFirestore) {
    await updateLocalEbookOrderStatus(orderId, status);
    return;
  }
  await updateDoc(doc(firebaseFirestore, 'orders', orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const deleteEbookOrder = async (orderId: string): Promise<void> => {
  if (!firebaseFirestore) {
    await deleteLocalEbookOrder(orderId);
    return;
  }

  await deleteDoc(doc(firebaseFirestore, 'orders', orderId));
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

export const uploadEbookPdf = async (file: File): Promise<string> => {
  const fileName = file.name.replace(/\s+/g, '-').toLowerCase();

  if (!firebaseStorage) {
    return URL.createObjectURL(file);
  }

  const storagePath = `ebooks/${Date.now()}-${crypto.randomUUID()}-${fileName}`;
  const storageRef = ref(firebaseStorage, storagePath);
  await uploadBytes(storageRef, file, { contentType: 'application/pdf' });
  return getDownloadURL(storageRef);
};

export const uploadMedicalReportFile = async (file: File): Promise<string> => {
  const fileName = file.name.replace(/\s+/g, '-').toLowerCase();

  if (!firebaseStorage) {
    return URL.createObjectURL(file);
  }

  const storagePath = `medical-reports/${Date.now()}-${crypto.randomUUID()}-${fileName}`;
  const storageRef = ref(firebaseStorage, storagePath);
  await uploadBytes(storageRef, file, { contentType: file.type || 'application/octet-stream' });
  return getDownloadURL(storageRef);
};

const mapDocToService = (docData: DocumentData & { id?: string }): Service => ({
  id: docData.id ?? crypto.randomUUID(),
  title: docData.title ?? '',
  description: docData.description ?? '',
  iconName: docData.iconName ?? 'HeartPulse',
  price: docData.price ?? '৳০',
  features: Array.isArray(docData.features) ? docData.features : [],
  image: docData.image ?? '',
});

const mapDocToFaq = (docData: DocumentData & { id?: string }): FaqItem => ({
  id: docData.id ?? crypto.randomUUID(),
  question: docData.question ?? '',
  answer: docData.answer ?? '',
});

const mapDocToServiceOrder = (docData: DocumentData & { id?: string }): ServiceOrder => ({
  id: docData.id ?? crypto.randomUUID(),
  serviceId: docData.serviceId ?? 'unknown-service',
  serviceTitle: docData.serviceTitle ?? 'Unknown service',
  servicePrice: docData.servicePrice ?? '৳০',
  userId: docData.userId ?? 'guest',
  userName: docData.userName ?? 'Guest',
  userEmail: docData.userEmail ?? 'guest@local',
  paymentMethod: docData.paymentMethod === 'nagad' ? 'nagad' : 'bkash',
  paymentNumber: docData.paymentNumber ?? '',
  transactionId: docData.transactionId ?? '',
  status:
    docData.status === 'approved' ||
    docData.status === 'rejected' ||
    docData.status === 'pending' ||
    docData.status === 'completed'
      ? docData.status
      : 'pending',
  createdAt: asIsoString(docData.createdAt),
});

const mapDocToServiceIntake = (docData: DocumentData & { id?: string }): ServiceIntakeForm => ({
  orderId: docData.orderId ?? docData.id ?? '',
  userId: docData.userId ?? 'guest',
  userEmail: docData.userEmail ?? 'guest@local',
  serviceId: docData.serviceId ?? '',
  serviceTitle: docData.serviceTitle ?? '',
  data: {
    consentAccepted: Boolean(docData.data?.consentAccepted),
    fullName: docData.data?.fullName ?? '',
    age: docData.data?.age ?? '',
    gender: docData.data?.gender ?? '',
    height: docData.data?.height ?? '',
    weight: docData.data?.weight ?? '',
    waist: docData.data?.waist ?? '',
    bloodGroup: docData.data?.bloodGroup ?? '',
    dailyWorkType: docData.data?.dailyWorkType ?? '',
    exerciseFrequency: docData.data?.exerciseFrequency ?? '',
    exerciseDetails: docData.data?.exerciseDetails ?? '',
    goal: docData.data?.goal ?? '',
    healthProblems: docData.data?.healthProblems ?? '',
    currentMedications: docData.data?.currentMedications ?? '',
    recentBloodTest: docData.data?.recentBloodTest ?? '',
    fastingGlucoseHbA1c: docData.data?.fastingGlucoseHbA1c ?? '',
    familyHistory: docData.data?.familyHistory ?? '',
    foodPattern: docData.data?.foodPattern ?? '',
    mealFrequency: docData.data?.mealFrequency ?? '',
    foodDiary3Days: docData.data?.foodDiary3Days ?? '',
    waterIntake: docData.data?.waterIntake ?? '',
    junkFoodFrequency: docData.data?.junkFoodFrequency ?? '',
    carbsCraving: docData.data?.carbsCraving ?? '',
    fastingGapHours: docData.data?.fastingGapHours ?? '',
    sleepHours: docData.data?.sleepHours ?? '',
    stressLevel: docData.data?.stressLevel ?? '',
    stressHandling: docData.data?.stressHandling ?? '',
    digestiveIssues: docData.data?.digestiveIssues ?? '',
    allergyInfo: docData.data?.allergyInfo ?? '',
    intoleranceInfo: docData.data?.intoleranceInfo ?? '',
    preferredFoods: docData.data?.preferredFoods ?? '',
    avoidFoods: docData.data?.avoidFoods ?? '',
    additionalNotes: docData.data?.additionalNotes ?? '',
    extendedAnswers:
      docData.data?.extendedAnswers && typeof docData.data.extendedAnswers === 'object'
        ? docData.data.extendedAnswers
        : {},
    medicalReportUrls: Array.isArray(docData.data?.medicalReportUrls)
      ? docData.data?.medicalReportUrls.filter((url: unknown): url is string => typeof url === 'string')
      : [],
  },
  submitted: Boolean(docData.submitted),
  createdAt: asIsoString(docData.createdAt),
  updatedAt: asIsoString(docData.updatedAt),
});

export const fetchRemoteServices = async (): Promise<Service[]> => {
  if (!firebaseFirestore) {
    return fetchServices();
  }
  const servicesQuery = query(
    collection(firebaseFirestore, 'services'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(servicesQuery);
  return snapshot.docs.map((serviceDoc) => mapDocToService({ ...serviceDoc.data(), id: serviceDoc.id }));
};

export const publishService = async (payload: ServicePublishPayload): Promise<void> => {
  if (!firebaseFirestore) {
    console.warn('Firebase not configured, service publish skipped');
    return;
  }
  await addDoc(collection(firebaseFirestore, 'services'), {
    ...payload,
    createdAt: serverTimestamp(),
  });
};

export const updateService = async (
  serviceId: string,
  payload: ServicePublishPayload
): Promise<void> => {
  if (!firebaseFirestore) {
    console.warn('Firebase not configured, service update skipped');
    return;
  }
  await updateDoc(doc(firebaseFirestore, 'services', serviceId), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
};

export const removeService = async (serviceId: string): Promise<void> => {
  if (!firebaseFirestore) {
    console.warn('Firebase not configured, service delete skipped');
    return;
  }
  await deleteDoc(doc(firebaseFirestore, 'services', serviceId));
};

export const placeServiceOrder = async (payload: ServiceOrderPayload): Promise<ServiceOrder> => {
  if (!firebaseFirestore) {
    return submitLocalServiceOrder(payload);
  }

  const createdRef = await addDoc(collection(firebaseFirestore, 'serviceOrders'), {
    ...payload,
    status: 'pending',
    createdAt: serverTimestamp(),
  });

  return {
    id: createdRef.id,
    ...payload,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
};

export const fetchServiceOrders = async (): Promise<ServiceOrder[]> => {
  if (!firebaseFirestore) {
    return fetchLocalServiceOrders();
  }

  const ordersQuery = query(collection(firebaseFirestore, 'serviceOrders'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(ordersQuery);
  return snapshot.docs.map((orderDoc) => mapDocToServiceOrder({ ...orderDoc.data(), id: orderDoc.id }));
};

export const fetchServiceOrderById = async (orderId: string): Promise<ServiceOrder | null> => {
  if (!firebaseFirestore) {
    const localOrders = await fetchLocalServiceOrders();
    return localOrders.find((order) => order.id === orderId) ?? null;
  }

  const snapshot = await getDoc(doc(firebaseFirestore, 'serviceOrders', orderId));
  if (!snapshot.exists()) {
    return null;
  }

  return mapDocToServiceOrder({ ...snapshot.data(), id: snapshot.id });
};

export const updateServiceOrderStatus = async (
  orderId: string,
  status: ServiceOrderStatus
): Promise<void> => {
  if (!firebaseFirestore) {
    await updateLocalServiceOrderStatus(orderId, status);
    return;
  }

  await updateDoc(doc(firebaseFirestore, 'serviceOrders', orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const deleteServiceOrder = async (orderId: string): Promise<void> => {
  if (!firebaseFirestore) {
    await deleteLocalServiceOrder(orderId);
    return;
  }

  await deleteDoc(doc(firebaseFirestore, 'serviceOrders', orderId));
};

export const fetchServiceIntakeFormByOrderId = async (
  orderId: string
): Promise<ServiceIntakeForm | null> => {
  if (!firebaseFirestore) {
    return fetchLocalServiceIntakeFormByOrderId(orderId);
  }

  const snapshot = await getDoc(doc(firebaseFirestore, 'serviceIntakeForms', orderId));
  if (!snapshot.exists()) {
    return null;
  }

  return mapDocToServiceIntake({ ...snapshot.data(), id: snapshot.id });
};

export const upsertServiceIntakeForm = async (
  payload: ServiceIntakeFormPayload
): Promise<ServiceIntakeForm> => {
  if (!firebaseFirestore) {
    return upsertLocalServiceIntakeForm(payload);
  }

  const ref = doc(firebaseFirestore, 'serviceIntakeForms', payload.orderId);
  await setDoc(
    ref,
    {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  const snapshot = await getDoc(ref);
  return mapDocToServiceIntake({ ...snapshot.data(), id: payload.orderId });
};

export const fetchRemoteFaqs = async (): Promise<FaqItem[]> => {
  if (!firebaseFirestore) {
    return fetchFaqs();
  }
  const faqQuery = query(collection(firebaseFirestore, 'faqs'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(faqQuery);
  return snapshot.docs.map((faqDoc) => mapDocToFaq({ ...faqDoc.data(), id: faqDoc.id }));
};

export const publishFaq = async (payload: FaqPublishPayload): Promise<void> => {
  if (!firebaseFirestore) {
    await publishLocalFaq(payload);
    return;
  }
  await addDoc(collection(firebaseFirestore, 'faqs'), {
    ...payload,
    createdAt: serverTimestamp(),
  });
};

export const updateFaq = async (faqId: string, payload: FaqPublishPayload): Promise<void> => {
  if (!firebaseFirestore) {
    await updateLocalFaq(faqId, payload);
    return;
  }
  await updateDoc(doc(firebaseFirestore, 'faqs', faqId), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
};

export const removeFaq = async (faqId: string): Promise<void> => {
  if (!firebaseFirestore) {
    await removeLocalFaq(faqId);
    return;
  }
  await deleteDoc(doc(firebaseFirestore, 'faqs', faqId));
};
