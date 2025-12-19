import {IsoDateString} from './analytics.models';

export interface PeriodSalesModel{
  merchantId: string
  period: string
  trends: Trend[]
}

export interface Trend {
  date?: IsoDateString
  week?:string
  month?:string
  revenue: number
  transactionCount: number
}
