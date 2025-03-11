# User Management System for Admin

A system designed for user management with an admin dashboard.

## Features

1. **Sign-up and Login:**
   - Every user can sign up and log into the system.
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

### Backend:
- **Mongoose (MongoDB)** for database management.
- **Express** for handling server-side logic.
- **Nodemon** for automatic server restarts during development.

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
   git clone https://github.com/barak7821/AdminUserManager.git
   ```

2. Navigate to the project folder:
   ```bash
   cd <project folder name>
   ```

3. Install dependencies:
   - For backend:
     ```bash
     cd backend
     npm install
     ```

   - For frontend:
     ```bash
     cd frontend
     npm install
     ```
     
4. Set up your environment variables:
   - Before running the project, you need to create a .env file in the root directory of the project. This file should include the following environment variables:
     
     **MongoDB_URL:** The connection string to your MongoDB database.
     
     **JWT_SECRET:** A secret key used for JWT token generation and verification.
     
     **PORT:** The port on which the backend server will run.

   - Example .env file:
   ```bash
   MongoDB_URL=your_mongodb_connection_url
   JWT_SECRET=your_jwt_secret_key
   PORT=your_port_number
   ```
   
   Make sure to replace the values with your own configuration.

   **Notes:** You can use the .env.example file provided in the project as a template for your .env file.

5. Run the server:
   - For the backend server:
     ```bash
     cd backend
     npm run dev
     ```

   - For React frontend:
     ```bash
     cd frontend
     npm run dev
     ```
