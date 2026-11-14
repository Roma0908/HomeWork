import React, { useState } from 'react';
import { useTranslation } from '../localization/LocalizationContext.tsx';
import { EraId } from '../game/types.ts';
import { EraCard } from '../components/cards/EraCard.tsx';
import { sound } from '../utils/audio.ts';
import { Dices, Sparkles, Sliders, ShieldAlert, AlertTriangle } from 'lucide-react';
import { DEFAULT_PROBABILITY_WEIGHTS, ProbabilityWeights } from '../game/probabilityConfig.ts';

interface ProbabilityPreviewProps {
  weights?: ProbabilityWeights;
  onGenerateCase: (preferredEra?: EraId) => void;
  onNavigateToSettings: () => void;
}

export const ProbabilityPreview: React.FC<ProbabilityPreviewProps> = ({
  weights = DEFAULT_PROBABILITY_WEIGHTS,
  onGenerateCase,
  onNavigateToSettings,
}) => {
  const { language, t } = useTranslation();
  const [selectedEra, setSelectedEra] = useState<EraId | undefined>(undefined);

  const eraProbabilities = weights.eras;
  const worldProbabilities = weights.worldModes;
  const rarityProbabilities = weights.itemRarity;

  const handleGenerate = () => {
    sound.playClick();
    onGenerateCase(selectedEra);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A3B54] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F3F4F6] font-serif">
            {t.probability.title}
          </h1>
          <p className="text-sm text-[#A8B1C1] mt-1">
            {t.probability.subtitle}
          </p>
        </div>

        <button
          onClick={handleGenerate}
          className="px-6 py-3 text-sm font-bold text-[#0B1020] bg-[#D6AE67] hover:bg-[#E4C589] rounded-xl shadow-lg shadow-[#D6AE67]/20 transition-all flex items-center gap-2 self-start sm:self-auto hover:scale-105"
        >
          <Dices className="w-4 h-4" />
          {t.probability.generateBtn}
        </button>
      </div>

      {/* 1. Era Distribution Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#F3F4F6] font-serif flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D6AE67]" />
            {t.probability.eraDistribution}
          </h2>
          <span className="text-xs text-[#A8B1C1]">
            {selectedEra
              ? (language === 'kk' ? 'Таңдалды (100%)' : 'Selected Era (100%)')
              : (language === 'kk' ? 'Кездейсоқ (Салмақталған PRNG)' : 'Weighted PRNG Distribution')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <EraCard
            eraId="victorian"
            isSelected={selectedEra === 'victorian'}
            onSelect={() => setSelectedEra(selectedEra === 'victorian' ? undefined : 'victorian')}
            probability={selectedEra === 'victorian' ? 100 : eraProbabilities.victorian}
          />
          <EraCard
            eraId="modern"
            isSelected={selectedEra === 'modern'}
            onSelect={() => setSelectedEra(selectedEra === 'modern' ? undefined : 'modern')}
            probability={selectedEra === 'modern' ? 100 : eraProbabilities.modern}
          />
          <EraCard
            eraId="future"
            isSelected={selectedEra === 'future'}
            onSelect={() => setSelectedEra(selectedEra === 'future' ? undefined : 'future')}
            probability={selectedEra === 'future' ? 100 : eraProbabilities.future}
          />
        </div>
      </section>

      {/* 2. World Modes & Item Rarities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* World Condition Mode */}
        <div className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F3F4F6] font-serif flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#D6AE67]" />
              {t.probability.conditionDistribution}
            </h3>
            <span className="text-xs font-mono text-[#A8B1C1]">100% total</span>
          </div>

          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#F3F4F6] font-medium">{t.probability.normalMode}</span>
                <span className="font-mono font-bold text-[#6C94C5]">{worldProbabilities.normal}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#111827] overflow-hidden">
                <div
                  className="h-full bg-[#6C94C5]"
                  style={{ width: `${worldProbabilities.normal}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-rose-300 font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  {t.probability.crisisMode}
                </span>
                <span className="font-mono font-bold text-rose-400">{worldProbabilities.crisis}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#111827] overflow-hidden">
                <div
                  className="h-full bg-rose-500"
                  style={{ width: `${worldProbabilities.crisis}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Evidence Rarity */}
        <div className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F3F4F6] font-serif">
              {t.probability.rarityDistribution}
            </h3>
            <span className="text-xs font-mono text-[#D6AE67]">Active Seed Weights</span>
          </div>

          <div className="space-y-3">
            {[
              { label: t.evidence.rarity.common, prob: rarityProbabilities.common, color: 'bg-slate-400' },
              { label: t.evidence.rarity.uncommon, prob: rarityProbabilities.uncommon, color: 'bg-emerald-400' },
              { label: t.evidence.rarity.rare, prob: rarityProbabilities.rare, color: 'bg-[#6C94C5]' },
              { label: t.evidence.rarity.special, prob: rarityProbabilities.special, color: 'bg-[#D6AE67]' },
            ].map((r, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#A8B1C1]">{r.label}</span>
                  <span className="font-mono text-[#D6AE67]">{r.prob}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#111827] overflow-hidden">
                  <div className={`h-full ${r.color}`} style={{ width: `${r.prob}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#2A3B54] flex items-center justify-between text-xs text-[#A8B1C1]">
            <span>{t.probability.weightsNotice}</span>
            <button
              onClick={onNavigateToSettings}
              className="text-[#D6AE67] hover:underline flex items-center gap-1 font-semibold shrink-0"
            >
              <Sliders className="w-3.5 h-3.5" />
              {t.nav.settings}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
