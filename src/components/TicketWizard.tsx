import React, { useState } from 'react';
import {
  Users,
  Check,
  ArrowRight,
  ChevronLeft,
  Copy,
  Sparkles,
  ShieldCheck,
  Utensils
} from 'lucide-react';
import { soundscape } from '../utils/soundscape';

interface TicketWizardProps {
  onBook: (childCount: number) => void;
  className?: string;
}

const TIER_PRICING: Record<number, number> = {
  1: 25,
  2: 45,
  3: 60,
  4: 70,
  5: 90,
  6: 110
};

export const TicketWizard: React.FC<TicketWizardProps> = ({ onBook, className = '' }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [count, setCount] = useState<number>(2);
  const [copied, setCopied] = useState<boolean>(false);

  const totalUSD = TIER_PRICING[count] || count * 20;
  const perChild = (totalUSD / count).toFixed(count > 1 ? 2 : 0);
  const ussdCode = `*151*1*1*0779140417*${totalUSD}#`;

  const handleSelectCount = (num: number) => {
    setCount(num);
    soundscape.playMarimbaClick(480 + num * 40, 0.05);
  };

  const handleNextStep = () => {
    setStep(2);
    soundscape.playMarimbaClick(640, 0.08);
  };

  const handlePrevStep = () => {
    setStep(1);
    soundscape.playMarimbaClick(440, 0.05);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(ussdCode);
      setCopied(true);
      soundscape.playMarimbaClick(700, 0.06);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className={`max-w-xl mx-auto ${className}`}>
      {/* Wizard Progress Ribbon */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-6 h-6 rounded-full text-xs font-mono font-bold flex items-center justify-center transition-all ${
              step === 1
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {step === 1 ? '1' : <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
            {step === 1 ? 'Select Children' : 'Pass Summary'}
          </span>
        </div>

        <span className="font-mono text-[11px] font-bold text-slate-600 tracking-widest uppercase">
          Step {step} of 2
        </span>
      </div>

      {/* Main Wizard Card */}
      <div className="bg-[#FAF8F4] border border-[#E8E2D6] rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(45,35,25,0.12)] space-y-6">
        
        {/* STEP 1: Fast Children Selector */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-serif italic text-slate-900 leading-tight">
                How many children are coming?
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                Parents &amp; infants enter free. Automatic sibling discounts apply.
              </p>
            </div>

            {/* Tactile Big Count Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { n: 1, label: '1 Child', price: '$25' },
                { n: 2, label: '2 Siblings', price: '$45' },
                { n: 3, label: '3 Siblings', price: '$60' },
                { n: 4, label: '4 Siblings', price: '$70' }
              ].map(opt => {
                const isSelected = count === opt.n;
                return (
                  <button
                    key={opt.n}
                    type="button"
                    onClick={() => handleSelectCount(opt.n)}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-amber-400 shadow-sm scale-102 ring-2 ring-amber-400/20'
                        : 'bg-white/60 hover:bg-white border-[#E8E2D6] text-slate-700'
                    }`}
                  >
                    <div className="font-sans font-bold text-sm text-slate-900">
                      {opt.label}
                    </div>
                    <div className="font-serif italic text-lg text-[#C85A32]">
                      {opt.price}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Total Preview & Continue */}
            <div className="pt-4 border-t border-[#E8E2D6] flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest block">
                  Total Admission
                </span>
                <span className="text-2xl sm:text-3xl font-serif italic text-slate-900 font-normal">
                  ${totalUSD}{' '}
                  <span className="text-xs font-sans text-slate-700 font-medium not-italic">
                    (${perChild}/child)
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 active:scale-98 text-amber-200 font-semibold text-xs tracking-wide shadow-sm transition cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Crisp Summary & 1-Tap Booking / EcoCash */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-serif italic text-slate-900 leading-tight">
                  {count} Family Day Pass{count > 1 ? 'es' : ''}
                </h3>
                <p className="text-xs text-slate-500">
                  December 5 · The Little Farm · 5 Richwell Ave
                </p>
              </div>

              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Change</span>
              </button>
            </div>

            {/* Clear inclusions with clean micro-chips */}
            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E8E2D6]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{count} Wristband{count > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E8E2D6]">
                <Utensils className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{count} Lunch Pack{count > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E8E2D6]">
                <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Unlimited Treats</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E8E2D6]">
                <Users className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Parents Free</span>
              </div>
            </div>

            {/* Total Amount Callout */}
            <div className="p-4 rounded-2xl bg-white border border-[#E8E2D6] flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Due
              </span>
              <span className="text-3xl font-serif italic text-slate-900 font-normal">
                ${totalUSD}{' '}
                <span className="text-xs font-sans text-slate-700 font-medium not-italic">
                  USD
                </span>
              </span>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => {
                soundscape.playMarimbaClick(650, 0.08);
                onBook(count);
              }}
              className="w-full py-3.5 px-6 rounded-full bg-[#C85A32] hover:bg-[#B34D28] active:scale-98 text-white font-semibold text-sm tracking-wide shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Confirm &amp; Reserve Online (${totalUSD})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Or EcoCash Direct USSD */}
            <div className="pt-2 border-t border-[#E8E2D6] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                <span>Direct EcoCash USSD</span>
                <span className="text-emerald-700">0779 140 417</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-xs bg-white text-slate-800 p-2.5 rounded-xl border border-[#E8E2D6] truncate">
                  {ussdCode}
                </code>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-200 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 text-center font-normal">
                USD cash also accepted at the entrance.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
