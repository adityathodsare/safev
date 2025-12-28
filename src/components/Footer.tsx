"use client";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gray-900 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
              SAFEV
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm">
              Team NexaGen - A squad of sigma engineers (Khushi Bhau, Kirti
              Bhau, Aditya Bhau) building next-gen IoT vehicle safety solutions.
              Buy our product now and join the safety revolution!
            </p>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-900 hover:bg-blue-600 flex items-center justify-center text-gray-400 hover:text-white border border-gray-800 hover:border-blue-600 transition-all transform hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-900 hover:bg-blue-400 flex items-center justify-center text-gray-400 hover:text-white border border-gray-800 hover:border-blue-400 transition-all transform hover:scale-110"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-900 hover:bg-pink-600 flex items-center justify-center text-gray-400 hover:text-white border border-gray-800 hover:border-pink-600 transition-all transform hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/adityathodsare"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-900 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700 transition-all transform hover:scale-110"
                aria-label="GitHub"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/adityathodsare"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-900 hover:bg-blue-600 flex items-center justify-center text-gray-400 hover:text-white border border-gray-800 hover:border-blue-600 transition-all transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-6 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Quick Links
            </h2>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/buy"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  Buy Now
                </a>
              </li>
              <li>
                <a
                  href="/tracking"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  Track Data
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-6 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Features
            </h2>
            <ul className="space-y-3">
              <li className="text-gray-400 flex items-start gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Accident Detection
              </li>
              <li className="text-gray-400 flex items-start gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                GPS Tracking
              </li>
              <li className="text-gray-400 flex items-start gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Alcohol Detection
              </li>
              <li className="text-gray-400 flex items-start gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Gas Leak Alerts
              </li>
              <li className="text-gray-400 flex items-start gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Emergency Response
              </li>
              <li className="text-gray-400 flex items-start gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                24/7 Monitoring
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-6 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact Us
            </h2>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group">
                <FaMapMarkerAlt className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>
                  Pune, Maharashtra, India
                  <br />
                  PIN: 412216
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a
                  href="mailto:thodsareaditya@gmail.com"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  thodsareaditya@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <a
                  href="tel:+918263878470"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  +91 82638 78470
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-900">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
            <p className="flex items-center gap-2">
              <span>© {currentYear}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">
                Team NexaGen
              </span>
              <span>• All rights reserved</span>
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="/privacy"
                className="hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="hover:text-blue-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/sitemap"
                className="hover:text-blue-400 transition-colors"
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-blue-500/50 flex items-center justify-center transition-all transform hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </footer>
  );
}

export default Footer;
