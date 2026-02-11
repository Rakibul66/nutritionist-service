import { Service, Ebook, BookCategory, Testimonial, EbookReview, EbookOrder } from '../types';

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
  },
  {
    id: '2',
    title: 'PCOS ম্যানেজমেন্ট',
    description: 'ওজন কমানো এবং পিরিয়ড সাইকেল রেগুলার করার জন্য সায়েন্টিফিক এপ্রোচ।',
    iconName: 'Apple',
    price: '৳২,৫০০',
    features: ['ইনসুলিন রেজিস্ট্যান্স ফোকাস', 'সাপ্লিমেন্ট গাইডলাইন', 'স্ট্রেস ম্যানেজমেন্ট'],
  },
  {
    id: '3',
    title: 'চাইল্ড নিউট্রিশন কনসালটেন্সি',
    description: 'বাচ্চাদের গ্রোথ, ইমিউনিটি এবং খাদ্যাভ্যাস গঠনের কমপ্লিট গাইডলাইন।',
    iconName: 'Baby',
    price: '৳২,০০০',
    features: ['পিকি ইটার সল্যুশন', 'ব্রেইন ডেভেলপমেন্ট ফুড', 'টক্সিন ফ্রি লাইফস্টাইল'],
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

const TESTIMONIALS_DATA: Testimonial[] = [
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

export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(TESTIMONIALS_DATA), 500);
  });
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
    setTimeout(() => resolve(ORDER_DATA), 400);
  });
};
