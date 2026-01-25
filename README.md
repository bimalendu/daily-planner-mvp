# 📅 TaskFlow Pro: Daily Planner

A robust, production-ready daily planner application built with Python and Streamlit. This application features a Microsoft Teams-inspired interface, drag-and-drop scheduling, and scalable backend logic suitable for client demos.

![App Status](https://img.shields.io/badge/Status-Prototype-blue) ![Python](https://img.shields.io/badge/Python-3.9%2B-green) ![Streamlit](https://img.shields.io/badge/Streamlit-1.30%2B-red)

## ✨ Key Features

* **Visual Calendar Interface:** A rich `FullCalendar` integration offering Month, Week, and Day views.
* **Drag & Drop Scheduling:** Interactive GUI where moving tasks visually automatically updates the underlying database.
* **CRUD Operations:** Create, Read, Update, and Delete tasks with ease.
* **Smart Pagination (Scalable):** Implements "Lazy Loading" to fetch only the data required for the current view, ensuring high performance even with large datasets (1GB+).
* **Conflict Detection:** Visual blocking for overlapping tasks.
* **Notification System:** Backend logic ready for Email/SMS alerts when tasks begin.

## 🛠️ Technology Stack

* **Frontend:** [Streamlit](https://streamlit.io/) + [Streamlit Calendar](https://pypi.org/project/streamlit-calendar/)
* **Backend Logic:** Python 3.x
* **Database:** SQLite (Zero-configuration, persistent file storage)
* **Data Processing:** Pandas

## 🚀 Installation & Setup

Follow these steps to run the application locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/taskflow-planner.git](https://github.com/yourusername/taskflow-planner.git)
cd taskflow-planner
```

### 2. Initialize UV and Install Dependencies
```bash
uv init
uv add streamlit-calendar pandas
```

### 3. Run the Application
```bash
uv run -- streamlit run app.py
```

## 📂 Project Structure
```
├── app.py                # Main application entry point
├── mvp_planner.db        # SQLite database (auto-generated on first run)
├── requirements.txt      # List of dependencies
└── README.md             # Project documentation
```