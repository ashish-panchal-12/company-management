# Company Management System

A web-based Company Management System built using **PHP, MySQL, HTML, CSS, and JavaScript** to manage employees, departments, projects, and attendance records efficiently.

For live Demo : https://company-management-system.infinityfreeapp.com/

## Features

* Employee Management

  * Add, update, view, and delete employee records.
  * Store employee details securely in the database.

* Department Management

  * Create and manage departments.
  * Assign employees to departments.

* Project Management

  * Manage company projects.
  * Track project information and assignments.

* Attendance Management

  * Record employee attendance.
  * View attendance history.

* Responsive User Interface

  * Clean and user-friendly design.
  * Easy navigation between modules.

## Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* PHP

### Database

* MySQL

## Project Structure

```text
company_management/
│
├── css/
│   └── styles.css
│
├── js/
│   └── scripts.js
│
├── php/
│   ├── config.php
│   ├── employees.php
│   ├── departments.php
│   ├── projects.php
│   └── attendance.php
│
├── database/
│   └── company_db.sql
│
├── index.html
├── employees.html
├── departments.html
├── projects.html
└── attendance.html
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ashish-panchal-12/company-management.git
```

### 2. Move Project to XAMPP

Copy the project folder into:

```text
C:\xampp\htdocs\
```

### 3. Start Apache and MySQL

Open XAMPP Control Panel and start:

* Apache
* MySQL

### 4. Create Database

1. Open phpMyAdmin.
2. Create a database named:

```text
company_db
```

### 5. Import SQL File

Import:

```text
database/company_db.sql
```

into the newly created database.

### 6. Configure Database Connection

Update the database credentials inside:

```text
php/config.php
```

Example:

```php
$host = "localhost";
$user = "root";
$password = "";
$database = "company_db";
```

### 7. Run the Application

Open your browser and visit:

```text
http://localhost/company_management/
```

## Screenshots

Add screenshots of:

* Dashboard
* Employee Management
* Department Management
* Project Management
* Attendance Management

## Future Enhancements

* User Authentication
* Role-Based Access Control
* Payroll Management
* Leave Management System
* Reports and Analytics
* Email Notifications

## Author

**Ashish Panchal**

GitHub: https://github.com/ashish-panchal-12

## License

This project is developed for educational and learning purposes.
