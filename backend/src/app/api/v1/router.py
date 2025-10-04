from fastapi import APIRouter
from app.api.v1 import meetings, items, user_items, modules, events, event_registration, chatbot, users, availability

api_router = APIRouter()

# Include auth routes
api_router.include_router(users.router, prefix="/users", tags=["auth"])

# Include v1 routers
api_router.include_router(meetings.router, prefix="/meetings", tags=["meetings"])
api_router.include_router(items.router, prefix="/items", tags=["items"])
api_router.include_router(user_items.router, prefix="/users", tags=["user-items"])
api_router.include_router(modules.router, prefix="/modules", tags=["modules"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(event_registration.router, prefix="/users", tags=["event-registration"])
api_router.include_router(chatbot.router, prefix="/chatbot", tags=["chatbot"])
api_router.include_router(availability.router, prefix="/availability", tags=["availability"])