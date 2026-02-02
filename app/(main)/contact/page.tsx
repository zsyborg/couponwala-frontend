'use client';

import { useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, Send, MessageCircle, Headphones, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    addToast('success', 'Thank you! Your message has been sent successfully. We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">
            Get In Touch
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Have questions or need help? We're here for you! Reach out to us and we'll 
            get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl">
                <CardBody className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        error={errors.name}
                      />
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        error={errors.email}
                      />
                    </div>
                    
                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number (10 digits)"
                      error={errors.phone}
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        rows={5}
                        className={`w-full px-4 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 transition-colors resize-none ${
                          errors.message ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.message && <p className="mt-1.5 text-sm text-red-600">{errors.message}</p>}
                    </div>
                    
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-12"
                      isLoading={isSubmitting}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Cards */}
              <Card className="shadow-xl">
                <CardBody className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-0.5">Email Us</p>
                        <p className="text-gray-900 font-medium">support@couponwala.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-0.5">Call Us</p>
                        <p className="text-gray-900 font-medium">+91 98765 43210</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-0.5">Visit Us</p>
                        <p className="text-gray-900 font-medium">
                          123 Business Park, Sector 62<br />
                          Noida, Uttar Pradesh 201309<br />
                          India
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Business Hours */}
              <Card className="shadow-xl">
                <CardBody className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { day: 'Monday - Friday', time: '9:00 AM - 8:00 PM' },
                      { day: 'Saturday', time: '10:00 AM - 6:00 PM' },
                      { day: 'Sunday', time: 'Closed' }
                    ].map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-600">{schedule.day}</span>
                        <span className={`font-medium ${schedule.time === 'Closed' ? 'text-red-500' : 'text-gray-900'}`}>
                          {schedule.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Quick Support */}
              <Card className="shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardBody className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold">Need Quick Help?</h3>
                  </div>
                  <p className="text-white/90 mb-4">
                    Check our FAQ section or chat with our support team for instant assistance.
                  </p>
                  <Button
                    variant="secondary"
                    className="w-full bg-white text-orange-600 hover:bg-gray-100"
                  >
                    View FAQs
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-orange-100 text-orange-600 hover:bg-orange-100">
              Stay Connected
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Follow Us on Social Media
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest deals, offers, and news by following us on social media.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            {[
              { icon: <Facebook className="w-6 h-6" />, name: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700' },
              { icon: <Twitter className="w-6 h-6" />, name: 'Twitter', color: 'bg-sky-500 hover:bg-sky-600' },
              { icon: <Instagram className="w-6 h-6" />, name: 'Instagram', color: 'bg-pink-600 hover:bg-pink-700' },
              { icon: <Linkedin className="w-6 h-6" />, name: 'LinkedIn', color: 'bg-blue-700 hover:bg-blue-800' }
            ].map((social, index) => (
              <a
                key={index}
                href="#"
                className={`w-14 h-14 ${social.color} rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories / Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-600 hover:bg-green-100">
              Our Promise
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              We Value Your Feedback
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Every message matters to us. Here's what you can expect when you reach out:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Quick Response",
                description: "We respond to all inquiries within 24 hours on business days"
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Dedicated Support",
                description: "Our friendly team is here to help you with any questions"
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Continuous Improvement",
                description: "Your feedback helps us serve you better every day"
              }
            ].map((item, index) => (
              <Card key={index} variant="bordered" className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-green-600">{item.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
