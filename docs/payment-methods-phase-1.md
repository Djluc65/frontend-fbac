# Etape mode de paiement - Phase 1

## Perimetre

Cette phase pose uniquement la couche frontend de l'etape "Choisir un mode de paiement" :

- composants React dedies
- responsive
- types TypeScript
- validation Zod
- store Redux
- hooks RTK Query

Les integrations reelles PayPal, Stripe ou autres fournisseurs restent hors perimetre.

## Fichiers ajoutes

- `src/features/payments/paymentTypes.ts`
- `src/features/payments/paymentValidation.ts`
- `src/features/payments/paymentSlice.ts`
- `src/features/payments/paymentSelectors.ts`
- `src/features/payments/paymentApi.ts`
- `src/components/donations/PaymentMethodCard.tsx`
- `src/components/donations/PaymentMethodSelector.tsx`
- `src/components/donations/PaymentInstructions.tsx`
- `src/components/donations/UploadProof.tsx`

## Fichiers mis a jour

- `src/components/donations/DonationWizard.tsx`
- `src/components/donations/DonationSummary.tsx`
- `src/app/store.ts`
- `src/services/baseApi.ts`

## Comportement actuel

- l'etape paiement est maintenant l'etape 4 du wizard
- le bouton continuer reste desactive tant qu'aucun mode de paiement n'est selectionne
- les moyens disponibles s'affichent en cartes responsives
- carte bancaire reste visible mais desactivee
- les instructions changent selon le moyen choisi
- l'upload de preuve est gere en phase 1 par un hook RTK Query local, sans stockage serveur reel

## Suite logique pour la Phase 2

- exposer `GET /api/payment-methods`
- persister l'activation/desactivation des moyens de paiement
- brancher l'upload de preuve sur le backend
- integrer PayPal
- ajouter la page admin "Gestion des paiements"
