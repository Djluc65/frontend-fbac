# frontend-fbac

## Déploiement frontend sur Vercel

Le frontend React/Vite peut être déployé sur Vercel.

### Variables d'environnement Vercel

- `VITE_API_URL=https://votre-backend.example.com/api`

### Réglages Vercel

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Le fichier `vercel.json` gère la réécriture SPA pour React Router.

## Déploiement backend

Le backend Express n'est pas prévu pour être déployé tel quel sur Vercel. Déployez-le sur un service Node.js classique comme Render, Railway, Fly.io ou un VPS.

Copiez `backend/.env.example` vers votre environnement de production et renseignez :

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `FRONTEND_URL` ou `FRONTEND_URLS`
- `COOKIE_SAME_SITE=none`

En production avec frontend Vercel + backend sur un autre domaine, les cookies d'auth utilisent `SameSite=None` et `Secure`.
