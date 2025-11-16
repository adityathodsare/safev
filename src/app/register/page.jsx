"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    road: "",
    landmark: "",
    query: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCountdown(5);

    // Start countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Fire and forget - call APIs without waiting
    fetch(
      "https://script.google.com/macros/s/AKfycbxFTNMjhPIDSpdu50_qk85gnegH4KH8-08pwYw35owxSsNC9wXAcHvgzc8bjIyYTP_C/exec",
      {
        method: "POST",
        body: JSON.stringify(formData),
      }
    ).catch(() => {}); // Ignore errors

    fetch(
      `https://safe-mails.zeabur.app/api/alerts/confirmation?recipients=${formData.email}`
    ).catch(() => {}); // Ignore errors

    // Redirect after exactly 5 seconds
    setTimeout(() => {
      clearInterval(countdownInterval);
      window.location.href = "/success";
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto text-center space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text">
            Registration Form
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Please fill in all required fields to continue
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden">
            {/* Form Content */}
            <div className="p-5 sm:p-8 lg:p-10">
              <div className="space-y-6 sm:space-y-8">
                {/* Personal Information Section */}
                <div className="space-y-4 sm:space-y-5">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-200 flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1">
                        First Name <span className="text-pink-400">*</span>
                      </label>
                      <input
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border border-zinc-700 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                        placeholder="Enter first name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-300">
                        Middle Name
                      </label>
                      <input
                        name="middleName"
                        type="text"
                        value={formData.middleName}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border border-zinc-700 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                        placeholder="Enter middle name"
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1">
                        Last Name <span className="text-pink-400">*</span>
                      </label>
                      <input
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border border-zinc-700 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4 sm:space-y-5">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-200 flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                    Contact Details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1">
                        Email Address <span className="text-pink-400">*</span>
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border border-zinc-700 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1">
                        Phone Number <span className="text-pink-400">*</span>
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border border-zinc-700 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-4 sm:space-y-5">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-200 flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                    Address Information
                  </h2>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1">
                        Address <span className="text-pink-400">*</span>
                      </label>
                      <input
                        name="address"
                        type="text"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border border-zinc-700 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                        placeholder="House/Flat No, Building Name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1">
                        Road / Street <span className="text-pink-400">*</span>
                      </label>
                      <input
                        name="road"
                        type="text"
                        required
                        value={formData.road}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border border-zinc-700 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                        placeholder="Street name, Area"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-300">
                        Landmark
                      </label>
                      <input
                        name="landmark"
                        type="text"
                        value={formData.landmark}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border border-zinc-700 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                        placeholder="Nearby landmark (optional)"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1">
                          City <span className="text-pink-400">*</span>
                        </label>
                        <input
                          name="city"
                          type="text"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border border-zinc-700 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                          placeholder="City"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1">
                          State <span className="text-pink-400">*</span>
                        </label>
                        <input
                          name="state"
                          type="text"
                          required
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border border-zinc-700 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                          placeholder="State"
                        />
                      </div>

                      <div className="space-y-2 col-span-2 sm:col-span-1">
                        <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1">
                          Pincode <span className="text-pink-400">*</span>
                        </label>
                        <input
                          name="pincode"
                          type="text"
                          required
                          value={formData.pincode}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border border-zinc-700 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                          placeholder="Pincode"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="space-y-4 sm:space-y-5">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-200 flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-cyan-500 to-teal-500 rounded-full"></div>
                    Additional Information
                  </h2>

                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-300">
                      Query / Message
                    </label>
                    <textarea
                      name="query"
                      value={formData.query}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border border-zinc-700 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none"
                      placeholder="Any additional information or queries (optional)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button Section */}
            <div className="px-5 sm:px-8 lg:px-10 pb-5 sm:pb-8 lg:pb-10">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Submit Registration"
                )}
              </button>

              <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                By submitting, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
