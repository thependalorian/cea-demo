/**
 * Profile Setup Page
 * 
 * Purpose: Allows new OAuth users to select their profile type after signup
 * Location: /app/profile/setup/page.tsx
 * Used by: New users after OAuth authentication
 */

import { Suspense } from 'react';
import ProfileTypeSelector from '@/components/ProfileTypeSelector';

export default function ProfileSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Suspense fallback={
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        }>
          <ProfileTypeSelector showSkip={true} />
        </Suspense>
      </div>
    </div>
  );
} 