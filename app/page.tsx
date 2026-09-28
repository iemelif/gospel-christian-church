import ChurchProgress from "@/components/ChurchProgress";
import GiveForm from "@/components/GiveForm";
import { CHURCH, SCHEDULE, php } from "@/lib/config";
import { summary } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { raised, wall, donors } = await summary();
  const pct = Math.min(100, (raised / CHURCH.goal) * 100);
  const pctText = pct.toFixed(1).replace(/\.0$/, "");
  return (
    <>
      <header className="hero">
        <div className="wrap">
          <nav><b>{CHURCH.name}</b><a className="btn" href="#give">Give now</a></nav>
          <div className="grid">
            <div>
              <h1>Help us build a home for every neighbor.</h1>
              <p>We are raising {php(CHURCH.goal)} for our new church building. Every gift, big or small, brings us closer to a place where our whole community can worship, learn, and serve together.</p>
              <a className="btn" href="#give">Make a gift</a>{" "}<a className="btn ghost" href="#progress">See our progress</a>
              <div className="verse">“Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.” — 2 Corinthians 9:7</div>
            </div>
            <div className="church">
              <ChurchProgress pct={pct} />
              <div className="pct">{pctText}%</div>
              <small>{php(raised)} of {php(CHURCH.goal)}</small>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section id="progress"><div className="wrap">
          <h2>{CHURCH.campaign}</h2>
          <p className="sub">Progress updates whenever our treasurer confirms a gift.</p>
          <div className="card">
            <div className="bar" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${pct}%` }} /></div>
            <div className="meta"><span><b>{php(raised)}</b> raised</span><span>{php(Math.max(0, CHURCH.goal - raised))} to go</span></div>
          </div>
        </div></section>

        <section id="give" style={{ paddingTop: 0 }}><div className="wrap">
          <h2>Give to {CHURCH.name}</h2>
          <p className="sub">Fill in the form to record your gift. You’ll get a reference number and payment instructions.</p>
          <div className="form">
            <div className="card"><GiveForm /></div>
            <aside className="card">
              <h3>Giving wall</h3>
              {wall.length ? wall.map((g) => (
                <div className="gift" key={g.id}>
                  <div><b>{g.name}</b>{g.message && <em>“{g.message.slice(0, 60)}”</em>}</div><b>{php(g.amount)}</b>
                </div>
              )) : <p className="muted">No confirmed gifts yet. Be the first to give.</p>}
              {donors > 0 && <p className="muted" style={{ marginTop: 12 }}>{donors} confirmed gift{donors > 1 ? "s" : ""} on this site</p>}
            </aside>
          </div>
        </div></section>

        <section id="visit" style={{ paddingTop: 0 }}><div className="wrap">
          <h2>Join us</h2>
          <p className="sub">Come worship with us this week.</p>
          <div className="cards">
            {SCHEDULE.map((s) => (
              <div className="card" key={s.title}><h3>{s.title}</h3><p style={{ margin: 0 }}>{s.day}<br /><b>{s.time}</b></p></div>
            ))}
          </div>
        </div></section>
      </main>

      <footer><div className="wrap">
        <div><b>{CHURCH.name}</b><br />Sunday 8:30–11:00 AM · Wednesday 7:00–9:00 PM · Saturday devotion 5:30–7:00 AM</div>
        <div>Questions about giving?<br /><a href={`mailto:${CHURCH.email}`}>{CHURCH.email}</a></div>
      </div></footer>
    </>
  );
}
