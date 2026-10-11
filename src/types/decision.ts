export type CategoryType = 
  | 'Financial' 
  | 'Career/Growth' 
  | 'Wellbeing' 
  | 'Time/Effort' 
  | 'Risk' 
  | 'Relationships' 
  | 'Other';

export interface DecisionFactor {
  id: string;
  text: string;
  impact: 'high' | 'medium' | 'low';
  category: CategoryType;
  weight?: number; // 1 to 5
}

export interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface DecisionOption {
  id: string;
  title: string;
  summary: string;
  pros: DecisionFactor[];
  cons: DecisionFactor[];
  swot: SWOTData;
}

export interface CriterionScore {
  score: number; // 1 to 10
  rationale: string;
}

export interface ComparisonCriterion {
  id: string;
  name: string;
  description: string;
  importanceWeight: number; // 1 to 5
  scores: Record<string, CriterionScore>; // keyed by option id
}

export interface TiebreakerVerdict {
  executiveSummary: string;
  recommendedOptionId?: string;
  confidenceLevel: 'High' | 'Moderate' | 'Nuanced/Conditional';
  conditionalRules: Array<{
    condition: string;
    chosenOption: string;
  }>;
  gutCheckTest: string;
  tenTenTenRule?: {
    in10Minutes: string;
    in10Months: string;
    in10Years: string;
  };
  hiddenBlindSpots: string[];
  deRiskingActions: string[];
}

export interface DecisionAnalysis {
  id: string;
  title: string;
  context?: string;
  urgency?: 'urgent' | 'moderate' | 'exploratory';
  decisionType: 'reversibility_type1' | 'reversibility_type2' | 'balanced';
  decisionTypeExplanation?: string;
  options: DecisionOption[];
  criteria: ComparisonCriterion[];
  tiebreakerVerdict: TiebreakerVerdict;
  createdAt: string;
}

export interface DeepDiveMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
