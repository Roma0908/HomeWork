import React, { useState } from 'react';
import { useTranslation, Language } from '../../localization/LocalizationContext.tsx';
import { sound } from '../../utils/audio.ts';
import { Volume2, VolumeX, ShieldAlert, Sparkles, Menu, X } from 'lucide-react';

export type ScreenId =
  | 'home'
  | 'probability'
  | 'reveal'
  | 'investigation'
  | 'evidence'
  | 'aiLab'
  | 'report'
  | 'collection'
  | 'howToPlay'
  | 'settings';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  hasActiveCase: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  hasActiveCase,
  soundEnabled,
  onToggleSound,
}) => {
  const { language, setLanguage, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (screen: ScreenId) => {
    sound.playClick();
    setMobileMenuOpen(false);
    onNavigate(screen);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B1020]/95 backdrop-blur-md border-b border-[#2A3B54]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single Text Element Brand Wordmark */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6AE67] rounded-lg"
        >
          <div className="w-8 h-8 rounded-lg bg-[#182235] border border-[#D6AE67]/40 flex items-center justify-center text-[#D6AE67] group-hover:border-[#D6AE67] transition-colors">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#F3F4F6] font-serif whitespace-nowrap shrink-0 group-hover:text-[#D6AE67] transition-colors">
            {t.brand.name}
          </span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#A8B1C1]">
          <button
            onClick={() => handleNav('home')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#F3F4F6] py-1 ${
              currentScreen === 'home' ? 'text-[#D6AE67] font-semibold border-b-2 border-[#D6AE67]' : ''
            }`}
          >
            {t.nav.home}
          </button>

          {hasActiveCase && (
            <button
              onClick={() => handleNav('investigation')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#F3F4F6] py-1 ${
                currentScreen === 'investigation' ? 'text-[#D6AE67] font-semibold border-b-2 border-[#D6AE67]' : ''
              }`}
            >
              {t.nav.investigation}
            </button>
          )}

          {hasActiveCase && (
            <button
              onClick={() => handleNav('evidence')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#F3F4F6] py-1 ${
                currentScreen === 'evidence' ? 'text-[#D6AE67] font-semibold border-b-2 border-[#D6AE67]' : ''
              }`}
            >
              {t.nav.evidence}
            </button>
          )}

          <button
            onClick={() => handleNav('aiLab')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#F3F4F6] py-1 ${
              currentScreen === 'aiLab' ? 'text-[#D6AE67] font-semibold border-b-2 border-[#D6AE67]' : ''
            }`}
          >
            {t.nav.aiLab}
          </button>

          <button
            onClick={() => handleNav('collection')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#F3F4F6] py-1 ${
              currentScreen === 'collection' ? 'text-[#D6AE67] font-semibold border-b-2 border-[#D6AE67]' : ''
            }`}
          >
            {t.nav.collection}
          </button>

          <button
            onClick={() => handleNav('howToPlay')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#F3F4F6] py-1 ${
              currentScreen === 'howToPlay' ? 'text-[#D6AE67] font-semibold border-b-2 border-[#D6AE67]' : ''
            }`}
          >
            {t.nav.howToPlay}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action group (Sound, Language switcher & Settings) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            aria-label="Toggle Sound"
            className="w-9 h-9 rounded-lg bg-[#182235] border border-[#2A3B54] flex items-center justify-center text-[#A8B1C1] hover:text-[#F3F4F6] hover:border-[#D6AE67]/50 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#D6AE67]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-[#182235] border border-[#2A3B54] rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => {
                sound.playClick();
                setLanguage('kk');
              }}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                language === 'kk'
                  ? 'bg-[#D6AE67] text-[#0B1020]'
                  : 'text-[#A8B1C1] hover:text-[#F3F4F6]'
              }`}
            >
              ҚАЗ
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setLanguage('en');
              }}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                language === 'en'
                  ? 'bg-[#D6AE67] text-[#0B1020]'
                  : 'text-[#A8B1C1] hover:text-[#F3F4F6]'
              }`}
            >
              ENG
            </button>
          </div>

          {/* Settings or New Case shortcut */}
          <button
            onClick={() => handleNav('settings')}
            className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-[#F3F4F6] bg-[#182235] border border-[#2A3B54] rounded-lg hover:border-[#D6AE67] transition-colors whitespace-nowrap shrink-0"
          >
            {t.nav.settings}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Toggle mobile navigation menu"
            className="md:hidden w-9 h-9 rounded-lg bg-[#182235] border border-[#2A3B54] flex items-center justify-center text-[#A8B1C1] hover:text-[#F3F4F6] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#2A3B54] bg-[#0B1020]/98 px-4 py-4 space-y-2 animate-fadeIn shadow-2xl">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentScreen === 'home'
                ? 'bg-[#182235] text-[#D6AE67] font-semibold'
                : 'text-[#A8B1C1] hover:text-[#F3F4F6] hover:bg-[#182235]/50'
            }`}
          >
            {t.nav.home}
          </button>

          {hasActiveCase && (
            <button
              onClick={() => handleNav('investigation')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentScreen === 'investigation'
                  ? 'bg-[#182235] text-[#D6AE67] font-semibold'
                  : 'text-[#A8B1C1] hover:text-[#F3F4F6] hover:bg-[#182235]/50'
              }`}
            >
              {t.nav.investigation}
            </button>
          )}

          {hasActiveCase && (
            <button
              onClick={() => handleNav('evidence')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentScreen === 'evidence'
                  ? 'bg-[#182235] text-[#D6AE67] font-semibold'
                  : 'text-[#A8B1C1] hover:text-[#F3F4F6] hover:bg-[#182235]/50'
              }`}
            >
              {t.nav.evidence}
            </button>
          )}

          <button
            onClick={() => handleNav('aiLab')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentScreen === 'aiLab'
                ? 'bg-[#182235] text-[#D6AE67] font-semibold'
                : 'text-[#A8B1C1] hover:text-[#F3F4F6] hover:bg-[#182235]/50'
            }`}
          >
            {t.nav.aiLab}
          </button>

          <button
            onClick={() => handleNav('collection')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentScreen === 'collection'
                ? 'bg-[#182235] text-[#D6AE67] font-semibold'
                : 'text-[#A8B1C1] hover:text-[#F3F4F6] hover:bg-[#182235]/50'
            }`}
          >
            {t.nav.collection}
          </button>

          <button
            onClick={() => handleNav('howToPlay')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentScreen === 'howToPlay'
                ? 'bg-[#182235] text-[#D6AE67] font-semibold'
                : 'text-[#A8B1C1] hover:text-[#F3F4F6] hover:bg-[#182235]/50'
            }`}
          >
            {t.nav.howToPlay}
          </button>

          <button
            onClick={() => handleNav('settings')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentScreen === 'settings'
                ? 'bg-[#182235] text-[#D6AE67] font-semibold'
                : 'text-[#A8B1C1] hover:text-[#F3F4F6] hover:bg-[#182235]/50'
            }`}
          >
            {t.nav.settings}
          </button>
        </div>
      )}
    </header>
  );
};
