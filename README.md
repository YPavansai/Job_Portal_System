# CareerSphere – Premium Job Portal System

CareerSphere is a full-stack, responsive Job Portal application designed to connect job seekers (Candidates) and employers (Recruiters), managed under a secure administrative console (Admin). 

Built using a robust **Spring Boot (Java 17)** REST API backend, **MySQL** database persistence, and a modern **React (Vite)** frontend client.

---

## 🚀 Key Features

### 👤 Candidate Panel
* **Account Registration & Login:** JWT-based secure session authentication.
* **Profile Builder:** Edit title, bio, education, experience, contact details, and input comma-separated skills.
* **Resume Manager:** Safe PDF/DOC/DOCX resume file upload to the server.
* **Job Hunt:** Advanced job search engine (filter by title, location, job type, and experience level).
* **Application Tracker:** Apply to jobs with a custom cover letter and track your application status (Applied, Under Review, Shortlisted, Accepted, or Rejected).

### 🏢 Employer (Recruiter) Panel
* **Recruiter Console:** Visual dashboard tracking hiring pipelines and active job listings.
* **Job Posting Manager:** Create, update, or deactivate corporate job listings (Full-time, Part-time, Contract, Internship, Remote).
* **Applicant Review System:** Manage candidates through a hiring workflow. View resumes, cover letters, and candidate profiles, then shortlist or hire.

### 🛡️ Admin Console (System Administrator)
* **Stats Overview:** Real-time platform counters (total accounts, candidates, employers, and administrators).
* **Consolidated User List:** Centralized user management table with search and role filters.
* **Cascade Deletion:** Safely delete user accounts. Deleting a candidate wipes their profile/applications, while deleting an employer wipes their posted jobs/applications automatically.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | Main client engine. |
| **Styling** | Vanilla CSS + Glassmorphic elements | Premium visual design, dark theme, and micro-animations. |
| **Icons** | Lucide React | Clean, scalable vector symbols. |
| **Backend** | Spring Boot 3.3 | REST API and MVC routing. |
| **Security** | Spring Security 6 + JWT | Sessionless stateless authentication and route authorization rules. |
| **ORM / DB** | Spring Data JPA + Hibernate | Relational mappings and schema building. |
| **Database** | MySQL | Persistent data storage. |

---

## 📁 Project Directory Structure

```text
Java_Project_AD/
├── backend/            # Spring Boot Backend Code
│   ├── src/main/java   # Java Source Code (Controller, Service, Entity, Repository)
│   ├── src/main/resources
│   │   └── application.properties  # Database and Port settings
│   └── pom.xml         # Maven Dependencies
│
├── frontend/           # React Frontend App
│   ├── src/
│   │   ├── components/ # Reusable UI (Navbar, Footer, Protected Route)
│   │   ├── context/    # Global AuthContext & Axios Interceptors
│   │   ├── pages/      # Home, Auth (Login/Register), Dashboards (Candidate, Recruiter, Admin), Jobs
│   │   └── index.css   # Global Stylesheet
│   └── package.json    # Frontend Dependencies
│
└── README.md           # Documentation
```

---

## ⚙️ Setup & Installation

### Prerequisites
* Java Development Kit (JDK) 17+
* Node.js (v18+) & npm
* MySQL Server (running on port `3306`)

### 1. Database Setup
1. Open your MySQL client and log in as `root`.
2. The application is configured to automatically create the schema `jobportaldb` on startup. 
3. If you need to verify or change the credentials, update [application.properties](file:///c:/Users/pavan/OneDrive/Desktop/Java_Project_AD/backend/src/main/resources/application.properties):
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/jobportaldb?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=pavan
   ```

### 2. Run the Backend (Spring Boot)
Open a terminal in the `backend` folder and run:
```powershell
$env:JAVA_HOME="C:\Program Files\Java\jdk-17"
.\mvnw.cmd spring-boot:run
```
The server will boot up at: `http://localhost:8080`

### 3. Run the Frontend (React Client)
Open another terminal in the `frontend` folder and run:
```bash
npm install
npm run dev
```
The React dev server will boot up at: `http://localhost:5173`

---

## 🔑 Seed Credentials (Test Accounts)

Each time you launch the backend, default credentials are automatically populated into the MySQL database:

* **Administrator Account**
  * **Email:** `admin@example.com`
  * **Password:** `password123`
* **Candidate Account**
  * **Email:** `candidate@example.com`
  * **Password:** `password123`
* **Employer Account**
  * **Email:** `recruiter@example.com`
  * **Password:** `password123`
