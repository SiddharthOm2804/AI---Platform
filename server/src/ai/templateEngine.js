export const templateEngine = (prompt = '', opts = {}) => {
  const p = prompt.toLowerCase();

  if (p.includes('cover letter')) {
    return `Dear Hiring Manager,

I am writing to express my strong interest in the open position at your organization. With a solid foundation in software development, data structures, and hands-on project experience, I am confident in my ability to contribute meaningfully to your engineering team.

In my recent work, I have built reliable systems, collaborated on core development cycles, and applied best practices in clean code and testing. I look forward to discussing how my skills and background align with your company's goals.

Sincerely,
Candidate`;
  }

  if (p.includes('rewrite') || p.includes('bullet') || p.includes('improve')) {
    return `• Spearheaded the development of core software modules, resulting in a 25% improvement in processing latency.
• Architected RESTful microservices and integrated responsive frontend interfaces using modern web frameworks.
• Partnered cross-functionally with team members to deliver high-priority engineering milestones ahead of schedule.`;
  }

  if (p.includes('suggest') || p.includes('recommend') || p.includes('critique')) {
    return `1. Highlight measurable metrics (e.g., performance gains, user counts, latency reductions) for each project.
2. Align resume keywords closely with the specific role and technology stack in target job descriptions.
3. Keep formatting clean, scannable, and focused on your strongest achievements and modern technical skills.`;
  }

  return "Local AI is currently unavailable or offline. Here are general tips: Focus on strong action verbs, quantify your impact with percentages or metrics, and ensure your core skills match the position requirements.";
};

export default { templateEngine };
