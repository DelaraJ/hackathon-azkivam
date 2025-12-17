import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import {
  BranchSales,
  DashboardKpis,
  MerchantBenchmark,
  ProductSales,
  SalesForecastPoint,
  SalesOverTimeSeries
} from '../models/analytics.models';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  getDashboardKpis(): Observable<DashboardKpis> {
    const data: DashboardKpis = {
      currency: 'IRR',
      totalSales: 12_840_000_000,
      totalOrders: 42_180,
      avgOrderValue: 304_290,
      activeBranches: 6,
      salesDeltaPctMoM: 8.6
    };
    return of(data).pipe(delay(180));
  }

  getSalesOverTime(): Observable<SalesOverTimeSeries> {
    const data: SalesOverTimeSeries = {
      label: 'فروش (۱۲ هفته گذشته)',
      currency: 'IRR',
      points: [
        { date: '2025-09-29', value: 745_000_000 },
        { date: '2025-10-06', value: 792_000_000 },
        { date: '2025-10-13', value: 768_000_000 },
        { date: '2025-10-20', value: 815_000_000 },
        { date: '2025-10-27', value: 834_000_000 },
        { date: '2025-11-03', value: 821_000_000 },
        { date: '2025-11-10', value: 879_000_000 },
        { date: '2025-11-17', value: 914_000_000 },
        { date: '2025-11-24', value: 902_000_000 },
        { date: '2025-12-01', value: 965_000_000 },
        { date: '2025-12-08', value: 1_012_000_000 },
        { date: '2025-12-15', value: 1_046_000_000 }
      ]
    };
    return of(data).pipe(delay(220));
  }

  getSalesByBranch(): Observable<readonly BranchSales[]> {
    const data: readonly BranchSales[] = [
      { branchId: 'b-01', branchName: 'Valiasr', sales: 2_940_000_000, orders: 9_120 },
      { branchId: 'b-02', branchName: 'Saadat Abad', sales: 2_610_000_000, orders: 8_010 },
      { branchId: 'b-03', branchName: 'Tehranpars', sales: 2_240_000_000, orders: 7_210 },
      { branchId: 'b-04', branchName: 'Narmak', sales: 1_980_000_000, orders: 6_540 },
      { branchId: 'b-05', branchName: 'Shahrak-e Gharb', sales: 1_720_000_000, orders: 5_920 },
      { branchId: 'b-06', branchName: 'Ekhtiarieh', sales: 1_350_000_000, orders: 5_380 }
    ];
    return of(data).pipe(delay(240));
  }

  getProductPerformance(): Observable<readonly ProductSales[]> {
    const data: readonly ProductSales[] = [
      {
        productId: 'p-101',
        productName: 'Premium Rice 10kg',
        unitsSold: 1840,
        revenue: 1_920_000_000,
        marginPct: 18.2,
        tag: 'best'
      },
      {
        productId: 'p-102',
        productName: 'Sunflower Oil 1.8L',
        unitsSold: 2310,
        revenue: 1_410_000_000,
        marginPct: 14.9,
        tag: 'best'
      },
      {
        productId: 'p-103',
        productName: 'Coffee Beans 250g',
        unitsSold: 980,
        revenue: 1_080_000_000,
        marginPct: 28.5,
        tag: 'best'
      },
      {
        productId: 'p-201',
        productName: 'Soda 330ml',
        unitsSold: 540,
        revenue: 118_000_000,
        marginPct: 9.8,
        tag: 'worst'
      },
      {
        productId: 'p-202',
        productName: 'Instant Noodles',
        unitsSold: 610,
        revenue: 136_000_000,
        marginPct: 10.3,
        tag: 'worst'
      },
      {
        productId: 'p-203',
        productName: 'Budget Cookies',
        unitsSold: 420,
        revenue: 88_000_000,
        marginPct: 7.4,
        tag: 'worst'
      }
    ];
    return of(data).pipe(delay(260));
  }

  getPerformanceComparison(): Observable<MerchantBenchmark> {
    const data: MerchantBenchmark = {
      currency: 'IRR',
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


