import { DecimalPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StepperComponent } from '../../../shared/components/stepper/stepper.component';
import { VoucherFlowService } from '../../../services/voucher-flow.service';
import { StepperStep, VoucherRecommendation } from '../../../models/voucher-flow.models';

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

      <section class="azk-card card" *ngIf="enabled(); else blocked">
        <div class="card__title">پیشنهاد پیشنهادی سیستم</div>
        <div class="card__subtitle">بر اساس اطلاعات فروش و رفتار کاربران شما</div>

        <div class="grid" *ngIf="rec() as r">
          <div class="tile">
            <div class="tile__label">میزان تخفیف</div>
            <div class="tile__value">{{ discountText(r) }}</div>
            <div class="tile__hint">
              این مقدار برای افزایش فروش و کنترل هزینه انتخاب شده است            </div>
            </div>
          <div class="tile">
            <div class="tile__label">به چه کاربرانی داده شود</div>
            <div class="tile__value">{{ r.userSegments.join(', ') }}</div>
          </div>
          <div class="tile">
            <div class="tile__label">کجا اعمال شود</div>
            <div class="tile__value">{{ scopeText(r) }}</div>
          </div>
          <div class="tile">
            <div class="tile__label">محدوده قیمت محصول</div>
            <div class="tile__value">{{ r.productPriceRange.min | number }} تا {{ r.productPriceRange.max | number }}</div>
          </div>
        </div>

        <div class="two">
          <div class="box">
            <div class="box__title">چرا این تخفیف پیشنهاد شده؟</div>
            <ul class="list" *ngIf="rec() as r">
              @for (n of r.rationale; track n) {
                <li>{{ n }}</li>
              }
            </ul>
          </div>

          <div class="box">
            <div class="box__title">محدودیت‌ها</div>
            <ul class="list" *ngIf="rec() as r">
              @for (g of r.guardrails; track g) {
                <li>{{ g }}</li>
              }
            </ul>
          </div>
        </div>

        <div class="actions">
          <button class="btn btn--ghost" type="button" (click)="regenerate()">تغییر پیشنهاد</button>
          <button class="btn" type="button" (click)="continue()">ادامه و تأیید</button>
        </div>
      </section>

      <ng-template #blocked>
        <section class="azk-card card">
          <div class="card__title">پیشنهادی وجود ندارد</div>
          <div class="card__subtitle">ابتدا هدف تخفیف را مشخص کنید تا پیشنهاد آماده شود</div>
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
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
      }
      .tile {
        padding: 12px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.02);
        direction: rtl;
        text-align: right;
      }
      .tile__label {
        color: var(--muted);
        font-size: 12px;
        text-align: right;
      }
      .tile__value {
        margin-top: 8px;
        font-weight: 850;
        text-align: right;
      }
      .tile__hint {
        margin-top: 6px;
        color: var(--subtle);
        font-size: 12px;
        text-align: right;
      }
      .two {
        margin-top: 14px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .box {
        padding: 12px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.02);
        direction: rtl;
        text-align: right;
      }
      .box__title {
        font-weight: 800;
        margin-bottom: 10px;
        text-align: right;
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
        .grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 820px) {
        .two {
          grid-template-columns: 1fr;
        }
        .grid {
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
    const hasRec = this.flow.snapshot.recommendation !== null;
    return [
      { id: 'STRATEGY', label: 'استراتژی', route: '/vouchers/strategy', complete: hasGoal, enabled: true },
      {
        id: 'RECOMMENDATION',
        label: 'پیشنهاد',
        route: '/vouchers/recommendation',
        complete: hasRec,
        enabled: hasGoal
      },
      { id: 'REVIEW', label: 'بررسی و تأیید', route: '/vouchers/review', complete: this.flow.snapshot.confirmed, enabled: hasRec }
    ];
  });

  readonly rec = computed<VoucherRecommendation | null>(() => {
    if (!this.enabled()) return null;
    return this.flow.snapshot.recommendation ?? this.flow.generateRecommendation();
  });

  discountText(r: VoucherRecommendation): string {
    return r.discountType === 'PERCENT' ? `${r.discountValue}% تخفیف` : `${r.discountValue.toLocaleString()} تومان تخفیف`;
  }

  scopeText(r: VoucherRecommendation): string {
    switch (r.scope.type) {
      case 'ALL_BRANCHES':
        return 'همه شعب';
      case 'BRANCHES':
        return `شعب انتخاب‌شده  (${(r.scope.branchIds ?? []).length})`;
      case 'CATEGORY':
        return `دسته: ${r.scope.category ?? '—'}`;
    }
  }

  goStrategy(): void {
    void this.router.navigateByUrl('/vouchers/strategy');
  }

  back(): void {
    void this.router.navigateByUrl('/vouchers/strategy');
  }

  regenerate(): void {
    if (!this.enabled()) return;
    this.flow.generateRecommendation();
  }

  continue(): void {
    void this.router.navigateByUrl('/vouchers/review');
  }
}


