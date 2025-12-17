import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../../services/analytics.service';
import { ChartWrapperComponent } from '../../../shared/components/chart-wrapper/chart-wrapper.component';
import {
  BranchSales,
  ProductSales,
  SalesForecastPoint,
  SalesOverTimeSeries
} from '../../../models/analytics.models';

type SvgPoint = Readonly<{ x: number; y: number }>;

@Component({
  selector: 'azk-dashboard-page',
  imports: [AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, NgIf, RouterLink, ChartWrapperComponent],
  template: `
    <div class="page">
      <div class="page__head">
        <div>
          <div class="h1">داشبورد</div>
          <div class="muted">تحلیل‌ها توسط سرویس‌های نمونه پشتیبانی می‌شوند (آماده برای جایگزینی با APIهای واقعی).</div>
        </div>
      </div>

      <section class="cta azk-card">
        <div class="cta__left">
          <div class="cta__title">ایجاد طرح کوپن</div>
          <div class="cta__desc">
            یک جریان پیشنهاد هدایت‌شده و مبتنی بر قوانین با محافظ‌ها و اخطار واضح آزکی شروع کنید.
          </div>
        </div>
        <div class="cta__right">
          <a class="cta__btn" routerLink="/vouchers/strategy">شروع پیشنهاد کوپن</a>
        </div>
      </section>

      <section class="kpis azk-card" *ngIf="kpis$ | async as kpis">
        <div class="kpi">
          <div class="kpi__label">فروش کل</div>
          <div class="kpi__value">{{ kpis.totalSales | currency : kpis.currency : 'symbol-narrow' }}</div>
          <div class="kpi__meta">
            <span class="chip chip--good">+{{ kpis.salesDeltaPctMoM | number : '1.1-1' }}%</span>
            <span class="kpi__hint">نسبت به ماه قبل</span>
          </div>
        </div>
        <div class="kpi">
          <div class="kpi__label">سفارش‌ها</div>
          <div class="kpi__value">{{ kpis.totalOrders | number }}</div>
          <div class="kpi__meta"><span class="kpi__hint">تسویه‌حساب‌های تکمیل شده</span></div>
        </div>
        <div class="kpi">
          <div class="kpi__label">میانگین ارزش سفارش</div>
          <div class="kpi__value">{{ kpis.avgOrderValue | currency : kpis.currency : 'symbol-narrow' }}</div>
          <div class="kpi__meta"><span class="kpi__hint">فروش ÷ سفارش‌ها</span></div>
        </div>
        <div class="kpi">
          <div class="kpi__label">شعب فعال</div>
          <div class="kpi__value">{{ kpis.activeBranches }}</div>
          <div class="kpi__meta"><span class="kpi__hint">گزارش فروش</span></div>
        </div>
      </section>

      <div class="grid grid--2">
        <azk-chart-wrapper title="فروش در طول زمان" subtitle="فروش ناخالص هفتگی (نمونه)">
          <div class="chart" *ngIf="salesOverTime$ | async as series">
            <div class="chart__legend">
              <span class="dot dot--brand"></span>
              <span class="muted">{{ series.label }}</span>
            </div>
            <svg class="svg" viewBox="0 0 700 240" preserveAspectRatio="none" role="img" aria-label="نمودار خطی فروش">
              <path class="gridline" d="M 0 200 L 700 200" />
              <path class="gridline" d="M 0 140 L 700 140" />
              <path class="gridline" d="M 0 80 L 700 80" />
              <path class="gridline" d="M 0 20 L 700 20" />
              <path class="area" [attr.d]="lineAreaPath(series)"></path>
              <path class="line" [attr.d]="linePath(series)"></path>
            </svg>
            <div class="chart__x">
              @for (tick of series.points; track tick.date) {
                <div class="tick">{{ tick.date | date : 'MMM d' }}</div>
              }
            </div>
          </div>
        </azk-chart-wrapper>

        <azk-chart-wrapper title="فروش بر اساس شعبه" subtitle="فروش کل هر شعبه (نمونه)">
          <div class="chart" *ngIf="salesByBranch$ | async as branches">
            <div class="bars">
              @for (b of branches; track b.branchId) {
                <div class="bar">
                  <div class="bar__label">
                    <span class="bar__name">{{ b.branchName }}</span>
                    <span class="bar__value">{{ b.sales | number }}</span>
                  </div>
                  <div class="bar__track">
                    <div class="bar__fill" [style.width.%]="branchWidthPct(branches, b)"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </azk-chart-wrapper>
      </div>

      <div class="grid grid--2">
        <azk-chart-wrapper title="محصولات" subtitle="بهترین و بدترین عملکردها (نمونه)">
          <div class="split" *ngIf="products$ | async as products">
            <div class="list">
              <div class="list__title">پرفروش‌ترین</div>
              @for (p of bestProducts(products); track p.productId) {
                <div class="row">
                  <div class="row__name">{{ p.productName }}</div>
                  <div class="row__meta">
                    <span class="chip chip--good">{{ p.unitsSold | number }} units</span>
                    <span class="muted">{{ p.revenue | number }} revenue</span>
                  </div>
                </div>
              }
            </div>
            <div class="list">
              <div class="list__title">کم‌فروش‌ترین</div>
              @for (p of worstProducts(products); track p.productId) {
                <div class="row">
                  <div class="row__name">{{ p.productName }}</div>
                  <div class="row__meta">
                    <span class="chip chip--warn">{{ p.unitsSold | number }} units</span>
                    <span class="muted">{{ p.revenue | number }} revenue</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </azk-chart-wrapper>

        <azk-chart-wrapper title="عملکرد در مقابل فروشندگان مشابه" subtitle="تطابق کلمات کلیدی دسته/زیردسته (نمونه)">
          <div class="bench" *ngIf="benchmark$ | async as bench">
            <div class="bench__top">
              <div class="bench__headline">
                <div class="bench__title">صدک همتایان</div>
                <div class="bench__value">{{ bench.percentile }}<span class="bench__pct">th</span></div>
                <div class="muted">
                  در مقایسه با همتایان <b>{{ bench.categoryKeyword }}</b> / <b>{{ bench.subcategoryKeyword }}</b>
                </div>
              </div>
              <div class="bench__score">
                <div class="meter">
                  <div class="meter__track">
                    <div class="meter__fill" [style.width.%]="bench.percentile"></div>
                  </div>
                  <div class="meter__labels">
                    <span>0</span><span>50</span><span>100</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bench__grid">
              <div class="mini">
                <div class="mini__label">فروش</div>
                <div class="mini__row">
                  <span class="muted">شما</span>
                  <b>{{ bench.yourMerchant.sales | number }}</b>
                </div>
                <div class="mini__row">
                  <span class="muted">میانه همتایان</span>
                  <b>{{ bench.peerMedian.sales | number }}</b>
                </div>
              </div>
              <div class="mini">
                <div class="mini__label">سفارش‌ها</div>
                <div class="mini__row">
                  <span class="muted">شما</span>
                  <b>{{ bench.yourMerchant.orders | number }}</b>
                </div>
                <div class="mini__row">
                  <span class="muted">میانه همتایان</span>
                  <b>{{ bench.peerMedian.orders | number }}</b>
                </div>
              </div>
              <div class="mini">
                <div class="mini__label">تبدیل</div>
                <div class="mini__row">
                  <span class="muted">شما</span>
                  <b>{{ bench.yourMerchant.conversionRatePct | number : '1.1-1' }}%</b>
                </div>
                <div class="mini__row">
                  <span class="muted">میانه همتایان</span>
                  <b>{{ bench.peerMedian.conversionRatePct | number : '1.1-1' }}%</b>
                </div>
              </div>
              <div class="mini">
                <div class="mini__label">میانگین ارزش سفارش</div>
                <div class="mini__row">
                  <span class="muted">شما</span>
                  <b>{{ bench.yourMerchant.avgOrderValue | number }}</b>
                </div>
                <div class="mini__row">
                  <span class="muted">میانه همتایان</span>
                  <b>{{ bench.peerMedian.avgOrderValue | number }}</b>
                </div>
              </div>
            </div>

            <ul class="bench__notes">
              @for (n of bench.notes; track n) {
                <li>{{ n }}</li>
              }
            </ul>
          </div>
        </azk-chart-wrapper>
      </div>

      <azk-chart-wrapper title="پیش‌بینی فروش آینده" subtitle="۳ ماه آینده (نمونه)">
        <div class="forecast" *ngIf="forecast$ | async as forecast">
          <div class="forecast__grid">
            @for (f of forecast; track f.month) {
              <div class="forecast__card">
                <div class="forecast__month">{{ f.month }}</div>
                <div class="forecast__value">{{ f.predictedSales | number }}</div>
                <div class="forecast__range">
                  <span class="muted">محدوده:</span>
                  <span>{{ f.lowerBound | number }}–{{ f.upperBound | number }}</span>
                </div>
                <div class="forecast__conf">
                  <span class="chip chip--info">{{ f.confidencePct }}% اطمینان</span>
                </div>
              </div>
            }
          </div>
        </div>
      </azk-chart-wrapper>
    </div>
  `,
  styles: [
    `
      .page {
        display: grid;
        gap: 16px;
      }

      .page__head {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px;
        direction: rtl;
      }

      .h1 {
        font-size: 26px;
        font-weight: 800;
        letter-spacing: 0.2px;
      }

      .muted {
        color: var(--muted);
        font-size: 13px;
      }

      .cta {
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        border-radius: var(--radius);
        direction: rtl;
      }

      .cta__title {
        font-weight: 900;
        font-size: 16px;
      }

      .cta__desc {
        margin-top: 6px;
        color: var(--muted);
        font-size: 12px;
        line-height: 1.35;
        max-width: 640px;
      }

      .cta__btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 10px 14px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: linear-gradient(135deg, rgba(52, 211, 153, 0.18), rgba(110, 231, 255, 0.14));
        font-weight: 800;
      }

      .cta__btn:hover {
        background: linear-gradient(135deg, rgba(52, 211, 153, 0.22), rgba(110, 231, 255, 0.18));
      }

      .kpis {
        padding: 14px;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        border-radius: var(--radius);
      }

      .kpi {
        padding: 14px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.07);
        background: rgba(255, 255, 255, 0.03);
      }

      .kpi__label {
        font-size: 12px;
        color: var(--muted);
      }

      .kpi__value {
        margin-top: 8px;
        font-size: 20px;
        font-weight: 800;
      }

      .kpi__meta {
        margin-top: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
        direction: rtl;
      }

      .kpi__hint {
        font-size: 12px;
        color: var(--subtle);
      }

      .grid {
        display: grid;
        gap: 16px;
      }

      .grid--2 {
        grid-template-columns: 1.2fr 1fr;
      }

      .chart__legend {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
        direction: rtl;
      }

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 99px;
        display: inline-block;
      }

      .dot--brand {
        background: linear-gradient(135deg, rgba(110, 231, 255, 0.9), rgba(167, 139, 250, 0.9));
      }

      .svg {
        width: 100%;
        height: 240px;
      }

      .gridline {
        stroke: rgba(255, 255, 255, 0.06);
        stroke-width: 1;
      }

      .line {
        fill: none;
        stroke: rgba(110, 231, 255, 0.9);
        stroke-width: 3;
      }

      .area {
        fill: rgba(110, 231, 255, 0.12);
      }

      .chart__x {
        margin-top: 10px;
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 6px;
      }

      .tick {
        font-size: 11px;
        color: var(--subtle);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .bars {
        display: grid;
        gap: 12px;
      }

      .bar__label {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 6px;
        direction: rtl;
      }

      .bar__name {
        font-weight: 650;
      }

      .bar__value {
        font-size: 12px;
        color: var(--muted);
      }

      .bar__track {
        height: 12px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.07);
        background: rgba(255, 255, 255, 0.03);
        overflow: hidden;
      }

      .bar__fill {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, rgba(167, 139, 250, 0.75), rgba(110, 231, 255, 0.75));
      }

      .split {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .list__title {
        font-weight: 750;
        margin-bottom: 10px;
      }

      .row {
        padding: 10px 10px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.07);
        background: rgba(255, 255, 255, 0.02);
        display: grid;
        gap: 6px;
        margin-bottom: 10px;
      }

      .row__name {
        font-weight: 650;
      }

      .row__meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        font-size: 12px;
        direction: rtl;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        font-size: 12px;
        line-height: 1.2;
      }

      .chip--good {
        background: rgba(52, 211, 153, 0.12);
        border-color: rgba(52, 211, 153, 0.25);
        color: rgba(210, 255, 238, 0.92);
      }

      .chip--warn {
        background: rgba(251, 191, 36, 0.12);
        border-color: rgba(251, 191, 36, 0.22);
        color: rgba(255, 246, 214, 0.92);
      }

      .chip--info {
        background: rgba(110, 231, 255, 0.12);
        border-color: rgba(110, 231, 255, 0.22);
        color: rgba(224, 250, 255, 0.92);
      }

      .bench__top {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
        align-items: center;
      }

      .bench__title {
        color: var(--muted);
        font-size: 12px;
      }

      .bench__value {
        font-size: 26px;
        font-weight: 850;
        margin-top: 6px;
      }

      .bench__pct {
        font-size: 14px;
        color: var(--muted);
        margin-left: 4px;
      }

      .meter__track {
        height: 12px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.07);
        background: rgba(255, 255, 255, 0.03);
        overflow: hidden;
      }

      .meter__fill {
        height: 100%;
        background: linear-gradient(90deg, rgba(110, 231, 255, 0.8), rgba(167, 139, 250, 0.8));
      }

      .meter__labels {
        margin-top: 8px;
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: var(--subtle);
        direction: rtl;
      }

      .bench__grid {
        margin-top: 14px;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      .mini {
        padding: 10px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.07);
        background: rgba(255, 255, 255, 0.02);
      }

      .mini__label {
        color: var(--muted);
        font-size: 12px;
        margin-bottom: 8px;
      }

      .mini__row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        font-size: 13px;
        margin-bottom: 6px;
        direction: rtl;
      }

      .bench__notes {
        margin: 14px 0 0;
        padding-left: 18px;
        color: var(--muted);
        font-size: 12px;
        display: grid;
        gap: 6px;
      }

      .forecast__grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
      }

      .forecast__card {
        padding: 12px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.07);
        background: rgba(255, 255, 255, 0.02);
      }

      .forecast__month {
        font-size: 12px;
        color: var(--muted);
      }

      .forecast__value {
        margin-top: 8px;
        font-size: 18px;
        font-weight: 850;
      }

      .forecast__range {
        margin-top: 6px;
        font-size: 12px;
        display: flex;
        gap: 8px;
        color: var(--text);
        direction: rtl;
      }

      .forecast__conf {
        margin-top: 10px;
      }

      @media (max-width: 1100px) {
        .grid--2 {
          grid-template-columns: 1fr;
        }
        .kpis {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 640px) {
        .split {
          grid-template-columns: 1fr;
        }
        .forecast__grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {
  private readonly analytics = inject(AnalyticsService);

  readonly kpis$ = this.analytics.getDashboardKpis();
  readonly salesOverTime$ = this.analytics.getSalesOverTime();
  readonly salesByBranch$ = this.analytics.getSalesByBranch();
  readonly products$ = this.analytics.getProductPerformance();
  readonly benchmark$ = this.analytics.getPerformanceComparison();
  readonly forecast$ = this.analytics.getFutureSalesPrediction();

  bestProducts(products: readonly ProductSales[]): readonly ProductSales[] {
    return products.filter((p) => p.tag === 'best');
  }

  worstProducts(products: readonly ProductSales[]): readonly ProductSales[] {
    return products.filter((p) => p.tag === 'worst');
  }

  branchWidthPct(all: readonly BranchSales[], branch: BranchSales): number {
    const max = Math.max(...all.map((b) => b.sales));
    return max <= 0 ? 0 : (branch.sales / max) * 100;
  }

  linePath(series: SalesOverTimeSeries): string {
    const points = this.normalizeSeries(series, 700, 220, 10);
    return this.toPath(points);
  }

  lineAreaPath(series: SalesOverTimeSeries): string {
    const points = this.normalizeSeries(series, 700, 220, 10);
    if (points.length === 0) return '';
    const first = points[0];
    const last = points[points.length - 1];
    const baselineY = 230;
    const path = this.toPath(points);
    return `${path} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
  }

  private normalizeSeries(series: SalesOverTimeSeries, width: number, height: number, pad: number): readonly SvgPoint[] {
    const pts = series.points;
    if (pts.length === 0) return [];

    const values = pts.map((p) => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(1, max - min);

    const innerW = width - pad * 2;
    const innerH = height - pad * 2;

    return pts.map((p, i) => {
      const x = pad + (innerW * i) / Math.max(1, pts.length - 1);
      const y = pad + innerH - ((p.value - min) / range) * innerH;
      return { x, y };
    });
  }

  private toPath(points: readonly SvgPoint[]): string {
    if (points.length === 0) return '';
    return points
      .map((p, i) => {
        const cmd = i === 0 ? 'M' : 'L';
        return `${cmd} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
      })
      .join(' ');
  }
}


