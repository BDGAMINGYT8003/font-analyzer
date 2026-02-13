import os
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:3000")

        # Wait for footer to be visible
        page.wait_for_selector("footer")

        # Scroll to bottom
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")

        # Take screenshot of footer
        footer = page.locator("footer")

        # Create directory
        os.makedirs("verification", exist_ok=True)

        # Screenshot initial state (System/Default)
        footer.screenshot(path="verification/footer_initial.png")
        print("Captured initial footer state")

        # Click Light
        page.get_by_role("button", name="Switch to Light theme").click()
        page.wait_for_timeout(500) # Wait for animation/theme change
        footer.screenshot(path="verification/footer_light.png")
        print("Captured light mode footer")

        # Click Dark
        page.get_by_role("button", name="Switch to Dark theme").click()
        page.wait_for_timeout(500)
        footer.screenshot(path="verification/footer_dark.png")
        print("Captured dark mode footer")

        # Click System
        page.get_by_role("button", name="Switch to System theme").click()
        page.wait_for_timeout(500)
        footer.screenshot(path="verification/footer_system.png")
        print("Captured system mode footer")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
