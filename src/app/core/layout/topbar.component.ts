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
    <header class="sticky-header">
      <!-- ردیف بالا: لوگو + جستجو + دکمه ورود/ثبت‌نام -->
      <div class="top-header">
        <div class="top-header__left">
          <a class="brand" routerLink="/">
            <div class="brand__logo">
              <img
                class="brand__img"
                src="/logo-blue.svg"
                alt="ازکی وام"
                width="107"
                height="28"
                loading="eager"
              />
            </div>
          </a>

          <div class="search" aria-label="جستجو">
            <span class="search__icon" aria-hidden="true"></span>
            <input
              class="search__input"
              type="text"
              placeholder="جستجو"
            />
          </div>
        </div>

        <div class="top-header__right">
          <button class="login-btn" type="button">
            <span>ورود / ثبت‌نام</span>
          </button>
        </div>
      </div>

      <!-- ردیف پایین: لینک‌های ناوبری + کمک -->
      <div class="sub-header">
        <nav class="sub-header__nav" aria-label="Primary">
          @for (item of items; track item.route; let last = $last) {
            <a
              class="header-link"
              [routerLink]="item.route"
              routerLinkActive="header-link--active"
              [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
            >
              <span class="header-link__label">{{ item.label }}</span>
            </a>

            @if (!last) {
              <span class="header-separator" aria-hidden="true"></span>
            }
          }
        </nav>

        <button class="help-btn" type="button">
          نیاز به راهنمایی دارید؟
        </button>
      </div>
    </header>
  `,
  styles: [
    `
      .sticky-header {
        position: sticky;
        top: 0;
        z-index: 1000;
        background-color: #ffffff;
        border-bottom: 1px solid rgba(4, 10, 31, 0.06);
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
        direction: rtl;
      }

      .top-header,
      .sub-header {
        max-width: 1240px;
        margin: 0 auto;
        padding: 8px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }

      .top-header {
        padding-top: 10px;
        padding-bottom: 10px;
      }

      .sub-header {
        border-top: 1px solid rgba(148, 163, 184, 0.18);
        padding-top: 6px;
        padding-bottom: 6px;
      }

      .top-header__left {
        display: flex;
        align-items: center;
        gap: 24px;
        flex: 1;
        min-width: 0;
      }

      .top-header__right {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .brand {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        color: inherit;
        flex-shrink: 0;
      }

      .brand__logo {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding-inline-start: 8px;
      }

      .brand__img {
        display: block;
        height: 28px;
        width: auto;
      }

      .search {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background-color: #f3f4f6;
        border-radius: 999px;
        padding: 0 14px;
        height: 40px;
        flex: 1;
        max-width: 440px;
        border: 1px solid transparent;
        transition: border-color 0.15s ease, box-shadow 0.15s ease,
          background-color 0.15s ease;
      }

      .search__icon {
        width: 18px;
        height: 18px;
        display: inline-block;
        background-image: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18C12.6575 18 14.1775 17.3912 15.3335 16.377L18.7071 19.7507C19.0976 20.1412 19.7308 20.1412 20.1213 19.7507C20.5118 19.3601 20.5118 18.727 20.1213 18.3364L16.7477 14.9629C17.7618 13.8069 18.3706 12.2869 18.3706 10.6294C18.3706 6.76343 15.2366 3.62939 11.3706 3.62939H11ZM6 11C6 8.79086 7.79086 7 10 7C12.2091 7 14 8.79086 14 11C14 13.2091 12.2091 15 10 15C7.79086 15 6 13.2091 6 11Z' fill='%2394A3B8'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
      }

      .search__input {
        border: none;
        outline: none;
        background: transparent;
        width: 100%;
        font-family: 'IRANSansXFaNum', 'Vazirmatn', sans-serif;
        font-size: 13px;
        color: var(--text);
      }

      .search__input::placeholder {
        color: #9ca3af;
      }

      .search:focus-within {
        border-color: var(--azki-primary-border);
        background-color: #ffffff;
        box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.08);
      }

      .login-btn {
        background-color: transparent;
        border: 1px solid var(--azki-primary-border);
        color: var(--azki-primary);
        border-radius: 32px;
        padding: 5px 15px;
        font-family: 'IRANSansXFaNum', 'Vazirmatn', sans-serif;
        font-weight: 500;
        font-size: 14px;
        line-height: 1.71;
        letter-spacing: 0%;
        text-transform: uppercase;
        cursor: pointer;
        transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
                    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
      }

      .login-btn:hover {
        background-color: var(--azki-primary-hover);
        border: 1px solid var(--azki-primary);
      }

      .sub-header__nav {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
        min-width: 0;
      }

      .header-link {
        text-decoration: none;
        color: #111827;
        font-family: 'IRANSansXFaNum', 'Vazirmatn', sans-serif;
        font-size: 13px;
        padding-block: 4px;
        transition: color 0.15s ease;
        white-space: nowrap;
      }

      .header-link__label {
        font-weight: 500;
      }

      .header-link:hover {
        color: var(--azki-primary);
      }

      .header-link--active {
        color: var(--azki-primary);
        font-weight: 600;
      }

      .header-separator {
        width: 1px;
        height: 18px;
        background-color: #e5e7eb;
      }

      .help-btn {
        background: transparent;
        border: none;
        color: #4b5563;
        font-family: 'IRANSansXFaNum', 'Vazirmatn', sans-serif;
        font-size: 13px;
        cursor: pointer;
        padding: 4px 0 4px 4px;
        white-space: nowrap;
      }

      .help-btn:hover {
        color: var(--azki-primary);
      }

      @media (max-width: 960px) {
        .search {
          display: none;
        }

        .sub-header {
          display: none;
        }

        .top-header,
        .sub-header {
          padding-inline: 16px;
        }
      }

      @media (max-width: 640px) {
        .top-header {
          padding-inline: 12px;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  protected readonly items: readonly NavItem[] = [
    // داشبورد اصلی
    { label: 'داشبورد', route: '/dashboard' },
    // صفحه بررسی و پایش استراتژی‌های تخفیف (جریان ووچرها)
    { label: 'بررسی استراتژی تخفیف', route: '/vouchers' }
  ];
}


