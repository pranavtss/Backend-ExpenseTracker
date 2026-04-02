# 📦 Expense Tracker Backend

This is the **backend API** for the Expense Tracker application.  
It is built using **Node.js, Express, and MongoDB (Mongoose)** and provides RESTful APIs for managing expenses.  

👉 Frontend Repo: [Expense Tracker Frontend](https://github.com/pranavtss/ExpenseTracker.git)  
🌐 Live App: [Expense Tracker App](https://expense-tracker-puce-beta-84.vercel.app/)

---

## 🚀 Features
- ➕ Add new expenses
- 📋 Fetch all expenses
- ❌ Delete expenses by ID
- 📡 REST API with Express
- ⚡ MongoDB + Mongoose for database
- 🔄 CORS enabled for frontend integration

---

## 🛠️ Tech Stack
- **Node.js**
- **Express**
- **MongoDB** (Cloud Atlas or Local)
- **Mongoose**
- **Nodemon** (for development)

---

## ⚙️ Setup & Installation
- **Clone repository:**
git clone https://github.com/pranavtss/Backend-ExpenseTracker.git

- **Move into project folder:**
cd Backend-ExpenseTracker

- **Install dependencies:**
npm install

- **start server:**
npm start

---

## 🚀 Render Deployment

Use these settings for the backend Render service:

- **Build command:** `npm install`
- **Start command:** `npm start`
- **Environment variables:**
	- `MONGODB_URI` for your MongoDB Atlas connection string
	- `CORS_ORIGIN` for the deployed frontend URL
	- `PORT` is provided automatically by Render

Copy `.env.example` to `.env` locally if you want to run the API outside Render.
