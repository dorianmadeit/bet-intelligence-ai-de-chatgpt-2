import { Opportunity } from "./types";

export const mockOpportunities: Opportunity[] = [
  {
    id: "demo-1",
    sport: "Football",
    league: "Demo League",
    home: "Dakar United",
    away: "Sénégal Stars",
    start: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    market: "Plus de 1,5 buts",
    odds: 1.48,
    score: 84,
    confidence: 76,
    risk: "MODERATE",
    stake: 300,
    reasons: [
      "Les deux équipes présentent une production offensive régulière dans les données de démonstration.",
      "Le marché visé est moins exigeant qu'un pari sur le vainqueur.",
      "Le contexte simulé montre peu d'indices défensifs favorables à un match fermé."
    ],
    risks: [
      "Un but rapide peut modifier le scénario.",
      "Les données sont fictives en mode DEMO."
    ],
    counterArguments: [
      "La forme récente n'est pas suffisamment longue pour conclure avec certitude."
    ],
    sourceStatus: "MODE DEMO",
    demo: true
  },
  {
    id: "demo-2",
    sport: "Tennis",
    league: "Demo Open",
    home: "Joueur A",
    away: "Joueur B",
    start: new Date(Date.now() + 1000 * 60 * 210).toISOString(),
    market: "Vainqueur — Joueur A",
    odds: 1.78,
    score: 78,
    confidence: 69,
    risk: "MODERATE",
    stake: 250,
    reasons: [
      "Avantage simulé sur la surface.",
      "Meilleur ratio service/retour dans le jeu de données de démonstration."
    ],
    risks: [
      "Le tennis reste très sensible aux variations de forme.",
      "Aucune donnée réelle n'est utilisée en DEMO."
    ],
    counterArguments: [
      "L'écart de niveau simulé reste modéré."
    ],
    sourceStatus: "MODE DEMO",
    demo: true
  }
];

export const mockStats = {
  scanned: 128,
  analyzed: 74,
  candidates: 8,
  recommendations: 2
};
