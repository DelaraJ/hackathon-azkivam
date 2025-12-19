import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { VoucherFlowService } from '../../../services/voucher-flow.service';
import { VoucherApiService } from '../../../services/voucher-api.service';
import { StepperStep, VoucherGoal, VoucherStrategyInput } from '../../../models/voucher-flow.models';

@Component({
  selector: 'azk-voucher-strategy-page',
  imports: [],
  template: `
    <div class="page">
      <div class="head">
        <div>
          <div class="h1">ساخت برنامه ریزی تخفیف</div>
          <div class="muted">ابتدا هدف خود را مشخص کنید تا یک پیشنهاد مناسب برای شما آماده کنیم</div>
        </div>
        <button class="btn btn--ghost" type="button" (click)="reset()">بازنشانی</button>
      </div>

      <section class="azk-card card">
        <div class="card__title">مرحله ۱ — هدف تخفیف</div>
        <div class="card__subtitle">
          هدف شما کمک می‌کند تخفیف به شکل مؤثرتری پیشنهاد شود        
        </div>

        <div class="grid">
          @for (g of goals; track g.id) {
            <button
              type="button"
              class="choice"
              [class.choice--active]="selectedGoal() === g.id"
              (click)="selectedGoal.set(g.id)"
            >
              <div class="choice__title">{{ g.label }}</div>
              <div class="choice__desc">{{ g.desc }}</div>
            </button>
          }
        </div>

        <div class="row">
          <div class="field">
            <label class="label" for="budget">حداکثر بودجه تخفیف (اختیاری)</label>
            <input
              id="budget"
              class="input"
              type="text"
              [value]="formatBudget(budgetInput())"
              (input)="onBudgetInput($event)"
              placeholder="مثلاً ۱۰٬۰۰۰٬۰۰۰ ریال"
            />
            <div class="hint">اگر وارد شود، تخفیف‌ها طوری پیشنهاد می‌شوند که از این مبلغ بیشتر نشوند</div>
          </div>
        </div>

        <div class="actions">
          <button class="btn" type="button" [disabled]="!selectedGoal()" (click)="continue()">
          ادامه و دریافت پیشنهاد
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .page {
        display: grid;
        gap: 16px;
        direction: rtl;
        font-family: 'Vazirmatn', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, 'Noto Sans',
          'Liberation Sans', sans-serif;
      }
      .head {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px;
        direction: rtl;
      }
      .h1 {
        font-size: 24px;
        font-weight: 900;
        text-align: right;
      }
      .muted {
        color: var(--muted);
        font-size: 13px;
        margin-top: 4px;
        text-align: right;
      }
      .card {
        padding: 16px;
        direction: rtl;
        text-align: right;
      }
      .card__title {
        font-weight: 850;
        font-size: 16px;
        text-align: right;
      }
      .card__subtitle {
        margin-top: 6px;
        color: var(--muted);
        font-size: 13px;
        text-align: right;
      }
      .grid {
        margin-top: 14px;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .choice {
        text-align: right;
        padding: 12px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.09);
        background: rgba(255, 255, 255, 0.03);
        color: var(--text);
        cursor: pointer;
        direction: rtl;
      }
      .choice:hover {
        background: rgba(255, 255, 255, 0.05);
      }
      .choice--active {
        border-color: rgba(110, 231, 255, 0.3);
        box-shadow: 0 0 0 3px rgba(110, 231, 255, 0.12);
      }
      .choice__title {
        font-weight: 800;
      }
      .choice__desc {
        margin-top: 6px;
        color: var(--muted);
        font-size: 12px;
        line-height: 1.35;
      }
      .row {
        margin-top: 14px;
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
      }
      .label {
        display: block;
        font-size: 12px;
        color: var(--muted);
        margin-bottom: 6px;
        text-align: right;
      }
      .input {
        width: min(420px, 100%);
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid var(--border);
        background: rgba(255, 255, 255, 0.04);
        color: var(--text);
        outline: none;
        direction: ltr;
        text-align: left;
      }
      .input:focus {
        border-color: rgba(110, 231, 255, 0.35);
        box-shadow: 0 0 0 3px rgba(110, 231, 255, 0.12);
      }
      .hint {
        margin-top: 6px;
        font-size: 12px;
        color: var(--subtle);
        text-align: right;
      }
      .actions {
        margin-top: 16px;
        display: flex;
        justify-content: flex-start;
        direction: rtl;
      }
      .btn {
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: linear-gradient(135deg, rgba(110, 231, 255, 0.16), rgba(167, 139, 250, 0.14));
        color: var(--text);
        padding: 10px 14px;
        border-radius: 14px;
        cursor: pointer;
        font-weight: 750;
        direction: rtl;
        text-align: center;
      }
      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .btn--ghost {
        background: rgba(255, 255, 255, 0.03);
      }
      @media (max-width: 820px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoucherStrategyPageComponent {
  private readonly router = inject(Router);
  private readonly flow = inject(VoucherFlowService);
  private readonly api = inject(VoucherApiService);

  readonly selectedGoal = signal<VoucherGoal | null>(this.flow.snapshot.strategy.goal);
  readonly budgetInput = signal<string>(
    this.flow.snapshot.strategy.maxDiscountBudget?.toString() ?? ''
  );

  // Format number with comma separators
  formatBudget(value: string): string {
    if (!value || value.trim() === '') return '';
    // Remove any existing commas and non-numeric characters except digits
    const numericValue = value.replace(/[^\d]/g, '');
    if (numericValue === '') return '';
    // Add comma separators (thousand separators)
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Handle budget input and parse the value
  onBudgetInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    // Remove commas and keep only digits
    const numericValue = value.replace(/[^\d]/g, '');
    this.budgetInput.set(numericValue);
  }

  readonly steps = computed<readonly StepperStep[]>(() => {
    const hasGoal = this.selectedGoal() !== null;
    const hasRec = this.flow.snapshot.recommendation !== null;
    return [
      {
        id: 'STRATEGY',
        label: 'هدف تخفیف',
        route: '/vouchers/strategy',
        complete: hasGoal,
        enabled: true
      },
      {
        id: 'RECOMMENDATION',
        label: 'پیشنهاد تخفیف',
        route: '/vouchers/recommendation',
        complete: hasRec,
        enabled: hasGoal
      }
    ];
  });

  protected readonly goals: readonly { id: VoucherGoal; label: string; desc: string }[] = [
    { id: 'USER_ACQUISITION', label: 'جذب مشتری جدید', desc: 'برای آوردن مشتری‌های جدید و سفارش اول' },
    { id: 'SALES_GROWTH', label: 'افزایش فروش', desc: 'برای بالا بردن تعداد سفارش‌ها در شعب' },
    { id: 'PROFIT_INCREASE', label: 'افزایش سود', desc: 'تمرکز روی محصولات و مشتریان سودآور' },
    { id: 'TARGET_USERS', label: 'جذب کاربران از دست رفته', desc: 'برگرداندن یا فعال‌سازی دوباره کاربران ریزشی' }
  ];

  private readonly goalToApiStrategyMap: Record<VoucherGoal, string> = {
    'USER_ACQUISITION': 'user_attraction',
    'SALES_GROWTH': 'increase_sells',
    'PROFIT_INCREASE': 'increase_revenue',
    'TARGET_USERS': 'churn_user_attraction'
  };

  reset(): void {
    this.flow.reset();
    this.selectedGoal.set(null);
    this.budgetInput.set('');
  }

  continue(): void {
    const goal = this.selectedGoal();
    if (!goal) return;
    const raw = this.budgetInput().trim();
    const maxDiscountBudget = raw.length > 0 ? Number(raw) : undefined;
    const strategy: VoucherStrategyInput = {
      goal,
      maxDiscountBudget: Number.isFinite(maxDiscountBudget ?? NaN) ? maxDiscountBudget : undefined
    };
    this.flow.setStrategy(strategy);
    
    // فراخوانی API و ذخیره پاسخ به صورت global
    const payableAmount = maxDiscountBudget && Number.isFinite(maxDiscountBudget) ? maxDiscountBudget : 0;
    const apiStrategy = this.goalToApiStrategyMap[goal];
    this.api.getVoucherRecommendations(apiStrategy, payableAmount).subscribe({
      next: (response) => {
        this.flow.setRecommendationResponse(response);
        console.log('پاسخ API ذخیره شد:', response);
        console.log('اطلاعات ذخیره شده در state global:', this.flow.snapshot.recommendationResponse);
      },
      error: (error) => {
        console.error('خطا در دریافت پیشنهادات:', error);
      }
    });
    
    void this.router.navigateByUrl('/vouchers/recommendation');
  }
}


