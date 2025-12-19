import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {VoucherRecommendationResponse} from '../models/voucher-recommendation-response.model';
import {CampaignByMerchantResponse} from '../models/campaign-by-merchant-response.model';

@Injectable({
  providedIn: 'root'
})
export class VoucherApiService {
  private http = inject(HttpClient);

  base = 'http://192.168.110.94:8000';
  merchantID = '6d55876f-eaed-4dc0-94b7-c7c869078c0a';

  getVoucherRecommendations(strategy: string, payable_amount: number): Observable<VoucherRecommendationResponse> {
    const params = new HttpParams()
      .set('merchantID', this.merchantID)
      .set('strategy', strategy)
      .set('payable_amount', payable_amount.toString());

    return this.http.get<VoucherRecommendationResponse>(this.base + '/recommendations', {params});
  }

  runCampaign(strategy: string, payable_amount: number): Observable<VoucherRecommendationResponse> {
    const params = new HttpParams()
      .set('merchantID', this.merchantID)
      .set('strategy', strategy)
      .set('payable_amount', payable_amount.toString());

    return this.http.post<VoucherRecommendationResponse>(this.base + '/campaigns/run', '', { params });
  }

  getCampaignsByMerchant(): Observable<CampaignByMerchantResponse> {
    const params = new HttpParams()
      .set('merchantID', this.merchantID);

    return this.http.get<CampaignByMerchantResponse>(this.base + '/campaigns/by-merchant', {params});
  }
}
