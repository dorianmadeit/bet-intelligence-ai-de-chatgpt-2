import { Opportunity } from "./types";
import { mockOpportunities } from "./data";

async function call<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api/${path}`, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getOpportunities(): Promise<Opportunity[]> {
  try {
    const result = await call<{ opportunities: Opportunity[] }>("scan");
    return result.opportunities;
  } catch {
    return mockOpportunities;
  }
}

export async function askAI(message: string): Promise<string> {
  try {
    const result = await call<{ answer: string }>("chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    return result.answer;
  } catch {
    return "Le moteur IA est indisponible. Le mode DEMO reste actif : aucune donnée réelle ne doit être considérée comme disponible.";
  }
}
