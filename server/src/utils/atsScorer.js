import { SKILLS_DB, ACTION_VERBS } from './skillsDB.js';

export const extractSkills = (text = '') => {
  if (!text) return [];
  const lowerText = text.toLowerCase();

  const matched = new Set();
  for (const skill of SKILLS_DB) {
    // For single/two-letter skills like 'c', use word boundaries
    if (skill.length <= 2) {
      const regex = new RegExp(`\\b${skill.replace(/[+]/g, '\\+')}\\b`, 'i');
      if (regex.test(lowerText)) {
        matched.add(skill);
      }
    } else {
      if (lowerText.includes(skill)) {
        matched.add(skill);
      }
    }
  }

  return Array.from(matched).sort();
};

export const calculateATSScore = (text = '', skills = [], jobSkills = []) => {
  if (!text) return 0;

  const lowerText = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 1. Sections presence
  const sections = ['education', 'experience', 'skills', 'projects', 'contact'];
  let sectionScore = 0;
  const sectionWeight = jobSkills.length > 0 ? 8 : 10; // max 40 if jobSkills provided, else max 50

  for (const sec of sections) {
    if (lowerText.includes(sec)) {
      sectionScore += sectionWeight;
    }
  }

  // 2. Skill bonus or Job Skills overlap
  let skillBonus = 0;
  if (jobSkills.length > 0) {
    const cleanJobSkills = jobSkills.map((s) => s.trim().toLowerCase()).filter(Boolean);
    if (cleanJobSkills.length > 0) {
      const overlap = cleanJobSkills.filter((s) => skills.includes(s));
      const overlapPercent = overlap.length / cleanJobSkills.length;
      skillBonus = Math.min(30, Math.round(overlapPercent * 30));
    } else {
      skillBonus = Math.min(20, skills.length * 2);
    }
  } else {
    skillBonus = Math.min(20, skills.length * 2);
  }

  // 3. Word count bonus (max 20)
  let wordCountBonus = 0;
  if (wordCount >= 300 && wordCount <= 800) {
    wordCountBonus = 20;
  } else if (wordCount >= 100 && wordCount < 300) {
    wordCountBonus = 10;
  } else if (wordCount > 800 && wordCount <= 1200) {
    wordCountBonus = 10;
  }

  // 4. Action verbs bonus (max 10)
  const matchedVerbs = ACTION_VERBS.filter((verb) => lowerText.includes(verb));
  const verbBonus = Math.min(10, matchedVerbs.length);

  const total = sectionScore + skillBonus + wordCountBonus + verbBonus;
  return Math.min(100, Math.max(0, Math.round(total)));
};

export const generateSuggestions = (text = '', skills = []) => {
  const suggestions = [];
  if (!text) {
    return ['Upload a resume with readable text.'];
  }

  const lowerText = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount < 300) {
    suggestions.push('Add more detail – aim for 300-800 words');
  } else if (wordCount > 800) {
    suggestions.push('Trim to under 800 words for better readability');
  }

  if (!lowerText.includes('projects')) {
    suggestions.push('Add a Projects section with 2-3 relevant projects');
  }

  if (!lowerText.includes('experience') && !lowerText.includes('internship') && !lowerText.includes('employment')) {
    suggestions.push('Add an Experience or Internship section');
  }

  if (skills.length < 5) {
    suggestions.push('List more relevant technical skills');
  }

  const matchedVerbs = ACTION_VERBS.filter((verb) => lowerText.includes(verb));
  if (matchedVerbs.length < 3) {
    suggestions.push('Start bullet points with strong action verbs (built, designed, led)');
  }

  // Check for numbers or percentages (e.g. 30%, $10k, 500+)
  const hasQuantified = /\b\d+(?:[%kK+]|\s*(?:percent|users|ms|s|x|times))\b|\b\d{2,}\b/.test(text);
  if (!hasQuantified) {
    suggestions.push("Quantify achievements (e.g., 'improved performance by 30%')");
  }

  return suggestions;
};

export default { extractSkills, calculateATSScore, generateSuggestions };
