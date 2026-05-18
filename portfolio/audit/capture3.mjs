// Comprehensive audit capture: bypasses loader AND resets GSAP-paused content
// Usage: node audit/capture3.mjs
import { setTimeout as wait } from 'node:timers/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const TARGET = 'http://localhost:5173/?audit=1';
const OUT = path.dirname(fileURLToPath(import.meta.url)) + '/';

// JS to inject: hide loader, reset all GSAP-faded elements, unpause smoother, refresh ScrollTrigger.
const BYPASS = `
(async () => {
  const hide = (sel) => document.querySelectorAll(sel).forEach(el => {
    el.style.display = 'none';
    el.style.visibility = 'hidden';
  });
  hide('.loading-screen');
  hide('.loading-header');

  document.body.style.overflowY = 'auto';
  const main = document.querySelector('main');
  if (main) main.classList.add('main-active');
  document.body.style.backgroundColor = '#0a0e17';

  // Reset every element GSAP fades in from opacity:0 / y:80 / blur(5px).
  const resetSelectors = [
    '.landing-info h3', '.landing-intro h2', '.landing-intro h1',
    '.landing-info-h2', '.landing-h2-1',
    '.header', '.icons-section', '.nav-fade',
    '.split-line', '.split-h2',
  ];
  resetSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
  });

  // Reset character/character-canvas containers
  document.querySelectorAll('.character-model, [class*="character"]').forEach(el => {
    el.style.opacity = '1';
  });

  // If GSAP is on window, kill any pending tweens that hold opacity:0
  if (window.gsap) {
    try { window.gsap.set(resetSelectors.join(','), { opacity: 1, y: 0, filter: 'none', clearProps: 'opacity,transform,filter' }); } catch(e){}
  }

  // Unpause ScrollSmoother if present
  if (window.ScrollSmoother && window.ScrollSmoother.get) {
    const s = window.ScrollSmoother.get();
    if (s) { s.paused(false); }
  }

  // Force-disable the smoother wrapper so native scroll works in audit.
  const wrapper = document.getElementById('smooth-wrapper');
  const content = document.getElementById('smooth-content');
  if (wrapper) {
    wrapper.style.position = 'static';
    wrapper.style.height = 'auto';
    wrapper.style.overflow = 'visible';
    wrapper.style.transform = 'none';
  }
  if (content) {
    content.style.transform = 'none';
    content.style.height = 'auto';
    content.style.position = 'static';
  }
  document.documentElement.style.overflow = 'auto';
  document.body.style.overflow = 'auto';

  // Reset every section that scroll-triggered animations may keep at opacity:0
  const sectionResets = [
    '.about-section', '.about-me', '.about-me .title', '.about-me .para',
    '.whatIDO', '.what-box', '.what-content', '.what-content-in',
    '.career-section', '.career-info-box',
    '.work-section', '.work-container',
    '.techstack', '.contact-section', '.contact-container', '.contact-box',
  ];
  sectionResets.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
      el.style.visibility = 'visible';
    });
  });
  if (window.gsap) {
    try {
      window.gsap.set(sectionResets.join(','), {
        opacity: 1, y: 0, x: 0, scale: 1, filter: 'none',
        clearProps: 'opacity,transform,filter',
      });
    } catch(e) {}
  }

  // Tell the page we're past the loader
  await new Promise(r => setTimeout(r, 600));
})();
`;

async function loadPage(browser, width, height) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(TARGET, { waitUntil: 'domcontentloaded', timeout: 30000 });
  // Wait for ?audit=1 bypass to fire and initialFX to run
  await wait(2500);
  // Force-complete all running GSAP tweens so we capture final state.
  await page.evaluate(`
    if (window.gsap) {
      try {
        window.gsap.globalTimeline.getChildren(true, true, true).forEach(t => {
          try { t.progress(1); } catch(e) {}
        });
      } catch(e) {}
    }
  `);
  await wait(800);
  // Belt-and-suspenders: also force opacity/transform reset for any element GSAP forgot
  await page.evaluate(BYPASS);
  await wait(800);
  return { ctx, page };
}

async function shotViewport(browser, label, w, h) {
  console.log(`[${label}] ${w}x${h}`);
  const { ctx, page } = await loadPage(browser, w, h);
  await page.screenshot({ path: `${OUT}${label}.png`, fullPage: true });
  await ctx.close();
}

async function shotSections(browser) {
  const w = 1440, h = 900;
  console.log(`[sections] ${w}x${h}`);
  const { ctx, page } = await loadPage(browser, w, h);

  const sections = [
    ['v2-section-landing',  '#landingDiv'],
    ['v2-section-about',    '#about'],
    ['v2-section-whatido',  '.whatIDO'],
    ['v2-section-career',   '.career-section'],
    ['v2-section-work',     '#work'],
    ['v2-section-techstack','.techstack'],
    ['v2-section-contact',  '#contact'],
  ];

  for (const [name, sel] of sections) {
    const found = await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (el) { el.scrollIntoView({ behavior: 'instant', block: 'start' }); return true; }
      return false;
    }, sel);
    if (!found) console.log(`  ! selector miss: ${sel}`);
    await wait(900);
    await page.screenshot({ path: `${OUT}${name}.png`, fullPage: false });
  }

  await ctx.close();
}

async function main() {
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  await shotViewport(browser, 'v2-desktop-1920', 1920, 1080);
  await shotViewport(browser, 'v2-laptop-1440', 1440, 900);
  await shotViewport(browser, 'v2-tablet-768', 768, 1024);
  await shotViewport(browser, 'v2-mobile-390', 390, 844);
  await shotSections(browser);
  await browser.close();
  console.log('Done.');
}

main().catch((e) => { console.error(e); process.exit(1); });
