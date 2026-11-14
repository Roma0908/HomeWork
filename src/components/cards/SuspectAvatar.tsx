import React, { useState } from 'react';
import { Suspect } from '../../game/types.ts';
import { PORTRAIT_LIBRARY } from '../../game/characterPortraits.ts';
import { User } from 'lucide-react';

interface SuspectAvatarProps {
  suspect: Suspect;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  showBadge?: boolean;
}

export const SuspectAvatar: React.FC<SuspectAvatarProps> = ({
  suspect,
  size = 'md',
  className = '',
  showBadge = false,
}) => {
  const [imgError, setImgError] = useState(false);

  // Look up image source from suspect or portrait library
  const imageSrc =
    suspect.portraitSrc ||
    (suspect.portraitId && PORTRAIT_LIBRARY[suspect.portraitId]?.imageSrc);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
    '2xl': 'w-44 h-44',
    full: 'w-full h-full min-h-[160px]',
  }[size];

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-[#111827] border border-[#2A3B54] shrink-0 shadow-lg group select-none ${sizeClasses} ${className}`}
    >
      {imageSrc && !imgError ? (
        <img
          src={imageSrc}
          alt={suspect.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        /* Neutral dignified detective silhouette fallback (no geometric cartoon faces) */
        <div className="w-full h-full bg-gradient-to-b from-[#182235] to-[#0B1020] flex flex-col items-center justify-center text-[#A8B1C1]/50 p-2">
          <User className="w-1/2 h-1/2 stroke-1 text-[#D6AE67]/60" />
          <span className="text-[9px] font-mono tracking-widest uppercase text-[#A8B1C1]/40 mt-1">
            DOSSIER
          </span>
        </div>
      )}

      {/* Subtle bottom vignette gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020]/40 via-transparent to-transparent pointer-events-none" />

      {/* Status indicator badge */}
      {showBadge && (
        <div className="absolute bottom-1 right-1">
          {suspect.challengedWithEvidence ? (
            <span
              className="w-2.5 h-2.5 rounded-full bg-amber-400 block ring-2 ring-[#0B1020]"
              title="Challenged with evidence"
            />
          ) : suspect.interrogatedCount > 0 ? (
            <span
              className="w-2.5 h-2.5 rounded-full bg-[#6C94C5] block ring-2 ring-[#0B1020]"
              title="Interviewed"
            />
          ) : null}
        </div>
      )}
    </div>
  );
};
