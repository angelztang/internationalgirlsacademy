from fastapi import APIRouter
from app.api.v1 import meetings

api_router = APIRouter()


@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}


# Include v1 routers
api_router.include_router(meetings.router, prefix="/meetings", tags=["meetings"])
