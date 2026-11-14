import React from 'react';
import { useTranslation } from '../localization/LocalizationContext.tsx';
import { sound } from '../utils/audio.ts';
import { BookOpen, Search, MessageSquare, Brain, ShieldAlert, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface HowToPlayScreenProps {
  onGoBack: () => void;
  onStartNewCase: () => void;
}

export const HowToPlayScreen: React.FC<HowToPlayScreenProps> = ({
  onGoBack,
  onStartNewCase,
}) => {
  const { language, t } = useTranslation();

  const steps = [
    {
      num: "01",
      icon: Search,
      title: t.howToPlay.step1Title,
      desc: t.howToPlay.step1Desc,
      tag: "Scene Examination",
    },
    {
      num: "02",
      icon: MessageSquare,
      title: t.howToPlay.step2Title,
      desc: t.howToPlay.step2Desc,
      tag: "Interrogation Tactics",
    },
    {
      num: "03",
      icon: Brain,
      title: t.howToPlay.step3Title,
      desc: t.howToPlay.step3Desc,
      tag: "AI Laboratory Inference",
    },
    {
      num: "04",
      icon: ShieldAlert,
      title: t.howToPlay.step4Title,
      desc: t.howToPlay.step4Desc,
      tag: "Final Accusation",
    },
  ];

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
            {t.howToPlay.title}
          </h1>
          <p className="text-sm text-[#A8B1C1] mt-1">
            {t.howToPlay.subtitle}
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onStartNewCase();
          }}
          className="px-5 py-2.5 text-xs font-bold text-[#0B1020] bg-[#D6AE67] hover:bg-[#E4C589] rounded-xl transition-colors shrink-0"
        >
          {t.home.newCaseBtn}
        </button>
      </div>

      {/* 4 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.num}
              className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#111827] border border-[#D6AE67]/40 flex items-center justify-center text-[#D6AE67]">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold font-mono text-[#2A3B54]">
                  {st.num}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#D6AE67] block mb-1">
                  {st.tag}
                </span>
                <h3 className="text-base font-bold text-[#F3F4F6] font-serif mb-2">
                  {st.title}
                </h3>
                <p className="text-xs text-[#A8B1C1] leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Educational AI Overview */}
      <div className="p-6 rounded-2xl bg-[#182235] border border-[#6C94C5]/40 space-y-3">
        <h3 className="text-sm font-bold text-[#6C94C5] font-serif uppercase tracking-wider flex items-center gap-2">
          <Brain className="w-4 h-4 text-[#D6AE67]" />
          <span>The AI Laboratory: 3 Real Mathematical Models</span>
        </h3>
        <p className="text-xs text-[#A8B1C1] leading-relaxed">
          {language === 'kk'
            ? 'CASEVERSE ойынында жасанды интеллект нәтижелері ойдан шығарылмаған. Байес формуласы айғақтарды нақты есептейді, HMM Витерби бөлмелер арасындағы қадамдарды динамикалық бағдарламалау арқылы тексереді, ал Minimax детектив сұрақтарының ұтымдылығын бағалайды.'
            : 'In CASEVERSE, AI results are not hallucinated mockups. Real Bayesian networks compute posterior guilt distributions, Hidden Markov Models decode the Viterbi trellis path across rooms, and Minimax explores adversarial interrogation payoffs.'}
        </p>
      </div>
    </div>
  );
};
