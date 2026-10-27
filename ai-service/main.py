from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil, os
from utils.parser import extract_text
from utils.skill_extractor import extract_skills
from utils.ats_scorer import calculate_ats_score

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "AI Service Running"}

@app.post("/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    job_skills: str = Form("")   # comma-separated list of job skills (optional)
):
    # Save uploaded file temporarily
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text from file
    text = extract_text(temp_path)

    # Clean up temp file
    os.remove(temp_path)

    if not text:
        return {"error": "Could not extract text from file"}

    # Analyze
    skills = extract_skills(text)
    job_skills_list = [s.strip() for s in job_skills.split(",")] if job_skills else None
    ats_score = calculate_ats_score(text, skills, job_skills_list)

    # Generate simple suggestions (you can improve this later)
    suggestions = []
    if len(text.split()) < 300:
        suggestions.append("Add more detail to your resume – aim for 300-800 words.")
    if len(skills) < 5:
        suggestions.append("List more relevant skills – both technical and soft.")

    return {
        "skills": skills,
        "ats_score": ats_score,
        "text_length": len(text.split()),
        "suggestions": suggestions
    }