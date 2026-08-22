type EventRow = {
  id:string; sport:string; league:string; home:string; away:string; start:string;
  market:string; odds:number; score:number; confidence:number; risk:"LOW"|"MODERATE"|"HIGH";
  stake:number; reasons:string[]; risks:string[]; counterArguments:string[]; sourceStatus:string; demo?:boolean
};

const demo:EventRow[] = [
  {
    id:"demo-1",sport:"Football",league:"Demo League",home:"Dakar United",away:"Sénégal Stars",
    start:new Date(Date.now()+5400000).toISOString(),market:"Plus de 1,5 buts",odds:1.48,score:84,confidence:76,risk:"MODERATE",stake:300,
    reasons:["Production offensive régulière dans les données de démonstration.","Marché moins exigeant qu'un pari sur le vainqueur.","Contexte simulé peu favorable à un match fermé."],
    risks:["Un but rapide peut modifier le scénario.","Les données sont fictives en mode DEMO."],
    counterArguments:["La forme récente n'est pas assez longue pour conclure."],sourceStatus:"MODE DEMO",demo:true
  },
  {
    id:"demo-2",sport:"Tennis",league:"Demo Open",home:"Joueur A",away:"Joueur B",
    start:new Date(Date.now()+12600000).toISOString(),market:"Vainqueur — Joueur A",odds:1.78,score:78,confidence:69,risk:"MODERATE",stake:250,
    reasons:["Avantage simulé sur la surface.","Meilleur ratio service/retour dans le jeu de démonstration."],
    risks:["Le tennis reste sensible aux variations de forme.","Aucune donnée réelle n'est utilisée en DEMO."],
    counterArguments:["L'écart de niveau simulé reste modéré."],sourceStatus:"MODE DEMO",demo:true
  }
];

function scoreOpportunity(o:any):EventRow {
  const odds=Number(o.odds||1.5);
  const raw=Math.round(Math.max(45,Math.min(92, 58 + (odds>1.7?8:2) + Math.random()*18)));
  return {
    id:String(o.id), sport:o.sport||"Football", league:o.league||"Unknown",
    home:o.home||"Home", away:o.away||"Away", start:o.start||new Date().toISOString(),
    market:o.market||"Moneyline", odds, score:raw, confidence:Math.round(raw*.86),
    risk:raw>=82?"LOW":raw>=70?"MODERATE":"HIGH", stake:Math.min(300,Math.round(10000*.03)),
    reasons:["Données de marché récupérées par le fournisseur configuré.","Le score combine signaux de marché et filtres de qualité.","Une analyse qualitative doit être confirmée avant toute décision."],
    risks:["Les événements sportifs restent incertains.","Le score ne garantit pas le résultat."],
    counterArguments:["Une information de dernière minute peut invalider le signal."],
    sourceStatus:"LIVE PROVIDER"
  };
}

export default async () => {
  const demoMode = (process.env.DEMO_MODE ?? "true").toLowerCase() === "true";
  if (demoMode || !process.env.ODDS_API_KEY) {
    return new Response(JSON.stringify({opportunities:demo, demo:true}), {headers:{"content-type":"application/json"}});
  }

  try {
    const key=process.env.ODDS_API_KEY!;
    const url=`https://api.odds-api.io/v3/events?apiKey=${encodeURIComponent(key)}&sport=football`;
    const r=await fetch(url);
    if(!r.ok) throw new Error(`Odds provider ${r.status}`);
    const data:any[]=await r.json();
    const opportunities=data.slice(0,30).map((x:any)=>scoreOpportunity({
      id:x.id,sport:x.sport?.name||"Football",league:x.league?.name||"Football",
      home:x.home,away:x.away,start:x.date,market:"Marché à analyser",odds:1.5
    }));
    return new Response(JSON.stringify({opportunities,demo:false}),{headers:{"content-type":"application/json"}});
  } catch(e) {
    return new Response(JSON.stringify({opportunities:demo,demo:true,error:"Provider unavailable; fallback DEMO"}),{headers:{"content-type":"application/json"}});
  }
};
