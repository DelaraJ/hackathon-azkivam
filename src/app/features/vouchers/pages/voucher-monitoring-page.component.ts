import { AsyncPipe, DecimalPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ChartWrapperComponent } from '../../../shared/components/chart-wrapper/chart-wrapper.component';

type MonitoringMetric = Readonly<{
  id: string;
  label: string;
  value: number;
  unit: string;
  deltaPct: number;
  trend: 'up' | 'down' | 'flat';
  description: string;
}>;

type UsagePoint = Readonly<{
  label: string;
  value: number;
}>;

type UsageSeries = Readonly<{
  points: readonly UsagePoint[];
  /** index در آرایه points که نشان‌دهنده شروع استراتژی تخفیف است */
  startIndex: number;
}>;

type SampleCampaign = Readonly<{
  id: string;
  name: string;
  segment: string;
  status: 'active' | 'paused';
  statusLabel: string;
  redeemRate: number;
  liftPct: number;
  orders: number;
  revenue: number;
  profit: number;
}>;

@Component({
  selector: 'azk-voucher-monitoring-page',
  standalone: true,
  imports: [DecimalPipe, NgIf, ChartWrapperComponent],
  template: `
    <div class="page">
      <header class="page__head">
        <div>
          <div class="h1">پایش عملکرد کمپین‌های تخفیف</div>
          <p class="muted">
            این داشبورد نشان می‌دهد تخفیف‌های شما چه اثری روی فروش و رفتار کاربران گذاشته‌اند. داده‌ها در حال حاضر
            به‌صورت نمونه (Mock) هستند و آماده اتصال به بک‌اند می‌باشند.
          </p>
        </div>
      </header>

      <section class="azk-card target">
        <div class="target__head">
          <div class="target__numbers">
            <div class="target__title">پیشرفت تا سقف فروش مشوق</div>
            <div class="target__bar">
              <div class="target__bar-fill" [style.width.%]="salesProgressPct()"></div>
            </div>
            <div class="target__current">
              <b>{{ salesToTarget | number : '1.0-0' }}</b>
              <span>تومان</span>
            </div>
            <div class="target__chip">
              {{ salesProgressPct() | number : '1.0-1' }}% تکمیل شده
            </div>
          </div>
        </div>
      </section>

      <section class="azk-card kpi-panel">
        <div class="kpi-panel__header">
          <div class="kpi-panel__title">وضعیت کلی کمپین‌ها</div>
          <div class="kpi-panel__subtitle">تأثیر تخفیف‌ها در ۱۴ روز گذشته</div>
        </div>

        <div class="kpi-grid">
          @for (m of metrics(); track m.id) {
            <article class="kpi-card">
              <div class="kpi-card__label">{{ m.label }}</div>
              <div class="kpi-card__value">
                <span class="kpi-card__number">
                  {{ m.value | number : '1.0-0' }}
                </span>
                <span class="kpi-card__unit">{{ m.unit }}</span>
              </div>
              <div class="kpi-card__delta" [class.kpi-card__delta--up]="m.trend === 'up'"
                                           [class.kpi-card__delta--down]="m.trend === 'down'">
                <span class="kpi-card__delta-value">
                  {{ m.deltaPct | number : '1.1-1' }}%
                </span>
                <span class="kpi-card__delta-label">
                  نسبت به دوره قبل
                </span>
              </div>
              <p class="kpi-card__desc">
                {{ m.description }}
              </p>
            </article>
          }
        </div>
      </section>

      <section class="charts-grid">
        <azk-chart-wrapper
          title="روند فروش و استفاده از تخفیف"
          subtitle="نرخ استفاده از کدهای تخفیف؛ خط چین نشان‌دهنده شروع استراتژی است"
        >
          <div class="chart" *ngIf="usageSeries() as series">
            <div class="chart__legend">
              <span class="dot dot--brand"></span>
              <span class="muted">نرخ استفاده (% از سفارش‌ها)</span>
            </div>
            <svg class="svg" viewBox="0 0 700 220" preserveAspectRatio="none" role="img" aria-label="روند استفاده از تخفیف">
              <path class="gridline" d="M 0 190 L 700 190" />
              <path class="gridline" d="M 0 140 L 700 140" />
              <path class="gridline" d="M 0 90 L 700 90" />
              <path class="gridline" d="M 0 40 L 700 40" />
              <line
                class="start-line"
                [attr.x1]="startMarkerX(series)"
                [attr.y1]="30"
                [attr.x2]="startMarkerX(series)"
                [attr.y2]="190"
              ></line>
              <text
                class="start-label"
                [attr.x]="startMarkerX(series)"
                y="24"
                text-anchor="middle"
              >
                شروع استراتژی
              </text>
              <path class="line" [attr.d]="linePath(series)"></path>
            </svg>
            <div class="chart__x">
              @for (p of series.points; track p.label) {
                <div class="tick">{{ p.label }}</div>
              }
            </div>
          </div>
        </azk-chart-wrapper>

        <azk-chart-wrapper
          title="سهم محصولات از فروش تخفیف‌دار"
          subtitle="۵ محصولی که بیشترین فروش با تخفیف را داشته‌اند"
        >
          <div class="chart">
            <div class="bars">
              @for (p of topProducts(); track p.id) {
                <div class="bar">
                  <div class="bar__label">
                    <span class="bar__name">{{ p.name }}</span>
                    <span class="bar__value">{{ p.revenue | number : '1.0-0' }} تومان</span>
                  </div>
                  <div class="bar__track">
                    <div class="bar__fill" [style.width.%]="productWidthPct(p)"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </azk-chart-wrapper>
      </section>

      <section class="azk-card table-card">
        <div class="table-card__header">
          <div class="table-card__title">کمپین‌های فعال اخیر</div>
          <div class="table-card__subtitle">این لیست نمونه‌ای از چند کمپین تخفیفی اخیر است.</div>
        </div>

        <div class="table">
          <div class="table__head">
            <div class="table__cell table__cell--title">نام کمپین</div>
            <div class="table__cell">وضعیت</div>
            <div class="table__cell">تعداد فروش</div>
            <div class="table__cell">درآمد</div>
            <div class="table__cell">سود</div>
            <div class="table__cell">نرخ استفاده</div>
            <div class="table__cell">تأثیر بر فروش</div>
          </div>

          @for (c of sampleCampaigns; track c.id) {
            <div class="table__row">
              <div class="table__cell table__cell--title">
                <div class="table__name">{{ c.name }}</div>
                <div class="table__meta muted">{{ c.segment }}</div>
              </div>
              <div class="table__cell">
                <span class="badge" [class.badge--active]="c.status === 'active'"
                                   [class.badge--paused]="c.status === 'paused'">
                  {{ c.statusLabel }}
                </span>
              </div>
              <div class="table__cell">
                {{ c.orders | number : '1.0-0' }}
              </div>
              <div class="table__cell">
                {{ c.revenue | number : '1.0-0' }} تومان
              </div>
              <div class="table__cell">
                {{ c.profit | number : '1.0-0' }} تومان
              </div>
              <div class="table__cell">
                {{ c.redeemRate | number : '1.1-1' }}%
              </div>
              <div class="table__cell">
                {{ c.liftPct | number : '1.1-1' }}%
              </div>
            </div>
          }
        </div>
      </section>

      <section class="charts-grid charts-grid--campaigns">
        <azk-chart-wrapper
          title="درآمد به تفکیک کمپین"
          subtitle="مقایسه درآمد حاصل از هر کمپین تخفیف‌دار"
        >
          <div class="chart">
            <div class="bars">
              @for (c of sampleCampaigns; track c.id) {
                <div class="bar">
                  <div class="bar__label">
                    <span class="bar__name">{{ c.name }}</span>
                    <span class="bar__value">{{ c.revenue | number : '1.0-0' }} تومان</span>
                  </div>
                  <div class="bar__track">
                    <div class="bar__fill" [style.width.%]="campaignRevenueWidthPct(c)"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </azk-chart-wrapper>

        <azk-chart-wrapper
          title="سود به تفکیک کمپین"
          subtitle="نمایش سود تقریبی هر کمپین بر اساس فروش منتسب"
        >
          <div class="chart">
            <div class="bars">
              @for (c of sampleCampaigns; track c.id) {
                <div class="bar">
                  <div class="bar__label">
                    <span class="bar__name">{{ c.name }}</span>
                    <span class="bar__value">{{ c.profit | number : '1.0-0' }} تومان</span>
                  </div>
                  <div class="bar__track">
                    <div class="bar__fill bar__fill--profit" [style.width.%]="campaignProfitWidthPct(c)"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </azk-chart-wrapper>

        <azk-chart-wrapper
          title="تعداد فروش منتسب به تخفیف"
          subtitle="حجم سفارش‌های هر کمپین تخفیف‌دار"
        >
          <div class="chart">
            <div class="bars">
              @for (c of sampleCampaigns; track c.id) {
                <div class="bar">
                  <div class="bar__label">
                    <span class="bar__name">{{ c.name }}</span>
                    <span class="bar__value">{{ c.orders | number : '1.0-0' }} سفارش</span>
                  </div>
                  <div class="bar__track">
                    <div class="bar__fill bar__fill--orders" [style.width.%]="campaignOrdersWidthPct(c)"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </azk-chart-wrapper>
      </section>
    </div>
  `,
  styles: [
    `
      .page {
        display: grid;
        gap: 16px;
        direction: rtl;
      }

      .page__head {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px;
      }

      .h1 {
        font-size: 24px;
        font-weight: 900;
      }

      .muted {
        margin-top: 4px;
        color: var(--muted);
        font-size: 13px;
      }

      .target {
        padding: 16px;
        display: grid;
        gap: 10px;
      }

      .target__head {
        display: grid;
        gap: 4px;
      }

      .target__title {
        font-weight: 800;
        font-size: 15px;
        width: 200px;
      }

      .target__subtitle {
        font-size: 13px;
        color: var(--muted);
      }

      .target__body {
        display: grid;
        gap: 8px;
      }

      .target__numbers {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        width: 100%;
        max-width: 1123px;
      }

      .target__current {
        display: flex;
        align-items: baseline;
        gap: 6px;
        font-size: 13px;
      }

      .target__current b {
        font-size: 18px;
      }

      .target__chip {
        padding: 4px 10px;
        border-radius: 999px;
        background: var(--azki-primary-hover);
        border: 1px solid var(--azki-primary-border);
        color: var(--azki-primary);
        font-size: 12px;
        font-weight: 600;
      }

      .target__bar {
        position: relative;
        width: 100%;
        max-width: 600px;
        height: 10px;
        border-radius: 999px;
        background: var(--surface-2);
        overflow: hidden;
        border: 1px solid var(--border-light);
      }

      .target__bar-fill {
        position: absolute;
        inset: 0;
        width: 0;
        border-radius: inherit;
        background: linear-gradient(90deg, var(--azki-primary), #22c55e);
        transition: width 0.4s ease-out;
      }

      .kpi-panel {
        padding: 16px;
        display: grid;
        gap: 16px;
      }

      .kpi-panel__header {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .kpi-panel__title {
        font-weight: 800;
        font-size: 16px;
      }

      .kpi-panel__subtitle {
        font-size: 13px;
        color: var(--muted);
      }

      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
      }

      .kpi-card {
        border-radius: var(--radius);
        border: 1px solid var(--border-light);
        background: var(--surface);
        padding: 12px 12px 10px;
        display: grid;
        gap: 6px;
      }

      .kpi-card__label {
        font-size: 13px;
        color: var(--muted);
      }

      .kpi-card__value {
        display: flex;
        align-items: baseline;
        gap: 6px;
      }

      .kpi-card__number {
        font-size: 22px;
        font-weight: 850;
      }

      .kpi-card__unit {
        font-size: 12px;
        color: var(--subtle);
      }

      .kpi-card__delta {
        display: inline-flex;
        align-items: baseline;
        gap: 6px;
        font-size: 12px;
        margin-top: 2px;
        color: var(--muted);
      }

      .kpi-card__delta-value {
        font-weight: 700;
      }

      .kpi-card__delta--up .kpi-card__delta-value {
        color: #16a34a;
      }

      .kpi-card__delta--down .kpi-card__delta-value {
        color: #dc2626;
      }

      .kpi-card__desc {
        margin: 0;
        margin-top: 2px;
        font-size: 12px;
        color: var(--subtle);
      }

      .charts-grid {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: 16px;
      }

      .charts-grid--campaigns {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .table-card {
        padding: 16px;
        display: grid;
        gap: 10px;
      }

      .table-card__header {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .table-card__title {
        font-weight: 800;
        font-size: 15px;
      }

      .table-card__subtitle {
        font-size: 13px;
        color: var(--muted);
      }

      .table {
        border-radius: var(--radius);
        border: 1px solid var(--border-light);
        overflow: hidden;
      }

      .table__head {
        display: grid;
        grid-template-columns: 2.4fr repeat(6, minmax(0, 1fr));
        padding: 8px 12px;
        background: var(--surface-2);
        font-size: 12px;
        color: var(--subtle);
      }

      .table__row {
        display: grid;
        grid-template-columns: 2.4fr repeat(6, minmax(0, 1fr));
        padding: 10px 12px;
        border-top: 1px solid var(--border-light);
        font-size: 13px;
      }

      .table__cell {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 2px;
        text-align: center;
      }

      .table__cell--title {
        min-width: 200px;
      }

      .table__cell--title .table__name {
        font-weight: 600;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 104px;
        min-width: 72px;
        padding: 2px 8px;
        border-radius: 999px;
        font-size: 11px;
        border: 1px solid var(--border-light);
        background: var(--surface-2);
      }

      .badge--active {
        background: rgba(22, 163, 74, 0.08);
        border-color: rgba(22, 163, 74, 0.2);
        color: #166534;
      }

      .badge--paused {
        background: rgba(251, 191, 36, 0.08);
        border-color: rgba(251, 191, 36, 0.2);
        color: #92400e;
      }

      /* Charts */
      .chart__legend {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
      }

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 99px;
        display: inline-block;
      }

      .dot--brand {
        background: var(--azki-primary);
      }

      .start-line {
        stroke: #9ca3af;
        stroke-width: 1;
        stroke-dasharray: 4 4;
      }

      .start-label {
        font-size: 11px;
        fill: var(--subtle);
      }

      .svg {
        width: 100%;
        height: 220px;
      }

      .gridline {
        stroke: var(--border-light);
        stroke-width: 1;
      }

      .line {
        fill: none;
        stroke: var(--azki-primary);
        stroke-width: 3;
      }

      .chart__x {
        margin-top: 8px;
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 6px;
        font-size: 11px;
        color: var(--subtle);
      }

      .tick {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .bars {
        display: grid;
        gap: 10px;
      }

      .bar__label {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 4px;
      }

      .bar__name {
        font-weight: 600;
      }

      .bar__value {
        font-size: 12px;
        color: var(--muted);
      }

      .bar__track {
        height: 10px;
        border-radius: 999px;
        border: 1px solid var(--border-light);
        background: var(--surface-2);
        overflow: hidden;
      }

      .bar__fill {
        height: 100%;
        border-radius: 999px;
        background: var(--azki-primary);
      }

      .bar__fill--profit {
        background: linear-gradient(90deg, #22c55e, #16a34a);
      }

      .bar__fill--orders {
        background: linear-gradient(90deg, #6366f1, #0ea5e9);
      }

      @media (max-width: 960px) {
        .kpi-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .charts-grid {
          grid-template-columns: 1fr;
        }

        .table__head,
        .table__row {
          grid-template-columns: 2fr 1fr 1fr 1fr;
        }

        .table__head .table__cell:nth-child(7),
        .table__row .table__cell:nth-child(7) {
          display: none;
        }
      }

      @media (max-width: 640px) {
        .page__head {
          flex-direction: column;
          align-items: flex-start;
        }

        .kpi-grid {
          grid-template-columns: 1fr;
        }

        .table__head,
        .table__row {
          grid-template-columns: 1.5fr 1fr 1fr;
        }

        .table__head .table__cell:nth-child(4),
        .table__head .table__cell:nth-child(5),
        .table__head .table__cell:nth-child(6),
        .table__head .table__cell:nth-child(7),
        .table__row .table__cell:nth-child(4),
        .table__row .table__cell:nth-child(5),
        .table__row .table__cell:nth-child(6),
        .table__row .table__cell:nth-child(7) {
          display: none;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoucherMonitoringPageComponent {
  // Mocked metrics – ready to be replaced with API data
  private readonly _metrics = signal<readonly MonitoringMetric[]>([
    {
      id: 'generated-codes',
      label: 'کدهای تخفیف تولید شده',
      value: 420,
      unit: 'کد',
      deltaPct: 12.3,
      trend: 'up',
      description: 'مجموع کدهای تخفیفی که در کمپین‌های فعال و غیرفعال ایجاد شده‌اند.'
    },
    {
      id: 'used-codes',
      label: 'کدهای استفاده‌شده',
      value: 163,
      unit: 'کد',
      deltaPct: 19.5,
      trend: 'up',
      description: 'تعداد کدهایی که حداقل یک بار در سفارش واقعی استفاده شده‌اند.'
    },
    {
      id: 'discount-revenue',
      label: 'فروش منتسب به تخفیف',
      value: 38,
      unit: 'میلیون تومان',
      deltaPct: 14.8,
      trend: 'up',
      description: 'برآورد فروش ناخالصی که با استفاده از کدهای تخفیف انجام شده است.'
    }
  ]);

  readonly metrics = computed(() => this._metrics());

  // Mock usage series over last 7 days with a clear strategy start index
  readonly usageSeries = signal<UsageSeries>({
    points: [
      { label: '۶ روز پیش', value: 8.2 },
      { label: '۵ روز پیش', value: 9.5 },
      { label: 'شروع استراتژی', value: 10.4 },
      { label: '۳ روز پیش', value: 11.9 },
      { label: '۲ روز پیش', value: 13.8 },
      { label: 'دیروز', value: 15.6 },
      { label: 'امروز', value: 16.1 }
    ],
    startIndex: 2
  });

  readonly salesTarget = 100_000_000; // هدف فروش منتسب به تخفیف
  readonly salesToTarget = 38_000_000; // فروش تحقق‌یافته منتسب به تخفیف
  readonly salesProgressPct = computed(() =>
    this.salesTarget <= 0 ? 0 : Math.min(100, (this.salesToTarget / this.salesTarget) * 100)
  );

  // Mock top products by discounted revenue
  readonly topProducts = signal(
    [
      { id: 'p1', name: 'گوشی موبایل', revenue: 18_500_000 },
      { id: 'p2', name: 'لپ‌تاپ', revenue: 14_200_000 },
      { id: 'p3', name: 'هدفون بی‌سیم', revenue: 9_800_000 },
      { id: 'p4', name: 'تلویزیون', revenue: 6_300_000 },
      { id: 'p5', name: 'ساعت هوشمند', revenue: 4_100_000 }
    ] as const
  );

  readonly sampleCampaigns: readonly SampleCampaign[] = [
    {
      id: 'c1',
      name: 'تخفیف خوشامدگویی کاربران جدید',
      segment: 'کاربران ثبت‌نام‌شده در ۳۰ روز اخیر',
      status: 'active',
      statusLabel: 'فعال',
      redeemRate: 37.8,
      liftPct: 14.2,
      orders: 420,
      revenue: 18_500_000,
      profit: 6_200_000
    },
    {
      id: 'c2',
      name: 'کمپین جمعه‌های پرایم',
      segment: 'تمام کاربران فعال',
      status: 'active',
      statusLabel: 'فعال',
      redeemRate: 22.4,
      liftPct: 11.5,
      orders: 310,
      revenue: 14_200_000,
      profit: 5_100_000
    },
    {
      id: 'c3',
      name: 'بازگشت کاربران غیرفعال',
      segment: 'کاربران بدون سفارش در ۶۰ روز گذشته',
      status: 'paused',
      statusLabel: 'متوقف‌شده',
      redeemRate: 9.3,
      liftPct: 6.1,
      orders: 150,
      revenue: 9_800_000,
      profit: 2_900_000
    }
  ];

  productWidthPct(p: { revenue: number }): number {
    const products = this.topProducts();
    const max = Math.max(...products.map((x) => x.revenue));
    if (max <= 0) return 0;
    return (p.revenue / max) * 100;
  }

  campaignRevenueWidthPct(c: SampleCampaign): number {
    const max = Math.max(...this.sampleCampaigns.map((x) => x.revenue));
    if (max <= 0) return 0;
    return (c.revenue / max) * 100;
  }

  campaignProfitWidthPct(c: SampleCampaign): number {
    const max = Math.max(...this.sampleCampaigns.map((x) => x.profit));
    if (max <= 0) return 0;
    return (c.profit / max) * 100;
  }

  campaignOrdersWidthPct(c: SampleCampaign): number {
    const max = Math.max(...this.sampleCampaigns.map((x) => x.orders));
    if (max <= 0) return 0;
    return (c.orders / max) * 100;
  }

  linePath(series: UsageSeries): string {
    const width = 700;
    const height = 190;
    const pad = 10;
    const innerW = width - pad * 2;
    const innerH = height - pad * 2;
    const pts = series.points;
    if (pts.length === 0) return '';

    const values = pts.map((p) => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(1, max - min);

    const svgPoints = pts.map((p, i) => {
      const x = pad + (innerW * i) / Math.max(1, pts.length - 1);
      const y = pad + innerH - ((p.value - min) / range) * innerH;
      return { x, y };
    });

    return svgPoints
      .map((p, i) => {
        const cmd = i === 0 ? 'M' : 'L';
        return `${cmd} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
      })
      .join(' ');
  }

  startMarkerX(series: UsageSeries): number {
    const width = 700;
    const pad = 10;
    const innerW = width - pad * 2;
    const pts = series.points;
    if (pts.length === 0) return pad;
    const index = Math.min(Math.max(series.startIndex, 0), pts.length - 1);
    return pad + (innerW * index) / Math.max(1, pts.length - 1);
  }
}

