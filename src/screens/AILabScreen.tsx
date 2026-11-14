import React, { useState } from 'react';
import { GeneratedCase, Suspect, InvestigationState } from '../game/types.ts';
import { useTranslation } from '../localization/LocalizationContext.tsx';
import { runMinimaxAdversarialSearch } from '../algorithms/minimax.ts';
import { calculateBayesianNetwork } from '../algorithms/bayesianNetwork.ts';
import { calculateHMMViterbi } from '../algorithms/hmmViterbi.ts';
import { SuspectAvatar } from '../components/cards/SuspectAvatar.tsx';
import { sound } from '../utils/audio.ts';
import {
  Brain,
  Network,
  GitCommit,
  GitBranch,
  ArrowRight,
  Code2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';

interface AILabScreenProps {
  activeCase: GeneratedCase | null;
  investigationState?: InvestigationState | null;
  onReturnToInvestigation?: () => void;
  onStartNewCase?: () => void;
}

export const AILabScreen: React.FC<AILabScreenProps> = ({
  activeCase,
  investigationState,
  onReturnToInvestigation,
  onStartNewCase,
}) => {
  const { language, t } = useTranslation();
  const [activeModule, setActiveModule] = useState<'minimax' | 'bayesian' | 'hmm'>('minimax');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>(
    activeCase?.suspects[0]?.id || 'suspect_0'
  );

  if (!activeCase) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
        <Brain className="w-16 h-16 text-[#6C94C5] mx-auto opacity-70" />
        <h2 className="text-2xl font-bold text-[#F3F4F6] font-serif">
          {t.aiLab.title}
        </h2>
        <p className="text-sm text-[#A8B1C1] max-w-md mx-auto">
          {language === 'kk'
            ? 'Алгоритмдер нақты деректермен есептелуі үшін алдымен жаңа істі бастаңыз.'
            : 'Start a new investigation to explore the algorithms with live game data.'}
        </p>
        {onStartNewCase && (
          <button
            onClick={() => {
              sound.playClick();
              onStartNewCase();
            }}
            className="px-6 py-3 text-sm font-bold text-[#0B1020] bg-[#D6AE67] hover:bg-[#E4C589] rounded-xl shadow-lg shadow-[#D6AE67]/20 transition-all inline-flex items-center gap-2"
          >
            <span>{t.home.newCaseBtn}</span>
          </button>
        )}
      </div>
    );
  }

  const discoveredEvidence = activeCase.evidenceList.filter((e) => e.discovered);
  const discoveredEvidenceIds = discoveredEvidence.map((e) => e.id);
  const targetSuspect =
    activeCase.suspects.find((s) => s.id === selectedSuspectId) || activeCase.suspects[0];

  // Execution of real algorithms on active case data
  const currentInvState = investigationState || {
    activeCase,
    currentRoomId: activeCase.rooms[0].id,
    investigationProgress: 20,
    actionPointsUsed: 3,
    hintsUsed: 0,
    currentHintLevel: 1,
    dangerMeter: 0,
    crisisDecisionsTaken: [],
    accusedSuspectId: null,
    accusationOutcome: null,
    isSolved: false,
    isGameOver: false,
    investigationLog: [],
  };

  const minimaxResult = runMinimaxAdversarialSearch(activeCase, currentInvState, targetSuspect);
  const bayesianResult = calculateBayesianNetwork(
    activeCase.suspects,
    activeCase.evidenceList,
    discoveredEvidenceIds
  );
  const viterbiResult = calculateHMMViterbi(
    targetSuspect.id,
    activeCase.suspects,
    activeCase.rooms,
    activeCase.timeline,
    discoveredEvidence
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A3B54] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-[#D6AE67] uppercase tracking-wider">
              {t.aiLab.title}
            </span>
            <span className="text-[#A8B1C1]">·</span>
            <span className="text-xs font-mono text-[#A8B1C1]">{activeCase.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F3F4F6] font-serif">
            {t.aiLab.title}
          </h1>
          <p className="text-sm text-[#A8B1C1] mt-1">
            {t.aiLab.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              setShowTechnicalDetails(!showTechnicalDetails);
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors flex items-center gap-1.5 ${
              showTechnicalDetails
                ? 'bg-[#D6AE67] text-[#0B1020] border-[#E4C589] font-bold'
                : 'bg-[#182235] text-[#A8B1C1] border-[#2A3B54] hover:text-[#F3F4F6]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{showTechnicalDetails ? t.aiLab.techToggleHide : t.aiLab.techToggleShow}</span>
          </button>

          {onReturnToInvestigation && (
            <button
              onClick={() => {
                sound.playClick();
                onReturnToInvestigation();
              }}
              className="px-4 py-2 text-xs font-semibold text-[#0B1020] bg-[#D6AE67] hover:bg-[#E4C589] rounded-lg transition-colors"
            >
              {t.nav.backToGame}
            </button>
          )}
        </div>
      </div>

      {/* Module Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#111827] rounded-2xl border border-[#2A3B54] overflow-x-auto">
        <button
          onClick={() => {
            sound.playClick();
            setActiveModule('minimax');
          }}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
            activeModule === 'minimax'
              ? 'bg-[#182235] text-[#D6AE67] border border-[#D6AE67]/40 shadow-sm'
              : 'text-[#A8B1C1] hover:text-[#F3F4F6]'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>{t.aiLab.modules.minimax}</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveModule('bayesian');
          }}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
            activeModule === 'bayesian'
              ? 'bg-[#182235] text-[#D6AE67] border border-[#D6AE67]/40 shadow-sm'
              : 'text-[#A8B1C1] hover:text-[#F3F4F6]'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>{t.aiLab.modules.bayesian}</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveModule('hmm');
          }}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
            activeModule === 'hmm'
              ? 'bg-[#182235] text-[#D6AE67] border border-[#D6AE67]/40 shadow-sm'
              : 'text-[#A8B1C1] hover:text-[#F3F4F6]'
          }`}
        >
          <GitCommit className="w-4 h-4" />
          <span>{t.aiLab.modules.hmm}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODULE 01: MINIMAX + ALPHA-BETA PRUNING (WEEK 4)                         */}
      {/* ========================================================================= */}
      {activeModule === 'minimax' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Section A: What is it? */}
          <div className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-3">
            <h2 className="text-base font-bold text-[#D6AE67] font-serif flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              <span>{t.aiLab.sections.whatIsIt}</span>
            </h2>
            <p className="text-xs text-[#F3F4F6] leading-relaxed">
              {language === 'kk'
                ? 'Minimax — шахмат сияқты екі қарсылас ойыншының стратегиялық әрекеттерін есептейтін классикалық алгоритм. CASEVERSE ойынында Детектив (MAX) барынша көп дәлел тауып, шындықты ашуға тырысады, ал Қылмыскер (MIN) тергеуді бәсеңдету немесе айғақтарды жасыру арқылы детектив пайдасын азайтуға ұмтылады.'
                : 'Minimax is a classic game-theoretic algorithm for two-player zero-sum games like chess. In CASEVERSE, the Detective (MAX) seeks to maximize evidence progress and contradiction exposure, while the Culprit (MIN) attempts to minimize detective utility by concealing optional clues, reinforcing alibis, or stalling.'}
            </p>
            <div className="p-3 rounded-xl bg-[#111827] text-xs text-[#A8B1C1] italic">
              {language === 'kk'
                ? 'Күнделікті аналогия: Шахматта сіз қарсыласыңыздың ең жақсы жауап беретінін біле отырып қадам жасайсыз. Детектив те қылмыскердің қорғаныс әрекетін алдын ала есептейді.'
                : 'Everyday analogy: In chess, you plan your best offensive move assuming your opponent will play their sharpest counter-move. The detective plans actions by anticipating the culprit’s evasions.'}
            </div>
          </div>

          {/* Section B: How it works? */}
          <div className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-4">
            <h2 className="text-base font-bold text-[#F3F4F6] font-serif">
              {t.aiLab.sections.howItWorks}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#111827] border border-[#2A3B54] space-y-1.5">
                <span className="font-mono text-[#D6AE67] font-bold">01. Ағаш құру (Tree Depth 3)</span>
                <p className="text-[#A8B1C1]">
                  Детектив пен Қылмыскердің барлық мүмкін қадамдары 3 деңгей тереңдікке дейін модельденеді.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#111827] border border-[#2A3B54] space-y-1.5">
                <span className="font-mono text-[#D6AE67] font-bold">02. Пайданы бағалау (Utility)</span>
                <p className="text-[#A8B1C1]">
                  Табылған негізгі айғақтар (+40), ашылған қайшылықтар (+35) және қауіп айыппұлдары есептеледі.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#111827] border border-[#2A3B54] space-y-1.5">
                <span className="font-mono text-[#D6AE67] font-bold">03. Alpha-Beta қысқарту</span>
                <p className="text-[#A8B1C1]">
                  Егер β ≤ α болса, қалған бұтақтар тоқтатылып, есептеу жылдамдығы 2-3 есе жеделдейді.
                </p>
              </div>
            </div>
          </div>

          {/* Section C: Live Game Example & Target Suspect Selector */}
          <div className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-base font-bold text-[#F3F4F6] font-serif">
                {t.aiLab.sections.liveExample}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#A8B1C1]">Suspect Target:</span>
                {activeCase.suspects.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedSuspectId(s.id);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                      selectedSuspectId === s.id
                        ? 'bg-[#D6AE67] text-[#0B1020]'
                        : 'bg-[#111827] text-[#A8B1C1] border border-[#2A3B54]'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Performance telemetry stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#111827] border border-[#2A3B54]">
                <span className="text-[#A8B1C1] block text-[10px]">Explored Nodes</span>
                <span className="text-sm font-bold text-[#D6AE67]">{minimaxResult.totalExploredNodes}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#111827] border border-[#2A3B54]">
                <span className="text-[#A8B1C1] block text-[10px]">Pruned Branches (α-β)</span>
                <span className="text-sm font-bold text-rose-400">{minimaxResult.totalPrunedNodes}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#111827] border border-[#2A3B54]">
                <span className="text-[#A8B1C1] block text-[10px]">Optimal Utility Payoff</span>
                <span className="text-sm font-bold text-emerald-400">+{minimaxResult.optimalUtility} pts</span>
              </div>
              <div className="p-3 rounded-xl bg-[#111827] border border-[#2A3B54]">
                <span className="text-[#A8B1C1] block text-[10px]">Execution Time</span>
                <span className="text-sm font-bold text-[#6C94C5]">{minimaxResult.executionTimeMs} ms</span>
              </div>
            </div>

            {/* Visual Decision Tree Diagram */}
            <div className="p-4 rounded-xl bg-[#111827] border border-[#2A3B54] space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#A8B1C1] block">
                Adversarial Search Tree (Depth 1 & 2 Branches):
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {minimaxResult.rootNode.children?.map((branch) => (
                  <div
                    key={branch.id}
                    className={`p-3.5 rounded-xl border transition-all text-xs ${
                      branch.isBest
                        ? 'bg-[#182235] border-[#D6AE67] ring-1 ring-[#D6AE67]'
                        : branch.isPruned
                        ? 'bg-[#111827]/40 border-dashed border-[#2A3B54] opacity-50'
                        : 'bg-[#111827] border-[#2A3B54]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#F3F4F6]">{branch.actionLabel[language]}</span>
                      <span className="font-mono text-[#D6AE67]">
                        {branch.isPruned ? 'PRUNED' : `Score: ${branch.score}`}
                      </span>
                    </div>

                    {!branch.isPruned && branch.children && (
                      <div className="pt-2 border-t border-[#2A3B54] space-y-1 text-[11px] text-[#A8B1C1]">
                        {branch.children.map((child) => (
                          <div key={child.id} className="flex justify-between font-mono">
                            <span>↳ {child.actionLabel[language]}</span>
                            <span className={child.isPruned ? 'text-rose-400' : 'text-emerald-400'}>
                              {child.isPruned ? 'cutoff' : child.score}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section D: Result */}
          <div className="p-6 rounded-2xl bg-[#182235] border border-[#D6AE67]/40 space-y-3">
            <h2 className="text-base font-bold text-[#D6AE67] font-serif">
              {t.aiLab.sections.result}
            </h2>
            <p className="text-xs text-[#F3F4F6] leading-relaxed">
              {minimaxResult.explanation[language]}
            </p>
          </div>

          {/* Technical Details Collapsible */}
          {showTechnicalDetails && (
            <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#2A3B54] space-y-4 font-mono text-xs animate-fadeIn">
              <span className="text-[#D6AE67] font-bold block uppercase">
                Technical Specifications & Pseudocode (Week 4: Adversarial Search)
              </span>
              <pre className="p-4 rounded-xl bg-[#111827] overflow-x-auto text-[11px] text-[#A8B1C1] leading-relaxed">
{`function minimax(state, depth, isMaximizing, alpha, beta):
    if depth == 0 or isTerminal(state):
        return evaluate(state)

    if isMaximizing:
        maxEval = -Infinity
        for each action in legalDetectiveActions(state):
            eval = minimax(apply(state, action), depth - 1, false, alpha, beta)
            maxEval = max(maxEval, eval)
            alpha = max(alpha, eval)
            if beta <= alpha:
                break // Beta cutoff (Alpha-Beta Pruning)
        return maxEval
    else:
        minEval = +Infinity
        for each action in legalCulpritActions(state):
            eval = minimax(apply(state, action), depth - 1, true, alpha, beta)
            minEval = min(minEval, eval)
            beta = min(beta, eval)
            if beta <= alpha:
                break // Alpha cutoff
        return minEval`}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 02: BAYESIAN NETWORKS (WEEK 6)                                     */}
      {/* ========================================================================= */}
      {activeModule === 'bayesian' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Section A: What is it? */}
          <div className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-3">
            <h2 className="text-base font-bold text-[#D6AE67] font-serif flex items-center gap-2">
              <Network className="w-4 h-4" />
              <span>{t.aiLab.sections.whatIsIt}</span>
            </h2>
            <p className="text-xs text-[#F3F4F6] leading-relaxed">
              {language === 'kk'
                ? 'Байес желілері — кездейсоқ және толық емес ақпарат жағдайында ықтималдықты нақты есептейтін бағытталған ациклдік граф (DAG). CASEVERSE ойынында барлық 4 күдіктінің кінәлі болу бастапқы мүмкіндігі бірдей 25% құрайды. Ойыншы жаңа айғақ тапқан сайын шартты ықтималдық формуласы (P(A|B)) арқылы күдік пайызы нақты математикалық жолмен қайта есептеледі.'
                : 'Bayesian Networks represent probabilistic relationships among evidence variables via Directed Acyclic Graphs (DAGs). In CASEVERSE, each of the four suspects starts with a uniform prior of 25%. As forensic clues are discovered, exact Bayesian inference marginalizes over latent factor nodes to produce real posterior probability distributions.'}
            </p>
          </div>

          {/* Section B: How it works? */}
          <div className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-4">
            <h2 className="text-base font-bold text-[#F3F4F6] font-serif">
              {t.aiLab.sections.howItWorks}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#111827] border border-[#2A3B54] space-y-1.5">
                <span className="font-mono text-[#D6AE67] font-bold">01. Бастапқы теңдік (Prior)</span>
                <p className="text-[#A8B1C1]">
                  P(S₀) = P(S₁) = P(S₂) = P(S₃) = 0.25. Барлық күдіктілерге бірдей бастапқы баға беріледі.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#111827] border border-[#2A3B54] space-y-1.5">
                <span className="font-mono text-[#D6AE67] font-bold">02. Лаптикалық түйіндер (CPTs)</span>
                <p className="text-[#A8B1C1]">
                  Ниет, Қолжетімділік, Заттай із және Уақыт сәйкестігі бойынша шартты кестелер қолданылады.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#111827] border border-[#2A3B54] space-y-1.5">
                <span className="font-mono text-[#D6AE67] font-bold">03. Нормализация (Posterior)</span>
                <p className="text-[#A8B1C1]">
                  Айғақтар салмағы көбейтіліп, соңғы нәтиже 100%-ға теңестіріледі: ∑ P(Sᵢ|E) = 1.0.
                </p>
              </div>
            </div>
          </div>

          {/* Section C: Live Game Example */}
          <div className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-5">
            <h2 className="text-base font-bold text-[#F3F4F6] font-serif">
              {t.aiLab.sections.liveExample}
            </h2>

            {/* Suspect Probability Comparison Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bayesianResult.results.map((res) => {
                const s = activeCase.suspects.find((item) => item.id === res.suspectId)!;
                const isPeak = res.suspectId === bayesianResult.mostLikelySuspectId;

                return (
                  <div
                    key={res.suspectId}
                    className={`p-4 rounded-xl border transition-all ${
                      isPeak
                        ? 'bg-[#182235] border-[#D6AE67] ring-1 ring-[#D6AE67]'
                        : 'bg-[#111827] border-[#2A3B54]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <SuspectAvatar suspect={s} size="sm" />
                        <div>
                          <span className="text-xs font-bold text-[#F3F4F6] block">{s.name}</span>
                          <span className="text-[11px] text-[#A8B1C1]">{s.profession[language]}</span>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-base font-bold text-[#D6AE67]">
                          {(res.posteriorProbability * 100).toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-[#A8B1C1] block">
                          Prior: 25.0%
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#0B1020] overflow-hidden mb-2">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isPeak ? 'bg-[#D6AE67]' : 'bg-[#6C94C5]'
                        }`}
                        style={{ width: `${Math.round(res.posteriorProbability * 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#A8B1C1] font-mono">
                      <span>Evidential factors: {res.evidenceInfluences.length}</span>
                      {isPeak && <span className="text-[#D6AE67] font-semibold">★ Peak Candidate</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section D: Result */}
          <div className="p-6 rounded-2xl bg-[#182235] border border-[#D6AE67]/40 space-y-3">
            <h2 className="text-base font-bold text-[#D6AE67] font-serif">
              {t.aiLab.sections.result}
            </h2>
            <p className="text-xs text-[#F3F4F6] leading-relaxed">
              {bayesianResult.explanation[language]}
            </p>
          </div>

          {/* Technical Details Collapsible */}
          {showTechnicalDetails && (
            <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#2A3B54] space-y-4 font-mono text-xs animate-fadeIn">
              <span className="text-[#D6AE67] font-bold block uppercase">
                Bayes' Theorem & Factor Marginalization Formula (Week 6)
              </span>
              <pre className="p-4 rounded-xl bg-[#111827] overflow-x-auto text-[11px] text-[#A8B1C1] leading-relaxed">
{`P(Candidate | E) = α × P(Candidate) × ∏ P(e_k | Candidate)

where:
P(e_k | Candidate) = ∑_{F ∈ {T,F}} P(e_k | Factor = F) × P(Factor = F | Candidate)
α = 1 / ∑_{i} P(Candidate_i, E) (Normalization factor guaranteeing ∑ P = 1.0)`}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 03: HIDDEN MARKOV MODEL + VITERBI (WEEK 7)                         */}
      {/* ========================================================================= */}
      {activeModule === 'hmm' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Section A: What is it? */}
          <div className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-3">
            <h2 className="text-base font-bold text-[#D6AE67] font-serif flex items-center gap-2">
              <GitCommit className="w-4 h-4" />
              <span>{t.aiLab.sections.whatIsIt}</span>
            </h2>
            <p className="text-xs text-[#F3F4F6] leading-relaxed">
              {language === 'kk'
                ? 'HMM (Жасырын Марков моделі) және Витерби динамикалық бағдарламалау алгоритмі қылмыс кезіндегі толық емес немесе шуыл араласқан бақылаулардан (сағат, CCTV, аяқ киім ізі) күдіктінің бөлмелер арасындағы ең ықтимал қозғалыс траекториясын қалпына келтіреді.'
                : 'A Hidden Markov Model (HMM) and the Viterbi dynamic programming algorithm reconstruct the most probable hidden trajectory across rooms from noisy, incomplete observations (pocket watches, RFID logs, footprints).'}
            </p>
          </div>

          {/* Section B: How it works? */}
          <div className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-4">
            <h2 className="text-base font-bold text-[#F3F4F6] font-serif">
              {t.aiLab.sections.howItWorks}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#111827] border border-[#2A3B54] space-y-1.5">
                <span className="font-mono text-[#D6AE67] font-bold">01. Жасырын күйлер (Rooms)</span>
                <p className="text-[#A8B1C1]">
                  Қылмыс болған ғимараттағы барлық 5-8 бөлме жасырын күйлер жиынтығын құрайды.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#111827] border border-[#2A3B54] space-y-1.5">
                <span className="font-mono text-[#D6AE67] font-bold">02. Өту матрицасы (A[i][j])</span>
                <p className="text-[#A8B1C1]">
                  Бөлмелердің өзара байланысы мен физикалық өту мүмкіндігі есепке алынады.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#111827] border border-[#2A3B54] space-y-1.5">
                <span className="font-mono text-[#D6AE67] font-bold">03. Витерби треллисі (Viterbi Trellis)</span>
                <p className="text-[#A8B1C1]">
                  Әр уақыт аралығында ең тиімді өткен қадам жатталып, кері байланыспен (backtracking) толық жол табылады.
                </p>
              </div>
            </div>
          </div>

          {/* Section C: Live Game Example */}
          <div className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-base font-bold text-[#F3F4F6] font-serif">
                {t.aiLab.sections.liveExample}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#A8B1C1]">Track Suspect:</span>
                {activeCase.suspects.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedSuspectId(s.id);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                      selectedSuspectId === s.id
                        ? 'bg-[#D6AE67] text-[#0B1020]'
                        : 'bg-[#111827] text-[#A8B1C1] border border-[#2A3B54]'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {viterbiResult.hasInsufficientData ? (
              <div className="p-8 rounded-xl bg-[#111827] border border-[#2A3B54] text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                <h3 className="text-sm font-bold text-[#F3F4F6]">
                  {language === 'kk' ? 'Уақыт айғақтары жеткіліксіз' : 'Insufficient Temporal Observations'}
                </h3>
                <p className="text-xs text-[#A8B1C1] max-w-md mx-auto">
                  {viterbiResult.explanation[language]}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Horizontal Timeline Visualization */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {viterbiResult.path.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#111827] border border-[#2A3B54] space-y-2"
                    >
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-[#D6AE67] font-bold">{step.timestamp}</span>
                        <span className="text-[#A8B1C1]">Time Slot {idx + 1}</span>
                      </div>

                      <div className="text-sm font-bold text-[#F3F4F6] font-serif">
                        {step.mostLikelyRoomName[language]}
                      </div>

                      <div className="text-[11px] text-[#6C94C5] font-mono">
                        Viterbi Path Probability: {(step.probability * 100).toFixed(0)}%
                      </div>

                      {step.associatedObservation && (
                        <div className="text-[10px] text-amber-300 font-mono pt-1.5 border-t border-[#2A3B54]">
                          Emitted Clue: {step.associatedObservation.name[language]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Candidate Comparison Table */}
                <div className="p-4 rounded-xl bg-[#111827] border border-[#2A3B54] space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#A8B1C1] block">
                    Candidate Timeline Fit Comparison:
                  </span>
                  <div className="space-y-2">
                    {viterbiResult.candidateComparison.map((cand) => (
                      <div
                        key={cand.suspectId}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-mono ${
                          cand.suspectId === targetSuspect.id
                            ? 'bg-[#182235] border-[#D6AE67]'
                            : 'bg-[#0B1020] border-[#2A3B54]'
                        }`}
                      >
                        <span className="font-bold text-[#F3F4F6]">{cand.suspectName}</span>
                        <span className="text-[#A8B1C1] hidden sm:inline truncate max-w-xs">{cand.pathSummary}</span>
                        <span className="text-[#D6AE67] font-bold">Fit: {cand.fitScore}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section D: Result */}
          <div className="p-6 rounded-2xl bg-[#182235] border border-[#D6AE67]/40 space-y-3">
            <h2 className="text-base font-bold text-[#D6AE67] font-serif">
              {t.aiLab.sections.result}
            </h2>
            <p className="text-xs text-[#F3F4F6] leading-relaxed">
              {viterbiResult.explanation[language]}
            </p>
          </div>

          {/* Technical Details Collapsible */}
          {showTechnicalDetails && (
            <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#2A3B54] space-y-4 font-mono text-xs animate-fadeIn">
              <span className="text-[#D6AE67] font-bold block uppercase">
                Viterbi Dynamic Programming Recurrence Equation (Week 7)
              </span>
              <pre className="p-4 rounded-xl bg-[#111827] overflow-x-auto text-[11px] text-[#A8B1C1] leading-relaxed">
{`V_t(j) = max_i [ V_{t-1}(i) × A_{ij} ] × B_j(O_t)
ψ_t(j) = argmax_i [ V_{t-1}(i) × A_{ij} ]

Backtracking:
q_T^* = argmax_j [ V_T(j) ]
q_t^* = ψ_{t+1}(q_{t+1}^*)`}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
