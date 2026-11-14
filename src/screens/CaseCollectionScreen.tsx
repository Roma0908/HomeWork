import React, { useState } from 'react';
import { CompletedCase } from '../game/types.ts';
import { useTranslation } from '../localization/LocalizationContext.tsx';
import { sound } from '../utils/audio.ts';
import {
  FolderArchive,
  Trophy,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Play,
  Copy,
  Check,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface CaseCollectionScreenProps {
  completedCases: CompletedCase[];
  onStartNewCase: () => void;
  onGoBack: () => void;
  onDeleteCase: (caseId: string) => void;
  onClearCollection: () => void;
}

export const CaseCollectionScreen: React.FC<CaseCollectionScreenProps> = ({
  completedCases,
  onStartNewCase,
  onGoBack,
  onDeleteCase,
  onClearCollection,
}) => {
  const { language, t } = useTranslation();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleCopySeed = (seed: string, id: string) => {
    sound.playClick();
    navigator.clipboard.writeText(seed);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A3B54] pb-6">
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
            {t.collection.title}
          </h1>
          <p className="text-sm text-[#A8B1C1] mt-1">
            {t.collection.subtitle} ({completedCases.length} / 50)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {completedCases.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-2 text-xs font-semibold text-rose-400 hover:text-white bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/40 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.collection.clearAllBtn}</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onStartNewCase();
            }}
            className="px-5 py-2.5 text-xs font-bold text-[#0B1020] bg-[#D6AE67] hover:bg-[#E4C589] rounded-xl transition-colors flex items-center gap-2 shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{t.home.newCaseBtn}</span>
          </button>
        </div>
      </div>

      {/* Confirmation modal for clearing entire collection */}
      {showClearConfirm && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2 text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{t.collection.clearConfirm}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                sound.playClick();
                onClearCollection();
                setShowClearConfirm(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
            >
              {language === 'kk' ? 'Иә, барлығын жою' : 'Yes, clear all'}
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 rounded-lg bg-[#111827] text-[#A8B1C1] hover:text-[#F3F4F6]"
            >
              {t.common.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Case List */}
      {completedCases.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-4">
          <FolderArchive className="w-12 h-12 text-[#A8B1C1] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-[#F3F4F6]">
            {t.collection.empty}
          </h3>
          <p className="text-xs text-[#A8B1C1] max-w-sm mx-auto">
            {language === 'kk'
              ? 'Аяқталған әрбір тергеу осы мұрағатқа мәңгілікке жазылады.'
              : 'Every completed investigation is preserved permanently in this registry.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedCases.map((item) => {
            const dateStr = new Date(item.solvedAt).toLocaleDateString();
            const isCopied = copiedId === item.caseId;

            return (
              <div
                key={item.caseId}
                className="p-5 rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-3 flex flex-col justify-between hover:border-[#6C94C5]/60 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-[#D6AE67] uppercase font-bold">
                      {item.caseId}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                          item.outcome === 'correct'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                            : item.outcome === 'partial'
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        {item.outcome === 'correct' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            {language === 'kk' ? 'Мінсіз шешілді' : 'Perfect Solution'}
                          </>
                        ) : item.outcome === 'partial' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            {language === 'kk' ? 'Жартылай шешілді' : 'Partial Match'}
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            {language === 'kk' ? 'Қате айыптау' : 'Failed'}
                          </>
                        )}
                      </span>

                      <button
                        onClick={() => {
                          sound.playClick();
                          onDeleteCase(item.caseId);
                        }}
                        className="text-[#A8B1C1] hover:text-rose-400 p-1 transition-colors"
                        title="Delete from archive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[#F3F4F6] font-serif">
                    {item.title}
                  </h3>
                  <span className="text-xs text-[#A8B1C1] block mt-1">
                    {item.crimeCategory} · {item.culpritName ? `Culprit: ${item.culpritName}` : ''}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#2A3B54] flex flex-wrap items-center justify-between gap-2 text-xs text-[#A8B1C1] font-mono">
                  <span>
                    Era: <strong className="text-[#F3F4F6] capitalize">{item.era}</strong>
                  </span>
                  <span>
                    Score: <strong className="text-[#D6AE67]">{item.score}</strong>
                  </span>
                  <button
                    onClick={() => handleCopySeed(item.caseSeed, item.caseId)}
                    className="hover:text-[#F3F4F6] flex items-center gap-1 text-[11px]"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copied' : item.caseSeed}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
