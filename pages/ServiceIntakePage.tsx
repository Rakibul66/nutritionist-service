import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DropdownSelect from '../components/ui/DropdownSelect';
import { useAuth } from '../contexts/AuthContext';
import { ServiceIntakeFormData, ServiceOrder } from '../types';
import {
  fetchServiceIntakeFormByOrderId,
  fetchServiceOrderById,
  uploadMedicalReportFile,
  upsertServiceIntakeForm,
} from '../services/firebaseService';

type TabId = 'consent' | 'basic' | 'lifestyle' | 'medical' | 'final';
type HeightUnit = 'cm' | 'ftin';
type ExtendedQuestionType = 'textarea' | 'select' | 'multiselect';

type Option = { label: string; value: string };
type ExtendedQuestion = {
  key: string;
  label: string;
  type?: ExtendedQuestionType;
  options?: Option[];
};

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'consent', label: 'সম্মতি' },
  { id: 'basic', label: 'বেসিক' },
  { id: 'lifestyle', label: 'লাইফস্টাইল' },
  { id: 'medical', label: 'মেডিকেল' },
  { id: 'final', label: 'ফাইনাল' },
];

const INITIAL_FORM: ServiceIntakeFormData = {
  consentAccepted: false,
  fullName: '',
  age: '',
  gender: '',
  height: '',
  weight: '',
  waist: '',
  bloodGroup: '',
  dailyWorkType: '',
  exerciseFrequency: '',
  exerciseDetails: '',
  goal: '',
  healthProblems: '',
  currentMedications: '',
  recentBloodTest: '',
  fastingGlucoseHbA1c: '',
  familyHistory: '',
  foodPattern: '',
  mealFrequency: '',
  foodDiary3Days: '',
  waterIntake: '',
  junkFoodFrequency: '',
  carbsCraving: '',
  fastingGapHours: '',
  sleepHours: '',
  stressLevel: '',
  stressHandling: '',
  digestiveIssues: '',
  allergyInfo: '',
  intoleranceInfo: '',
  preferredFoods: '',
  avoidFoods: '',
  additionalNotes: '',
  extendedAnswers: {},
  medicalReportUrls: [],
};

const rangeOptions = (start: number, end: number, suffix = ''): Option[] => {
  const list: Option[] = [];
  for (let value = start; value <= end; value += 1) {
    list.push({ label: suffix ? `${value} ${suffix}` : String(value), value: String(value) });
  }
  return list;
};

const ageOptions = rangeOptions(10, 80, 'বছর');
const weightOptions = rangeOptions(30, 150, 'কেজি');
const waistOptions = rangeOptions(20, 60, 'ইঞ্চি');
const cmOptions = rangeOptions(120, 220, 'সেমি');
const feetOptions = rangeOptions(3, 7, 'ফুট');
const inchOptions = rangeOptions(0, 11, 'ইঞ্চি');
const sleepOptions = rangeOptions(4, 12, 'ঘণ্টা');
const stressOptions = rangeOptions(1, 10, '/10');

const genderOptions: Option[] = [
  { label: 'পুরুষ', value: 'পুরুষ' },
  { label: 'মহিলা', value: 'মহিলা' },
  { label: 'অন্যান্য', value: 'অন্যান্য' },
];

const bloodGroupOptions: Option[] = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'.trim(),
].map((value) => ({ label: value, value }));

const goalOptions: Option[] = [
  { label: 'ওজন কমানো', value: 'ওজন কমানো' },
  { label: 'ওজন বাড়ানো', value: 'ওজন বাড়ানো' },
  { label: 'ডায়াবেটিস কন্ট্রোল', value: 'ডায়াবেটিস কন্ট্রোল' },
  { label: 'PCOS ম্যানেজমেন্ট', value: 'PCOS ম্যানেজমেন্ট' },
  { label: 'এনার্জি/ইমিউনিটি উন্নতি', value: 'এনার্জি/ইমিউনিটি উন্নতি' },
  { label: 'অন্যান্য', value: 'অন্যান্য' },
];

const dailyWorkOptions: Option[] = [
  { label: 'ডেস্কে বসে কাজ', value: 'ডেস্কে বসে কাজ' },
  { label: 'মাঝারি সক্রিয়', value: 'মাঝারি সক্রিয়' },
  { label: 'শারীরিক পরিশ্রমের কাজ', value: 'শারীরিক পরিশ্রমের কাজ' },
];

const exerciseFrequencyOptions: Option[] = [
  { label: 'না', value: 'না' },
  { label: 'সপ্তাহে ১-২ দিন', value: 'সপ্তাহে ১-২ দিন' },
  { label: 'সপ্তাহে ৩-৫ দিন', value: 'সপ্তাহে ৩-৫ দিন' },
  { label: 'প্রতিদিন', value: 'প্রতিদিন' },
];

const foodPatternOptions: Option[] = [
  { label: 'নিরামিষ', value: 'নিরামিষ' },
  { label: 'আমিষ', value: 'আমিষ' },
  { label: 'ডিমসহ নিরামিষ', value: 'ডিমসহ নিরামিষ' },
  { label: 'ভেগান', value: 'ভেগান' },
];

const yesNoOptions: Option[] = [
  { label: 'হ্যাঁ', value: 'হ্যাঁ' },
  { label: 'না', value: 'না' },
];

const regularityOptions: Option[] = [
  { label: 'হ্যাঁ, নিয়মিত', value: 'হ্যাঁ, নিয়মিত' },
  { label: 'মাঝে মাঝে', value: 'মাঝে মাঝে' },
  { label: 'না', value: 'না' },
];

const yesNoMenopauseOptions: Option[] = [
  { label: 'YES', value: 'YES' },
  { label: 'NO', value: 'NO' },
  { label: 'মেনোপজ হয়েছে', value: 'মেনোপজ হয়েছে' },
];

const pregnancyBreastfeedingOptions: Option[] = [
  { label: 'গর্ভবতী', value: 'গর্ভবতী' },
  { label: 'স্তন্যপান করাচ্ছি', value: 'স্তন্যপান করাচ্ছি' },
  { label: 'কোনোটিই না', value: 'কোনোটিই না' },
];

const lowMidHighOptions: Option[] = [
  { label: 'খুব সন্তুষ্ট', value: 'খুব সন্তুষ্ট' },
  { label: 'মাঝারি সন্তুষ্ট', value: 'মাঝারি সন্তুষ্ট' },
  { label: 'কম সন্তুষ্ট', value: 'কম সন্তুষ্ট' },
];

const giFrequencyOptions: Option[] = [
  { label: 'খুব কমই', value: 'খুব কমই' },
  { label: 'মাঝে মাঝে (সপ্তাহে ১-২ বার)', value: 'মাঝে মাঝে (সপ্তাহে ১-২ বার)' },
  { label: 'প্রায় নিয়মিত', value: 'প্রায় নিয়মিত' },
];

const junkFoodOptions: Option[] = [
  { label: 'না', value: 'না' },
  { label: 'সপ্তাহে ১-২ বার', value: 'সপ্তাহে ১-২ বার' },
  { label: 'সপ্তাহে ৩ বারের বেশি', value: 'সপ্তাহে ৩ বারের বেশি' },
];

const mealFrequencyOptions = rangeOptions(2, 8, 'বার/দিন');
const waterOptions = rangeOptions(4, 16, 'গ্লাস');
const fastingGapOptions = rangeOptions(8, 18, 'ঘণ্টা');

const extendedQuestions: ExtendedQuestion[] = [
  { key: 'health_problem_history', label: 'আপনার কি নিম্নলিখিত কোনো স্বাস্থ্য সমস্যা আছে বা ছিল?' },
  { key: 'supplements_now', label: 'আপনি কি বর্তমানে কোনো ওষুধ বা সাপ্লিমেন্ট গ্রহণ করছেন? (হ্যাঁ হলে উল্লেখ করুন)' },
  { key: 'recent_blood_test', label: 'আপনার কি সম্প্রতি রক্ত পরীক্ষা করা হয়েছে (গত ৬ মাসের মধ্যে)?', type: 'select', options: yesNoOptions },
  { key: 'family_history_obesity_diabetes', label: 'আপনার পরিবারে কি ডায়াবেটিস বা স্থূলতার ইতিহাস আছে?', type: 'select', options: yesNoOptions },
  { key: 'meal_count_with_snacks', label: 'সাধারণত আপনি দিনে কতবার খাবার খান (স্ন্যাকস সহ)?', type: 'select', options: mealFrequencyOptions },
  { key: 'tv_phone_while_eating', label: 'আপনার কি খাবার খাওয়ার সময় টিভি দেখা বা ফোন ব্যবহারের অভ্যাস আছে?', type: 'select', options: yesNoOptions },
  { key: 'specific_food_triggers', label: 'কোনো নির্দিষ্ট খাবার/পানীয় কি হজম সমস্যা বাড়ায়? (যেমন: দুধ, আটা, তেল-মশলা)' },
  { key: 'daily_fruit_salad', label: 'আপনি কি দিনে অন্তত একবার ফল বা সালাদ খান?', type: 'select', options: yesNoOptions },
  { key: 'snack_pattern', label: 'খাবারের মধ্যে ব্যবধানে (স্ন্যাকস) সাধারণত কী খান?' },
  { key: 'regular_dairy_or_alternative', label: 'আপনি কি নিয়মিত দুগ্ধজাত খাবার বা বিকল্প খান?', type: 'select', options: yesNoOptions },
  { key: 'oil_type_daily', label: 'আপনি প্রতিদিন কী ধরনের তেল ব্যবহার করেন?' },
  { key: 'whole_vs_refined_grains', label: 'গোটা শস্য নাকি পরিশোধিত শস্য বেশি খান?' },
  { key: 'protein_adequacy', label: 'মাছ/মাংস/ডাল/ডিমের মতো প্রোটিন কতটা পর্যাপ্ত? (গ্রাম সহ)' },
  { key: 'sweetened_drinks', label: 'আপনি কি দিনে চিনিযুক্ত পানীয় বা সোডা পান করেন?', type: 'select', options: yesNoOptions },
  { key: 'tea_coffee_pattern', label: 'চা/কফি পান করেন? (দিনে কতবার, চিনি সহ/ছাড়া)' },
  { key: 'stress_food_craving_type', label: 'ক্লান্ত/হতাশ হলে কী ধরনের খাবার খেতে ইচ্ছে করে?' },
  { key: 'appetite_loss_due_stress', label: 'মানসিক চাপে খিদে না লাগা/খাবারের প্রতি বিতৃষ্ণা হয়?', type: 'select', options: regularityOptions },
  { key: 'mood_focus_impact_food', label: 'খাদ্যাভ্যাস আপনার মেজাজ বা মনোযোগে প্রভাব ফেলে?', type: 'select', options: [{ label: 'হ্যাঁ, খুব প্রভাব ফেলে', value: 'হ্যাঁ, খুব প্রভাব ফেলে' }, { label: 'সামান্য প্রভাব ফেলে', value: 'সামান্য প্রভাব ফেলে' }, { label: 'না', value: 'না' }] },
  { key: 'religious_food_avoidance', label: 'ধর্মীয়/সাংস্কৃতিক কারণে নির্দিষ্ট খাবার এড়িয়ে চলেন?' },
  { key: 'past_special_diet', label: 'আগে কোনো বিশেষ ডায়েট অনুসরণ করেছেন? (কিটো/IF/low-calorie)' },
  { key: 'past_diet_duration_reason_stop', label: 'পূর্বের ডায়েট কতদিন চলেছিল এবং কেন বন্ধ করেছিলেন?' },
  { key: 'weakness_after_meal', label: 'খাওয়ার পরে দুর্বলতা/ক্লান্তি/অলসতা হয়?', type: 'select', options: regularityOptions },
  { key: 'night_sleep_break', label: 'রাতে বারবার ঘুম ভাঙে?', type: 'select', options: regularityOptions },
  { key: 'sleepy_after_meal', label: 'খাওয়ার পরে খুব দ্রুত ঘুম পায়?', type: 'select', options: [{ label: 'হ্যাঁ, প্রায়শই', value: 'হ্যাঁ, প্রায়শই' }, { label: 'মাঝে মাঝে', value: 'মাঝে মাঝে' }, { label: 'না', value: 'না' }] },
  { key: 'painkiller_antacid', label: 'নিয়মিত Painkiller বা Antacid গ্রহণ করেন?', type: 'select', options: yesNoOptions },
  { key: 'antibiotic_steroid_6m', label: 'গত ৬ মাসে Antibiotic বা Steroid নিয়েছেন?', type: 'select', options: yesNoOptions },
  { key: 'hormonal_pill', label: 'হরমোনাল ওষুধ বা কন্ট্রাসেপটিভ পিল গ্রহণ করছেন?', type: 'select', options: yesNoOptions },
  { key: 'medication_digestive_change', label: 'কোনো ওষুধে হজম/মলত্যাগের অভ্যাস বদলেছে?', type: 'select', options: yesNoOptions },
  { key: 'diabetes_medicine', label: 'ডায়াবেটিসের জন্য ইনসুলিন/মেটফর্মিন ইত্যাদি নিচ্ছেন?', type: 'select', options: yesNoOptions },
  { key: 'cholesterol_heart_medicine', label: 'কোলেস্টেরল/হৃদরোগের ওষুধ খাচ্ছেন? (যেমন: স্ট্যাটিন)', type: 'select', options: yesNoOptions },
  { key: 'bloating_frequency', label: 'খাবারের পরে গ্যাস/ফোলাভাব/অস্বস্তি হয়?', type: 'select', options: giFrequencyOptions },
  { key: 'acidity_frequency', label: 'অম্বল বা বুকে জ্বালা হয়?', type: 'select', options: giFrequencyOptions },
  { key: 'carb_specific_gas', label: 'ডাল/বাঁধাকপি/শিম জাতীয় কার্বে গ্যাস বাড়ে?', type: 'select', options: yesNoOptions },
  { key: 'high_fiber_food', label: 'উচ্চ ফাইবারযুক্ত খাবার (ওটস/পুরো শস্য/বীজ) খান?', type: 'select', options: [{ label: 'হ্যাঁ, প্রতিদিন', value: 'হ্যাঁ, প্রতিদিন' }, { label: 'সপ্তাহে কয়েকবার', value: 'সপ্তাহে কয়েকবার' }, { label: 'না, খুব কমই', value: 'না, খুব কমই' }] },
  { key: 'fermented_foods', label: 'ফার্মেন্টেড খাবার (দই/পান্তা/কিমচি/আচার) খান?', type: 'select', options: yesNoOptions },
  { key: 'artificial_sweetener', label: 'কৃত্রিম মিষ্টি (সুক্রালোজ/অ্যাসপার্টেম) ব্যবহার করেন?', type: 'select', options: yesNoOptions },
  { key: 'irregular_meal_timing', label: 'খুব ভোরে বা খুব রাতে খাবার খাওয়ার অভ্যাস আছে?', type: 'select', options: yesNoOptions },
  { key: 'stress_eating_changes', label: 'মানসিক চাপে খাদ্যাভ্যাসে কী পরিবর্তন হয়? (একাধিক উত্তর হলে কমা দিয়ে লিখুন)', type: 'multiselect', options: [{ label: 'বেশি খাই', value: 'বেশি খাই' }, { label: 'কম খাই', value: 'কম খাই' }, { label: 'মিষ্টি খেতে ইচ্ছে করে', value: 'মিষ্টি খেতে ইচ্ছে করে' }, { label: 'ভাজা/নোনতা খেতে ইচ্ছে করে', value: 'ভাজা/নোনতা খেতে ইচ্ছে করে' }] },
  { key: 'negative_emotion_eating', label: 'হতাশা/একঘেয়েমি আপনাকে বেশি খেতে উৎসাহিত করে?', type: 'select', options: yesNoOptions },
  { key: 'self_esteem', label: 'নিজের সম্পর্কে কতটা ইতিবাচক/সন্তুষ্ট?', type: 'select', options: lowMidHighOptions },
  { key: 'sleep_7_9', label: 'প্রতি রাতে গড়ে ৭-৯ ঘণ্টা ঘুমান?', type: 'select', options: yesNoOptions },
  { key: 'sleep_quality_1_10', label: 'ঘুমের গুণগত মান (১-১০)', type: 'select', options: stressOptions },
  { key: 'eat_within_2h_sleep', label: 'ঘুমানোর ২ ঘণ্টার মধ্যে খাবার/পানীয় গ্রহণ করেন?', type: 'select', options: regularityOptions },
  { key: 'past_or_current_disease', label: 'বর্তমানে বা অতীতে কোনো রোগ/অসুস্থতা ছিল?' },
  { key: 'major_surgery', label: 'কোনো বড় Surgery হয়েছে? (কখন/কী কারণে)' },
  { key: 'allergy_food_drug_environment', label: 'খাবার/ওষুধ/পরিবেশগত উপাদানে অ্যালার্জি আছে?' },
  { key: 'rash_or_breathing_reaction', label: 'খাবার/পানীয়ে ফুসকুড়ি/চুলকানি/শ্বাসকষ্ট হয়?', type: 'select', options: [{ label: 'YES', value: 'YES' }, { label: 'NO', value: 'NO' }] },
  { key: 'gi_disease_history', label: 'GI সমস্যা (IBS/IBD/গ্যাস্ট্রাইটিস) আছে?', type: 'select', options: [{ label: 'হ্যাঁ', value: 'হ্যাঁ' }, { label: 'NO', value: 'NO' }, { label: 'মাঝে মাঝে', value: 'মাঝে মাঝে' }] },
  { key: 'anemia_or_deficiency', label: 'রক্তাল্পতা/ভিটামিন D বা B12 ঘাটতি আছে?' },
  { key: 'has_high_bp', label: 'আপনার কি উচ্চ রক্তচাপ (High Blood Pressure) আছে?', type: 'select', options: [{ label: 'YES', value: 'YES' }, { label: 'NO', value: 'NO' }] },
  { key: 'thyroid_problem', label: 'আপনার কি থাইরয়েডের সমস্যা আছে?', type: 'select', options: [{ label: 'না', value: 'না' }, { label: 'হ্যাঁ, হাইপোথাইরয়েডিজম', value: 'হ্যাঁ, হাইপোথাইরয়েডিজম' }, { label: 'হ্যাঁ, হাইপারথাইরয়েডিজম', value: 'হ্যাঁ, হাইপারথাইরয়েডিজম' }, { label: 'জানি না', value: 'জানি না' }] },
  { key: 'kidney_liver_chronic', label: 'আপনার কি কিডনি বা লিভারের কোনো দীর্ঘমেয়াদি রোগ আছে?' },
  { key: 'heart_disease_details', label: 'আপনার কি হৃদরোগ (Heart Disease) বা হার্ট সংক্রান্ত কোনো সমস্যা আছে? (যেমন: ব্লক, অনিয়মিত হৃদস্পন্দন)' },
  { key: 'asthma_respiratory_issue', label: 'আপনার কি অ্যাজমা (Asthma) বা শ্বাসযন্ত্রের কোনো দীর্ঘমেয়াদি সমস্যা আছে?' },
  { key: 'ulcer_or_gerd', label: 'আপনার কি পেটে আলসার (Ulcer) বা গুরুতর অ্যাসিড রিফ্লাক্স (GERD) এর সমস্যা আছে?' },
  { key: 'other_chronic_conditions', label: 'উপরোক্ত রোগগুলি ছাড়াও অন্য কোনো দীর্ঘমেয়াদি স্বাস্থ্য সমস্যা আছে? (যেমন: PCOS, অ্যানিমিয়া, সোরিয়াসিস)' },
  { key: 'female_menstrual_regular', label: 'মহিলা-সম্পর্কিত: আপনার মাসিক চক্র কি নিয়মিত?', type: 'select', options: yesNoMenopauseOptions },
  { key: 'female_pregnancy_or_lactating', label: 'মহিলা-সম্পর্কিত: আপনি কি বর্তমানে গর্ভবতী বা শিশুকে স্তন্যপান করাচ্ছেন?', type: 'select', options: pregnancyBreastfeedingOptions },
  { key: 'female_pcos_or_thyroid', label: 'মহিলা-সম্পর্কিত: PCOS/থাইরয়েড/হরমোনাল সমস্যা আছে?' },
];

const RADIO_CARD_BASE = 'rounded-xl border px-4 py-3 text-left text-sm font-medium transition';

const parseSavedHeight = (height: string) => {
  const ftMatch = height.match(/(\d+)\s*ft\s*(\d+)\s*in/i);
  if (ftMatch) {
    return { unit: 'ftin' as HeightUnit, ft: ftMatch[1], inch: ftMatch[2], cm: '' };
  }
  const cmMatch = height.match(/(\d+)\s*cm/i);
  if (cmMatch) {
    return { unit: 'cm' as HeightUnit, ft: '5', inch: '0', cm: cmMatch[1] };
  }
  return { unit: 'cm' as HeightUnit, ft: '5', inch: '0', cm: '' };
};

const ServiceIntakePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<ServiceOrder | null>(null);
  const [formData, setFormData] = useState<ServiceIntakeFormData>(INITIAL_FORM);
  const [activeTab, setActiveTab] = useState<TabId>('consent');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [uploadingReport, setUploadingReport] = useState(false);

  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('0');

  useEffect(() => {
    const load = async () => {
      if (!orderId || !user) return;
      setLoading(true);
      try {
        const [orderInfo, savedForm] = await Promise.all([
          fetchServiceOrderById(orderId),
          fetchServiceIntakeFormByOrderId(orderId),
        ]);
        setOrder(orderInfo);
        if (savedForm?.data) {
          setFormData(savedForm.data);
          const parsed = parseSavedHeight(savedForm.data.height || '');
          setHeightUnit(parsed.unit);
          setHeightCm(parsed.cm);
          setHeightFt(parsed.ft);
          setHeightIn(parsed.inch);
          if (savedForm.submitted) {
            setStatusMessage('ফর্ম ইতোমধ্যে সাবমিট করা আছে। চাইলে আপডেট করে আবার সাবমিট করতে পারবেন।');
          }
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId, user]);

  if (!user) {
    return <Navigate to={`/login?next=/orders/intake/${orderId ?? ''}`} replace />;
  }

  const canAccessOrder = Boolean(
    order &&
      (order.userId === user.uid || order.userEmail.toLowerCase() === (user.email ?? '').toLowerCase())
  );
  const isOrderApproved = order?.status === 'approved';

  const updateField = (key: keyof ServiceIntakeFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updateExtended = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      extendedAnswers: {
        ...prev.extendedAnswers,
        [key]: value,
      },
    }));
  };

  const toggleExtendedMulti = (key: string, value: string) => {
    const current = formData.extendedAnswers[key] || '';
    const values = current
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
    const nextValues = values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];
    updateExtended(key, nextValues.join(', '));
  };

  const syncHeightToForm = (unit: HeightUnit, cm: string, ft: string, inch: string) => {
    if (unit === 'cm') {
      updateField('height', cm ? `${cm} cm` : '');
      return;
    }
    updateField('height', `${ft || '0'} ft ${inch || '0'} in`);
  };

  const setHeightUnitAndSync = (unit: HeightUnit) => {
    setHeightUnit(unit);
    syncHeightToForm(unit, heightCm, heightFt, heightIn);
  };

  const setHeightCmAndSync = (value: string) => {
    setHeightCm(value);
    syncHeightToForm('cm', value, heightFt, heightIn);
  };

  const setHeightFtAndSync = (value: string) => {
    setHeightFt(value);
    syncHeightToForm('ftin', heightCm, value, heightIn);
  };

  const setHeightInAndSync = (value: string) => {
    setHeightIn(value);
    syncHeightToForm('ftin', heightCm, heightFt, value);
  };

  const saveForm = async (submit: boolean) => {
    if (!order || !orderId) return;
    if (submit && (!formData.consentAccepted || !formData.fullName.trim() || !formData.goal.trim())) {
      setStatusMessage('সাবমিটের জন্য সম্মতি, নাম এবং মূল লক্ষ্য পূরণ করুন।');
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);
    try {
      await upsertServiceIntakeForm({
        orderId,
        userId: user.uid,
        userEmail: user.email ?? 'guest@local',
        serviceId: order.serviceId,
        serviceTitle: order.serviceTitle,
        data: formData,
        submitted: submit,
      });
      setStatusMessage(submit ? 'ফর্ম সফলভাবে সাবমিট হয়েছে।' : 'ড্রাফট সেভ হয়েছে।');
    } catch (error) {
      console.error(error);
      setStatusMessage('সেভ করা যায়নি, আবার চেষ্টা করুন।');
    } finally {
      setIsSaving(false);
    }
  };

  const tabIndex = TABS.findIndex((tab) => tab.id === activeTab);
  const goPrev = () => setActiveTab(TABS[Math.max(0, tabIndex - 1)].id);
  const goNext = () => setActiveTab(TABS[Math.min(TABS.length - 1, tabIndex + 1)].id);
  const extendedAnsweredCount = extendedQuestions.filter((question) => Boolean(formData.extendedAnswers[question.key])).length;
  const coreFields = [
    formData.consentAccepted ? '1' : '',
    formData.fullName,
    formData.age,
    formData.gender,
    formData.height,
    formData.weight,
    formData.waist,
    formData.bloodGroup,
    formData.goal,
    formData.dailyWorkType,
    formData.exerciseFrequency,
    formData.foodPattern,
    formData.mealFrequency,
    formData.waterIntake,
    formData.junkFoodFrequency,
    formData.healthProblems,
    formData.currentMedications,
    formData.stressLevel,
  ];
  const coreAnswered = coreFields.filter((value) => Boolean(String(value).trim())).length;
  const completionPercent = Math.round(
    ((coreAnswered + extendedAnsweredCount) / (coreFields.length + extendedQuestions.length)) * 100
  );

  const handleMedicalReportUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const incoming = Array.from(files);
    const acceptedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    if (formData.medicalReportUrls.length + incoming.length > 5) {
      setStatusMessage('সর্বোচ্চ ৫টি রিপোর্ট আপলোড করতে পারবেন।');
      return;
    }

    for (const file of incoming) {
      if (!acceptedTypes.includes(file.type)) {
        setStatusMessage(`অসমর্থিত ফাইল টাইপ: ${file.name}`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setStatusMessage(`ফাইল 10MB এর বেশি: ${file.name}`);
        return;
      }
    }

    setUploadingReport(true);
    setStatusMessage(null);
    try {
      const uploaded = await Promise.all(incoming.map((file) => uploadMedicalReportFile(file)));
      setFormData((prev) => ({
        ...prev,
        medicalReportUrls: [...prev.medicalReportUrls, ...uploaded],
      }));
      setStatusMessage('রিপোর্ট আপলোড সম্পন্ন হয়েছে।');
    } catch (error) {
      console.error(error);
      setStatusMessage('রিপোর্ট আপলোড করা যায়নি।');
    } finally {
      setUploadingReport(false);
    }
  };

  const removeMedicalReport = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      medicalReportUrls: prev.medicalReportUrls.filter((entry) => entry !== url),
    }));
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setAnimatedProgress(completionPercent), 80);
    return () => window.clearTimeout(timer);
  }, [completionPercent]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-5">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">ব্যক্তিগত ডায়েট চার্ট তথ্য ফর্ম</h1>
          <p className="text-sm text-slate-600">Order ID: {orderId}</p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-800">Profile Completeness</p>
            <p className="text-sm font-bold text-emerald-700">{completionPercent}%</p>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700 ease-out"
              style={{ width: `${animatedProgress}%` }}
            />
          </div>
        </section>

        {loading ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">লোড হচ্ছে...</p>
          </section>
        ) : !order ? (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
            <p className="text-sm text-rose-700">অর্ডার পাওয়া যায়নি।</p>
          </section>
        ) : !canAccessOrder ? (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
            <p className="text-sm text-rose-700">এই অর্ডারের ফর্ম অ্যাক্সেস আপনার জন্য অনুমোদিত নয়।</p>
          </section>
        ) : !isOrderApproved ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 space-y-3">
            <p className="text-sm text-amber-700">
              এই ফর্ম শুধুমাত্র approved সার্ভিস অর্ডারের জন্য খোলা হবে। আপনার বর্তমান স্ট্যাটাস: {order.status}
            </p>
            <button
              onClick={() => navigate('/orders')}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              অর্ডার পেজে ফিরে যান
            </button>
          </section>
        ) : (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 space-y-5">
            <div className="flex flex-wrap gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                    activeTab === tab.id
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'consent' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-700 leading-6">
                  আপনার ব্যক্তিগত ও স্বাস্থ্য তথ্য শুধুমাত্র আপনার জন্য ব্যক্তিগত ডায়েট চার্ট তৈরি, ফলো-আপ এবং
                  পুষ্টি পরিকল্পনা উন্নত করার জন্য ব্যবহার হবে। আপনার তথ্য গোপন রাখা হবে এবং আপনার অনুমতি ছাড়া
                  তৃতীয় পক্ষের সাথে শেয়ার করা হবে না।
                </p>
                <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                  <input
                    type="checkbox"
                    checked={formData.consentAccepted}
                    onChange={(event) => updateField('consentAccepted', event.target.checked)}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm text-slate-700">
                    আমি নৈতিক সম্মতিপত্রটি পড়েছি, বুঝেছি এবং ফর্ম পূরণের জন্য সম্মতি দিচ্ছি।
                  </span>
                </label>
              </div>
            )}

            {activeTab === 'basic' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">পূর্ণ নাম</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                    placeholder="আপনার পূর্ণ নাম"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">বয়স</label>
                  <DropdownSelect value={formData.age} options={ageOptions} onChange={(v) => updateField('age', v)} placeholder="বয়স বাছাই করুন" />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">লিঙ্গ</label>
                  <DropdownSelect value={formData.gender} options={genderOptions} onChange={(v) => updateField('gender', v)} placeholder="লিঙ্গ বাছাই করুন" />
                </div>

                <div className="sm:col-span-2 space-y-3 rounded-xl border border-slate-200 p-4">
                  <label className="block text-sm font-medium text-slate-700">উচ্চতা</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setHeightUnitAndSync('cm')}
                      className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                        heightUnit === 'cm' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      সেমি
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeightUnitAndSync('ftin')}
                      className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                        heightUnit === 'ftin' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      ফুট/ইঞ্চি
                    </button>
                  </div>

                  {heightUnit === 'cm' ? (
                    <DropdownSelect value={heightCm} options={cmOptions} onChange={setHeightCmAndSync} placeholder="উচ্চতা (সেমি)" />
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <DropdownSelect value={heightFt} options={feetOptions} onChange={setHeightFtAndSync} placeholder="ফুট" />
                      <DropdownSelect value={heightIn} options={inchOptions} onChange={setHeightInAndSync} placeholder="ইঞ্চি" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">ওজন</label>
                  <DropdownSelect value={formData.weight} options={weightOptions} onChange={(v) => updateField('weight', v)} placeholder="ওজন বাছাই করুন" />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">কোমরের মাপ</label>
                  <DropdownSelect value={formData.waist} options={waistOptions} onChange={(v) => updateField('waist', v)} placeholder="কোমরের মাপ" />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Blood Group</label>
                  <DropdownSelect value={formData.bloodGroup} options={bloodGroupOptions} onChange={(v) => updateField('bloodGroup', v)} placeholder="Blood Group" />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">মূল লক্ষ্য</label>
                  <DropdownSelect value={formData.goal} options={goalOptions} onChange={(v) => updateField('goal', v)} placeholder="লক্ষ্য বাছাই করুন" />
                </div>
              </div>
            )}

            {activeTab === 'lifestyle' && (
              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-800">আপনার প্রধান দৈনিক কাজের প্রকৃতি কী?</p>
                  <div className="grid gap-2">
                    {dailyWorkOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField('dailyWorkType', option.value)}
                        className={`${RADIO_CARD_BASE} ${
                          formData.dailyWorkType === option.value
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-800">আপনি কি নিয়মিত শরীরচর্চা করেন?</p>
                  <div className="grid gap-2">
                    {exerciseFrequencyOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField('exerciseFrequency', option.value)}
                        className={`${RADIO_CARD_BASE} ${
                          formData.exerciseFrequency === option.value
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">খাদ্যাভ্যাস</label>
                    <DropdownSelect value={formData.foodPattern} options={foodPatternOptions} onChange={(v) => updateField('foodPattern', v)} placeholder="খাদ্যাভ্যাস বাছাই করুন" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">দিনে কয়বার খাবার খান</label>
                    <DropdownSelect value={formData.mealFrequency} options={mealFrequencyOptions} onChange={(v) => updateField('mealFrequency', v)} placeholder="সংখ্যা বাছাই করুন" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">পানি পান</label>
                    <DropdownSelect value={formData.waterIntake} options={waterOptions} onChange={(v) => updateField('waterIntake', v)} placeholder="গ্লাস/দিন" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">জাঙ্ক ফুড</label>
                    <DropdownSelect value={formData.junkFoodFrequency} options={junkFoodOptions} onChange={(v) => updateField('junkFoodFrequency', v)} placeholder="ফ্রিকোয়েন্সি" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">ডিনার-ব্রেকফাস্ট গ্যাপ</label>
                    <DropdownSelect value={formData.fastingGapHours} options={fastingGapOptions} onChange={(v) => updateField('fastingGapHours', v)} placeholder="ঘণ্টা" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">ঘুম</label>
                    <DropdownSelect value={formData.sleepHours} options={sleepOptions} onChange={(v) => updateField('sleepHours', v)} placeholder="ঘণ্টা/রাত" />
                  </div>
                </div>

                <textarea className="min-h-[90px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="শরীরচর্চার ধরন ও সময়কাল" value={formData.exerciseDetails} onChange={(e) => updateField('exerciseDetails', e.target.value)} />
                <textarea className="min-h-[120px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="গত ৩ দিনের ফুড ডায়েরি" value={formData.foodDiary3Days} onChange={(e) => updateField('foodDiary3Days', e.target.value)} />
              </div>
            )}

            {activeTab === 'medical' && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">রক্ত পরীক্ষা (৬ মাসে)</label>
                    <DropdownSelect value={formData.recentBloodTest} options={yesNoOptions} onChange={(v) => updateField('recentBloodTest', v)} placeholder="হ্যাঁ/না" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">কার্ব craving</label>
                    <DropdownSelect value={formData.carbsCraving} options={yesNoOptions} onChange={(v) => updateField('carbsCraving', v)} placeholder="হ্যাঁ/না" />
                  </div>
                </div>

                <textarea className="min-h-[90px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="বর্তমান/পূর্বের স্বাস্থ্য সমস্যা" value={formData.healthProblems} onChange={(e) => updateField('healthProblems', e.target.value)} />
                <textarea className="min-h-[90px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="বর্তমান ওষুধ/সাপ্লিমেন্ট" value={formData.currentMedications} onChange={(e) => updateField('currentMedications', e.target.value)} />
                <textarea className="min-h-[80px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Fasting glucose / HbA1c" value={formData.fastingGlucoseHbA1c} onChange={(e) => updateField('fastingGlucoseHbA1c', e.target.value)} />
                <textarea className="min-h-[70px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="পরিবারে রোগ ইতিহাস" value={formData.familyHistory} onChange={(e) => updateField('familyHistory', e.target.value)} />
                <textarea className="min-h-[70px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="হজম সমস্যা (গ্যাস/ফোলাভাব/অম্বল)" value={formData.digestiveIssues} onChange={(e) => updateField('digestiveIssues', e.target.value)} />
                <textarea className="min-h-[70px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="অ্যালার্জি তথ্য" value={formData.allergyInfo} onChange={(e) => updateField('allergyInfo', e.target.value)} />
                <textarea className="min-h-[70px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="খাদ্য অসহিষ্ণুতা" value={formData.intoleranceInfo} onChange={(e) => updateField('intoleranceInfo', e.target.value)} />

                <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800">যদি কোনো Medical Report থাকে, upload করুন</p>
                    <span className="text-xs text-slate-500">{formData.medicalReportUrls.length}/5</span>
                  </div>
                  <p className="text-xs text-slate-500">PDF বা Image (PNG/JPG/WEBP), প্রতি ফাইল সর্বোচ্চ 10MB</p>
                  <input
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                    multiple
                    disabled={uploadingReport || formData.medicalReportUrls.length >= 5}
                    onChange={(event) => handleMedicalReportUpload(event.target.files)}
                    className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  {uploadingReport && <p className="text-xs text-emerald-700">রিপোর্ট আপলোড হচ্ছে...</p>}
                  {formData.medicalReportUrls.length > 0 ? (
                    <div className="grid gap-2">
                      {formData.medicalReportUrls.map((url, index) => (
                        <div key={`${url}-${index}`} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-xs">
                          <a href={url} target="_blank" rel="noreferrer" className="truncate text-blue-600 hover:underline">
                            Report #{index + 1}
                          </a>
                          <button
                            type="button"
                            onClick={() => removeMedicalReport(url)}
                            className="rounded-md border border-rose-200 px-2 py-1 text-rose-700 hover:bg-rose-50"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {activeTab === 'final' && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">স্ট্রেস লেভেল</label>
                    <DropdownSelect value={formData.stressLevel} options={stressOptions} onChange={(v) => updateField('stressLevel', v)} placeholder="১-১০" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">পছন্দের খাবার</label>
                    <input className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" value={formData.preferredFoods} onChange={(e) => updateField('preferredFoods', e.target.value)} placeholder="যা খেতে স্বাচ্ছন্দ্য" />
                  </div>
                </div>

                <input className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" value={formData.avoidFoods} onChange={(e) => updateField('avoidFoods', e.target.value)} placeholder="যে খাবার এড়িয়ে চলতে চান" />
                <textarea className="min-h-[90px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="স্ট্রেস সামলানোর পদ্ধতি" value={formData.stressHandling} onChange={(e) => updateField('stressHandling', e.target.value)} />
                <textarea className="min-h-[140px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="অতিরিক্ত তথ্য (অন্য প্রশ্নের উত্তরগুলো এখানে লিখুন)" value={formData.additionalNotes} onChange={(e) => updateField('additionalNotes', e.target.value)} />

                <div className="rounded-2xl border border-slate-200 p-4 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">বিস্তারিত প্রশ্নমালা (চেকলিস্ট)</h3>
                    <span className="text-xs text-slate-500">{extendedAnsweredCount}/{extendedQuestions.length} উত্তর সম্পন্ন</span>
                  </div>
                  <div className="grid gap-4">
                    {extendedQuestions.map((question) => {
                      const value = formData.extendedAnswers[question.key] || '';
                      if (question.type === 'select' && question.options) {
                        return (
                          <div key={question.key}>
                            <label className="mb-1 block text-sm font-medium text-slate-700">{question.label}</label>
                            <DropdownSelect
                              value={value}
                              options={question.options}
                              onChange={(nextValue) => updateExtended(question.key, nextValue)}
                              placeholder="অপশন বাছাই করুন"
                            />
                          </div>
                        );
                      }
                      if (question.type === 'multiselect' && question.options) {
                        const picked = value.split(',').map((entry) => entry.trim()).filter(Boolean);
                        return (
                          <div key={question.key} className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">{question.label}</label>
                            <div className="grid gap-2 sm:grid-cols-2">
                              {question.options.map((option) => {
                                const active = picked.includes(option.value);
                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => toggleExtendedMulti(question.key, option.value)}
                                    className={`${RADIO_CARD_BASE} ${
                                      active
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                                        : 'border-slate-200 bg-white text-slate-700'
                                    }`}
                                  >
                                    {option.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={question.key}>
                          <label className="mb-1 block text-sm font-medium text-slate-700">{question.label}</label>
                          <textarea
                            className="min-h-[80px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            value={value}
                            onChange={(event) => updateExtended(question.key, event.target.value)}
                            placeholder="আপনার উত্তর লিখুন"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex gap-2">
                <button
                  onClick={goPrev}
                  disabled={tabIndex === 0}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
                >
                  আগের ধাপ
                </button>
                <button
                  onClick={goNext}
                  disabled={tabIndex === TABS.length - 1}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
                >
                  পরের ধাপ
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => saveForm(false)}
                  disabled={isSaving}
                  className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 disabled:opacity-60"
                >
                  ড্রাফট সেভ
                </button>
                <button
                  onClick={() => saveForm(true)}
                  disabled={isSaving}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  সাবমিট
                </button>
              </div>
            </div>

            {statusMessage && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {statusMessage}
              </div>
            )}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ServiceIntakePage;
