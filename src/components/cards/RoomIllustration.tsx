import React from 'react';
import { Room, Hotspot } from '../../game/types.ts';
import { sound } from '../../utils/audio.ts';
import { Search, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../localization/LocalizationContext.tsx';

interface RoomIllustrationProps {
  room: Room;
  onInspectHotspot: (spot: Hotspot) => void;
}

export const RoomIllustration: React.FC<RoomIllustrationProps> = ({ room, onInspectHotspot }) => {
  const { language } = useTranslation();

  return (
    <div className="relative w-full aspect-video max-h-[440px] rounded-2xl overflow-hidden border border-[#2A3B54] bg-[#0B1020] shadow-2xl select-none group">
      {/* Dynamic Thematic 2D SVG Illustration */}
      <svg viewBox="0 0 800 450" className="w-full h-full object-cover">
        <defs>
          <linearGradient id={`room-grad-${room.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B1020" />
            <stop offset="60%" stopColor={room.themeColor} stopOpacity="0.45" />
            <stop offset="100%" stopColor="#070a14" />
          </linearGradient>

          {/* Era-specific ambient lighting */}
          {room.era === 'victorian' && (
            <radialGradient id="lamp-glow" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#D6AE67" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0B1020" stopOpacity="0" />
            </radialGradient>
          )}
          {room.era === 'modern' && (
            <linearGradient id="neon-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6C94C5" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6C94C5" stopOpacity="0.15" />
            </linearGradient>
          )}
          {room.era === 'future' && (
            <radialGradient id="holo-glow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#0B1020" stopOpacity="0" />
            </radialGradient>
          )}
        </defs>

        {/* Room Base Wall & Flooring */}
        <rect width="800" height="450" fill={`url(#room-grad-${room.id})`} />

        {/* Floor perspective plane */}
        <polygon points="0,320 800,320 800,450 0,450" fill="#090E1A" opacity="0.9" />
        <line x1="0" y1="320" x2="800" y2="320" stroke="#2A3B54" strokeWidth="2" opacity="0.6" />

        {/* Ambient Era Light overlay */}
        {room.era === 'victorian' && (
          <>
            <circle cx="400" cy="120" r="280" fill="url(#lamp-glow)" />
            {/* Victorian chandelier & paneling */}
            <path d="M 380 0 L 420 0 L 400 80 Z" fill="#D6AE67" opacity="0.4" />
            <ellipse cx="400" cy="85" rx="35" ry="12" fill="#D6AE67" opacity="0.6" />
            {/* Wall wainscoting */}
            <line x1="120" y1="120" x2="120" y2="320" stroke="#3A2514" strokeWidth="3" opacity="0.5" />
            <line x1="280" y1="100" x2="280" y2="320" stroke="#3A2514" strokeWidth="3" opacity="0.5" />
            <line x1="520" y1="100" x2="520" y2="320" stroke="#3A2514" strokeWidth="3" opacity="0.5" />
            <line x1="680" y1="120" x2="680" y2="320" stroke="#3A2514" strokeWidth="3" opacity="0.5" />
          </>
        )}

        {room.era === 'modern' && (
          <>
            <rect x="0" y="40" width="800" height="180" fill="url(#neon-glow)" />
            {/* Skyline Window Panes */}
            <rect x="150" y="50" width="140" height="230" fill="#0F172A" stroke="#2A3B54" strokeWidth="2" rx="4" opacity="0.8" />
            <rect x="330" y="40" width="140" height="240" fill="#0F172A" stroke="#2A3B54" strokeWidth="2" rx="4" opacity="0.8" />
            <rect x="510" y="50" width="140" height="230" fill="#0F172A" stroke="#2A3B54" strokeWidth="2" rx="4" opacity="0.8" />
            {/* City lights in background */}
            <circle cx="180" cy="120" r="2" fill="#FDE047" opacity="0.7" />
            <circle cx="210" cy="180" r="2" fill="#FDE047" opacity="0.5" />
            <circle cx="360" cy="100" r="2" fill="#38BDF8" opacity="0.8" />
            <circle cx="420" cy="150" r="2" fill="#FDE047" opacity="0.6" />
            <circle cx="560" cy="110" r="2" fill="#38BDF8" opacity="0.7" />
          </>
        )}

        {room.era === 'future' && (
          <>
            <circle cx="400" cy="200" r="320" fill="url(#holo-glow)" />
            {/* Holographic grid lines */}
            <line x1="0" y1="100" x2="800" y2="100" stroke="#06B6D4" strokeWidth="1" strokeDasharray="6,6" opacity="0.3" />
            <line x1="0" y1="200" x2="800" y2="200" stroke="#06B6D4" strokeWidth="1" strokeDasharray="6,6" opacity="0.3" />
            <circle cx="400" cy="180" r="80" stroke="#06B6D4" strokeWidth="1.5" fill="none" opacity="0.4" strokeDasharray="4,8" />
            <circle cx="400" cy="180" r="130" stroke="#3B82F6" strokeWidth="1" fill="none" opacity="0.25" />
          </>
        )}

        {/* Scene Props/Furniture Silhouettes */}
        <rect x="80" y="270" width="140" height="90" rx="6" fill="#141E30" opacity="0.8" />
        <rect x="580" y="260" width="150" height="100" rx="6" fill="#141E30" opacity="0.8" />
      </svg>

      {/* Atmospheric vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0B1020] via-transparent to-transparent opacity-60" />

      {/* Room Badge in corner */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111827]/90 backdrop-blur-md border border-[#2A3B54] text-xs text-[#F3F4F6]">
        <span className="font-semibold">{room.name[language]}</span>
        <span className="text-[#A8B1C1]">·</span>
        <span className="text-[#A8B1C1] font-mono text-[11px]">
          {room.hotspots.filter((h) => h.inspected).length}/{room.hotspots.length} {language === 'kk' ? 'тексерілді' : 'searched'}
        </span>
      </div>

      {/* Interactive Hotspots */}
      {room.hotspots.map((spot) => (
        <button
          key={spot.id}
          type="button"
          onClick={() => {
            sound.playInspect();
            onInspectHotspot(spot);
          }}
          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          aria-label={spot.label[language]}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/spot focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6AE67]"
        >
          <div className="relative flex items-center justify-center">
            {/* Pulsing radar ring if uninspected */}
            {!spot.inspected && (
              <span className="absolute w-10 h-10 rounded-full bg-[#D6AE67]/20 animate-ping" />
            )}

            {/* Hotspot core button */}
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 shadow-lg ${
                spot.inspected
                  ? 'bg-[#182235]/90 border-[#6C94C5] text-[#6C94C5]'
                  : 'bg-[#D6AE67] text-[#0B1020] border-[#E4C589] hover:scale-110 hover:shadow-[#D6AE67]/30'
              }`}
            >
              {spot.inspected ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Search className="w-4 h-4 stroke-[2.5]" />
              )}
            </div>

            {/* Tooltip Label */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded bg-[#111827]/95 border border-[#2A3B54] text-[11px] font-medium text-[#F3F4F6] shadow-xl opacity-0 group-hover/spot:opacity-100 transition-opacity pointer-events-none">
              {spot.label[language]}
              {spot.inspected && (
                <span className="text-[#6C94C5] ml-1">✓</span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
