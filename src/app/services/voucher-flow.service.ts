import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import {
  VoucherFlowState,
  VoucherGoal,
  VoucherRecommendation,
  VoucherStrategyInput
} from '../models/voucher-flow.models';
import { VoucherRecommendationResponse } from '../models/voucher-recommendation-response.model';

const INITIAL_STATE: VoucherFlowState = {
  strategy: { goal: null },
  recommendation: null,
  recommendationResponse: null,
  confirmed: false
};

@Injectable({ providedIn: 'root' })
export class VoucherFlowService {
  private readonly stateSubject = new BehaviorSubject<VoucherFlowState>(INITIAL_STATE);
  readonly state$: Observable<VoucherFlowState> = this.stateSubject.asObservable();

  readonly strategy$ = this.state$.pipe(map((s) => s.strategy));
  readonly recommendation$ = this.state$.pipe(map((s) => s.recommendation));
  readonly recommendationResponse$ = this.state$.pipe(map((s) => s.recommendationResponse));
  readonly confirmed$ = this.state$.pipe(map((s) => s.confirmed));

  get snapshot(): VoucherFlowState {
    return this.stateSubject.value;
  }

  reset(): void {
    this.stateSubject.next(INITIAL_STATE);
  }

  setStrategy(input: VoucherStrategyInput): void {
    const next: VoucherFlowState = {
      ...this.snapshot,
      strategy: input,
      recommendation: null,
      recommendationResponse: null,
      confirmed: false
    };
    this.stateSubject.next(next);
  }

  setRecommendationResponse(response: VoucherRecommendationResponse): void {
    const next: VoucherFlowState = {
      ...this.snapshot,
      recommendationResponse: response
    };
    this.stateSubject.next(next);
  }

  generateRecommendation(): VoucherRecommendation {
    const { goal, maxDiscountBudget } = this.snapshot.strategy;
    if (!goal) {
      throw new Error('Cannot generate recommendation without a selected goal.');
    }

    const budget = typeof maxDiscountBudget === 'number' ? Math.max(0, maxDiscountBudget) : undefined;

    // Simple explainable rules (mock). No ML, no optimization — deterministic & auditable.
    const base = this.recommendationByGoal(goal);
    const capped = this.applyBudgetGuardrail(base, budget);

    const next: VoucherFlowState = { ...this.snapshot, recommendation: capped, confirmed: false };
    this.stateSubject.next(next);
    return capped;
  }

  confirm(): void {
    if (!this.snapshot.recommendationResponse) {
      throw new Error('Cannot confirm without a recommendation response.');
    }
    this.stateSubject.next({ ...this.snapshot, confirmed: true });
  }

  private recommendationByGoal(goal: VoucherGoal): VoucherRecommendation {
    switch (goal) {
      case 'USER_ACQUISITION':
        return {
          discountType: 'PERCENT',
          discountValue: 20,
          userSegments: ['NEW_USERS', 'PRICE_SENSITIVE'],
          scope: { type: 'ALL_BRANCHES' },
          productPriceRange: { min: 150_000, max: 900_000 },
          rationale: [
            'انگیزه‌های کاربر جدید اصطکاک خرید اول را کاهش می‌دهد.',
            'تخفیف‌های درصدی درک آسانی دارند و برای جذب مؤثر هستند.',
            'اقلام با قیمت متوسط تعادل بین جذابیت و کنترل بودجه را برقرار می‌کند.'
          ],
          guardrails: [
            'از ترکیب با سایر کمپین‌ها اجتناب کنید (خط‌مشی نمونه).',
            'SKUهای قبلاً تخفیف‌خورده را حذف کنید تا از فرسایش حاشیه سود جلوگیری شود.'
          ]
        };
      case 'PROFIT_INCREASE':
        return {
          discountType: 'AMOUNT',
          discountValue: 80_000,
          userSegments: ['HIGH_VALUE', 'FREQUENT_BUYERS'],
          scope: { type: 'CATEGORY', category: 'High-margin staples' },
          productPriceRange: { min: 300_000, max: 1_600_000 },
          rationale: [
            'تخفیف‌های مبلغ ثابت می‌توانند حاشیه سود را بهتر از درصدهای بالا محافظت کنند.',
            'هدف‌گیری کاربران وفادار/با ارزش بالا تبدیل را با نشت کمتر بهبود می‌بخشد.',
            'تمرکز بر دسته‌های با حاشیه سود بالا برای حفظ سودآوری.'
          ],
          guardrails: [
            'فقط زمانی اعمال کنید که سبد خرید شامل اقلام واجد شرایط با حاشیه سود بالا باشد.',
            'حداقل ارزش سبد را تنظیم کنید تا سوءاستفاده کاهش یابد.'
          ]
        };
      case 'TARGET_USERS':
        return {
          discountType: 'PERCENT',
          discountValue: 15,
          userSegments: ['CHURN_RISK', 'FREQUENT_BUYERS'],
          scope: { type: 'BRANCHES', branchIds: ['b-01', 'b-02'] },
          productPriceRange: { min: 120_000, max: 1_200_000 },
          rationale: [
            'کاربران در معرض ریسک ترک به پیشنهادهای محدود به زمان خوب پاسخ می‌دهند.',
            'هدف‌گیری شعبه می‌تواند عملکرد ضعیف محلی را اصلاح کند (نمونه).',
            'تخفیف متوسط نرخ بازگشت را بدون هزینه بیش از حد بهبود می‌بخشد.'
          ],
          guardrails: [
            'از پنجره‌های اعتبار کوتاه استفاده کنید تا از سوءاستفاده مکرر جلوگیری شود.',
            'تعداد استفاده هر کاربر را محدود کنید.'
          ]
        };
      case 'SALES_GROWTH':
        return {
          discountType: 'PERCENT',
          discountValue: 12,
          userSegments: ['FREQUENT_BUYERS', 'PRICE_SENSITIVE'],
          scope: { type: 'ALL_BRANCHES' },
          productPriceRange: { min: 80_000, max: 2_000_000 },
          rationale: [
            'دسترسی گسترده افزایش حجم را زمانی که هدف رشد است پشتیبانی می‌کند.',
            'درصد پایین‌تر کمپین را برای مدت طولانی‌تری پایدار نگه می‌دارد.',
            'محدوده قیمت گسترده هم سبدهای ورودی و هم پریمیوم را پوشش می‌دهد.'
          ],
          guardrails: [
            'سطح موجودی را نظارت کنید تا از تبلیغ اقلام ناموجود اجتناب شود.',
            'اگر استفاده از حد انتظارات فراتر رفت، کمپین را محدود کنید.'
          ]
        };
    }
  }

  private applyBudgetGuardrail(
    rec: VoucherRecommendation,
    maxBudget?: number
  ): VoucherRecommendation {
    if (maxBudget === undefined) return rec;

    // Mock: if budget is tight, reduce discount intensity + narrow price range.
    if (maxBudget > 0 && maxBudget < 1_000_000) {
      const lowered =
        rec.discountType === 'PERCENT'
          ? Math.max(5, Math.min(rec.discountValue, 10))
          : Math.max(20_000, Math.min(rec.discountValue, 50_000));
      return {
        ...rec,
        discountValue: lowered,
        productPriceRange: {
          min: rec.productPriceRange.min,
          max: Math.min(rec.productPriceRange.max, 900_000)
        },
        rationale: [...rec.rationale, `سقف بودجه اعمال شد: شدت تخفیف برای تطابق با حداکثر بودجه کاهش یافت (نمونه).`],
        guardrails: [...rec.guardrails, 'سقف بودجه فعال شد: کمپین را زمانی که بودجه تمام شد متوقف کنید (نمونه).']
      };
    }

    // Mock: for large budgets, allow slightly wider range but keep discount stable.
    if (maxBudget >= 5_000_000) {
      return {
        ...rec,
        productPriceRange: {
          min: Math.max(50_000, rec.productPriceRange.min - 50_000),
          max: rec.productPriceRange.max + 200_000
        },
        rationale: [...rec.rationale, 'سقف بودجه کافی است: محدوده قیمت واجد شرایط گسترش یافت (نمونه).']
      };
    }

    return rec;
  }
}


