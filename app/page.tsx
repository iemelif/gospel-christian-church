import ChurchProgress from "@/components/ChurchProgress";
import GiveForm from "@/components/GiveForm";
import { CHURCH, SCHEDULE, php } from "@/lib/config";
import { summary } from "@/lib/store";
import { pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMeta(
  "Church Building Fund",
  "Help Gospel Christian Church IEMELIF raise ₱12,000,000 for our new church building in Frances, Calumpit, Bulacan.",
  "/",
);

export default async function Home() {
  const { raised, wall, donors } = await summary();
  const pct = Math.min(100, (raised / CHURCH.goal) * 100);
  const pctText = pct.toFixed(1).replace(/\.0$/, "");
  const toGo = Math.max(0, CHURCH.goal - raised);
  return (
    <main id="main">
      <div className="hero">
        <div className="wrap">
          <div className="grid">
            <div>
              <h1>Help us build a home for every neighbor.</h1>
              <p>Gospel Christian Church is raising {php(CHURCH.goal)} for a new church building in Frances, Calumpit. It will be a place where our whole community can worship, learn, and serve together. We are {pctText}% of the way there, and your gift moves us closer.</p>
              <a className="btn lg" href="#give">Give to the building fund</a>{" "}<a className="btn ghost lg" href="#how">How giving works</a>
              <div className="verse">“Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.” — 2 Corinthians 9:7</div>
            </div>
            <div className="church">
              <ChurchProgress pct={pct} />
              <div className="pct">{pctText}%</div>
              <small>{php(raised)} of {php(CHURCH.goal)}</small>
              <div className="church-stats">
                <div><b>{php(toGo)}</b><span>still needed</span></div>
                {donors > 0 && <div><b>{donors}</b><span>confirmed gift{donors > 1 ? "s" : ""} online</span></div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="progress" className="progress"><div className="wrap">
        <h2>{CHURCH.campaign}</h2>
        <p className="sub">The total moves whenever our treasurer confirms a gift, so what you see here is money actually received.</p>
        <div className="card">
          <div className="bar" role="progressbar" aria-label="Building fund progress" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
            <i style={{ width: `${pct}%` }} />
            {[25, 50, 75].map((m) => <em key={m} style={{ left: `${m}%` }} className={pct >= m ? "hit" : ""} />)}
          </div>
          <div className="marks" aria-hidden="true"><span>₱0</span><span>25%</span><span>50%</span><span>75%</span><span>{php(CHURCH.goal)}</span></div>
          <div className="meta"><span><b>{php(raised)}</b> raised</span><span><b>{php(toGo)}</b> to go</span></div>
        </div>
      </div></section>

      <section id="how" className="how-it-works"><div className="wrap">
        <h2>How your gift reaches the building</h2>
        <p className="sub">Three steps, and you can see the result on this page.</p>
        <ol className="steps">
          <li><b>Record your pledge</b><span>Choose an amount and tell us who you are. You get a reference number right away.</span></li>
          <li><b>Send your gift</b><span>Use GCash, Maya, bank transfer, or give in person at church. Add your reference number.</span></li>
          <li><b>See it counted</b><span>Our treasurer confirms what was received, and your gift is added to the total above.</span></li>
        </ol>
      </div></section>

      <section id="give" className="give"><div className="wrap">
        <h2>Give to {CHURCH.name}</h2>
        <p className="sub">It takes about a minute. Give once, or every month until the building is finished.</p>
        <div className="form">
          <div className="card form-card"><GiveForm /></div>
          <aside className="side">
            <div className="card trust">
              <h3>Give with confidence</h3>
              <ul>
                <li>Every pledge gets a reference number you can keep.</li>
                <li>Only gifts confirmed by the treasurer count toward the total.</li>
                <li>Your email is never shown. Choose “Anonymous” to hide your name on the wall.</li>
              </ul>
              <p className="muted">Questions? <a href={`mailto:${CHURCH.email}`}>{CHURCH.email}</a></p>
            </div>
            <div className="card">
              <h3>Giving wall</h3>
              {wall.length ? wall.map((g) => (
                <div className="gift" key={g.id}>
                  <div><b>{g.name}</b>{g.message && <em>“{g.message.slice(0, 60)}”</em>}</div><b>{php(g.amount)}</b>
                </div>
              )) : <p className="muted">No confirmed gifts yet. Be the first to give.</p>}
              {donors > 0 && <p className="muted" style={{ marginTop: 12 }}>{donors} confirmed gift{donors > 1 ? "s" : ""} on this site</p>}
            </div>
          </aside>
        </div>
      </div></section>

      <section id="visit" className="visit"><div className="wrap">
        <h2>Join us</h2>
        <p className="sub">Come worship with us this week, and see the place your gift is building.</p>
        <div className="cards">
          {SCHEDULE.map((s) => (
            <div className="card" key={s.title}><h3>{s.title}</h3><p style={{ margin: 0 }}>{s.day}<br /><b>{s.time}</b></p></div>
          ))}
        </div>
      </div></section>

      <a className="give-bar" href="#give">Give to the building fund</a>
    </main>
  );
}
