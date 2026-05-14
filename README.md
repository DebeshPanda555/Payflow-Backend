<div align="center">
  
# ⚙️ PayFlow - Backend API Service

**The robust, scalable, and secure microservice backend powering the PayFlow ecosystem.**

[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql)](https://postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## 🔧 Overview

The PayFlow Backend is a highly structured RESTful API built with **Node.js**, **Express**, and **TypeScript**. It acts as the central brain of the PayFlow application, handling everything from secure user authentication to complex AI-driven financial analysis using Google Gemini.

Data persistence is managed cleanly via the **Prisma ORM** interfacing with a **PostgreSQL** database, ensuring ACID-compliant transactions for financial safety.

### ✨ Core Features

- **ACID Transactions:** Ensures money transfers are atomic, consistent, isolated, and durable.
- **AI Integration:** Direct integration with Google Gemini 2.5 Flash for dynamic transaction parsing and personalized financial advice.
- **Real-Time WebSockets:** Pushes instant notifications for received payments using Socket.io.
- **Automated CRON Jobs:** Built-in scheduling for processing AutoPay transactions daily.
- **Secure Authentication:** JWT-based stateless authentication with Bcrypt password hashing.
- **Production Ready:** Pre-configured with Helmet for security headers, Morgan for robust logging, and Express Rate Limit to prevent abuse.

---

## 🏗️ Architecture & Folder Structure

The application follows a clean, MVC-inspired modular architecture:

- `src/controllers`: Handles HTTP requests and responses.
- `src/services`: Contains the core business logic and database interactions.
- `src/routes`: Defines API endpoints and maps them to controllers.
- `src/middleware`: Global and route-level middleware (Auth verification, Error handling, Rate limiting).
- `src/utils`: Helper functions, Prisma client instantiation, and logging.
- `prisma/`: Database schema definitions and migrations.

---

## 🚀 Local Development

To run the backend service locally, follow these steps:

### Prerequisites
Make sure you have Node.js installed and access to a PostgreSQL database (local or hosted via Neon/Supabase).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/payflow-backend.git
   cd payflow-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory:
   ```env
   # Ensure you use your specific database URL
   DATABASE_URL="postgresql://user:password@host:port/db"
   PORT=5001
   JWT_SECRET="your_very_secure_secret"
   GEMINI_API_KEY="your_google_gemini_api_key"
   FRONTEND_URL="http://localhost:3000"
   ```

4. Initialize the Database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5001`.

---

## 🌐 Deployment

This application is optimized for deployment on containerized or native Node.js hosting platforms like **Render.com** or **Railway**.

1. Connect your repository to Render.
2. Set the Build Command to `npm install && npm run build`.
3. Set the Start Command to `npm start`.
4. Provide the required Environment Variables in the Render dashboard.
5. Deploy!

<div align="center">
  <i>Part of the PayFlow Fintech Ecosystem</i>
</div>
