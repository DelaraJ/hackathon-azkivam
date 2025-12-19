import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PeriodSalesModel} from '../models/period-sales.model';

@Injectable({
  providedIn: 'root'
})

export class SalesApiService {
  private http = inject(HttpClient);

  base = 'https://30v3xxxd-8080.inc1.devtunnels.ms';

  getTotalSales(): Observable<any> {
    return this.http.get(this.base + '/merchant/04f52a83-3618-4bf4-b377-f1eafa9a5ede/revenue');
  }

  getPeriodTotalSales(period: 'daily' | 'weekly' | 'monthly'): Observable<PeriodSalesModel> {
    return this.http.get<PeriodSalesModel>(this.base + '/merchant/04f52a83-3618-4bf4-b377-f1eafa9a5ede/revenue/' + period);
  }

  getTopProducts(): Observable<any> {
    return this.http.get<PeriodSalesModel>(this.base + '/merchant/04f52a83-3618-4bf4-b377-f1eafa9a5ede/top-products/');
  }
}
