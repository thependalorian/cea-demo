'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export default function Pricing() {
  const [pricingPeriod, setPricingPeriod] = useState<'monthly' | 'annual'>('monthly')
  
  // Price calculation helper
  const getPrice = (monthlyPrice: number) => {
    if (pricingPeriod === 'annual') {
      return Math.floor(monthlyPrice * 0.8); // 20% discount for annual
    }
    return monthlyPrice;
  }
  
  // Pricing period display
  const getPeriodSuffix = () => pricingPeriod === 'annual' ? '/month (billed annually)' : '/month';
  
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <Section className="py-20 bg-gradient-to-br from-spring-green-50 to-moss-green-50/30 animate-gentle-breathe">
        <Container className="max-w-4xl text-center">
          <h1 className="text-5xl font-title font-bold mb-6">
            Massachusetts Clean Energy
            <span className="text-spring-green"> Pricing</span>
          </h1>
          <p className="text-xl text-moss-green-700 mb-8">
            Choose the plan that fits your needs in the Commonwealth's growing climate economy.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <div className="tabs tabs-boxed bg-white border border-spring-green-100">
              <a 
                className={`tab cursor-pointer ${pricingPeriod === 'monthly' ? 'bg-spring-green text-midnight-forest' : 'text-moss-green-600 hover:text-midnight-forest'}`}
                onClick={() => setPricingPeriod('monthly')}
              >
                Monthly
              </a>
              <a 
                className={`tab cursor-pointer ${pricingPeriod === 'annual' ? 'bg-spring-green text-midnight-forest' : 'text-moss-green-600 hover:text-midnight-forest'}`}
                onClick={() => setPricingPeriod('annual')}
              >
                Annual (Save 20%)
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* User Pricing Cards */}
      <Section className="py-20">
        <Container>
        <h2 className="text-3xl font-bold text-center mb-4">For Massachusetts Job Seekers</h2>
        <p className="text-center text-moss-green-600 mb-12 max-w-3xl mx-auto">
          Unlock your potential in the Commonwealth's fastest-growing industry with our specialized pricing tiers.
        </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="bg-white shadow-lg border border-spring-green-50">
              <div className="p-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Free</h3>
                  <div className="text-5xl font-bold mb-4">$0<span className="text-lg font-normal text-moss-green-600">{getPeriodSuffix()}</span></div>
                  <p className="text-moss-green-700 mb-6">Perfect for getting started in Massachusetts</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">Basic AI career guidance</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">Resume analysis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">5 job matches per month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">Massachusetts clean energy job board</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">MassCEC resource access</span>
                  </li>
                </ul>
                <Link href="/auth/signup" legacyBehavior>
                  <a className="w-full transform transition-all duration-250 hover:scale-[1.02] active:scale-[0.98] btn btn-outline">
                  Get Started Free
                  </a>
                </Link>
              </div>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-spring-green-500 text-midnight-forest shadow-lg border-2 border-spring-green-600 relative transform hover:scale-[1.02] transition-all duration-250">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge variant="secondary" className="bg-moss-green-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                  Most Popular
                </Badge>
              </div>
              <div className="p-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <div className="text-5xl font-bold mb-4">${getPrice(29)}<span className="text-lg font-normal opacity-70">{getPeriodSuffix()}</span></div>
                  <p className="opacity-80 mb-6">For serious Massachusetts job seekers</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-midnight-forest" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-midnight-forest" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Advanced AI career coaching</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-midnight-forest" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Massachusetts-specific skill analysis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-midnight-forest" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Unlimited job matches</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-midnight-forest" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>1 free expert consultation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-midnight-forest" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Custom MA clean energy resume</span>
                  </li>
                </ul>
                <Link href={`/auth/signup?plan=pro&billing=${pricingPeriod}`} legacyBehavior>
                  <a className="w-full shadow-button hover:shadow-hover transform transition-all duration-250 hover:scale-[1.02] active:scale-[0.98] btn">
                  Get Pro Access
                  </a>
                </Link>
              </div>
            </Card>

            {/* Premium Plan */}
            <Card className="bg-white shadow-lg border border-spring-green-50">
              <div className="p-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Premium</h3>
                  <div className="text-5xl font-bold mb-4">${getPrice(79)}<span className="text-lg font-normal text-moss-green-600">{getPeriodSuffix()}</span></div>
                  <p className="text-moss-green-700 mb-6">For Massachusetts career changers</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">Priority job matching</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">4 expert consultations/month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">Full portfolio development</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">MA clean energy industry contacts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">MassCEC certification guidance</span>
                  </li>
                </ul>
                <Link href="/auth/signup?plan=premium" legacyBehavior>
                  <a className="w-full transform transition-all duration-250 hover:scale-[1.02] active:scale-[0.98] btn btn-outline">
                  Get Premium Access
                  </a>
                </Link>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Partner Pricing */}
      <Section className="py-20 bg-moss-green-50">
        <Container>
          <h2 className="text-3xl font-bold text-center mb-4">For Massachusetts Clean Energy Partners</h2>
          <p className="text-center text-moss-green-700 mb-12 max-w-3xl mx-auto">
            Connect with qualified talent and grow Massachusetts' clean energy workforce.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white shadow-lg">
              <div className="p-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Standard Partner</h3>
                  <div className="text-5xl font-bold mb-4">$299<span className="text-lg font-normal text-moss-green-600">/month</span></div>
                  <p className="text-moss-green-700 mb-6">For Massachusetts clean energy employers</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">10 job postings/month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">AI candidate matching</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">Massachusetts workforce analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">Company profile in ACT directory</span>
                  </li>
                </ul>
                <Link href="/auth/signup?type=partner" legacyBehavior>
                  <a className="w-full transform transition-all duration-250 hover:scale-[1.02] active:scale-[0.98] btn btn-outline">
                  Become a Partner
                  </a>
                </Link>
              </div>
            </Card>

            <Card className="bg-white shadow-lg">
              <div className="p-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Enterprise Partner</h3>
                  <div className="text-5xl font-bold mb-4">Custom</div>
                  <p className="text-moss-green-700 mb-6">For major Massachusetts employers</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">Unlimited job postings</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">Custom recruiting solutions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">Dedicated MA workforce specialist</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">MassCEC partnership opportunities</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-spring-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-midnight-forest">Custom branding and integration</span>
                  </li>
                </ul>
                <Link href="/contact?subject=Enterprise" legacyBehavior>
                  <a className="w-full shadow-button hover:shadow-hover transform transition-all duration-250 hover:scale-[1.02] active:scale-[0.98] btn">
                  Contact Sales
                  </a>
                </Link>
              </div>
            </Card>
          </div>
        </Container>
      </Section>
      
      {/* CTA Section */}
      <Section className="py-20 bg-gradient-to-br from-spring-green-50 to-moss-green-50/30 animate-gentle-breathe">
        <Container className="max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-title font-bold mb-6">
            Ready to Join Massachusetts' Clean Energy Future?
          </h2>
          <p className="text-xl text-moss-green-800 mb-8">
            Start today with our free trial and begin connecting with Massachusetts' growing clean energy ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" legacyBehavior>
              <a className="btn btn-primary text-midnight-forest btn-lg shadow-button hover:shadow-hover transform transition-all duration-250 hover:scale-[1.02] active:scale-[0.98]">
              Start Your Free Trial
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              </a>
            </Link>
            <Link href="/contact" legacyBehavior>
              <a className="btn btn-outline border-moss-green text-moss-green hover:bg-moss-green hover:text-white btn-lg transform transition-all duration-250 hover:scale-[1.02] active:scale-[0.98]">
              Contact Sales
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              </a>
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  )
} 