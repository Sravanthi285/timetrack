# ⏱️ Time Tracker – Attendance & Leave Management System

A full-stack web application to manage employee attendance, work hours, and leave requests with admin approvals.

Live Demo:
https://timetrack-zrdo.onrender.com

---

## ✨ Features

### Employee
- Register / Login
- Mark daily attendance
- Apply for leave
- View attendance history
- Track leave status

### Admin
- Dashboard
- View employees
- Approve / Reject leave requests
- Monitor attendance
- Manage users

---

## 🧰 Tech Stack

Frontend:
- HTML
- CSS
- JavaScript

Backend:
- Node.js
- Express.js

Database:
- MySQL
- SQLite (local fallback)

Deployment:
- Render

---

## 📂 Project Structure

```
timetrack/
├── public/
├── routes/
├── controllers/
├── database/
├── schema.sql
├── server.js
├── package.json
└── README.md
```

---

### Clone project
```bash
git clone https://github.com/Sravanthi285/timetrack.git
cd timetrack
  ```

## ⚙️ Setup Instructions

### Install dependencies
```bash
npm install
```

### Create MySQL database
```sql
CREATE DATABASE timetrack;
```

### Import schema
```bash
mysql -u root -p timetrack < schema.sql
```

### Create .env file
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=timetrack
PORT=3000
```

### Start server
```bash
npm start
```

### Open in browser
```
http://localhost:3000
```

---

## 🛠 API Endpoints

| Method | Route | Description |
|--------|--------|-------------|
| POST | /login | Login |
| POST | /register | Register |
| POST | /attendance | Mark attendance |
| POST | /leave | Apply leave |
| GET | /admin/users | Get users |

---

## 🔮 Future Improvements

- JWT authentication
- Email notifications
- Reports export
- Charts dashboard
- Mobile responsive UI

---

## 👩‍💻 Author

Karnapu Sravanthi  
GitHub: https://github.com/Sravanthi285

---

## 📄 License

MIT



