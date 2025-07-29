'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface BookingFormProps {
  className?: string
}

export default function BookingForm({ className }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    date: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <div className={`max-w-md mx-auto p-6 bg-green-50 border border-green-200 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">Booking Request Submitted!</h3>
          <p className="text-green-600 mb-4">
            Thank you for your interest. We'll get back to you soon.
          </p>
          <button 
            onClick={() => {
              setSubmitted(false)
              setFormData({
                name: '',
                email: '',
                service: '',
                date: '',
                message: ''
              })
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`max-w-md mx-auto p-6 bg-white border border-sand-gray rounded-lg shadow-md ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-center text-midnight-forest">
        Book a Massachusetts Clean Energy Consultation
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-moss-green mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-sand-gray rounded-md focus:outline-none focus:ring-2 focus:ring-spring-green"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-moss-green mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-sand-gray rounded-md focus:outline-none focus:ring-2 focus:ring-spring-green"
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-medium text-moss-green mb-1">
            Consultation Type
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-sand-gray rounded-md focus:outline-none focus:ring-2 focus:ring-spring-green"
          >
            <option value="">Select a consultation type</option>
            <option value="career-transition">Career Transition Planning</option>
            <option value="job-search">Massachusetts Job Search Strategy</option>
            <option value="skills-assessment">Skills Assessment & Gap Analysis</option>
            <option value="training-consultation">MassCEC Training Programs</option>
            <option value="offshore-wind">Offshore Wind Career Pathways</option>
            <option value="energy-efficiency">Energy Efficiency Careers</option>
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-moss-green mb-1">
            Preferred Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-sand-gray rounded-md focus:outline-none focus:ring-2 focus:ring-spring-green"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-moss-green mb-1">
              Massachusetts Region
            </label>
            <select
              id="location"
              name="location"
              className="w-full px-3 py-2 border border-sand-gray rounded-md focus:outline-none focus:ring-2 focus:ring-spring-green"
            >
              <option value="">Select region</option>
              <option value="boston">Greater Boston</option>
              <option value="western">Western Massachusetts</option>
              <option value="central">Central Massachusetts</option>
              <option value="northeast">Northeast Massachusetts</option>
              <option value="southeast">Southeast & Cape</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="advisor" className="block text-sm font-medium text-moss-green mb-1">
              Preferred Advisor
            </label>
            <select
              id="advisor"
              name="advisor"
              className="w-full px-3 py-2 border border-sand-gray rounded-md focus:outline-none focus:ring-2 focus:ring-spring-green"
            >
              <option value="">No preference</option>
              <option value="sarah">Sarah Johnson</option>
              <option value="michael">Michael Chen</option>
              <option value="aisha">Aisha Rodriguez</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-moss-green mb-1">
            Career Goals & Questions
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-sand-gray rounded-md focus:outline-none focus:ring-2 focus:ring-spring-green"
            placeholder="Tell us about your Massachusetts clean energy career goals or specific questions..."
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="newsletter"
            name="newsletter"
            className="h-4 w-4 text-spring-green focus:ring-spring-green border-sand-gray rounded"
          />
          <label htmlFor="newsletter" className="ml-2 block text-sm text-moss-green">
            Subscribe to Massachusetts clean energy job alerts and events
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-moss-green text-white py-3 px-4 rounded-md hover:bg-midnight-forest focus:outline-none focus:ring-2 focus:ring-spring-green transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Schedule Your Consultation'}
        </button>
      </form>
      
      <p className="mt-4 text-xs text-center text-moss-green">
        By submitting this form, you agree to our <Link href="/privacy" className="text-spring-green hover:underline">Privacy Policy</Link> and <Link href="/terms" className="text-spring-green hover:underline">Terms of Service</Link>.
      </p>
    </div>
  )
} 