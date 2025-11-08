from fastapi import FastAPI, HTTPException, status, Depends
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Numeric
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from typing import Optional, Generator
import os

# FastAPI app
app = FastAPI(title="User Registration API", version="1.0.0")

# Database setup
# Prefer a DATABASE_URL env var (for production/postgres). Otherwise fall back to a
# writable SQLite path. On serverless platforms like Vercel the project root
# may be read-only, so use /tmp which is writable for the function invocation.
DATABASE_URL = os.environ.get("DATABASE_URL")
if DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = DATABASE_URL
else:
    # Use a file in /tmp so serverless invocations can write the DB during runtime.
    tmp_path = os.environ.get("SQLITE_PATH", "/tmp/users.db")
    # If tmp_path is absolute (starts with /) then prefix will become sqlite:////abs/path
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{tmp_path}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    user_type = Column(String, nullable=False)
    gender = Column(String, nullable=True)
    experience_points = Column(Numeric, default=0)

# Pydantic Schemas
class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    user_type: str  # "student", "instructor", "admin"
    gender: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    user_type: str
    gender: Optional[str] = None
    experience_points: float

    class Config:
        from_attributes = True

# Database dependency
def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

# Create tables (guarded). On serverless platforms table creation may fail at import
# time; catch and log errors so the function can still start and return a helpful
# message instead of crashing Vercel invocation.
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    # Log the issue but don't re-raise so Vercel will return a 500 at invocation
    # rather than failing to deploy entirely. This makes debugging the runtime
    # easier from function logs.
    import sys, traceback
    print("Warning: failed to create database tables:", e, file=sys.stderr)
    traceback.print_exc()

# Helper functions
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

# API Endpoints
@app.get("/")
async def root():
    return {"message": "User Registration API", "docs": "/docs"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/users/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    
    # Check if user already exists
    if get_user_by_email(db, user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Hash password
    hashed_password = get_password_hash(user.password)
    
    # Create user
    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password=hashed_password,
        user_type=user.user_type,
        gender=user.gender,
        experience_points=0
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return UserResponse(
        id=db_user.id,
        first_name=db_user.first_name,
        last_name=db_user.last_name,
        email=db_user.email,
        user_type=db_user.user_type,
        gender=db_user.gender,
        experience_points=float(db_user.experience_points)
    )

@app.get("/users/count")
async def get_user_count(db: Session = Depends(get_db)):
    """Get total number of registered users"""
    count = db.query(User).count()
    return {"total_users": count}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
