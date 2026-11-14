import React from 'react';
import { EraId } from '../../game/types.ts';
import { useTranslation } from '../../localization/LocalizationContext.tsx';
import { Sparkles, Clock, Compass, Cpu } from 'lucide-react';

interface EraCardProps {
  eraId: EraId;
  isSelected?: boolean;
  onSelect?: () => void;
  probability?: number;
}

export const EraCard: React.FC<EraCardProps> = ({
  eraId,
  isSelected,
  onSelect,
  probability,
}) => {
  const { t } = useTranslation();

  const eraInfo = {
    victorian: {
      data: t.home.eras.victorian,
      year: '1888',
      icon: Clock,
      themeColor: '#8C5E35',
      badge: 'Victorian Noir',
      accent: 'border-[#D6AE67]/60 group-hover:border-[#D6AE67]',
      bgGlow: 'from-[#8C5E35]/20 to-transparent',
    },
    modern: {
      data: t.home.eras.modern,
      year: '2026',
      icon: Compass,
      themeColor: '#38BDF8',
      badge: 'Modern Procedural',
      accent: 'border-[#6C94C5]/60 group-hover:border-[#6C94C5]',
      bgGlow: 'from-[#1e3a8a]/20 to-transparent',
    },
    future: {
      data: t.home.eras.future,
      year: '2142',
      icon: Cpu,
      themeColor: '#06B6D4',
      badge: 'Cyber Nexus',
      accent: 'border-[#06B6D4]/60 group-hover:border-[#06B6D4]',
      bgGlow: 'from-[#0891b2]/20 to-transparent',
    },
  }[eraId];

  const Icon = eraInfo.icon;

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-2xl p-5 border transition-all duration-300 text-left bg-[#182235] ${
        isSelected
          ? 'border-[#D6AE67] ring-1 ring-[#D6AE67] bg-[#1d2b42]'
          : eraInfo.accent
      } ${onSelect ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl' : ''}`}
    >
      {/* Top Banner Icon & Year */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#111827] border border-[#2A3B54] flex items-center justify-center text-[#D6AE67]">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-[#A8B1C1] font-mono block">
              {eraInfo.badge}
            </span>
            <span className="text-sm font-semibold text-[#F3F4F6] font-mono">
              {eraInfo.year}
            </span>
          </div>
        </div>

        {probability !== undefined && (
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-[#111827] border border-[#2A3B54] text-[#D6AE67]">
            {probability}%
          </span>
        )}
      </div>

      {/* SVG Thematic Scene Graphic */}
      <div className="w-full h-28 rounded-xl overflow-hidden mb-4 relative bg-[#0B1020] border border-[#2A3B54]/60 flex items-center justify-center">
        <svg viewBox="0 0 300 120" className="w-full h-full object-cover">
          <defs>
            <linearGradient id={`grad-${eraId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#111827" />
              <stop offset="100%" stopColor="#0B1020" />
            </linearGradient>
          </defs>
          <rect width="300" height="120" fill={`url(#grad-${eraId})`} />

          {eraId === 'victorian' && (
            <>
              {/* Victorian street lamp & silhouettes */}
              <circle cx="150" cy="50" r="38" fill="#D6AE67" opacity="0.18" />
              <path d="M 148 20 L 152 20 L 150 75 Z" fill="#D6AE67" opacity="0.7" />
              <line x1="144" y1="20" x2="156" y2="20" stroke="#D6AE67" strokeWidth="2" />
              <rect x="145" y="15" width="10" height="7" fill="#8C5E35" rx="1" />
              {/* Cobblestones */}
              <line x1="0" y1="95" x2="300" y2="95" stroke="#2A3B54" strokeWidth="1.5" />
              <circle cx="60" cy="105" r="4" fill="#182235" />
              <circle cx="120" cy="108" r="5" fill="#182235" />
              <circle cx="180" cy="104" r="4" fill="#182235" />
              <circle cx="240" cy="107" r="5" fill="#182235" />
            </>
          )}

          {eraId === 'modern' && (
            <>
              {/* City skyscrapers with neon dots */}
              <rect x="40" y="30" width="40" height="90" fill="#182235" />
              <rect x="90" y="20" width="55" height="100" fill="#202C40" />
              <rect x="155" y="45" width="45" height="75" fill="#182235" />
              <rect x="210" y="15" width="50" height="105" fill="#1E293B" />
              {/* Glowing windows */}
              <line x1="100" y1="35" x2="135" y2="35" stroke="#38BDF8" strokeWidth="2" opacity="0.7" />
              <line x1="100" y1="50" x2="135" y2="50" stroke="#38BDF8" strokeWidth="2" opacity="0.7" />
              <line x1="220" y1="30" x2="250" y2="30" stroke="#D6AE67" strokeWidth="2" opacity="0.7" />
            </>
          )}

          {eraId === 'future' && (
            <>
              {/* Cyber grid & planetary ring */}
              <ellipse cx="150" cy="60" rx="90" ry="25" stroke="#06B6D4" strokeWidth="1.5" fill="none" opacity="0.5" />
              <circle cx="150" cy="60" r="28" fill="#182235" stroke="#06B6D4" strokeWidth="1.5" />
              <line x1="30" y1="105" x2="270" y2="105" stroke="#06B6D4" strokeWidth="1" strokeDasharray="6,4" opacity="0.6" />
            </>
          )}
        </svg>
      </div>

      {/* Title & Description */}
      <h3 className="text-base font-bold text-[#F3F4F6] mb-1.5 font-serif">
        {eraInfo.data.title}
      </h3>
      <p className="text-xs text-[#A8B1C1] leading-relaxed line-clamp-3">
        {eraInfo.data.desc}
      </p>
    </div>
  );
};
