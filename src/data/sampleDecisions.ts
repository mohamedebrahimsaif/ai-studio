import { DecisionAnalysis } from '../types/decision';

export const SAMPLE_DECISIONS: DecisionAnalysis[] = [
  {
    id: 'sample-career-pivot',
    title: 'Should I join a fast-growing AI startup or stay as a Senior Lead at an established tech enterprise?',
    context: 'Current enterprise offers $210k base, great 401k match, 35 hrs/week, low stress. Startup offers $170k base + 0.35% equity, fast promotion path, but likely 50-60 hrs/week and risk of runway.',
    urgency: 'moderate',
    decisionType: 'reversibility_type2',
    decisionTypeExplanation: 'Generally a two-way door: Enterprise software engineers with a strong track record can typically boomerang or return to enterprise roles within 1-2 years if the startup path proves misaligned.',
    createdAt: new Date().toISOString(),
    options: [
      {
        id: 'opt_1',
        title: 'Stay at Established Enterprise',
        summary: 'Maximize income stability, predictable hours, robust benefits, and high work-life balance for family and personal projects.',
        pros: [
          { id: 'p1-1', text: 'Guaranteed high cash compensation with zero equity valuation risk', impact: 'high', category: 'Financial', weight: 5 },
          { id: 'p1-2', text: 'Predictable ~35h weekly schedule protects mental health and family time', impact: 'high', category: 'Wellbeing', weight: 5 },
          { id: 'p1-3', text: 'Substantial severance and enterprise benefits buffer economic downturns', impact: 'medium', category: 'Risk', weight: 4 },
          { id: 'p1-4', text: 'Ample cognitive bandwidth to pursue side hobbies or angel investing', impact: 'medium', category: 'Time/Effort', weight: 3 }
        ],
        cons: [
          { id: 'c1-1', text: 'Career progression has plateaued; promotion cycles are heavily political', impact: 'high', category: 'Career/Growth', weight: 4 },
          { id: 'c1-2', text: 'Slower learning curve and older tech stack reduce competitive edge over 3-5 years', impact: 'high', category: 'Career/Growth', weight: 4 },
          { id: 'c1-3', text: 'Lingering feeling of professional stagnation and what-if regret', impact: 'medium', category: 'Wellbeing', weight: 3 }
        ],
        swot: {
          strengths: [
            'Immediate maximum cash flow ($210k guaranteed)',
            'Established institutional credibility and deep domain mastery',
            'Solid boundaries preventing burnout'
          ],
          weaknesses: [
            'Bureacratic decision cycles with multiple approval layers',
            'Reduced exposure to cutting-edge generative AI systems'
          ],
          opportunities: [
            'Can negotiate internal lateral move to emerging tech team',
            'Can invest excess savings aggressively into private equity or index funds'
          ],
          threats: [
            'Potential enterprise restructuring or AI workforce automation over a 5-year horizon',
            'Loss of builder agility as modern dev tools evolve rapidly'
          ]
        }
      },
      {
        id: 'opt_2',
        title: 'Join Fast-Growing AI Startup',
        summary: 'Accelerate skill acquisition, take full architectural ownership, and gain high financial upside through equity participation.',
        pros: [
          { id: 'p2-1', text: 'Steep learning velocity working directly with frontier AI models and infra', impact: 'high', category: 'Career/Growth', weight: 5 },
          { id: 'p2-2', text: 'Significant asymmetric financial upside if startup executes a liquidity event', impact: 'high', category: 'Financial', weight: 4 },
          { id: 'p2-3', text: 'High agency and executive visibility; ability to shape company culture', impact: 'high', category: 'Career/Growth', weight: 4 },
          { id: 'p2-4', text: 'Expands high-value founder/operator network in the tech ecosystem', impact: 'medium', category: 'Relationships', weight: 3 }
        ],
        cons: [
          { id: 'c2-1', text: 'Immediate $40k cash pay cut with uncertain illiquid equity', impact: 'high', category: 'Financial', weight: 4 },
          { id: 'c2-2', text: 'Work weeks often stretch to 50-60 hours with elevated on-call pressure', impact: 'high', category: 'Wellbeing', weight: 4 },
          { id: 'c2-3', text: 'Startup funding risk: current runway is 18 months requiring another round', impact: 'high', category: 'Risk', weight: 4 }
        ],
        swot: {
          strengths: [
            'Direct access to founders and strategic decision making',
            'Full ownership of core product architecture',
            'High agility with daily shipping cadence'
          ],
          weaknesses: [
            'Lower base cash reserve during a volatile macro environment',
            'Less structured mentorship and fewer internal support staff'
          ],
          opportunities: [
            'Potential 10x-20x valuation expansion if Series B executes well',
            'Can step into VP of Engineering / CTO role as company scales'
          ],
          threats: [
            'Venture market tightening could shorten runway',
            'Prolonged stress could strain personal relationships if unmanaged'
          ]
        }
      }
    ],
    criteria: [
      {
        id: 'crit_1',
        name: 'Financial Security & Immediate Cashflow',
        description: 'Guaranteed base salary, 401k match, and liquid cash predictability',
        importanceWeight: 4,
        scores: {
          opt_1: { score: 9, rationale: 'Stable $210k base salary with bulletproof retirement match and zero volatility.' },
          opt_2: { score: 5, rationale: 'Taking a $40k base cut; equity value is illiquid paper until eventual liquidity event.' }
        }
      },
      {
        id: 'crit_2',
        name: 'Career Acceleration & Skill Relevance',
        description: 'Speed of learning, relevance of modern tech stack, and future resume equity',
        importanceWeight: 5,
        scores: {
          opt_1: { score: 4, rationale: 'Incremental enterprise growth with slower releases and limited AI frontier exposure.' },
          opt_2: { score: 10, rationale: 'Hands-on architectural leadership on modern AI tech stack with extreme market demand.' }
        }
      },
      {
        id: 'crit_3',
        name: 'Work-Life Harmony & Low Chronic Stress',
        description: 'Predictable work hours, quality sleep, family presence, and personal freedom',
        importanceWeight: 4,
        scores: {
          opt_1: { score: 9, rationale: '35h work weeks, established boundaries, low on-call panic, high peace of mind.' },
          opt_2: { score: 4, rationale: 'Startup pace routinely demands evenings and high cognitive vigilance under deadline pressure.' }
        }
      },
      {
        id: 'crit_4',
        name: 'Long-Term Wealth Creation Upside',
        description: 'Asymmetric financial potential (equity multiple vs market compounding)',
        importanceWeight: 3,
        scores: {
          opt_1: { score: 6, rationale: 'High reliable compounding via savings, but capped ceiling without equity windfalls.' },
          opt_2: { score: 9, rationale: '0.35% equity pool in high-growth sector provides rare life-changing financial upside.' }
        }
      },
      {
        id: 'crit_5',
        name: 'Autonomy & Personal Agency',
        description: 'Ability to make decisions quickly without bureaucratic friction',
        importanceWeight: 4,
        scores: {
          opt_1: { score: 4, rationale: 'Hampered by steering committees, legal approvals, and legacy governance.' },
          opt_2: { score: 9, rationale: 'Direct line to CEO, daily deployments, and freedom to choose architectural direction.' }
        }
      }
    ],
    tiebreakerVerdict: {
      executiveSummary: 'Because this is a Type-2 (reversible) decision and the market demand for AI engineering leadership is at a cyclical peak, the startup offers asymmetric upside. However, the decision hinges strictly on your life stage and family bandwidth over the next 18 months.',
      recommendedOptionId: 'opt_2',
      confidenceLevel: 'Nuanced/Conditional',
      conditionalRules: [
        {
          condition: 'If your family or personal life currently requires strict 40h boundaries and zero cash volatility...',
          chosenOption: 'Stay at Established Enterprise'
        },
        {
          condition: 'If your primary objective for the next 2-3 years is rapid skill compounding and career equity...',
          chosenOption: 'Join Fast-Growing AI Startup'
        }
      ],
      gutCheckTest: 'Imagine you receive a call tomorrow saying the startup withdrew the offer due to an internal hiring freeze. Is your immediate reflex a sigh of relief, or a pang of deep disappointment? That involuntary reaction is your real preference.',
      tenTenTenRule: {
        in10Minutes: 'Staying brings instant relief from anxiety; joining brings adrenaline and electric excitement.',
        in10Months: 'At enterprise, you will likely feel identical to today. At startup, you will have shipped 15 core features and learned more in 10 months than the prior 3 years.',
        in10Years: 'Even if the startup fails, having led early AI architecture permanently elevates your career tier. If you stay, you may forever wonder what you could have built.'
      },
      hiddenBlindSpots: [
        'Status Quo Bias: We habitually treat our current job as "risk-free", ignoring the subtle risk of skill obsolescence and salary compression over 5+ years.',
        'Loss Aversion on Cash: Giving up $40k feels twice as painful as gaining potential future upside of $500k+.'
      ],
      deRiskingActions: [
        'Negotiate a 6-month equity cliff adjustment or a $15k signing bonus with the startup to bridge the cash delta.',
        'Interview 2 former engineers who left the startup to audit leadership churn and real work week averages before signing.'
      ]
    }
  },
  {
    id: 'sample-buy-vs-rent',
    title: 'Should we purchase a suburban home with a mortgage or continue renting in the city center?',
    context: 'Considering buying a $650k home with 20% down at 6.8% mortgage rate ($4,200/mo all-in). Currently renting a 2-bed downtown apartment for $2,800/mo and investing the difference in low-cost index funds.',
    urgency: 'moderate',
    decisionType: 'reversibility_type1',
    decisionTypeExplanation: 'Buying real estate with closing costs, mortgage lock-in, and transaction fees (6-8% upon selling) is largely a Type-1 (hard to reverse) decision requiring a 5-7 year commitment horizon.',
    createdAt: new Date().toISOString(),
    options: [
      {
        id: 'opt_1',
        title: 'Buy Suburban Home',
        summary: 'Lock in permanent living space, build home equity, gain yard space and privacy, and hedge against long-term rental inflation.',
        pros: [
          { id: 'p1', text: 'Fixed housing cost provides predictable shelter stability and inflation hedge', impact: 'high', category: 'Financial', weight: 4 },
          { id: 'p1b', text: 'Private yard, extra space, and emotional ownership for family and pets', impact: 'high', category: 'Wellbeing', weight: 5 },
          { id: 'p1c', text: 'Forced savings mechanism through monthly principal paydown', impact: 'medium', category: 'Financial', weight: 3 },
          { id: 'p1d', text: 'Full autonomy to remodel, paint, and customize living environment', impact: 'medium', category: 'Wellbeing', weight: 4 }
        ],
        cons: [
          { id: 'c1', text: 'Monthly outflow is $1,400 higher than rent, with substantial unrecoverable interest & property taxes', impact: 'high', category: 'Financial', weight: 5 },
          { id: 'c1b', text: 'All maintenance, repairs, roof/HVAC replacements are 100% out of pocket', impact: 'high', category: 'Financial', weight: 4 },
          { id: 'c1c', text: 'High switching costs lock you to this location for at least 5-7 years', impact: 'high', category: 'Risk', weight: 4 },
          { id: 'c1d', text: 'Suburban commute adds 30-45 minutes each way to urban activities', impact: 'medium', category: 'Time/Effort', weight: 4 }
        ],
        swot: {
          strengths: ['Total physical privacy and generous square footage', 'Freedom to alter property without landlord permission'],
          weaknesses: ['Substantial cash downpayment ($130k) illiquid in the property', 'Higher ongoing utility and yard upkeep expenses'],
          opportunities: ['Long-term suburban appreciation and potential to refinance if interest rates drop', 'Great school district for growing family'],
          threats: ['Macro housing price correction in first 3 years', 'Property tax and homeowners insurance rate hikes']
        }
      },
      {
        id: 'opt_2',
        title: 'Continue Renting Downtown',
        summary: 'Retain maximum geographic mobility, keep $130k cash invested in liquid markets, and avoid unbudgeted repair liabilities.',
        pros: [
          { id: 'p2', text: 'Saves $1,400/month in cashflow to invest in liquid high-performing equities', impact: 'high', category: 'Financial', weight: 5 },
          { id: 'p2b', text: 'Walkable lifestyle near restaurants, transit, culture, and friends', impact: 'high', category: 'Wellbeing', weight: 4 },
          { id: 'p2c', text: 'Zero liability for broken appliances, building maintenance, or structural repairs', impact: 'high', category: 'Financial', weight: 4 },
          { id: 'p2d', text: 'Maximum geographic flexibility: can move at lease end without friction', impact: 'medium', category: 'Risk', weight: 4 }
        ],
        cons: [
          { id: 'c2', text: 'Subject to annual rent increases and landlord whims', impact: 'high', category: 'Financial', weight: 4 },
          { id: 'c2b', text: 'Limited space and lack of private yard for children/dogs', impact: 'high', category: 'Wellbeing', weight: 4 },
          { id: 'c2c', text: 'Cannot customize or renovate the living space', impact: 'medium', category: 'Wellbeing', weight: 3 },
          { id: 'c2d', text: 'No equity build-up; payments are 100% operational expense', impact: 'medium', category: 'Financial', weight: 3 }
        ],
        swot: {
          strengths: ['Ultimate financial liquidity and zero home maintenance burden', 'Prime walkable city center location'],
          weaknesses: ['Vulnerability to landlord non-renewal or rent spikes', 'Smaller footprint and storage constraints'],
          opportunities: ['Compounding $130k in index funds historically outpaces net home equity in high-interest rate environments', 'Ability to relocate freely for career jumps'],
          threats: ['Urban rental prices rising faster than local wages', 'Noise and density fatigue over time']
        }
      }
    ],
    criteria: [
      {
        id: 'crit_1',
        name: 'Total Net Wealth Impact (5-Year Horizon)',
        description: 'Comparison of equity build-up vs compounding the downpayment in index funds',
        importanceWeight: 5,
        scores: {
          opt_1: { score: 6, rationale: 'At 6.8% mortgage rate, high front-loaded interest and amortized closing costs eat into early equity.' },
          opt_2: { score: 8, rationale: 'Investing the $130k downpayment + $1,400/mo delta in low-cost index funds matches or beats net real estate return over 5 years.' }
        }
      },
      {
        id: 'crit_2',
        name: 'Lifestyle, Space & Family Comfort',
        description: 'Square footage, privacy, outdoor green space, and quality of life',
        importanceWeight: 4,
        scores: {
          opt_1: { score: 9, rationale: 'Spacious floor plan, private backyard, dedicated home offices, quiet neighborhood.' },
          opt_2: { score: 5, rationale: 'Constrained storage, shared walls, and lack of private garden.' }
        }
      },
      {
        id: 'crit_3',
        name: 'Flexibility & Low Friction Mobility',
        description: 'Ability to relocate easily if jobs, health, or priorities change',
        importanceWeight: 4,
        scores: {
          opt_1: { score: 3, rationale: 'Selling within 3-4 years almost guarantees net loss after 6% realtor commission and staging fees.' },
          opt_2: { score: 10, rationale: 'Can break or finish lease and move across the country within 30 days.' }
        }
      },
      {
        id: 'crit_4',
        name: 'Mental Peace & Low Maintenance Burden',
        description: 'Freedom from unexpected contractor calls, leaks, and roof emergencies',
        importanceWeight: 3,
        scores: {
          opt_1: { score: 5, rationale: 'Homeowners average 1-2% of home value annually ($6,500+) in time and cash on maintenance.' },
          opt_2: { score: 9, rationale: 'One message to the building superintendent fixes all issues at zero personal cost.' }
        }
      }
    ],
    tiebreakerVerdict: {
      executiveSummary: 'Because this is a Type-1 (high friction to reverse) decision under high prevailing interest rates, continuing to rent and aggressively investing the savings is mathematically and strategically superior UNLESS you have guaranteed 7+ year horizon stability and place paramount emotional value on suburban space.',
      recommendedOptionId: 'opt_2',
      confidenceLevel: 'High',
      conditionalRules: [
        {
          condition: 'If you have children entering school and intend to live in this exact town for at least 7 years...',
          chosenOption: 'Buy Suburban Home'
        },
        {
          condition: 'If your career may require relocation within 3-5 years or you prioritize liquid net worth...',
          chosenOption: 'Continue Renting Downtown'
        }
      ],
      gutCheckTest: 'Do you want to own a home for the real day-to-day lifestyle (raking leaves, fixing gutters, quiet evenings) or because society told you buying a house is the default marker of adulthood? Be brutally honest with yourself.',
      tenTenTenRule: {
        in10Minutes: 'Deciding to rent feels like avoiding a massive $650k debt burden; buying feels like an exciting milestone.',
        in10Months: 'The buyer is shopping for lawnmowers and budgeting property taxes; the renter enjoys weekend brunches with healthy savings.',
        in10Years: 'The buyer has established roots and locked equity; the renter either bought later with larger cash reserves or moved freely to career hotspots.'
      },
      hiddenBlindSpots: [
        'The "Rent is Throwing Money Away" Myth: Buying at 6.8% means throwing money away on mortgage interest, taxes, and insurance (often 70% of the payment early on).',
        'Phantom Costs of Ownership: People budget mortgage principal and interest, but forget HOA, water, lawncare, roof, and time maintenance.'
      ],
      deRiskingActions: [
        'Rent an Airbnb in the targeted suburb for 2 consecutive weeks to test the actual daily commute and lifestyle rhythm before signing an offer.',
        'Run the NYTimes Buy vs Rent mathematical calculator with your exact local property tax and rent inflation numbers.'
      ]
    }
  }
];
