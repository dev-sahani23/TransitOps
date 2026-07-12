# TransitOps - Transportantion Management System  

## Problem Statement ~

Many transport and logistics companies still depend on spreadsheets,
manual registers, and disconnected software to manage their fleet.

This causes:

• Duplicate dispatches

• Driver scheduling conflicts

• Expired licenses

• Missed maintenance

• Fuel leakage

• Poor operational visibility

• High operational costs

TransitOps solves these problems through an integrated digital transport management platform capable of managing the complete lifecycle of vehicles, drivers, trips, maintenance, expenses, and business analytics.

---

A modern, full-stack Transport Operations Management Platform built to digitize fleet operations, driver management, dispatching, maintenance, fuel tracking, operational expenses, and business analytics.

TransitOps replaces manual spreadsheets and fragmented workflows with a centralized platform that provides complete visibility into transport operations while enforcing critical business rules throughout the vehicle lifecycle ... 

Digitize vehicle lifecycle, dispatch operations, fleet maintenance, fuel monitoring, expense tracking, and business analytics through a centralized, scalable platform ... 

TransitOps enables organizations to efficiently manage transportation operations through a secure, scalable, and role-based system.

---

## Tech Stack 

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TanStack Router](https://img.shields.io/badge/TanStack-Router-FF4154?style=for-the-badge)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-black?style=for-the-badge&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier)


## Overview

## Dashboard Section 
<img width="1841" height="736" alt="image" src="https://github.com/user-attachments/assets/4e49bc47-564e-4d54-9441-d7d0acc217a7" />

## Dispatch Section
<img width="1836" height="790" alt="image" src="https://github.com/user-attachments/assets/98c40784-3fac-493c-9608-f044ded3c816" />

## Vehicle Data
<img width="1841" height="717" alt="image" src="https://github.com/user-attachments/assets/6333df59-f5ca-4b0f-b419-285520d22d8c" />

## Drivers Data
<img width="1560" height="635" alt="image" src="https://github.com/user-attachments/assets/d0d7edc5-9c48-436a-afe0-8a8720f01785" />

## Vehicle Maintainance
<img width="1532" height="620" alt="image" src="https://github.com/user-attachments/assets/f094b7aa-97a4-4eca-aad0-ed351aba18de" />

## Logistic Revenue
<img width="1558" height="662" alt="image" src="https://github.com/user-attachments/assets/7ed41cf0-53e2-4d01-a128-912842a5760a" />


The platform provides end-to-end management of:

- Fleet Management
- Vehicle Registry
- Driver Management
- Trip Dispatch
- Maintenance Scheduling
- Fuel Logging
- Expense Tracking
- Operational Analytics
- Role Based Access Control (RBAC)

Designed with scalability, maintainability, and enterprise architecture in mind, TransitOps follows a modular backend architecture and a modern frontend stack.

---

## Key Features

### Authentication ✅

- Secure Login
- JWT Authentication
- Refresh Tokens
- Password Encryption
- Protected Routes
- Role Based Access Control

---

### Dashboard ✅

- Fleet Overview
- Active Trips
- Pending Trips
- Vehicle Utilization
- Driver Status
- Fleet KPIs
- Interactive Analytics
- Operational Insights

---

### Vehicle Management ✅

- Register Vehicles
- Vehicle Status Tracking
- Vehicle Categories
- Registration Validation
- Capacity Management
- Odometer Tracking
- Acquisition Cost
- Vehicle Lifecycle

---

### Driver Management ✅

- Driver Profiles
- License Verification
- License Expiry Monitoring
- Driver Availability
- Safety Score Tracking
- Contact Management
- Assignment History

---

### Trip Management ✅

- Create Trips
- Vehicle Assignment
- Driver Assignment
- Dispatch Workflow
- Cargo Validation
- Distance Tracking
- Trip Status Lifecycle

```
Draft
    ↓
Dispatched
    ↓
Completed
    ↓
Archived
```

---

### Maintenance Management ✅

- Maintenance Logs
- Service History
- Vehicle Availability Automation
- Repair Records
- Scheduled Maintenance

---
 
### Fuel & Expense Management ✅

- Fuel Logs
- Fuel Consumption
- Expense Tracking
- Toll Expenses
- Maintenance Expenses
- Operational Cost Calculation

---

### Reports & Analytics ✅

- Fleet Utilization
- Fuel Efficiency
- Operational Cost
- Vehicle ROI
- Driver Performance
- Export Reports
- Business Insights

---

## Business Rules ✅

TransitOps automatically enforces operational constraints to ensure data integrity and eliminate scheduling conflicts.

Examples include:

- Unique Vehicle Registration Numbers
- Vehicle Capacity Validation
- Driver License Validation
- Automatic Vehicle Status Updates
- Automatic Driver Status Updates
- Maintenance Locking
- Trip Assignment Validation
- Dispatch Availability Checks

These validations are performed on the server before any business operation is executed.

---

# Technology Stack ⚙️

## Frontend

- React
- TanStack Router
- Vite
- TypeScript
- Modern CSS
- REST API Integration

---

## Backend

- Node.js
- Express.js
- Prisma ORM
- JWT Authentication
- REST API

---

## Database

- PostgreSQL
- Prisma Schema
- Database Migrations

---

## Development Tools

- ESLint
- Prettier
- Git
- npm

---

# Project Structure

```
TransitOps
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── prisma
│   ├── routes
│   ├── services
│   ├── utils
│   ├── validations
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   ├── tanstack
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
└── README.md
```

---

# Architecture

```
                   Client
                      │
                      │
                React Frontend
                      │
             REST API Requests
                      │
                Express Server
                      │
      ┌───────────────┼───────────────┐
      │               │               │
 Controllers      Middleware      Services
      │               │               │
      └───────────────┼───────────────┘
                      │
                 Prisma ORM
                      │
                 PostgreSQL
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>

cd TransitOps
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file.

Example:

```env
PORT=5000

DATABASE_URL=

JWT_SECRET=

JWT_EXPIRES_IN=

REFRESH_SECRET=
```

Run database migrations.

```bash
npx prisma migrate dev
```

Generate Prisma Client.

```bash
npx prisma generate
```

Start backend.

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000
```

Start development server.

```bash
npm run dev
```

---

# Environment Variables

Backend

| Variable | Description |
|----------|-------------|
| PORT | Server Port |
| DATABASE_URL | PostgreSQL Connection |
| JWT_SECRET | Access Token Secret |
| REFRESH_SECRET | Refresh Token Secret |
| JWT_EXPIRES_IN | Token Expiration |

Frontend

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend Base URL |

---

# API Modules

Authentication

```
POST   /auth/login
POST   /auth/register
POST   /auth/refresh
POST   /auth/logout
```

Vehicles

```
GET
POST
PUT
DELETE
```

Drivers

```
GET
POST
PUT
DELETE
```

Trips

```
GET
POST
PUT
DELETE
```

Maintenance

```
GET
POST
PUT
DELETE
```

Fuel

```
GET
POST
PUT
DELETE
```

Expenses

```
GET
POST
PUT
DELETE
```

Reports

```
GET
```

---

# Security

- JWT Authentication
- Protected API Routes
- Password Hashing
- Role Based Authorization
- Request Validation
- Input Sanitization
- Centralized Error Handling
- Secure Environment Configuration

---

# Development Workflow

```
Feature Branch
        │
        ▼
Implementation
        │
        ▼
Validation
        │
        ▼
Testing
        │
        ▼
Pull Request
        │
        ▼
Review
        │
        ▼
Merge
```

---

# Future Enhancements

- Live GPS Tracking
- Route Optimization
- Predictive Maintenance
- Email Notifications
- Push Notifications
- Document Management
- AI Assisted Dispatch
- Fuel Consumption Prediction
- Advanced Reporting
- Mobile Application

---

# Performance Goals

- Modular Codebase
- Scalable Architecture
- Reusable Services
- Optimized Database Queries
- Fast API Responses
- Maintainable Project Structure

---

# License

This project is developed for educational and hackathon purposes.

---

# Contributors

Developed by the TransitOps Team.

Contributions, issues, and feature requests are welcome.

---

# Acknowledgements

Built as part of the Odoo Hackathon challenge to modernize transport operations through digital fleet management, operational automation, and business analytics.
