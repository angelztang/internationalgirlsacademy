from fastapi import APIRouter

api_router = APIRouter()


@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}


# Add more endpoints here as needed
