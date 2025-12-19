export interface Campaign {
  merchantID: string;
  strategy: string;
  campaign_dt: string;
  amount_voucher: number;
  basketAmount_voucher: number;
  users_category: string;
  why: string;
  user_price_class: string;
  user_count: number;
  sum_voucher_amount: number;
  name: string;
  logged_at: string;
  used_voucher_count?: number; // تعداد ووچرهای استفاده شده (اختیاری)
}

export interface CampaignByMerchantResponse {
  campaigns: Campaign[];
}
