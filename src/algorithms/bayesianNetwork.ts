import { Suspect, Evidence } from '../game/types.ts';
import {
  BayesianAnalysisResult,
  BayesianSuspectResult,
  BayesianFactor,
} from './algorithmTypes.ts';

/**
 * Real Bayesian Network Inference (Week 6: Probabilistic Reasoning)
 * Structure:
 *   [Culprit Identity: S0, S1, S2, S3] (Prior: 0.25 each)
 *         │
 *         ├──> [Motive Fit] ─────────> [Discovered Motive Clues]
 *         ├──> [Opportunity Fit] ────> [Keycard / Access Clues]
 *         ├──> [Physical Match] ─────> [Fingerprints, DNA, Fibers]
 *         ├──> [Timeline Fit] ───────> [Watch, CCTV, Departure Logs]
 *         └──> [Digital Access] ─────> [USB Keys, Terminal Overrides]
 */
export function calculateBayesianNetwork(
  suspects: Suspect[],
  evidenceList: Evidence[],
  discoveredEvidenceIds: string[]
): BayesianAnalysisResult {
  const n = suspects.length;
  // Uniform prior P(Candidate) = 0.25
  const priors = suspects.map(() => 1 / n);

  const discovered = evidenceList.filter((e) => discoveredEvidenceIds.includes(e.id));

  // Map evidence types to latent Bayesian factors
  function getFactorForEvidence(e: Evidence): BayesianFactor {
    if (e.type === 'physical' || e.type === 'biological') return 'physical';
    if (e.type === 'timeline') return 'timeline';
    if (e.type === 'digital') return 'access';
    if (e.type === 'document' || e.type === 'statement') return 'motive';
    return 'opportunity';
  }

  // CPT: Conditional Probability Table values based on clue reliability
  // P(Obs = Positive | Factor = True) vs P(Obs = Positive | Factor = False)
  function getObservationLikelihood(
    e: Evidence,
    candidate: Suspect,
    factorTrue: boolean
  ): number {
    const reliability = Math.min(0.98, Math.max(0.5, e.clueWeight));

    const matchesCandidate = e.implicatesSuspectId === candidate.id;
    const exoneratesCandidate = e.exoneratesSuspectId === candidate.id;

    if (matchesCandidate) {
      // If factor is True and clue matches candidate, high probability of positive observation
      return factorTrue ? reliability : 1 - reliability;
    } else if (exoneratesCandidate) {
      // Exoneration evidence points away
      return factorTrue ? 0.05 : 0.85;
    } else {
      // Neutral observation or points elsewhere
      return factorTrue ? 0.45 : 0.55;
    }
  }

  // Latent factor prior conditional on Candidate
  // P(Factor = True | Candidate = S_i)
  function getFactorPrior(factor: BayesianFactor, candidate: Suspect): number {
    switch (factor) {
      case 'motive':
        return candidate.motive && candidate.motive.en.length > 10 ? 0.65 : 0.35;
      case 'opportunity':
        return candidate.alibiRoomId ? 0.6 : 0.4;
      case 'physical':
        return 0.5; // neutral baseline prior without physical sample match
      case 'timeline':
        return candidate.challengedWithEvidence ? 0.2 : 0.55;
      case 'access':
        return candidate.profession.en.toLowerCase().includes('officer') ||
          candidate.profession.en.toLowerCase().includes('engineer') ||
          candidate.profession.en.toLowerCase().includes('secretary')
          ? 0.7
          : 0.4;
    }
  }

  // Compute unnormalized posterior for each candidate:
  // P(Candidate | Obs) \propto P(Candidate) * \prod_{Obs} P(Obs | Candidate)
  const factors: BayesianFactor[] = ['motive', 'opportunity', 'physical', 'timeline', 'access'];

  const unnormalizedPosteriors: number[] = suspects.map((candidate, idx) => {
    let logLikelihood = Math.log(priors[idx]); // log P(Candidate)

    // Evaluate likelihood of all discovered observations
    discovered.forEach((e) => {
      const factor = getFactorForEvidence(e);
      const pFactorTrue = getFactorPrior(factor, candidate);
      const pFactorFalse = 1 - pFactorTrue;

      const pObsGivenTrue = getObservationLikelihood(e, candidate, true);
      const pObsGivenFalse = getObservationLikelihood(e, candidate, false);

      // Marginalize over binary factor state:
      // P(Obs | Candidate) = P(Obs | Factor=T)*P(Factor=T | Candidate) + P(Obs | Factor=F)*P(Factor=F | Candidate)
      const pObsMarginal = pObsGivenTrue * pFactorTrue + pObsGivenFalse * pFactorFalse;

      logLikelihood += Math.log(Math.max(1e-9, pObsMarginal));
    });

    return Math.exp(logLikelihood);
  });

  // Normalize posteriors so they sum exactly to 1.0 (100%)
  const totalPosteriorSum = unnormalizedPosteriors.reduce((a, b) => a + b, 0) || 1e-9;
  const normalizedPosteriors = unnormalizedPosteriors.map((p) => p / totalPosteriorSum);

  // Build structured results for each suspect
  const results: BayesianSuspectResult[] = suspects.map((s, idx) => {
    const posterior = Math.round(normalizedPosteriors[idx] * 1000) / 1000;

    const factorProbs: Record<BayesianFactor, number> = {
      motive: getFactorPrior('motive', s),
      opportunity: getFactorPrior('opportunity', s),
      physical: getFactorPrior('physical', s),
      timeline: getFactorPrior('timeline', s),
      access: getFactorPrior('access', s),
    };

    const influences = discovered.map((e) => {
      let direction: 'positive' | 'negative' | 'neutral' = 'neutral';
      if (e.implicatesSuspectId === s.id) {
        direction = 'positive';
      } else if (e.exoneratesSuspectId === s.id) {
        direction = 'negative';
      }

      return {
        evidenceId: e.id,
        evidenceName: e.name.kk,
        factor: getFactorForEvidence(e),
        weight: Math.round(e.clueWeight * 100) / 100,
        direction,
      };
    });

    return {
      suspectId: s.id,
      suspectName: s.name,
      priorProbability: 0.25,
      posteriorProbability: posterior,
      likelihoodScore: Math.round(unnormalizedPosteriors[idx] * 1000) / 1000,
      factorProbabilities: factorProbs,
      evidenceInfluences: influences,
    };
  });

  // Peak suspect identification
  const sorted = [...results].sort((a, b) => b.posteriorProbability - a.posteriorProbability);
  const mostLikely = sorted[0];
  const confidence = Math.min(1.0, mostLikely.posteriorProbability * (1 + discovered.length * 0.04));

  // Graph topology for SVG visualization
  const graphNodes: Array<{
    id: string;
    label: string;
    type: 'hypothesis' | 'factor' | 'observation';
  }> = [
    { id: 'hyp_culprit', label: 'Culprit Identity (S0..S3)', type: 'hypothesis' },
    { id: 'fact_motive', label: 'Motive Fit', type: 'factor' },
    { id: 'fact_opp', label: 'Opportunity Fit', type: 'factor' },
    { id: 'fact_phys', label: 'Physical Match', type: 'factor' },
    { id: 'fact_time', label: 'Timeline Fit', type: 'factor' },
    { id: 'fact_acc', label: 'Digital Access', type: 'factor' },
  ];

  discovered.forEach((ev) => {
    graphNodes.push({
      id: `obs_${ev.id}`,
      label: ev.name.en,
      type: 'observation' as const,
    });
  });

  const graphEdges = [
    { from: 'hyp_culprit', to: 'fact_motive' },
    { from: 'hyp_culprit', to: 'fact_opp' },
    { from: 'hyp_culprit', to: 'fact_phys' },
    { from: 'hyp_culprit', to: 'fact_time' },
    { from: 'hyp_culprit', to: 'fact_acc' },
  ];

  discovered.forEach((ev) => {
    const factor = getFactorForEvidence(ev);
    graphEdges.push({
      from: `fact_${factor === 'motive' ? 'motive' : factor === 'opportunity' ? 'opp' : factor === 'physical' ? 'phys' : factor === 'timeline' ? 'time' : 'acc'}`,
      to: `obs_${ev.id}`,
    });
  });

  return {
    results,
    mostLikelySuspectId: mostLikely.suspectId,
    confidenceScore: Math.round(confidence * 100) / 100,
    activeEvidenceCount: discovered.length,
    graphNodes,
    graphEdges,
    explanation: {
      kk: `Байес желісі бойынша ${discovered.length} белсенді айғақты маргиналдау нәтижесінде ең жоғары ықтималдық (${(mostLikely.posteriorProbability * 100).toFixed(1)}%) — ${mostLikely.suspectName} тұлғасына сәйкес келеді.`,
      en: `Exact Bayesian inference over ${discovered.length} active evidential observations yields a peak posterior probability of ${(mostLikely.posteriorProbability * 100).toFixed(1)}% pointing to ${mostLikely.suspectName}.`,
    },
  };
}
