"use client";
import React from "react";
import { AnimatedTooltip } from "../components/ui/animated-tooltip";
import { WavyBackground } from "../components/ui/wavy-background";

const people = [
  {
    id: 1,
    name: "Kirti Shelke",
    designation: "TE ENTC Student",
    role: "MERN Stack Developer",
    skills: ["PHP", "MERN Stack", "AWS", "Node.js", "React"],
    image: "/img/1.jpg",
    links: {
      portfolio: "https://kirtishelke.com", // Replace with actual URL
      github: "https://github.com/kirtishelke", // Replace with actual URL
      linkedin: "https://linkedin.com/in/kirtishelke", // Replace with actual URL
    },
  },
  {
    id: 2,
    name: "Aditya Thodsare",
    designation: "TE ENTC Student",
    role: "Full Stack Developer",
    skills: [
      "Spring Boot",
      "J2EE",
      "Microservices",
      "Next.js",
      "React",
      "Java",
      "Docker",
      "AWS",
    ],
    image: "/img/3.jpg",
    links: {
      portfolio: "https://adityathodsare.com", // Replace with actual URL
      github: "https://github.com/adityathodsare", // Replace with actual URL
      linkedin: "https://linkedin.com/in/adityathodsare", // Replace with actual URL
    },
  },
  {
    id: 3,
    name: "Khushi Sharma",
    designation: "TE ENTC Student",
    role: "UI/UX Designer & Developer",
    skills: ["Figma", "UI/UX", "SQL", "React"],
    image: "/img/2.jpg",
    links: {
      portfolio: "https://khushisharma.com", // Replace with actual URL
      github: "https://github.com/khushisharma", // Replace with actual URL
      linkedin: "https://linkedin.com/in/khushisharma", // Replace with actual URL
    },
  },
];

export function TeamMates() {
  return (
    <div className="w-full px-4">
      <div className="text-gray-100 text-4xl font-extrabold text-center mt-10 mb-6">
        Team NexaGen
      </div>
      <div className="flex flex-row items-center justify-center mb-10 w-full">
        <AnimatedTooltip items={people} />
      </div>
    </div>
  );
}
