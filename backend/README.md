# 🏫 SmartSchool Backend - Architecture & Documentation

## 🚀 Overview
SmartSchool is a robust School Management System built with **NestJS**, **Prisma**, and **PostgreSQL**. It features a modern, multi-tenant architecture designed for performance and security.

## 🏗️ Architecture Layers
The project follows a clean, modular architecture:
- **Interface Layer**: Controllers, Guards, and Decorators for handling HTTP requests.
- **Application Layer**: Business logic services (Use Cases).
- **Domain Layer**: Core entities and business rules (Prisma models).
- **Infrastructure Layer**: Database (Prisma), Cache (Redis), Email, and SMS adapters.

## 📦 Key Technologies
- **NestJS 11** - Core Framework
- **Prisma 6** - ORM & Database Schema
- **PostgreSQL** - Relational DB
- **BullMQ / Redis** - Asynchronous queues (PDF generation, Emails, SMS)
- **Stripe / Mobile Money** - Financial Gateways
- **Jest / Supertest** - Testing Framework

## ⚙️ Prerequisites
- **Node.js**: >= 20.0.0
- **Docker**: For running PostgreSQL and Redis containers.

## 🚀 Getting Started
1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Setup Environment**:
   ```bash
   cp .env.example .env
   # Update variables in .env (DB_URL, JWT_SECRET, etc.)
   ```
3. **Database Migration**:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
4. **Run Dev Server**:
   ```bash
   npm run start:dev
   ```

## 🧪 Testing & Quality
- **Unit Tests**: `npm test`
- **Coverage**: `npm run test:cov` (Threshold: 40% lines)
- **Linting**: `npm run lint --fix`

## 🛠️ Maintenance & Performance
- **Dashboard Cache**: Redis TTL of 2 minutes on critical KPIs.
- **Audit Logs**: Sensitive actions (Login, Payments, Config) are tracked in `AuditLog` table.
- **Health Checks**: Visit `/health` for system status (DB & Redis connectivity).

---
**Developed by the Castole Team.**
