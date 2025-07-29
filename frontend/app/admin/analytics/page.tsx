'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AdminAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        setError(userError.message);
      } else if (user) {
        const { error: profileError } = await supabase
          .from('consolidated_profiles')
          .select('full_name')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          setError(profileError.message);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Site Usage Statistics */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Site Usage</h2>
            <p>Overview of user activity and traffic.</p>
            <div className="card-actions justify-end">
              <a href="#" className="btn btn-primary">View Details</a>
            </div>
          </div>
        </div>

        {/* Conversation Statistics */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Conversation Stats</h2>
            <p>Analyze chat interactions and agent performance.</p>
            <div className="card-actions justify-end">
              <a href="#" className="btn btn-primary">View Details</a>
            </div>
          </div>
        </div>

        {/* User Activity Logs */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">User Activity</h2>
            <p>Monitor user logins, profile updates, and actions.</p>
            <div className="card-actions justify-end">
              <a href="#" className="btn btn-primary">View Logs</a>
            </div>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Audit Logs</h2>
            <p>Review system-wide audit trails for compliance.</p>
            <div className="card-actions justify-end">
              <a href="#" className="btn btn-primary">View Audit</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
