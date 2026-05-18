import time
from playwright.sync_api import sync_playwright

AUDIT_DIR = "/Users/arpit.tiwari/Desktop/ARPIT_MAIN/Anchal Mishra/portfolio/audit"
URL = "http://localhost:5173"

def wait_for_loader(page, timeout=30000):
    """Wait for loading screen to disappear."""
    try:
        # Wait for a loading indicator to appear first
        page.wait_for_selector("text=/Loading/i", timeout=5000)
        print("  Loading screen detected, waiting for it to clear...")
        # Wait for it to disappear
        page.wait_for_selector("text=/Loading/i", state="hidden", timeout=timeout)
        print("  Loading screen cleared.")
    except Exception as e:
        print(f"  No loading text found or already cleared: {e}")

    # Try clicking center in case there's a "welcome / click to enter" gate
    try:
        page.wait_for_selector("text=/Welcome|Enter|Click/i", timeout=5000)
        print("  Welcome/Enter screen detected, clicking center...")
        page.mouse.click(page.viewport_size["width"] // 2, page.viewport_size["height"] // 2)
        time.sleep(1)
    except Exception:
        pass

    # Extra settle time for 3D assets
    time.sleep(3)

def capture_viewport(p, label, width, height):
    print(f"\n=== Capturing {label} ({width}x{height}) ===")
    browser = p.chromium.launch(args=["--disable-web-security"])
    page = browser.new_page(viewport={"width": width, "height": height})
    page.goto(URL, wait_until="networkidle", timeout=60000)
    wait_for_loader(page)

    # Full page screenshot
    out = f"{AUDIT_DIR}/{label}.png"
    page.screenshot(path=out, full_page=True)
    print(f"  Saved: {out}")
    browser.close()

def capture_sections(p):
    width, height = 1440, 900
    print(f"\n=== Capturing sections at {width}x{height} ===")
    browser = p.chromium.launch(args=["--disable-web-security"])
    page = browser.new_page(viewport={"width": width, "height": height})
    page.goto(URL, wait_until="networkidle", timeout=60000)
    wait_for_loader(page)

    sections = [
        ("section-landing",    0),
        ("section-about",      None),
        ("section-whatido",    None),
        ("section-career",     None),
        ("section-work",       None),
        ("section-techstack",  None),
        ("section-contact",    None),
    ]

    selectors = {
        "section-about":     "#about, [id*='about'], section:nth-of-type(2)",
        "section-whatido":   "#whatido, [id*='what'], [id*='WhatIDo'], section:nth-of-type(3)",
        "section-career":    "#career, [id*='career'], section:nth-of-type(4)",
        "section-work":      "#work, [id*='work'], section:nth-of-type(5)",
        "section-techstack": "#techstack, [id*='tech'], section:nth-of-type(6)",
        "section-contact":   "#contact, [id*='contact'], footer, section:last-of-type",
    }

    for name, scroll_y in sections:
        print(f"  Capturing {name}...")
        if name == "section-landing":
            page.evaluate("window.scrollTo(0, 0)")
        else:
            sel = selectors.get(name)
            scrolled = False
            if sel:
                try:
                    el = page.query_selector(sel)
                    if el:
                        el.scroll_into_view_if_needed()
                        scrolled = True
                        print(f"    Scrolled via selector: {sel}")
                except Exception as ex:
                    print(f"    Selector failed ({ex}), trying JS scroll")

            if not scrolled:
                # Fallback: scroll by fraction of total page height
                total_height = page.evaluate("document.body.scrollHeight")
                idx = list(dict(sections).keys()).index(name) if name in dict(sections) else 1
                frac = idx / (len(sections) - 1)
                page.evaluate(f"window.scrollTo(0, {int(total_height * frac)})")

        time.sleep(1.5)
        out = f"{AUDIT_DIR}/{name}.png"
        page.screenshot(path=out, full_page=False)
        print(f"    Saved: {out}")

    browser.close()

def main():
    with sync_playwright() as p:
        # Four viewport captures
        capture_viewport(p, "desktop-1920", 1920, 1080)
        capture_viewport(p, "laptop-1440",  1440, 900)
        capture_viewport(p, "tablet-768",   768,  1024)
        capture_viewport(p, "mobile-390",   390,  844)
        # Per-section captures at 1440
        capture_sections(p)
    print("\nAll screenshots captured.")

if __name__ == "__main__":
    main()
