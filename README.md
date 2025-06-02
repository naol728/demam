# 🛒 Demam – Seller & Buyer E-Commerce Platform

Demam is a full-stack e-commerce web application designed to connect sellers and buyers with real-time delivery tracking and modern UI/UX. Built in just **2 weeks** by [Naol Meseret], this platform offers a scalable, secure, and user-friendly experience from cart to delivery.

---

## 🚀 Features

- 🧑‍💼 **Seller & Buyer Account Management**  
- 🛍️ **Product Catalog & Inventory Control**  
- 🔐 **Secure Authentication (Supabase Auth)**  
- 📦 **Order Management System**  
- 🗺️ **Live Delivery Tracking with Mapbox**  
- 💻 **Fully Responsive Design (Mobile-First)**  

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, Redux Toolkit, ShadCN UI, Tailwind CSS |
| **Backend / Database** | Supabase (PostgreSQL, Auth, Storage) |
| **Data Fetching** | TanStack Query (React Query) |
| **Maps & Tracking** | Mapbox GL JS |
| **Deployment** | Vercel |

---

## 📸 Screenshots

> [![Watch the demo]([https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg](https://youtu.be/Oe27ZnU_75U))]([https://youtu.be/YOUR_VIDEO_ID](https://youtu.be/Oe27ZnU_75U))

---

## ⚙️ Installation

```bash
# 1. Clone the repository
git clone https://github.com/naol728/demam.git
cd demam

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your Supabase and Mapbox keys in the .env file

# 4. Start the development server
npm run dev
