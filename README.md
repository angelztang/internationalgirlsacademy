# Team-15

# Landing Page - IGA Platform

## Hero Section
**Headline:** "No Limitations. Just Possibilities."
**Subheadline:** "Empowering girls ages 5-18 through STEM, financial literacy, and entrepreneurship"
**Design:** Pink color scheme, bold typography
**CTA:** "Join Now" button → onboarding flow

## Welcome Video (North Star)
**Placement:** Hero section or immediately below
**Content:** 1-2 min explaining who IGA is, what programs exist, what to expect
**Purpose:** Sets clear expectations, shows community/safe space vibe
**Design:** Prominent play button or auto-play on mute

## Role Selection Cards
Four clear options:
- "I'm a Student" → student onboarding
- "I'm a Parent" → parent info/signup  
- "I'm a Volunteer/Mentor" → volunteer onboarding
- "I'm an Alumni" → alumni portal

Visual distinction between each role

## Your Journey Section
**Visual roadmap showing:**
1. Learn Nguzo Saba principles (modules)
2. Choose your program (Ujima, Kumbathon)
3. Build your future

Time commitments displayed for each step

## Programs Overview
**Three program cards:**
- **Ujima Business Program:** 12 weeks to launch your business
- **Kumbathon:** Make coding cool through hackathons
- **Box of Open Love:** Get essential items for school/college

Each with icon, description, "Learn More" link

## Nguzo Saba Preview
Display all 7 principles with icons
Highlight top 3: Unity, Purpose, Collective Work
Teaser: "Complete these modules to unlock programs"

## Community Transparency
**Section answering:** "What is this community?"
- Clear explanation of safe space commitment
- "Practical pricing, no scamming" messaging
- Who we serve and why

## Trust Indicators
- "2,000+ students empowered"
- "Global reach: US to Liberia"
- Partner/sponsor logos
- Student testimonial carousel

## Footer
- Donate button with brief impact explanation
- Contact information
- Social media links
- Language toggle (English/Spanish/others)

## Design Principles
- Mobile-first responsive
- High contrast, readable fonts (ages 5-18)
- Zero confusion navigation
- Cultural markers visible (pink, Nguzo Saba symbols)
- Clear next steps at every section

## Frontend File Structure
```
/src/
  /app/         # Pages and layouts
  /components/  # Reusable UI components
  /lib/         # Utility functions  
  /lib/api/     # API utility files for route integration 
  /types/       # TypeScript types  
```

## Backend API Routes → Frontend Integration

  ### User Management
  - `POST /api/v1/users/register` → Login/Signup
  page (`frontend/src/app/login/page.tsx`)
  - `GET /users/count` → Not integrated yet

  ### Events Management
  - `GET /api/v1/events` → Organizer Dashboard (`
  frontend/src/app/organizerDashboard/page.tsx`)
  - `GET /api/v1/events/{event_id}` → Organizer
  Dashboard - Event details view
  - `POST /api/v1/events` → Organizer Dashboard -
   Create event form
  - `PUT /api/v1/events/{event_id}` → Organizer
  Dashboard - Edit event
  - `DELETE /api/v1/events/{event_id}` →
  Organizer Dashboard - Delete event

  ### Event Registration
  - `GET /api/v1/users/{user_id}/events` →
  Student Dashboard
  (`frontend/src/app/StudentDashboard/page.tsx`)
  - Upcoming events section
  - `POST
  /api/v1/users/events/{event_id}/register` →
  Student Dashboard - Event registration
  - `DELETE /api/v1/users/events/{event_id}/regis
  ter/{user_id}` → Student Dashboard - Cancel
  registration
  - `GET
  /api/v1/users/events/{event_id}/registrations`
  → Organizer Dashboard - View event attendees

  ### Meetings/Scheduling
  - `POST /api/v1/meetings/schedule` → Volunteer
  Dashboard (`frontend/src/app/volunteerDashboard
  /page.tsx`) - Schedule mentor sessions

  ### Shop/Items System
  - ✅ `GET /api/v1/items` → Shop component
  (`frontend/src/components/Shop/Shop.tsx`) -
  Load available items
  -  `GET /api/v1/items/{item_id}` → Shop
  component - Item details
  -  `POST /api/v1/items` → Admin/Organizer
  Dashboard - Create shop items

  ### User Items (Inventory)
  - ✅ `GET /api/v1/users/{user_id}/items` → Shop
  component - User inventory
  - ✅`POST /api/v1/users/{user_id}/items/purchase`
   → Shop component - Purchase items
  - `PUT
  /api/v1/users/{user_id}/items/{item_id}/equip`
  → Student Dashboard - Equip/unequip items

  ### Modules (Learning Progress)
  - ✅`GET /api/v1/modules/user/{user_id}` →
  Student Dashboard - Course/module progress
  - `GET /api/v1/modules/{module_id}` →
  PathwayMap
  (`frontend/src/app/PathwayMap/page.tsx`) -
  Module details
  - `POST /api/v1/modules` → Organizer Dashboard
  - Create learning modules
  - ✅`PUT /api/v1/modules/{module_id}` →
  PathwayMap - Update module progress
  - `DELETE /api/v1/modules/{module_id}` →
  Organizer Dashboard - Delete modules

  ### Health Check
  - `GET /` → App initialization/health
  monitoring
  - `GET /health` → App health checks

  ### Not Yet Integrated
  - Donations page
  (`frontend/src/app/donations/page.tsx`) → No
  backend API routes yet (currently static page)