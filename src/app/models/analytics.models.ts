export type IsoDateString = `${number}-${number}-${number}` | string;

export type ChartSeriesType = 'line' | 'bar';

export type CurrencyCode = 'ریال' | 'تومان';

export type MerchantCategory = 'Grocery' | 'Pharmacy' | 'Restaurant' | 'Fashion';

export type MerchantSubcategory = 'Convenience' | 'Supermarket' | 'Coffee' | 'FastFood' | 'Beauty';

export interface TimeSeriesPoint {
  readonly date: IsoDateString;
  readonly value: number;
}

export interface SalesOverTimeSeries {
  readonly label: string;
  readonly currency: CurrencyCode;
  readonly points: readonly TimeSeriesPoint[];
}

export interface BranchSales {
  readonly branchId: string;
  readonly branchName: string;
  readonly sales: number;
  readonly orders: number;
}

export interface ProductSales {
  readonly product_id: string;
  readonly product_name: string;
  readonly rank: number;
  readonly total_revenue: number;
  readonly total_sold: number; // 0..100
}

export interface MerchantBenchmark {
  readonly currency: CurrencyCode;
  readonly merchantName: string;
  readonly categoryKeyword: MerchantCategory;
  readonly subcategoryKeyword: MerchantSubcategory;
  readonly yourMerchant: {
    readonly sales: number;
    readonly orders: number;
    readonly conversionRatePct: number;
    readonly avgOrderValue: number;
  };
  readonly peerMedian: {
    readonly sales: number;
    readonly orders: number;
    readonly conversionRatePct: number;
    readonly avgOrderValue: number;
  };
  readonly percentile: number; // 0..100 (mock)
  readonly notes: readonly string[];
}

export interface SalesForecastPoint {
  readonly month: string; // e.g. "2026-01"
  readonly predictedSales: number;
  readonly lowerBound: number;
  readonly upperBound: number;
  readonly confidencePct: number; // 0..100
}

export interface DashboardKpis {
  readonly currency: CurrencyCode;
  readonly totalSales: number;
  readonly totalOrders: number;
  readonly avgOrderValue: number;
  readonly activeBranches: number;
  readonly salesDeltaPctMoM: number;
}


