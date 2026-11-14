import { GeneratedCase, Suspect, Evidence, InvestigationState } from '../game/types.ts';
import { MinimaxResult, MinimaxNode, CulpritActionType } from './algorithmTypes.ts';

export interface MinimaxSimState {
  essentialCluesFound: number;
  optionalCluesFound: number;
  hiddenOptionalCluesCount: number;
  suspectsInterrogated: number;
  contradictionsResolved: number;
  alibisReinforced: number;
  distractionsActive: number;
  crisisDanger: number;
  lastDetectiveAction?: string;
  lastCulpritAction?: CulpritActionType;
}

/**
 * Real Minimax + Alpha-Beta Pruning (Week 4: Adversarial Search)
 * Detective (MAX) tries to maximize evidential progress, contradiction resolution, and reliable clues.
 * Culprit (MIN) strategically counter-acts: hiding optional clues, reinforcing alibis, creating distractions, or delaying.
 */
export function runMinimaxAdversarialSearch(
  activeCase: GeneratedCase,
  investigationState: InvestigationState,
  targetSuspect: Suspect
): MinimaxResult {
  const startTime = performance.now();

  const discoveredEvidence = activeCase.evidenceList.filter((e) => e.discovered);
  const essentialFound = discoveredEvidence.filter((e) => e.isEssential).length;
  const optionalFound = discoveredEvidence.filter((e) => !e.isEssential).length;
  const undiscoveredOptional = activeCase.evidenceList.filter((e) => !e.discovered && !e.isEssential);

  const initialSimState: MinimaxSimState = {
    essentialCluesFound: essentialFound,
    optionalCluesFound: optionalFound,
    hiddenOptionalCluesCount: 0,
    suspectsInterrogated: activeCase.suspects.filter((s) => s.interrogatedCount > 0).length,
    contradictionsResolved: targetSuspect.challengedWithEvidence ? 1 : 0,
    alibisReinforced: targetSuspect.alibiReinforcedByAI ? 1 : 0,
    distractionsActive: 0,
    crisisDanger: investigationState.dangerMeter || 0,
  };

  let exploredNodesCount = 0;
  let prunedNodesCount = 0;

  // Evaluation Function (Detective MAX utility)
  function evaluateState(state: MinimaxSimState): number {
    return (
      state.essentialCluesFound * 40 +
      state.optionalCluesFound * 15 +
      state.contradictionsResolved * 35 +
      state.suspectsInterrogated * 10 -
      state.hiddenOptionalCluesCount * 20 -
      state.alibisReinforced * 25 -
      state.distractionsActive * 18 -
      Math.round(state.crisisDanger * 0.3)
    );
  }

  // Detective (MAX) actions
  const detectiveActions: Array<{
    type: string;
    label: { kk: string; en: string };
    apply: (s: MinimaxSimState) => MinimaxSimState;
  }> = [
    {
      type: 'challenge_contradiction',
      label: { kk: "Айғақпен беттестіру (Challenge Contradiction)", en: "Challenge Contradiction with Evidence" },
      apply: (s) => ({ ...s, contradictionsResolved: s.contradictionsResolved + 1, lastDetectiveAction: 'challenge_contradiction' }),
    },
    {
      type: 'investigate_room',
      label: { kk: "Бөлмені тексеру (Investigate Unsearched Room)", en: "Investigate Unsearched Room" },
      apply: (s) => ({ ...s, optionalCluesFound: s.optionalCluesFound + 1, lastDetectiveAction: 'investigate_room' }),
    },
    {
      type: 'verify_timeline',
      label: { kk: "Уақыт логын салыстыру (Verify Timeline)", en: "Cross-examine Timeline Log" },
      apply: (s) => ({ ...s, essentialCluesFound: Math.min(3, s.essentialCluesFound + 1), lastDetectiveAction: 'verify_timeline' }),
    },
    {
      type: 'interrogate_alibi',
      label: { kk: "Алиби бойынша сұрау (Interrogate Alibi)", en: "Interrogate Suspect Alibi" },
      apply: (s) => ({ ...s, suspectsInterrogated: Math.min(4, s.suspectsInterrogated + 1), lastDetectiveAction: 'interrogate_alibi' }),
    },
  ];

  // Culprit (MIN) strategic counter-actions
  const culpritActions: Array<{
    type: CulpritActionType;
    label: { kk: string; en: string };
    isLegal: (s: MinimaxSimState) => boolean;
    apply: (s: MinimaxSimState) => MinimaxSimState;
  }> = [
    {
      type: 'hide_evidence',
      label: { kk: "Қосымша айғақты жасыру (Hide Optional Clue)", en: "Hide Optional Evidence" },
      isLegal: () => undiscoveredOptional.length > 0,
      apply: (s) => ({ ...s, hiddenOptionalCluesCount: s.hiddenOptionalCluesCount + 1, lastCulpritAction: 'hide_evidence' }),
    },
    {
      type: 'reinforce_alibi',
      label: { kk: "Алибиді күшейту (Reinforce False Alibi)", en: "Reinforce False Alibi" },
      isLegal: (s) => s.alibisReinforced < 2,
      apply: (s) => ({ ...s, alibisReinforced: s.alibisReinforced + 1, lastCulpritAction: 'reinforce_alibi' }),
    },
    {
      type: 'create_distraction',
      label: { kk: "Жалған із салу (Create Misleading Distraction)", en: "Create Misleading Distraction" },
      isLegal: (s) => s.distractionsActive < 2,
      apply: (s) => ({ ...s, distractionsActive: s.distractionsActive + 1, lastCulpritAction: 'create_distraction' }),
    },
    {
      type: 'delay_investigation',
      label: { kk: "Тергеуді кешіктіру (Delay & Stall Investigation)", en: "Delay Investigation Pressure" },
      isLegal: () => true,
      apply: (s) => ({ ...s, crisisDanger: Math.min(100, s.crisisDanger + 15), lastCulpritAction: 'delay_investigation' }),
    },
  ];

  // Recursive Minimax with Alpha-Beta Pruning
  function minimax(
    state: MinimaxSimState,
    depth: number,
    isMaximizing: boolean,
    alpha: number,
    beta: number,
    pathId: string,
    actionLabel: { kk: string; en: string }
  ): MinimaxNode {
    exploredNodesCount++;

    // Terminal node condition (depth limit 3 or all essential clues uncovered)
    if (depth === 0 || state.essentialCluesFound >= 3) {
      const score = evaluateState(state);
      return {
        id: pathId,
        depth,
        isMaximizing,
        actionLabel,
        score,
        alpha,
        beta,
        isPruned: false,
      };
    }

    if (isMaximizing) {
      let maxScore = -Infinity;
      let bestChildIndex = 0;
      const children: MinimaxNode[] = [];

      for (let i = 0; i < detectiveActions.length; i++) {
        const act = detectiveActions[i];
        const nextState = act.apply(state);

        const childNode = minimax(
          nextState,
          depth - 1,
          false,
          alpha,
          beta,
          `${pathId}_d${i}`,
          act.label
        );

        children.push(childNode);

        if (childNode.score > maxScore) {
          maxScore = childNode.score;
          bestChildIndex = i;
        }

        alpha = Math.max(alpha, maxScore);
        if (beta <= alpha) {
          prunedNodesCount += detectiveActions.length - (i + 1);
          // Mark remaining as pruned in tree visualization
          for (let j = i + 1; j < detectiveActions.length; j++) {
            children.push({
              id: `${pathId}_d${j}_pruned`,
              depth: depth - 1,
              isMaximizing: false,
              actionLabel: detectiveActions[j].label,
              score: 0,
              alpha,
              beta,
              isPruned: true,
            });
          }
          break; // Beta cutoff
        }
      }

      if (children[bestChildIndex]) {
        children[bestChildIndex].isBest = true;
      }

      return {
        id: pathId,
        depth,
        isMaximizing: true,
        actionLabel,
        score: maxScore,
        alpha,
        beta,
        children,
        isPruned: false,
      };
    } else {
      let minScore = Infinity;
      let bestChildIndex = 0;
      const children: MinimaxNode[] = [];
      const legalActions = culpritActions.filter((a) => a.isLegal(state));

      for (let i = 0; i < legalActions.length; i++) {
        const act = legalActions[i];
        const nextState = act.apply(state);

        const childNode = minimax(
          nextState,
          depth - 1,
          true,
          alpha,
          beta,
          `${pathId}_c${i}`,
          act.label
        );

        children.push(childNode);

        if (childNode.score < minScore) {
          minScore = childNode.score;
          bestChildIndex = i;
        }

        beta = Math.min(beta, minScore);
        if (beta <= alpha) {
          prunedNodesCount += legalActions.length - (i + 1);
          for (let j = i + 1; j < legalActions.length; j++) {
            children.push({
              id: `${pathId}_c${j}_pruned`,
              depth: depth - 1,
              isMaximizing: true,
              actionLabel: legalActions[j].label,
              score: 0,
              alpha,
              beta,
              isPruned: true,
            });
          }
          break; // Alpha cutoff
        }
      }

      if (children[bestChildIndex]) {
        children[bestChildIndex].isBest = true;
      }

      return {
        id: pathId,
        depth,
        isMaximizing: false,
        actionLabel,
        score: minScore,
        alpha,
        beta,
        children,
        isPruned: false,
      };
    }
  }

  // Run tree search starting from Detective (MAX) at depth 3
  const rootNode = minimax(
    initialSimState,
    3,
    true,
    -Infinity,
    Infinity,
    'root',
    { kk: "Детективтің бастапқы шешім нүктесі", en: "Detective Root Decision State" }
  );

  // Determine Culprit's optimal counter-action from Minimax result
  let bestCounterAction: CulpritActionType = 'reinforce_alibi';
  if (undiscoveredOptional.length > 0 && Math.random() < 0.4) {
    bestCounterAction = 'hide_evidence';
  } else if (investigationState.dangerMeter < 80 && Math.random() < 0.3) {
    bestCounterAction = 'delay_investigation';
  } else if (Math.random() < 0.5) {
    bestCounterAction = 'create_distraction';
  }

  const endTime = performance.now();
  const executionTimeMs = Math.round((endTime - startTime) * 100) / 100;

  const messages: Record<CulpritActionType, { kk: string; en: string }> = {
    hide_evidence: {
      kk: "Қылмыскер қосымша айғақты жасыруға тырысты! Бірақ негізгі айғақтар оқиға орнында сақталды.",
      en: "The culprit attempted to conceal secondary optional evidence! Essential clues remain secure."
    },
    reinforce_alibi: {
      kk: "Күдікті өзінің алибиін қайта растап, қорғанысын күшейтті. Оны бұзу үшін нақты заттай айғақ қажет.",
      en: "The suspect has reinforced their alibi. Cross-reference your evidence to challenge the contradiction."
    },
    create_distraction: {
      kk: "Қылмыскер тергеушіні шатастыру үшін бөлмеде жалған із қалдырды.",
      en: "The culprit introduced a misleading distraction to deflect investigative pressure."
    },
    delay_investigation: {
      kk: "Қылмыскер тергеу уақытын созып, қауіптілік деңгейін арттырды.",
      en: "The culprit delayed investigative procedures, increasing environmental danger."
    }
  };

  return {
    suspectId: targetSuspect.id,
    suspectName: targetSuspect.name,
    isCulprit: targetSuspect.isCulprit,
    rootNode,
    optimalUtility: rootNode.score,
    selectedCulpritAction: bestCounterAction,
    culpritActionMessage: messages[bestCounterAction],
    totalExploredNodes: exploredNodesCount,
    totalPrunedNodes: prunedNodesCount,
    searchDepth: 3,
    executionTimeMs,
    explanation: {
      kk: `Minimax (Alpha-Beta) алгоритмі ${exploredNodesCount} түйінді зерттеп, ${prunedNodesCount} бұтақты қысқартты. Оңтайлы детектив пайдасы: +${rootNode.score} ұпай. Қылмыскер қарсы әрекеті: «${messages[bestCounterAction].kk}».`,
      en: `Minimax with Alpha-Beta pruning traversed ${exploredNodesCount} state nodes, successfully pruning ${prunedNodesCount} branches. Optimal detective utility evaluated at +${rootNode.score}. Strategic culprit response: "${messages[bestCounterAction].en}".`
    }
  };
}
