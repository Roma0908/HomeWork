import React from 'react';
import { Suspect } from '../../game/types.ts';
import { SuspectAvatar } from '../cards/SuspectAvatar.tsx';
import {
  X,
  Award,
  Sparkles,
  MapPin,
  HeartHandshake,
  MessageSquare,
  ShieldAlert,
  Brain,
  FileText,
} from 'lucide-react';

interface CharacterProfileModalProps {
  suspect: Suspect | null;
  language: 'kk' | 'en';
  onClose: () => void;
  onInterrogate: (suspectId: string) => void;
}

export const CharacterProfileModal: React.FC<CharacterProfileModalProps> = ({
  suspect,
  language,
  onClose,
  onInterrogate,
}) => {
  if (!suspect) return null;

  const isKk = language === 'kk';

  const roleSlotLabels: Record<string, { kk: string; en: string; badge: string }> = {
    insider: {
      kk: 'Ішкі мүдделі тұлға (The Insider)',
      en: 'The Insider (Direct Estate Stakeholder)',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    access_holder: {
      kk: 'Рұқсат кілтін ұстаушы (The Access Holder)',
      en: 'The Access Holder (Master Security Clearance)',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
    specialist: {
      kk: 'Арнайы маман-сарапшы (The Specialist)',
      en: 'The Specialist (Domain Forensic Expert)',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    },
    witness: {
      kk: 'Басты куәгер (The Witness)',
      en: 'The Witness (Direct Incident Observer)',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
  };

  const slotInfo = roleSlotLabels[suspect.roleSlot] || {
    kk: 'Күдікті',
    en: 'Person of Interest',
    badge: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#162133] via-[#0F1827] to-[#0A101C] border border-[#2B4162] shadow-2xl text-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#0F1827]/90 backdrop-blur-md border-b border-[#2B4162]/60">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${slotInfo.badge}`}
            >
              <Award className="w-3.5 h-3.5" />
              {isKk ? slotInfo.kk : slotInfo.en}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#8FA3BF] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Hero Row: Portrait + Identity */}
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="shrink-0 w-36 h-48 sm:w-44 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#D6AE67]/50 shadow-2xl">
              <SuspectAvatar suspect={suspect} size="full" />
            </div>

            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-wide">
                  {suspect.name}
                </h2>
                <p className="text-sm font-semibold text-[#D6AE67] mt-0.5">
                  {isKk ? suspect.profession.kk : suspect.profession.en}
                </p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start items-center text-xs text-[#8FA3BF] mt-2 font-mono">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    {suspect.age} {isKk ? 'жас' : 'years old'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 capitalize">
                    {suspect.gender}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    {isKk ? 'Стиль:' : 'Style:'} {suspect.communicationStyle}
                  </span>
                </div>
              </div>

              {/* Biography */}
              <div className="text-xs text-[#CBD5E1] leading-relaxed bg-[#0B1220]/70 border border-[#23354E]/60 rounded-xl p-3">
                <p>{isKk ? suspect.bio.kk : suspect.bio.en}</p>
              </div>

              {/* Psychological Traits */}
              <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                {suspect.personalityTraits.map((trait) => (
                  <span
                    key={trait}
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-[#1B293E] text-[#93B1D8] border border-[#2B405D]"
                  >
                    <Brain className="w-3 h-3 text-[#D6AE67]" />
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Special Capability Card */}
          {suspect.professionCapability && (
            <div className="rounded-2xl bg-gradient-to-r from-[#172554]/40 to-[#1e1b4b]/40 border border-[#2563eb]/40 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#93c5fd]">
                <Sparkles className="w-4 h-4 text-[#D6AE67]" />
                <span>
                  {isKk ? 'Кәсіби арнайы қабілеті' : 'Professional Specialist Capability'}:{' '}
                  <span className="text-white">
                    {isKk
                      ? suspect.professionCapability.title.kk
                      : suspect.professionCapability.title.en}
                  </span>
                </span>
              </div>
              <p className="text-xs text-[#bfdbfe] mt-1.5 leading-relaxed">
                {isKk
                  ? suspect.professionCapability.description.kk
                  : suspect.professionCapability.description.en}
              </p>
            </div>
          )}

          {/* Grid of Intel: Alibi & Relationships */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Alibi Claim */}
            <div className="rounded-2xl bg-[#0F1827] border border-[#23354E] p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#D6AE67]">
                <MapPin className="w-4 h-4" />
                <span>{isKk ? 'Күдіктінің ресми алибиі' : 'Official Alibi Claim'}</span>
              </div>
              <p className="text-[#CBD5E1] leading-relaxed italic">
                "{isKk ? suspect.alibi.kk : suspect.alibi.en}"
              </p>
            </div>

            {/* Relationships */}
            <div className="rounded-2xl bg-[#0F1827] border border-[#23354E] p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#93B1D8]">
                <HeartHandshake className="w-4 h-4 text-[#D6AE67]" />
                <span>{isKk ? 'Қарым-қатынастар мен байланыстар' : 'Known Relationships'}</span>
              </div>
              <p className="text-[#CBD5E1] leading-relaxed">
                {isKk ? suspect.relationships.kk : suspect.relationships.en}
              </p>
            </div>
          </div>

          {/* Interrogation Status & Counters */}
          <div className="rounded-2xl bg-[#0B1220] border border-[#23354E] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#D6AE67]/10 text-[#D6AE67] border border-[#D6AE67]/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isKk ? 'Тергеу журналы' : 'Interrogation Status'}
                </h4>
                <p className="text-xs text-[#8FA3BF]">
                  {suspect.interrogatedCount > 0
                    ? isKk
                      ? `${suspect.interrogatedCount} сұрақ қойылды`
                      : `${suspect.interrogatedCount} questions asked`
                    : isKk
                    ? 'Әлі толық тергелмеген'
                    : 'Not yet formally interviewed'}
                </p>
              </div>
            </div>

            {/* Stress & Trust Gauge */}
            <div className="flex items-center gap-6 text-xs font-mono">
              <div>
                <span className="text-[#8FA3BF] block text-[10px] uppercase">{isKk ? 'Сенім' : 'Trust'}</span>
                <span className="text-base font-bold text-emerald-400">{suspect.trustScore}%</span>
              </div>
              <div>
                <span className="text-[#8FA3BF] block text-[10px] uppercase">{isKk ? 'Күйзеліс' : 'Stress'}</span>
                <span className="text-base font-bold text-rose-400">{suspect.stressLevel}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#0F1827]/90 border-t border-[#2B4162]/60 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8FA3BF] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            {isKk ? 'Жабу' : 'Close'}
          </button>

          <button
            onClick={() => {
              onClose();
              onInterrogate(suspect.id);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D6AE67] to-[#B38C48] hover:from-[#E8C786] hover:to-[#C79C56] text-[#0B1020] font-bold text-xs shadow-lg transition-all active:scale-98 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            {isKk ? 'Тікелей тергеуге өту' : 'Begin Interrogation'}
          </button>
        </div>
      </div>
    </div>
  );
};
