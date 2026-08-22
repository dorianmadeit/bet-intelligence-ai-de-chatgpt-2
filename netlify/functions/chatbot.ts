export default async (req:Request) => {
  if(req.method !== "POST") return new Response("Method not allowed",{status:405});
  const body=await req.json().catch(()=>({}));
  const message=String(body.message||"").trim();
  const key=process.env.AI_API_KEY;

  if(!key) {
    return new Response(JSON.stringify({
      answer:`MODE DEMO — J'ai reçu : "${message}". Je peux analyser des événements lorsque des données réelles sont connectées. Je ne peux pas garantir un gain et je peux recommander NO BET si les données sont insuffisantes.`
    }),{headers:{"content-type":"application/json"}});
  }

  // Generic OpenAI-compatible endpoint can be configured through AI_BASE_URL.
  const base=process.env.AI_BASE_URL || "https://api.openai.com/v1/chat/completions";
  const model=process.env.AI_MODEL || "gpt-4o-mini";
  try {
    const r=await fetch(base,{
      method:"POST",
      headers:{"content-type":"application/json","authorization":`Bearer ${key}`},
      body:JSON.stringify({
        model,
        temperature:0.2,
        messages:[
          {role:"system",content:"Tu es un assistant d'analyse sportive. Tu ne garantis jamais un résultat. Tu peux dire NO BET. Ne fabrique jamais une cote, une blessure ou une statistique. Analyse les données fournies et explique les risques."},
          {role:"user",content:message}
        ]
      })
    });
    if(!r.ok) throw new Error("AI provider error");
    const j:any=await r.json();
    return new Response(JSON.stringify({answer:j.choices?.[0]?.message?.content||"Réponse IA indisponible."}),{headers:{"content-type":"application/json"}});
  } catch {
    return new Response(JSON.stringify({answer:"Le fournisseur IA n'a pas répondu. Aucun pronostic réel ne doit être déduit de cette réponse."}),{headers:{"content-type":"application/json"}});
  }
};
