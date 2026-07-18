# SustainSpace

## Sustainable Furniture Marketplace

SustainSpace is a web-based marketplace developed as a **Final Year Project** that promotes sustainability by enabling users to buy and sell pre-owned furniture and home décor items. The platform provides a secure environment where sellers can list used furniture, buyers can discover affordable products, and administrators can manage the overall system.

The primary goal of SustainSpace is to reduce furniture waste by encouraging the reuse of quality household items while ensuring secure transactions and transparent communication between buyers and sellers.

---

## Table of Contents

* Introduction
* Project Objectives
* Features
* Functional Requirements
* Technology Stack
* System Architecture
* User Roles
* Installation
* Environment Variables
* Project Structure
* Database
* Future Enhancements
* Contributors

---

# Introduction

Millions of furniture items are discarded every year despite remaining in usable condition. SustainSpace provides an eco-friendly solution by connecting buyers and sellers through a modern marketplace that promotes reuse, affordability, and environmental responsibility.

The platform offers secure authentication, listing management, messaging, delivery verification, reviews, and administrative moderation.

---

# Project Objectives

* Promote sustainable living through furniture reuse.
* Reduce furniture waste and environmental impact.
* Provide a secure online marketplace.
* Enable trusted buyer-seller interactions.
* Simplify furniture discovery using search and location filtering.
* Ensure transparency through ratings, reviews, and verified sellers.

---

# Features

### Buyer Features

* User registration and authentication
* Browse furniture listings
* Search products
* Filter listings by location
* View product details
* Check product availability
* Rate and review décor items
* Secure in-app messaging
* Delivery or pickup selection
* Delivery verification code
* Manage profile
* View transaction history
* Report inappropriate listings

---

### Seller Features

* Register as a seller
* Upload real-time furniture images
* Create product listings
* Edit listings
* Delete listings
* Update product availability
* Chat with buyers
* Manage profile
* View transaction history
* Receive a **Verified Seller** badge after:

  * Completing five secure transactions
  * Submitting identity proof
  * Receiving admin approval

---

### Admin Features

* Manage users
* Manage listings
* Review reported listings
* Monitor system activity
* Approve verified sellers
* Permanently deactivate fake or misleading accounts

---

# Functional Requirements

| ID   | Requirement                                                                                                                  |
| ---- | ---------------------------------------------------------------------------------------------------------------------------- |
| FR1  | Users can create buyer or seller accounts after authentication.                                                              |
| FR2  | Sellers upload a real-time furniture photo showing the actual condition.                                                     |
| FR3  | Sellers can create, edit, and delete product listings including photos, price, and descriptions.                             |
| FR4  | Buyers can browse, search, and filter furniture listings by location.                                                        |
| FR5  | Buyers can view item status (Available, Reserved, Sold).                                                                     |
| FR6  | Users can rate and review décor items.                                                                                       |
| FR7  | Delivery verification codes ensure secure transactions.                                                                      |
| FR8  | Users can edit profiles and view transaction history.                                                                        |
| FR9  | Buyers and sellers can choose delivery or pickup and securely share location details.                                        |
| FR10 | Users can report inappropriate listings.                                                                                     |
| FR11 | Admin manages users, listings, reports, and overall system activity.                                                         |
| FR12 | Admin can permanently deactivate accounts for fake identities or misleading products.                                        |
| FR13 | Built-in messaging system securely stores conversations between users.                                                       |
| FR14 | Sellers earn a **Verified Seller** badge after five successful secure transactions and admin-approved identity verification. |

---

# Technology Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Framer Motion

## Backend

* Supabase

### Supabase Services

* Authentication
* PostgreSQL Database
* Row Level Security (RLS)
* Storage for product images
* Real-time database features

---

# System Architecture

```
                +----------------------+
                |      React App       |
                |  (Vite + Tailwind)   |
                +----------+-----------+
                           |
                    React Router
                           |
                +----------v-----------+
                |      Supabase        |
                +----------------------+
                | Authentication       |
                | PostgreSQL Database  |
                | Storage              |
                | Realtime Services    |
                +----------+-----------+
                           |
          +----------------+----------------+
          |                                 |
      Buyers                         Sellers/Admin
```

---

# User Roles

## Buyer

* Register/Login
* Browse products
* Search furniture
* Filter by location
* View product details
* Contact sellers
* Purchase products
* Rate and review
* Manage profile
* Report listings

---

## Seller

* Register/Login
* Upload products
* Edit listings
* Delete listings
* Manage availability
* Chat with buyers
* Verify delivery
* View transaction history
* Become a Verified Seller

---

## Admin

* Manage users
* Manage listings
* Review reports
* Approve seller verification
* Remove fake accounts
* Monitor marketplace activity

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
```

## Navigate to Project

```bash
cd SustainSpace
```

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

---

# Environment Variables

Create a `.env` file in the project root.

```env
VITE_SUPABASE_URL=your_supabase_url

VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

# Project Structure

```
SustainSpace/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── routes/
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── package.json
├── vite.config.js
└── README.md
```

---

# Database

The project uses **Supabase PostgreSQL** as the backend database.

Typical tables include:

* Users
* Profiles
* Listings
* Categories
* Reviews
* Transactions
* Messages
* Reports
* Delivery Verification
* Seller Verification

---

# Future Enhancements

* AI-powered furniture recommendations
* Wishlist and favorites
* Online payment gateway integration
* Push notifications
* Mobile application
* Advanced analytics dashboard
* Chat attachments
* Multi-language support
* Dark mode
* Image recognition for furniture categorization

---

# Contributors

**Final Year Project**

Developed as part of an undergraduate software engineering project.

Contributors:

* Project Members
* Supervisor

---

# Acknowledgements

Special thanks to our project supervisor, faculty members, and everyone who provided valuable guidance and feedback throughout the development of SustainSpace.

We also acknowledge the open-source community and the technologies used in this project, including React.js, Vite, Tailwind CSS, React Router, Framer Motion, and Supabase.

---

**SustainSpace** is committed to encouraging sustainable living by giving pre-owned furniture a second life while providing users with a secure, transparent, and user-friendly marketplace.
