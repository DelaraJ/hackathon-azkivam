import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from './topbar.component';

@Component({
  selector: 'azk-shell-layout',
  imports: [RouterOutlet, TopbarComponent],
  template: `
    <div class="shell">
      <azk-topbar />

      <main class="content" [class.content--wide]="contentWide()">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      .shell {
        min-height: 100dvh;
        display: grid;
        grid-template-rows: auto 1fr;
      }

      .content {
        padding: 20px;
        max-width: 1240px;
        width: 100%;
        margin: 0 auto;
      }

      .content--wide {
        max-width: 400px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellLayoutComponent {
  readonly contentWide = computed(() => false);
}


