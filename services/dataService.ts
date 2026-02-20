import {
  Service,
  Ebook,
  BookCategory,
  Testimonial,
  EbookReview,
  EbookOrder,
  Feedback,
  FeedbackStatus,
  FeedbackSubmitPayload,
  FaqItem,
  FaqPublishPayload,
  ServiceOrder,
  ServiceOrderPayload,
  ServiceOrderStatus,
  ServiceIntakeForm,
  ServiceIntakeFormPayload,
  } from '../types';

// In a real app, these would be fetched from a backend API (Node/Python).
// Here we simulate the database response with promises.

const SERVICES_DATA: Service[] = [
  {
    id: '1',
    title: 'মেটাবলিক হেলথ রিকভারি',
    description: 'মেডিসিন ছাড়াই লাইফস্টাইল মডিফিকেশনের মাধ্যমে ডায়াবেটিস ও ব্লাড প্রেসার নিয়ন্ত্রণ।',
    iconName: 'HeartPulse',
    price: '৳৩,০০০',
    features: ['হরমোনাল ব্যালেন্স অ্যানালাইসিস', 'পার্সোনালাইজড ডায়েট চার্ট', 'সাপ্তাহিক ফলো-আপ'],
    image: 'https://raw.githubusercontent.com/Rakibul66/Recent-Project-Apk/refs/heads/main/a.webp',
  },
  {
    id: '2',
    title: 'PCOS ম্যানেজমেন্ট',
    description: 'ওজন কমানো এবং পিরিয়ড সাইকেল রেগুলার করার জন্য সায়েন্টিফিক এপ্রোচ।',
    iconName: 'Apple',
    price: '৳২,৫০০',
    features: ['ইনসুলিন রেজিস্ট্যান্স ফোকাস', 'সাপ্লিমেন্ট গাইডলাইন', 'স্ট্রেস ম্যানেজমেন্ট'],
    image: 'https://raw.githubusercontent.com/Rakibul66/Recent-Project-Apk/refs/heads/main/b.webp',
  },
  {
    id: '3',
    title: 'চাইল্ড নিউট্রিশন কনসালটেন্সি',
    description: 'বাচ্চাদের গ্রোথ, ইমিউনিটি এবং খাদ্যাভ্যাস গঠনের কমপ্লিট গাইডলাইন।',
    iconName: 'Baby',
    price: '৳২,০০০',
    features: ['পিকি ইটার সল্যুশন', 'ব্রেইন ডেভেলপমেন্ট ফুড', 'টক্সিন ফ্রি লাইফস্টাইল'],
    image: 'https://raw.githubusercontent.com/Rakibul66/Recent-Project-Apk/refs/heads/main/1770827153538.webp',
  },
];

const EBOOKS_DATA: Ebook[] = [
  {
    id: '101',
    title: 'Applied Child Nutrition',
    category: BookCategory.CHILD,
    price: 450,
    coverImage: 'https://picsum.photos/300/450?random=1',
    description: 'বাচ্চাদের সঠিক পুষ্টি ও মেধার বিকাশে প্যারেন্টসদের জন্য কমপ্লিট গাইডবুক।',
  },
  {
    id: '102',
    title: 'Applied Metabolic Beauty',
    category: BookCategory.BEAUTY,
    price: 500,
    coverImage: 'https://picsum.photos/300/450?random=2',
    description: 'ত্বক ও চুলের উজ্জ্বলতা বাড়াতে ভেতর থেকে হরমোনাল ব্যালেন্স করার উপায়।',
  },
  {
    id: '103',
    title: 'Heart Disease Reversal Guide',
    category: BookCategory.THERAPEUTIC,
    price: 600,
    coverImage: 'https://picsum.photos/300/450?random=3',
    description: 'হার্ট ব্লকেজ ও কোলেস্টেরল নিয়ন্ত্রণে রাখার কার্যকরী ন্যাচারাল গাইডলাইন।',
  },
  {
    id: '104',
    title: 'PCOS & Fertility Diet',
    category: BookCategory.THERAPEUTIC,
    price: 550,
    coverImage: 'https://picsum.photos/300/450?random=4',
    description: 'মাতৃত্বকালীন প্রস্তুতি ও হরমোনাল সমস্যার সমাধানে ডায়েট প্ল্যান।',
  },
  {
    id: '105',
    title: 'Mindful Meal Planner',
    category: BookCategory.CHILD,
    price: 0,
    coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=400&q=80',
    description: 'পাড়া-বেড়া খাওয়ার তালিকায় ফাইবার, প্রোটিন এবং সজীবতার সমন্বয়।',
  },
  {
    id: '106',
    title: 'Glow from Within',
    category: BookCategory.BEAUTY,
    price: 0,
    coverImage: 'https://images.unsplash.com/photo-1500686201873-3bd4bf13ed5c?auto=format&fit=crop&w=400&q=80',
    description: 'ত্বকের উজ্জ্বলতা বাড়াতে ভেতর থেকে ডিটক্স ও হাইড্রেশন টিপস।',
  },
  {
    id: '107',
    title: 'Nutrition Insight Manual',
    category: BookCategory.THERAPEUTIC,
    price: 0,
    coverImage: 'https://raw.githubusercontent.com/Rakibul66/Recent-Project-Apk/main/Gemini_Generated_Image_gsubrzgsubrzgsub%20(1).webp',
    description: 'এখনই ডাউনলোড করুন প্রিমিয়াম গাইডটি যা সংক্ষিপ্ত ডায়েট ও লাইফস্টাইল হ্যাক দেয়।',
    driveLink: 'https://drive.google.com/file/d/1HrOUQnLfjLgFz0natL6zlFyj68HeUpFp/view?usp=sharing',
  },
  {
    id: '108',
    title: 'Atomic Habits',
    category: BookCategory.THERAPEUTIC,
    price: 0,
    coverImage: 'https://rokbucket.rokomari.io/ProductNew20190903/260X372/7107f4cb3_201686.jpg',
    description: 'হাবিট তৈরি ও বদলে নেওয়ার সিস্টেম যা দৈনন্দিন সিদ্ধান্তগুলোকে পজিটিভ ডিরেকশন দেয়।',
    driveLink: 'https://dl.bdebooks.com/Missing%20Books/Atomic%20Habits%20-%20James%20Clear%20(BDeBooks.Com).pdf',
  },
];

const FAQ_STORAGE_KEY = 'nutritionist-faq-v1';

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'মুসলিমস ডে অ্যাপ কি বিনামূল্যে ব্যবহার করা যায়?',
    answer:
      'হ্যাঁ, অ্যাপের মূল ফিচারগুলো আপনি ফ্রি ব্যবহার করতে পারবেন। কিছু প্রিমিয়াম ফিচারের জন্য সাবস্ক্রিপশন প্রয়োজন হতে পারে।',
  },
  {
    id: 'faq-2',
    question: 'প্রিমিয়াম সাবস্ক্রিপশনে আপগ্রেড করার সুবিধাগুলো কী?',
    answer:
      'প্রিমিয়াম ব্যবহারকারীরা বিজ্ঞাপনমুক্ত অভিজ্ঞতা, অগ্রাধিকার সাপোর্ট এবং এক্সট্রা ফিচার ব্যবহার করতে পারেন।',
  },
  {
    id: 'faq-3',
    question: 'অ্যাপটি কুরআনের জন্য বাংলা বা ইংরেজি উচ্চারণ কেন প্রদান করে না?',
    answer:
      'পবিত্র টেক্সটের যথার্থতা বজায় রাখার জন্য আমরা মূল আরবি টেক্সটকে প্রাধান্য দেই। অনুবাদ ও তাফসির আলাদা সোর্স থেকে দেখা যেতে পারে।',
  },
  {
    id: 'faq-4',
    question: 'নামাজের অ্যালার্ম আজান টোন নাই কেন?',
    answer:
      'ডিভাইসের সাইলেন্ট/ডু নট ডিস্টার্ব সেটিং, অ্যাপ নোটিফিকেশন পারমিশন এবং ব্যাটারি অপটিমাইজেশন সেটিং চেক করুন।',
  },
];

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'ফারজানা আক্তার',
    role: 'PCOS পেশেন্ট',
    content: 'ম্যামের গাইডলাইন ফলো করে ৩ মাসের মধ্যে আমার পিরিয়ড রেগুলার হয়েছে এবং ১০ কেজি ওজন কমেছে। কোনো মেডিসিন ছাড়াই!',
    image: 'https://picsum.photos/100/100?random=10',
  },
  {
    id: 't2',
    name: 'রাশেদ করিম',
    role: 'ব্যবসায়ী',
    content: 'হাই ব্লাড প্রেসার নিয়ে খুব চিন্তায় ছিলাম। ডায়েট চার্ট ফলো করার পর এখন আমি পুরোপুরি সুস্থ অনুভব করছি।',
    image: 'https://picsum.photos/100/100?random=11',
  },
  {
    id: 't3',
    name: 'সুমাইয়া ইসলাম',
    role: 'গৃহিণী',
    content: 'আমার বাচ্চার খাওয়া নিয়ে খুব সমস্যা ছিল। চাইল্ড নিউট্রিশন বইটি পড়ার পর অনেক সহজ সমাধান পেয়েছি।',
    image: 'https://picsum.photos/100/100?random=12',
  },
];

const FEEDBACK_STORAGE_KEY = 'nutritionist-feedback-v1';
const SERVICE_ORDER_STORAGE_KEY = 'nutritionist-service-orders-v1';
const EBOOK_ORDER_STORAGE_KEY = 'nutritionist-ebook-orders-v1';
const SERVICE_INTAKE_STORAGE_KEY = 'nutritionist-service-intakes-v1';

const nowIso = () => new Date().toISOString();

const normalizeStatus = (value: unknown): FeedbackStatus => {
  if (value === 'approved' || value === 'rejected') {
    return value;
  }
  return 'pending';
};

const asFeedback = (entry: Partial<Feedback>): Feedback => ({
  id: entry.id ?? crypto.randomUUID(),
  name: entry.name?.trim() || 'Anonymous',
  role: entry.role?.trim() || 'Visitor',
  content: entry.content?.trim() || '',
  image: entry.image?.trim() || 'https://picsum.photos/100/100?random=99',
  status: normalizeStatus(entry.status),
  submittedAt: entry.submittedAt ?? nowIso(),
});

const buildSeedFeedback = (): Feedback[] =>
  INITIAL_TESTIMONIALS.map((item) =>
    asFeedback({
      ...item,
      status: 'approved',
      submittedAt: nowIso(),
    })
  );

const readFeedbackFromStorage = (): Feedback[] => {
  if (typeof window === 'undefined') {
    return buildSeedFeedback();
  }

  try {
    const raw = window.localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!raw) {
      const seed = buildSeedFeedback();
      window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return buildSeedFeedback();
    }

    return parsed.map((item) => asFeedback(item as Partial<Feedback>));
  } catch {
    return buildSeedFeedback();
  }
};

const writeFeedbackToStorage = (feedbackList: Feedback[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbackList));
};

const asFaq = (entry: Partial<FaqItem>): FaqItem => ({
  id: entry.id ?? crypto.randomUUID(),
  question: entry.question?.trim() || '',
  answer: entry.answer?.trim() || '',
});

const readFaqsFromStorage = (): FaqItem[] => {
  if (typeof window === 'undefined') {
    return FAQ_DATA;
  }

  try {
    const raw = window.localStorage.getItem(FAQ_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(FAQ_DATA));
      return FAQ_DATA;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return FAQ_DATA;
    }

    return parsed.map((item) => asFaq(item as Partial<FaqItem>)).filter((item) => item.question && item.answer);
  } catch {
    return FAQ_DATA;
  }
};

const writeFaqsToStorage = (faqList: FaqItem[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(faqList));
};

const asServiceOrder = (entry: Partial<ServiceOrder>): ServiceOrder => ({
  id: entry.id ?? crypto.randomUUID(),
  serviceId: entry.serviceId ?? '',
  serviceTitle: entry.serviceTitle ?? 'Unknown service',
  servicePrice: entry.servicePrice ?? '৳০',
  userId: entry.userId ?? 'guest',
  userName: entry.userName ?? 'Guest',
  userEmail: entry.userEmail ?? 'guest@local',
  paymentMethod: entry.paymentMethod === 'nagad' ? 'nagad' : 'bkash',
  paymentNumber: entry.paymentNumber?.trim() || '',
  transactionId: entry.transactionId?.trim() || '',
  status:
    entry.status === 'approved' ||
    entry.status === 'rejected' ||
    entry.status === 'pending' ||
    entry.status === 'completed'
      ? entry.status
      : 'pending',
  createdAt: entry.createdAt ?? nowIso(),
});

const asEbookOrder = (entry: Partial<EbookOrder>): EbookOrder => ({
  id: entry.id ?? crypto.randomUUID(),
  ebookId: entry.ebookId ?? 'unknown',
  ebookTitle: entry.ebookTitle ?? 'Unknown ebook',
  price: entry.price ?? 0,
  userName: entry.userName ?? 'Anonymous',
  userEmail: entry.userEmail ?? 'anonymous@email.com',
  paymentMethod: entry.paymentMethod ?? 'bkash',
  phone: entry.phone,
  paymentNumber: entry.paymentNumber?.trim() || '',
  transactionId: entry.transactionId?.trim() || '',
  status:
    entry.status === 'approved' ||
    entry.status === 'rejected' ||
    entry.status === 'paid' ||
    entry.status === 'completed' ||
    entry.status === 'pending'
      ? entry.status
      : 'pending',
  createdAt: entry.createdAt ?? nowIso(),
});

const asServiceIntake = (entry: Partial<ServiceIntakeForm>): ServiceIntakeForm => ({
  orderId: entry.orderId ?? '',
  userId: entry.userId ?? 'guest',
  userEmail: entry.userEmail ?? 'guest@local',
  serviceId: entry.serviceId ?? '',
  serviceTitle: entry.serviceTitle ?? '',
  data: {
    consentAccepted: Boolean(entry.data?.consentAccepted),
    fullName: entry.data?.fullName ?? '',
    age: entry.data?.age ?? '',
    gender: entry.data?.gender ?? '',
    height: entry.data?.height ?? '',
    weight: entry.data?.weight ?? '',
    waist: entry.data?.waist ?? '',
    bloodGroup: entry.data?.bloodGroup ?? '',
    dailyWorkType: entry.data?.dailyWorkType ?? '',
    exerciseFrequency: entry.data?.exerciseFrequency ?? '',
    exerciseDetails: entry.data?.exerciseDetails ?? '',
    goal: entry.data?.goal ?? '',
    healthProblems: entry.data?.healthProblems ?? '',
    currentMedications: entry.data?.currentMedications ?? '',
    recentBloodTest: entry.data?.recentBloodTest ?? '',
    fastingGlucoseHbA1c: entry.data?.fastingGlucoseHbA1c ?? '',
    familyHistory: entry.data?.familyHistory ?? '',
    foodPattern: entry.data?.foodPattern ?? '',
    mealFrequency: entry.data?.mealFrequency ?? '',
    foodDiary3Days: entry.data?.foodDiary3Days ?? '',
    waterIntake: entry.data?.waterIntake ?? '',
    junkFoodFrequency: entry.data?.junkFoodFrequency ?? '',
    carbsCraving: entry.data?.carbsCraving ?? '',
    fastingGapHours: entry.data?.fastingGapHours ?? '',
    sleepHours: entry.data?.sleepHours ?? '',
    stressLevel: entry.data?.stressLevel ?? '',
    stressHandling: entry.data?.stressHandling ?? '',
    digestiveIssues: entry.data?.digestiveIssues ?? '',
    allergyInfo: entry.data?.allergyInfo ?? '',
    intoleranceInfo: entry.data?.intoleranceInfo ?? '',
    preferredFoods: entry.data?.preferredFoods ?? '',
    avoidFoods: entry.data?.avoidFoods ?? '',
    additionalNotes: entry.data?.additionalNotes ?? '',
    extendedAnswers:
      entry.data?.extendedAnswers && typeof entry.data.extendedAnswers === 'object'
        ? entry.data.extendedAnswers
        : {},
    medicalReportUrls: Array.isArray(entry.data?.medicalReportUrls)
      ? entry.data?.medicalReportUrls.filter((url): url is string => typeof url === 'string')
      : [],
  },
  submitted: Boolean(entry.submitted),
  createdAt: entry.createdAt ?? nowIso(),
  updatedAt: entry.updatedAt ?? nowIso(),
});

const readServiceOrdersFromStorage = (): ServiceOrder[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(SERVICE_ORDER_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((item) => asServiceOrder(item as Partial<ServiceOrder>));
  } catch {
    return [];
  }
};

const writeServiceOrdersToStorage = (orders: ServiceOrder[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(SERVICE_ORDER_STORAGE_KEY, JSON.stringify(orders));
};

const readEbookOrdersFromStorage = (): EbookOrder[] => {
  if (typeof window === 'undefined') {
    return ORDER_DATA.map((order) => asEbookOrder(order));
  }

  try {
    const raw = window.localStorage.getItem(EBOOK_ORDER_STORAGE_KEY);
    if (!raw) {
      const seeded = ORDER_DATA.map((order) => asEbookOrder(order));
      window.localStorage.setItem(EBOOK_ORDER_STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((item) => asEbookOrder(item as Partial<EbookOrder>));
  } catch {
    return [];
  }
};

const writeEbookOrdersToStorage = (orders: EbookOrder[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(EBOOK_ORDER_STORAGE_KEY, JSON.stringify(orders));
};

const readServiceIntakesFromStorage = (): ServiceIntakeForm[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(SERVICE_INTAKE_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((item) => asServiceIntake(item as Partial<ServiceIntakeForm>));
  } catch {
    return [];
  }
};

const writeServiceIntakesToStorage = (entries: ServiceIntakeForm[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(SERVICE_INTAKE_STORAGE_KEY, JSON.stringify(entries));
};

export const fetchServices = async (): Promise<Service[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(SERVICES_DATA), 500);
  });
};

export const fetchEbooks = async (): Promise<Ebook[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(EBOOKS_DATA), 500);
  });
};

export const fetchFeedbackEntries = async (): Promise<Feedback[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(readFeedbackFromStorage()), 350);
  });
};

export const fetchFaqs = async (): Promise<FaqItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(readFaqsFromStorage()), 300);
  });
};

export const fetchServiceOrders = async (): Promise<ServiceOrder[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(readServiceOrdersFromStorage()), 300);
  });
};

export const submitFeedbackEntry = async (payload: FeedbackSubmitPayload): Promise<Feedback> => {
  const feedbackList = readFeedbackFromStorage();
  const nextEntry = asFeedback({
    ...payload,
    status: 'pending',
    submittedAt: nowIso(),
  });
  const nextList = [nextEntry, ...feedbackList];
  writeFeedbackToStorage(nextList);
  return nextEntry;
};

export const updateFeedbackStatus = async (
  feedbackId: string,
  status: FeedbackStatus
): Promise<void> => {
  const feedbackList = readFeedbackFromStorage();
  const nextList = feedbackList.map((item) =>
    item.id === feedbackId
      ? {
          ...item,
          status,
        }
      : item
  );
  writeFeedbackToStorage(nextList);
};

export const deleteFeedbackEntry = async (feedbackId: string): Promise<void> => {
  const feedbackList = readFeedbackFromStorage();
  const nextList = feedbackList.filter((item) => item.id !== feedbackId);
  writeFeedbackToStorage(nextList);
};

export const publishFaq = async (payload: FaqPublishPayload): Promise<void> => {
  const faqList = readFaqsFromStorage();
  const nextList = [asFaq(payload), ...faqList];
  writeFaqsToStorage(nextList);
};

export const updateFaq = async (faqId: string, payload: FaqPublishPayload): Promise<void> => {
  const faqList = readFaqsFromStorage();
  const nextList = faqList.map((item) => (item.id === faqId ? { ...item, ...payload } : item));
  writeFaqsToStorage(nextList);
};

export const removeFaq = async (faqId: string): Promise<void> => {
  const faqList = readFaqsFromStorage();
  const nextList = faqList.filter((item) => item.id !== faqId);
  writeFaqsToStorage(nextList);
};

export const submitServiceOrder = async (payload: ServiceOrderPayload): Promise<ServiceOrder> => {
  const orders = readServiceOrdersFromStorage();
  const nextOrder = asServiceOrder({
    ...payload,
    status: 'pending',
    createdAt: nowIso(),
  });
  writeServiceOrdersToStorage([nextOrder, ...orders]);
  return nextOrder;
};

export const updateServiceOrderStatus = async (
  orderId: string,
  status: ServiceOrderStatus
): Promise<void> => {
  const orders = readServiceOrdersFromStorage();
  const nextOrders = orders.map((order) => (order.id === orderId ? { ...order, status } : order));
  writeServiceOrdersToStorage(nextOrders);
};

export const deleteServiceOrder = async (orderId: string): Promise<void> => {
  const orders = readServiceOrdersFromStorage();
  const nextOrders = orders.filter((order) => order.id !== orderId);
  writeServiceOrdersToStorage(nextOrders);
};

export const fetchServiceIntakeFormByOrderId = async (orderId: string): Promise<ServiceIntakeForm | null> => {
  const entries = readServiceIntakesFromStorage();
  return entries.find((entry) => entry.orderId === orderId) ?? null;
};

export const upsertServiceIntakeForm = async (payload: ServiceIntakeFormPayload): Promise<ServiceIntakeForm> => {
  const entries = readServiceIntakesFromStorage();
  const now = nowIso();
  const existing = entries.find((entry) => entry.orderId === payload.orderId);
  const nextEntry = asServiceIntake({
    ...payload,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  });
  const nextEntries = [nextEntry, ...entries.filter((entry) => entry.orderId !== payload.orderId)];
  writeServiceIntakesToStorage(nextEntries);
  return nextEntry;
};

export const fetchTestimonials = async (): Promise<Testimonial[]> => {
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

const REVIEW_DATA: EbookReview[] = [
  {
    id: 'r1',
    bookId: '101',
    bookTitle: 'Applied Child Nutrition',
    message: 'গাইডটি পড়ার পর বাচ্চার খাওয়ার অভ্যাস পুরোপুরি বদলে গেছে, পরামর্শগুলো একদম বাস্তবসম্মত।',
    rating: 5,
    userName: 'নাজমা হাসান',
    userEmail: 'nazma@example.com',
    submittedAt: '2025-01-15T11:30:00Z',
  },
  {
    id: 'r2',
    bookId: '103',
    bookTitle: 'Heart Disease Reversal Guide',
    message: 'ডাক্তারের প্রেসক্রিপশন ছাড়াই ব্লাড প্রেশার নিয়ন্ত্রণে রাখতে সাহায্য করেছে, প্রতিদিনই কাজ করে।',
    rating: 5,
    userName: 'তাহসিন রহমান',
    userEmail: 'tahsin@example.com',
    submittedAt: '2025-01-28T09:15:00Z',
  },
  {
    id: 'r3',
    bookId: '104',
    bookTitle: 'PCOS & Fertility Diet',
    message: 'ডায়েট চার্ট একদম স্পষ্ট, এবং ইমেইল সাপোর্ট এর মাধ্যমে দ্রুত উত্তর পেয়েছি।',
    rating: 4,
    userName: 'শারমিন আক্তার',
    userEmail: 'sharmin@example.com',
    submittedAt: '2025-02-02T22:45:00Z',
  },
];

const ORDER_DATA: EbookOrder[] = [
  {
    id: 'o1',
    ebookId: '101',
    ebookTitle: 'Applied Child Nutrition',
    price: 450,
    userName: 'মাহিয়া রহমান',
    userEmail: 'mahiya@example.com',
    paymentMethod: 'bKash',
    phone: '01700000001',
    status: 'paid',
    createdAt: '2025-01-12T14:32:00Z',
  },
  {
    id: 'o2',
    ebookId: '103',
    ebookTitle: 'Heart Disease Reversal Guide',
    price: 600,
    userName: 'রাশেদ মিয়া',
    userEmail: 'rashed@example.com',
    paymentMethod: 'Nagad',
    phone: '01800000002',
    status: 'pending',
    createdAt: '2025-01-20T18:12:00Z',
  },
];

export const fetchSampleReviews = async (): Promise<EbookReview[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(REVIEW_DATA), 400);
  });
};

export const fetchSampleOrders = async (): Promise<EbookOrder[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(readEbookOrdersFromStorage()), 400);
  });
};

export const submitEbookOrder = async (payload: Partial<EbookOrder>): Promise<EbookOrder> => {
  const orders = readEbookOrdersFromStorage();
  const nextOrder = asEbookOrder({
    ...payload,
    status: 'pending',
    createdAt: nowIso(),
  });
  writeEbookOrdersToStorage([nextOrder, ...orders]);
  return nextOrder;
};

export const updateEbookOrderStatus = async (
  orderId: string,
  status: 'pending' | 'approved' | 'rejected'
): Promise<void> => {
  const orders = readEbookOrdersFromStorage();
  const nextOrders = orders.map((order) => (order.id === orderId ? { ...order, status } : order));
  writeEbookOrdersToStorage(nextOrders);
};

export const deleteEbookOrder = async (orderId: string): Promise<void> => {
  const orders = readEbookOrdersFromStorage();
  const nextOrders = orders.filter((order) => order.id !== orderId);
  writeEbookOrdersToStorage(nextOrders);
};

export const fetchEbookOrderById = async (orderId: string): Promise<EbookOrder | null> => {
  const orders = readEbookOrdersFromStorage();
  return orders.find((order) => order.id === orderId) ?? null;
};
