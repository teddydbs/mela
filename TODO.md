# MELA — Roadmap Auth + Gamification + Social + Placement

## Décisions actées

- **Stack backend** : Supabase (Postgres + Auth + RLS, MCP déjà branché côté Claude)
- **Modèle social** : amis par code à 6 caractères, ajout mutuel, visibilité XP / streak / dernière catégorie. Pas de feed, pas de chat, pas de recherche globale
- **Test de placement** : mapping question → catégorie à spécifier (le data brut existe déjà dans `seed/mela-placement-test.json`)

---

## Phase 1 — Spec (sans dépendance technique)

### 3. Mapping placement test → profil initial
Lire les 40 questions de `seed/mela-placement-test.json`, tagger chacune avec une `CategoryId` de `src/lib/types.ts`, définir le seuil "mastered" par catégorie, et la règle score → niveau (A2 / B1 / B1+).
**Sortie** : `seed/mela-placement-rules.json` + extension du type `UserData` avec `level` et `masteredCategories`.

---

## Phase 2 — Fondations (auth + persistance cloud)

### 4. Setup Supabase : projet, schéma DB, RLS
Tables :
- `profiles` (`id`=auth.uid, `display_name`, `level`, `mastered_categories`, `share_progress`, `created_at`)
- `user_progress` (port complet du `UserData` actuel : `streak`, `total_xp`, `total_correct`, `total_attempts`, `last_active`, `category_progress` jsonb)
- `friendships` (`user_a`, `user_b`, `accepted_at`, PK composite)
- `invite_codes` (`code`, `user_id`, `expires_at`)

RLS strict : un user ne lit/écrit que ses lignes ; un ami accepté peut lire le subset public de l'autre (XP, streak, masteredCategories — pas `category_progress` détaillé). Migration via `mcp__supabase__apply_migration`.

### 5. Intégrer Supabase Auth dans Next.js 16
`@supabase/ssr` pour App Router. Méthode : magic link email (zéro friction pour des potes) + Google OAuth en bonus. Server actions pour sign in/up/out. Middleware `middleware.ts` qui rafraîchit la session sur chaque request. Helpers `createServerClient` / `createBrowserClient` dans `src/lib/supabase/`.
⚠️ Lire `node_modules/next/dist/docs/` avant d'écrire — Next 16 a des breaking changes.

### 6. Pages d'auth : login, signup, callback, logout
Routes :
- `src/app/login/page.tsx`
- `src/app/auth/callback/route.ts` (handler du magic link)
- `src/app/logout/route.ts`

Gate des pages applicatives derrière un check de session (redirect vers `/login` si pas connecté). Design cohérent avec l'UI existante (Tailwind 4, look bottom-toolbar / top-bar).

### 7. Refactor `storage.ts` en couche hybride localStorage + Supabase
`src/lib/storage.ts` est actuellement 100% localStorage. Stratégie : garder localStorage comme cache instantané (UX zéro-latence), sync vers Supabase en arrière-plan (debounce 1-2 s). Au login : pull du cloud → écrase le cache. À chaque mutation : optimistic update local + upsert cloud. Gérer le cas offline (queue de syncs).

### 8. Migration du localStorage existant au premier login
Au premier login : détecter `mela_data_v1` dans localStorage. Si présent ET cloud vide → upload. Si cloud existe → demander à l'utilisateur ("garder ta progression locale ou celle du compte ?"). Éviter la perte silencieuse de données.

---

## Phase 3 — Placement test (UX d'inscription)

### 9. UI onboarding : flow placement test
Route `src/app/onboarding/page.tsx`. Affiche les 40 questions de `seed/mela-placement-test.json` une par une (avec barre de progression). Skippable mais déconseillé. Après signup → onboarding obligatoire avant `/home`.

### 10. Brancher scoring du test → profil initial
Appliquer le mapping défini en tâche #3. Écrire dans `profiles` : `level`, `mastered_categories[]`. Pré-remplir un peu de XP pour les catégories validées (récompense visuelle). Page de résultat qui annonce le niveau et propose la première leçon non-masterisée.

---

## Phase 4 — Gamification

### 11. Achievements + quêtes journalières
Existant : streak, XP, badges (`streak-xp-badges.tsx`). À ajouter :
- **Achievements one-shot** : "Première leçon", "10 jours d'affilée", "Catégorie X complétée" — stockés en DB
- **Quêtes journalières** : "Fais 1 quiz", "Réussis 5 exercices" — reset à minuit local
- **Paliers de niveau visuels** avec déblocage (thèmes memory game, avatar évolutif via `avatar.tsx`)
- **Confetti** déjà installé (`canvas-confetti`) → déclenché sur milestones

---

## Phase 5 — Social

### 12. Système d'amis : code d'invitation + page Friends
Backend : route serveur qui génère un code 6 caractères (table `invite_codes`, expire 7 jours), endpoint pour accepter (crée la ligne `friendships`).
UI : route `src/app/friends/page.tsx` listant les amis acceptés avec leur XP / streak / dernière catégorie touchée + bouton "Ajouter un ami" (input du code). Reuse `avatar.tsx`.

### 13. Leaderboard d'amis + privacy opt-in
Sur `/friends` ou `/stats` : classement XP de la semaine entre amis (pas global, juste le cercle ajouté). Setting profil : "Rendre ma progression visible à mes amis" (default ON, opt-out possible) — si OFF, le user apparaît dans la liste mais sans chiffres. Stocké dans `profiles.share_progress boolean`.

---

## Phase 6 — Compliance

### 14. RGPD : export + suppression de compte
Page settings avec :
1. Export JSON de toutes ses données (profile + progress + friendships)
2. Bouton supprimer le compte → cascade delete sur toutes les tables + suppression du `auth.users` via API admin Supabase
3. Confirmation à 2 étapes (taper son email)

Obligatoire si déploiement public avec users en EU.

---

## Ordre d'attaque recommandé

`#3` → `#4` → `#5` → `#6` → `#7` → `#9` → `#10` → `#8` → `#11` → `#12` → `#13` → `#14`

Le `#3` peut tourner en parallèle de `#4` (pas de dépendance technique).
