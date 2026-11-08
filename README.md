# ARENA ESPORT V2 — Plateforme E-Sport Mondiale & Passerelle Hybride

> **Architecture E-Sport AAA pour Tournois Free Fire à Grande Échelle (100 Squads, 10 Rooms Live)**  
> **Design Liquid Glass iOS 27 · Paiements Mondiaux Visa/MasterCard & Mobile Money Panafricain (Nexus Africa)**  
> **Dépôt GitHub :** `alankaredis2006-rgb/ARENA-E-SPORT-V2`

---

## 1. Fonctionnalités Clés & Spécifications

* **Expérience Utilisateur Ultra-Moderne (Style Liquid Glass & iOS) :**
  * Composants avec effet verre dépoli (`backdrop-filter: blur(28px)`), reflets spéculaires et bordures fines lumineuses.
  * Logo officiel **ARENA ESPORT** intégré en squircle avec effet d'aurore boréale cyan/violet.
  * Thème sombre OLED épuré et contrasté, animations fluides, boutons ergonomiques et lisibilité typographique optimale.

* **Moteur de Tournois E-Sport (Massive Scale) :**
  * **Rooms 01 à 10 :** Gestion en direct des phases éliminatoires, barrages et Grande Finale (Maps officielles : Bermuda, Purgatory, Kalahari, Alpine, NexTerra).
  * **Accès Sécurisé Free Fire :** Déverrouillage des identifiants secrets (Room ID & Mot de passe) réservé aux capitaines et joueurs inscrits, avec copie en 1 clic.
  * **Progressions Tracker 100 Squads :** Suivi en temps réel des 100 escouades réparties en Poules A, B, C, D (Kills, points de placement, statut qualifiée/éliminée, recherche avancée, consultation du roster des 4 joueurs titulaires).
  * **Console Arbitre & Contrôle :** Permet aux organisateurs de changer les statuts des rooms en temps réel, de régénérer les clés Free Fire, d'injecter des scores et de diffuser des alertes flash d'arbitrage.

* **Passerelle de Paiement Universelle & Hybride (Global + Afrique) :**
  * **Paiements Internationaux :** Cartes bancaires mondiales (Visa, MasterCard) avec vérification 3D-Secure 2.0.
  * **Paiements Panafricains Mobile Money via Nexus Africa :** Couverture de 10 pays d'Afrique Centrale et de l'Ouest (Gabon, Côte d'Ivoire, Cameroun, Sénégal, RD Congo, Congo-Brazzaville, Bénin, Togo, etc.) avec Airtel Money, Moov Money, Orange Money et MTN MoMo.
  * **Notification Push USSD Interactive :** Simulation en direct de la validation par code PIN sur le téléphone du compétiteur.
  * **Multi-Devises en Temps Réel :** Affichage et conversion dynamique en FCFA (XAF/XOF), EUR (€), USD ($) et GBP (£).

---

## 2. Variables d'Environnement

Configurez votre fichier `.env` à la racine :

```env
# NEXUS AFRICA — Agrégateur Panafricain Mobile Money & Cartes
NEXUS_API_KEY="nexus_live_api_key_sample"
NEXUS_MERCHANT_KEY="nexus_merch_arena_v2"
NEXUS_SECRET_KEY="nexus_sec_key_arena_v2"
NEXUS_WEBHOOK_SECRET="whsec_arena_esport_2026_signature"

# SUPABASE POSTGRESQL & EDGE FUNCTIONS
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 3. Déploiement & Synchronisation GitHub

Pour synchroniser ce projet avec le dépôt GitHub `alankaredis2006-rgb/ARENA-E-SPORT-V2` :

```bash
git remote add origin https://github.com/alankaredis2006-rgb/ARENA-E-SPORT-V2.git
git branch -M main
git push -u origin main
```

Pour déployer la base de données Supabase :
1. Rendez-vous sur votre dashboard Supabase.
2. Ouvrez le **SQL Editor**.
3. Copiez et exécutez le script contenu dans `supabase/schema.sql`.

Pour déployer la fonction Webhook Nexus Africa :
```bash
supabase functions deploy nexus-webhook --no-verify-jwt
```
