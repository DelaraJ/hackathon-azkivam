import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StepperComponent } from '../../../shared/components/stepper/stepper.component';
import { VoucherFlowService } from '../../../services/voucher-flow.service';
import { StepperStep, VoucherGoal, VoucherStrategyInput } from '../../../models/voucher-flow.models';

@Component({
  selector: 'azk-voucher-strategy-page',
  imports: [StepperComponent],
  template: `
    <div class="page">
      <div class="head">
        <div>
          <div class="h1">پیشنهاد کوپن</div>
          <div class="muted">Pick a strategy first. We’ll generate a safe, explainable mock plan.</div>
        </div>
        <button class="btn btn--ghost" type="button" (click)="reset()">بازنشانی</button>
      </div>

      <azk-stepper [steps]="steps()"></azk-stepper>

      <section class="azk-card card">
        <div class="card__title">مرحله ۱ — انتخاب استراتژی</div>
        <div class="card__subtitle">
          یک هدف انتخاب کنید. بودجه اختیاری محدودیت تخفیف را تعیین می‌کند (برای ایمنی توصیه می‌شود).
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
            <label class="label" for="budget">Max discount budget (optional)</label>
            <input
              id="budget"
              class="input"
              type="number"
              min="0"
              step="10000"
              [value]="budgetInput()"
              (input)="budgetInput.set(($any($event.target).value ?? '').toString())"
              placeholder="e.g. 1000000"
            />
            <div class="hint">This is a safety cap. We’ll reduce discount intensity if the cap is tight (mock).</div>
          </div>
        </div>

        <div class="actions">
          <button class="btn" type="button" [disabled]="!selectedGoal()" (click)="continue()">
            ادامه به پیشنهاد
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

  readonly selectedGoal = signal<VoucherGoal | null>(this.flow.snapshot.strategy.goal);
  readonly budgetInput = signal<string>(
    this.flow.snapshot.strategy.maxDiscountBudget?.toString() ?? ''
  );

  readonly steps = computed<readonly StepperStep[]>(() => {
    const hasGoal = this.selectedGoal() !== null;
    const hasRec = this.flow.snapshot.recommendation !== null;
    return [
      {
        id: 'STRATEGY',
        label: 'استراتژی',
        route: '/vouchers/strategy',
        complete: hasGoal,
        enabled: true
      },
      {
        id: 'RECOMMENDATION',
        label: 'پیشنهاد',
        route: '/vouchers/recommendation',
        complete: hasRec,
        enabled: hasGoal
      },
      {
        id: 'REVIEW',
        label: 'بررسی و تأیید',
        route: '/vouchers/review',
        complete: this.flow.snapshot.confirmed,
        enabled: hasRec
      }
    ];
  });

  protected readonly goals: readonly { id: VoucherGoal; label: string; desc: string }[] = [
    { id: 'USER_ACQUISITION', label: 'جذب کاربر', desc: 'جذب مشتریان جدید و سفارش‌های اول.' },
    { id: 'PROFIT_INCREASE', label: 'افزایش سود', desc: 'تمرکز بر دسته‌های با حاشیه سود بالا و خریداران وفادار.' },
    { id: 'TARGET_USERS', label: 'هدف‌گیری کاربران خاص', desc: 'درگیر کردن کاربران در معرض ریسک ترک یا بخش‌های انتخابی به صورت ایمن.' },
    { id: 'SALES_GROWTH', label: 'رشد فروش', desc: 'افزایش حجم فروش در تمام شعب با تخفیف‌های کنترل شده.' }
  ];

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
    void this.router.navigateByUrl('/vouchers/recommendation');
  }
}


