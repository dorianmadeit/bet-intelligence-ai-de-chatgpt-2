export default async () => new Response(JSON.stringify({
  app:"online",
  demoMode:(process.env.DEMO_MODE ?? "true").toLowerCase()==="true",
  ai:!!process.env.AI_API_KEY,
  odds:!!process.env.ODDS_API_KEY,
  football:!!process.env.API_FOOTBALL_KEY
}),{headers:{"content-type":"application/json"}});
