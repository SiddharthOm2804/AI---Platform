import api from './api.js';

export const uploadResume = (file, jobSkills = '') => {
  const formData = new FormData();
  formData.append('resume', file);
  if (jobSkills) {
    formData.append('jobSkills', jobSkills);
  }
  return api.post('/upload-resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getResume = () => {
  return api.get('/resume');
};

export const deleteResume = () => {
  return api.delete('/resume');
};

export default { uploadResume, getResume, deleteResume };
