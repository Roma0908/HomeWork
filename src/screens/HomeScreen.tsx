import React from 'react';
import { useTranslation } from '../localization/LocalizationContext.tsx';
import { ScreenId } from '../components/layout/Header.tsx';
import { EraCard } from '../components/cards/EraCard.tsx';
import { sound } from '../utils/audio.ts';
import { Play, RotateCcw, Brain, FolderArchive, BookOpen, Settings, ShieldAlert, Sparkles } from 'lucide-react';

interface HomeScreenProps {
  hasActiveCase: boolean;
  onNavigate: (screen: ScreenId) => void;
  onStartNewCaseFlow: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  hasActiveCase,
  onNavigate,
  onStartNewCaseFlow,
}) => {
  const { t } = useTranslation();

  const handleAction = (cb: () => void) => {
    sound.playClick();
    cb();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-[#2A3B54] bg-[#111827] shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D6AE67]/10 via-transparent to-[#6C94C5]/10 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182235] border border-[#D6AE67]/40 text-[#D6AE67] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.brand.tagline}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F3F4F6] font-serif leading-tight">
            {t.home.heroTitle}
          </h1>

          <p className="text-base text-[#A8B1C1] leading-relaxed">
            {t.home.heroDesc}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => handleAction(onStartNewCaseFlow)}
              className="px-6 py-3.5 text-sm font-bold text-[#0B1020] bg-[#D6AE67] hover:bg-[#E4C589] rounded-xl shadow-lg shadow-[#D6AE67]/20 transition-all hover:scale-105 flex items-center gap-2.5"
            >
              <Play className="w-4 h-4 fill-current" />
              {t.home.newCaseBtn}
            </button>

            {hasActiveCase && (
              <button
                onClick={() => handleAction(() => onNavigate('investigation'))}
                className="px-6 py-3.5 text-sm font-semibold text-[#F3F4F6] bg-[#182235] hover:bg-[#202C40] border border-[#2A3B54] rounded-xl transition-all flex items-center gap-2.5"
              >
                <RotateCcw className="w-4 h-4 text-[#6C94C5]" />
                {t.home.continueCaseBtn}
              </button>
            )}

            <button
              onClick={() => handleAction(() => onNavigate('aiLab'))}
              className="px-5 py-3.5 text-sm font-semibold text-[#6C94C5] bg-[#182235] hover:bg-[#202C40] border border-[#6C94C5]/40 rounded-xl transition-all flex items-center gap-2.5"
            >
              <Brain className="w-4 h-4" />
              {t.home.aiLabBtn}
            </button>
          </div>
        </div>
      </section>

      {/* Era Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#F3F4F6] font-serif">
              {t.home.eraShowcaseTitle}
            </h2>
            <p className="text-sm text-[#A8B1C1] mt-1">
              {t.home.eraShowcaseSubtitle}
            </p>
          </div>
          <button
            onClick={() => handleAction(() => onNavigate('probability'))}
            className="text-xs font-semibold text-[#D6AE67] hover:underline whitespace-nowrap self-start sm:self-auto"
          >
            {t.probability.title} →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EraCard eraId="victorian" />
          <EraCard eraId="modern" />
          <EraCard eraId="future" />
        </div>
      </section>

      {/* Procedural Generation Feature Banner */}
      <section className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#111827] border border-[#D6AE67]/40 flex items-center justify-center text-[#D6AE67] shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#F3F4F6] font-serif">
              {t.home.systemFeatureTitle}
            </h3>
            <p className="text-xs text-[#A8B1C1] leading-relaxed max-w-2xl">
              {t.home.systemFeatureDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={() => handleAction(() => onNavigate('howToPlay'))}
            className="flex-1 md:flex-initial px-4 py-2.5 text-xs font-semibold text-[#F3F4F6] bg-[#111827] border border-[#2A3B54] rounded-lg hover:border-[#D6AE67] transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-[#D6AE67]" />
            {t.home.howToPlayBtn}
          </button>
          <button
            onClick={() => handleAction(() => onNavigate('collection'))}
            className="flex-1 md:flex-initial px-4 py-2.5 text-xs font-semibold text-[#F3F4F6] bg-[#111827] border border-[#2A3B54] rounded-lg hover:border-[#6C94C5] transition-colors flex items-center justify-center gap-2"
          >
            <FolderArchive className="w-4 h-4 text-[#6C94C5]" />
            {t.home.exploreCollection}
          </button>
        </div>
      </section>
    </div>
  );
};
