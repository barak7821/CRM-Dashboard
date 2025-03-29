# User Management System for Admin

A system designed for user management with an admin dashboard.

## Features

1. **Sign-up and Login:**
   - Every user can sign up and log into the system.
   - Users have access to a personal page where they can edit their details.
   - Users who forgot their password can request a reset link via email and update their password securely.
   - Users have access to a personal page where they can edit their details.

2. **Admin Access:**
   - If the user is an admin (registered as such in the system), they will be redirected to a different page after logging in.
   - On this page, the admin can view all users in the system and perform actions such as editing, deleting, or updating user details, including managing user permissions.
   - A default admin user is automatically created when the project is first run. This ensures there will always be an admin in the system.
   - Even if the admin user is deleted, it will be recreated automatically the next time the server is restarted.
   - The default admin's login credentials are as follows:
   
      **Email:** admin@admin
   
      **Password:** 123456789
     
## Technologies Used

### Frontend:
- **React** for building the user interface.
- **TailwindCSS** for styling the application.
- **Axios** for API calls.
- **Notyf** for styled notifications.
- **React-Router-Dom** for routing and navigation.
- **React-Icons** for icons.
- **react-oauth/google** for integrating Google login (OAuth2).

### Backend:
- **Mongoose (MongoDB)** for database management.
- **Express** for handling server-side logic.
- **Nodemon** for automatic server restarts during development.
- **Nodemailer** for sending password reset emails.

### Security & Connection Management:
- **JWT (JSON Web Tokens)** for user authentication.
- **DotENV** for managing sensitive environment variables.
- **CORS** for handling cross-origin requests.
- **Bcrypt** for encrypting passwords.

## Code Organization

The project is structured as follows:

```
Root Directory
│
├── frontend
│   ├── vite.config.js
│   ├── package-lock.json
│   ├── package.json
│   ├── index.html
│   ├── eslint.config.js
│   ├── .gitignore
│   ├── .env
│   ├── node_modules/  ← Folder
│   └── src/  ← Folder
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── pages/  ← Folder
│       │   ├── Register.jsx
│       │   ├── NotFound.jsx
│       │   ├── Main.jsx
│       │   └── Login.jsx
│       ├── components/  ← Folder
│       │   ├── AdminPanel.jsx
│       │   ├── SideBar.jsx
│       │   └── EditUser.jsx
│       └── assets/  ← Folder
│           └── test.png
│
└── backend
    ├── package-lock.json
    ├── package.json
    ├── .gitignore
    ├── .env
    ├── node_modules/  ← Folder
    └── src/  ← Folder
        ├── index.js
        ├── utils/  ← Folder
        │   ├── passwordUtils.js
        │   └── defaultAdminUser.js
        ├── routes/  ← Folder
        │   ├── userRoutes.js
        │   ├── authRoutes.js
        │   └── adminRoutes.js
        ├── models/  ← Folder
        │   └── userModel.js
        ├── middleware/  ← Folder
        │   └── authMiddleware.js
        ├── controllers/  ← Folder
        │   ├── userController.js
        │   ├── authController.js
        │   └── adminController.js
        └── config/  ← Folder
            └── dbConfig.js
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/AdminUserManager.git
   ```

2. Navigate to the project folder:
   ```bash
   cd <project folder name>
   ```

3. Install dependencies from the root project folder (the one containing both frontend/ and backend/):
     ```bash
     npm install
     ```
This will install dependencies for both the frontend and backend using npm-run-all, without needing to run npm install separately in each subfolder.
     
4. Set up your environment variables:
   - Each part of the project (both frontend/ and backend/) requires its own separate .env file.
   - Copy the provided .env.example in each of them to a new file named .env.
   - Fill in your own values:

   Backend .env
   ```bash
   PORT=your_port
   MongoDB_URL=your_mongodb_connection_url
   JWT_SECRET=your_jwt_secret_key
   APP_NAME=Your_App_Name
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_app_password
   ```
   Frontend .env
   ```bash
   VITE_PORT=your_backend_port
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ``` 
   
   Make sure to replace the values with your own configuration.

5. Run the project from the root directory:
     ```bash
     npm run dev
     ```
     
This will start both the backend and frontend servers concurrently using npm-run-all and concurrently. Make sure to run this command from the main project folder, not from the frontend or backend subfolders. The frontend output will be shown in blue, and the backend in green.