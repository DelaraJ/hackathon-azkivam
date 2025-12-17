import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type NavItem = Readonly<{
  label: string;
  route: string;
}>;

@Component({
  selector: 'azk-sidebar-nav',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand__mark" aria-hidden="true">A</div>
        <div class="brand__text">
          <div class="brand__name">AzkiVam</div>
          <div class="brand__tag">پنل مدیریت فروشنده</div>
        </div>
      </div>

      <nav class="nav" aria-label="Primary">
        @for (item of items; track item.route) {
          <a
            class="nav__item"
            [routerLink]="item.route"
            routerLinkActive="nav__item--active"
            [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
          >
            <span class="nav__label">{{ item.label }}</span>
          </a>
        }
      </nav>
    </aside>
  `,
  styles: [
    `
      .sidebar {
        position: sticky;
        top: 0;
        height: 100dvh;
        width: 150px;
        border-right: 1px solid var(--border);
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
        backdrop-filter: blur(14px);
        padding: 16px;
        display: grid;
        grid-template-rows: auto 1fr;
        gap: 18px;
      }

      .brand {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 12px;
        direction: rtl;
      }

      .brand__mark {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        font-weight: 800;
        background: linear-gradient(135deg, rgba(110, 231, 255, 0.22), rgba(167, 139, 250, 0.18));
        border: 1px solid var(--border);
      }

      .brand__name {
        font-weight: 750;
        letter-spacing: 0.2px;
      }

      .brand__tag {
        font-size: 12px;
        color: var(--muted);
        margin-top: 2px;
      }

      .nav {
        display: grid;
        gap: 8px;
      }

      .nav__item {
        display: grid;
        gap: 2px;
        width: 120px;
        padding: 12px 12px;
        border-radius: 14px;
        border: 1px solid transparent;
        color: var(--text);
      }

      .nav__item:hover {
        background: rgba(255, 255, 255, 0.04);
        border-color: rgba(255, 255, 255, 0.05);
      }

      .nav__item--active {
        background: linear-gradient(135deg, rgba(110, 231, 255, 0.14), rgba(167, 139, 250, 0.12));
        border-color: rgba(255, 255, 255, 0.12);
      }

      .nav__label {
        font-weight: 650;
      }

      @media (max-width: 500px) {
        .sidebar {
          position: relative;
          height: auto;
          width: 100px;
          grid-template-rows: auto auto;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarNavComponent {
  protected readonly items: readonly NavItem[] = [
    { label: 'داشبورد', route: '/dashboard' },
    { label: 'کوپن‌ها', route: '/vouchers' },
    { label: 'تنظیمات', route: '/settings' }
  ];
}


