import React, { useState } from 'react';
import { X, Image as ImageIcon, RotateCcw, Check, Upload, Sparkles } from 'lucide-react';
import {
  SectionBackgroundConfig,
  DEFAULT_SECTION_BACKGROUNDS,
  saveStoredSectionBackgrounds
} from '../data/sectionBackgrounds';

interface BackgroundCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: SectionBackgroundConfig;
  onSave: (newConfig: SectionBackgroundConfig) => void;
}

export const BackgroundCustomizerModal: React.FC<BackgroundCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onSave
}) => {
  const [config, setConfig] = useState<SectionBackgroundConfig>(currentConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'playZonesSection' | 'programmeSection'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setConfig(prev => ({
          ...prev,
          [field]: reader.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveStoredSectionBackgrounds(config);
    onSave(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    setConfig(DEFAULT_SECTION_BACKGROUNDS);
    saveStoredSectionBackgrounds(DEFAULT_SECTION_BACKGROUNDS);
    onSave(DEFAULT_SECTION_BACKGROUNDS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-kid font-black text-lg text-slate-900 leading-tight">
                Section Background Images
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Customize background images for Play Zones &amp; Programme
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/70 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Section 1: Play Zones Background */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Play Zones Section Background
              </label>
              <label className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer">
                <Upload className="w-3 h-3" />
                Upload File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleFileUpload(e, 'playZonesSection')}
                />
              </label>
            </div>
            <input
              type="text"
              value={config.playZonesSection}
              onChange={e => setConfig(prev => ({ ...prev, playZonesSection: e.target.value }))}
              placeholder="Paste image URL (https://... or /bambino-farm.jpg)"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-hidden font-mono text-slate-700 bg-slate-50/50"
            />
            {config.playZonesSection && (
              <div className="h-20 w-full rounded-xl overflow-hidden relative border border-slate-200">
                <img
                  src={config.playZonesSection}
                  alt="Play Zones Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-amber-950/60 to-slate-950/80 flex items-center px-4">
                  <span className="text-white text-xs font-kid font-bold">
                    Play Zones Atmosphere Preview (with warm overlay)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Programme Background */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Event Programme Section Background
              </label>
              <label className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer">
                <Upload className="w-3 h-3" />
                Upload File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleFileUpload(e, 'programmeSection')}
                />
              </label>
            </div>
            <input
              type="text"
              value={config.programmeSection}
              onChange={e => setConfig(prev => ({ ...prev, programmeSection: e.target.value }))}
              placeholder="Paste image URL (https://... or /bambino-farm.jpg)"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden font-mono text-slate-700 bg-slate-50/50"
            />
            {config.programmeSection && (
              <div className="h-20 w-full rounded-xl overflow-hidden relative border border-slate-200">
                <img
                  src={config.programmeSection}
                  alt="Programme Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-amber-950/70 to-emerald-950/80 flex items-center px-4">
                  <span className="text-white text-xs font-kid font-bold">
                    Programme Backdrop Preview (with warm overlay)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Presets */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Quick Curated Presets:
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                type="button"
                onClick={() =>
                  setConfig(prev => ({
                    ...prev,
                    playZonesSection:
                      'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=2000&q=80',
                    programmeSection:
                      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2000&q=80'
                  }))
                }
                className="px-2.5 py-1 text-xs rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-semibold cursor-pointer"
              >
                Golden Lawn
              </button>
              <button
                type="button"
                onClick={() =>
                  setConfig(prev => ({
                    ...prev,
                    playZonesSection: '/bambino-farm.jpg',
                    programmeSection: '/bambino-farm.jpg'
                  }))
                }
                className="px-2.5 py-1 text-xs rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-semibold cursor-pointer"
              >
                The Little Farm Grounds
              </button>
              <button
                type="button"
                onClick={() =>
                  setConfig(prev => ({
                    ...prev,
                    playZonesSection:
                      'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=2000&q=80',
                    programmeSection:
                      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=2000&q=80'
                  }))
                }
                className="px-2.5 py-1 text-xs rounded-lg bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 font-semibold cursor-pointer"
              >
                Vibrant Festival
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Applied!
                </>
              ) : (
                'Apply Backgrounds'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
