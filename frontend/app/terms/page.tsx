import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Climate Economy Assistant',
  description: 'Terms and conditions for using the Climate Economy Assistant platform for Massachusetts clean energy career services.',
  keywords: 'terms of service, user agreement, platform terms, Massachusetts climate economy'
}

export default function Terms() {
  return (
    <div className="min-h-screen bg-sand-gray">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="max-w-none">
          <h1 className="text-4xl font-bold text-midnight-forest mb-8">Terms of Service</h1>
          <p className="text-moss-green mb-8">
            <strong>Last updated:</strong> January 1, 2025
          </p>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold text-midnight-forest mb-4">Acceptance of Terms</h2>
            <p className="text-moss-green">
              By accessing and using the Climate Economy Assistant platform, you accept and agree to be bound by the terms and provision of this agreement. These terms apply to all users of the Massachusetts Climate Economy Assistant service.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md mt-8">
            <h2 className="text-2xl font-bold text-midnight-forest mb-4">Use License</h2>
            <p className="text-moss-green mb-4">
              Permission is granted to temporarily use CEA for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-moss-green space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the platform</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md mt-8">
            <h2 className="text-2xl font-bold text-midnight-forest mb-4">User Accounts</h2>
            <p className="text-moss-green mb-4">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account. Massachusetts residents may have additional rights regarding their personal information under state law.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md mt-8">
            <h2 className="text-2xl font-bold text-midnight-forest mb-4">Prohibited Uses</h2>
            <p className="text-moss-green mb-4">
              You may not use our service:
            </p>
            <ul className="list-disc list-inside text-moss-green space-y-2">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md mt-8">
            <h2 className="text-2xl font-bold text-midnight-forest mb-4">Massachusetts-Specific Terms</h2>
            <p className="text-moss-green mb-4">
              The Climate Economy Assistant is designed specifically for Massachusetts residents and employers. While anyone may access general information, certain features and services are optimized for and may be limited to Massachusetts users. All services comply with Massachusetts state laws and regulations.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md mt-8">
            <h2 className="text-2xl font-bold text-midnight-forest mb-4">Disclaimer</h2>
            <p className="text-moss-green">
              The information on this platform is provided on an 'as is' basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms related to our platform and the use of this platform. Job market data and career information are provided for informational purposes only.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md mt-8">
            <h2 className="text-2xl font-bold text-midnight-forest mb-4">Contact Information</h2>
            <p className="text-moss-green">
              If you have any questions about these Terms of Service, please contact us at:
              <br />
              <strong>Email:</strong> legal@climateeconomyassistant.com
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