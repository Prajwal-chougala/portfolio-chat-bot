import os
import json
from dotenv import load_dotenv
from groq import Groq
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

load_dotenv()
my_api_key = os.getenv("GROQ_API_KEY")
if not my_api_key:
    raise ValueError("GROQ_API_KEY not found in environment variables")
client = Groq(api_key=my_api_key)

model = "llama-3.3-70b-versatile"

app = FastAPI()

# CORS: allow your frontend domain to call this API.
# For local dev, "*" is fine. Before going live, replace with your real
# Vercel URL, e.g. ["https://your-portfolio.vercel.app"]
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_system_prompt():
    profile_path = os.path.join(os.path.dirname(__file__), "profile.json")
    with open(profile_path, "r", encoding="utf-8") as f:
        profile_data = json.load(f)
    return f"""You are Prajwal's portfolio assistant. Answer ONLY using the
JSON data provided below. Never invent skills, projects, dates, or experience not
listed here. If asked something not covered by this data, say you don't have that
information and suggest contacting Prajwal directly using the contact info in the profile.
Keep answers concise, professional, and conversational.

DATA:
{json.dumps(profile_data, indent=2)}

#IMPORTANT
-if user starts with greetings, then reply politely in short and ask for more details !!
-in case user ask about prajwal u must answer politely and make him intrested to work with !!

"""


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def health_check():
    return {"status": "ok"}


def generate_stream(user_message: str):
    stream = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": get_system_prompt()},
            {"role": "user", "content": user_message},
        ],
        temperature=0.2,
        max_tokens=500,
        stream=True,
    )
    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            yield content


@app.post("/api/chat")
def chat(req: ChatRequest):
    return StreamingResponse(generate_stream(req.message), media_type="text/plain")
