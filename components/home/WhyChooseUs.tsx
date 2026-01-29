"use client";

import {
  Shield,
  Clock,
  Percent,
  Users,
  RefreshCw,
  Headphones,
} from "lucide-react";

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  stat?: string;
}

const benefits: Benefit[] = [
  {
    icon: <Shield className="w-10 h-10" />,
    title: "100% Verified",
    description:
      "Every coupon is manually verified by our team to ensure it works when you need it.",
    stat: "10,000+",
  },
  {
    icon: <Clock className="w-10 h-10" />,
    title: "Daily Updates",
    description:
      "We refresh our database hourly with new deals, so you never miss an opportunity.",
    stat: "500+",
  },
  {
    icon: <Percent className="w-10 h-10" />,
    title: "Best Prices",
    description:
      "We negotiate exclusive deals you won't find anywhere else, guaranteed.",
    stat: "₹5Cr+",
  },
  {
    icon: <Users className="w-10 h-10" />,
    title: "Community",
    description:
      "Join 2M+ smart shoppers sharing deals and saving together every day.",
    stat: "2M+",
  },
  {
    icon: <RefreshCw className="w-10 h-10" />,
    title: "Easy Refunds",
    description:
      "Don't like a deal? Get a full refund within 24 hours, no questions asked.",
    stat: "100%",
  },
  {
    icon: <Headphones className="w-10 h-10" />,
    title: "24/7 Support",
    description:
      "Our dedicated team is always here to help you with any issues or questions.",
    stat: "24/7",
  },
];

const colors = [
  "from-blue-500 to-cyan-500",
  "from-orange-500 to-amber-500",
  "from-green-500 to-emerald-500",
  "from-purple-500 to-pink-500",
  "from-red-500 to-rose-500",
  "from-indigo-500 to-violet-500",
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-purple-600 bg-purple-100 rounded-full px-4 py-2 mb-4">
            ✨ Why CouponWala
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to helping you save money on every purchase. Here's
            what makes us different.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${colors[index]} flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
              >
                {benefit.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed mb-4">
                {benefit.description}
              </p>

              {/* Stat */}
              {benefit.stat && (
                <div className="text-center">
                  <span
                    className={`text-3xl font-bold bg-gradient-to-r ${colors[index]} bg-clip-text text-transparent`}
                  >
                    {benefit.stat}
                  </span>
                </div>
              )}

              {/* Decorative Element */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colors[index]} opacity-5 rounded-bl-full`}
              ></div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">10+</div>
                <div className="text-gray-400 text-sm">Years Experience</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-gray-400 text-sm">Partner Brands</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">50L+</div>
                <div className="text-gray-400 text-sm">Money Saved</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">4.9</div>
                <div className="text-gray-400 text-sm">User Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">
            What Our Users Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "Frequent Shopper",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                content:
                  "CouponWala has saved me over ₹10,000 in the last 6 months alone! The deals are always current and the verification team does a great job.",
              },
              {
                name: "Rahul Verma",
                role: "Tech Enthusiast",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                content:
                  "As someone who shops online frequently, CouponWala is my go-to for all electronics deals. Their Amazon and Flipkart coupons are always working!",
              },
              {
                name: "Anita Patel",
                role: "Foodie",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
                content:
                  "I love ordering food and CouponWala's Swiggy and Zomato coupons have been a lifesaver. The BOGO offers are absolutely amazing!",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
