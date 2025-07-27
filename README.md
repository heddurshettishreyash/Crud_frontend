# 🏢 Organization Management Dashboard

[Live Demo 🚀](https://crud-frontend-1-rvb7.onrender.com/)

A full-stack web application built with **React + TypeScript** on the frontend and **Spring Boot + PostgreSQL** on the backend. This application allows you to manage organizations, their associated applications, and users with complete **CRUD** functionality. It also includes rich data visualizations using **Apache ECharts** and **D3.js**.

---

## 📌 Features

### ✅ Core Functionality:
- **Organizations**: Create, view, update, and delete organization records.
- **Applications**: Add applications under specific organizations.
- **Users**: Manage users under each application.

### 📊 Data Visualization:
- **Charts using Apache ECharts & D3.js**:
  - Applications per Organization (Bar/Line/Pie)
  - Users per Application (Bar/Line/Pie)

### 🔍 Enhanced User Experience:
- **Sorting** – Sort records by name, date, etc.
- **Filtering** – Filter data dynamically across tables.
- **Pagination** – Navigate through large datasets easily.
- **Forms** – Dynamic and validated forms to add/edit records.

---

---

## ⚙️ Tech Stack

### 🔧 Backend
- **Java Spring Boot**
- **PostgreSQL**
- **RESTful APIs**

### 💻 Frontend
- **React** with **TypeScript**
- **Vite** for blazing fast development
- **Apache ECharts** & **D3.js** for interactive charts
- **Bootstrap** and **MDB React UI Kit** for responsive styling

---

## 🚀 Live Deployment

- **Frontend:** Hosted on [Render Static Site](https://crud-frontend-1-rvb7.onrender.com/)
- **Backend:** Spring Boot deployed separately (you can include your backend link if public)

---

## 📦 Installation (For Local Development)

### 🔙 Backend (Spring Boot + PostgreSQL)

1. Clone the backend repository.
2. Set up PostgreSQL and configure your `application.properties`.
3. Run:
```bash
./mvnw spring-boot:run
