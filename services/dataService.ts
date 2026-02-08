import { Service, Ebook, BookCategory, Testimonial } from '../types';

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