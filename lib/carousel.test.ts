import { mkdtempSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { CAROUSEL_DIR, CAROUSEL_EXTENSIONS, altFromFilename, carouselSlides, toSlides } from "./carousel";

describe("toSlides", () => {
  it("accepts every supported image extension (any case) and ignores other files", () => {
    const images = CAROUSEL_EXTENSIONS.flatMap((ext) => [`a${ext}`, `b${ext.toUpperCase()}`]);
    const slides = toSlides([...images, "notes.txt", "video.mp4", "image.svg", "README.md", ".DS_Store", ".hidden.png", "png"]);
    expect(slides).toHaveLength(images.length);
    expect(slides.every((s) => /\.(jpe?g|png|webp|avif)$/i.test(s.src))).toBe(true);
  });
  it("sorts alphabetically by file name and builds /images/hershot-carousel/<file> URLs", () => {
    expect(toSlides(["03-c.png", "01-a.jpg", "10-z.webp", "02-b.avif"]).map((s) => s.src)).toEqual(
      ["01-a.jpg", "02-b.avif", "03-c.png", "10-z.webp"].map((f) => `/images/hershot-carousel/${f}`));
    expect(toSlides(["my photo.jpg"])[0].src).toBe("/images/hershot-carousel/my%20photo.jpg");
  });
  it("derives readable alt text from the file name", () => {
    expect(altFromFilename("01-gcc-nehemniah.png")).toBe("Gcc nehemniah");
    expect(altFromFilename("04_youth--choir.JPEG")).toBe("Youth choir");
    expect(altFromFilename("sunday service.webp")).toBe("Sunday service");
    expect(altFromFilename("05.png")).toBe("Church photo");
  });
});

describe("carouselSlides", () => {
  let dir = "";
  afterEach(() => { if (dir) rmSync(dir, { recursive: true, force: true }); });

  it("discovers every image currently in public/images/hershot-carousel/ (no hardcoded list)", () => {
    const onDisk = readdirSync(CAROUSEL_DIR).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)).sort((a, b) => a.localeCompare(b, "en"));
    const slides = carouselSlides();
    expect(slides.length).toBeGreaterThan(1);
    expect(slides.map((s) => s.src)).toEqual(onDisk.map((f) => `/images/hershot-carousel/${encodeURIComponent(f)}`));
  });
  it("picks up an added image and drops a removed one without any code change", () => {
    dir = mkdtempSync(join(tmpdir(), "carousel-"));
    writeFileSync(join(dir, "02-b.png"), ""); writeFileSync(join(dir, "notes.txt"), ""); mkdirSync(join(dir, "sub.png"));
    expect(carouselSlides(dir).map((s) => s.src)).toEqual(["/images/hershot-carousel/02-b.png"]);
    writeFileSync(join(dir, "01-new.webp"), "");
    expect(carouselSlides(dir).map((s) => s.src)).toEqual(["/images/hershot-carousel/01-new.webp", "/images/hershot-carousel/02-b.png"]);
    rmSync(join(dir, "02-b.png"));
    expect(carouselSlides(dir).map((s) => s.src)).toEqual(["/images/hershot-carousel/01-new.webp"]);
  });
  it("returns no slides when the folder is missing", () => {
    expect(carouselSlides(join(tmpdir(), "no-such-carousel-folder"))).toEqual([]);
  });
});
