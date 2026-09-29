import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

// config.ts reads NEXT_PUBLIC_* at import, so each test stubs env and re-imports config + component.
async function setup(env: Record<string, string>) {
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
  vi.resetModules();
  const { PAYMENT_METHODS } = await import("@/lib/config");
  const { default: PaymentDetails } = await import("./PaymentDetails");
  const render = (id: string, props: Record<string, unknown> = {}) =>
    renderToStaticMarkup(createElement(PaymentDetails, { method: PAYMENT_METHODS.find((m) => m.id === id)!, className: "box", ...props }));
  return { render };
}
afterEach(() => vi.unstubAllEnvs());

const configured = {
  NEXT_PUBLIC_GCASH_NUMBER: "GCash Number: +639000000000 · Account name: Test Account",
  NEXT_PUBLIC_MAYA_NUMBER: "Maya Number: +639000000001 · Account name: Test Account",
  NEXT_PUBLIC_BANK_DETAILS: "Bank: Test Bank · Account name: Test Account · Account no.: 123456",
};
const img = (html: string) => html.match(/<img[^>]*>/)?.[0] ?? "";

describe("PaymentDetails QR codes", () => {
  it("renders the GCash QR with its path, intrinsic size and alt text, next to the details", async () => {
    const { render } = await setup(configured);
    const html = render("GCash");
    expect(img(html)).toContain('src="/images/payments/qrcode-gcash.jpg"');
    expect(img(html)).toContain('alt="GCash QR code for sending your gift"');
    expect(img(html)).toContain('width="441"');
    expect(img(html)).toContain('height="442"');
    expect(html).toContain("+639000000000"); // details still rendered
    expect(html).toContain("Copy number");
  });

  it("renders the Maya QR with its path, intrinsic size and alt text", async () => {
    const { render } = await setup(configured);
    const html = render("Maya");
    expect(img(html)).toContain('src="/images/payments/qrcode-maya.jpg"');
    expect(img(html)).toContain('alt="Maya QR code for sending your gift"');
    expect(img(html)).toContain('width="663"');
    expect(img(html)).toContain('height="663"');
  });

  it("stacks below 460px and goes side by side at 180px from 460px, without distorting or clipping the code", async () => {
    const { render } = await setup(configured);
    for (const id of ["GCash", "Maya"]) {
      const html = render(id);
      expect(html, id).toContain("@container");
      expect(html, id).toMatch(/class="flex flex-col[^"]*@min-\[460px\]:flex-row/);
      expect(img(html), id).toMatch(/h-auto/); // height follows the width → aspect ratio kept
      expect(img(html), id).toMatch(/max-w-\[240px\]/); // stacked: up to 240px
      expect(img(html), id).toMatch(/@min-\[460px\]:w-\[180px\]/); // beside the details: 180px
      expect(img(html), id).not.toMatch(/rounded/); // corner squares must not be clipped
    }
  });

  it("leaves Bank Transfer and Cash at Church unchanged (no QR, no container)", async () => {
    const { render } = await setup(configured);
    for (const id of ["Bank transfer", "Cash at church"]) {
      const html = render(id);
      expect(html, id).not.toContain("<img");
      expect(html, id).not.toContain("@container");
      expect(html.startsWith('<div class="box"><dl')).toBe(true);
    }
  });

  it("shows no QR when the method's details are not configured", async () => {
    const { render } = await setup({ NEXT_PUBLIC_GCASH_NUMBER: "", NEXT_PUBLIC_MAYA_NUMBER: "0917XXXXXXX" });
    expect(render("GCash")).not.toContain("<img");
    expect(render("Maya")).not.toContain("<img");
  });
});
