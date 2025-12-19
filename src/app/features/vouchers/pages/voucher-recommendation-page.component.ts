import { DecimalPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { StepperComponent } from '../../../shared/components/stepper/stepper.component';
import { VoucherFlowService } from '../../../services/voucher-flow.service';
import { StepperStep } from '../../../models/voucher-flow.models';
import { VoucherRecommendationResponse } from '../../../models/voucher-recommendation-response.model';

@Component({
  selector: 'azk-voucher-recommendation-page',
  imports: [DecimalPipe, NgIf, StepperComponent],
  template: `
    <div class="page">
      <div class="head">
        <div>
          <div class="h1">پیشنهاد تخفیف</div>
          <div class="muted">مرحله ۲ — پیشنهاد آماده برای افزایش فروش شما.</div>
        </div>
        <button class="btn btn--ghost" type="button" (click)="back()">بازگشت</button>
      </div>

      <azk-stepper [steps]="steps()"></azk-stepper>

      <section class="azk-card card" *ngIf="apiResponse() as r; else noData">
        <div class="card__header">
          <div class="card__title">{{ r.name }}</div>
          <div class="card__subtitle">
            <span class="info-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              تاریخ کمپین: {{ r.campaign_dt }}
            </span>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <div class="info-item__label">میزان تخفیف</div>
            <div class="info-item__value">{{ r.amount_voucher | number }} تومان</div>
            <div class="info-item__hint">مبلغ تخفیف برای هر کاربر</div>
          </div>
          <div class="info-item">
            <div class="info-item__label">حداقل مبلغ سبد خرید</div>
            <div class="info-item__value">{{ r.basketAmount_voucher | number }} تومان</div>
            <div class="info-item__hint">حداقل مبلغ برای استفاده از تخفیف</div>
          </div>
          <div class="info-item">
            <div class="info-item__label">تعداد کاربران</div>
            <div class="info-item__value highlight">{{ r.user_count | number }} نفر</div>
            <div class="info-item__hint">تعداد کاربران هدف</div>
          </div>
          <div class="info-item">
            <div class="info-item__label">کل مبلغ تخفیف</div>
            <div class="info-item__value highlight">{{ r.sum_voucher_amount | number }} تومان</div>
            <div class="info-item__hint">مجموع کل تخفیف‌های پیشنهادی</div>
          </div>
        </div>

        <div class="info-grid secondary">
          <div class="info-item">
            <div class="info-item__label">دسته کاربران</div>
            <div class="info-item__value">{{ r.users_category }}</div>
          </div>
          <div class="info-item">
            <div class="info-item__label">طبقه قیمتی کاربران</div>
            <div class="info-item__value">{{ r.user_price_class }}</div>
          </div>
        </div>

        <div class="content-boxes">
          <div class="content-box">
            <div class="content-box__title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              دلیل پیشنهاد
            </div>
            <div class="content-box__text">{{ r.why }}</div>
          </div>

          <div class="content-box">
            <div class="content-box__title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              نمونه پیامک
            </div>
            <div class="content-box__text sms-text">{{ r.sample_sms }}</div>
          </div>
        </div>

        <div class="actions">
          <button class="btn btn--ghost" type="button" (click)="regenerate()">تغییر پیشنهاد</button>
          <button class="btn" type="button" (click)="continue()">ادامه و تأیید</button>
        </div>
      </section>

      <ng-template #noData>
        <section class="azk-card card">
          <div class="card__title">پیشنهادی وجود ندارد</div>
          <div class="card__subtitle">ابتدا هدف تخفیف را مشخص کنید و پیشنهاد را دریافت کنید</div>
          <div class="actions">
            <button class="btn" type="button" (click)="goStrategy()">رفتن به مرحله قبل</button>
          </div>
        </section>
      </ng-template>
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
        padding: 20px;
        direction: rtl;
        text-align: right;
      }
      .card__header {
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      .card__title {
        font-weight: 900;
        font-size: 18px;
        line-height: 1.4;
        text-align: right;
        margin-bottom: 8px;
      }
      .card__subtitle {
        color: var(--muted);
        font-size: 13px;
        text-align: right;
      }
      .info-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: rgba(110, 231, 255, 0.1);
        border: 1px solid rgba(110, 231, 255, 0.2);
        border-radius: 8px;
        color: rgba(110, 231, 255, 0.9);
        font-size: 12px;
      }
      .info-badge svg {
        width: 14px;
        height: 14px;
      }
      .info-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-bottom: 16px;
      }
      .info-grid.secondary {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        margin-bottom: 20px;
      }
      .info-item {
        padding: 16px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.03);
        transition: all 0.2s ease;
      }
      .info-item:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(110, 231, 255, 0.2);
      }
      .info-item__label {
        color: var(--muted);
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 8px;
        text-align: right;
      }
      .info-item__value {
        font-weight: 850;
        font-size: 18px;
        color: var(--text);
        text-align: right;
        margin-bottom: 6px;
      }
      .info-item__value.highlight {
        color: rgba(110, 231, 255, 1);
        font-size: 20px;
      }
      .info-item__hint {
        color: var(--subtle);
        font-size: 11px;
        text-align: right;
        line-height: 1.4;
      }
      .content-boxes {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 20px;
      }
      .content-box {
        padding: 16px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.03);
      }
      .content-box__title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 800;
        font-size: 14px;
        margin-bottom: 12px;
        color: var(--text);
        text-align: right;
      }
      .content-box__title svg {
        width: 18px;
        height: 18px;
        color: rgba(110, 231, 255, 0.8);
      }
      .content-box__text {
        color: var(--muted);
        font-size: 13px;
        line-height: 1.7;
        text-align: right;
      }
      .content-box__text.sms-text {
        font-family: 'Vazirmatn', 'Courier New', monospace;
        background: rgba(255, 255, 255, 0.05);
        padding: 12px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 12px;
        direction: rtl;
        word-break: break-word;
      }
      .list {
        margin: 0;
        padding-right: 18px;
        padding-left: 0;
        color: var(--muted);
        font-size: 12px;
        display: grid;
        gap: 6px;
        direction: rtl;
        text-align: right;
      }
      .actions {
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
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
      .btn--ghost {
        background: rgba(255, 255, 255, 0.03);
      }
      @media (max-width: 1100px) {
        .info-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .info-grid.secondary {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 820px) {
        .content-boxes {
          grid-template-columns: 1fr;
        }
        .info-grid {
          grid-template-columns: 1fr;
        }
        .info-grid.secondary {
          grid-template-columns: 1fr;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoucherRecommendationPageComponent {
  private readonly router = inject(Router);
  private readonly flow = inject(VoucherFlowService);

  readonly enabled = computed(() => this.flow.snapshot.strategy.goal !== null);

  readonly steps = computed<readonly StepperStep[]>(() => {
    const hasGoal = this.flow.snapshot.strategy.goal !== null;
    const hasResponse = this.flow.snapshot.recommendationResponse !== null;
    return [
      { id: 'STRATEGY', label: 'استراتژی', route: '/vouchers/strategy', complete: hasGoal, enabled: true },
      {
        id: 'RECOMMENDATION',
        label: 'پیشنهاد',
        route: '/vouchers/recommendation',
        complete: hasResponse,
        enabled: hasGoal
      },
      { id: 'REVIEW', label: 'بررسی و تأیید', route: '/vouchers/review', complete: this.flow.snapshot.confirmed, enabled: hasResponse }
    ];
  });

  readonly apiResponse = toSignal(this.flow.recommendationResponse$, { initialValue: null });

  goStrategy(): void {
    void this.router.navigateByUrl('/vouchers/strategy');
  }

  back(): void {
    void this.router.navigateByUrl('/vouchers/strategy');
  }

  regenerate(): void {
    if (!this.enabled()) return;
    // می‌توانید در صورت نیاز دوباره API را فراخوانی کنید
    void this.router.navigateByUrl('/vouchers/strategy');
  }

  continue(): void {
    void this.router.navigateByUrl('/vouchers/review');
  }
}


