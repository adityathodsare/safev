"use client";
import { useState, useEffect } from "react";
import photo from "../../public/img/Screenshot 2024-11-03 102710.png";

const FLOATING_NODES = [
  { x: 6, y: 10, size: 5, color: "#38bdf8", dur: 4.2, del: 0 },
  { x: 92, y: 8, size: 4, color: "#a855f7", dur: 3.8, del: 0.5 },
  { x: 88, y: 30, size: 6, color: "#22c55e", dur: 5.1, del: 1.0 },
  { x: 4, y: 50, size: 4, color: "#f97316", dur: 4.6, del: 0.3 },
  { x: 94, y: 65, size: 5, color: "#ec4899", dur: 3.5, del: 0.8 },
  { x: 10, y: 80, size: 3, color: "#22d3ee", dur: 4.9, del: 1.2 },
  { x: 85, y: 85, size: 4, color: "#f59e0b", dur: 4.1, del: 0.6 },
  { x: 50, y: 5, size: 3, color: "#818cf8", dur: 3.7, del: 0.9 },
];

const SKILLS = [
  { label: "Spring Boot", color: "#4ade80", icon: "🍃" },
  { label: "Java", color: "#f97316", icon: "☕" },
  { label: "React.js", color: "#38bdf8", icon: "⚛️" },
  { label: "Next.js", color: "#fff", icon: "▲" },
  { label: "MySQL", color: "#a855f7", icon: "🗄️" },
  { label: "REST APIs", color: "#ec4899", icon: "🔗" },
  { label: "IoT", color: "#22d3ee", icon: "📡" },
];

const LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/aditya-thodsare-475366289/",
    icon: "in",
    color: "#0ea5e9",
  },
  {
    label: "GitHub",
    href: "https://github.com/adityathodsare",
    icon: "gh",
    color: "#a855f7",
  },
  {
    label: "Email",
    href: "mailto:thodsareaditya@gmail.com",
    icon: "@",
    color: "#ec4899",
  },
];

const DETAILS = [
  { icon: "📍", label: "Location", value: "Pune / Pimpri-Chinchwad, India" },
  {
    icon: "🎓",
    label: "Education",
    value: "BE — Electronics & Telecom (2022–2026)",
  },
  { icon: "📱", label: "Phone", value: "+91 8263878470" },
  { icon: "✉️", label: "Email", value: "thodsareaditya@gmail.com" },
];

export default function CreatorSection() {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("thodsareaditya@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .cr *{box-sizing:border-box;margin:0;padding:0;}
        .cr{
          font-family:'Inter',sans-serif;
          background:#000;color:#fff;
          position:relative;overflow:hidden;
          padding:100px 20px;
        }
        .cr-glow-main{
          position:absolute;pointer-events:none;
          width:900px;height:600px;
          background:radial-gradient(ellipse,rgba(56,189,248,0.12) 0%,rgba(168,85,247,0.09) 40%,transparent 70%);
          left:50%;top:40%;transform:translate(-50%,-50%);border-radius:50%;
        }
        .cr-glow-left{
          position:absolute;pointer-events:none;width:500px;height:500px;
          background:radial-gradient(ellipse,rgba(236,72,153,0.07) 0%,transparent 70%);
          left:-200px;top:10%;
        }
        .cr-glow-right{
          position:absolute;pointer-events:none;width:400px;height:400px;
          background:radial-gradient(ellipse,rgba(34,197,94,0.07) 0%,transparent 70%);
          right:-150px;bottom:10%;
        }
        .cr-noise{
          position:absolute;inset:0;pointer-events:none;opacity:.4;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
        }
        .cr-node{
          position:absolute;pointer-events:none;border-radius:50%;
          animation:nodeFloat var(--dur) ease-in-out infinite var(--del);
        }
        @keyframes nodeFloat{
          0%,100%{transform:translateY(0) scale(1);opacity:.6;}
          50%{transform:translateY(-14px) scale(1.3);opacity:1;}
        }
        .cr-c{max-width:1100px;margin:0 auto;position:relative;z-index:2;}

        .cr-badge{
          display:inline-flex;align-items:center;gap:8px;
          background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);
          border-radius:100px;padding:7px 18px;margin-bottom:20px;
          font-size:11px;font-weight:600;color:rgba(255,255,255,0.5);letter-spacing:.3px;
        }
        .cr-badge-dot{
          width:6px;height:6px;border-radius:50%;background:#4ade80;
          animation:bpulse 1.8s ease-in-out infinite;
        }
        @keyframes bpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.5)}}
        .cr-section-title{
          font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;
          color:rgba(255,255,255,0.28);margin-bottom:10px;
        }
        .cr-h{
          font-size:clamp(38px,6vw,72px);font-weight:900;
          letter-spacing:-2px;line-height:1.07;margin-bottom:52px;
        }
        .cr-h span{
          background:linear-gradient(135deg,#38bdf8,#a855f7,#ec4899);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }

        .cr-layout{
          display:grid;grid-template-columns:320px 1fr;
          gap:28px;align-items:start;
        }
        @media(max-width:860px){.cr-layout{grid-template-columns:1fr;}}

        /* ── Photo Card ── */
        .cr-photo-card{
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:24px;overflow:hidden;
          position:sticky;top:28px;
        }
        .cr-photo-wrap{
          position:relative;
          width:100%;
          aspect-ratio:4/5;   /* tall portrait ratio */
          overflow:hidden;
        }
        /* ✅ img fills the entire wrap — no wrapper div */
        .cr-photo-wrap img{
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          object-fit:cover;
          object-position:top center;
          display:block;
          transition:transform .4s ease;
        }
        .cr-photo-card:hover .cr-photo-wrap img{
          transform:scale(1.04);
        }
        .cr-photo-overlay{
          position:absolute;bottom:0;left:0;right:0;height:55%;
          background:linear-gradient(to top,rgba(0,0,0,0.92) 0%,transparent 100%);
          pointer-events:none;
        }
        .cr-photo-name{
          position:absolute;bottom:22px;left:20px;
          font-size:19px;font-weight:800;letter-spacing:-.4px;
        }
        .cr-photo-role{
          position:absolute;bottom:6px;left:20px;padding-bottom:14px;
          font-size:10px;color:rgba(255,255,255,0.4);
          letter-spacing:1.5px;text-transform:uppercase;
        }
        .cr-stripe{height:3px;background:linear-gradient(90deg,#38bdf8,#a855f7,#ec4899,#f97316);}
        .cr-links-row{
          display:flex;gap:8px;padding:14px 16px;
          border-top:1px solid rgba(255,255,255,0.05);flex-wrap:wrap;
        }
        .cr-link-btn{
          flex:1;min-width:76px;
          display:inline-flex;align-items:center;justify-content:center;gap:6px;
          padding:9px 10px;border-radius:10px;
          border:1px solid rgba(255,255,255,0.1);
          background:rgba(255,255,255,0.03);
          color:rgba(255,255,255,0.65);font-size:11px;font-weight:700;letter-spacing:.2px;
          cursor:pointer;text-decoration:none;transition:all .22s;
        }
        .cr-link-btn:hover{
          background:var(--c);color:#000;border-color:var(--c);
          transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.45);
        }
        .cr-link-icon{
          width:20px;height:20px;border-radius:5px;
          background:var(--c);color:#000;font-size:9px;font-weight:900;
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
        }

        .cr-right{display:flex;flex-direction:column;gap:18px;}

        .cr-card{
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:20px;padding:26px;
        }
        .cr-card-lbl{
          font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;
          color:rgba(255,255,255,0.28);margin-bottom:14px;
        }
        .cr-name{
          font-size:clamp(22px,3vw,32px);font-weight:900;letter-spacing:-1.5px;margin-bottom:7px;
        }
        .cr-name span{
          background:linear-gradient(135deg,#38bdf8,#a855f7);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .cr-role{
          display:inline-flex;align-items:center;gap:7px;
          background:rgba(56,189,248,0.07);border:1px solid rgba(56,189,248,0.18);
          border-radius:100px;padding:5px 14px;margin-bottom:16px;
          font-size:12px;font-weight:600;color:#38bdf8;letter-spacing:.2px;
        }
        .cr-bio{
          font-size:14px;line-height:1.8;color:rgba(255,255,255,0.52);
          border-left:2px solid rgba(56,189,248,0.3);padding-left:14px;
        }
        .cr-detail-row{
          display:flex;align-items:center;gap:12px;
          padding:9px 8px;margin:0 -8px;border-radius:8px;
          border-bottom:1px solid rgba(255,255,255,0.04);transition:background .2s;
        }
        .cr-detail-row:last-child{border-bottom:none;}
        .cr-detail-row:hover{background:rgba(255,255,255,0.03);}
        .cr-detail-ic{
          width:32px;height:32px;border-radius:8px;
          background:rgba(255,255,255,0.05);
          display:flex;align-items:center;justify-content:center;
          font-size:15px;flex-shrink:0;
        }
        .cr-detail-lbl{
          font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
          color:rgba(255,255,255,0.28);margin-bottom:2px;
        }
        .cr-detail-val{font-size:13px;color:rgba(255,255,255,0.7);font-weight:600;}

        .cr-skills-wrap{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;}
        .cr-skill{
          display:inline-flex;align-items:center;gap:7px;
          padding:8px 15px;border-radius:10px;
          border:1px solid rgba(255,255,255,0.07);
          background:rgba(255,255,255,0.03);
          font-size:13px;font-weight:700;cursor:default;
          transition:all .22s;position:relative;overflow:hidden;
        }
        .cr-skill::before{
          content:'';position:absolute;inset:0;
          background:var(--sc);opacity:0;transition:opacity .22s;
        }
        .cr-skill:hover::before{opacity:.08;}
        .cr-skill:hover{
          border-color:var(--sc);transform:translateY(-2px);
          box-shadow:0 6px 18px rgba(0,0,0,.35);
        }
        .cr-skill-dot{
          width:7px;height:7px;border-radius:50%;background:var(--sc);
          position:relative;z-index:1;flex-shrink:0;
        }
        .cr-skill span{position:relative;z-index:1;}

        .cr-devby{
          display:flex;align-items:center;gap:14px;
          background:rgba(255,255,255,0.02);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:16px;padding:18px 22px;
        }
        .cr-devby-icon{
          width:42px;height:42px;border-radius:12px;
          background:linear-gradient(135deg,#38bdf8,#a855f7);
          display:flex;align-items:center;justify-content:center;
          font-size:20px;flex-shrink:0;
        }
        .cr-devby-lbl{
          font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
          color:rgba(255,255,255,0.28);margin-bottom:3px;
        }
        .cr-devby-name{font-size:16px;font-weight:800;letter-spacing:-.5px;}
        .cr-devby-name span{color:#38bdf8;}
        .cr-copy-btn{
          margin-left:auto;flex-shrink:0;
          background:transparent;border:1px solid rgba(255,255,255,0.1);
          border-radius:8px;padding:7px 14px;color:rgba(255,255,255,0.4);
          font-size:10px;font-weight:700;letter-spacing:.8px;cursor:pointer;transition:all .2s;
        }
        .cr-copy-btn:hover{background:rgba(255,255,255,.06);color:#fff;border-color:rgba(255,255,255,.22);}
        .cr-copy-btn.ok{color:#4ade80;border-color:rgba(74,222,128,0.4);}
      `}</style>

      <div className="cr">
        <div className="cr-glow-main" />
        <div className="cr-glow-left" />
        <div className="cr-glow-right" />
        <div className="cr-noise" />

        {mounted &&
          FLOATING_NODES.map((n, i) => (
            <div
              key={i}
              className="cr-node"
              style={{
                left: `${n.x}%`,
                top: `${n.y}%`,
                width: n.size,
                height: n.size,
                background: n.color,
                "--dur": `${n.dur}s`,
                "--del": `${n.del}s`,
                boxShadow: `0 0 ${n.size * 4}px ${n.color}`,
              }}
            />
          ))}

        <div className="cr-c">
          {/* Header */}
          <div style={{ marginBottom: 52 }}>
            <div className="cr-badge">
              <div className="cr-badge-dot" />
              DEVELOPER PROFILE
            </div>
            <div className="cr-section-title">About the Creator</div>
            <h2 className="cr-h">
              Meet <span>Aditya</span>
            </h2>
          </div>

          <div className="cr-layout">
            {/* LEFT — Photo Card */}
            <div className="cr-photo-card">
              <div className="cr-photo-wrap">
                {/* ✅ img sits directly inside wrap — fills full 4:5 area */}
                <img src={photo.src} alt="Aditya Thodsare" />

                {/* overlay + name on top of the photo */}
                <div className="cr-photo-overlay" />
                <div className="cr-photo-name">Aditya Thodsare</div>
                <div className="cr-photo-role">Full Stack Dev · IoT</div>
              </div>

              <div className="cr-stripe" />

              <div className="cr-links-row">
                {LINKS.map((l) => (
                  <a
                    key={l.label}
                    className="cr-link-btn"
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ "--c": l.color }}
                  >
                    <div
                      className="cr-link-icon"
                      style={{ background: l.color }}
                    >
                      {l.icon}
                    </div>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="cr-right">
              {/* About */}
              <div className="cr-card">
                <div className="cr-card-lbl">Who Am I</div>
                <div className="cr-name">
                  <span>Aditya</span> Thodsare
                </div>
                <div className="cr-role">
                  ⚡ Full Stack Developer · IoT Enthusiast
                </div>
                <p className="cr-bio">
                  I'm a passionate Full Stack Developer with expertise in
                  building modern web applications. I craft efficient,
                  user-centric solutions that bridge the gap between technology
                  and business needs — with a deep passion for creating
                  meaningful digital experiences using Spring Boot, React, and
                  cutting-edge IoT innovation.
                </p>
              </div>

              {/* Details */}
              <div className="cr-card">
                <div className="cr-card-lbl">Personal Details</div>
                {DETAILS.map((d) => (
                  <div className="cr-detail-row" key={d.label}>
                    <div className="cr-detail-ic">{d.icon}</div>
                    <div>
                      <div className="cr-detail-lbl">{d.label}</div>
                      <div className="cr-detail-val">{d.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="cr-card">
                <div className="cr-card-lbl">Tech Stack</div>
                <div className="cr-skills-wrap">
                  {SKILLS.map((s) => (
                    <div
                      key={s.label}
                      className="cr-skill"
                      style={{ "--sc": s.color }}
                    >
                      <div className="cr-skill-dot" />
                      <span>
                        {s.icon} {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Developed By */}
              <div className="cr-devby">
                <div className="cr-devby-icon">🛡️</div>
                <div>
                  <div className="cr-devby-lbl">Developed By</div>
                  <div className="cr-devby-name">
                    <span>Aditya</span> Thodsare
                  </div>
                </div>
                <button
                  className={`cr-copy-btn${copied ? " ok" : ""}`}
                  onClick={handleCopyEmail}
                >
                  {copied ? "✓ COPIED" : "COPY EMAIL"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
