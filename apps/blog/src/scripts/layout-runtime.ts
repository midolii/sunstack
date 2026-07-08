import 'overlayscrollbars/overlayscrollbars.css';
import {
  OverlayScrollbars,
  // ScrollbarsHidingPlugin,
  // SizeObserverPlugin,
  // ClickScrollPlugin
} from 'overlayscrollbars';
import { siteConfig } from '../config';
import {
  BANNER_HEIGHT,
  BANNER_HEIGHT_EXTEND,
  BANNER_HEIGHT_HOME,
  MAIN_PANEL_OVERLAPS_BANNER_HEIGHT,
} from '../constants/constants';
import { getHue, getStoredTheme, setHue, setTheme } from '../utils/setting-utils';
import { pathsEqual, url } from '../utils/url-utils';

const bannerEnabled = !!document.getElementById('banner-wrapper');

function setClickOutsideToClose(panel: string, ignores: string[]) {
  document.addEventListener('click', (event) => {
    const panelDom = document.getElementById(panel);
    const tDom = event.target;
    if (!(tDom instanceof Node)) return;
    for (const ig of ignores) {
      const ie = document.getElementById(ig);
      if (ie === tDom || ie?.contains(tDom)) return;
    }
    panelDom?.classList.add('float-panel-closed');
  });
}

setClickOutsideToClose('display-setting', ['display-setting', 'display-settings-switch']);
setClickOutsideToClose('nav-menu-panel', ['nav-menu-panel', 'nav-menu-switch']);
setClickOutsideToClose('search-panel', ['search-panel', 'search-bar', 'search-switch']);

function loadTheme() {
  setTheme(getStoredTheme());
}
function loadHue() {
  setHue(getHue());
}

function initCustomScrollbar() {
  const bodyElement = document.querySelector('body');
  if (!bodyElement) return;
  OverlayScrollbars(
    { target: bodyElement, cancel: { nativeScrollbarsOverlaid: true } },
    {
      scrollbars: {
        theme: 'scrollbar-base scrollbar-auto py-1',
        autoHide: 'move',
        autoHideDelay: 500,
        autoHideSuspend: false,
      },
    },
  );

  const katexElements = document.querySelectorAll('.katex-display') as NodeListOf<HTMLElement>;
  const katexObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          if (!element.parentNode || element.hasAttribute('data-scrollbar-initialized')) return;
          const container = document.createElement('div');
          container.className = 'katex-display-container';
          container.setAttribute('aria-label', 'scrollable container for formulas');
          element.parentNode.insertBefore(container, element);
          container.appendChild(element);
          OverlayScrollbars(container, {
            scrollbars: {
              theme: 'scrollbar-base scrollbar-auto',
              autoHide: 'leave',
              autoHideDelay: 500,
              autoHideSuspend: false,
            },
          });
          element.setAttribute('data-scrollbar-initialized', 'true');
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '100px', threshold: 0.1 },
  );
  katexElements.forEach((element) => {
    katexObserver.observe(element);
  });
}

function showBanner() {
  if (!siteConfig.banner.enable) return;
  const banner = document.getElementById('banner');
  if (!banner) return;
  banner.classList.remove('opacity-0', 'scale-105');
}

function init() {
  loadTheme();
  loadHue();
  initCustomScrollbar();
  showBanner();
}
init();

function handleScroll() {
  const bannerHeight = window.innerHeight * (BANNER_HEIGHT / 100);
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const toc = document.getElementById('toc-wrapper');
  const navbar = document.getElementById('navbar-wrapper');
  if (backToTopBtn)
    backToTopBtn.classList.toggle(
      'hide',
      !(
        document.body.scrollTop > bannerHeight || document.documentElement.scrollTop > bannerHeight
      ),
    );
  if (bannerEnabled && toc)
    toc.classList.toggle(
      'toc-hide',
      !(
        document.body.scrollTop > bannerHeight || document.documentElement.scrollTop > bannerHeight
      ),
    );
  if (!bannerEnabled || !navbar) return;
  const mainPanelExcessHeight = MAIN_PANEL_OVERLAPS_BANNER_HEIGHT * 16;
  let bannerHeightMode = BANNER_HEIGHT;
  if (document.body.classList.contains('lg:is-home') && window.innerWidth >= 1024)
    bannerHeightMode = BANNER_HEIGHT_HOME;
  const threshold = window.innerHeight * (bannerHeightMode / 100) - 72 - mainPanelExcessHeight - 16;
  navbar.classList.toggle(
    'navbar-hidden',
    document.body.scrollTop >= threshold || document.documentElement.scrollTop >= threshold,
  );
}

function handleResize() {
  let offset = Math.floor(window.innerHeight * (BANNER_HEIGHT_EXTEND / 100));
  offset = offset - (offset % 4);
  document.documentElement.style.setProperty('--banner-height-extend', `${offset}px`);
}

window.onscroll = handleScroll;
window.onresize = handleResize;

let didSetupSwupHooks = false;

const setup = () => {
  if (didSetupSwupHooks || !window.swup?.hooks) return;
  didSetupSwupHooks = true;
  const { swup } = window;

  swup.hooks.on('link:click', () => {
    document.documentElement.style.setProperty('--content-delay', '0ms');
    if (!bannerEnabled) return;
    const threshold = window.innerHeight * (BANNER_HEIGHT / 100) - 72 - 16;
    const navbar = document.getElementById('navbar-wrapper');
    if (!navbar || !document.body.classList.contains('lg:is-home')) return;
    if (document.body.scrollTop >= threshold || document.documentElement.scrollTop >= threshold)
      navbar.classList.add('navbar-hidden');
  });
  swup.hooks.on('content:replace', initCustomScrollbar);
  swup.hooks.on('visit:start', (visit: { to: { url: string } }) => {
    const bodyElement = document.querySelector('body');
    if (pathsEqual(visit.to.url, url('/'))) bodyElement?.classList.add('lg:is-home');
    else bodyElement?.classList.remove('lg:is-home');
    document.getElementById('page-height-extend')?.classList.remove('hidden');
    document.getElementById('toc-wrapper')?.classList.add('toc-not-ready');
  });
  swup.hooks.on('page:view', () => {
    document.getElementById('page-height-extend')?.classList.remove('hidden');
  });
  swup.hooks.on('visit:end', () => {
    setTimeout(() => {
      document.getElementById('page-height-extend')?.classList.add('hidden');
      document.getElementById('toc-wrapper')?.classList.remove('toc-not-ready');
    }, 200);
  });
};

if (window.swup?.hooks) setup();
else document.addEventListener('swup:enable', setup, { once: true });
