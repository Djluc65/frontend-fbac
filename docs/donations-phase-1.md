# Module Faire un don - Phase 1

## Objectif

Mettre en place la base fonctionnelle du module de dons avant l'integration des paiements reels, des recus PDF et des emails transactionnels.

## Architecture backend

- `backend/src/models/Donation.model.ts`
  - Modele principal du don
- `backend/src/models/DonationTransaction.model.ts`
  - Trace des transactions providers
- `backend/src/models/BankTransfer.model.ts`
  - Suivi des references et preuves de paiement manuel
- `backend/src/modules/donations/donation.validation.ts`
  - Validations Zod
- `backend/src/modules/donations/donation.repository.ts`
  - Acces aux donnees MongoDB
- `backend/src/modules/donations/donation.service.ts`
  - Regles metier du module
- `backend/src/modules/donations/donation.controller.ts`
  - Adaptation HTTP / JSON
- `backend/src/routes/donation.routes.ts`
  - CRUD donations
- `backend/src/routes/user.routes.ts`
  - `GET /api/users/me/donations`

## Architecture frontend

- `src/pages/Donate.tsx`
  - Page principale du module
- `src/components/donations/DonationWizard.tsx`
  - Wizard multi-etapes
- `src/components/donations/DonationSummary.tsx`
  - Resume dynamique du don
- `src/features/donations/donationTypes.ts`
  - Types frontend
- `src/features/donations/donationApi.ts`
  - RTK Query

## Routes API Phase 1

- `POST /api/donations`
- `GET /api/donations`
- `GET /api/donations/:id`
- `PATCH /api/donations/:id`
- `DELETE /api/donations/:id`
- `GET /api/users/me/donations`

## Perimetre couvert

- Choix du type de don
- Selection d'une campagne avec resume dynamique
- Choix du montant
- Choix de la frequence
- Informations donateur avec pre-remplissage si l'utilisateur est connecte
- Selection du moyen de paiement
- Creation du don en base avec statuts initiaux
- Preparation des paiements manuels via reference et preuve URL

## Ce qui reste pour la Phase 2

- Integration PayPal Checkout
- Capture et verification cote backend
- Upload public des preuves de paiement
- Generation des recus PDF
- Emails automatiques
- Dashboard utilisateur Mes dons
- Dashboard admin analytics des dons
