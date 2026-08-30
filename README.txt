================================================================================
                    SARAHA - ANONYMOUS MESSAGES PLATFORM
================================================================================

Description:
  A full-stack, production-ready anonymous messaging web application inspired by Saraha.
  Allows users to receive honest, constructive feedback and secret messages from friends,
  colleagues, and followers with total privacy, end-to-end security, and aesthetic custom cards.

Author: Senior Full-Stack Engineering Team
Version: 1.0.0
License: MIT


--------------------------------------------------------------------------------
TABLE OF CONTENTS
--------------------------------------------------------------------------------
1. Tech Stack Overview
2. Key System Features
3. Project Folder Structure
4. Backend Modules & API Endpoints Reference
5. Frontend Design & Theme System
6. Step-by-Step Installation & Running Guide
7. Environment Variables Configuration (.env)
8. Running Automated Integration Tests
9. How to Upload & Push to GitHub


--------------------------------------------------------------------------------
1. TECH STACK OVERVIEW
--------------------------------------------------------------------------------
- Backend Core:
    * Node.js & Express.js (Strictly ES6 Modules with "type": "module" in package.json)
    * MongoDB with Mongoose ODM
    * Hybrid DB Engine: Automatic fallback to local persistent JSON Database 
      (./data/db.json) if MongoDB is not running locally.

- Security & Validation:
    * JWT (jsonwebtoken): Bearer Token authentication & session state management.
    * BcryptJS (bcryptjs): 10-round salt password hashing.
    * Crypto-JS (crypto-js): Optional AES encryption for sensitive message payloads.
    * Joi Validation (joi): Middleware schemas enforcing body, query, and parameter safety.

- Utilities & Middleware:
    * Multer (multer): Profile picture image uploader (/public/uploads/) with MIME type filters.
    * Nodemailer (nodemailer): HTML email delivery engine for welcome notices & notifications.
    * Dotenv (dotenv): Environment variables management.
    * CORS (cors): Cross-Origin Resource Sharing handling.

- Frontend Engine:
    * Pure HTML5, Vanilla CSS3, and ES6 JavaScript (Zero frontend frameworks required).
    * Night Mode (Dark) & Morning Mode (Light) CSS Custom Variables engine.
    * Persistent user preferences stored in localStorage.
    * Glassmorphism layout, floating toast notifications, and interactive modals.


--------------------------------------------------------------------------------
2. KEY SYSTEM FEATURES
--------------------------------------------------------------------------------
1. User Authentication:
   - User Signup with instant password hashing and welcome email delivery.
   - Login with email or username handle returning a JWT access token.
   - Protected routes using Bearer token authorization middleware.

2. Profile Management:
   - Public user handle pages (e.g. /send.html?u=alex).
   - Real-time Regex username availability checker utility.
   - Profile details update (Name, Bio, Email address).
   - Profile picture avatar upload powered by Multer with image preview.

3. Messaging System:
   - Send anonymous messages to any user profile link.
   - Optional Crypto-JS AES encryption toggle for message payloads.
   - Private inbox dashboard displaying message history.
   - Star / Freeze message cards to pin important memories to the top.
   - Delete messages permanently.
   - "Share Message Card" modal to generate stylized quote cards for social media.

4. Educational Security Module:
   - "What is a Token?" dedicated educational page (/token-info.html).
   - Interactive JWT inspector tool to decode JWT headers, payloads, claims, and expiration.


--------------------------------------------------------------------------------
3. PROJECT FOLDER STRUCTURE
--------------------------------------------------------------------------------
Saraha Api/
├── server.js                          # Startup entry point
├── package.json                       # ES Module configuration & dependencies
├── .env                               # Active environment variables
├── .env.example                       # Environment template
├── README.txt                         # GitHub repository documentation
├── test-integration.js                # Full integration test suite script
├── src/
│   ├── app.js                         # Main Express application configuration
│   ├── config/
│   │   └── db.js                      # Connection manager (Mongoose ODM & JSON DB fallback)
│   ├── controllers/
│   │   ├── auth.controller.js         # Signup, login, getMe, email verification
│   │   ├── user.controller.js         # Public profiles, regex username check, avatar upload
│   │   └── message.controller.js      # Send message, inbox retrieval, freeze, delete
│   ├── middleware/
│   │   ├── auth.middleware.js         # Bearer JWT protection middleware
│   │   ├── validate.middleware.js     # Joi validation middleware
│   │   ├── upload.middleware.js       # Multer file upload handler
│   │   ├── error.middleware.js        # Global error handling middleware
│   │   ├── async.middleware.js        # Async handler wrapper
│   │   └── notFound.middleware.js     # 404 route handler
│   ├── models/
│   │   ├── user.model.js              # User model schema & database operations
│   │   └── message.model.js           # Message model schema & database operations
│   ├── services/
│   │   └── jsonDb.service.js          # Persistent JSON storage engine fallback
│   ├── utils/
│   │   ├── appError.util.js           # Custom AppError class
│   │   ├── crypto.util.js             # Crypto-JS AES encryption helpers
│   │   └── email.util.js              # Nodemailer utility & HTML email templates
│   ├── validators/
│   │   ├── auth.validator.js          # Joi auth validation schemas
│   │   ├── user.validator.js          # Joi profile validation schemas
│   │   └── message.validator.js       # Joi messaging validation schemas
│   └── routes/
│       ├── auth.routes.js             # Auth endpoints (/api/v1/auth)
│       ├── user.routes.js             # User endpoints (/api/v1/user)
│       └── message.routes.js          # Message endpoints (/api/v1/message)
└── public/
    ├── css/
    │   └── style.css                  # CSS design system (Night & Morning themes)
    ├── js/
    │   ├── app.js                     # Core theme switcher, toast alerts, API fetcher
    ├── uploads/
    │   └── default-avatar.svg         # SVG default avatar & file storage directory
    ├── index.html                     # Homepage & live handle search
    ├── login.html                     # Login page
    ├── signup.html                    # Signup page
    ├── dashboard.html                 # Inbox dashboard (stats, freeze, share modal)
    ├── send.html                      # Public anonymous message sending page
    ├── profile.html                   # Profile settings & Multer avatar uploader
    └── token-info.html                # "What is a Token?" interactive inspector


--------------------------------------------------------------------------------
4. BACKEND MODULES & API ENDPOINTS REFERENCE
--------------------------------------------------------------------------------

[Authentication Routes] - Base: /api/v1/auth
--------------------------------------------------------------------------------
Method  | Endpoint          | Protection | Description
--------------------------------------------------------------------------------
POST    | /signup           | Public     | Registers new user with Joi validation & bcrypt.
POST    | /login            | Public     | Authenticates user and returns JWT token.
GET     | /me               | Protected  | Retrieves logged-in user profile details.
POST    | /verify-email     | Public     | Verifies email token confirmation.

[User Profile Routes] - Base: /api/v1/user
--------------------------------------------------------------------------------
Method  | Endpoint          | Protection | Description
--------------------------------------------------------------------------------
GET     | /public/:username | Public     | Fetches public avatar, name, bio for recipient.
GET     | /check-username   | Public     | Checks handle availability using Regex.
GET     | /search           | Public     | Searches user handles dynamically for search bar.
PUT     | /profile          | Protected  | Updates name, bio, or email address.
POST    | /avatar           | Protected  | Uploads user avatar image via Multer.

[Message Routes] - Base: /api/v1/message
--------------------------------------------------------------------------------
Method  | Endpoint          | Protection | Description
--------------------------------------------------------------------------------
POST    | /send             | Public     | Sends anonymous message (supports Crypto-JS).
GET     | /inbox            | Protected  | Retrieves user's received anonymous messages.
PUT     | /:id/freeze       | Protected  | Toggles frozen / pinned state of a message.
DELETE  | /:id              | Protected  | Deletes message permanently from inbox.


--------------------------------------------------------------------------------
5. FRONTEND DESIGN & THEME SYSTEM
--------------------------------------------------------------------------------
- Night Mode (Dark Theme):
    * Primary Background: #0b0f19
    * Card Background: Glassmorphism rgba(17, 24, 39, 0.75) with 16px blur
    * Text Colors: #f9fafb (Primary), #9ca3af (Secondary)
    * Accent Gradient: Indigo to Purple (#6366f1 to #a855f7)

- Morning Mode (Light Theme):
    * Primary Background: #f8fafc
    * Card Background: rgba(255, 255, 255, 0.85)
    * Text Colors: #0f172a (Primary), #475569 (Secondary)
    * Accent Gradient: Deep Indigo to Violet (#4f46e5 to #7c3aed)

- Theme Switcher Persistence:
    Theme selection is toggled with the header sun/moon button and persisted 
    instantly in localStorage under the key 'saraha_theme'.


--------------------------------------------------------------------------------
6. STEP-BY-STEP INSTALLATION & RUNNING GUIDE
--------------------------------------------------------------------------------

Prerequisites:
- Node.js (Version 18.0.0 or higher recommended)
- npm (Node Package Manager)
- MongoDB (Optional. If not running, Saraha automatically switches to JSON DB mode).

Step 1: Clone or Open Workspace Directory
    cd "Saraha Api"

Step 2: Install Node.js Dependencies
    npm install

Step 3: Verify Environment Variables
    Ensure your .env file exists in the root directory. If missing, copy from .env.example:
    cp .env.example .env

Step 4: Start the Application Server
    For Production Mode:
        npm start

    For Development Mode (with auto-watch):
        npm run dev

Step 5: Access in Browser
    Open your web browser and navigate to:
        http://localhost:3000


--------------------------------------------------------------------------------
7. ENVIRONMENT VARIABLES CONFIGURATION (.env)
--------------------------------------------------------------------------------
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/saraha_db
JWT_SECRET=saraha_super_secret_jwt_key_2026_secure
JWT_EXPIRES_IN=7d
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=demo@saraha.local
EMAIL_PASS=demopassword
ENCRYPTION_SECRET=saraha_crypto_secret_key_321


--------------------------------------------------------------------------------
8. RUNNING AUTOMATED INTEGRATION TESTS
--------------------------------------------------------------------------------
To test the complete API pipeline (Signup -> Regex check -> Send Message -> Inbox fetch -> Freeze -> Delete):

1. Start the server (npm start).
2. Open a terminal in the project directory and run:
    node test-integration.js

Output will display step-by-step verification results for all API routes.


--------------------------------------------------------------------------------
9. HOW TO UPLOAD & PUSH TO GITHUB
--------------------------------------------------------------------------------

1. Create a .gitignore file in the root directory:
   Create a file named .gitignore with the following contents:
     node_modules/
     .env
     data/db.json
     public/uploads/avatar-*.png
     public/uploads/avatar-*.jpg

2. Initialize Git Repository:
   git init

3. Stage All Project Files:
   git add .

4. Commit the Changes:
   git commit -m "Initial release: Saraha Anonymous Messages platform v1.0.0"

5. Link to Your GitHub Repository:
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/saraha-anonymous-messages.git

6. Rename Branch to Main and Push:
   git branch -M main
   git push -u origin main

================================================================================
                            HAPPY CODING! 🚀
================================================================================
