# 🏢 Entreprises

> Application web full-stack pour gérer vos entreprises françaises grâce à l'API INSEE/SIRENE.
> Construite avec **Laravel 12**, **Vue 3** (Inertia.js) et **TypeScript**, stylisée avec **shadcn-vue** sur Tailwind CSS.

---

## 📋 Table des matières

- [🎯 Présentation](#-présentation)
- [🛠 Stack technique](#-stack-technique)
- [✅ Prérequis](#-prérequis)
- [🚀 Installation](#-installation)
  - [Avec Docker (recommandé)](#avec-docker-recommandé)
  - [Sans Docker (installation manuelle)](#sans-docker-installation-manuelle)
- [⚙️ Variables d'environnement](#️-variables-denvironnement)
- [🧪 Tests](#-tests)
- [📁 Structure du projet](#-structure-du-projet)
- [🔄 Pipeline CI](#-pipeline-ci)
- [🌐 Déploiement sur un VPS](#-déploiement-sur-un-vps)
- [🤝 Contribuer](#-contribuer)

---

## 🎯 Présentation

**Entreprises** permet aux utilisateurs authentifiés de :

- 🔍 **Créer** une fiche entreprise en saisissant un numéro SIRET à 14 chiffres — les données sont récupérées automatiquement depuis l'API INSEE/SIRENE.
- 📋 **Lister** leurs entreprises dans une grille de cartes responsive avec pagination.
- ✏️ **Modifier** les informations d'une entreprise à tout moment.
- 🗑️ **Supprimer** une entreprise avec confirmation avant action définitive.

Chaque utilisateur ne voit et ne gère que ses propres entreprises (isolation par ligne).

---

## 🛠 Stack technique

| Couche         | Technologie                                                        |
|----------------|--------------------------------------------------------------------|
| **Backend**    | PHP 8.3 · Laravel 12 · Inertia.js (côté serveur)                  |
| **Frontend**   | Vue 3.5 · TypeScript · Inertia.js v2 · Vite 5 · Pinia             |
| **UI**         | shadcn-vue · Tailwind CSS v3 · lucide-vue-next                     |
| **Base de données** | MySQL 8 (dev) / SQLite (tests)                                |
| **Cache/Queue** | Redis 7                                                           |
| **Auth**       | Laravel Breeze (sessions)                                          |
| **API externe** | INSEE / SIRENE v3 (recherche par SIRET)                           |
| **Tests**      | Pest 3 (backend) · Vitest 2 + Vue Test Utils (frontend)            |
| **CI**         | GitHub Actions                                                     |
| **Conteneurs** | Docker (PHP-FPM · Nginx · MySQL · Redis · Vite)                   |

---

## ✅ Prérequis

| Outil            | Version minimale |
|------------------|-----------------|
| PHP              | 8.2             |
| Composer         | 2.x             |
| Node.js          | 20.x            |
| npm              | 10.x            |
| Docker           | 24.x (optionnel)|
| Docker Compose   | v2              |

---

## 🚀 Installation

### Avec Docker (recommandé)

```bash
# 1. Cloner le dépôt
git clone https://github.com/zdossantos/Entreprises.git
cd Entreprises

# 2. Copier et configurer le fichier d'environnement
cp .env.example .env
# Éditer .env : DB_HOST=mysql, REDIS_HOST=redis, etc.

# 3. Démarrer tous les services (PHP, Nginx, MySQL, Redis, Vite hot-reload)
docker compose up -d

# 4. Installer les dépendances PHP dans le conteneur
docker compose exec php composer install

# 5. Générer la clé d'application
docker compose exec php php artisan key:generate

# 6. Exécuter les migrations
docker compose exec php php artisan migrate

# 7. Ouvrir dans le navigateur
open http://localhost:8080
```

> Le serveur Vite avec hot-reload tourne sur `http://localhost:5173`.

### Sans Docker (installation manuelle)

```bash
# 1. Cloner et entrer dans le dossier
git clone https://github.com/zdossantos/Entreprises.git
cd Entreprises

# 2. Installer les dépendances PHP
composer install

# 3. Installer les dépendances Node
npm install --legacy-peer-deps

# 4. Configurer l'environnement
cp .env.example .env
php artisan key:generate
# Éditer .env avec vos identifiants de base de données

# 5. Exécuter les migrations
php artisan migrate

# 6. Démarrer les serveurs de développement (deux terminaux)
php artisan serve          # backend  → http://localhost:8000
npm run dev                # frontend → http://localhost:5173
```

---

## ⚙️ Variables d'environnement

| Variable               | Description                                          | Défaut               |
|------------------------|------------------------------------------------------|----------------------|
| `APP_NAME`             | Nom de l'application                                 | `Laravel`            |
| `APP_ENV`              | Environnement (`local`, `production`)                | `local`              |
| `APP_KEY`              | Clé de chiffrement Laravel (générée)                 | –                    |
| `APP_DEBUG`            | Activer le mode débogage                             | `true`               |
| `APP_URL`              | URL de l'application                                 | `http://localhost`   |
| `DB_CONNECTION`        | Driver base de données (`mysql`, `sqlite`)           | `mysql`              |
| `DB_HOST`              | Hôte de la base de données                           | `127.0.0.1`          |
| `DB_PORT`              | Port de la base de données                           | `3306`               |
| `DB_DATABASE`          | Nom de la base de données                            | `laravel`            |
| `DB_USERNAME`          | Utilisateur de la base de données                    | `root`               |
| `DB_PASSWORD`          | Mot de passe de la base de données                   | –                    |
| `DB_ROOT_PASSWORD`     | Mot de passe root MySQL (Docker uniquement)          | –                    |
| `CACHE_DRIVER`         | Backend de cache (`file`, `redis`)                   | `file`               |
| `SESSION_DRIVER`       | Backend de session (`file`, `redis`)                 | `file`               |
| `QUEUE_CONNECTION`     | Driver de file d'attente (`sync`, `redis`)           | `sync`               |
| `REDIS_HOST`           | Hôte Redis                                           | `127.0.0.1`          |
| `REDIS_PORT`           | Port Redis                                           | `6379`               |
| `INSEE_API_TOKEN`      | Token Bearer pour l'API INSEE SIRENE (côté serveur uniquement) | –       |

> **⚠️ Important :** Le token de l'API INSEE SIRENE doit être obtenu sur [api.insee.fr](https://api.insee.fr/catalogue/). Sans lui, la récupération automatique des données est désactivée (la saisie manuelle reste possible).

---

## 🧪 Tests

### Tests backend (Pest)

```bash
# Lancer tous les tests backend
php artisan test

# Avec affichage détaillé
php artisan test --verbose

# Lancer un fichier de test spécifique
php artisan test tests/Feature/EntrepriseTest.php
```

### Tests frontend (Vitest)

```bash
# Exécution unique
npm run test

# Mode watch (surveillance continue)
npm run test:watch
```

### Vérification des types TypeScript

```bash
npm run type-check
```

### Vérification du build

```bash
npm run build
```

---

## 📁 Structure du projet

```
Entreprises/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── EntrepriseController.php   # CRUD des entreprises
│   │   └── Middleware/
│   │       └── HandleInertiaRequests.php  # Props partagées Inertia
│   └── Models/
│       ├── Entreprise.php                 # Modèle entreprise
│       └── User.php
├── database/
│   ├── factories/
│   │   └── EntrepriseFactory.php          # Factory pour les tests
│   └── migrations/                        # Migrations de la BDD
├── docker/
│   ├── nginx/default.conf                 # Config vhost Nginx
│   └── php/
│       ├── Dockerfile                     # Image PHP-FPM dev
│       ├── entrypoint.sh                  # Démarrage du conteneur prod
│       └── opcache.ini                    # Paramètres OPcache
├── resources/
│   ├── css/app.css                        # Tailwind + variables CSS shadcn-vue
│   └── js/
│       ├── app.ts                         # Point d'entrée Inertia
│       ├── bootstrap.ts                   # Configuration Axios
│       ├── lib/
│       │   ├── utils.ts                   # Utilitaire cn() pour les classes
│       │   └── entrepriseFormatters.ts    # Formatage des données INSEE
│       ├── Components/
│       │   ├── ui/                        # Composants primitifs shadcn-vue
│       │   │   ├── button/
│       │   │   ├── card/
│       │   │   ├── dialog/
│       │   │   ├── input/
│       │   │   ├── label/
│       │   │   └── badge/
│       │   └── ...                        # Composants UI Breeze
│       ├── Layouts/
│       │   └── AuthenticatedLayout.vue    # Shell principal de l'app
│       └── Pages/
│           ├── Auth/                      # Connexion, inscription, etc.
│           ├── Dashboard.vue
│           ├── Entreprise/
│           │   ├── Index.vue              # Liste des entreprises (cartes)
│           │   ├── Create.vue             # Formulaire d'ajout
│           │   └── Edit.vue              # Formulaire de modification
│           └── Profile/
├── tests/
│   ├── Feature/
│   │   └── EntrepriseTest.php             # Tests HTTP fonctionnels
│   ├── Unit/
│   │   └── EntrepriseModelTest.php        # Tests unitaires du modèle
│   ├── js/
│   │   ├── Components/                    # Tests Vitest des composants
│   │   └── utils.test.ts                  # Tests des fonctions utilitaires
│   └── Pest.php                           # Configuration globale Pest
├── .github/workflows/ci.yml               # CI GitHub Actions
├── docker-compose.yml                     # Environnement de développement
├── docker-compose.prod.yml                # Environnement de production
├── Dockerfile                             # Image de production multi-étapes
├── tsconfig.json                          # Configuration TypeScript
├── vite.config.ts                         # Configuration Vite + Vue
├── vitest.config.ts                       # Configuration Vitest
└── components.json                        # Configuration shadcn-vue
```

---

## 🔄 Pipeline CI

Le workflow GitHub Actions (`.github/workflows/ci.yml`) se déclenche automatiquement à chaque **Pull Request** et à chaque **push sur main**.

| Job          | Ce qu'il vérifie                                      |
|--------------|-------------------------------------------------------|
| **backend**  | Lance tous les tests Pest sur PHP 8.2 et 8.3 (matrice)|
| **frontend** | Lance les tests Vitest + `npm run build`              |
| **lint**     | Exécute `./vendor/bin/pint --test` (style de code)    |

> Une PR ne peut pas être fusionnée si l'un des jobs échoue.

---

## 🌐 Déploiement sur un VPS

### Prérequis

- Docker & Docker Compose installés sur le VPS
- Un fichier `.env` configuré pour la production (voir [Variables d'environnement](#️-variables-denvironnement))
- Un nom de domaine pointant vers le VPS (pour HTTPS)

### Étapes

```bash
# 1. Cloner le dépôt sur le VPS
git clone https://github.com/zdossantos/Entreprises.git
cd Entreprises

# 2. Créer le fichier d'environnement de production
cp .env.example .env
# Définir APP_ENV=production, APP_DEBUG=false, APP_URL=https://votredomaine.com
# Renseigner DB_* et REDIS_*
# Ajouter INSEE_API_TOKEN (côté serveur, ne jamais utiliser le préfixe VITE_)

# 3. Construire et démarrer les conteneurs de production
docker compose -f docker-compose.prod.yml up -d --build

# 4. Le script entrypoint s'occupe automatiquement de :
#    - Mettre en cache la config, les routes et les vues
#    - Exécuter les migrations (php artisan migrate --force)
#    - Démarrer Nginx + PHP-FPM
```

### HTTPS

Utilisez un reverse proxy (ex. Nginx ou Traefik) devant le conteneur avec des certificats Let's Encrypt. Le `docker-compose.prod.yml` expose le port 80 ; votre reverse proxy doit terminer TLS et transférer les requêtes vers ce port.

---

## 🤝 Contribuer

### Convention de commits

Ce projet suit [Conventional Commits](https://www.conventionalcommits.org/) :

| Préfixe      | Utilisation                                          |
|--------------|------------------------------------------------------|
| `feat:`      | Nouvelle fonctionnalité                              |
| `fix:`       | Correction de bug                                    |
| `chore:`     | Outillage, dépendances, Docker, build                |
| `test:`      | Ajout ou mise à jour de tests                        |
| `ci:`        | Modifications de la configuration CI                 |
| `docs:`      | Mises à jour de la documentation                     |
| `refactor:`  | Restructuration du code (sans changement de comportement) |
| `style:`     | Formatage, linting (sans changement de logique)      |

### Workflow Pull Request

1. Forker le dépôt et créer une branche : `git checkout -b feat/ma-fonctionnalite`
2. Faire des commits atomiques, un sujet par commit.
3. S'assurer que **tous les tests passent** en local avant d'ouvrir une PR :
   ```bash
   php artisan test && npm run test && npm run build
   ```
4. Ouvrir une Pull Request sur `main`. Le pipeline CI doit passer avant la fusion.
5. Demander une revue. Fusionner en squash uniquement après approbation.

### Style de code

- **PHP** : appliqué par [Laravel Pint](https://laravel.com/docs/pint) (`./vendor/bin/pint`)
- **Vue/TS** : utiliser `<script setup lang="ts">` avec l'API Composition ; pas d'Options API
- **CSS** : uniquement des classes utilitaires Tailwind ; utiliser `cn()` pour la fusion conditionnelle de classes

