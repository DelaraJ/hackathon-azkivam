import { Routes } from '@angular/router';

export const VOUCHER_FLOW_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'strategy'
  },
  {
    path: 'strategy',
    loadComponent: () =>
      import('./pages/voucher-strategy-page.component').then((m) => m.VoucherStrategyPageComponent)
  },
  {
    path: 'recommendation',
    loadComponent: () =>
      import('./pages/voucher-recommendation-page.component').then(
        (m) => m.VoucherRecommendationPageComponent
      )
  },
  {
    path: 'monitoring',
    loadComponent: () =>
      import('./pages/voucher-monitoring-page.component').then((m) => m.VoucherMonitoringPageComponent)
  }
];


