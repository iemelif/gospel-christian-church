import Image from "next/image";
import { SHARE_IMAGES } from "@/content/site";
import type { ShareImage } from "@/lib/seo";
import { stripeBefore } from "@/lib/ui";

/** Church family photo at the top of an inner page, framed like the Donate page's building picture.
 *  Also the page's share / search-result image: Google prefers a picture that is visible on the page. */
export default function PagePhoto({ img = SHARE_IMAGES.family }: { img?: ShareImage }) {
  return (
    <figure className={`relative m-0 mb-10 overflow-hidden rounded-2xl border border-line bg-card px-2.5 pt-[13px] pb-2.5 shadow-[0_24px_48px_-24px_rgba(127,31,54,.45)] ${stripeBefore}`}>
      <Image src={img.url} alt={img.alt} width={img.width} height={img.height} sizes="(max-width: 1080px) 100vw, 1080px" priority unoptimized className="block aspect-[21/9] h-auto w-full rounded-xl bg-paper object-cover" />
    </figure>
  );
}
