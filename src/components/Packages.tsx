"use client";

import { useState } from "react";

const Packages = () => {
  const [annualBilling, setAnnualBilling] = useState(false);

  const packages = [
    {
      name: "Basic",
      description: "Essential health monitoring for individuals",
      monthlyPrice: 3490,
      annualPrice: 34900,
      features: [
        "Basic health metrics monitoring",
        "Monthly health report",
        "Email support",
        "Mobile app access",
        "1 user profile",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Standard",
      description: "Comprehensive monitoring for health-conscious individuals",
      monthlyPrice: 6990,
      annualPrice: 69900,
      features: [
        "All Basic features",
        "Weekly health reports",
        "24/7 chat support",
        "Prescription management",
        "Up to 3 user profiles",
        "Integration with wearable devices",
      ],
      cta: "Get Started",
      popular: true,
    },
    {
      name: "Premium",
      description: "Complete health solution for families",
      monthlyPrice: 11900,
      annualPrice: 119000,
      features: [
        "All Standard features",
        "Daily health insights",
        "Priority 24/7 support",
        "Video consultations (2/month)",
        "Up to 5 user profiles",
        "Personalized health recommendations",
        "Family health dashboard",
      ],
      cta: "Get Started",
      popular: false,
    },
  ];

  return (
    <section id="packages" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Health Monitoring Packages
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose the perfect package that suits your health monitoring needs
          </p>

          <div className="mt-8 flex items-center justify-center">
            <span
              className={`mr-3 ${
                annualBilling ? "text-gray-500" : "text-gray-900 font-medium"
              }`}
            >
              Monthly
            </span>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                annualBilling ? "bg-primary" : "bg-gray-300"
              }`}
              onClick={() => setAnnualBilling(!annualBilling)}
              aria-label={`Switch to ${
                annualBilling ? "monthly" : "annual"
              } billing`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  annualBilling ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`ml-3 ${
                !annualBilling ? "text-gray-500" : "text-gray-900 font-medium"
              }`}
            >
              Annual{" "}
              <span className="text-green-500 text-sm font-medium">
                (Save 15%)
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative rounded-lg overflow-hidden border transform transition-all duration-300 hover:-translate-y-2 hover:shadow-custom-hover ${
                pkg.popular
                  ? "border-primary shadow-lg"
                  : "border-gray-200 shadow-md"
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {pkg.name}
                </h3>
                <p className="text-gray-600 mb-6 h-12">{pkg.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹
                    {annualBilling
                      ? pkg.annualPrice.toLocaleString()
                      : pkg.monthlyPrice.toLocaleString()}
                  </span>
                  <span className="text-gray-600 ml-2">
                    {annualBilling ? "/year" : "/month"}
                  </span>
                </div>
                <ul className="mb-8 space-y-4">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-secondary flex-shrink-0 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 px-4 rounded-md transition-all duration-300 font-medium ${
                    pkg.popular
                      ? "bg-primary text-white hover:bg-primary-dark hover:shadow-lg"
                      : "bg-white text-primary border border-primary hover:bg-primary hover:text-white hover:shadow-lg"
                  }`}
                >
                  {pkg.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Need a custom solution for your organization?
          </p>
          <button className="mt-4 px-6 py-2 bg-transparent border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-md">
            Contact Us for Enterprise Plans
          </button>
        </div>
      </div>
    </section>
  );
};

export default Packages;
