'use strict';
'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/admin/dashboard';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Invalid credentials.');
      }

      // Redirect on success
      router.push(redirectTarget);
      router.refresh();
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-white border border-brand-border p-8 max-w-md w-full rounded-none">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold tracking-tight text-brand-dark">
          ADMINISTRATOR LOGIN
        </h2>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">
          Secure Access Portal
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 text-xs text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1 font-mono">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
            className="flat-input text-sm"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1 font-mono">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            className="flat-input text-sm"
            placeholder="Enter password"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full flat-btn-dark tracking-wider text-xs ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'LOGGING IN...' : 'LOG IN'}
          </button>
        </div>
      </form>

      <div className="text-center mt-6 pt-6 border-t border-brand-border">
        <Link href="/" className="text-xs text-brand-blue hover:underline">
          &larr; Return to Event Homepage
        </Link>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-light">
      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <Suspense fallback={
          <div className="text-center p-8 bg-brand-white border border-brand-border max-w-md w-full">
            <p className="text-slate-500 font-semibold text-sm">Loading login portal...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark text-slate-500 py-6 px-4 text-center text-xs border-t border-slate-800">
        <p>&copy; 2026 Matias Fun Run. Admin Access Only.</p>
      </footer>
    </div>
  );
}
