'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('Admin User');
  const [email, setEmail] = useState('admin@example.com');
  const [department, setDepartment] = useState('');
  const [canManageUsers, setCanManageUsers] = useState(false);
  const [canManageContent, setCanManageContent] = useState(false);
  const [canViewAnalytics, setCanViewAnalytics] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email || '');

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (profileError) {
          setError(profileError.message);
        } else if (profileData) {
          setFullName(profileData.full_name || '');
        }

        const { data: adminProfileData, error: adminProfileError } = await supabase
          .from('admin_profiles')
          .select('department, can_manage_users, can_manage_content, can_view_analytics')
          .eq('id', user.id)
          .single();

        if (adminProfileError) {
          setError(adminProfileError.message);
        } else if (adminProfileData) {
          setDepartment(adminProfileData.department || '');
          setCanManageUsers(adminProfileData.can_manage_users || false);
          setCanManageContent(adminProfileData.can_manage_content || false);
          setCanViewAnalytics(adminProfileData.can_view_analytics || false);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('User not logged in.');
      return;
    }

    // Update profiles table
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: fullName,
        email: email,
        profile_completed: true, // Mark profile as completed
        user_type: 'admin',
      }, { onConflict: 'id' });

    if (profileUpdateError) {
      setError(profileUpdateError.message);
      return;
    }

    // Update admin_profiles table
    const { error: adminProfileUpdateError } = await supabase
      .from('admin_profiles')
      .upsert({
        id: user.id,
        department: department,
        can_manage_users: canManageUsers,
        can_manage_content: canManageContent,
        can_view_analytics: canViewAnalytics,
        profile_completed: true, // Mark profile as completed
      }, { onConflict: 'id' });

    if (adminProfileUpdateError) {
      setError(adminProfileUpdateError.message);
      return;
    }

    setSuccess('Profile updated successfully!');
    router.push('/admin'); // Redirect to dashboard after saving
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-base-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Admin Profile</h1>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Department</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Operations, IT"
              className="input input-bordered"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Can Manage Users</span>
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={canManageUsers}
                onChange={(e) => setCanManageUsers(e.target.checked)}
              />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Can Manage Content</span>
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={canManageContent}
                onChange={(e) => setCanManageContent(e.target.checked)}
              />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Can View Analytics</span>
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={canViewAnalytics}
                onChange={(e) => setCanViewAnalytics(e.target.checked)}
              />
            </label>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              className={`btn btn-primary`}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
