"""
Improved capture script that bypasses the loading screen by:
1. Waiting up to 60s for the loading screen to auto-dismiss
2. If still present, forcibly hiding it via JS
"""
import time
from playwright.sync_api import sync_playwright

AUDIT_DIR = "/Users/arpit.tiwari/Desktop/ARPIT_MAIN/Anchal Mishra/portfolio/audit"
URL = "http://localhost:5173"

HIDE_LOADER_JS = """
// Force-hide the loading screen elements
const screens = document.querySelectorAll('.loading-screen, .loading-header');
screens.forEach(el => { el.style.display = 'none'; el.style.visibility = 'hidden'; el.style.opacity = '0'; });
// Also remove the loading-clicked class and make main visible
const mainBody = document.querySelector('.main-body');
if (mainBody) { mainBody.style.opacity = '1'; }
"""

def bypass_loader(page, timeout_s=20):
    """Wait for the loading screen to go away, or forcibly hide it."""
    # The loading screen is .loading-screen with z-index 999999999
    # It auto-hides when percent=100 and isLoaded is true (triggered by useEffect)
    # We'll wait up to timeout_s, then force-hide
    start = time.time()
    while time.time() - start < timeout_s:
        visible = page.is_visible('.loading-screen')
        if not visible:
            print(f"  Loader gone after {time.time()-start:.1f}s")
            return True
        time.sleep(0.5)
    print(f"  Loader still present after {timeout_s}s — forcing hide via JS")
    page.evaluate(HIDE_LOADER_JS)
    time.sleep(1)
    return False

def settle(page, seconds=3):
    """Wait for 3D / GSAP animations to settle."""
    time.sleep(seconds)

def new_page(browser, width, height):
    page = browser.new_page(viewport={"width": width, "height": height})
    # Disable CSS animations / transitions so screenshots are stable
    # (keep enabled so we can see actual render state)
    return page

def load_and_wait(page):
    page.goto(URL, wait_until="domcontentloaded", timeout=60000)
    # Give JS/React time to mount and start the loader animation
    time.sleep(2)
    bypass_loader(page, timeout_s=35)
    settle(page, seconds=4)

def capture_viewport(p, label, width, height):
    print(f"\n[{label}] {width}x{height}")
    browser = p.chromium.launch(args=["--disable-web-security", "--no-sandbox"])
    page = new_page(browser, width, height)
    load_and_wait(page)
    out = f"{AUDIT_DIR}/{label}.png"
    page.screenshot(path=out, full_page=True)
    print(f"  -> {out}")
    browser.close()

def scroll_to_section(page, selector_list):
    """Try each selector in list; return True if found and scrolled."""
    for sel in selector_list:
        try:
            el = page.query_selector(sel)
            if el:
                el.scroll_into_view_if_needed()
                return True
        except Exception:
            pass
    return False

def capture_sections(p):
    width, height = 1440, 900
    print(f"\n[sections] {width}x{height}")
    browser = p.chromium.launch(args=["--disable-web-security", "--no-sandbox"])
    page = new_page(browser, width, height)
    load_and_wait(page)

    sections = [
        ("section-landing",    ["#landingDiv", ".landing-section"],                             0),
        ("section-about",      ["#about", "[id*='about']", "section:nth-of-type(2)"],           None),
        ("section-whatido",    ["#whatido", "[id*='WhatIDo']", "[id*='whatido']",
                                "[id*='what']", "section:nth-of-type(3)"],                      None),
        ("section-career",     ["#career", "[id*='career']", "section:nth-of-type(4)"],         None),
        ("section-work",       ["#work", "[id*='work']", "section:nth-of-type(5)"],             None),
        ("section-techstack",  ["#techstack", ".techstack", "[id*='tech']",
                                "section:nth-of-type(6)"],                                      None),
        ("section-contact",    ["#contact", "[id*='contact']", "footer",
                                "section:last-of-type"],                                        None),
    ]

    for name, selectors, _ in sections:
        print(f"  Scrolling to {name}...")
        if name == "section-landing":
            page.evaluate("window.scrollTo(0, 0)")
        else:
            if not scroll_to_section(page, selectors):
                print(f"    WARNING: no selector matched for {name}")
        time.sleep(1.5)
        out = f"{AUDIT_DIR}/{name}.png"
        page.screenshot(path=out, full_page=False)
        print(f"  -> {out}")

    browser.close()

def main():
    with sync_playwright() as p:
        capture_viewport(p, "desktop-1920", 1920, 1080)
        capture_viewport(p, "laptop-1440",  1440, 900)
        capture_viewport(p, "tablet-768",   768,  1024)
        capture_viewport(p, "mobile-390",   390,  844)
        capture_sections(p)
    print("\nDone.")

if __name__ == "__main__":
    main()
