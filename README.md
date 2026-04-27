# Entreprises

A full-stack web application for managing French companies (entreprises) with INSEE/SIRENE API integration. Built with **Laravel 12** and **Vue 3** (Inertia.js), styled with **shadcn-vue** on Tailwind CSS.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [With Docker (recommended)](#with-docker-recommended)
  - [Without Docker (manual setup)](#without-docker-manual-setup)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [CI Pipeline](#ci-pipeline)
- [Deployment on a VPS](#deployment-on-a-vps)
- [Contributing](#contributing)

---

## Project Overview

**Entreprises** lets authenticated users:

- **Create** company records by entering a 14-digit SIRET number and auto-fetching data from the French INSEE API.
- **List** their companies in a responsive card grid with pagination.
- **Edit** company details at any time.
- **Delete** companies with a confirmation dialog.

Each user only sees and manages their own company records (row-level isolation).

---

## Tech Stack

| Layer      | Technology                                             |
|------------|--------------------------------------------------------|
| Backend    | PHP 8.3 · Laravel 12 · Inertia.js (server-side)       |
| Frontend   | Vue 3.5 · Inertia.js v2 · Vite 5 · Pinia              |
| UI         | shadcn-vue · Tailwind CSS v3 · lucide-vue-next         |
| Database   | MySQL 8 (dev) / SQLite (tests)                         |
| Cache/Queue| Redis 7                                               |
| Auth       | Laravel Breeze (session-based)                         |
| API        | INSEE / SIRENE v3 (SIRET lookup)                       |
| Testing    | Pest 3 (backend) · Vitest 2 + Vue Test Utils (frontend)|
| CI         | GitHub Actions                                         |
| Containers | Docker (PHP-FPM · Nginx · MySQL · Redis · Vite)        |

---

## Prerequisites

| Tool      | Minimum version |
|-----------|----------------|
| PHP       | 8.2            |
| Composer  | 2.x            |
| Node.js   | 20.x           |
| npm       | 10.x           |
| Docker    | 24.x (optional)|
| Docker Compose | v2      |

---

## Installation

### With Docker (recommended)

```bash
# 1. Clone the repository
git clone https://github.com/zdossantos/Entreprises.git
cd Entreprises

# 2. Copy and configure environment file
cp .env.example .env
# Edit .env and set DB_HOST=mysql, REDIS_HOST=redis, etc.

# 3. Start all services (PHP, Nginx, MySQL, Redis, Vite hot-reload)
docker compose up -d

# 4. Install PHP dependencies inside the container
docker compose exec php composer install

# 5. Generate application key
docker compose exec php php artisan key:generate

# 6. Run database migrations
docker compose exec php php artisan migrate

# 7. Open in browser
open http://localhost:8080
```

The Vite dev server with hot-reload runs on `http://localhost:5173`.

### Without Docker (manual setup)

```bash
# 1. Clone and enter directory
git clone https://github.com/zdossantos/Entreprises.git
cd Entreprises

# 2. Install PHP dependencies
composer install

# 3. Install Node dependencies
npm install --legacy-peer-deps

# 4. Configure environment
cp .env.example .env
php artisan key:generate
# Edit .env with your local DB credentials

# 5. Run migrations
php artisan migrate

# 6. Start dev servers (two terminals)
php artisan serve          # backend  → http://localhost:8000
npm run dev                # frontend → http://localhost:5173
```

---

## Environment Variables

| Variable               | Description                                      | Default              |
|------------------------|--------------------------------------------------|----------------------|
| `APP_NAME`             | Application name                                 | `Laravel`            |
| `APP_ENV`              | Environment (`local`, `production`)              | `local`              |
| `APP_KEY`              | Laravel encryption key (generated)               | –                    |
| `APP_DEBUG`            | Enable debug mode                                | `true`               |
| `APP_URL`              | Application URL                                  | `http://localhost`   |
| `DB_CONNECTION`        | Database driver (`mysql`, `sqlite`)              | `mysql`              |
| `DB_HOST`              | Database host                                    | `127.0.0.1`          |
| `DB_PORT`              | Database port                                    | `3306`               |
| `DB_DATABASE`          | Database name                                    | `laravel`            |
| `DB_USERNAME`          | Database user                                    | `root`               |
| `DB_PASSWORD`          | Database password                                | –                    |
| `DB_ROOT_PASSWORD`     | MySQL root password (Docker only)                | –                    |
| `CACHE_DRIVER`         | Cache backend (`file`, `redis`)                  | `file`               |
| `SESSION_DRIVER`       | Session backend (`file`, `redis`)                | `file`               |
| `QUEUE_CONNECTION`     | Queue driver (`sync`, `redis`)                   | `sync`               |
| `REDIS_HOST`           | Redis host                                       | `127.0.0.1`          |
| `REDIS_PORT`           | Redis port                                       | `6379`               |
| `INSEE_API_TOKEN`      | Bearer token for INSEE SIRENE API (server-side only) | –               |

> **Note:** The INSEE SIRENE API token must be obtained from [api.insee.fr](https://api.insee.fr/catalogue/). Without it, the auto-fill feature is disabled (you can still enter data manually).

---

## Running Tests

### Backend tests (Pest)

```bash
# Run all backend tests
php artisan test

# Run with verbose output
php artisan test --verbose

# Run a specific test file
php artisan test tests/Feature/EntrepriseTest.php
```

### Frontend tests (Vitest)

```bash
# Run once
npm run test

# Watch mode
npm run test:watch
```

### Build verification

```bash
npm run build
```

---

## Project Structure

```
Entreprises/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── EntrepriseController.php   # CRUD for companies
│   │   └── Middleware/
│   │       └── HandleInertiaRequests.php  # Inertia shared props
│   └── Models/
│       ├── Entreprise.php                 # Company model
│       └── User.php
├── database/
│   ├── factories/
│   │   └── EntrepriseFactory.php          # Test data factory
│   └── migrations/                        # DB schema migrations
├── docker/
│   ├── nginx/default.conf                 # Nginx vhost config
│   └── php/
│       ├── Dockerfile                     # PHP-FPM dev image
│       ├── entrypoint.sh                  # Prod container startup
│       └── opcache.ini                    # OPcache settings
├── resources/
│   ├── css/app.css                        # Tailwind + shadcn-vue CSS variables
│   └── js/
│       ├── app.js                         # Inertia app entrypoint
│       ├── Components/
│       │   ├── ui/                        # shadcn-vue primitives
│       │   │   ├── button/
│       │   │   ├── card/
│       │   │   ├── dialog/
│       │   │   ├── input/
│       │   │   ├── label/
│       │   │   └── badge/
│       │   └── ...                        # Breeze UI helpers
│       ├── Layouts/
│       │   └── AuthenticatedLayout.vue    # Main app shell
│       └── Pages/
│           ├── Auth/                      # Login, register, etc.
│           ├── Dashboard.vue
│           ├── Entreprise/
│           │   ├── Index.vue              # Company list (cards)
│           │   ├── Create.vue             # Add company form
│           │   └── Edit.vue              # Edit company form
│           └── Profile/
├── tests/
│   ├── Feature/
│   │   └── EntrepriseTest.php             # HTTP feature tests
│   ├── Unit/
│   │   └── EntrepriseModelTest.php        # Model unit tests
│   ├── js/
│   │   ├── Components/                    # Vitest component tests
│   │   └── utils.test.js                  # Utility function tests
│   └── Pest.php                           # Pest global config
├── .github/workflows/ci.yml               # GitHub Actions CI
├── docker-compose.yml                     # Dev environment
├── docker-compose.prod.yml                # Production environment
├── Dockerfile                             # Multi-stage prod image
├── vite.config.js                         # Vite + Vue config
├── vitest.config.js                       # Vitest config
└── components.json                        # shadcn-vue config
```

---

## CI Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs automatically on every **Pull Request** and **push to main**.

| Job          | What it checks                                    |
|--------------|---------------------------------------------------|
| **backend**  | Runs all Pest tests on PHP 8.2 and 8.3 (matrix)  |
| **frontend** | Runs Vitest tests + `npm run build`               |
| **lint**     | Runs `./vendor/bin/pint --test` (code style)      |

A PR cannot be merged if any job fails.

---

## Deployment on a VPS

### Prerequisites

- Docker & Docker Compose installed on the VPS
- A `.env` file configured for production (see [Environment Variables](#environment-variables))
- A domain name with DNS pointed to the VPS (for HTTPS)

### Steps

```bash
# 1. Clone the repository on the VPS
git clone https://github.com/zdossantos/Entreprises.git
cd Entreprises

# 2. Create production environment file
cp .env.example .env
# Set APP_ENV=production, APP_DEBUG=false, APP_URL=https://yourdomain.com
# Set DB_* and REDIS_* values
# Set INSEE_API_TOKEN (server-side, never use VITE_ prefix)

# 3. Build and start production containers
docker compose -f docker-compose.prod.yml up -d --build

# 4. The entrypoint script automatically:
#    - Caches config, routes, and views
#    - Runs migrations (php artisan migrate --force)
#    - Starts Nginx + PHP-FPM
```

### HTTPS

Use a reverse proxy (e.g. Nginx or Traefik) in front of the app container with Let's Encrypt certificates. The `docker-compose.prod.yml` exposes port 80; your reverse proxy should terminate TLS and forward to it.

---

## Contributing

### Commit convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix   | Use for                                    |
|----------|--------------------------------------------|
| `feat:`  | New feature                                |
| `fix:`   | Bug fix                                    |
| `chore:` | Tooling, dependencies, Docker, build       |
| `test:`  | Adding or updating tests                   |
| `ci:`    | CI configuration changes                   |
| `docs:`  | Documentation updates                      |
| `refactor:` | Code restructuring (no behaviour change)|
| `style:` | Formatting, linting (no logic change)      |

### Pull Request workflow

1. Fork the repository and create a feature branch: `git checkout -b feat/my-feature`
2. Make atomic commits, one concern per commit.
3. Ensure **all tests pass** locally before opening a PR:
   ```bash
   php artisan test && npm run test && npm run build
   ```
4. Open a Pull Request against `main`. The CI pipeline must pass before merging.
5. Request a review. Squash-merge only after approval.

### Code style

- **PHP**: enforced by [Laravel Pint](https://laravel.com/docs/pint) (`./vendor/bin/pint`)
- **Vue/JS**: use `<script setup>` composition API; no Options API
- **CSS**: Tailwind utility classes only; use `cn()` for conditional class merging
