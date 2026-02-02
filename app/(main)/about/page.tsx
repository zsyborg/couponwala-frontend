'use client';

import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Check, Target, Eye, Heart, Award, Users, Zap, Shield } from 'lucide-react';

export default function AboutPage() {
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
            About CouponWala
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            About Us
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            We're on a mission to help millions of shoppers save money on every purchase. 
            Discover who we are and why millions trust us for the best deals.
          </p>
        </div>
      </section>

      {/* Our Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <Card variant="bordered" className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Target className="w-7 h-7 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To empower every shopper with the best deals, coupons, and discounts, 
                making smart shopping accessible to everyone. We believe that everyone 
                deserves to save money without compromising on quality or choice.
              </p>
            </Card>

            {/* Vision */}
            <Card variant="bordered" className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-7 h-7 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To become the most trusted and preferred destination for deals and coupons 
                across India and beyond, creating a community of smart shoppers who never 
                pay full price again.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-orange-100 text-orange-600 hover:bg-orange-100">
              Our Journey
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Story
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              How we started and grew to become a trusted name in deals and discounts
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-600 leading-relaxed mb-6">
                CouponWala was founded with a simple yet powerful idea: everyone deserves 
                to save money on their purchases. What started as a small platform with 
                a handful of deals has grown into one of India's leading coupon and deal 
                aggregation platforms.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                We understand the joy of finding a great deal. Our team works tirelessly 
                to bring you verified coupons, exclusive offers, and flash sales from 
                hundreds of trusted brands across various categories.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we help millions of shoppers save crores of rupees every month. 
                Our commitment to quality, authenticity, and customer satisfaction remains 
                at the heart of everything we do.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">10M+</div>
                    <div className="text-gray-600">Happy Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">50K+</div>
                    <div className="text-gray-600">Active Deals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">1000+</div>
                    <div className="text-gray-600">Partner Stores</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">₹500Cr+</div>
                    <div className="text-gray-600">Savings Delivered</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-orange-100 text-orange-600 hover:bg-orange-100">
              Why CouponWala
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              What sets us apart and makes us the preferred choice for smart shoppers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Check className="w-6 h-6" />,
                title: "Verified Deals",
                description: "Every coupon and deal is manually verified to ensure it works"
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: "User-First Approach",
                description: "We prioritize user experience and satisfaction above all"
              },
              {
                icon: <Award className="w-6 h-6" />,
                title: "Top Brands",
                description: "Partnered with 1000+ trusted brands across all categories"
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Real-Time Updates",
                description: "Get instant alerts on new deals, flash sales, and price drops"
              }
            ].map((feature, index) => (
              <Card key={index} variant="bordered" className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <div className="text-orange-600">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-orange-100 text-orange-600 hover:bg-orange-100">
              Our Values
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What We Stand For
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Trust & Transparency",
                description: "We maintain complete transparency in all our deals and transactions, earning your trust every day."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Community First",
                description: "Our community of millions of smart shoppers helps each other find the best deals."
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Innovation",
                description: "We continuously innovate to bring you the best shopping experience and savings."
              }
            ].map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-white">{value.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join millions of smart shoppers who trust CouponWala for the best deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/offers">
              <button className="h-12 px-8 bg-white text-orange-600 hover:bg-gray-100 font-semibold rounded-xl shadow-lg transition-all duration-200">
                Browse Deals
              </button>
            </a>
            <a href="/contact">
              <button className="h-12 px-8 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl transition-all duration-200">
                Contact Us
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
