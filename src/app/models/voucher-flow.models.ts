export type VoucherGoal = 'USER_ACQUISITION' | 'PROFIT_INCREASE' | 'TARGET_USERS' | 'SALES_GROWTH';

export type DiscountType = 'PERCENT' | 'AMOUNT';

export type VoucherScopeType = 'ALL_BRANCHES' | 'BRANCHES' | 'CATEGORY';

export type UserSegment =
  | 'NEW_USERS'
  | 'CHURN_RISK'
  | 'HIGH_VALUE'
  | 'PRICE_SENSITIVE'
  | 'FREQUENT_BUYERS';

export interface VoucherStrategyInput {
  readonly goal: VoucherGoal | null;
  readonly maxDiscountBudget?: number; // optional cap in currency units
}

export interface VoucherRecommendation {
  readonly discountType: DiscountType;
  readonly discountValue: number; // pct (0..100) or currency amount
  readonly userSegments: readonly UserSegment[];
  readonly scope: {
    readonly type: VoucherScopeType;
    readonly branchIds?: readonly string[];
    readonly category?: string;
  };
  readonly productPriceRange: {
    readonly min: number;
    readonly max: number;
  };
  readonly rationale: readonly string[]; // explainable, rule-based notes
  readonly guardrails: readonly string[]; // anti-misuse warnings
}

export interface VoucherFlowState {
  readonly strategy: VoucherStrategyInput;
  readonly recommendation: VoucherRecommendation | null;
  readonly confirmed: boolean;
}

export type VoucherFlowStepId = 'STRATEGY' | 'RECOMMENDATION' | 'REVIEW';

export interface StepperStep {
  readonly id: VoucherFlowStepId;
  readonly label: string;
  readonly route: string;
  readonly complete: boolean;
  readonly enabled: boolean;
}


