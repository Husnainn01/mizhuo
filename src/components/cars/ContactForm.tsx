'use client';

import { useState } from 'react';

interface ContactFormProps {
  carId: number | string;
  carName: string;
}

const ContactForm = ({ carId, carName }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in the ${carName}. Please contact me with more information.`
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: null, message: '' });
    
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          carId,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setFormStatus({
          type: 'success',
          message: 'Thank you! Your inquiry has been sent. We will contact you shortly.'
        });
        
        // Reset form after successful submission (except pre-filled message)
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: formData.message
        });
      } else {
        setFormStatus({
          type: 'error',
          message: data.error || 'Failed to submit inquiry. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setFormStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {formStatus.type === 'success' ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md mb-4">
          <p className="text-green-700">{formStatus.message}</p>
          <button 
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors"
            onClick={() => setFormStatus({ type: null, message: '' })}
          >
            Send Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {formStatus.type === 'error' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-2">
              <p className="text-red-600 text-sm">{formStatus.message}</p>
            </div>
          )}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
              Full Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-black/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
              Email Address*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-black/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your.email@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-black mb-1">
              Phone Number*
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-black/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-black mb-1">
              Message*
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-black/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your message here"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="consent"
              className="rounded text-red-600 focus:ring-red-500 mr-2"
              required
            />
            <label htmlFor="consent" className="text-xs text-black/70">
              I agree to be contacted regarding this inquiry
            </label>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-medium transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Sending...' : 'Send Inquiry'}
          </button>
          
          <p className="text-xs text-black/50 text-center mt-2">
            We respect your privacy and will not share your information with third parties.
          </p>
        </form>
      )}
      
      <div className="mt-6 border-t border-black/10 pt-4">
        <div className="flex items-center justify-center gap-3">
          <span className="text-sm text-black/70">Or contact us directly:</span>
          <a href="tel:+15551234567" className="text-blue-600 hover:text-blue-800">
            (555) 123-4567
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactForm; 