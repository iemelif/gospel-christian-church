import Image from "next/image";
import { ADDRESS, LINKS, LOGOS, SITE, SOCIAL } from "@/content/site";
import { SCHEDULE, CHURCH } from "@/lib/config";
import SocialIcon from "./SocialIcon";
import { stripeBefore, wrap } from "@/lib/ui";

const heading = "mb-1.5 block text-brand";
const line = "mt-0 mb-1.5 text-mute";

export default function SiteFooter() {
  return (
    <footer className={`relative mt-0 bg-paper pt-10 pb-5 text-[14px] text-ink print:hidden ${stripeBefore}`}>
      {/* Three columns at every width: the original CSS never applied its ≤800px one-column rule (source-order bug), and the design is kept as it was. */}
      <div className={`${wrap} grid grid-cols-[auto_1fr_auto] items-start gap-8`}>
        <div className="flex items-center gap-3">
          <a className="flex text-blue" href={LINKS.iemelif} aria-label="IEMELIF – official website" target="_blank" rel="noopener">
            <Image src={LOGOS.iemelif.src} alt={LOGOS.iemelif.alt} width={LOGOS.iemelif.width} height={LOGOS.iemelif.height} className="block h-12 w-auto shrink-0" />
          </a>
          <a className="flex text-blue" href={LINKS.gcc} aria-label={`${SITE.shortName} – home`}>
            <Image src={LOGOS.gcc.src} alt={LOGOS.gcc.alt} width={LOGOS.gcc.width} height={LOGOS.gcc.height} className="block h-12 w-auto shrink-0" />
          </a>
        </div>

        <div>
          <b className={heading}>{SITE.name}</b>
          <address className="mb-2 not-italic">{ADDRESS.display}</address>
          <p className={line}>{SCHEDULE.map((s) => `${s.day.replace("Every ", "")} ${s.time}`).join(" · ")}</p>
          <p className={line}>Questions about giving? <a className="text-blue" href={`mailto:${CHURCH.email}`}>{CHURCH.email}</a></p>
        </div>

        {SOCIAL.length > 0 && (
          <div>
            <b className={heading}>Follow us</b>
            <ul className="m-0 flex list-none gap-2.5 p-0">
              {SOCIAL.map((s) => (
                <li key={s.href}>
                  <a className="flex size-10 items-center justify-center rounded-full bg-brand text-white hover:bg-gold hover:text-ink" href={s.href} target="_blank" rel="noopener noreferrer me" aria-label={`${SITE.shortName} on ${s.label}`}>
                    <SocialIcon icon={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className={`${wrap} mt-[22px] border-t border-line pt-3.5 text-[13px] text-mute`}>© {new Date().getFullYear()} {SITE.name}</div>
    </footer>
  );
}
