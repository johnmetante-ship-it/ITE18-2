# ITE18 WebApp 2

A fresh full-stack project scaffold with the same software stack as the original
ITE18 inventory project.

## Stack

### Frontend (`Frontend/`)
- Node.js 18.x / 20.x LTS (system Node 24 available)
- Vue.js 3.5.22
- Vite 7.1.11
- Pinia 2.3.1 (state management)
- Element Plus 2.9.1 (UI components)
- Axios 1.7.9 (HTTP client)

### Backend (`Backend/`)
- PHP 8.3.16
- Laravel 12.x
- Composer 2.x
- MySQL 8.4.3 / MariaDB 10.11+

## Getting started

### 1. Backend
```bash
cd Backend
php artisan migrate
php artisan serve
```
API runs at `http://localhost:8000`.

### 2. Frontend
```bash
cd Frontend
npm install
npm run dev
```
App runs at `http://localhost:5173` (proxies `/api` → `http://localhost:8000`).

## Database

`.env` is pre-configured for MySQL:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ite18_webapp2
DB_USERNAME=root
DB_PASSWORD=
```

Adjust `DB_USERNAME` / `DB_PASSWORD` to match your MySQL/MariaDB installation,
then create the database:

```sql
CREATE DATABASE ite18_webapp2;
```
