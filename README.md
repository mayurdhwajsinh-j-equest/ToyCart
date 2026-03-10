<div align="center">
  
# 🧸 ToyCart

### A Full-Stack E-Commerce Platform for Toys & Kids' Products

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Issues](https://img.shields.io/github/issues/mayurdhwajsinh-j-equest/ToyCart?style=flat-square&color=red)](https://github.com/mayurdhwajsinh-j-equest/ToyCart/issues)
[![Stars](https://img.shields.io/github/stars/mayurdhwajsinh-j-equest/ToyCart?style=flat-square&color=yellow)](https://github.com/mayurdhwajsinh-j-equest/ToyCart/stargazers)
[![Forks](https://img.shields.io/github/forks/mayurdhwajsinh-j-equest/ToyCart?style=flat-square&color=blue)](https://github.com/mayurdhwajsinh-j-equest/ToyCart/network/members)

<br/>

> **ToyCart** is a modern, full-stack e-commerce web application built for buying and selling toys. It features a clean React-powered storefront, a robust Node.js/Express backend API, and a relational MySQL database — delivering a seamless shopping experience from product discovery to checkout.

</div>

---

## ✨ Features

### 🛍️ Shopping Experience
- **Product Catalog** — Browse a rich collection of toys with images, descriptions, and pricing
- **Product Search & Filter** — Quickly find toys by name, category, age group, or price range
- **Shopping Cart** — Add, remove, and update product quantities with real-time cart totals
- **Persistent Cart** — Cart state is preserved across sessions for returning users

### 👤 User Management
- **User Registration & Login** — Secure authentication with hashed passwords
- **User Profiles** — Manage personal information and view order history
- **Session Management** — Secure, token-based session handling

### 🧾 Orders & Checkout
- **Order Placement** — Smooth multi-step checkout flow
- **Order History** — Track past purchases and order statuses
- **Order Management** — Backend logic for order creation, updates, and status tracking

### 🔧 Admin Panel
- **Product Management** — Add, edit, and delete products from the catalog
- **Order Dashboard** — View and manage all customer orders
- **User Management** — Monitor and manage registered users

### 🏗️ Architecture Highlights
- **RESTful API** — Clean, structured API endpoints for all operations
- **Relational Data Model** — Well-architected MySQL schema with relational integrity
- **Scalable Cart System** — Robust cart logic documented in [`CART_SYSTEM.md`](CART_SYSTEM.md)
- **Data Architecture** — Comprehensive data modeling documented in [`DATA_ARCHITECTURE.md`](DATA_ARCHITECTURE.md)

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React.js | UI components, routing, state management |
| **Styling** | CSS3 | Custom styling and responsive layouts |
| **Backend** | Node.js + Express.js | REST API, business logic, middleware |
| **Database** | MySQL | Relational data storage |
| **Package Manager** | npm | Dependency management |

---

## 📁 Project Structure

```
ToyCart/
├── frontend/               # React.js client application
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page-level components
│       ├── context/        # React Context for state management
│       ├── services/       # API service calls
│       └── App.js
│
├── backend/                # Node.js + Express server
│   ├── controllers/        # Route handler logic
│   ├── routes/             # API route definitions
│   ├── models/             # Database models / queries
│   ├── middleware/         # Auth & validation middleware
│   └── server.js
│
├── CART_SYSTEM.md          # Cart system documentation
├── DATA_ARCHITECTURE.md    # Database architecture documentation
├── .gitignore
└── package-lock.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) `v16+`
- [npm](https://www.npmjs.com/) `v8+`
- [MySQL](https://www.mysql.com/) `v8+`

### 1. Clone the Repository

```bash
git clone https://github.com/mayurdhwajsinh-j-equest/ToyCart.git
cd ToyCart
```

### 2. Set Up the Database

```sql
-- In your MySQL client:
CREATE DATABASE toycart;
```

Then import the schema (if a `.sql` file is provided):

```bash
mysql -u root -p toycart < backend/database/schema.sql
```

### 3. Configure the Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=toycart
JWT_SECRET=your_jwt_secret_key
```

Install dependencies and start the server:

```bash
npm install
npm start
```

> The backend will run on `http://localhost:5000`

### 4. Configure the Frontend

```bash
cd ../frontend
cp .env.example .env
```

Edit `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Install dependencies and start the app:

```bash
npm install
npm start
```

> The frontend will run on `http://localhost:3000`

---

## 🔌 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive token |
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products/:id` | Get single product |
| `POST` | `/api/cart` | Add item to cart |
| `GET` | `/api/cart/:userId` | Get user's cart |
| `PUT` | `/api/cart/:itemId` | Update cart item quantity |
| `DELETE` | `/api/cart/:itemId` | Remove item from cart |
| `POST` | `/api/orders` | Place an order |
| `GET` | `/api/orders/:userId` | Get user's orders |

> For full API documentation, refer to [`CART_SYSTEM.md`](CART_SYSTEM.md) and [`DATA_ARCHITECTURE.md`](DATA_ARCHITECTURE.md).

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

### How to Contribute

1. **Fork** the repository
   ```bash
   # Click the 'Fork' button at the top of this page
   ```

2. **Clone** your fork
   ```bash
   git clone https://github.com/YOUR_USERNAME/ToyCart.git
   cd ToyCart
   ```

3. **Create a branch** for your feature or fix
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Make your changes** and commit them
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push** to your branch
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** against the `main` branch

### Contribution Guidelines

- Follow the existing code style and naming conventions
- Write clear, descriptive commit messages (e.g., `feat:`, `fix:`, `docs:`, `refactor:`)
- Test your changes before submitting a PR
- Keep PRs focused — one feature or fix per PR
- Update documentation if you change functionality

### Reporting Bugs

Found a bug? Please [open an issue](https://github.com/mayurdhwajsinh-j-equest/ToyCart/issues/new) and include:
- A clear description of the problem
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots (if applicable)

### Suggesting Features

Have an idea? [Open a feature request](https://github.com/mayurdhwajsinh-j-equest/ToyCart/issues/new) with the label `enhancement`.

---

## 📄 Documentation

| Document | Description |
|----------|-------------|
| [`CART_SYSTEM.md`](CART_SYSTEM.md) | Detailed documentation on cart logic and session handling |
| [`DATA_ARCHITECTURE.md`](DATA_ARCHITECTURE.md) | Database schema, entity relationships, and data flow |

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by [mayurdhwajsinh-j-equest](https://github.com/mayurdhwajsinh-j-equest)

⭐ If you found this project helpful, please consider giving it a **star**!

</div>
