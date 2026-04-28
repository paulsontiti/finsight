# 🚀 FinSight – Financial Intelligence & Fintech SaaS Platform

A **production-grade full-stack fintech platform** designed to help individuals and businesses manage finances, access credit insights, and perform seamless financial transactions — all in one system.

---

## 💡 Vision

FinSight is built to become a **scalable fintech infrastructure platform** that:

- Empowers users with financial insights  
- Enables alternative credit scoring  
- Supports everyday transactions  
- Provides APIs for other businesses (SaaS layer)  

---

## 🧠 Key Features

### 🔐 Authentication System (Production-Grade)
- User Registration & Login
- JWT Authentication + Refresh Tokens
- Role-Based Access Control (RBAC)
- API Key System (for SaaS clients)
- Email Verification (token-based)
- Password Reset Flow (secure + expiring tokens)

---

### 💰 (In Progress) Core Fintech Modules
- Wallet Infrastructure (balances, funding, transfers)
- Ledger System (double-entry accounting)
- Financial Tracking & Insights
- Savings Automation
- Credit Scoring Engine
- VTU Services (airtime, data, bill payments)
- Public API Platform (for businesses)

---

## 🏗️ Architecture

This project follows **Clean Architecture (OOP-based)**:


Controller → Use Case → Repository → Database


### Layers:
- **Domain** → Entities & business rules  
- **Application** → Use cases (business logic)  
- **Infrastructure** → Database, external services  
- **Interface** → Controllers (HTTP layer)  

---

## ⚙️ Tech Stack

### 🖥️ Frontend
- Next.js  
- TypeScript  
- TailwindCSS  

### 🧠 Backend
- Node.js  
- Express.js  
- TypeScript  
- MongoDB  
- Prisma ORM  

---

## 🧪 Testing Strategy

Built using **Test-Driven Development (TDD)**

- Unit Tests  
- Integration Tests  
- Auth flow coverage (Register → Login → Refresh → Verify → Reset)

### Tools:
- Vitest  
- Supertest  

---

## 🔐 Security Practices

- Password hashing (bcrypt)
- Token-based authentication (JWT)
- Refresh token rotation
- Secure cookie handling
- Input validation & sanitization
- Token expiry & invalidation
- No sensitive data exposure

---

## 📊 Engineering Highlights

- Clean Architecture implementation  
- Dependency Injection system  
- Centralized error handling  
- Logging & audit structure  
- Scalable database design  
- API-first system design  

---

## 📦 Project Structure


apps/
api/
src/
domain/
application/
infrastructure/
interfaces/
tests/

packages/
shared/


---

## 🚀 Getting Started

### 1. Clone repo

git clone https://github.com/your-username/finsight.git
cd finsight
2. Install dependencies
npm install
3. Setup environment
 .env.test .env
4. Run database
npx prisma migrate dev
5. Start development
npm run dev
6. Run tests
npm run test

📈 Roadmap
 Authentication System (Complete)
 Wallet System
 Ledger System
 Financial Analytics
 Credit Scoring Engine
 VTU Integrations
 Public API Platform
 Deployment (Production)
 
🎯 Project Goal

To build a real-world fintech system that is:

Scalable
Secure
Testable
Production-ready

🤝 Open to Opportunities

I’m open to:

Backend / Full-stack roles
Fintech startups
Freelance & contract work

📬 Contact
LinkedIn: www.linkedin.com/in/paulson-nwoha-0455aa34a
Email: paulsontiti@gmail.com

⭐ Final Note

This is not just a project —
it’s a full system designed with real-world engineering principles,
focused on scalability, security, and maintainability.

If you're hiring or building in fintech, feel free to reach out.
