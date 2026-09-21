# Portfolio — ANGO ABONDO Loïc Gaëtan

Portfolio one-page d'un Ingénieur en Génie Numérique, développeur FullStack
& mobile. Site sombre, éditorial, centré sur les projets et le parcours.

## Démarrer

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build de production dans dist/
npm run preview  # sert le build
```

Déploiement : le build produit un site statique. Sur Netlify comme sur
Vercel, la commande est `npm run build` et le dossier publié `dist`.

## Modifier le contenu

Tout le texte du site vit dans un seul fichier : **`src/data/content.ts`**.
Identité, projets, expériences, compétences, formation et coordonnées y
sont typés. Aucun contenu n'est écrit en dur dans les composants — éditer
ce fichier suffit à mettre le site à jour.

## Direction artistique

**Trois teintes, pas une de plus.** Fond `#0a0e14`, texte `#e6edf3`,
accent phosphore `#3df5a5`. Toutes les nuances intermédiaires sont
dérivées de ces trois valeurs par `color-mix` dans `src/styles/tokens.css`.

**Deux familles.** JetBrains Mono pour les titres, les commandes, les
chemins et les données ; IBM Plex Sans pour le texte courant. Les deux
sont auto-hébergées en `woff2` (`public/fonts/`), en variable et en
sous-ensemble latin : quatre fichiers, 128 Ko, aucune requête vers un CDN
tiers au chargement.

Les contrastes ont été mesurés sur le rendu : tout le texte tient au
minimum 4,65:1 sur son fond réel.

## Mouvement

| Où | Quoi | Outil |
| --- | --- | --- |
| Toute la page | Défilement fluide à inertie | Lenis, branché sur le ticker GSAP |
| Hero | Fond génératif : grille-circuit et impulsions | Three.js, shaders sur mesure |
| Hero | Révélation du nom par `clip-path`, frappe de l'accroche | Framer Motion |
| Projets | Scène épinglée, fiches révélées au `clip-path` | GSAP ScrollTrigger |
| Projets | Glitch phosphore et balayage au survol | CSS |
| Parcours | Tracé de la branche calé sur le scroll | GSAP ScrollTrigger (`scrub`) |
| À propos | Exécution d'une commande, sortie ligne à ligne | GSAP timeline |

Le fond Three.js est chargé en différé (`React.lazy`) : il ne retarde pas
l'affichage du texte.

### Mouvement réduit

`prefers-reduced-motion: reduce` est respecté partout. L'épinglage est
désactivé et les fiches projets s'empilent, l'accroche s'affiche d'un coup
plutôt que de se taper, le fond WebGL rend une image fixe et toutes les
révélations au scroll sont supprimées. Aucun contenu n'est perdu.

## Formulaire de contact

Sans back-end : le formulaire valide les champs, nomme le problème en cas
d'erreur, puis compose le courriel et le remet au client de messagerie.
Rien n'est envoyé en silence. Pour le brancher plus tard, remplacer le
`mailto` dans `src/components/Contact.tsx` par un appel à un service de
formulaires.

## Structure

```
src/
  data/content.ts     tout le contenu du site
  styles/             jetons, base, puis une feuille par zone
  lib/motion.ts       smooth scroll, révélations, parallaxe
  components/         une section par fichier
public/fonts/         les deux familles, auto-hébergées
```
