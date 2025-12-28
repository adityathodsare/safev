export default function TeamSection() {
  const team = [
    {
      name: "Aditya Thodsare",
      role: "Full Stack & Backend Developer",
    },
    {
      name: "Khushi Sharma",
      role: "Frontend & UI Developer",
    },
    {
      name: "Kirti Shelke",
      role: "Hardware & IoT Engineer",
    },
  ];

  return (
    <section className="bg-black py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Team Behind SAFEV
        </h2>

        <p className="text-gray-400 mb-10">
          SAFEV is built by engineers focused on solving real-world vehicle
          safety and emergency response challenges using IoT, GPS, and AI.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-[#111827] p-6 rounded-xl border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-white">
                {member.name}
              </h3>
              <p className="text-gray-400">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
