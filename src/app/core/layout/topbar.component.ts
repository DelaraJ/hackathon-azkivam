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
      <div class="topbar__container">
        <div class="topbar__left">
          <a class="brand" href="/">
            <div class="brand__logo">
              <span class="brand__mark">ازکی</span>
            </div>
          </a>

          <nav class="nav" aria-label="Primary">
            @for (item of items; track item.route) {
              <a
                class="nav__item"
                [routerLink]="item.route"
                routerLinkActive="nav__item--active"
                [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
              >
                <span class="nav__label">{{ item.label }}</span>
                <svg class="nav__chevron" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.29289 10.2929C7.68342 9.90237 8.31658 9.90237 8.70711 10.2929L12 13.5858L15.2929 10.2929C15.6834 9.90237 16.3166 9.90237 16.7071 10.2929C17.0976 10.6834 17.0976 11.3166 16.7071 11.7071L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L7.29289 11.7071C6.90237 11.3166 6.90237 10.6834 7.29289 10.2929Z" fill="currentColor"></path>
                </svg>
              </a>
            }
          </nav>
        </div>

        <div class="topbar__right">
          <button class="support-btn" aria-label="پشتیبانی">
            <svg class="support-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.58172 3 4 6.58172 4 11H5C6.65685 11 8 12.3431 8 14C8 15.6569 6.65685 17 5 17H2V11C2 5.47715 6.47715 1 12 1C17.5228 1 22 5.47715 22 11V16C22 19.3137 19.3137 22 16 22H15C15 22.5523 14.5523 23 14 23C13.4477 23 13 22.5523 13 22V19C13 18.4477 13.4477 18 14 18C14.5523 18 15 18.4477 15 19V20H16C17.8638 20 19.4299 18.7252 19.874 17H19C17.3431 17 16 15.6569 16 14C16 12.3431 17.3431 11 19 11H20C20 6.58172 16.4183 3 12 3ZM20 13H19C18.4477 13 18 13.4477 18 14C18 14.5523 18.4477 15 19 15H20V13ZM4 15V13H5C5.55228 13 6 13.4477 6 14C6 14.5523 5.55228 15 5 15H4Z" fill="currentColor"></path>
            </svg>
            <span class="support-text">پشتیبانی</span>
          </button>
          
          <button class="login-btn" aria-label="ورود / ثبت نام">
            <span>ورود / ثبت نام</span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .topbar {
        background: #FFFFFF;
        border-bottom: 1px solid rgba(4, 10, 31, 0.09);
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .topbar__container {
        max-width: 100%;
        margin: 0 auto;
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
        direction: rtl;
      }

      .topbar__left {
        display: flex;
        align-items: center;
        gap: 32px;
        flex: 1;
      }

      .brand {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: inherit;
        flex-shrink: 0;
      }

      .brand__logo {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .brand__mark {
        font-weight: 700;
        font-size: 24px;
        color: var(--text-high);
        font-family: 'IRANSansXFaNum', 'Vazirmatn', sans-serif;
      }

      .nav {
        display: flex;
        align-items: center;
        gap: 0;
        direction: rtl;
      }

      .nav__item {
        padding: 4px 0;
        color: rgba(4, 10, 31, 0.87);
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: none;
        background: unset;
        width: 100%;
        text-align: unset;
        text-decoration: none;
        font-family: 'IRANSansXFaNum', 'Vazirmatn', sans-serif;
        font-weight: 500;
        font-size: 14px;
        line-height: 1.71;
        letter-spacing: 0%;
        text-transform: uppercase;
        cursor: pointer;
        transition: color 0.2s;
        gap: 4px;
      }

      .nav__item:hover {
        color: var(--azki-primary);
      }

      .nav__item:hover .nav__chevron {
        color: inherit;
      }

      .nav__item--active {
        color: var(--azki-primary);
      }

      .nav__chevron {
        width: 24px;
        height: 24px;
        color: rgba(117, 117, 117, 1);
        transition: color 0.2s;
      }

      .topbar__right {
        display: flex;
        align-items: center;
        gap: 24px;
        flex-shrink: 0;
        direction: rtl;
      }

      .support-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        background: transparent;
        border: none;
        padding: 6px 8px;
        cursor: pointer;
        color: var(--azki-primary);
        font-family: 'IRANSansXFaNum', 'Vazirmatn', sans-serif;
        font-weight: 500;
        font-size: 14px;
        line-height: 1.71;
        text-transform: uppercase;
        transition: background-color 0.2s;
        border-radius: 8px;
      }

      .support-btn:hover {
        background-color: var(--azki-primary-hover);
      }

      .support-icon {
        width: 24px;
        height: 24px;
        color: var(--azki-primary);
      }

      .support-text {
        display: inline-block;
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

      @media (max-width: 960px) {
        .support-text {
          display: none;
        }
        
        .nav {
          display: none;
        }
      }

      @media (max-width: 640px) {
        .topbar__container {
          padding: 0 16px;
        }
        
        .topbar__left {
          gap: 16px;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  protected readonly items: readonly NavItem[] = [
    { label: 'بیمه‌ها', route: '/dashboard' },
    { label: 'خسارت', route: '/vouchers' },
    { label: 'شرکت‌های بیمه', route: '/settings' }
  ];
}


