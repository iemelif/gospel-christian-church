import Image from "next/image";
import { ADDRESS, LINKS, LOGOS, SITE, SOCIAL } from "@/content/site";
import { SCHEDULE, CHURCH } from "@/lib/config";
import SocialIcon from "./SocialIcon";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap foot-grid">
        <div className="foot-logos">
          <a href={LINKS.iemelif} aria-label="IEMELIF – official website" target="_blank" rel="noopener">
            <Image src={LOGOS.iemelif.src} alt={LOGOS.iemelif.alt} width={LOGOS.iemelif.width} height={LOGOS.iemelif.height} className="logo-sm iemelif" />
          </a>
          <a href={LINKS.gcc} aria-label={`${SITE.shortName} – home`}>
            <Image src={LOGOS.gcc.src} alt={LOGOS.gcc.alt} width={LOGOS.gcc.width} height={LOGOS.gcc.height} className="logo-sm gcc" />
          </a>
        </div>

        <div>
          <b>{SITE.name}</b>
          <address>{ADDRESS.display}</address>
          <p className="sched">{SCHEDULE.map((s) => `${s.day.replace("Every ", "")} ${s.time}`).join(" · ")}</p>
          <p>Questions about giving? <a href={`mailto:${CHURCH.email}`}>{CHURCH.email}</a></p>
        </div>

        {SOCIAL.length > 0 && (
          <div>
            <b>Follow us</b>
            <ul className="social">
              {SOCIAL.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer me" aria-label={`${SITE.shortName} on ${s.label}`}>
                    <SocialIcon icon={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="wrap copy">© {new Date().getFullYear()} {SITE.name}</div>
    </footer>
  );
}
