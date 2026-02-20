import React, { useEffect, useMemo, useState } from 'react';

type Gender = 'female' | 'male';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const HealthCalculators: React.FC = () => {
  const [age, setAge] = useState<number>(30);
  const [heightCm, setHeightCm] = useState<number>(165);
  const [weightKg, setWeightKg] = useState<number>(65);
  const [gender, setGender] = useState<Gender>('female');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isResultAnimating, setIsResultAnimating] = useState(false);

  const result = useMemo(() => {
    if (age <= 0 || heightCm <= 0 || weightKg <= 0) {
      return {
        bmi: 0,
        bmiCategory: 'সঠিক তথ্য দিন',
        calories: 0,
        waterLiters: 0,
        waterGlasses: 0,
      };
    }

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    let bmiCategory = 'স্থূলতা';
    if (bmi < 18.5) bmiCategory = 'স্বল্প ওজন';
    else if (bmi < 25) bmiCategory = 'স্বাভাবিক';
    else if (bmi < 30) bmiCategory = 'অতিরিক্ত ওজন';

    const bmr =
      gender === 'male'
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

    const calories = bmr * activityMultipliers[activity];

    const waterLiters = (weightKg * 35) / 1000;
    const waterGlasses = waterLiters / 0.25;

    return {
      bmi,
      bmiCategory,
      calories,
      waterLiters,
      waterGlasses,
    };
  }, [activity, age, gender, heightCm, weightKg]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsLoaded(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    setIsResultAnimating(true);
    const timer = setTimeout(() => setIsResultAnimating(false), 260);
    return () => clearTimeout(timer);
  }, [result.bmi, result.calories, result.waterLiters]);

  return (
    <section id="health-calculators" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase">রিয়েল-টাইম টুলস</span>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            BMI, ক্যালোরি চাহিদা এবং পানি গ্রহণ ক্যালকুলেটর
          </h2>
          <p className="mt-3 text-base text-slate-500">
            নিচের যেকোনো ফিল্ড পরিবর্তন করলে তাৎক্ষণিকভাবে আপনার আনুমানিক ফলাফল দেখাবে।
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div
            className={`rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8 transition-all duration-700 delay-100 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h3 className="text-xl font-semibold text-slate-900 mb-6">আপনার তথ্য</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                বয়স (বছর)
                <input
                  type="number"
                  min={1}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                উচ্চতা (সেমি)
                <input
                  type="number"
                  min={1}
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                ওজন (কেজি)
                <input
                  type="number"
                  min={1}
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                লিঙ্গ
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="female">নারী</option>
                  <option value="male">পুরুষ</option>
                </select>
              </label>

              <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                কাজের ধরন
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="sedentary">কম সক্রিয় (ব্যায়াম নেই বা খুব কম)</option>
                  <option value="light">হালকা সক্রিয় (সপ্তাহে ১-৩ দিন)</option>
                  <option value="moderate">মাঝারি সক্রিয় (সপ্তাহে ৩-৫ দিন)</option>
                  <option value="active">সক্রিয় (সপ্তাহে ৬-৭ দিন)</option>
                  <option value="very_active">অত্যন্ত সক্রিয় (কঠিন শারীরিক কাজ/অ্যাথলেট)</option>
                </select>
              </label>
            </div>
          </div>

          <div
            className={`rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-700 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h3 className="text-xl font-semibold text-slate-900 mb-6">তাৎক্ষণিক ফলাফল</h3>

            <div className="space-y-4">
              <div
                className={`rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 transition-all duration-300 ${
                  isResultAnimating ? 'scale-[1.015] shadow-sm' : 'scale-100'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">BMI</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{result.bmi.toFixed(1)}</p>
                <p className="text-sm text-slate-600">{result.bmiCategory}</p>
              </div>

              <div
                className={`rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 transition-all duration-300 ${
                  isResultAnimating ? 'scale-[1.015] shadow-sm' : 'scale-100'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700">মোট ক্যালোরি চাহিদা</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{Math.round(result.calories)} কিলোক্যালোরি/দিন</p>
              </div>

              <div
                className={`rounded-2xl border border-cyan-100 bg-cyan-50 px-5 py-4 transition-all duration-300 ${
                  isResultAnimating ? 'scale-[1.015] shadow-sm' : 'scale-100'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-700">পানি গ্রহণ</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{result.waterLiters.toFixed(2)} লিটার/দিন</p>
                <p className="text-sm text-slate-600">প্রায় {Math.round(result.waterGlasses)} গ্লাস (প্রতি গ্লাস ২৫০ মি.লি.)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthCalculators;
