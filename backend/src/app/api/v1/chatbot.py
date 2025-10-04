import json 
import os
from pathlib import Path
from openai import OpenAI
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Initialize OpenAI client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

# Load MCP config with proper path resolution
MCP_CONFIG_PATH = Path(__file__).parent.parent.parent / "mcp" / "routes.mcp.json"
try:
    with open(MCP_CONFIG_PATH, "r") as f:
        MCP_CONFIG = json.load(f)
except FileNotFoundError:
    print(f"Warning: MCP config not found at {MCP_CONFIG_PATH}")
    MCP_CONFIG = {"routes": []}

def call_openai(prompt: str, history: list = []):
    """Call OpenAI API with MCP context"""
    messages = [
        {
            "role": "system",
            "content": f"You are a friendly and helpful chatbot with access to MCP tools: {json.dumps(MCP_CONFIG)}. Use this to interact with kids ranging from 5-17 to guide them educationally."
        }
    ] + history + [{"role": "user", "content": prompt}]
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.7,
    )
    return response.choices[0].message.content
class ChatRequest(BaseModel):
    message: str
    history: list = []


@router.post("/chat")
async def chat_endpoint(req: ChatRequest):
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
    
    try:
        ai_response = call_openai(req.message, req.history)
        return {"response": ai_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
