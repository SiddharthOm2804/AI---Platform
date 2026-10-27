import random
import numpy as np
import pandas as pd
from pathlib import Path

# Deterministic seed
random.seed(42)
np.random.seed(42)

def generate_resumes_csv(output_path: Path, n_rows: int = 800):
    rows = []
    
    roles = ['SDE', 'Frontend', 'Backend', 'Data', 'ML', 'DevOps']

    for _ in range(n_rows):
        word_count = int(np.random.randint(150, 901))
        section_count = int(np.random.randint(2, 7))
        skill_count = int(np.random.randint(2, 26))
        action_verb_count = int(np.random.randint(0, 16))
        quantified_count = int(np.random.randint(0, 11))
        
        has_contact = 1 if random.random() < 0.85 else 0
        has_projects = 1 if random.random() < 0.75 else 0
        has_experience = 1 if random.random() < 0.70 else 0
        
        skill_density = round((skill_count / word_count) * 100, 2)

        # Role heuristic correlation
        if skill_count >= 18 and has_experience == 1:
            role_label = 'SDE'
        elif skill_count >= 15 and quantified_count >= 5:
            role_label = 'ML'
        elif skill_density < 2.5 and section_count <= 4:
            role_label = 'Frontend'
        elif action_verb_count <= 4 and 6 <= skill_count <= 15:
            role_label = 'DevOps'
        elif skill_count >= 10 and has_projects == 1:
            role_label = 'Backend'
        else:
            role_label = 'Data'

        # Realistic ATS score formula
        base = 20
        score = (
            base
            + section_count * 6
            + min(skill_count, 15) * 1.5
            + min(action_verb_count, 8) * 2
            + min(quantified_count, 6) * 2
            + has_contact * 4
            + has_projects * 4
            + has_experience * 4
            + (8 if 300 <= word_count <= 800 else 0)
            + random.randint(-5, 5)
        )
        ats_score = int(np.clip(round(score), 0, 100))

        rows.append({
            'word_count': word_count,
            'section_count': section_count,
            'skill_count': skill_count,
            'action_verb_count': action_verb_count,
            'quantified_count': quantified_count,
            'has_contact': has_contact,
            'has_projects': has_projects,
            'has_experience': has_experience,
            'skill_density': skill_density,
            'role_label': role_label,
            'ats_score': ats_score,
        })

    df = pd.DataFrame(rows)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Generated resumes dataset at {output_path} with {len(df)} rows.")
    return df

def generate_interview_qa_csv(output_path: Path, n_rows: int = 400):
    technical_questions = [
        "Explain how indexing works in MongoDB and when you should use compound indexes.",
        "What are closures in JavaScript and how do they impact memory management?",
        "How would you design a rate limiter in a distributed microservices architecture?",
        "Explain the difference between optimistic and pessimistic locking in relational databases.",
        "What is the Event Loop in Node.js and how does it handle non-blocking asynchronous I/O?",
        "How does React reconciliation work under the hood with the Virtual DOM and Fiber tree?",
        "Explain the difference between process and thread, and how concurrency is achieved in Python vs Node.",
        "How would you optimize the performance of a high-traffic SQL database experiencing slow queries?"
    ]

    behavioral_questions = [
        "Tell me about a time you had a technical disagreement with a team member and how you resolved it.",
        "Describe a challenging project you worked on under a tight deadline.",
        "Tell me about a time you introduced a bug into production and how you handled the post-mortem.",
        "How do you prioritize competing tasks when multiple stakeholders require immediate deliverables?",
        "Describe an instance where you mentored a junior engineer or peer to achieve a milestone."
    ]

    hr_questions = [
        "Why are you interested in joining our engineering team and what motivates you?",
        "Where do you see your technical trajectory progressing over the next 3 to 5 years?",
        "How do you stay up-to-date with emerging technologies and industry best practices?",
        "What are your greatest professional strengths and an area you are actively working to improve?"
    ]

    rows = []
    categories = ['Technical', 'Behavioral', 'HR']

    for i in range(n_rows):
        category = random.choice(categories)
        if category == 'Technical':
            question = random.choice(technical_questions)
        elif category == 'Behavioral':
            question = random.choice(behavioral_questions)
        else:
            question = random.choice(hr_questions)

        quality_score = int(np.random.randint(0, 11))

        if quality_score <= 3:
            # Short, vague answer (< 40 words)
            answers_pool = [
                "I know about this concept. It is used in web development and helps things run faster. I have used it in a couple of college projects without any issues.",
                "It depends on the system. Usually you just configure the defaults or look up the documentation on Stack Overflow. It worked fine for my previous tasks.",
                "We had a disagreement and we just talked it out. Everyone agreed on the best approach and we finished the project on time without problems.",
                "I am passionate about technology and coding. I always wanted to work here because your products are well known and popular in the industry."
            ]
            answer = random.choice(answers_pool)
        elif 4 <= quality_score <= 6:
            # Moderate detail (60-120 words), generic examples
            answers_pool = [
                f"When working on {question.split()[0].lower()} problems, my approach is to analyze the requirements thoroughly. In a recent university project, we implemented this by breaking down the features into smaller components. We faced a few integration roadblocks, but by reviewing the logs and refactoring the logic, we were able to deliver the functionality successfully. It taught me the importance of planning ahead and maintaining code modularity.",
                "In my internship, we handled this challenge by following standard software engineering practices. We documented our technical trade-offs, conducted peer code reviews, and tested our changes in a staging environment before releasing to production. While we did not have automated metrics for everything, the solution met all user requirements and reduced reported customer tickets substantially over the sprint.",
                "Whenever I face a conflict or technical challenge, I focus on open communication and objective data. During our capstone project, two team members favored different frameworks. I created a comparison matrix evaluating maintainability, documentation, and library support, which allowed the team to reach an aligned consensus."
            ]
            answer = random.choice(answers_pool)
        else:
            # High quality (120-250 words), structured with STAR method and quantified impact
            answers_pool = [
                f"Regarding this scenario: In my previous engineering internship, our team faced a critical bottleneck where {question.split()[-1].replace('?', '')} was degrading overall latency. Situation: Our microservice was handling 2.5 million requests daily with p99 latency spiking to 850ms. Task: I was assigned to investigate root causes and refactor the architecture. Action: I profiled the system using distributed tracing, introduced in-memory Redis caching for hot query keys, and refactored our MongoDB compound indexing strategy. Furthermore, I set up automated unit and integration tests with Jest to prevent regressions. Result: We reduced p99 latency by 42% down to 180ms, reduced database CPU utilization from 78% to 32%, and saved approximately $1,200 monthly in infrastructure costs.",
                "To approach this systematically, I utilize the STAR framework. Situation: While architecting an enterprise web application, our frontend team struggled with state synchronization across complex asynchronous workflows. Task: My responsibility was to design a clean, maintainable state architecture that eliminated race conditions. Action: I evaluated Zustand versus Redux Toolkit, created an isolated proof-of-concept demonstrating atomic state updates, and held a technical walkthrough for the 6-person engineering squad. I also introduced automated linting rules and TypeScript strict typing to enforce consistency. Result: Engineering velocity increased by 28%, bug reports related to state mutation dropped to zero over the subsequent 4 sprints, and onboarding time for new developers was cut in half.",
                "Situation: During a major release cycle, our primary payment integration service experienced intermittent timeout failures impacting 4% of checkout attempts. Task: As on-call engineer, I had to identify the failure mode, remediate immediate customer impact, and execute a permanent architectural fix. Action: I immediately deployed a circuit breaker pattern with graceful exponential backoff, preventing cascading failure across the gateway. Afterward, I analyzed the telemetry logs, discovered third-party rate limits, and implemented an asynchronous message queue using BullMQ. Result: Payment transaction success rate stabilized at 99.98%, and our post-mortem analysis was adopted as a best-practice engineering standard across all internal services."
            ]
            answer = random.choice(answers_pool)

        rows.append({
            'question': question,
            'answer': answer,
            'quality_score': quality_score,
            'category': category
        })

    df = pd.DataFrame(rows)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Generated interview QA dataset at {output_path} with {len(df)} rows.")
    return df

if __name__ == '__main__':
    data_dir = Path(__file__).resolve().parent
    resumes_file = data_dir / 'resumes.csv'
    interview_file = data_dir / 'interview_qa.csv'

    generate_resumes_csv(resumes_file, 800)
    generate_interview_qa_csv(interview_file, 400)
    print("Synthetic data generation complete!")
