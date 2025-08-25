# MERN Distributor App

A MERN stack application to manage agents, upload CSV lists, and distribute items among agents.

---

## 🚀 Features
- Admin Login (JWT Authentication)
- Agent Creation & Management
- CSV/XLSX Upload
- Automated Task Distribution Among Agents
- Dashboard to view items assigned to agents

---

## 🛠️ Tech Stack
- **Frontend:** React, Axios, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Auth:** JWT

---

## 📂 Project Structure
mern-distributor-app/
├── server/ # Express backend
├── client/ # React frontend
├── README.md # Setup guide

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repo
```bash
git clone https://github.com/your-repo/mern-distributor-app.git
cd mern-distributor-app

## Backend Setup
cd server
npm install

## start Backend

npm start

## Frontend Setup

cd client
npm install
npm start

▶️ Usage

Register/Seed Admin (or use seeded credentials).

Login as admin.

Add agents.

Upload a CSV/XLSX file with fields: FirstName, Phone, Notes.

Items will be distributed equally among agents.

View items assigned to each agent in the dashboard.



