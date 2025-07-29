'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'

const SignOutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleSignOut = async () => {
      await supabase.auth.signOut();
      // router.push('/auth/login')
    };

    handleSignOut();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center">Signing Out...</h2>
          <p className="text-center">Please wait while we log you out.</p>
        </div>
      </div>
    </div>
  );
};

export default SignOutPage;
