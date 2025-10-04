import time, jwt
from fastapi import FastAPI

app = FastAPI()

SDK_KEY = process.env.ZOOM_SDK_KEY
SDK_SECRET = process.env.ZOOM_SDK_SECRET


@app.get("/get_signature")
def get_signature(meeting_number: str, role: int):
    payload = {
        "sdkKey": SDK_KEY,
        "mn": meeting_number,
        "role": role,  # 0 = participant, 1 = host
        "iat": int(time.time()),
        "exp": int(time.time()) + 60 * 60,
        "appKey": SDK_KEY,
        "tokenExp": int(time.time()) + 60 * 60
    }
    token = jwt.encode(payload, SDK_SECRET, algorithm="HS256")
    return {"signature": token}
