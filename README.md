# Omni-CMS: Production-Ready Decoupled Headless CMS & Learning Portal

[![Live Production](https://img.shields.io/badge/Production-Live-success?style=for-the-badge)](https://omni-cms-public.onrender.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Bharadwaj204%2FOmni--CMS-blue?style=for-the-badge&logo=github)](https://github.com/Bharadwaj204/Omni-CMS)

**Omni-CMS** is a decoupled, headless Content Management System (CMS) integrated with a dynamic public viewer portal. Designed to replace static hardcoded elements with database-driven JSON content blocks, it enables authenticated administrators to build complex, rich technical articles containing **LaTeX mathematical notation**, **interactive data tables**, **bullet lists**, **code snippets**, and **AI-synthesized pages**.

---

## 🌐 Live Production Links & Evaluation Credentials

| Service | Live Deployment URL |
| :--- | :--- |
| **Public Viewer Portal** | [https://omni-cms-public.onrender.com](https://omni-cms-public.onrender.com) |
| **Admin Dashboard (CMS)** | [https://omni-cms-admin.onrender.com](https://omni-cms-admin.onrender.com) |
| **Backend REST API** | [https://omni-cms-backend.onrender.com/api/v1/content/pages](https://omni-cms-backend.onrender.com/api/v1/content/pages) |
| **GitHub Repository** | [https://github.com/Bharadwaj204/Omni-CMS](https://github.com/Bharadwaj204/Omni-CMS) |

### 🔑 Default Administrator Credentials
The database seeder automatically initializes admin credentials upon first startup:
* **Email**: `admin@cms.com` (or Username: `admin`)
* **Password**: `adminpassword123`
* **Admin Login URL**: [https://omni-cms-admin.onrender.com/login](https://omni-cms-admin.onrender.com/login)

---

## 🏛️ Architectural Overview

The application adopts a decoupled **Headless Architecture** structured into three primary packages:

```text
Omni-CMS/
├── backend/            # Express.js REST API & Mongoose MongoDB Schemas
├── admin-frontend/     # React (Vite) Admin CMS Panel + Redux Toolkit + Block Builder
└── public-frontend/    # React (Vite) Public Viewer Portal + KaTeX LaTeX Renderer
```

1. **Backend API (`/backend`)**: Built with Node.js, Express, and MongoDB (via Mongoose). Protects administrative endpoints using `jsonwebtoken` (JWT) and secure `bcryptjs` password hashing.
2. **Admin Dashboard (`/admin-frontend`)**: React + Tailwind CSS dashboard powered by Redux Toolkit for global authentication and page state. Features a visual block editor to add, reorder, update, preview, and publish dynamic pages, as well as an **AI Page Generator Assistant**.
3. **Public Viewer Portal (`/public-frontend`)**: A lightweight React viewer that consumes content from the backend API and parses structured block arrays using a dedicated `BlockRenderer` component.

---

## 🧩 Block-Based Content Model

Content is stored as a structured array of JSON blocks in MongoDB rather than unmaintainable raw HTML:

```json
{
  "title": "Quantum Mechanics & Wave Equations",
  "slug": "quantum-mechanics-wave-equations",
  "description": "Comprehensive analysis of quantum states...",
  "blocks": [
    {
      "type": "header | paragraph | list | table | equation | code",
      "order": 0,
      "data": { ... }
    }
  ]
}
```

### Supported Block Types:
* **Header**: Section titles.
* **Paragraph**: Body text with a regex parser rendering inline LaTeX math wrapped in `$...$` (e.g. `$i\hbar \frac{\partial}{\partial t}\Psi = \hat{H}\Psi$`).
* **Equation**: Dedicated block math rendered via KaTeX (`react-katex`).
* **Table**: Responsive HTML tables with editable columns and rows.
* **List**: Bulleted list items.
* **Code**: Syntactically formatted code references with language tags and clipboard copy functionality.

---

## 🤖 AI Page Generator Assistant

The Admin Panel features an **AI Content Generator** accessible directly inside the Page Builder (`/create-page`):
- **API Endpoint**: `POST /api/v1/content/ai-generate` (protected by JWT middleware).
- **Functionality**: Accepts any prompt topic (e.g. *Neural Networks & Gradient Descent*, *Special Relativity*, *Data Structures*) and synthesizes a complete, ready-to-publish page schema containing titles, URL slugs, summaries, equations, data tables, and code snippets.

---

## ⚙️ Environment Variables Template (`.env.example`)

```env
# Backend Configuration
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cms_db
JWT_SECRET=super_secret_jwt_key_change_me_in_production
JWT_EXPIRES_IN=7d

# Default Admin User Seeding Configuration
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@cms.com
ADMIN_PASSWORD=adminpassword123

# Admin Frontend Configuration
VITE_API_URL=http://localhost:5000/api/v1

# Public Frontend Configuration
VITE_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 🚀 Running the Project

### Option A: Run via Docker Compose (Recommended)
```bash
docker-compose up --build
```
This spins up 4 containerized services:
* **MongoDB**: `localhost:27017`
* **Express API**: `http://localhost:5000`
* **Admin Dashboard**: `http://localhost:5173`
* **Public Viewer**: `http://localhost:5174`

### Option B: Run Locally
1. **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
2. **Admin Frontend**:
   ```bash
   cd admin-frontend
   npm install
   npm run dev
   ```
3. **Public Frontend**:
   ```bash
   cd public-frontend
   npm install
   npm run dev
   ```

---

## 🌐 Cloud Deployment (Render + MongoDB Atlas)

### 1. Backend Service (`omni-cms-backend`)
- **Environment**: Node
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node src/server.js`
- **Environment Variables**:
  - `MONGO_URI`: `mongodb+srv://user:pass@cluster.mongodb.net/cms_db?retryWrites=true&w=majority`
  - `JWT_SECRET`: `super_secret_jwt_key_omni_cms_2026`

### 2. Admin Frontend (`omni-cms-admin`) & Public Frontend (`omni-cms-public`)
- **Environment**: Static Site
- **Root Directory**: `admin-frontend` (or `public-frontend`)
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL` / `VITE_PUBLIC_API_URL`: `https://omni-cms-backend.onrender.com/api/v1`

### 3. Single Page Application (SPA) Rewrite Rules on Render
To prevent 404 errors on browser page reloads:
1. Open the Static Site on Render Dashboard → Click **Redirects/Rewrites**.
2. Add Rule:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
3. Click **Save Changes**.
