# 🛒 Node.js E-Commerce API (v1)

A full-featured backend for an e-commerce application built with **Node.js**, **Express**, and **MongoDB**.

---

## 🚀 Features

- 📟 Category & Sub-Category management
- 📦 Product management (in progress)
- 📷 Brand support with images and slugs
- 📤 Image upload (to be implemented)
- 🔐 Input validation with `express-validator`
- ✅ Error handling with `express-async-handler`
- 📂 RESTful API design
- 🌐 CORS and logger setup with `morgan`
- 🧹 Clean code using `ESLint` + `Prettier`

---

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/Mohamed-Hamdy-Tobal/Nodejs-Ecommerce-V1.git
cd Nodejs-Ecommerce-V1
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory and add:

```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

---

## 🔧 Available Scripts

| Command            | Description                           |
| ------------------ | ------------------------------------- |
| `npm run dev`      | Run app in development mode (nodemon) |
| `npm start`        | Run app in production mode            |
| `npm run lint`     | Run ESLint to check for issues        |
| `npm run lint:fix` | Auto-fix ESLint issues                |
| `npm run format`   | Format code with Prettier             |

---

## 📁 Project Structure

```
├── controllers/
├── models/
├── routes/
├── validation/
├── middlewares/
├── config/
├── docs/
├── server.js
```

---

## 📄 Documentation

- [📖 Setup Guide](./docs/setup.md)
- [📡 API Endpoints](./docs/endpoints.md)

---

## 🥪 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- dotenv
- express-validator
- slugify
- morgan
- eslint + prettier

---

## 📬 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---
