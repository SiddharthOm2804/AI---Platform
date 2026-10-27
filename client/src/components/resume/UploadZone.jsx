import React from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2, FileCheck } from 'lucide-react';

export const UploadZone = ({ onUpload, uploading = false }) => {
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0 && !uploading) {
      onUpload(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition duration-200 flex flex-col items-center justify-center min-h-[220px] ${
        uploading
          ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20 cursor-wait'
          : isDragActive
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 scale-[1.01]'
          : isDragReject
          ? 'border-red-400 bg-red-50 dark:bg-red-950/20'
          : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900'
      }`}
    >
      <input {...getInputProps()} />

      {uploading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Analyzing your resume...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Extracting text, computing ATS score, detecting skills, and generating local vector embeddings.
          </p>
        </div>
      ) : isDragActive ? (
        <div className="flex flex-col items-center gap-2">
          <FileCheck className="w-12 h-12 text-indigo-500 animate-bounce" />
          <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">
            Drop your resume here to analyze!
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-500 border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Drag &amp; drop your resume
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              or click to browse — PDF or DOCX, max 5MB
            </p>
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            100% Private • Local Offline AI Processing
          </span>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
