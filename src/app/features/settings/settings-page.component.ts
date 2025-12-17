import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'azk-settings-page',
  template: `
    <div class="page azk-card">
      <div class="title">تنظیمات</div>
      <div class="muted">صفحه نگهدارنده. تنظیمات را در تکرار بعدی اینجا پیکربندی کنید.</div>
    </div>
  `,
  styles: [
    `
      .page {
        padding: 18px;
      }
      .title {
        font-size: 18px;
        font-weight: 800;
      }
      .muted {
        margin-top: 8px;
        color: var(--muted);
        font-size: 13px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent {}


