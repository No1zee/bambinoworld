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
  const standardPrice = count * 30;
  const savings = standardPrice - totalUSD;
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
      {/* Wizard Progress Ribbon in Thompson Poppins styling */}
      <div className="flex items-center justify-between mb-4 px-2 font-poppins">
        <div className="flex items-center gap-2">
          <span
            className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
              step === 1
                ? 'bg-[#31006F] text-white shadow-xs'
                : 'bg-[#FF6720] text-white'
            }`}
          >
            {step === 1 ? '1' : <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {step === 1 ? 'Select Children' : 'Pass Summary'}
          </span>
        </div>

        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Step {step} of 2
        </span>
      </div>

      {/* Main Wizard Card in Thompson Card Style */}
      <div className="thompson-card p-6 sm:p-8 space-y-6">
        
        {/* STEP 1: Fast Children Selector */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-poppins font-bold text-[#31006F] leading-tight">
                How many children are attending?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-sans">
                Accompanying parents and infants under 2 enter free. Sibling bundle discounts apply automatically.
              </p>
            </div>

            {/* Tactile Big Count Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer font-poppins ${
                      isSelected
                        ? 'bg-[#31006F] text-white border-[#31006F] shadow-md scale-102'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className={`text-xs font-bold ${isSelected ? 'text-white/80' : 'text-slate-600'}`}>
                      {opt.label}
                    </div>
                    <div className={`text-xl font-black mt-1 ${isSelected ? 'text-[#F6BE00]' : 'text-[#FF6720]'}`}>
                      {opt.price}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Total Preview & Continue */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-poppins font-bold text-slate-500 uppercase tracking-wider block">
                  Early Bird Total
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-poppins font-black text-slate-900">
                    ${totalUSD} <span className="text-xs font-bold text-slate-500">USD</span>
                  </span>
                  {savings > 0 && (
                    <span className="text-xs font-poppins font-bold text-[#FF6720] bg-orange-50 px-2 py-0.5 rounded-full">
                      Save ${savings}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="thompson-pill-btn thompson-pill-orange px-6 py-3 text-sm shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Crisp Summary & 1-Tap Booking / EcoCash */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-poppins font-bold text-[#31006F] leading-tight">
                  {count} Festival Pass{count > 1 ? 'es' : ''}
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Saturday 5 December 2026 · The Little Farm · 5 Richwell Ave
                </p>
              </div>

              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1 text-xs font-poppins font-bold text-[#31006F] hover:text-[#FF6720] transition cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Change</span>
              </button>
            </div>

            {/* Clear inclusions with clean micro-chips */}
            <div className="grid grid-cols-2 gap-2.5 text-xs font-poppins font-semibold text-slate-700">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-[#2F532E] shrink-0" />
                <span>{count} Security Wristband{count > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Utensils className="w-4 h-4 text-[#FF6720] shrink-0" />
                <span>{count} Fresh Lunch Pack{count > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Sparkles className="w-4 h-4 text-[#F6BE00] shrink-0" />
                <span>Unlimited Treats &amp; Waffles</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Users className="w-4 h-4 text-[#31006F] shrink-0" />
                <span>Parents &amp; Under-2s Free</span>
              </div>
            </div>

            {/* Total Amount Callout */}
            <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-slate-200 flex items-center justify-between">
              <span className="font-poppins text-xs font-bold text-slate-600 uppercase tracking-wider">
                Total Due
              </span>
              <span className="text-3xl font-poppins font-black text-[#31006F]">
                ${totalUSD}{' '}
                <span className="text-xs font-sans text-slate-500 font-bold">
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
              className="w-full thompson-pill-btn thompson-pill-orange py-3.5 px-6 text-sm shadow-md"
            >
              <span>Confirm &amp; Reserve Online (${totalUSD})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* EcoCash Direct USSD */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-poppins font-bold text-slate-600 uppercase tracking-wider">
                <span>Direct EcoCash USSD</span>
                <span className="text-[#2F532E] font-bold">0779 140 417</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-xs bg-slate-100 text-slate-800 p-2.5 rounded-xl border border-slate-200 truncate">
                  {ussdCode}
                </code>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-4 py-2.5 bg-[#31006F] hover:bg-[#260058] text-white rounded-xl text-xs font-poppins font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500 text-center font-sans">
                USD cash also accepted at the entrance.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
