"use client";
import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";
import { Github, Linkedin, Briefcase } from "lucide-react";

export const AnimatedTooltip = ({
  items,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    role: string;
    skills: string[];
    image: string;
    links: {
      portfolio: string;
      github: string;
      linkedin: string;
    };
  }[];
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );
  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <>
      {items.map((item) => (
        <div
          className="-mr-4 relative group"
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2"
              >
                <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px" />
                <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px" />
                <div className="font-bold text-white relative z-30 text-base">
                  {item.name}
                </div>
                <div className="text-white text-xs">{item.designation}</div>
                <div className="text-white text-xs mb-2">{item.role}</div>
                <div className="text-white text-xs mb-2">
                  {item.skills.join(", ")}
                </div>
                <div className="flex gap-2 mt-1">
                  <a
                    href={item.links.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Briefcase className="w-3 h-3" />
                  </a>
                  <a
                    href={item.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="w-3 h-3" />
                  </a>
                  <a
                    href={item.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Linkedin className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <img
            onMouseMove={handleMouseMove}
            height={200}
            width={200}
            src={item.image}
            alt={item.name}
            className="object-cover !m-0 !p-0 object-top rounded-full h-27 w-27 border-4 group-hover:scale-110 group-hover:z-30 border-white relative transition duration-500"
          />
        </div>
      ))}
    </>
  );
};

// Example usage with updated data
export default function TeamTooltipDemo() {
  const teamMembers = [
    {
      id: 1,
      name: "Aditya Thodsare",
      designation: "Team Leader",
      role: "Full Stack Developer",
      skills: [
        "Full Stack Developer",
        "Java",
        "Spring Boot",
        "Event Driven Microservices",
        "Docker",
        "AWS",
        "React",
        "Next.js",
      ],
      image: "/img/3.jpg",
      links: {
        portfolio: "https://aditya-thodsare-portfolio.vercel.app/",
        github: "https://github.com/adityathodsare",
        linkedin:
          "https://https://www.linkedin.com/in/aditya-thodsare-475366289/",
      },
    },
    {
      id: 2,
      name: "Khushi Sharma",
      designation: "Frontend Developer",
      role: "UI/UX Developer",
      skills: [
        "SQL",
        "Figma",
        "UI/UX Developer",
        "Next.js",
        "React",
        "Tailwind CSS",
      ],
      image: "/img/2.jpg",
      links: {
        portfolio: "https://khushisharma.com",
        github: "https://github.com/khushisharma",
        linkedin: "https://linkedin.com/in/khushisharma",
      },
    },
    {
      id: 3,
      name: "Kirti Shelke",
      designation: "Full Stack & Hardware Engineer",
      role: "MERN Stack Developer",
      skills: [
        "PHP",
        "Java",
        "MERN Stack Developer",
        "Node.js",
        "Express",
        "React",
        "IoT",
        "ESP32",
      ],
      image: "/img/1.jpg",
      links: {
        portfolio: "https://kirtishelke.com",
        github: "https://github.com/kirtishelke",
        linkedin: "https://linkedin.com/in/kirtishelke",
      },
    },
  ];

  return (
    <div className="flex flex-row items-center justify-center w-full p-10 bg-black">
      <AnimatedTooltip items={teamMembers} />
    </div>
  );
}
