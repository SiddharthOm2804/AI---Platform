import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore.js';
import toast from 'react-hot-toast';

export const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await register(
      formData.name.trim(),
      formData.email.trim(),
      formData.password
    );

    if (res.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full mx-auto p-8 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 mx-auto flex items-center justify-center text-white shadow-md shadow-indigo-500/20 mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create your account
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Start preparing with custom offline AI models
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Alex Johnson"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white transition"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white transition"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 pr-11 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl py-3 mt-2 hover:shadow-lg hover:shadow-indigo-500/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Footer switch */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
