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
    name: "Khushi Yogesh Sharma",
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
  const isLead = member.role === "Team Lead";

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 ${
        isLead
          ? "ring-1 ring-sky-500/30 shadow-xl shadow-sky-500/10"
          : "hover:shadow-2xl"
      }`}
    >
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-sky-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 transition-all duration-700 pointer-events-none z-0" />
      <div className="absolute inset-px rounded-2xl bg-white dark:bg-slate-900/90 backdrop-blur-sm z-0" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={member.image}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
          {isLead && (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/90 text-white shadow-lg backdrop-blur-sm">
              Team Lead
            </span>
          )}
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-base sm:text-lg font-extrabold text-white tracking-tight drop-shadow-md">
              {member.name}
            </p>
            <p className="text-[10px] text-white/70 tracking-[0.14em] uppercase mt-0.5">
              {member.role}
            </p>
          </div>
        </div>

        {member.links?.length > 0 && (
          <div className="p-4 flex flex-wrap gap-2 border-t border-slate-200/50 dark:border-white/10 bg-white/30 dark:bg-black/20 backdrop-blur-sm">
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
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.05] text-[11px] font-semibold text-theme-secondary transition-all duration-200 hover:scale-105 ${link.color}`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {link.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
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
