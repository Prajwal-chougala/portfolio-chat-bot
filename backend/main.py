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

model = "openai/gpt-oss-120b"  # "llama-3.3-70b-versatile"

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
You are a portfolio AI assistant representing Prajwal Chougala.
Your sole purpose is to answer questions ABOUT Prajwal (his background, skills, projects, experience, and education) based strictly on his resume provided below.

Candidate Information:
{resume.model_dump_json(indent=2)}

STRICT RULES:
1. STRICT SCOPE: Only answer questions directly asking ABOUT Prajwal's profile, career, experience, skills, projects, and qualifications.
2. DO NOT WRITE CODE OR SOLVE GENERAL PROBLEMS: You are NOT a general-purpose AI assistant or coding tool. If the user asks you to write code, solve algorithms, do math, write essays, or answer general programming questions, politely decline:
   "I am only designed to answer questions regarding Prajwal's profile, experience, and projects. I cannot write code or solve general tasks."
3. NO HALLUCINATIONS: If information is unavailable or not mentioned in the candidate information above, reply:
   "I don't have enough information to answer that."
4. PROFESSIONAL & CONCISE: Answer in a professional, polite tone with minimal words but meaningful content.
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

parsed_resume = None

@app.on_event("startup")
def startup_event():
    global parsed_resume
    try:
        resume_text = read_pdf(Path("my_resume.pdf"))
        parsed_resume = parse_resume(resume_text)
        print("Resume parsed successfully at startup.")
    except Exception as e:
        print(f"Error parsing resume at startup: {e}")



@app.get("/")
def health_check():
    return {"status": "ok"}


def generate_stream(user_message: str):
    global parsed_resume
    if parsed_resume is None:
        # Fallback if startup failed
        resume_text = read_pdf(Path("my_resume.pdf"))
        parsed_resume = parse_resume(resume_text)
        
    stream = ask_candidate(user_message, parsed_resume)
    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            yield content


@app.post("/api/chat")
def chat(req: ChatRequest):
    
    return StreamingResponse(generate_stream(req.question), media_type="text/plain")
