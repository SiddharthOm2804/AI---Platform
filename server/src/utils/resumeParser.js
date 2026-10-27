import fs from 'fs/promises';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

export const extractText = async (filePath, mimetype) => {
  try {
    if (mimetype === 'application/pdf' || filePath.toLowerCase().endsWith('.pdf')) {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);
      return data && data.text ? data.text.trim() : null;
    }

    if (
      (mimetype && mimetype.includes('wordprocessingml')) ||
      filePath.toLowerCase().endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      return result && result.value ? result.value.trim() : null;
    }

    console.warn(`Unsupported mimetype for text extraction: ${mimetype} (${filePath})`);
    return null;
  } catch (error) {
    console.error(`Error extracting text from ${filePath}:`, error.message);
    return null;
  }
};

export default { extractText };
