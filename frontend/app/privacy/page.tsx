import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Climate Economy Assistant',
  description: 'Learn how the Massachusetts Climate Economy Assistant protects your privacy and handles your personal information in compliance with state and federal laws.',
  keywords: 'privacy policy, data protection, GDPR compliance, Massachusetts privacy laws'
}

export default function Privacy() {
  return (
    <div className="min-h-screen bg-sand-gray">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="max-w-none">
          <h1 className="text-4xl font-bold text-midnight-forest mb-8">Privacy Policy</h1>
          <p className="text-moss-green mb-8">
            <strong>Last updated:</strong> July 8, 2025
          </p>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold text-midnight-forest mb-4">Information We Collect</h2>
            <p className="text-moss-green mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              upload your resume, or communicate with our support team. As a Massachusetts-focused platform, 
              we adhere to all applicable state privacy laws.
            </p>
            
            <h3 className="text-xl font-bold text-midnight-forest mb-2">Personal Information</h3>
            <ul className="list-disc list-inside text-moss-green mb-4 space-y-1">
              <li>Name and contact information</li>
              <li>Professional background and skills</li>
              <li>Resume and career preferences</li>
              <li>Massachusetts location information</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-bold text-midnight-forest mb-2">Usage Information</h3>
            <ul className="list-disc list-inside text-moss-green mb-4 space-y-1">
              <li>How you interact with our platform</li>
              <li>Chat conversations with our AI assistant</li>
              <li>Job search and application activity</li>
              <li>Massachusetts clean energy sector interests</li>
              <li>Device and browser information</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md mt-8">
            <h2 className="text-2xl font-bold text-midnight-forest mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-moss-green space-y-2">
              <li>Provide personalized Massachusetts clean energy career guidance and job matching</li>
              <li>Connect you with Massachusetts-based training and educational opportunities</li>
              <li>Improve our AI algorithms and platform features</li>
              <li>Communicate with you about your account and our services</li>
              <li>Ensure platform security and prevent fraud</li>
              <li>Comply with Massachusetts and federal legal obligations</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md mt-8">
            <h2 className="text-2xl font-bold text-midnight-forest mb-4">Information Sharing</h2>
            <p className="text-moss-green mb-4">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-moss-green space-y-2">
              <li>With your consent (e.g., when applying to jobs through our platform)</li>
              <li>With Massachusetts clean energy employers when you express interest</li>
              <li>With service providers who help us operate our platform</li>
              <li>With Massachusetts state agencies for workforce development purposes (with consent)</li>
              <li>To comply with legal requirements</li>
              <li>To protect our rights and the safety of our users</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md mt-8">
            <h2 className="text-2xl font-bold text-midnight-forest mb-4">Massachusetts Resident Rights</h2>
            <p className="text-moss-green mb-4">
              As a Massachusetts resident, you have the right to:
            </p>
            <ul className="list-disc list-inside text-moss-green space-y-2">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of your data</li>
              <li>Object to certain processing activities</li>
              <li>Additional rights under Massachusetts data privacy laws</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md mt-8">
            <h2 className="text-2xl font-bold text-midnight-forest mb-4">Contact Us</h2>
            <p className="text-moss-green">
              If you have questions about this Privacy Policy, please contact us at:
              <br />
              <strong>Email:</strong> privacy@climateeconomyassistant.com
              <br />
              <strong>Address:</strong> 444 Somerville Ave, Somerville, MA 02143
              <br />
              <strong>Phone:</strong> (617) 555-0123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 