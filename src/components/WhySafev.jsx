"use client";
import { useState, useEffect } from "react";

const ACCENT_LINES = [
  { x: 8, y: 12, w: 48, rot: 30, color: "#f97316" },
  { x: 85, y: 8, w: 36, rot: -20, color: "#22d3ee" },
  { x: 92, y: 35, w: 28, rot: 45, color: "#a855f7" },
  { x: 5, y: 55, w: 40, rot: -35, color: "#ec4899" },
  { x: 78, y: 60, w: 32, rot: 15, color: "#22c55e" },
  { x: 15, y: 80, w: 44, rot: 55, color: "#f59e0b" },
  { x: 88, y: 82, w: 30, rot: -50, color: "#3b82f6" },
  { x: 50, y: 5, w: 26, rot: 10, color: "#e11d48" },
  { x: 60, y: 92, w: 38, rot: -25, color: "#06b6d4" },
  { x: 3, y: 30, w: 22, rot: 70, color: "#84cc16" },
  { x: 95, y: 55, w: 20, rot: -60, color: "#f97316" },
  { x: 40, y: 88, w: 34, rot: 40, color: "#8b5cf6" },
];

export default function WhySafev() {
  const [activeTab, setActiveTab] = useState(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const useCases = [
    {
      id: "school",
      title: "School Buses",
      emoji: "🚌",
      who: "School Admins & Parents",
      tagline: "Every child, accounted for.",
      why: "Parents need peace of mind, schools need accountability. SafeV bridges both with live tracking and instant boarding alerts.",
      accentColor: "#38bdf8",
      btnGradient: "linear-gradient(135deg,#0ea5e9,#6366f1)",
      features: [
        { icon: "📍", text: "Real-time bus tracking for parents" },
        { icon: "🔔", text: "Student boarding/alighting alerts" },
        { icon: "🗺️", text: "Route optimization for multiple trips" },
        { icon: "⚡", text: "Speed monitoring & geofencing" },
        { icon: "🆘", text: "Emergency button for drivers" },
      ],
    },
    {
      id: "travel",
      title: "Tours & Travels",
      emoji: "🚐",
      who: "Travel Companies & Tour Operators",
      tagline: "Your brand. Our safety tech.",
      why: "Stand out in a crowded market with a white-label SafeV dashboard under your own brand — customers see live tracking, you see peace of mind.",
      accentColor: "#a855f7",
      btnGradient: "linear-gradient(135deg,#7c3aed,#ec4899)",
      customizable: true,
      features: [
        { icon: "🎨", text: "Custom branded dashboard" },
        { icon: "📡", text: "Live vehicle tracking for customers" },
        { icon: "🛑", text: "Stop & route management" },
        { icon: "📊", text: "Driver behavior analytics" },
        { icon: "📋", text: "Automated trip reports" },
      ],
    },
    {
      id: "corporate",
      title: "Corporate Transport",
      emoji: "🚎",
      who: "HR & Operations Teams",
      tagline: "Get employees home safe, on time.",
      why: "Reduce liability, improve punctuality and give HR real-time visibility into every employee transport shift.",
      accentColor: "#22c55e",
      btnGradient: "linear-gradient(135deg,#16a34a,#0d9488)",
      features: [
        { icon: "👤", text: "Employee pickup/drop tracking" },
        { icon: "⏰", text: "Real-time ETA notifications" },
        { icon: "💺", text: "Capacity management" },
        { icon: "🔄", text: "Shift-based route planning" },
        { icon: "✅", text: "Safety compliance monitoring" },
      ],
    },
    {
      id: "public",
      title: "Public Transport",
      emoji: "🚍",
      who: "City Authorities & Transport Agencies",
      tagline: "Smarter cities move smarter.",
      why: "Modernize public transit with live arrivals, crowd management, and predictive maintenance — all in one dashboard.",
      accentColor: "#f97316",
      btnGradient: "linear-gradient(135deg,#ea580c,#dc2626)",
      features: [
        { icon: "🕐", text: "Live arrival predictions" },
        { icon: "👥", text: "Crowd density monitoring" },
        { icon: "🔧", text: "Maintenance alerts" },
        { icon: "📈", text: "Route efficiency analytics" },
        { icon: "🔢", text: "Passenger counting system" },
      ],
    },
    {
      id: "logistics",
      title: "Logistics & Fleet",
      emoji: "🚛",
      who: "Fleet Managers & Logistics Companies",
      tagline: "Deliver more. Spend less.",
      why: "Cut fuel costs, prevent cargo theft, and score every driver so your fleet runs at peak efficiency every single day.",
      accentColor: "#818cf8",
      btnGradient: "linear-gradient(135deg,#4f46e5,#2563eb)",
      features: [
        { icon: "📦", text: "Real-time cargo tracking" },
        { icon: "🗺️", text: "Delivery route optimization" },
        { icon: "⛽", text: "Fuel efficiency monitoring" },
        { icon: "🏆", text: "Driver performance scoring" },
        { icon: "🔩", text: "Maintenance scheduling" },
      ],
    },
    {
      id: "personal",
      title: "Personal Vehicles",
      emoji: "🚙",
      who: "Families & Individual Car Owners",
      tagline: "Protect what matters most.",
      why: "Know where your loved ones are, detect drunk driving before it happens, and respond instantly to any emergency.",
      accentColor: "#22d3ee",
      btnGradient: "linear-gradient(135deg,#0891b2,#7c3aed)",
      features: [
        { icon: "📍", text: "Real-time GPS tracking" },
        { icon: "🍺", text: "Alcohol detection system" },
        { icon: "🔄", text: "Rollover protection" },
        { icon: "🆘", text: "Accident alerts to contacts" },
        { icon: "🧠", text: "Driving behavior insights" },
      ],
    },
  ];

  const stats = [
    { value: "99.9%", label: "Uptime", color: "#22d3ee" },
    { value: "<2s", label: "Alert Delay", color: "#a855f7" },
    { value: "24/7", label: "Monitoring", color: "#22c55e" },
    { value: "1000+", label: "Devices", color: "#f97316" },
  ];

  const activeCase = useCases.find((c) => c.id === activeTab);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .sv *{box-sizing:border-box;margin:0;padding:0;}
        .sv{font-family:'Inter',sans-serif;background:#000;color:#fff;position:relative;overflow:hidden;padding:72px 20px 100px;}
        .sv-glow{position:absolute;pointer-events:none;width:700px;height:500px;background:radial-gradient(ellipse at center,rgba(120,40,200,0.38) 0%,rgba(60,20,120,0.22) 40%,transparent 70%);left:50%;top:32%;transform:translate(-50%,-50%);border-radius:50%;}
        .sv-glow2{position:absolute;pointer-events:none;width:400px;height:400px;background:radial-gradient(ellipse at center,rgba(30,80,200,0.14) 0%,transparent 70%);left:-100px;top:20%;}
        .sv-dash{position:absolute;pointer-events:none;border-radius:3px;opacity:.9;animation:dashFloat var(--dur,4s) ease-in-out infinite var(--del,0s);}
        @keyframes dashFloat{0%,100%{transform:translateY(0) rotate(var(--rot))}50%{transform:translateY(-9px) rotate(var(--rot))}}
        .sv-c{max-width:1100px;margin:0 auto;position:relative;z-index:2;}
        /* Badge */
        .sv-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.18);border-radius:100px;padding:7px 18px;margin-bottom:26px;}
        .sv-badge span{font-size:12px;font-weight:600;color:#e2e8f0;letter-spacing:.3px;}
        /* Title */
        .sv-h1{font-size:clamp(32px,6vw,62px);font-weight:900;line-height:1.07;letter-spacing:-2px;margin-bottom:16px;}
        .sv-h1 em{color:rgba(255,255,255,0.3);font-style:normal;}
        .sv-dotrow{font-size:clamp(13px,2vw,15px);color:rgba(255,255,255,0.45);letter-spacing:.3px;margin-bottom:44px;}
        .sv-dotrow s{text-decoration:none;margin:0 8px;opacity:.35;}
        /* Stats */
        .sv-stats{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-bottom:56px;}
        .sv-stat{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:14px;padding:18px 26px;text-align:center;min-width:110px;transition:background .25s,border-color .25s;}
        .sv-stat:hover{background:rgba(255,255,255,0.07);}
        .sv-stat-v{font-size:27px;font-weight:900;letter-spacing:-1px;}
        .sv-stat-l{font-size:11px;color:rgba(255,255,255,0.4);font-weight:500;margin-top:3px;}
        /* Section label */
        .sv-stag{font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:8px;}
        .sv-sh{font-size:clamp(20px,3.5vw,34px);font-weight:800;letter-spacing:-.5px;margin-bottom:26px;}
        /* Grid */
        .sv-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:13px;margin-bottom:36px;}
        @media(max-width:860px){.sv-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:520px){.sv-grid{grid-template-columns:1fr;}}
        /* Card */
        .sv-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:22px 20px;cursor:pointer;transition:all .25s ease;position:relative;overflow:hidden;}
        .sv-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--ac);opacity:0;transition:opacity .3s;}
        .sv-card:hover{background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.15);transform:translateY(-3px);}
        .sv-card:hover::after,.sv-card.on::after{opacity:1;}
        .sv-card.on{background:rgba(255,255,255,0.05);border-color:var(--ac);box-shadow:0 0 0 1px var(--ac),0 16px 40px rgba(0,0,0,.55);}
        .sv-card-em{font-size:36px;margin-bottom:11px;display:block;}
        .sv-card-tt{font-size:16px;font-weight:800;margin-bottom:3px;letter-spacing:-.3px;}
        .sv-card-who{font-size:12px;color:rgba(255,255,255,0.38);font-weight:500;margin-bottom:9px;}
        .sv-card-tl{font-size:13px;color:rgba(255,255,255,0.58);line-height:1.55;font-style:italic;margin-bottom:12px;}
        .sv-wl{display:inline-block;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:3px 10px;border-radius:100px;background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.35);color:#fbbf24;margin-bottom:10px;}
        .sv-cta-lnk{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px 14px;border-radius:100px;border:1px solid var(--ac);color:var(--ac);transition:all .2s;}
        .sv-card:hover .sv-cta-lnk,.sv-card.on .sv-cta-lnk{background:var(--ac);color:#000;}
        /* Panel */
        .sv-panel{border-radius:22px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;margin-bottom:56px;background:rgba(8,8,18,0.85);animation:panIn .35s cubic-bezier(.16,1,.3,1) forwards;}
        @keyframes panIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .sv-pbar{height:3px;}
        .sv-pbody{display:grid;grid-template-columns:1fr 1fr;}
        @media(max-width:680px){.sv-pbody{grid-template-columns:1fr;}}
        .sv-pl{padding:36px;border-right:1px solid rgba(255,255,255,0.07);}
        @media(max-width:680px){.sv-pl{border-right:none;border-bottom:1px solid rgba(255,255,255,0.07);padding:24px 20px;}}
        .sv-pveh{font-size:62px;display:block;margin-bottom:18px;animation:vbob 2.5s ease-in-out infinite;}
        @keyframes vbob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-9px) rotate(2deg)}}
        .sv-ptitle{font-size:clamp(24px,4vw,38px);font-weight:900;letter-spacing:-1px;margin-bottom:5px;}
        .sv-pfor{font-size:11px;color:rgba(255,255,255,0.32);text-transform:uppercase;letter-spacing:2px;font-weight:700;margin-top:14px;margin-bottom:4px;}
        .sv-pwho{font-size:14px;color:rgba(255,255,255,0.65);margin-bottom:22px;}
        .sv-why{border-left:3px solid var(--ac);padding:14px 18px;background:rgba(255,255,255,0.03);border-radius:0 12px 12px 0;}
        .sv-why-l{font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--ac);margin-bottom:7px;}
        .sv-why-t{font-size:14px;line-height:1.7;color:rgba(255,255,255,0.62);}
        .sv-pr{padding:36px;}
        @media(max-width:680px){.sv-pr{padding:24px 20px;}}
        .sv-fl{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:14px;}
        .sv-fi{display:flex;align-items:center;gap:11px;padding:11px 14px;margin-bottom:7px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;transition:background .2s,border-color .2s;}
        .sv-fi:hover{background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.11);}
        .sv-fi-ic{font-size:17px;width:34px;height:34px;border-radius:9px;background:rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .sv-fi-t{font-size:13.5px;color:rgba(255,255,255,0.72);}
        .sv-pfoot{border-top:1px solid rgba(255,255,255,0.07);padding:15px 36px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;background:rgba(255,255,255,0.015);}
        @media(max-width:680px){.sv-pfoot{padding:14px 20px;}}
        .sv-live{display:flex;align-items:center;gap:10px;}
        .sv-ld{width:8px;height:8px;border-radius:50%;background:#4ade80;position:relative;}
        .sv-ld::after{content:'';position:absolute;inset:-4px;border-radius:50%;border:2px solid #4ade80;animation:lring 1.5s ease-in-out infinite;}
        @keyframes lring{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(2.2)}}
        .sv-ll{font-size:12px;font-weight:700;color:#4ade80;letter-spacing:1px;}
        .sv-ls{font-size:11px;color:rgba(255,255,255,0.28);}
        .sv-bars{display:flex;align-items:flex-end;gap:3px;}
        .sv-bar{width:4px;border-radius:2px;animation:bbeat .9s ease-in-out infinite;}
        @keyframes bbeat{0%,100%{opacity:.3;transform:scaleY(.6)}50%{opacity:1;transform:scaleY(1)}}
        /* CTA */
        .sv-cta{text-align:center;padding-top:12px;}
        .sv-cta h2{font-size:clamp(26px,4.5vw,50px);font-weight:900;letter-spacing:-1.5px;margin-bottom:12px;}
        .sv-cta p{font-size:15px;color:rgba(255,255,255,0.38);margin-bottom:30px;}
        .sv-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
        .sv-btn{display:inline-flex;align-items:center;gap:9px;font-size:15px;font-weight:700;padding:15px 32px;border-radius:10px;border:none;cursor:pointer;transition:transform .2s,box-shadow .2s;letter-spacing:.2px;}
        .sv-btn:hover{transform:translateY(-2px);}
        .sv-btn-a{background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;box-shadow:0 0 28px rgba(124,58,237,.3);}
        .sv-btn-a:hover{box-shadow:0 8px 40px rgba(124,58,237,.5);}
        .sv-btn-b{background:linear-gradient(135deg,#0891b2,#0ea5e9);color:#fff;box-shadow:0 0 28px rgba(14,165,233,.25);}
        .sv-btn-b:hover{box-shadow:0 8px 40px rgba(14,165,233,.45);}
        .sv-btn-c{background:linear-gradient(135deg,#f97316,#dc2626);color:#fff;box-shadow:0 0 28px rgba(249,115,22,.25);}
        .sv-btn-c:hover{box-shadow:0 8px 40px rgba(249,115,22,.45);}
        .sv-divider{height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent);margin:56px 0;}
        .sv-close-btn{background:transparent;color:rgba(255,255,255,.55);font-size:13px;font-weight:600;padding:9px 20px;border-radius:8px;border:1px solid rgba(255,255,255,.15);cursor:pointer;transition:all .2s;}
        .sv-close-btn:hover{background:rgba(255,255,255,.06);color:#fff;}
      `}</style>

      <div className="sv">
        <div className="sv-glow" />
        <div className="sv-glow2" />

        {/* Floating colored dashes */}
        {mounted &&
          ACCENT_LINES.map((d, i) => (
            <div
              key={i}
              className="sv-dash"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: d.w,
                height: 4,
                background: d.color,
                "--rot": `${d.rot}deg`,
                "--dur": `${3.5 + (i % 3) * 0.9}s`,
                "--del": `${i * 0.3}s`,
                transform: `rotate(${d.rot}deg)`,
              }}
            />
          ))}

        <div className="sv-c">
          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="sv-badge">
              <span>🛡️ IoT-Powered Vehicle Safety</span>
            </div>
            <h1 className="sv-h1">
              Who Can Use SafeV?
              <br />
              <em>Find Your Use Case.</em>
            </h1>
            <p className="sv-dotrow">
              Real-time accident detection <s>•</s>
              GPS tracking <s>•</s>
              Alcohol monitoring <s>•</s>
              Emergency alerts
            </p>
            <div className="sv-stats">
              {stats.map((s) => (
                <div className="sv-stat" key={s.label}>
                  <div className="sv-stat-v" style={{ color: s.color }}>
                    {s.value}
                  </div>
                  <div className="sv-stat-l">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div className="sv-stag">Select your vehicle type</div>
            <h2 className="sv-sh">Built for every kind of journey</h2>
          </div>

          {/* Cards Grid */}
          <div className="sv-grid">
            {useCases.map((uc) => (
              <div
                key={uc.id}
                className={`sv-card ${activeTab === uc.id ? "on" : ""}`}
                style={{ "--ac": uc.accentColor }}
                onClick={() => setActiveTab(activeTab === uc.id ? null : uc.id)}
              >
                <span className="sv-card-em">{uc.emoji}</span>
                {uc.customizable && <div className="sv-wl">✨ White-label</div>}
                <div className="sv-card-tt">{uc.title}</div>
                <div className="sv-card-who">👤 {uc.who}</div>
                <div className="sv-card-tl">"{uc.tagline}"</div>
                <div className="sv-cta-lnk">
                  {activeTab === uc.id ? "▲ Close" : "Learn more →"}
                </div>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          {activeCase && (
            <div
              className="sv-panel"
              key={activeCase.id}
              style={{ "--ac": activeCase.accentColor }}
            >
              <div
                className="sv-pbar"
                style={{ background: activeCase.btnGradient }}
              />
              <div className="sv-pbody">
                <div className="sv-pl">
                  <span className="sv-pveh">{activeCase.emoji}</span>
                  <div
                    className="sv-ptitle"
                    style={{ color: activeCase.accentColor }}
                  >
                    {activeCase.title}
                  </div>
                  <div className="sv-pfor">Built for</div>
                  <div className="sv-pwho">{activeCase.who}</div>
                  <div className="sv-why">
                    <div className="sv-why-l">Why SafeV?</div>
                    <div className="sv-why-t">{activeCase.why}</div>
                  </div>
                </div>
                <div className="sv-pr">
                  <div className="sv-fl">Key Features</div>
                  {activeCase.features.map((f, i) => (
                    <div className="sv-fi" key={i}>
                      <div className="sv-fi-ic">{f.icon}</div>
                      <div className="sv-fi-t">{f.text}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="sv-pfoot">
                <div className="sv-live">
                  <div className="sv-ld" />
                  <div>
                    <div className="sv-ll">LIVE MONITORING</div>
                    <div className="sv-ls">
                      Active 24/7 for {activeCase.title}
                    </div>
                  </div>
                </div>
                <div className="sv-bars">
                  {[10, 16, 12, 20, 14, 18, 10, 22].map((h, i) => (
                    <div
                      key={i}
                      className="sv-bar"
                      style={{
                        height: h,
                        background: activeCase.accentColor,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
                <button
                  className="sv-close-btn"
                  onClick={() => setActiveTab(null)}
                >
                  Close ✕
                </button>
              </div>
            </div>
          )}

          <div className="sv-divider" />
        </div>
      </div>
    </>
  );
}
