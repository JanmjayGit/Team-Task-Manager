## Team Task Manager (Full-Stack)

A full-stack **Team Task Management System** where users can create projects, assign tasks, and track progress with **role-based access (Admin / Member)**.

Built as part of a full-stack assignment with focus on **real-world usability, clean UI, and scalable architecture**.

---

##  Tech Stack

###  Frontend
- React.js (JavaScript)
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React Icons
- React Hot Toast

###  Backend
- Java
- Spring Boot
- Spring Security (JWT Authentication)
- JPA / Hibernate
- REST APIs

###  Database
- PostgreSQL  (Cloud Hosted)

### 🔹 Deployment
- Frontend: Vercel 
- Backend: Railway 
- Database:  Railway

---

##  Authentication & Security

- User Signup & Login
- JWT-based authentication
- Password encryption (BCrypt)
- Role-based access control:
    - ADMIN
    - MEMBER
- Protected routes (frontend + backend)

---

##  Roles & Permissions

###  ADMIN
- Create projects
- Add members to projects
- Assign tasks
- View all projects and tasks

###  MEMBER
- View assigned tasks
- Update task status
- View assigned projects

---

##  Features

###  Dashboard
- Total tasks
- Completed tasks
- Pending tasks
- Overdue tasks
- Task completion progress bar
- Nearest deadlines
- Overdue task highlighting

---

###  Project Management
- Create projects (Admin)
- Add members to project
- View project list
- View project tasks

---

###  Task Management
- Create tasks (Admin)
- Assign tasks to users
- Update task status
- Track progress

---

###  Kanban Board (Jira-inspired)
- Columns:
    - TODO
    - IN_PROGRESS
    - DONE
- Drag/drop or dropdown status updates
- Task cards with:
    - Title
    - Description
    - Due date
    - Status badge
    - Assigned user
    - Overdue indicator

---

###  Advanced Features
- Search tasks by title
- Filter tasks by:
    - Status
    - Project
    - Due date
- Project-based task view
- Clear filters option

---

### Overdue Handling
- Highlights overdue tasks
- Red badge + border for overdue items

---

###  UX Enhancements
- Toast notifications (success/error)
- Loading states & skeletons
- Empty states
- Responsive UI

---

##  UI & Design

- Dark SaaS dashboard theme
- Fixed sidebar navigation
- Clean, modern card-based UI
- Rounded corners & hover effects
- Fully responsive layout

---


---

##  API Endpoints (Sample)

### Auth
- POST `/api/auth/signup`
- POST `/api/auth/login`

### Projects
- POST `/api/projects`
- GET `/api/projects`
- POST `/api/projects/{id}/add-member`

### Tasks
- POST `/api/tasks`
- GET `/api/tasks/my`
- PUT `/api/tasks/{id}/status`
- GET `/api/tasks/project/{projectId}`

---


