import React from "react";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";
import {
  FaWhatsapp,
  FaInstagram,
  FaPhoneAlt,
  FaShieldAlt,
} from "react-icons/fa";

export function BackgroundBeamsWithCollisionDemo() {
  return (
    <BackgroundBeamsWithCollision className="flex items-center justify-center w-full min-h-screen">
      <div className="relative flex flex-col items-center justify-center w-full min-h-screen px-4 md:px-8 lg:px-16">
        {/* Contact Heading */}
        <h2
          className="relative z-20 text-center font-bold text-theme font-sans tracking-tight 
          text-3xl sm:text-4xl md:text-5xl lg:text-7xl leading-tight md:leading-[1.2]"
        >
          Contact Us
        </h2>

        {/* Instruction */}
        <p className="text-lg md:text-xl text-center text-theme-secondary mt-2">
          Reach out to us for any inquiries or support.
        </p>

        {/* Contact Options */}
        <div className="mt-6 flex flex-col items-center space-y-4 md:space-y-6">
          {/* WhatsApp */}
          <a
            href="https://wa.me/8263878470"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 text-xl md:text-2xl font-semibold bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            <FaWhatsapp size={24} />
            <span>WhatsApp</span>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/shree_thodsare_96k"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 text-xl md:text-2xl font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-6 py-3 rounded-lg hover:opacity-80 transition"
          >
            <FaInstagram size={24} />
            <span>Instagram</span>
          </a>

          {/* SafeV Website */}
          <a
            href="https://thodsareaditya@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 text-xl md:text-2xl font-semibold bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <FaShieldAlt size={24} />
            <span>SafeV Official</span>
          </a>

          {/* Phone Number */}
          <div className="flex items-center space-x-3 text-xl md:text-2xl font-semibold text-theme">
            <FaPhoneAlt size={24} />
            <span>+91 82638 78470</span>
          </div>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
