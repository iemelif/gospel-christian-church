import { SCHEDULE } from "@/lib/config";
import { card, cardTitle, cards, h2, sub, wrap } from "@/lib/ui";

/**
 * "Join us" section: an invitation plus one card per worship service from SCHEDULE (lib/config.ts).
 * `intro` is the sentence under the heading (pages can tailor it; the default is general).
 * Renders `section#visit`, so use it at most once per page.
 */
export default function JoinUs({ intro = "Come worship with us this week." }: { intro?: string }) {
  return (
    <section id="visit" className="py-14"><div className={wrap}>
      <h2 className={h2}>Join us</h2>
      <p className={sub}>{intro}</p>
      <div className={cards}>
        {SCHEDULE.map((s) => (
          <div className={card} key={s.title}><h3 className={cardTitle}>{s.title}</h3><p className="m-0">{s.day}<br /><b>{s.time}</b></p></div>
        ))}
      </div>
    </div></section>
  );
}
