# IGA Platform — Team-15

Empowering girls ages 5–18 through STEM, financial literacy, and entrepreneurship.

## Overview

The IGA Platform is a modern educational technology system designed to provide structured learning pathways, mentorship connections, program participation, and community engagement for girls globally. The platform currently supports students in the United States, Ghana, Liberia, and Guyana.

It includes a full-stack web platform with user onboarding, customizable learning modules, real-time community features, mentorship scheduling, event management, and AI-assisted educational interaction.

---

## Landing Page Design

A structured landing experience highlights:

* Clear messaging emphasizing accessible opportunity
* Role-based onboarding (students, parents, mentors, alumni)
* Program previews and learning pathways
* Community values and trust indicators
* Testimonials, partner logos, and donation pathways

Key design goals:

* Mobile-first responsiveness
* High contrast, accessible UI
* Culturally contextual visual elements
* Minimal user friction

---

## Architecture Overview

### Frontend

* Next.js 14 (App Router)
* React + TypeScript
* Tailwind CSS
* Radix UI
* Framer Motion (animations)
* React Three Fiber + Three.js (3D globe visualization)
* React Context + local state management

### Backend

* FastAPI (Python)
* Supabase (PostgreSQL)
* Supabase Auth
* WebSockets
* Zoom SDK integration
* OpenAI model integration

### DevOps

* Modular file structure for maintainability
* Environment-variable based configuration
* Supabase hosting + auth
* Full REST API communication between frontend and backend

---

## Core Features

### User Roles

* Students
* Parents
* Volunteers/Mentors
* Alumni

Each role receives distinct onboarding flows and contextual dashboards.

---

### Learning & Program Flow

A structured pathway guides students through:

1. Nguzo Saba principles
2. Program selection (Ujima, Kumbathon, Box of Open Love)
3. Mentorship engagement and workshops

Features:

* Age-appropriate curriculum
* Progress tracking
* Instructional modules
* Integration with calendar + meetings

---

### Marketplace / Shop

* View catalog of items
* Purchase with earned credits
* Manage user inventory
* Equip/use items

Routes support listing, transactions, and inventory management.

---

### Events & Meetings

* Event listing and details
* User registration and management
* Zoom meeting integration
* Join links + scheduling
* Organizer dashboard supporting CRUD

---

### Chatbot

* Contextual chat assistant
* Supports conversational guidance
* Integrated with OpenAI model
* Used across platform to support onboarding and learning

Frontend + backend endpoints fully implemented.

---

## API Surface Summary

### User (Supabase Auth)

* `POST /api/v1/users/register`
* `POST /api/v1/users/login`
* `GET  /api/v1/users/me`

### Items

* `GET  /api/v1/items`
* `GET  /api/v1/items/{id}`
* `POST /api/v1/items`

### User Items

* `GET  /api/v1/users/{id}/items`
* `POST /api/v1/users/{id}/items/purchase`
* `PUT  /api/v1/users/{id}/items/{item_id}/equip`

### Modules

* `GET    /api/v1/modules/user/{id}`
* `GET    /api/v1/modules/{id}`
* `POST   /api/v1/modules`
* `PUT    /api/v1/modules/{id}`
* `DELETE /api/v1/modules/{id}`

### Meetings

* `GET  /api/v1/meetings`
* `GET  /api/v1/meetings/{id}`
* `POST /api/v1/meetings/create`
* `POST /api/v1/meetings/{id}/join`
* `PUT  /api/v1/meetings/{id}/status`

### Events

* `GET    /api/v1/events`
* `GET    /api/v1/events/{id}`
* `POST   /api/v1/events`
* `PUT    /api/v1/events/{id}`
* `DELETE /api/v1/events/{id}`

### Chatbot

* `POST /api/v1/chatbot/chat`

Not implemented: Donations API

---

## Project Structure

```
├── frontend/
│   ├── src/app/                 # Next.js pages (App Router)
│   ├── src/components/          # UI + domain components
│   ├── src/lib/                 # API clients + utilities
│   └── src/context/             # App state / auth context
├── backend/
│   ├── src/app/api/             # API endpoint definitions
│   ├── src/app/core/            # App config
│   ├── src/app/models/          # Database models
│   └── tests/                   # Test coverage
└── README.md
```

---

## Future Expansion

* Personalized learning curriculum powered by adaptive AI
* Enhanced resource recommendations
* Improved matching algorithms for mentors + students
* Localization improvements for additional regions
* Chatbot domain-skill tutoring
