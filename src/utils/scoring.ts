import { DecisionAnalysis, ComparisonCriterion } from '../types/decision';

export function calculateWeightedScores(analysis: DecisionAnalysis): Record<string, { total: number; maxPossible: number; percentage: number }> {
  const result: Record<string, { total: number; maxPossible: number; percentage: number }> = {};

  if (!analysis?.options || !analysis?.criteria) {
    return result;
  }

  // Initialize
  analysis.options.forEach(opt => {
    result[opt.id] = { total: 0, maxPossible: 0, percentage: 0 };
  });

  let totalWeight = 0;
  analysis.criteria.forEach((crit: ComparisonCriterion) => {
    const weight = crit.importanceWeight || 1;
    totalWeight += weight;

    analysis.options.forEach(opt => {
      const scoreObj = crit.scores[opt.id];
      const rawScore = scoreObj ? scoreObj.score : 5; // default 5 out of 10
      result[opt.id].total += rawScore * weight;
      result[opt.id].maxPossible += 10 * weight;
    });
  });

  analysis.options.forEach(opt => {
    const max = result[opt.id].maxPossible || 1;
    result[opt.id].percentage = Math.round((result[opt.id].total / max) * 100);
  });

  return result;
}

export function getProsConsNetScore(pros: Array<{ weight?: number; impact: 'high' | 'medium' | 'low' }>, cons: Array<{ weight?: number; impact: 'high' | 'medium' | 'low' }>): number {
  const impactMultiplier = { high: 3, medium: 2, low: 1 };
  
  const prosSum = pros.reduce((acc, p) => acc + (p.weight ?? impactMultiplier[p.impact] ?? 2), 0);
  const consSum = cons.reduce((acc, c) => acc + (c.weight ?? impactMultiplier[c.impact] ?? 2), 0);

  return prosSum - consSum;
}
