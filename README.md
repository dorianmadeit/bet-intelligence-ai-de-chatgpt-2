# Bet Intelligence AI

Application React + TypeScript + Netlify Functions pour analyser des opportunités sportives.

## 1. Installer

```bash
npm install
npm run dev
```

## 2. Mode DEMO

Le projet fonctionne sans API :

```text
DEMO_MODE=true
```

Les événements affichés sont explicitement marqués `MODE DEMO` et ne sont pas des données réelles.

## 3. Déploiement Netlify

1. Pousser ce projet sur GitHub.
2. Dans Netlify, importer le repository.
3. Build command : `npm run build`
4. Publish directory : `dist`
5. Functions directory : `netlify/functions`
6. Ajouter les variables d'environnement dans Netlify.

Variables possibles :

```text
DEMO_MODE=false
AI_API_KEY=...
AI_MODEL=...
AI_BASE_URL=...
ODDS_API_KEY=...
API_FOOTBALL_KEY=...
NEWS_API_KEY=...
```

Les clés privées sont utilisées par les Netlify Functions, jamais par React.

## 4. APIs

Le projet démarre avec un adaptateur Odds API dans `netlify/functions/scan.ts`. Le fournisseur est interchangeable.

Pour une vraie version multi-sports, ajouter des providers séparés pour :
- fixtures
- statistiques
- blessures
- compositions
- actualités
- cotes

## 5. Important

Le système n'exécute aucun pari automatiquement et ne garantit aucun gain. Le score est un outil d'analyse et le système peut retourner `NO BET`.
