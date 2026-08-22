import { useEffect, useMemo, useState } from "react";
import { askAI, getOpportunities } from "./api";
import { mockStats } from "./data";
import { Opportunity } from "./types";

const money = (n:number) => new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";
const pct = (n:number) => `${Math.max(0, Math.min(100, n)).toFixed(1)}%`;

export function App() {
  const [tab, setTab] = useState("Dashboard");
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Opportunity|null>(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{role:string,text:string}[]>([
    { role:"ai", text:"Bonjour. Je suis Bet Intelligence AI. Je peux scanner les opportunités, expliquer un pari, faire une contre-analyse ou conclure NO BET." }
  ]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    getOpportunities().then(setOpps).finally(() => setLoading(false));
  }, []);

  const bankroll = 10000;
  const target = 700000;
  const progress = bankroll / target * 100;

  const top = useMemo(() => [...opps].sort((a,b)=>b.score-a.score).slice(0,5), [opps]);

  async function scan() {
    setScanning(true);
    try { setOpps(await getOpportunities()); }
    finally { setScanning(false); }
  }

  async function sendChat() {
    if (!message.trim()) return;
    const q = message.trim();
    setMessage("");
    setChat(c => [...c, {role:"user",text:q}]);
    const answer = await askAI(q);
    setChat(c => [...c, {role:"ai",text:answer}]);
  }

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><span className="brandDot">◆</span><div><b>BET INTELLIGENCE</b><small>AI SPORTS LAB</small></div></div>
      <nav>{["Dashboard","Opportunities","Calendar","AI Assistant","Bankroll","History","Backtest","Settings"].map(x =>
        <button key={x} className={tab===x?"nav active":"nav"} onClick={()=>setTab(x)}>{x}</button>
      )}</nav>
      <div className="sideStatus"><span className="dot"/> DEMO ENGINE ONLINE</div>
    </aside>

    <main className="main">
      <header className="topbar">
        <div><span className="eyebrow">PERSONAL BETTING INTELLIGENCE</span><h1>{tab}</h1></div>
        <button className="scan" onClick={scan} disabled={scanning}>{scanning ? "ANALYSE..." : "↻ SCAN 30 JOURS"}</button>
      </header>

      {tab === "Dashboard" && <>
        <section className="warning"><b>⚠ Objectif très agressif</b><span>10 000 → 700 000 FCFA en 30 jours n'est pas garanti. Le moteur peut recommander NO BET.</span></section>
        <section className="cards">
          <Stat title="BANKROLL" value={money(bankroll)} meta="Capital initial"/>
          <Stat title="OBJECTIF" value={money(target)} meta={`${pct(progress)} atteint`}/>
          <Stat title="PROFIT" value={money(0)} meta="Depuis le départ"/>
          <Stat title="PARIS" value="0" meta="Historique réel"/>
        </section>
        <section className="grid2">
          <div className="panel">
            <div className="panelHead"><div><span className="eyebrow">30 DAY TARGET</span><h2>Progression</h2></div><b>{pct(progress)}</b></div>
            <div className="progress"><i style={{width:`${Math.max(progress,1)}%`}}/></div>
            <div className="progressLabels"><span>10K FCFA</span><span>700K FCFA</span></div>
            <p className="muted">La barre est un suivi de l'objectif, pas une promesse de rendement.</p>
          </div>
          <div className="panel">
            <div className="panelHead"><div><span className="eyebrow">ENGINE</span><h2>Scan status</h2></div><span className="badge green">READY</span></div>
            <div className="engineRow"><span>Événements détectés</span><b>{mockStats.scanned}</b></div>
            <div className="engineRow"><span>Analysés</span><b>{mockStats.analyzed}</b></div>
            <div className="engineRow"><span>Candidats</span><b>{mockStats.candidates}</b></div>
            <div className="engineRow"><span>Recommandations</span><b>{mockStats.recommendations}</b></div>
          </div>
        </section>
        <section className="panel">
          <div className="panelHead"><div><span className="eyebrow">RANKED SIGNALS</span><h2>Top opportunités</h2></div><span className="muted">{loading?"Chargement...":`${top.length} signaux`}</span></div>
          <OpportunityTable data={top} onSelect={setSelected}/>
        </section>
      </>}

      {tab === "Opportunities" && <section className="panel"><div className="panelHead"><div><span className="eyebrow">MARKET SCANNER</span><h2>Toutes les opportunités</h2></div></div><OpportunityTable data={opps} onSelect={setSelected}/></section>}

      {tab === "AI Assistant" && <section className="chat panel">
        <div className="chatLog">{chat.map((m,i)=><div className={m.role==="user"?"bubble user":"bubble"} key={i}>{m.text}</div>)}</div>
        <div className="composer"><input value={message} onChange={e=>setMessage(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="Ex : analyse les meilleurs paris aujourd'hui..." /><button onClick={sendChat}>Envoyer</button></div>
      </section>}

      {["Calendar","Bankroll","History","Backtest","Settings"].includes(tab) && <section className="panel placeholder">
        <span className="eyebrow">MODULE</span><h2>{tab}</h2><p>Module prêt pour connexion aux données réelles. Le mode DEMO est actif.</p>
      </section>}
    </main>

    {selected && <div className="overlay" onClick={()=>setSelected(null)}><div className="drawer" onClick={e=>e.stopPropagation()}>
      <button className="close" onClick={()=>setSelected(null)}>×</button>
      <span className="eyebrow">{selected.sport} · {selected.league}</span>
      <h2>{selected.home} <span>vs</span> {selected.away}</h2>
      <div className="decision"><b>{selected.market}</b><strong>{selected.odds.toFixed(2)}</strong></div>
      <div className="metrics"><Metric t="SCORE" v={`${selected.score}/100`}/><Metric t="CONFIANCE" v={`${selected.confidence}%`}/><Metric t="RISQUE" v={selected.risk}/></div>
      <h3>Pourquoi ?</h3>{selected.reasons.map((x,i)=><p className="bullet" key={i}>✓ {x}</p>)}
      <h3>Risques</h3>{selected.risks.map((x,i)=><p className="bullet risk" key={i}>! {x}</p>)}
      <h3>Contre-analyse</h3>{selected.counterArguments.map((x,i)=><p className="bullet" key={i}>↔ {x}</p>)}
      <div className="source">Source : {selected.sourceStatus}</div>
      <button className="noBet" onClick={()=>setSelected(null)}>VALIDER APRÈS VÉRIFICATION FINALE</button>
    </div></div>}
  </div>
}

function Stat({title,value,meta}:{title:string,value:string,meta:string}) {
  return <div className="stat"><span>{title}</span><strong>{value}</strong><small>{meta}</small></div>
}
function Metric({t,v}:{t:string,v:string}) { return <div><span>{t}</span><b>{v}</b></div> }
function OpportunityTable({data,onSelect}:{data:Opportunity[],onSelect:(x:Opportunity)=>void}) {
  if (!data.length) return <div className="empty">Aucune opportunité fiable. <b>NO BET</b></div>;
  return <div className="tableWrap"><table><thead><tr><th>Événement</th><th>Marché</th><th>Cote</th><th>Score</th><th>Confiance</th><th>Risque</th></tr></thead><tbody>
    {data.map(o=><tr key={o.id} onClick={()=>onSelect(o)}><td><b>{o.home}</b><br/><span className="muted">vs {o.away}</span></td><td>{o.market}</td><td className="odds">{o.odds.toFixed(2)}</td><td><b>{o.score}</b>/100</td><td>{o.confidence}%</td><td><span className={`badge ${o.risk==="LOW"?"green":o.risk==="MODERATE"?"yellow":"red"}`}>{o.risk}</span></td></tr>)}
  </tbody></table></div>
}
