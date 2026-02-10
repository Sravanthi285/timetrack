# TimeTrack – Attendance and Leave Management System

A full-stack web application for managing employee attendance and leaves.

## Tech Stack
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js, Express
- **Database**: MySQL

## Prerequisites
- Node.js installed
- MySQL installed (e.g., via XAMPP or Workbench)

## Setup Instructions

1.  **Database Setup**
    - Open your MySQL client (e.g., phpMyAdmin or MySQL Workbench).
    - Import the `schema.sql` file provided in the root directory or copy-paste its content to run it.
    - Check `config/db.js` and update the `user` and `password` if your MySQL configuration is different from the default (root/empty).

2.  **Install Dependencies**
    Open a terminal in the project folder and run:
    ```bash
    npm install
    ```

3.  **Start the Server**
    ```bash
    npm start
    ```
    The server will start at `http://localhost:3000`.

4.  **Usage**
    - Open your browser and go to `http://localhost:3000`.
    - **Register** a new user. You can choose to be an **Employee** or **Admin**.
    - **Login** with the created credentials.
    - **Employee**: Mark attendance, view history, apply for leave.
    - **Admin**: View dashboard stats, view all attendance, approve/reject leaves.

## Default Admin Credentials
If you ran the `schema.sql`, a default admin user is created:
- **Email**: admin@timetrack.com
- **Password**: admin123
