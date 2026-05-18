# MELA — Design System de référence

> Document de référence pour reproduire la cohérence visuelle de l'app.
> Inspiré de la réf "learning dashboard" (Dei-style). Tout est codé en Tailwind v4 + Framer Motion.

---

## 1. Philosophie

- **Noir extérieur + panneau blanc inset 5px** (effet "carte device")
- **Cards arrondies 24-32px** avec ombres très douces
- **Icône circulaire débordante** en haut à droite de chaque card (le marqueur visuel signature)
- **Status badges** explicites avec icônes : Completed / In progress / Upcoming
- **Pas d'emojis** dans l'UI. Toujours icônes Lucide + couleurs. Avatars cartoon = DiceBear.
- **Featured card colorée** en haut de chaque vue principale (violet, mint, jaune, bleu pastel selon contexte)
- **Right sidebar** sur `lg+` pour les meta-infos (events, ressources, stats)
- **Sticker bottom bar** sur mobile uniquement (5 icônes colorées dans pill noire)

---

## 2. Palette

### Couleurs structurelles

| Token | Hex | Usage |
|-------|-----|-------|
| `#0A0A0A` | Noir | Frame extérieure, top bar, bottom nav, boutons primary |
| `#FFFFFF` | Blanc | Panneau intérieur, cards |
| `#F3F4F6` | Gris très clair | Background bouton secondaire |
| `#E5E7EB` | Gris clair | Borders cards |
| `#6B7280` | Gris medium | Texte secondaire |
| `#0F172A` | Gris foncé | Texte principal |

### Accents par catégorie (grammar)

| Catégorie | Accent | BgLight | Icon Lucide |
|-----------|--------|---------|-------------|
| Temps verbaux | `#FF6B35` (orange) | `#FFF1EA` | `Clock` |
| Modaux | `#34C759` (vert) | `#E8F8EC` | `Target` |
| Conditionnels | `#FFB800` (or) | `#FFF8E1` | `Sparkles` |
| Gérondifs | `#AF52DE` (violet) | `#F5EBFA` | `BookOpen` |
| Prépositions | `#007AFF` (bleu) | `#E5F1FF` | `Compass` |

### Featured pastels

| Couleur | Hex | Usage |
|---------|-----|-------|
| Violet pastel | `#E5C8E8` | Featured "lesson en cours" (home) |
| Bleu pastel | `#D7E8FF` | Featured "semaine actuelle" (plan) |
| Lavande | `#EFD9F7` | Featured "comment ça marche" (roleplay) |
| Mint | `#D6F5DD` | Featured "en cours de fabrication" (games) |

### Status colors

| État | Bg | Text | Icon |
|------|----|----|------|
| Completed | `#B5F0C9` | `#1F7A3F` | `Check` |
| In progress | `#FFF4B3` | `#9C7A37` | `Sparkles` |
| Upcoming | `#F3F4F6` | `#6B7280` | `Lock` |
| Erreur | `#FFEBEA` | `#B91C1C` | `X` |

---

## 3. Typographie

- **Font** : `Plus Jakarta Sans` (via `next/font/google`)
- **Hiérarchie** :
  - Titres principaux : `text-3xl sm:text-4xl font-extrabold tracking-tight`
  - Sous-titres : `text-xl font-extrabold` ou `text-lg font-extrabold`
  - Body : `text-sm text-gray-500/600/700 font-medium/semibold`
  - Labels mini : `text-[10px] uppercase tracking-widest font-extrabold`
  - Stats / chiffres : toujours `tabular-nums`
- **Toujours** `font-extrabold` (800) pour les titres et boutons importants. `font-bold` (700) pour les sous-éléments. `font-semibold` (600) pour le body principal.

---

## 4. Structure de page

Toute page suit ce squelette (cf `src/app/page.tsx`) :

```tsx
<div className="px-4 sm:px-6 md:px-8 pt-5 pb-6 grid lg:grid-cols-[1fr_300px] gap-6">
  <div>
    {/* Header (title + icon + optional search) */}
    {/* Featured pastel card (24px+ padding, shadow) */}
    {/* Grid de cards ou contenu principal */}
  </div>
  <aside className="hidden lg:block">
    {/* Right sidebar contextuelle */}
  </aside>
</div>
```

### Header type

```tsx
<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight flex items-center gap-3">
  Mon Titre
  <Icon size={26} className="text-[#AF52DE]" strokeWidth={2.5} />
</h1>
<p className="text-sm text-gray-500 font-semibold mt-1">Sous-titre descriptif</p>
```

---

## 5. Composants signature

### 5.1 Featured Card pastel (hero)

Une grosse card colorée en haut de page avec :
- `bg-[pastel]` arrondi 3xl
- Decorative blobs blancs en blur (top-right, bottom-left)
- Icône circulaire blanche en haut à droite (52px)
- Eyebrow uppercase tracking-widest
- Titre extrabold 2xl-3xl
- CTA bouton blanc rounded-full + lien text à côté

### 5.2 Card avec icône débordante

LE pattern signature de l'app. Code :

```tsx
<div className="relative bg-white border-2 border-gray-100 rounded-3xl p-5 shadow-sm">
  {/* Icône qui dépasse en haut à droite */}
  <div className="absolute -top-3 right-5">
    <CategoryIconCircle catId="tenses" size={42} variant="tint" className="shadow-md border-2 border-white" />
  </div>

  <h3 className="text-xl font-extrabold leading-tight mb-1 pr-14">Titre</h3>
  <p className="text-xs text-gray-500 mb-3">Description</p>

  {/* Status badge + action buttons */}
  <div className="flex items-center justify-between gap-2">
    <StatusBadge />
    <div className="flex gap-1.5">
      <button className="w-8 h-8 rounded-full bg-gray-100 ...">⋯</button>
      <button className="w-8 h-8 rounded-full bg-[#0A0A0A] text-white ...">▶</button>
    </div>
  </div>
</div>
```

### 5.3 Status badge

```tsx
<span className="inline-flex items-center gap-1 bg-[#B5F0C9] text-[#1F7A3F] text-[11px] font-extrabold px-2.5 py-1 rounded-full">
  <Check size={11} strokeWidth={3} />
  Completed
</span>
```

### 5.4 Top bar (noir)

- Background `#0A0A0A`
- Logo : pastille gradient orange/jaune avec lettre "M" + "MELA"
- Nav center (md+) : pill `bg-white/5` avec items, item actif = pill blanc
- Profile right : pill `bg-white/10` avec avatar gradient + nom + streak + chevron

### 5.5 Bottom nav (mobile)

- Pill noire `bg-[#0A0A0A]` rounded-full
- 5 icônes circulaires colorées : actif = background couleur + icône blanche, inactif = bg pastel + icône colorée

### 5.6 Boutons

| Variant | Class |
|---------|-------|
| Primary noir | `bg-[#0A0A0A] text-white rounded-full px-5 py-2.5 font-extrabold` |
| Primary accent | `bg-gradient-to-r from-[accent] to-[accent]DD text-white rounded-3xl py-5 font-extrabold shadow-lg` |
| Secondary | `bg-gray-100 text-gray-700 rounded-full px-4 py-2 font-extrabold` |
| Ghost | `bg-white border-2 border-gray-200 text-gray-700 rounded-2xl px-6 py-3 font-extrabold` |
| Round action | `w-8 h-8 rounded-full bg-gray-100 flex-center` (icon only) |

---

## 6. Iconographie

**Règle** : pas d'emojis dans l'UI. Toujours Lucide.

### Helpers dispo

- `<CategoryIconCircle catId size variant />` — icône circulaire pour catégorie de grammaire (tint ou solid)
- `<CategoryIcon catId size />` — icône simple
- `<RoleplayCategoryIconCircle category size />` — pour les catégories roleplay
- `<CartoonAvatar seed size />` — avatar DiceBear (style fun-emoji)
- `<AvatarStack count size />` — stack d'avatars

### Conventions

- Icônes dans les boutons : `strokeWidth={2.5}` par défaut
- Icônes "filled" / accent : `fill={color}` (ex: étoiles, flammes)
- Taille standard : 14-18px dans les boutons, 22-26px dans les headers, 32-48px dans les featured cards

---

## 7. Animations

- **Framer Motion** pour les entrées de page et de cards (`initial / animate / transition`)
- Pattern standard : `initial={{ opacity: 0, y: 8-12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 * i }}`
- **canvas-confetti** sur les réussites (`particleCount: 80-100, spread: 70-80`)
- **Hover** : `hover:scale-105 active:scale-95` sur les boutons importants

---

## 8. Spacing & arrondis

- Frame extérieure : padding `px-[5px] pb-[5px]` (5px de noir autour)
- Panneau intérieur : rounded `[24px] sm:rounded-[28px]`
- Cards principales : `rounded-3xl` (24px)
- Cards mini : `rounded-2xl` (16px)
- Buttons round : `rounded-full`
- Gap entre cards : `gap-3` ou `gap-4` (mobile) / `gap-6` (desktop)

---

## 9. Responsive

- **Mobile-first** : ≤640px = 1 colonne, bottom nav visible, sidebar cachée
- **sm:** 640px+ = grid 2 colonnes pour cards
- **md:** 768px+ = top nav visible, bottom nav caché
- **lg:** 1024px+ = right sidebar visible, grid 3 col pour roleplay

---

## 10. Don'ts

❌ Pas d'emojis dans l'UI (sauf cas explicite type clic-réactions)
❌ Pas de fond gris/blanc plein sans rounded
❌ Pas de boutons rectangulaires : tout est pill ou rounded-2xl/3xl
❌ Pas de borders fines (`border` simple) : préférer `border-2`
❌ Pas de gradients sur du texte (ça pète mal à l'écran)
❌ Pas de shadows trop dures (`shadow-lg shadow-color/30` max)
❌ Pas de mélange de fonts : tout en Plus Jakarta Sans
❌ Pas de `tracking-tight` sur du body small (illisible)

---

## 11. Structure projet

```
src/
├── app/
│   ├── globals.css           # Tailwind + variables + animations
│   ├── layout.tsx            # Frame noire + panneau blanc inset
│   ├── page.tsx              # Home (Learning Plan)
│   ├── learn/[category]/     # Cours par catégorie
│   ├── practice/[category]/  # Exercices QCM
│   ├── plan/                 # Roadmap 12 semaines
│   ├── stats/                # Progrès
│   ├── roleplay/             # Scénarios IA
│   └── games/                # Placeholder Phase 2
├── components/
│   ├── top-bar.tsx
│   ├── bottom-nav.tsx
│   ├── category-icon.tsx     # CategoryIcon, CategoryIconCircle
│   ├── roleplay-icon.tsx     # RoleplayCategoryIcon, ...
│   ├── avatar.tsx            # CartoonAvatar (DiceBear), AvatarStack
│   ├── progress-bar.tsx
│   ├── scenario-modal.tsx    # Modal copy-prompt
│   └── streak-xp-badges.tsx
└── lib/
    ├── data/
    │   ├── categories.ts     # Catégories + exercices
    │   ├── lessons.ts        # Cours
    │   ├── weekly-plan.ts    # Plan 12 semaines
    │   └── roleplay.ts       # Scénarios + prompts
    ├── storage.ts            # localStorage helpers + scoring
    ├── types.ts              # TypeScript types
    └── use-user-data.ts      # Hook React
```
