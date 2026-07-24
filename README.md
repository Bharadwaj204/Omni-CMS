# Decoupled Production-Ready CMS and Frontend Integration

This repository hosts a production-ready, decoupled Content Management System (CMS) integrated with a public-facing learning portal. The content shown on the public site is managed dynamically through a custom block-based admin dashboard.

---

## 🏛️ Architectural Overview

This project is built using a decoupled **headless architecture** consisting of:

1. **Backend Service (`/backend`)**: An Express.js REST API using MongoDB to store pages and content blocks. Secure password hashing (`bcryptjs`) and token authorization (`jsonwebtoken`) protect administrative endpoints.
2. **Admin Frontend CMS (`/admin-frontend`)**: A React (Vite) application utilizing Redux Toolkit to manage active auth sessions and pages state. It contains an interactive visual **Custom Block Editor** to create, reorder, update, and delete content blocks.
3. **Public Frontend Portal (`/public-frontend`)**: A lightweight React (Vite) application fetching data from the Express API, parsing content blocks dynamically using a dedicated `BlockRenderer` (typesetting equations with KaTeX, displaying responsive data tables, rendering code syntax references, and lists).

---

## 🧩 Block-Based Content Model

Content is managed using a structured **Content Block array** in the database rather than messy raw HTML. Each block has a uniform schema:

```json
{
  "type": "header | paragraph | list | table | equation | code",
  "order": 0,
  "data": {
    // Specific attributes matching the block type
  }
}
```

### Supported Blocks

* **Header**: Section titles.
* **Paragraph**: Text content with support for formatting. Features a custom regex parser to render inline LaTeX math equations enclosed in `$...$` (e.g., `$E = mc^2$`).
* **List**: Nested bullet structures.
* **Table**: Responsive tables with editable columns and rows.
* **Equation**: Center-aligned block math using KaTeX syntax.
* **Code**: Syntactically formatted blocks with clipboard copy actions.

---

## 🚀 How to Run the Project

### Option A: Run Containerized with Docker (Recommended)

Ensure Docker Engine and Docker Compose are running, then run the following in the root folder:

```bash
docker-compose up --build
```

This spins up four services:
* **MongoDB Database**: Listening on port `27017`
* **Express Backend API**: Exposed on `http://localhost:5000`
* **Admin Dashboard**: Exposed on `http://localhost:5173`
* **Public Portal**: Exposed on `http://localhost:5174`

---

### Option B: Run Locally

#### 1. Setup Database
Ensure MongoDB is running locally on port `27017` (or modify `MONGO_URI` in `.env`).

#### 2. Run Backend
```bash
cd backend
npm install
npm run dev
```
The server will run on `http://localhost:5000` and automatically seed sample pages and the default admin user if the database is empty.

#### 3. Run Admin Frontend
```bash
cd admin-frontend
npm install
npm run dev
```
The dashboard runs on `http://localhost:5173`.

#### 4. Run Public Frontend
```bash
cd public-frontend
npm install
npm run dev
```
The public viewer runs on `http://localhost:5174`.

---

## 🔑 Seeding & Default Credentials

The database seeder automatically initializes the following administrator credentials:

* **Username**: `admin`
* **Email**: `admin@cms.com`
* **Password**: `adminpassword123`

The seeder also generates sample articles (`/intro-quantum-mechanics` and `/linear-regression-analysis`) to showcase complex math, custom tables, code references, and list rendering out of the box.
