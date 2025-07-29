import React from 'react'
import dynamic from 'next/dynamic'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Card } from '@/components/ui/card'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account Settings - Massachusetts Climate Economy Assistant',
  description: 'Manage your account preferences, notification settings, and privacy options for the Massachusetts Climate Economy Assistant platform.',
  keywords: 'climate economy settings, Massachusetts clean energy preferences, account management, notification settings, privacy options'
};

const SettingsForm = dynamic(() => import('@/components/SettingsForm'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96 text-base text-moss-green/60">Loading Massachusetts Climate Economy settings...</div>
})

export default function Settings() {
  return (
    <div className="min-h-screen bg-sand-gray">
      {/* Header */}
      <Section className="py-12 bg-gradient-to-br from-spring-green/10 to-moss-green/10">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-midnight-forest mb-4">Account Settings</h1>
            <p className="text-lg text-moss-green">
              Customize your Massachusetts Climate Economy Assistant experience and manage your preferences
            </p>
          </div>
        </Container>
      </Section>

      {/* Settings Form */}
      <Section className="py-12">
        <Container className="space-y-8">
          <div className="grid grid-cols-1 gap-8">
            <Card className="bg-white shadow-md border-sand-gray">
              <div className="card-body">
                <SettingsForm />
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Settings Information */}
      <Section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-midnight-forest mb-6">Massachusetts Climate Economy Settings</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-sand-gray p-5 rounded-lg">
                  <h3 className="text-lg font-semibold text-midnight-forest mb-2">
                    Privacy & Data Management
                  </h3>
                  <p className="text-moss-green mb-3">
                    Control how your information is shared with Massachusetts clean energy employers and partners.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                      <span>Manage profile visibility to Massachusetts clean energy employers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                      <span>Control which Massachusetts organizations can contact you</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                      <span>Download or delete your personal data</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-sand-gray p-5 rounded-lg">
                  <h3 className="text-lg font-semibold text-midnight-forest mb-2">
                    Notification Preferences
                  </h3>
                  <p className="text-moss-green mb-3">
                    Customize alerts for Massachusetts clean energy job opportunities and events.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                      <span>Massachusetts clean energy job alerts by email or SMS</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                      <span>MassCEC program and funding opportunity notifications</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                      <span>Weekly Massachusetts climate economy digest</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-sand-gray p-5 rounded-lg">
                  <h3 className="text-lg font-semibold text-midnight-forest mb-2">
                    Massachusetts-Specific Settings
                  </h3>
                  <p className="text-moss-green mb-3">
                    Configure preferences specific to Massachusetts clean energy opportunities.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                      <span>Set Massachusetts regional preferences (Greater Boston, Western MA, etc.)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                      <span>Transportation and commuting preferences</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                      <span>Massachusetts veteran services and benefits eligibility</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-sand-gray p-5 rounded-lg">
                  <h3 className="text-lg font-semibold text-midnight-forest mb-2">
                    Accessibility Options
                  </h3>
                  <p className="text-moss-green mb-3">
                    Customize your experience to meet your accessibility needs.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                      <span>Screen reader compatibility settings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                      <span>Text size and contrast adjustments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                      <span>Motion sensitivity and animation preferences</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 p-5 bg-spring-green/10 rounded-lg">
              <h3 className="text-lg font-semibold text-midnight-forest mb-2">
                Massachusetts Climate Economy Data Privacy
              </h3>
              <p className="text-moss-green">
                The Alliance for Climate Transition (ACT) is committed to protecting your personal information. 
                We adhere to Massachusetts data privacy regulations and only share your information with 
                employers and partners with your explicit consent. You can review our complete 
                <a href="/privacy" className="text-spring-green hover:underline ml-1">Privacy Policy</a> and
                <a href="/terms" className="text-spring-green hover:underline ml-1">Terms of Service</a> for more details.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
} 