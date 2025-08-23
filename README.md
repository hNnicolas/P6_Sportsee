# ![SportSee Logo](frontend/public/images/logo.png) <br> Projet Dashboard Utilisateur avec React et Feature IA with Mistral API 

## 📖 Description

L’objectif de ce projet est de recréer la page **profil utilisateur** et d’implémenter une **authentification sécurisée** avec React et NextJS.  
Il inclut également :  

- Un **dashboard sportif** avec visualisation des données via Recharts.  
- Une **intégration IA (Mistral API)** pour générer des recommandations et plans d’entraînement personnalisés.  
- Une gestion de **workflow interactif (Step 1 → Step 4)** pour guider l’utilisateur dans la création de son plan d’entraînement.  

---

## 🛠️ Technologies utilisées

- **NextJS** : Framework React avec routing intégré et support SSR/CSR.  
- **React** : Construction de l’UI basée sur des composants.  
- **Context API** : Gestion d’état globale (authentification, utilisateur, sessions).  
- **NodeJS (Backend)** : Fournit l’API avec les données utilisateurs.  
- **Mistral API** : Génération de plans d’entraînement et prompts personnalisés.  
- **Fetch / Axios** : Requêtes HTTP vers le backend & l’API IA.  
- **Recharts** : Visualisation des statistiques sportives.  
- **TailwindCSS** : UI responsive desktop avec animations.  
- **Postman** : Tests des endpoints API.  

---

## 🚀 Fonctionnalités principales

- ✅ Authentification avec maintien de session (login/logout).  
- ✅ Dashboard interactif avec graphiques **Recharts**.  
- ✅ Page profil dynamique affichant les données personnelles.  
- ✅ Génération de **plans d’entraînement via IA (Mistral API)**.  
- ✅ Workflow guidé **(Step 1 → Step 4)** pour la création de programme.  
- ✅ UI desktop only (>1024x768 px) avec animations sur les boutons. 
---

## 👤 Accès Utilisateurs (backend mock)

Voici les utilisateurs disponibles pour tester l’authentification :  

- **username** : `sophiemartin` | **password** : `password123`  
- **username** : `emmaleroy` | **password** : `password789`  
- **username** : `marcdubois` | **password** : `password456`  

---

## Screenshots

### Page de connexion
![Login](frontend/public/images/screenshot/screenshot_login.png)

### Page profil utilisateur
![Profil](frontend/public/images/screenshot/screenshot_profil.png)

### Dashboard et graphiques
![Dashboard 1](frontend/public/images/screenshot/screenshot_dashboard-1.png)
![Dashboard 2](frontend/public/images/screenshot/screenshot_dashboard-2.png)

### Plan d’entraînement généré
![Plan d'entraînement](frontend/public/images/screenshot/screenshot_plan_entrainement.png)


---
## 📥 Cloner le projet

Clonez le dépôt depuis GitHub et placez-vous dans le dossier principal :

```bash
git clone https://github.com/hNnicolas/P6_Sportsee.git
cd P6_Sportsee

---
⚙️ Installation
🔧 Backend

Se placer dans le dossier backend :

cd backend
npm install
npm run build
npm start

*** Frontend ***

## Se placer dans le dossier frontend

cd frontend
npm install
npm run dev
