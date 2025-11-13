# 🧾 Distributed Log Viewer (Work in Progress 🚧)

![React](https://img.shields.io/badge/-React-blue?logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/-FastAPI-teal?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-blue?logo=postgresql&logoColor=white)
![WebSocket](https://img.shields.io/badge/-WebSocket-purple?logo=socket.io&logoColor=white)
![Status](https://img.shields.io/badge/Status-Incomplete-orange)

---

## ⚠️ Project Status

> **Note:** This project is currently **under active development** and not yet complete.  
> Some features, UI components, and integrations are still in progress.  
> The repository is public for learning, experimentation, and open contribution.

---

## 🧠 Project Overview

**Distributed Log Viewer** is a real-time log monitoring web application designed for teams managing distributed systems.  
It allows multiple users or applications to **send, view, and analyze logs** in a single interface — with color-coded log levels, charts, and live updates.

This project is being built to **simulate a professional-grade centralized log monitoring system**, similar to tools like ELK Stack (Elasticsearch, Logstash, Kibana), but lightweight and developer-friendly.

---

## 🚀 Planned Features

- ⚡ **Real-time log streaming** using WebSockets  
- 🧩 **Multi-source log collection** (different services or microservices)  
- 🎨 **Interactive frontend** with color-coded logs (`info`, `warning`, `error`)  
- 📊 **Charts & analytics** for log insights  
- 🔔 **Toast notifications** for critical events  
- 🔐 **User authentication (JWT)** for secure access  
- 🧱 **Persistent storage** using PostgreSQL  
- 🧰 **SDK for sending logs** from client applications  

---

## 🧰 Tech Stack (Planned)

### Backend
- ⚙️ **FastAPI** — REST + WebSocket server  
- 🧠 **PostgreSQL** — log storage  
- 🔒 **JWT Authentication**  
- 🧾 **SQLAlchemy / asyncpg** — database ORM  
- 📦 **Pydantic** — schema validation  

### Frontend
- ⚛️ **React (Vite)**  
- 🎨 **CSS Modules** for scoped styles  
- 📈 **Recharts** for visualization  
- 🔔 **React Hot Toast** for notifications  
- 💫 **Smooth animations** (CSS transitions)  

---

## 📁 Project Structure (Planned)

```
.
├── backend
│   ├── cleaners
│   │   └── user.py
│   ├── controllers
│   │   └── auth_controller.py
│   ├── db
│   │   └── database.py
│   ├── main.py
│   ├── middleware
│   │   └── verify_jwtToken.py
│   ├── models
│   │   ├── apikey_log.py
│   │   ├── log_model.py
│   │   ├── source.py
│   │   └── user_model.py
│   ├── requirements.txt
│   ├── routers
│   │   ├── auth_router.py
│   │   ├── home_router.py
│   │   ├── sdk_auth.py
│   │   ├── source_router.py
│   │   └── websocket_router.py
│   ├── schemas
│   │   ├── Api_key.py
│   │   ├── LoginUser.py
│   │   ├── RegisterUser.py
│   │   └── source.py
│   ├── sdk
│   │   ├── LICENSE
│   │   ├── __init__.py
│   │   ├── distributed_logger
│   │   │   ├── __init__.py
│   │   │   └── logger.py
│   │   ├── example_usage.py
│   │   ├── requirements.txt
│   │   └── setup.py
│   ├── tests
│   │   ├── __init__.py
│   │   ├── test1.py
│   │   ├── test2.py
│   │   └── tester.py
│   ├── utils
│   │   ├── api_key.py
│   │   └── create_jwtToken.py
│   └── websocket
│       └── ws_manager.py
└── frontend
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── public
    │   └── vite.svg
    ├── src
    │   ├── App.jsx
    │   ├── assets
    │   │   └── react.svg
    │   ├── components
    │   │   ├── AccessToken
    │   │   │   └── AccessToken.jsx
    │   │   ├── Dashboard
    │   │   │   ├── Dashboard.jsx
    │   │   │   └── Dashboard.module.css
    │   │   ├── LogViewer
    │   │   │   ├── LogViewer.jsx
    │   │   │   └── LogViewer.module.css
    │   │   ├── Navbar.jsx
    │   │   ├── SourceRegister
    │   │   │   └── SourceRegister.jsx
    │   │   └── context
    │   │       ├── AuthContext.jsx
    │   │       └── LogContext.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   ├── pages
    │   │   ├── home.jsx
    │   │   ├── login.jsx
    │   │   └── signup.jsx
    │   └── styles
    │       ├── NavBar.module.css
    │       ├── apiKey.module.css
    │       ├── login.module.css
    │       ├── signup.module.css
    │       └── sourceRegister.module.css
    └── vite.config.js
```

---

## 🧩 Current Progress

- ✅ WebSocket connection working  
- ✅ Basic frontend layout (Log Viewer screen,Dashboard,API Key)  
- ✅ LogContext,Authentication context created for global state
- ✅ Fetching source list per username
- ✅ Fetching Source based logs
- ✅ Database integration
- 🧠 Filter logic for log level and source (in progress)
- ⏳ Backend Routes (in progress)     
- ⏳ Authentication system (in progress)
- ⏳ Download CSV - *not started yet*
- ⏳ Delete Source based Logs - *not started yet*
- ⏳ DB auto cleaners - *not started yet*
- ⏳ Log pattern recognition system - *not started yet*
- ⏳ SDK upload - *not done yet* 

---

## 🛠️ Development Setup 

**Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
---
## 🤝 Contributing

Since the project is still evolving, contributions, feedback, or suggestions are very welcome!
Feel free to fork, experiment, or open a pull request if you’d like to improve any part of it.

## 📜 License
This project will be licensed under the MIT License once it reaches its first stable release.

## 🌟 Author
Developed with ❤️ by Prem Chandu Palivela
(Learning-focused project — backend & frontend will be updated regularly)
