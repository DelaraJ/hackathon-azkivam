import {inject, Injectable} from '@angular/core';
import {Observable, delay, of, map} from 'rxjs';
import {
  BranchSales,
  DashboardKpis, IsoDateString,
  MerchantBenchmark,
  ProductSales,
  SalesForecastPoint,
  SalesOverTimeSeries, TimeSeriesPoint
} from '../models/analytics.models';
import {SalesApiService} from './sales-api.service';

@Injectable({providedIn: 'root'})
export class AnalyticsService {
  private salesService = inject(SalesApiService);

  getDashboardKpis(): Observable<DashboardKpis> {
    const data: DashboardKpis = {
      currency: 'ریال',
      totalSales: 12_840_000_000,
      totalOrders: 42_180,
      avgOrderValue: 304_290,
      activeBranches: 6,
      salesDeltaPctMoM: 8.6
    };
    return of(data).pipe(delay(180));
  }

  getSalesOverTime(): Observable<SalesOverTimeSeries> {
    const output: TimeSeriesPoint[] = [];
    return this.salesService.getPeriodTotalSales('monthly').pipe(
      map(res => {
        output.push(...res.trends.map(item => ({
          date: item.month,
          value: item.revenue
        } as TimeSeriesPoint)));
        const data: SalesOverTimeSeries = {
          label: 'فروش (۱۲ هفته گذشته)',
          currency: 'ریال',
          points: output
        };
        return data
      })
    )
  }

  getSalesByBranch(): Observable<readonly BranchSales[]> {
    const data: readonly BranchSales[] = [
      {branchId: 'b-01', branchName: 'Valiasr', sales: 2_940_000_000, orders: 9_120},
      {branchId: 'b-02', branchName: 'Saadat Abad', sales: 2_610_000_000, orders: 8_010},
      {branchId: 'b-03', branchName: 'Tehranpars', sales: 2_240_000_000, orders: 7_210},
      {branchId: 'b-04', branchName: 'Narmak', sales: 1_980_000_000, orders: 6_540},
      {branchId: 'b-05', branchName: 'Shahrak-e Gharb', sales: 1_720_000_000, orders: 5_920},
      {branchId: 'b-06', branchName: 'Ekhtiarieh', sales: 1_350_000_000, orders: 5_380}
    ];
    return of(data).pipe(delay(240));
  }

  getPerformanceComparison(): Observable<MerchantBenchmark> {
    const data: MerchantBenchmark = {
      currency: 'ریال',
      merchantName: 'AzkiVam Demo Merchant',
      categoryKeyword: 'Grocery',
      subcategoryKeyword: 'Convenience',
      yourMerchant: {
        sales: 12_840_000_000,
        orders: 42_180,
        conversionRatePct: 3.7,
        avgOrderValue: 304_290
      },
      peerMedian: {
        sales: 10_420_000_000,
        orders: 36_900,
        conversionRatePct: 3.3,
        avgOrderValue: 282_100
      },
      percentile: 71,
      notes: [
        'گروه همتایان از طریق تطابق کلمات کلیدی دسته/زیردسته محاسبه می‌شود (نمونه).',
        'معیارها نشان‌دهنده عملکرد میانه فروشندگان مشابه هستند (نمونه).',
        'از این پنل برای اعتبارسنجی قیمت‌گذاری، تبلیغات و سرعت موجودی استفاده کنید.'
      ]
    };
    return of(data).pipe(delay(210));
  }

  getFutureSalesPrediction(): Observable<readonly SalesForecastPoint[]> {
    const data: readonly SalesForecastPoint[] = [
      {
        month: '2026-01',
        predictedSales: 4_380_000_000,
        lowerBound: 4_050_000_000,
        upperBound: 4_760_000_000,
        confidencePct: 76
      },
      {
        month: '2026-02',
        predictedSales: 4_520_000_000,
        lowerBound: 4_120_000_000,
        upperBound: 4_980_000_000,
        confidencePct: 73
      },
      {
        month: '2026-03',
        predictedSales: 4_790_000_000,
        lowerBound: 4_310_000_000,
        upperBound: 5_390_000_000,
        confidencePct: 69
      }
    ];
    return of(data).pipe(delay(280));
  }
}


