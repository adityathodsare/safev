"use client";

import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaGlobe,
  FaExternalLinkAlt,
} from "react-icons/fa";

const TEAM = [
  {
    name: "Aditya Thodsare",
    role: "Team Lead",
    image: "/img/Screenshot 2024-11-03 102710.png",
    links: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/aditya-thodsare-475366289/",
        icon: FaLinkedin,
        color: "hover:text-sky-400 hover:border-sky-400/40",
      },
      {
        label: "GitHub",
        href: "https://github.com/adityathodsare",
        icon: FaGithub,
        color: "hover:text-purple-400 hover:border-purple-400/40",
      },
      {
        label: "Email",
        href: "mailto:thodsareaditya@gmail.com",
        icon: FaEnvelope,
        color: "hover:text-pink-400 hover:border-pink-400/40",
      },
      {
        label: "Portfolio",
        href: "https://adityathodsare.vercel.app",
        icon: FaGlobe,
        color: "hover:text-emerald-400 hover:border-emerald-400/40",
      },
      {
        label: "Contact",
        href: "/contact",
        icon: FaExternalLinkAlt,
        color: "hover:text-orange-400 hover:border-orange-400/40",
      },
    ],
  },
  {
    name: "Kirti Shelke",
    role: "Contributor",
    image: "/img/1.jpg",
    links: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/kirtishelke63",
        icon: FaLinkedin,
        color: "hover:text-sky-400 hover:border-sky-400/40",
      },
      {
        label: "Email",
        href: "mailto:kirtishelke3@gmail.com",
        icon: FaEnvelope,
        color: "hover:text-pink-400 hover:border-pink-400/40",
      },
    ],
  },
  {
    name: "Khushi Sharma",
    role: "Contributor",
    image: "/img/2.jpg",
    links: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/khushi22sharma",
        icon: FaLinkedin,
        color: "hover:text-sky-400 hover:border-sky-400/40",
      },
      {
        label: "Email",
        href: "mailto:iamkhushi2204@gmail.com",
        icon: FaEnvelope,
        color: "hover:text-pink-400 hover:border-pink-400/40",
      },
    ],
  },
];

function MemberCard({ member }) {
  const getHoverBg = (label) => {
    switch (label) {
      case "LinkedIn":
        return "hover:bg-sky-500/10 hover:border-sky-500/30";
      case "GitHub":
        return "hover:bg-purple-500/10 hover:border-purple-500/30";
      case "Email":
        return "hover:bg-pink-500/10 hover:border-pink-500/30";
      case "Portfolio":
        return "hover:bg-emerald-500/10 hover:border-emerald-500/30";
      case "Contact":
        return "hover:bg-orange-500/10 hover:border-orange-500/30";
      default:
        return "hover:bg-slate-100 dark:hover:bg-white/10";
    }
  };

  return (
    <section
  id="developed-by"
  className="relative overflow-hidden py-16 sm:py-24 border-t border-slate-200 dark:border-white/10 scroll-mt-20"
>
    <div className="group relative rounded-3xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] border border-slate-200/50 dark:border-white/[0.08] bg-white/50 dark:bg-slate-900/40 backdrop-blur-md">
      {/* Glow highlight effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Photo Container */}
        <div className="relative aspect-[4/5] overflow-hidden m-3 rounded-2xl">
          <img
            src={member.image}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 scale-100 group-hover:scale-105"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60" />
        </div>

        {/* Info & Links Container */}
        <div className="px-6 pb-6 pt-2 flex flex-col items-center justify-center text-center flex-grow">
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-800 dark:text-white group-hover:bg-gradient-to-r group-hover:from-sky-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {member.name}
          </h3>

          {member.links?.length > 0 && (
            <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
              {member.links.map((link) => {
                const Icon = link.icon;
                const external =
                  link.href.startsWith("http") || link.href.startsWith("mailto:");
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    title={link.label}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] text-slate-600 dark:text-slate-350 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 hover:shadow-md ${getHoverBg(
                      link.label
                    )} ${link.color}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
    </section>
  );
}

export default function DevelopedBy() {
  return (
    <section
      id="developed-by"
      className="relative overflow-hidden py-16 sm:py-24 border-t border-slate-200 dark:border-white/10"
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[700px] h-[500px] bg-gradient-to-br from-sky-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-sky-400/5 to-purple-600/5 rounded-full blur-2xl -top-32 -right-32 animate-spin-slow" />
        <div className="absolute w-[300px] h-[300px] bg-gradient-to-bl from-pink-400/5 to-amber-400/5 rounded-full blur-2xl -bottom-32 -left-32 animate-spin-slow" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card mb-5 backdrop-blur-sm">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <span className="text-[11px] font-semibold tracking-wide text-theme-secondary uppercase">
              Built with passion
            </span>
          </div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-theme-secondary mb-2">
            Developed By
          </p>
          <h2 className="section-heading mb-4">
            Team{" "}
            <span className="bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
              Nexagen
            </span>
          </h2>
          <p className="text-theme-secondary text-sm max-w-xl mx-auto">
            The minds behind SAFE-V — building safer roads through smart
            technology and collaborative innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {TEAM.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </section>
  );
}
