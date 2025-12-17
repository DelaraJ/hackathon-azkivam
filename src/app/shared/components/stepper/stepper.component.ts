import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { StepperStep } from '../../../models/voucher-flow.models';

@Component({
  selector: 'azk-stepper',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="stepper azk-card" aria-label="Voucher flow steps">
      @for (s of steps; track s.id) {
        <a
          class="step"
          [class.step--complete]="s.complete"
          [class.step--disabled]="!s.enabled"
          [routerLink]="s.enabled ? s.route : null"
          routerLinkActive="step--active"
          [attr.aria-disabled]="!s.enabled"
          (click)="!s.enabled && $event.preventDefault()"
        >
          <span class="dot" aria-hidden="true">
            @if (s.complete) {
              ✓
            } @else {
              •
            }
          </span>
          <span class="label">{{ s.label }}</span>
        </a>
      }
    </nav>
  `,
  styles: [
    `
      .stepper {
        padding: 10px;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
      }

      .step {
        padding: 12px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.03);
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--text);
        min-width: 0;
        direction: rtl;
      }

      .step:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      .step--active {
        border-color: rgba(110, 231, 255, 0.3);
        box-shadow: 0 0 0 3px rgba(110, 231, 255, 0.12);
      }

      .step--complete {
        border-color: rgba(52, 211, 153, 0.22);
      }

      .step--disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .dot {
        width: 28px;
        height: 28px;
        border-radius: 10px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0.03);
        font-weight: 900;
      }

      .label {
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      @media (max-width: 720px) {
        .stepper {
          grid-template-columns: 1fr;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepperComponent {
  @Input({ required: true }) steps!: readonly StepperStep[];
}


