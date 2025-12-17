import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type NavItem = Readonly<{
  label: string;
  route: string;
}>;

@Component({
  selector: 'azk-topbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <div class="topbar__left">
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
      </div>

      <div class="search" role="search">
        <input class="search__input" type="search" placeholder="جستجو (نمونه)" aria-label="Search" />
      </div>

      <div class="topbar__right">
        <div class="profile">
          <div class="profile__avatar" aria-hidden="true">M</div>
          <div class="profile__meta">
            <div class="profile__name">مدیر فروشنده</div>
            <div class="profile__role">مستأجر نمونه</div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .topbar {
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        border-bottom: 1px solid var(--border);
        background: rgba(15, 26, 47, 0.55);
        backdrop-filter: blur(12px);
        gap: 24px;
      }

      .topbar__left {
        display: flex;
        align-items: center;
        gap: 24px;
        min-width: 0;
        flex-shrink: 0;
        direction: rtl;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
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
        display: flex;
        align-items: center;
        gap: 4px;
        direction: rtl;
      }

      .nav__item {
        padding: 10px 16px;
        border-radius: 12px;
        border: 1px solid transparent;
        color: var(--text);
        text-decoration: none;
        font-weight: 650;
        transition: all 0.2s;
      }

      .nav__item:hover {
        background: rgba(255, 255, 255, 0.04);
        border-color: rgba(255, 255, 255, 0.05);
      }

      .nav__item--active {
        background: linear-gradient(135deg, rgba(110, 231, 255, 0.14), rgba(167, 139, 250, 0.12));
        border-color: rgba(255, 255, 255, 0.12);
      }

      .search {
        flex: 1;
        display: flex;
        justify-content: center;
        max-width: 500px;
        margin: 0 auto;
      }

      .search__input {
        width: 100%;
        max-width: 360px;
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid var(--border);
        background: rgba(255, 255, 255, 0.04);
        color: var(--text);
        outline: none;
        direction: rtl;
        text-align: right;
      }

      .topbar__right {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
        direction: rtl;
      }

      .search__input:focus {
        border-color: rgba(110, 231, 255, 0.35);
        box-shadow: 0 0 0 3px rgba(110, 231, 255, 0.12);
      }

      .profile {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        border-radius: 14px;
        border: 1px solid var(--border);
        background: rgba(255, 255, 255, 0.03);
        direction: rtl;
      }

      .profile__avatar {
        width: 36px;
        height: 36px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        font-weight: 800;
        background: linear-gradient(135deg, rgba(52, 211, 153, 0.2), rgba(110, 231, 255, 0.16));
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .profile__name {
        font-weight: 650;
        font-size: 13px;
        line-height: 1.1;
      }

      .profile__role {
        font-size: 12px;
        color: var(--muted);
      }

      @media (max-width: 900px) {
        .nav {
          gap: 2px;
        }
        .nav__item {
          padding: 10px 12px;
          font-size: 14px;
        }
      }

      @media (max-width: 900px) {
        .search {
          max-width: 280px;
        }
      }

      @media (max-width: 640px) {
        .profile__meta {
          display: none;
        }
        .search {
          max-width: 200px;
        }
        .search__input {
          max-width: 100%;
        }
        .brand__tag {
          display: none;
        }
        .nav__item {
          padding: 10px 10px;
          font-size: 13px;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  protected readonly items: readonly NavItem[] = [
    { label: 'داشبورد', route: '/dashboard' },
    { label: 'کوپن‌ها', route: '/vouchers' },
    { label: 'تنظیمات', route: '/settings' }
  ];
}


