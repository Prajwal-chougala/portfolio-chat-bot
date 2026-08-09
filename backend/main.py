import os
import json
from dotenv import load_dotenv
from groq import Groq
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from pathlib import Path
from pypdf import PdfReader

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

class MatchResult(BaseModel):
    score: float
    details: dict

class Expericence(BaseModel):
    company: str | None = None
    role: str | None = None
    duration:str | None = None
    description: str | None = None
    skills_used: list[str] = []

class Resume(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    total_experience_year: float | None = None
    education: list[str] = []
    experience: list[Expericence] = []
    skills: list[str] = []
    certifications: list[str] = []
    projects: list[str] = []
    
resume_schema = Resume.model_json_schema()

class ChatRequest(BaseModel):
    question: str

def ask_candidate(question: str, resume: Resume):

    system_prompt = f"""
You are an AI assistant representing a job candidate.

Below is everything you know about the candidate.

{resume.model_dump_json(indent=2)}

Rules:

1. Answer only using this information,introduce your self as candidate's Assistant and do not use words like "from the resume" or "as per the resume" in your answer.

2. Never hallucinate.

3. If information is unavailable,
say in soft manner like "I don't have enough information to answer that."

"I don't have enough information to answer that."

4. Be professional.

5. Answer as if HR is interviewing this candidate.

6. If user aks usning abrevation understand and answer in full form.

"""

    stream = client.chat.completions.create(

        model = model,

        messages=[

            {
                "role":"system",
                "content":system_prompt
            },

            {
                "role":"user",
                "content":question
            }

        ],

        stream=True,

    )

    return stream

def parse_resume(resume_text):
    system_prompt = f"""
    You are an expert resume parser.

    Extract information from the resume based on its meaning,
    not only based on exact section headings.

    Different resumes may use different headings.

    For example:
    - Experience
    - Professional Experience
    - Work History
    - Employment
    - Internships

    These may all contain relevant experience.

    Skills may also appear in the skills section, work experience,
    internships or projects.

    Return ONLY valid JSON matching this schema:

    {resume_schema}

    Important rules:

    1. Do not invent information.
    2. If a value is not available, return null.
    3. If a list has no information, return an empty list.
    4. Include internships inside experiences.
    5. Extract skills mentioned across the entire resume.
    """

    user_prompt = f"""
    Analyse the following resume text:
    {resume_text}
    """

    message_system = {
        "role" : "system",
        "content" : system_prompt
    }

    message_user = {
        "role" : "user",
        "content" : user_prompt
    }

    response_format = {
        "type": "json_object"           
    }

    messages = [message_system,message_user]
    response = client.chat.completions.create(model=model, messages=messages, response_format=response_format)

    # read the json and convert it to pydantic model
    
    raw_json = response.choices[0].message.content
    resume_data = json.loads(raw_json)
    resume = Resume(**resume_data)
    
    return resume

def read_pdf(file_path):
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text


@app.get("/")
def health_check():
    return {"status": "ok"}


def generate_stream(user_message: str):
    resume_text = read_pdf(Path("my_resume.pdf"))
    resume = parse_resume(resume_text)
    stream = ask_candidate(user_message, resume)
    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            yield content


@app.post("/api/chat")
def chat(req: ChatRequest):
    
    return StreamingResponse(generate_stream(req.question), media_type="text/plain")
