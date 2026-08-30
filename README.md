<div align="center">

# 🕵️‍♂️ Saraha - Anonymous Messages

### Receive Honest Feedback. Securely & Anonymously.

A full-stack, production-ready anonymous messaging platform that allows users to collect secret messages, honest feedback, and constructive criticism from friends, followers, and colleagues—all while preserving total privacy and a premium aesthetic.

<br>

![Node.js](https://img.shields.io/badge/NODE.JS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/EXPRESS-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MONGODB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JAVASCRIPT-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

<br>

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://saraha-anonymous-messages-platform.vercel.app/)

![Status](https://img.shields.io/badge/Status-Completed-2ea44f?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

</div>

---

## 🌐 Live Deployment

Experience the production-ready application without installing anything locally:

### **[https://saraha-anonymous-messages-platform.vercel.app/](https://saraha-anonymous-messages-platform.vercel.app/)**

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Integration](#-api-integration)
- [Design System](#-design-system)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔭 Overview

**Saraha** provides a seamless, secure environment for anonymous communication. Users generate a custom profile link, share it with their audience, and receive encrypted, anonymous messages in a beautifully designed, private inbox. Built on a robust Node.js/Express backend and a lightweight Vanilla JS frontend, it prioritizes security, speed, and visual excellence.

---

## ✨ Features

- 🔐 **Secure Authentication:** JWT Bearer Tokens, Bcrypt password hashing, and Joi validation.
- 🎭 **Anonymous Messaging:** Send and receive messages without revealing sender identity.
- 🧊 **Message Management:** Freeze, pin, and delete message cards.
- 📤 **Social Sharing:** Generate stylized quote cards for social media.
- 🔍 **Regex Username Check:** Real-time username availability checks.
- 🖼️ **Profile Customization:** Upload avatars (Multer) and update profile details.
- 🛡️ **Educational Module:** Interactive "What is a Token?" inspector page.
- 🌗 **Theming:** Professional Night (Dark) and Morning (Light) modes with persistence.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend Runtime** | Node.js |
| **Backend Framework** | Express.js (ES6 Modules) |
| **Database** | MongoDB (Mongoose ODM) & JSON DB Fallback |
| **Authentication** | JSON Web Tokens (JWT) |
| **Security** | BcryptJS, Crypto-JS, Joi Validation |
| **Frontend** | Pure HTML5, CSS3, Vanilla JavaScript |

---

## 📂 Project Structure

```text
Saraha Api/
├── server.js                          # Startup entry point
├── package.json                       # ES Module configuration & dependencies
├── .env                               # Active environment variables (Do not commit)
├── test-integration.js                # Full integration test suite script
├── src/
│   ├── app.js                         # Main Express application configuration
│   ├── config/                        # Database connection managers
│   ├── controllers/                   # Business logic
│   ├── middleware/                    # Auth, Validation, Error handling, Uploads
│   ├── models/                        # MongoDB schemas
│   ├── services/                      # JSON DB fallback engine
│   ├── utils/                         # App Error, Crypto, Email templates
│   ├── validators/                    # Joi schemas
│   └── routes/                        # API endpoint definitions
└── public/                            # Frontend assets (HTML, CSS, JS)
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** (Version 18.0.0 or higher)
- **npm**
- **MongoDB** *(Optional)* - The app automatically switches to JSON DB mode if MongoDB is not running.

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/saraha-anonymous-messages.git
   cd saraha-anonymous-messages
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   *Open `.env` and add your specific keys.*

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open in browser**
   Navigate to: `http://localhost:3000`

---

## 💻 Usage

Once the server is running:
1. **Sign up** for an account via the `signup.html` page.
2. **Share your profile link** (e.g., `http://localhost:3000/send.html?u=your_username`).
3. **Receive messages** in your protected dashboard.
4. **Freeze** your favorite messages to pin them to the top of your feed.
5. **Toggle between Night and Morning mode** using the sun/moon button in the header.

---

## 🔌 API Integration

### Authentication Routes `/api/v1/auth`
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/signup` | Public | Registers a new user. |
| **POST** | `/login` | Public | Authenticates user and returns JWT. |
| **GET** | `/me` | Protected | Retrieves logged-in user profile. |

### User Profile Routes `/api/v1/user`
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/public/:username` | Public | Fetches public profile data. |
| **GET** | `/check-username` | Public | Checks handle availability. |
| **PUT** | `/profile` | Protected | Updates profile details. |
| **POST** | `/avatar` | Protected | Uploads avatar image. |

### Message Routes `/api/v1/message`
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/send` | Public | Sends anonymous message. |
| **GET** | `/inbox` | Protected | Retrieves user's messages. |
| **PUT** | `/:id/freeze` | Protected | Toggles frozen state. |
| **DELETE** | `/:id` | Protected | Deletes a message. |

---

## 🎨 Design System

- **🌙 Night Mode (Dark Theme):** Deep `#0b0f19` backgrounds, glassmorphism cards, and Indigo-to-Purple gradients for a moody, premium feel.
- **☀️ Morning Mode (Light Theme):** Clean `#f8fafc` backgrounds, crisp whites, and Deep Violet accents.
- **Persistence:** User preferences are saved in `localStorage` under the key `saraha_theme`.

---

## 🌍 Deployment

This project is currently hosted and live on Vercel. 

For your own deployment, the frontend static files (in `/public`) are compatible with any static hosting service (Vercel, Netlify). However, because it utilizes a Node.js/Express backend, deployment to serverless platforms like Vercel or Render will require proper backend configuration (e.g., setting up the server as a serverless function or using a dedicated Node.js hosting plan).

### 🔗 Live URL
**[https://saraha-anonymous-messages-platform.vercel.app/](https://saraha-anonymous-messages-platform.vercel.app/)**

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<br>

<div align="center">
  Made with ❤️ and ☕ by Your Name
</div>
```