from fastapi import APIRouter
from app.api.v1 import meetings, items, user_items, modules

api_router = APIRouter()


@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}


# Include v1 routers
api_router.include_router(meetings.router, prefix="/meetings", tags=["meetings"])
api_router.include_router(items.router, prefix="/items", tags=["items"])
api_router.include_router(user_items.router, prefix="/users", tags=["users"])
api_router.include_router(modules.router, prefix="/modules", tags=["modules"])
