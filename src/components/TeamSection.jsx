import { FaGithub, FaLinkedin, FaBriefcase } from "react-icons/fa";

export default function TeamSection() {
  const team = [
    {
      name: "Aditya Thodsare",
      role: "Full Stack Developer & IOT system designer",
      description:
        "Backend architecture, IoT integration, cloud infrastructure, and system design",
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
      github: "https://github.com/adityathodsare",
      linkedin: "https://www.linkedin.com/in/aditya-thodsare-475366289/",
      portfolio: "https://aditya-thodsare-portfolio.vercel.app/",
      image: "/img/3.jpg",
      isLeader: true,
    },
    {
      name: "Khushi Sharma",
      role: "Frontend & UI/UX Developer",
      description:
        "User interface design, responsive layouts, user experience optimization",
      skills: [
        "SQL",
        "Figma",
        "UI/UX Developer",
        "Next.js",
        "React",
        "Tailwind CSS",
      ],
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      portfolio: "https:",
      image: "/img/2.jpg",
      isLeader: false,
    },
    {
      name: "Kirti Shelke",
      role: "MERN Stack Developer & Hardware Engineer",
      description:
        "Full stack development, sensor integration, embedded systems, hardware prototyping",
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
      github: "https://github.com/",
      linkedin: "https://linkedin.com/",
      portfolio: "https:",
      image: "/img/1.jpg",
      isLeader: false,
    },
  ];

  return (
    <section className="bg-black py-20 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <svg
              className="w-4 h-4 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="text-sm text-purple-300 font-medium">
              Team NexaGen
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Meet The{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Team
            </span>
          </h2>

          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            SAFEV is built by passionate engineers focused on solving real-world
            vehicle safety and emergency response challenges using IoT, GPS, and
            AI technology
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="group relative bg-[#0a0a0a] rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-all duration-500 overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.15}s backwards`,
              }}
            >
              {/* Leader Badge */}
              {member.isLeader && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    LEADER
                  </div>
                </div>
              )}

              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

              {/* Image Section */}
              <div className="relative h-72 overflow-hidden bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent z-10" />
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-4">
                {/* Name & Role */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                    {member.name}
                  </h3>
                  <p className="text-purple-400 font-semibold text-sm mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {member.description}
                  </p>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs font-medium bg-gray-900 text-gray-300 rounded-full border border-gray-800 hover:border-purple-500/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800">
                  <a
                    href={member.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center py-2 rounded-lg bg-gray-900 hover:bg-purple-600 text-gray-400 hover:text-white border border-gray-800 hover:border-purple-600 transition-all group/btn"
                    aria-label={`${member.name}'s Portfolio`}
                  >
                    <FaBriefcase className="w-4 h-4" />
                  </a>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700 transition-all group/btn"
                    aria-label={`${member.name}'s GitHub`}
                  >
                    <FaGithub className="w-4 h-4" />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center py-2 rounded-lg bg-gray-900 hover:bg-blue-600 text-gray-400 hover:text-white border border-gray-800 hover:border-blue-600 transition-all group/btn"
                    aria-label={`${member.name}'s LinkedIn`}
                  >
                    <FaLinkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-[#0a0a0a] rounded-xl border border-gray-800">
            <div className="text-3xl font-bold text-purple-400 mb-2">3</div>
            <div className="text-sm text-gray-400">Team Members</div>
          </div>
          <div className="text-center p-6 bg-[#0a0a0a] rounded-xl border border-gray-800">
            <div className="text-3xl font-bold text-blue-400 mb-2">5+</div>
            <div className="text-sm text-gray-400">Technologies</div>
          </div>
          <div className="text-center p-6 bg-[#0a0a0a] rounded-xl border border-gray-800">
            <div className="text-3xl font-bold text-emerald-400 mb-2">100%</div>
            <div className="text-sm text-gray-400">Dedication</div>
          </div>
          <div className="text-center p-6 bg-[#0a0a0a] rounded-xl border border-gray-800">
            <div className="text-3xl font-bold text-amber-400 mb-2">24/7</div>
            <div className="text-sm text-gray-400">Innovation</div>
          </div>
        </div>
      </div>

      <style>
        {`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}
      </style>
    </section>
  );
}
