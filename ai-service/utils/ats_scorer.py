def calculate_ats_score(text, extracted_skills, job_skills=None):
    score = 0
    text_lower = text.lower()

    # Check for important sections (10 points each)
    sections = ['education', 'experience', 'skills', 'projects', 'contact']
    for section in sections:
        if section in text_lower:
            score += 10

    # Skill evaluation
    if job_skills:
        job_skills_lower = [s.lower() for s in job_skills]
        matched = [s for s in extracted_skills if s.lower() in job_skills_lower]
        if job_skills_lower:
            score += int((len(matched) / len(job_skills_lower)) * 30)
    else:
        score += min(20, len(extracted_skills) * 2)

    # Word count bonus
    word_count = len(text.split())
    if 300 <= word_count <= 800:
        score += 20
    elif 100 < word_count < 300:
        score += 10

    return min(100, score)