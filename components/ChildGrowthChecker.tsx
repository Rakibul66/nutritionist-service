import React, { useMemo, useState } from 'react';
import { Baby, Ruler, Scale, Activity } from 'lucide-react';

type Gender = 'male' | 'female';

interface MetricRange {
  p3: number;
  p50: number;
  p97: number;
}

interface GrowthPoint {
  ageMonths: number;
  male: {
    weight: MetricRange;
    height: MetricRange;
  };
  female: {
    weight: MetricRange;
    height: MetricRange;
  };
}

const growthReference: GrowthPoint[] = [
  { ageMonths: 0, male: { weight: { p3: 2.5, p50: 3.3, p97: 4.4 }, height: { p3: 46.0, p50: 49.9, p97: 53.7 } }, female: { weight: { p3: 2.4, p50: 3.2, p97: 4.2 }, height: { p3: 45.4, p50: 49.1, p97: 53.0 } } },
  { ageMonths: 6, male: { weight: { p3: 6.4, p50: 7.9, p97: 9.8 }, height: { p3: 63.3, p50: 67.6, p97: 71.9 } }, female: { weight: { p3: 5.8, p50: 7.3, p97: 9.2 }, height: { p3: 61.2, p50: 65.7, p97: 70.3 } } },
  { ageMonths: 12, male: { weight: { p3: 7.8, p50: 9.6, p97: 11.8 }, height: { p3: 70.2, p50: 76.1, p97: 81.7 } }, female: { weight: { p3: 7.1, p50: 8.9, p97: 11.3 }, height: { p3: 68.9, p50: 74.0, p97: 79.2 } } },
  { ageMonths: 24, male: { weight: { p3: 9.7, p50: 12.2, p97: 15.3 }, height: { p3: 81.0, p50: 87.1, p97: 93.2 } }, female: { weight: { p3: 9.0, p50: 11.5, p97: 14.8 }, height: { p3: 79.5, p50: 85.7, p97: 91.8 } } },
  { ageMonths: 36, male: { weight: { p3: 11.3, p50: 14.3, p97: 18.3 }, height: { p3: 89.0, p50: 95.2, p97: 101.5 } }, female: { weight: { p3: 10.8, p50: 13.9, p97: 18.1 }, height: { p3: 87.4, p50: 94.1, p97: 100.8 } } },
  { ageMonths: 48, male: { weight: { p3: 12.7, p50: 16.3, p97: 21.2 }, height: { p3: 95.0, p50: 102.7, p97: 109.7 } }, female: { weight: { p3: 12.3, p50: 16.0, p97: 21.1 }, height: { p3: 93.8, p50: 101.6, p97: 109.4 } } },
  { ageMonths: 60, male: { weight: { p3: 14.1, p50: 18.3, p97: 24.2 }, height: { p3: 100.1, p50: 109.2, p97: 117.4 } }, female: { weight: { p3: 13.7, p50: 18.2, p97: 24.3 }, height: { p3: 99.1, p50: 108.4, p97: 117.7 } } },
];

const interpolateMetric = (ageMonths: number, gender: Gender, metric: 'weight' | 'height'): MetricRange => {
  if (ageMonths <= growthReference[0].ageMonths) {
    return growthReference[0][gender][metric];
  }

  if (ageMonths >= growthReference[growthReference.length - 1].ageMonths) {
    return growthReference[growthReference.length - 1][gender][metric];
  }

  const upperIndex = growthReference.findIndex((point) => point.ageMonths >= ageMonths);
  const lower = growthReference[upperIndex - 1];
  const upper = growthReference[upperIndex];
  const ratio = (ageMonths - lower.ageMonths) / (upper.ageMonths - lower.ageMonths);

  const lowerMetric = lower[gender][metric];
  const upperMetric = upper[gender][metric];

  return {
    p3: lowerMetric.p3 + (upperMetric.p3 - lowerMetric.p3) * ratio,
    p50: lowerMetric.p50 + (upperMetric.p50 - lowerMetric.p50) * ratio,
    p97: lowerMetric.p97 + (upperMetric.p97 - lowerMetric.p97) * ratio,
  };
};

const estimatePercentile = (value: number, range: MetricRange): number => {
  if (value <= range.p3) {
    return Math.max(1, (value / range.p3) * 3);
  }
  if (value <= range.p50) {
    return 3 + ((value - range.p3) / (range.p50 - range.p3)) * 47;
  }
  if (value <= range.p97) {
    return 50 + ((value - range.p50) / (range.p97 - range.p50)) * 47;
  }
  return Math.min(99, 97 + ((value - range.p97) / range.p97) * 10);
};

const getStatusLabel = (percentile: number): string => {
  if (percentile < 3) return 'স্বাভাবিকের চেয়ে কম';
  if (percentile > 97) return 'স্বাভাবিকের চেয়ে বেশি';
  return 'স্বাভাবিক সীমায়';
};

const ChildGrowthChecker: React.FC = () => {
  const [gender, setGender] = useState<Gender>('male');
  const [ageYears, setAgeYears] = useState('2');
  const [weight, setWeight] = useState('12');
  const [height, setHeight] = useState('87');

  const parsedAgeYears = Number(ageYears);
  const parsedWeight = Number(weight);
  const parsedHeight = Number(height);

  const result = useMemo(() => {
    if (
      Number.isNaN(parsedAgeYears) ||
      Number.isNaN(parsedWeight) ||
      Number.isNaN(parsedHeight) ||
      parsedAgeYears < 0 ||
      parsedAgeYears > 5 ||
      parsedWeight <= 0 ||
      parsedHeight <= 0
    ) {
      return null;
    }

    const ageMonths = parsedAgeYears * 12;
    const weightRange = interpolateMetric(ageMonths, gender, 'weight');
    const heightRange = interpolateMetric(ageMonths, gender, 'height');
    const weightPercentile = estimatePercentile(parsedWeight, weightRange);
    const heightPercentile = estimatePercentile(parsedHeight, heightRange);
    const bmi = parsedWeight / ((parsedHeight / 100) * (parsedHeight / 100));

    return {
      weightRange,
      heightRange,
      weightPercentile,
      heightPercentile,
      bmi,
    };
  }, [gender, parsedAgeYears, parsedHeight, parsedWeight]);

  return (
    <section id="growth-checker" className="py-20 bg-gradient-to-b from-white to-emerald-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">শিশুর গ্রোথ চার্ট চেকার</h2>
          <p className="mt-3 text-sm text-slate-500">
            ০-৫ বছর বয়সী শিশুর উচ্চতা ও ওজন প্রাথমিকভাবে যাচাই করুন। এটি একটি স্ক্রিনিং টুল, চূড়ান্ত মেডিকেল মূল্যায়ন নয়।
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">শিশুর লিঙ্গ</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${gender === 'male' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}
                  >
                    ছেলে
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${gender === 'female' ? 'bg-pink-50 text-pink-700 border border-pink-200' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}
                  >
                    মেয়ে
                  </button>
                </div>
              </div>

              <label className="block">
                <span className="text-xs font-semibold text-slate-700">বয়স (বছর)</span>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={ageYears}
                  onChange={(e) => setAgeYears(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-slate-700">ওজন (কেজি)</span>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-slate-700">উচ্চতা (সেমি)</span>
                <input
                  type="number"
                  min="30"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            {!result ? (
              <div className="h-full flex items-center justify-center text-center text-sm text-slate-500">
                ০-৫ বছরের মধ্যে সঠিক বয়স, ওজন ও উচ্চতা দিন।
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[11px] text-slate-500 flex items-center gap-1"><Baby className="h-4 w-4" /> বয়স</p>
                    <p className="text-lg font-bold text-slate-900">{parsedAgeYears.toFixed(1)} বছর</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[11px] text-slate-500 flex items-center gap-1"><Scale className="h-4 w-4" /> BMI</p>
                    <p className="text-lg font-bold text-slate-900">{result.bmi.toFixed(1)}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[11px] text-slate-500 flex items-center gap-1"><Activity className="h-4 w-4" /> অবস্থা</p>
                    <p className="text-lg font-bold text-emerald-600">
                      {getStatusLabel((result.weightPercentile + result.heightPercentile) / 2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-semibold text-slate-800 flex items-center gap-1"><Scale className="h-4 w-4 text-emerald-600" /> ওজন পার্সেন্টাইল</p>
                      <span className="text-xs font-bold text-slate-500">P{Math.round(result.weightPercentile)}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, Math.max(1, result.weightPercentile))}%` }} />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      রেফারেন্স: P3 {result.weightRange.p3.toFixed(1)}kg, P50 {result.weightRange.p50.toFixed(1)}kg, P97 {result.weightRange.p97.toFixed(1)}kg
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-semibold text-slate-800 flex items-center gap-1"><Ruler className="h-4 w-4 text-blue-600" /> উচ্চতা পার্সেন্টাইল</p>
                      <span className="text-xs font-bold text-slate-500">P{Math.round(result.heightPercentile)}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, Math.max(1, result.heightPercentile))}%` }} />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      রেফারেন্স: P3 {result.heightRange.p3.toFixed(1)}cm, P50 {result.heightRange.p50.toFixed(1)}cm, P97 {result.heightRange.p97.toFixed(1)}cm
                    </p>
                  </div>
                </div>

                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                  নোট: এই ফলাফল WHO-ভিত্তিক আনুমানিক স্ক্রিনিং। P3-এর নিচে বা P97-এর উপরে হলে শিশু বিশেষজ্ঞ/পুষ্টিবিদের সাথে পরামর্শ করুন।
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChildGrowthChecker;
