-- company_db.sql
CREATE DATABASE IF NOT EXISTS company_management;
USE company_management;

CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(15),
  department_id INT,
  position VARCHAR(100),
  salary DECIMAL(10,2),
  date_joined DATE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department_id INT,
  start_date DATE,
  end_date DATE,
  status ENUM('Ongoing','Completed','On Hold') DEFAULT 'Ongoing',
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  date DATE,
  status ENUM('Present','Absent','Leave') DEFAULT 'Present',
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);
