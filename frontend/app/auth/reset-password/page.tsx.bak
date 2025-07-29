'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  useEffect(() => {
    // This page is typically accessed via a link with a token in the URL
    // Supabase handles the token validation automatically when updateUser is called
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Your password has been reset successfully. You can now log in.');
      // setTimeout(() => {
      //   router.push('/auth/login');
      // }, 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center">Reset Password</h2>
          <form onSubmit={handleResetPassword}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                type="password"
                placeholder="new password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm New Password</span>
              </label>
              <input
                type="password"
                placeholder="confirm new password"
                className="input input-bordered"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Reset Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
