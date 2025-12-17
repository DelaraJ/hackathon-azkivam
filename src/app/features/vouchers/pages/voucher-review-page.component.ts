import { DecimalPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StepperComponent } from '../../../shared/components/stepper/stepper.component';
import { VoucherFlowService } from '../../../services/voucher-flow.service';
import { StepperStep, VoucherRecommendation } from '../../../models/voucher-flow.models';

@Component({
  selector: 'azk-voucher-review-page',
  imports: [DecimalPipe, NgIf, StepperComponent],
  template: `
    <div class="page">
      <div class="head">
        <div>
          <div class="h1">بررسی و تأیید</div>
          <div class="muted">مرحله ۳ — پس از بررسی حوزه و محافظ‌ها تأیید کنید.</div>
        </div>
        <button class="btn btn--ghost" type="button" (click)="back()">بازگشت</button>
      </div>

      <azk-stepper [steps]="steps()"></azk-stepper>

      <section class="azk-card card" *ngIf="enabled(); else blocked">
        <div class="card__title">خلاصه طرح</div>
        <div class="card__subtitle">این خلاصه از هدف انتخابی شما + قوانین نمونه تولید شده است.</div>

        <div class="summary" *ngIf="rec() as r">
          <div class="summary__row"><span class="k">تخفیف</span><b class="v">{{ discountText(r) }}</b></div>
          <div class="summary__row"><span class="k">بخش‌ها</span><b class="v">{{ r.userSegments.join(', ') }}</b></div>
          <div class="summary__row"><span class="k">حوزه</span><b class="v">{{ scopeText(r) }}</b></div>
          <div class="summary__row">
            <span class="k">محدوده قیمت واجد شرایط</span>
            <b class="v">{{ r.productPriceRange.min | number }} – {{ r.productPriceRange.max | number }}</b>
          </div>
        </div>

        <div class="disclaimer">
          <div class="disclaimer__title">مهم</div>
          <div class="disclaimer__text">“This plan only applies to users paying via Azki”</div>
          <div class="disclaimer__meta">
            این یک طرح شبیه‌سازی شده است. قبل از راه‌اندازی واقعی، بررسی‌های خط‌مشی و کنترل‌های تقلب را به بک‌اند خود متصل کنید.
          </div>
        </div>

        <div class="actions">
          <button class="btn btn--ghost" type="button" (click)="edit()">ویرایش استراتژی</button>
          <button class="btn" type="button" (click)="confirm()">تأیید طرح</button>
        </div>

        <div class="confirmed" *ngIf="confirmed()">
          <div class="confirmed__title">تأیید شد</div>
          <div class="muted">تأیید نمونه به صورت محلی ثبت شد (بدون بک‌اند).</div>
        </div>
      </section>

      <ng-template #blocked>
        <section class="azk-card card">
          <div class="card__title">پیشنهاد مورد نیاز است</div>
          <div class="card__subtitle">ابتدا یک پیشنهاد تولید کنید، سپس بررسی و تأیید کنید.</div>
          <div class="actions">
            <button class="btn" type="button" (click)="goRecommendation()">رفتن به پیشنهاد</button>
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
      .summary {
        margin-top: 14px;
        padding: 12px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.02);
        display: grid;
        gap: 10px;
        direction: rtl;
        text-align: right;
      }
      .summary__row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        direction: rtl;
      }
      .k {
        color: var(--muted);
        font-size: 12px;
        text-align: right;
      }
      .v {
        font-size: 13px;
        text-align: right;
      }
      .disclaimer {
        margin-top: 14px;
        padding: 12px;
        border-radius: 14px;
        border: 1px solid rgba(251, 191, 36, 0.22);
        background: rgba(251, 191, 36, 0.08);
        direction: rtl;
        text-align: right;
      }
      .disclaimer__title {
        font-weight: 900;
        text-align: right;
      }
      .disclaimer__text {
        margin-top: 6px;
        font-weight: 850;
        text-align: right;
      }
      .disclaimer__meta {
        margin-top: 6px;
        color: rgba(255, 246, 214, 0.9);
        font-size: 12px;
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
      .confirmed {
        margin-top: 14px;
        padding: 12px;
        border-radius: 14px;
        border: 1px solid rgba(52, 211, 153, 0.22);
        background: rgba(52, 211, 153, 0.08);
        direction: rtl;
        text-align: right;
      }
      .confirmed__title {
        font-weight: 900;
        text-align: right;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoucherReviewPageComponent {
  private readonly router = inject(Router);
  private readonly flow = inject(VoucherFlowService);

  readonly enabled = computed(() => this.flow.snapshot.recommendation !== null);
  readonly confirmed = computed(() => this.flow.snapshot.confirmed);

  readonly steps = computed<readonly StepperStep[]>(() => {
    const hasGoal = this.flow.snapshot.strategy.goal !== null;
    const hasRec = this.flow.snapshot.recommendation !== null;
    return [
      { id: 'STRATEGY', label: 'استراتژی', route: '/vouchers/strategy', complete: hasGoal, enabled: true },
      { id: 'RECOMMENDATION', label: 'پیشنهاد', route: '/vouchers/recommendation', complete: hasRec, enabled: hasGoal },
      { id: 'REVIEW', label: 'بررسی و تأیید', route: '/vouchers/review', complete: this.flow.snapshot.confirmed, enabled: hasRec }
    ];
  });

  readonly rec = computed<VoucherRecommendation | null>(() => this.flow.snapshot.recommendation);

  discountText(r: VoucherRecommendation): string {
    return r.discountType === 'PERCENT' ? `${r.discountValue}% off` : `${r.discountValue.toLocaleString()} off`;
  }

  scopeText(r: VoucherRecommendation): string {
    switch (r.scope.type) {
      case 'ALL_BRANCHES':
        return 'همه شعب';
      case 'BRANCHES':
        return `شعب انتخابی (${(r.scope.branchIds ?? []).length})`;
      case 'CATEGORY':
        return `دسته: ${r.scope.category ?? '—'}`;
    }
  }

  goRecommendation(): void {
    void this.router.navigateByUrl('/vouchers/recommendation');
  }

  back(): void {
    void this.router.navigateByUrl('/vouchers/recommendation');
  }

  edit(): void {
    void this.router.navigateByUrl('/vouchers/strategy');
  }

  confirm(): void {
    this.flow.confirm();
  }
}


