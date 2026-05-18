# MELA — My English Learning for Australia 🇦🇺

Une web app personnelle pour passer de **A2 à B1+** en 12 semaines.
Cap sur l'Australie, mais l'app cible l'anglais américain standard.

> Construite avec [Next.js 15](https://nextjs.org) + [Tailwind v4](https://tailwindcss.com) + [Framer Motion](https://www.framer.com/motion/).
> Conçue pour fonctionner offline-first (localStorage), responsive mobile-first.

## ✨ Features

- **5 catégories de grammaire** ciblées (temps verbaux, modaux, conditionnels, gérondifs/infinitifs, prépositions)
- **Cours détaillés** en français avec exemples bilingues, marqueurs de temps, pièges francophones
- **75 exercices QCM** avec feedback enrichi sur chaque erreur (la règle + comparaison ta réponse vs correcte)
- **Suivi de progression** : streak quotidienne, XP, précision, par catégorie
- **Plan 12 semaines** structuré en 3 phases (Fondations → Construction → Accélération)
- **Roleplay IA** : bibliothèque de scénarios avec prompts prêts à coller dans ChatGPT/Claude
- **Animations** Framer Motion + confettis sur réussite
- **Raccourcis clavier** dans les exercices (1-4 pour répondre, Enter pour continuer)

## 🚧 Roadmap

- [ ] **Phase 2** — Mini-jeux : Memory (FR↔EN), Speed Translation, Sentence Builder, Listening Drill, Fill-in-the-blank
- [ ] **Phase 2** — Mascotte Lottie animée qui réagit aux actions
- [ ] **Phase 3** — Module conversation IA en live (Anthropic API)
- [ ] **Phase 3** — Test de placement adaptatif (estimation CECRL + équivalent TOEIC)
- [ ] **Phase 3** — Vocabulaire thématique, faux-amis, phrasal verbs

## 🚀 Dev

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## 📦 Stack

- **Next.js 16** (App Router) + React 19 + TypeScript strict
- **Tailwind v4** pour le styling
- **Framer Motion 12** pour les animations
- **canvas-confetti** pour les célébrations
- **lucide-react** pour les icônes
- **Inter** comme font principale
- **localStorage** pour la persistance (pas de BDD)

## 🌐 Déploiement

Auto-deploy via [Vercel](https://vercel.com) à chaque push sur `main`.

## 📝 License

Personnel, non-commercial. Construit pour moi-même mais open source si ça peut servir.
