import React, { useState } from 'react';
import { GameSettings, EraId, WorldConditionMode, EvidenceRarity } from '../game/types.ts';
import { useTranslation, Language } from '../localization/LocalizationContext.tsx';
import { sound } from '../utils/audio.ts';
import {
  Settings,
  Volume2,
  VolumeX,
  Globe,
  Sliders,
  Trash2,
  ArrowLeft,
  Check,
  RotateCcw,
} from 'lucide-react';
import {
  DEFAULT_PROBABILITY_WEIGHTS,
  normalizeWeights,
  validateWeights,
} from '../game/probabilityConfig.ts';

interface SettingsScreenProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetAllData: () => void;
  onGoBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetAllData,
  onGoBack,
}) => {
  const { language, setLanguage, t } = useTranslation();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    sound.playClick();
    setLanguage(lang);
    onUpdateSettings({ ...settings, language: lang });
    triggerSaveNotice();
  };

  const handleSoundToggle = () => {
    sound.playClick();
    const next = !settings.soundEnabled;
    sound.setEnabled(next);
    onUpdateSettings({ ...settings, soundEnabled: next });
    triggerSaveNotice();
  };

  const handleMotionToggle = () => {
    sound.playClick();
    const next = !settings.reducedMotion;
    onUpdateSettings({ ...settings, reducedMotion: next });
    triggerSaveNotice();
  };

  const handleEraWeightChange = (era: EraId, value: number) => {
    const raw = { ...settings.eraWeights, [era]: Math.max(0, value) };
    if (validateWeights(raw)) {
      const normalized = normalizeWeights(raw);
      onUpdateSettings({ ...settings, eraWeights: normalized });
      triggerSaveNotice();
    }
  };

  const handleWorldModeChange = (mode: WorldConditionMode, value: number) => {
    const raw = { ...settings.worldModeWeights, [mode]: Math.max(0, value) };
    if (validateWeights(raw)) {
      const normalized = normalizeWeights(raw);
      onUpdateSettings({ ...settings, worldModeWeights: normalized });
      triggerSaveNotice();
    }
  };

  const handleRarityChange = (rarity: EvidenceRarity, value: number) => {
    const raw = { ...settings.itemRarityWeights, [rarity]: Math.max(0, value) };
    if (validateWeights(raw)) {
      const normalized = normalizeWeights(raw);
      onUpdateSettings({ ...settings, itemRarityWeights: normalized });
      triggerSaveNotice();
    }
  };

  const handleRestoreDefaults = () => {
    sound.playClick();
    onUpdateSettings({
      ...settings,
      eraWeights: { ...DEFAULT_PROBABILITY_WEIGHTS.eras },
      worldModeWeights: { ...DEFAULT_PROBABILITY_WEIGHTS.worldModes },
      itemRarityWeights: { ...DEFAULT_PROBABILITY_WEIGHTS.itemRarity },
    });
    triggerSaveNotice();
  };

  const triggerSaveNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2A3B54] pb-6">
        <div>
          <button
            onClick={() => {
              sound.playClick();
              onGoBack();
            }}
            className="text-xs font-semibold text-[#D6AE67] hover:underline flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t.nav.home}
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F3F4F6] font-serif">
            {t.settings.title}
          </h1>
          <p className="text-sm text-[#A8B1C1] mt-1">
            {t.settings.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRestoreDefaults}
            className="px-3.5 py-2 text-xs font-semibold text-[#D6AE67] hover:text-[#E4C589] bg-[#182235] hover:bg-[#202C40] border border-[#D6AE67]/40 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.settings.restoreDefaults}</span>
          </button>

          {savedNotice && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-xs font-semibold text-emerald-400 font-mono animate-fadeIn">
              <Check className="w-3.5 h-3.5" />
              {t.settings.savedAlert}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. Language Setting */}
        <div className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#D6AE67]" />
              <h3 className="text-sm font-bold text-[#F3F4F6]">
                {t.settings.language}
              </h3>
            </div>
            <p className="text-xs text-[#A8B1C1]">
              Қазақ тілі (Default) / English (US)
            </p>
          </div>

          <div className="flex items-center bg-[#111827] border border-[#2A3B54] rounded-xl p-1 text-xs font-bold">
            <button
              onClick={() => handleLanguageChange('kk')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                language === 'kk'
                  ? 'bg-[#D6AE67] text-[#0B1020]'
                  : 'text-[#A8B1C1] hover:text-[#F3F4F6]'
              }`}
            >
              Қазақша (ҚАЗ)
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                language === 'en'
                  ? 'bg-[#D6AE67] text-[#0B1020]'
                  : 'text-[#A8B1C1] hover:text-[#F3F4F6]'
              }`}
            >
              English (ENG)
            </button>
          </div>
        </div>

        {/* 2. Sound Synthesizer Setting */}
        <div className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#D6AE67]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#A8B1C1]" />
              )}
              <h3 className="text-sm font-bold text-[#F3F4F6]">
                {t.settings.sound}
              </h3>
            </div>
            <p className="text-xs text-[#A8B1C1]">
              {t.settings.soundDesc}
            </p>
          </div>

          <button
            onClick={handleSoundToggle}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 focus:outline-none ${
              settings.soundEnabled ? 'bg-[#D6AE67]' : 'bg-[#111827] border border-[#2A3B54]'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform ${
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 3. Reduced Motion Setting */}
        <div className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#F3F4F6]">
              {t.settings.motion}
            </h3>
            <p className="text-xs text-[#A8B1C1]">
              {t.settings.motionDesc}
            </p>
          </div>

          <button
            onClick={handleMotionToggle}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 focus:outline-none ${
              settings.reducedMotion ? 'bg-[#D6AE67]' : 'bg-[#111827] border border-[#2A3B54]'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform ${
                settings.reducedMotion ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 4. Era Weights Configuration */}
        <div className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#D6AE67]" />
            <h3 className="text-sm font-bold text-[#F3F4F6]">
              {t.settings.eraWeightsTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {(['victorian', 'modern', 'future'] as EraId[]).map((era) => (
              <div key={era} className="p-4 rounded-xl bg-[#111827] border border-[#2A3B54] space-y-2">
                <div className="flex justify-between font-mono">
                  <span className="capitalize text-[#F3F4F6] font-semibold">{era}</span>
                  <span className="text-[#D6AE67]">{settings.eraWeights[era]}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="90"
                  value={settings.eraWeights[era]}
                  onChange={(e) => handleEraWeightChange(era, parseInt(e.target.value, 10))}
                  className="w-full accent-[#D6AE67] cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 5. World Mode Weights (Normal vs Crisis) */}
        <div className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#D6AE67]" />
            <h3 className="text-sm font-bold text-[#F3F4F6]">
              {t.settings.worldModeTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {(['normal', 'crisis'] as WorldConditionMode[]).map((mode) => (
              <div key={mode} className="p-4 rounded-xl bg-[#111827] border border-[#2A3B54] space-y-2">
                <div className="flex justify-between font-mono">
                  <span className="capitalize text-[#F3F4F6] font-semibold">{mode} Mode</span>
                  <span className="text-[#D6AE67]">{settings.worldModeWeights[mode]}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={settings.worldModeWeights[mode]}
                  onChange={(e) => handleWorldModeChange(mode, parseInt(e.target.value, 10))}
                  className="w-full accent-[#D6AE67] cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 6. Item Rarity Weights */}
        <div className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#D6AE67]" />
            <h3 className="text-sm font-bold text-[#F3F4F6]">
              {t.settings.rarityWeightsTitle}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {(['common', 'uncommon', 'rare', 'special'] as EvidenceRarity[]).map((rarity) => (
              <div key={rarity} className="p-3.5 rounded-xl bg-[#111827] border border-[#2A3B54] space-y-2">
                <div className="flex justify-between font-mono">
                  <span className="capitalize text-[#F3F4F6] font-semibold">{rarity}</span>
                  <span className="text-[#D6AE67]">{settings.itemRarityWeights[rarity]}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="80"
                  value={settings.itemRarityWeights[rarity]}
                  onChange={(e) => handleRarityChange(rarity, parseInt(e.target.value, 10))}
                  className="w-full accent-[#D6AE67] cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 7. Danger Zone: Reset Game Data */}
        <div className="p-6 rounded-2xl bg-[#182235] border border-rose-500/30 space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <Trash2 className="w-4 h-4" />
            <h3 className="text-sm font-bold">{t.settings.resetData}</h3>
          </div>

          <p className="text-xs text-[#A8B1C1]">{t.settings.resetConfirm}</p>

          {showResetConfirm ? (
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onResetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
              >
                {language === 'kk' ? 'Иә, барлығын өшіру' : 'Yes, wipe all data'}
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-[#A8B1C1] hover:text-[#F3F4F6]"
              >
                {t.common.cancel}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 text-xs font-semibold text-rose-400 hover:text-white bg-rose-950/30 hover:bg-rose-900/50 border border-rose-500/40 rounded-lg transition-colors"
            >
              {t.settings.resetBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
