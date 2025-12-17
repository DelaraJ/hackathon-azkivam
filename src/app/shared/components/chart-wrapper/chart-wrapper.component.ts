import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'azk-chart-wrapper',
  template: `
    <section class="card">
      <header class="head">
        <div class="head__meta">
          <div class="title">{{ title }}</div>
          @if (subtitle) {
            <div class="subtitle">{{ subtitle }}</div>
          }
        </div>
        <ng-content select="[chart-actions]" />
      </header>

      <div class="body">
        <ng-content />
      </div>
    </section>
  `,
  styles: [
    `
      .card {
        border-radius: var(--radius-md);
        border: 1px solid var(--border);
        background: var(--surface);
        box-shadow: var(--shadow-elevation);
        overflow: hidden;
      }

      .head {
        padding: 16px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        border-bottom: 1px solid var(--border-light);
        background: var(--surface);
        direction: rtl;
      }

      .title {
        font-weight: 750;
        letter-spacing: 0.2px;
      }

      .subtitle {
        margin-top: 4px;
        font-size: 12px;
        color: var(--muted);
      }

      .body {
        padding: 14px 16px 16px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartWrapperComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
}


