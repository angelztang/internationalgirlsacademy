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

```

## Backend API Routes → Frontend Integration

### User Management (Authentication via Supabase)
- ✅ `POST /api/v1/users/register` → Supabase Auth in `frontend/src/app/signup.tsx`
- ✅ `POST /api/v1/users/login` → Supabase Auth in `frontend/src/app/login.tsx`
- ✅ `GET /api/v1/users/me` → Auth context and profile fetching

### Shop/Items System
- ✅ `GET /api/v1/items` → Shop component (`frontend/src/components/Shop/Shop.tsx`)
- ✅ `GET /api/v1/items/{item_id}` → Shop API utility (`frontend/src/lib/api/shop.ts`)
- `POST /api/v1/items`

### User Items (Inventory)
- ✅ `GET /api/v1/users/{user_id}/items` → Shop component (`frontend/src/components/Shop/Shop.tsx`)
- ✅ `POST /api/v1/users/{user_id}/items/purchase` → Shop component
- ✅ `PUT /api/v1/users/{user_id}/items/{item_id}/equip` → Shop API utility

### Modules (Learning Progress)
- ✅ `GET /api/v1/modules/user/{user_id}` → Student Dashboard & PathwayMap
- ✅ `GET /api/v1/modules/{module_id}` → Modules API utility (`frontend/src/lib/api/modules.ts`)
- ✅ `POST /api/v1/modules` → Modules API utility
- ✅ `PUT /api/v1/modules/{module_id}` → PathwayMap (`frontend/src/app/PathwayMap/page.tsx`)
- ✅ `DELETE /api/v1/modules/{module_id}` → Organizer dashboard 

### Meetings (Zoom Integration)
- ✅ `GET /api/v1/meetings` → Meetings page (`frontend/src/app/events/meetings/page.tsx`)
- ✅ `GET /api/v1/meetings/{meeting_id}` → Meetings page
- ✅ `POST /api/v1/meetings/create` → Meetings page
- ✅ `POST /api/v1/meetings/{meeting_id}/join` → ZoomMeeting component (`frontend/src/components/meetings/ZoomMeeting.tsx`)
- ✅ `PUT /api/v1/meetings/{meeting_id}/status` → Meetings API
- `POST /api/v1/meetings/schedule`

### Events Management
- ✅ `GET /api/v1/events` → Organizer Dashboard (`frontend/src/app/organizerDashboard.tsx`)
- ✅ `GET /api/v1/events/{event_id}` → Organizer Dashboard
- ✅ `POST /api/v1/events` → Organizer Dashboard
- ✅ `PUT /api/v1/events/{event_id}` → Organizer Dashboard
- ✅ `DELETE /api/v1/events/{event_id}` → Organizer Dashboard

### Event Registration
- `GET /api/v1/users/{user_id}/events`
- `POST /api/v1/users/events/{event_id}/register`
- `DELETE /api/v1/users/events/{event_id}/register/{user_id}`
- `GET /api/v1/users/events/{event_id}/registrations`

### Chatbot
- ✅ `POST /api/v1/chatbot/chat`

### Zoom
- `GET /api/v1/zoom/get_signature`

### Not Implemented in Backend
- Donations API (frontend page exists at `frontend/src/app/donations/page.tsx` but no backend routes)


# IGA Platform - Team 15

> Empowering girls ages 5-18 through STEM, financial literacy, and entrepreneurship

## 🌟 Project Overview

The IGA Platform is a comprehensive educational technology solution designed to connect, educate, and empower young girls worldwide. Built with modern web technologies, it provides mentorship matching, learning pathways, community engagement, and global connectivity spanning the United States, Ghana, Liberia, and Guyana.

## 🧠 Brainstorming Process & LLM Integration

### Initial Ideation with AI Assistance

Our development process was deeply integrated with Large Language Models (LLMs) from conception to implementation. Here's how we leveraged AI throughout our brainstorming and development journey:

#### 1. **Concept Development & User Journey Mapping**
- **Prompt Engineering**: We used LLMs to explore different user personas (students, mentors, parents, alumni) and their unique needs
- **Journey Visualization**: AI helped us map out complex user flows from onboarding through program completion
- **Feature Prioritization**: Used conversational AI to evaluate feature importance and technical feasibility

```
Example Prompt: "Help us design a user onboarding flow for girls aged 5-18 joining an educational mentorship platform. Consider different age groups, technical literacy levels, and cultural backgrounds."
```

#### 2. **Architecture & Technical Planning**
- **Technology Stack Selection**: LLMs helped evaluate trade-offs between different frameworks (Next.js vs. React, FastAPI vs. Django)
- **Database Schema Design**: AI-assisted in designing relational structures for users, programs, mentorship matching, and progress tracking
- **API Design Patterns**: Used LLMs to establish RESTful conventions and endpoint structures

#### 3. **UI/UX Design Philosophy**
- **Accessibility-First Design**: AI helped us consider users with different abilities and technical backgrounds
- **Cultural Sensitivity**: LLMs provided insights on creating inclusive interfaces for diverse global users
- **Age-Appropriate Design**: Leveraged AI to ensure interfaces work for both 5-year-olds and 18-year-olds

### LLM-Powered Development Features

#### 1. **Intelligent Chatbot (BusyBot 🤖)**
- **Implementation**: [`frontend/src/components/Busybot/ChatBot.tsx`](frontend/src/components/Busybot/ChatBot.tsx)
- **Backend Integration**: [`backend/src/app/api/v1/chatbot.py`](backend/src/app/api/v1/chatbot.py)
- **Purpose**: Provides contextual help throughout the learning journey
- **AI Model**: GPT-4o-mini with custom educational prompts

```typescript
// Example of our chatbot integration
const handleSend = async () => {
  const data = await apiClient.post<{ response: string }>('/chatbot/chat', {
    message: inputValue,
    history: messages.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    })),
  });
};
```

#### 2. **Code Generation & Documentation**
- **Component Generation**: Used LLMs to scaffold React components with TypeScript
- **API Documentation**: AI-generated comprehensive API documentation and integration guides
- **Test Case Creation**: Leveraged LLMs to create edge cases and comprehensive test suites

#### 3. **Content Creation & Localization**
- **Educational Content**: AI helped generate age-appropriate learning modules
- **Multi-language Support**: LLMs assisted in creating culturally appropriate content for different regions
- **Accessibility Text**: Generated alt-text and screen reader friendly descriptions

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **Animations**: Framer Motion
- **3D Graphics**: Three.js with React Three Fiber
- **State Management**: React Context + Local State

### Backend Stack
- **Framework**: FastAPI (Python)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: WebSocket connections
- **AI Integration**: OpenAI GPT-4o-mini
- **Video Conferencing**: Zoom SDK

### Key Features Developed with AI Assistance

#### 🌍 **Global Connectivity**
- Interactive 3D globe showing connections between US, Ghana, Liberia, and Guyana
- Real-time community statistics and engagement metrics

#### 🎓 **Learning Pathways**
- Personalized learning journeys based on Nguzo Saba principles
- Progress tracking with gamification elements
- AI-powered content recommendations

#### 🤝 **Mentorship Matching**
- Algorithm-based mentor-student pairing
- Availability scheduling and meeting coordination
- Progress tracking and feedback systems

#### 💬 **Community Features**
- Live chat during events and workshops
- Comment threads on learning modules
- Community recognition and achievement systems

## 🔄 LLM-Assisted Development Workflow

### 1. **Planning Phase**
```
Human: "We need to create a mentorship platform for young girls. What are the key features we should prioritize?"

AI: "Based on educational platform best practices, I recommend focusing on:
1. Safe, moderated communication channels
2. Progress tracking with age-appropriate gamification
3. Cultural sensitivity for global users
4. Accessibility features for different abilities..."
```

### 2. **Implementation Phase**
- **Code Reviews**: LLMs helped identify potential bugs and suggest optimizations
- **Documentation**: AI generated inline comments and README sections
- **Testing Strategies**: Created comprehensive test cases covering edge scenarios

### 3. **Refinement Phase**
- **User Experience**: AI helped identify friction points in user flows
- **Performance Optimization**: LLMs suggested caching strategies and bundle optimizations
- **Security Audits**: AI-assisted security review of authentication and data handling

## 📁 Project Structure

```
├── frontend/                 # Next.js React application
│   ├── src/app/             # App Router pages
│   ├── src/components/      # Reusable UI components
│   ├── src/lib/            # Utilities and API clients
│   └── src/context/        # React Context providers
├── backend/                 # FastAPI Python application
│   ├── src/app/api/        # API routes and endpoints
│   ├── src/app/core/       # Core configurations
│   ├── src/app/models/     # Database models
│   └── tests/              # Test suites
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Supabase account
- OpenAI API key (for BusyBot)

```

## 🎯 Key Learning Outcomes from LLM Integration

### What Worked Well
1. **Rapid Prototyping**: LLMs accelerated initial feature development by 3-4x
2. **Code Quality**: AI-assisted code reviews caught edge cases we might have missed
3. **Documentation**: Comprehensive documentation generated with minimal manual effort
4. **User Experience**: AI helped us consider accessibility and usability from day one

### Challenges & Solutions
1. **Over-reliance Risk**: We balanced AI suggestions with human judgment and domain expertise
2. **Context Limitations**: Broke down complex problems into smaller, AI-manageable chunks
3. **Code Consistency**: Established clear prompting patterns and coding standards

### Future LLM Integration Plans
- **Adaptive Learning**: AI-powered curriculum that adjusts to individual student progress
- **Automated Mentorship Matching**: Enhanced algorithms using NLP to match communication styles
- **Content Generation**: AI-created educational materials tailored to different cultural contexts

## 🌟 Impact & Vision

This platform represents more than just code—it's a bridge connecting young women across continents, powered by human creativity and AI efficiency. By leveraging LLMs throughout our development process, we've created a more thoughtful, accessible, and globally-minded educational platform.

Our AI-assisted approach enabled us to:
- Consider edge cases for users across different cultures and age groups
- Implement complex features like real-time mentorship matching
- Create intuitive interfaces that work for both 5-year-olds and 18-year-olds
- Build robust, scalable architecture from the ground up

## Contributions

- **Team**: Team 15
- **Platform**: IGA (International Girls Academy)
- **Mission**: Empowering girls worldwide through technology and mentorship

---