import spacy
from spacy.matcher import PhraseMatcher

# Load the large English model (already downloaded)
nlp = spacy.load("en_core_web_lg")

# A starter list of skills – you should expand this later
SKILLS_DB = [
    "python", "java", "javascript", "typescript", "react", "node.js", "express",
    "mongodb", "postgresql", "sql", "html", "css", "tailwind", "docker",
    "aws", "azure", "git", "machine learning", "deep learning", "tensorflow",
    "pytorch", "data analysis", "excel", "communication", "leadership",
    "project management", "agile", "scrum", "problem solving", "teamwork"
]

matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
patterns = [nlp.make_doc(skill) for skill in SKILLS_DB]
matcher.add("SKILLS", patterns)

def extract_skills(text):
    doc = nlp(text)
    matches = matcher(doc)
    skills = set()
    for match_id, start, end in matches:
        skills.add(doc[start:end].text.lower())
    return list(skills)