import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

// GiveForm is a client component; Next's router and Script need an app context, so they are stubbed here.
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: () => {} }) }));
vi.mock("next/script", () => ({ default: () => null }));

async function setup() {
  vi.stubEnv("NEXT_PUBLIC_GCASH_NUMBER", "GCash Number: +639000000000 · Account name: Test Account");
  vi.stubEnv("NEXT_PUBLIC_MAYA_NUMBER", "Maya Number: +639000000001 · Account name: Test Account");
  vi.stubEnv("NEXT_PUBLIC_BANK_DETAILS", "Bank: Test Bank · Account name: Test Account · Account no.: 123456");
  vi.resetModules();
  return import("./GiveForm");
}
afterEach(() => vi.unstubAllEnvs());
const imgs = (html: string) => html.match(/<img[^>]*>/g) ?? [];

describe("GiveForm payment details (before Record Gift)", () => {
  it("shows the GCash QR (the default method) above the Record Gift button", async () => {
    const { default: GiveForm } = await setup();
    const html = renderToStaticMarkup(createElement(GiveForm));
    const [img] = imgs(html);
    expect(img).toContain('src="/images/payments/qrcode-gcash.jpg"');
    expect(img).toContain('alt="GCash QR code for sending your gift"');
    expect(html.indexOf("qrcode-gcash.jpg")).toBeLessThan(html.indexOf("Record my"));
  });

  it("shows QR + details for GCash and Maya, and details without a QR for Bank Transfer and Cash at Church", async () => {
    const { MethodDetails } = await setup();
    const render = (id: string, receipt = false) => renderToStaticMarkup(createElement(MethodDetails, { id, receipt }));
    const gcash = render("GCash"), maya = render("Maya"), bank = render("Bank transfer"), cash = render("Cash at church");
    expect(imgs(gcash)[0]).toContain('alt="GCash QR code for sending your gift"');
    expect(gcash).toContain("+639000000000");
    expect(imgs(maya)[0]).toContain('src="/images/payments/qrcode-maya.jpg"');
    expect(imgs(maya)[0]).toContain('alt="Maya QR code for sending your gift"');
    expect(maya).toContain("+639000000001");
    expect(imgs(bank)).toHaveLength(0);
    expect(bank).toContain("123456");
    expect(bank).toContain("Copy account number");
    expect(imgs(cash)).toHaveLength(0);
    expect(cash).toContain("Church treasurer or offering envelope");
  });
});

describe("GiveForm receipt payment details (after Record Gift)", () => {
  it("shows the GCash and Maya QR codes on the receipt, in a box wide enough for QR-left / details-right", async () => {
    const { MethodDetails } = await setup();
    for (const [id, file, alt] of [["GCash", "qrcode-gcash.jpg", "GCash QR code for sending your gift"], ["Maya", "qrcode-maya.jpg", "Maya QR code for sending your gift"]]) {
      const html = renderToStaticMarkup(createElement(MethodDetails, { id, receipt: true }));
      expect(imgs(html)[0], id).toContain(`src="/images/payments/${file}"`);
      expect(imgs(html)[0], id).toContain(`alt="${alt}"`);
      expect(html, id).toContain("max-w-[500px]"); // ≥460px of content → side by side (PaymentDetails container query)
      expect(html, id).toContain("@min-[460px]:flex-row");
    }
  });
  it("keeps Bank Transfer and Cash at Church without a QR on the receipt", async () => {
    const { MethodDetails } = await setup();
    for (const id of ["Bank transfer", "Cash at church"]) {
      expect(imgs(renderToStaticMarkup(createElement(MethodDetails, { id, receipt: true }))), id).toHaveLength(0);
    }
  });
});
