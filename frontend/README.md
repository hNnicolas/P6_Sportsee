# 🏋️‍♂️ SportSee – Dashboard Utilisateur avec Next.js & IA

## 📌 Objectif du projet

L’objectif est de **refaire la page profil utilisateur** avec **React (Next.js)** et d’implémenter une **authentification sécurisée**.  
Le projet inclut également un **dashboard interactif** permettant de visualiser les données sportives grâce à des graphiques et à une intégration avec une API d’IA.

---

## 🚀 Stack technique

### Frontend

- **Next.js** → Framework React avec routing intégré
- **Context API** → Gestion globale de l’état (authentification, données utilisateur)
- **Recharts** → Visualisation des statistiques sportives
- **CSS (desktop-first)** → Interface optimisée pour écrans ≥ 1024x768 px

### Backend

- **Node.js / Express** (fourni, déjà prêt)
- 3 utilisateurs disponibles (identifiants et mots de passe fournis dans le backend)
- API REST consommée via **Fetch** ou **Axios**
- Utilisation de **Postman** recommandée pour tester l’API avant intégration

### IA & Prompts

- Intégration prévue avec une API IA
- Standardisation des données issues de l’API avant usage
- Ajout de prompts IA pour enrichir l’expérience utilisateur

---

## 📂 Structure du projet

---

## 🖼️ Screenshots

### 🔑 Page de connexion

![Login](/public/images/screenshot_login.png)

### 👤 Profil utilisateur

![Profil](/public/images/screenshot_profil.png)

### 📊 Dashboard – Graphiques

![Dashboard 1](/public/images/screenshot_dashboard-1.png)
![Dashboard 2](/public/images/screenshot_dashboard-2.png)

### 📝 Génération de plan d’entraînement avec IA

![Plan d'entraînement](/public/images/screenshot-plan-entrainement.png)

---

## ⚙️ Installation & Lancement

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/ton-repo.git
cd ton-repo
cd backend
npm install
npm start
cd ../frontend
npm install
npm run dev
```
