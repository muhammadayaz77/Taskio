import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  Clipboard,
  Users,
  Archive,
  MessageSquare,
  CheckCircle2,
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
  Star,
  Sparkles,
  Target,
  TrendingUp,
  GitBranch,
  Bell,
  Layers,
  Circle,
  Plus,
  Menu,
  X,
  Check,
  ChevronRight,
  Search,
  Calendar,
  MoreHorizontal,
} from "lucide-react";

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, visible] = useInView();
  const translate = direction === "up" ? "translateY(28px)" : direction === "left" ? "translateX(-28px)" : "translateX(28px)";
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0)" : translate,
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function AnimatedNumber({ end, suffix = "", duration = 1800 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView(0.3);
  useEffect(() => {
    if (!visible) return;
    let v = 0;
    const step = end / (duration / 16);
    const t = setInterval(() => {
      v += step;
      if (v >= end) { setCount(end); clearInterval(t); }
      else setCount(Math.floor(v));
    }, 16);
    return () => clearInterval(t);
  }, [visible, end, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────────────────────────
   Feature Card
───────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, description, accent, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? "#fff" : "#fafafa",
          border: `1.5px solid ${hovered ? accent + "40" : "#e5e7eb"}`,
          borderRadius: 16,
          padding: "28px 24px",
          transition: "all 0.25s ease",
          boxShadow: hovered ? `0 12px 40px ${accent}18` : "0 1px 4px rgba(0,0,0,0.05)",
          cursor: "default",
          transform: hovered ? "translateY(-4px)" : "none",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: accent + "18",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Icon size={20} style={{ color: accent }} />
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.65 }}>{description}</p>
      </div>
    </FadeIn>
  );
}

/* ─────────────────────────────────────────
   Testimonial
───────────────────────────────────────── */
function TestiCard({ quote, name, role, avatarColor, delay }) {
  return (
    <FadeIn delay={delay}>
      <div style={{
        background: "#fff",
        border: "1.5px solid #e5e7eb",
        borderRadius: 16,
        padding: "28px 24px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
          {[...Array(5)].map((_, i) => <Star key={i} size={14} style={{ color: "#f59e0b", fill: "#f59e0b" }} />)}
        </div>
        <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, marginBottom: 20 }}>"{quote}"</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: avatarColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 14,
          }}>{name[0]}</div>
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 700, color: "#111827" }}>{name}</p>
            <p style={{ fontSize: 12, color: "#9ca3af" }}>{role}</p>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// PriceCard component removed as plans are completely free

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── data ── */
  const features = [
    { icon: Layers, title: "Workspaces", accent: "#7c3aed", description: "Organise every team and project into dedicated, context-aware workspaces that scale with your company." },
    { icon: Clipboard, title: "Smart Tasks", accent: "#0ea5e9", description: "Create, assign, and track tasks with rich metadata — priorities, due dates, assignees, and custom statuses." },
    { icon: BarChart3, title: "Analytics", accent: "#10b981", description: "Real-time charts for project health, task trends, and team productivity — all in one beautiful dashboard." },
    { icon: MessageSquare, title: "Team Chat", accent: "#f59e0b", description: "Built-in workspace chat keeps everyone in sync without switching between apps." },
    { icon: Users, title: "Member Management", accent: "#ec4899", description: "Invite members, set roles, and manage permissions across workspaces and projects with ease." },
    { icon: Archive, title: "Task Archive", accent: "#6366f1", description: "Nothing is ever lost. Search and restore completed tasks and projects from your archive at any time." },
    { icon: GitBranch, title: "Project Hierarchy", accent: "#14b8a6", description: "A clear Workspace → Project → Task hierarchy that makes navigating complex work intuitive." },
    { icon: Bell, title: "Smart Notifications", accent: "#f97316", description: "Stay on top of deadlines, mentions, and updates without drowning in noise." },
    { icon: Shield, title: "Secure & Private", accent: "#7c3aed", description: "JWT auth, email verification, and role-based access keep your team's data safe." },
  ];

  const testimonials = [
    { quote: "Taskio transformed how our remote team works. Workspaces are intuitive and the built-in chat is a game changer — we stopped juggling three tools.", name: "Sarah Chen", role: "Product Manager · NovaTech", avatarColor: "linear-gradient(135deg,#7c3aed,#6366f1)" },
    { quote: "The analytics dashboard alone saves us hours of reporting every week. We moved our whole engineering org here in under a day.", name: "Marcus Rivera", role: "Engineering Lead · Pulse", avatarColor: "linear-gradient(135deg,#0ea5e9,#06b6d4)" },
    { quote: "Simple enough to onboard the entire team instantly, powerful enough to run complex multi-project sprints. Exactly what we needed.", name: "Amina Hassan", role: "Operations Director · Bridgewave", avatarColor: "linear-gradient(135deg,#10b981,#059669)" },
  ];

  // plans array removed as Taskio is now completely free with no hidden charges

  /* ── task data for hero mockup ── */
  const mockTasks = [
    { label: "Redesign onboarding flow", status: "In Progress", priority: "high", done: false },
    { label: "Fix API rate limiting bug", status: "Done", priority: "medium", done: true },
    { label: "Write Q3 release notes", status: "Todo", priority: "low", done: false },
    { label: "Set up CI/CD pipeline", status: "Done", priority: "high", done: true },
    { label: "Add notification preferences", status: "In Progress", priority: "medium", done: false },
  ];

  const priorityStyle = (p) => ({
    high:   { bg: "#fee2e2", color: "#dc2626" },
    medium: { bg: "#fef9c3", color: "#ca8a04" },
    low:    { bg: "#f0fdf4", color: "#16a34a" },
  }[p]);

  const statusStyle = (s) => ({
    "Done":        { bg: "#dcfce7", color: "#15803d" },
    "In Progress": { bg: "#dbeafe", color: "#1d4ed8" },
    "Todo":        { bg: "#f3f4f6", color: "#6b7280" },
  }[s]);

  return (
    <div style={{ background: "#fff", fontFamily: "'Outfit', 'Inter', sans-serif", color: "#111827", overflowX: "hidden" }}>

      {/* ═══════════════════════════════
          NAVBAR
      ═══════════════════════════════ */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "all 0.3s ease",
        background: scrolled ? "rgba(255,255,255,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.08)" : "none",
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.07)" : "none",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <img src="/Logo.png" alt="Taskio" style={{ width: 34, height: 34 }} />
            <span style={{ fontSize: 19, fontWeight: 800, color: "#111827", letterSpacing: "-0.3px" }}>Taskio</span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 36 }} className="hide-mobile">
            {[["Features", "#features"], ["Completely Free", "#why-free"], ["Testimonials", "#testimonials"]].map(([label, href]) => (
              <a key={label} href={href}
                style={{ fontSize: 14, fontWeight: 500, color: "#374151", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#7c3aed"}
                onMouseLeave={e => e.target.style.color = "#374151"}
              >{label}</a>
            ))}
          </nav>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }} className="hide-mobile">
            <Link to="/sign-in" style={{
              fontSize: 14, fontWeight: 500, color: "#374151", textDecoration: "none",
              padding: "8px 16px", borderRadius: 10, transition: "background 0.2s",
              border: "1.5px solid #e5e7eb",
            }}>Login</Link>
            <Link to="/sign-up" style={{
              fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none",
              padding: "9px 20px", borderRadius: 10,
              background: "#111827", transition: "background 0.2s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
            }}>Sign Up</Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#374151", padding: 4, display: "none" }}
            className="show-mobile">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)",
            borderTop: "1px solid #f3f4f6", padding: "16px 28px 24px",
          }}>
            {[["Features", "#features"], ["Completely Free", "#why-free"], ["Testimonials", "#testimonials"]].map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMobileOpen(false)}
                style={{ display: "block", padding: "11px 0", fontSize: 15, color: "#374151", textDecoration: "none", borderBottom: "1px solid #f3f4f6" }}
              >{label}</a>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
              <Link to="/sign-in" style={{ textAlign: "center", padding: "11px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, fontWeight: 600, color: "#374151", textDecoration: "none" }}>Login</Link>
              <Link to="/sign-up" style={{ textAlign: "center", padding: "11px", background: "#111827", borderRadius: 10, fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none" }}>Sign Up</Link>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════
          HERO  (ClickUp-style split)
      ═══════════════════════════════ */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: 80,
        paddingBottom: 60,
        background: "linear-gradient(160deg, #faf9ff 0%, #f0ebff 40%, #e8f4ff 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* subtle grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, #c4b5fd33 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.6,
        }} />
        {/* blobs */}
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 420, height: 420, background: "radial-gradient(circle, #a78bfa22 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "0%", width: 300, height: 300, background: "radial-gradient(circle, #93c5fd22 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", width: "100%", display: "flex", alignItems: "center", gap: 56, position: "relative", zIndex: 1 }}>

          {/* ── LEFT: text ── */}
          <div style={{ flex: "0 0 auto", maxWidth: 480 }}>
            {/* badge */}
            <div style={{ marginBottom: 24 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: "linear-gradient(#fff, #fff) padding-box, linear-gradient(90deg, #7c3aed, #0ea5e9, #ec4899, #7c3aed) border-box",
                border: "1.5px solid transparent",
                backgroundSize: "100% 100%, 200% auto",
                animation: "fadeDown 0.55s ease both, borderMove 4s linear infinite",
                borderRadius: 99, padding: "5px 14px 5px 10px",
                fontSize: 12.5, fontWeight: 600, color: "#374151",
                boxShadow: "0 4px 15px rgba(124, 58, 237, 0.08)",
              }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "linear-gradient(135deg,#7c3aed,#6366f1)", borderRadius: 99, padding: "2px 9px", color: "#fff", fontSize: 11, fontWeight: 700 }}>
                  <Sparkles size={11} /> New
                </span>
                Taskio 2.0 is live — Task management built for high-performance teams
                <ChevronRight size={14} style={{ color: "#7c3aed" }} />
              </span>
            </div>

            {/* headline */}
            <h1 style={{
              fontSize: "clamp(36px, 5.5vw, 58px)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "#111827",
              marginBottom: 20,
              animation: "fadeDown 0.65s ease 0.08s both",
            }}>
              Software to<br />
              <span style={{
                background: "linear-gradient(90deg, #7c3aed 0%, #4f46e5 50%, #0ea5e9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>manage all work</span>
            </h1>

            {/* bullet benefits */}
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 32, animation: "fadeDown 0.65s ease 0.14s both" }}>
              {[
                { label: "Save time.", detail: "All projects, tasks, and chat in one place." },
                { label: "Stay aligned.", detail: "Every team member works with full context." },
                { label: "Ship faster.", detail: "Analytics & priorities that drive results." },
              ].map(({ label, detail }) => (
                <li key={label} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14.5, color: "#374151" }}>
                  <Check size={17} style={{ color: "#7c3aed", marginTop: 2, flexShrink: 0 }} />
                  <span><strong style={{ color: "#111827" }}>{label}</strong> {detail}</span>
                </li>
              ))}
            </ul>

            {/* CTA row */}
            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", animation: "fadeDown 0.65s ease 0.2s both" }}>
              <Link to="/sign-up" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#111827", color: "#fff",
                fontWeight: 700, fontSize: 15, textDecoration: "none",
                padding: "14px 28px", borderRadius: 12,
                boxShadow: "0 4px 20px rgba(0,0,0,0.22)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.28)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.22)"; }}
              >
                Get started. It's FREE!
              </Link>
              <div>
                <p style={{ fontSize: 12.5, color: "#6b7280", fontWeight: 500 }}>Free forever.</p>
                <p style={{ fontSize: 12.5, color: "#7c3aed", fontWeight: 600 }}>No credit card.</p>
              </div>
            </div>

            {/* social proof ticker */}
            <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 12, animation: "fadeDown 0.65s ease 0.26s both" }}>
              <div style={{ display: "flex" }}>
                {["#7c3aed","#0ea5e9","#10b981","#f59e0b"].map((c, i) => (
                  <div key={i} style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: c, border: "2px solid #fff",
                    marginLeft: i === 0 ? 0 : -8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 11, fontWeight: 700,
                  }}>
                    {["S","M","A","J"][i]}
                  </div>
                ))}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>2,000+ teams trust Taskio</p>
                <div style={{ display: "flex", gap: 2 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} style={{ color: "#f59e0b", fill: "#f59e0b" }} />)}
                  <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 4 }}>4.9 / 5</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: App mockup ── */}
          <div style={{ flex: 1, minWidth: 0, animation: "fadeRight 0.75s ease 0.3s both", position: "relative" }}>
            {/* outer card shadow */}
            <div style={{
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 32px 80px rgba(124,58,237,0.13), 0 4px 24px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.07)",
              overflow: "hidden",
            }}>
              {/* chrome bar */}
              <div style={{
                background: "#f8f9fa",
                borderBottom: "1px solid #e5e7eb",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
                </div>
                <div style={{
                  flex: 1, background: "#fff", borderRadius: 6, border: "1px solid #e5e7eb",
                  padding: "4px 10px", fontSize: 11, color: "#9ca3af",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <Search size={10} style={{ color: "#9ca3af" }} />
                  app.taskio.dev
                </div>
              </div>

              {/* app shell */}
              <div style={{ display: "flex", height: 370 }}>

                {/* micro sidebar */}
                <div style={{ width: 52, background: "#1e1b4b", display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 0", gap: 18 }}>
                  <img src="/Logo.png" alt="" style={{ width: 28, height: 28, borderRadius: 8 }} />
                  {[LayoutDashboard, Folder, Clipboard, MessageSquare, Users].map((Icon, i) => (
                    <div key={i} style={{
                      width: 34, height: 34, borderRadius: 9,
                      background: i === 1 ? "rgba(139,92,246,0.35)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer",
                    }}>
                      <Icon size={16} style={{ color: i === 1 ? "#c4b5fd" : "rgba(255,255,255,0.4)" }} />
                    </div>
                  ))}
                </div>

                {/* sidebar nav */}
                <div style={{ width: 190, background: "#fafafa", borderRight: "1px solid #e5e7eb", padding: "14px 0", display: "flex", flexDirection: "column" }}>
                  {/* workspace header */}
                  <div style={{ padding: "0 14px 12px", borderBottom: "1px solid #e5e7eb", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>D</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Design Team</span>
                    </div>
                  </div>

                  {[
                    { icon: LayoutDashboard, label: "Dashboard" },
                    { icon: Folder, label: "Workspaces", active: true },
                    { icon: Clipboard, label: "My Tasks" },
                    { icon: MessageSquare, label: "Team Chat" },
                    { icon: Users, label: "Members" },
                    { icon: Archive, label: "Archive" },
                  ].map(({ icon: Icon, label, active }) => (
                    <div key={label} style={{
                      display: "flex", alignItems: "center", gap: 9,
                      padding: "7px 14px",
                      background: active ? "#ede9fe" : "transparent",
                      borderLeft: active ? "3px solid #7c3aed" : "3px solid transparent",
                      cursor: "pointer",
                    }}>
                      <Icon size={14} style={{ color: active ? "#7c3aed" : "#6b7280" }} />
                      <span style={{ fontSize: 12.5, fontWeight: active ? 700 : 500, color: active ? "#7c3aed" : "#374151" }}>{label}</span>
                    </div>
                  ))}
                </div>

                {/* main content */}
                <div style={{ flex: 1, background: "#fff", padding: "16px 18px", overflowY: "auto", minWidth: 0 }}>
                  {/* toolbar */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div>
                      <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>Workspace</p>
                      <p style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>Design Team</p>
                    </div>
                    <div style={{ display: "flex", gap: 7 }}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 5,
                        background: "#7c3aed", color: "#fff",
                        fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                      }}>
                        <Plus size={11} /> New Task
                      </div>
                    </div>
                  </div>

                  {/* status tabs */}
                  <div style={{ display: "flex", gap: 0, marginBottom: 14, borderBottom: "1px solid #f3f4f6" }}>
                    {["All", "Active", "Done"].map((tab, i) => (
                      <div key={tab} style={{
                        fontSize: 12, fontWeight: i === 0 ? 700 : 500,
                        color: i === 0 ? "#7c3aed" : "#9ca3af",
                        padding: "6px 14px",
                        borderBottom: i === 0 ? "2px solid #7c3aed" : "2px solid transparent",
                        cursor: "pointer",
                      }}>{tab}</div>
                    ))}
                  </div>

                  {/* task rows */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {mockTasks.map((task, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "9px 12px", borderRadius: 10,
                        background: "#fafafa", border: "1px solid #f3f4f6",
                        transition: "background 0.15s",
                      }}>
                        {task.done
                          ? <CheckCircle2 size={14} style={{ color: "#10b981", flexShrink: 0 }} />
                          : <Circle size={14} style={{ color: "#d1d5db", flexShrink: 0 }} />}
                        <span style={{
                          flex: 1, fontSize: 12, color: task.done ? "#9ca3af" : "#111827",
                          textDecoration: task.done ? "line-through" : "none",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>{task.label}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 6,
                          background: priorityStyle(task.priority).bg,
                          color: priorityStyle(task.priority).color,
                        }}>{task.priority}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 6,
                          background: statusStyle(task.status).bg,
                          color: statusStyle(task.status).color,
                        }}>{task.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* floating badges */}
            <div style={{
              position: "absolute", top: "12%", right: -22,
              background: "#fff", borderRadius: 12, padding: "10px 14px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb",
              display: "flex", alignItems: "center", gap: 8,
              animation: "floatA 4s ease-in-out infinite",
            }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 size={16} style={{ color: "#16a34a" }} />
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>Task completed!</p>
                <p style={{ fontSize: 10, color: "#9ca3af" }}>Just now</p>
              </div>
            </div>

            <div style={{
              position: "absolute", bottom: "18%", left: -28,
              background: "#fff", borderRadius: 12, padding: "10px 14px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb",
              display: "flex", alignItems: "center", gap: 8,
              animation: "floatB 5s ease-in-out infinite",
            }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp size={16} style={{ color: "#7c3aed" }} />
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>+38% productivity</p>
                <p style={{ fontSize: 10, color: "#9ca3af" }}>This month</p>
              </div>
            </div>

            <div style={{
              position: "absolute", bottom: "36%", right: -22,
              background: "#fff", borderRadius: 12, padding: "10px 14px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb",
              display: "flex", alignItems: "center", gap: 8,
              animation: "floatA 6s ease-in-out 1s infinite",
            }}>
              <div style={{ display: "flex", marginRight: 2 }}>
                {["#7c3aed","#0ea5e9","#10b981"].map((c, i) => (
                  <div key={i} style={{ width: 20, height: 20, borderRadius: "50%", background: c, border: "2px solid #fff", marginLeft: i ? -6 : 0 }} />
                ))}
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>5 online</p>
            </div>
          </div>
        </div>
      </section>

      {/* marquee strip */}
      <div style={{ background: "#111827", padding: "14px 0", overflow: "hidden", position: "relative" }}>
        <div style={{ display: "flex", gap: 56, animation: "marquee 18s linear infinite", whiteSpace: "nowrap" }}>
          {[...Array(3)].flatMap(() => [
            "GET 400% MORE DONE",
            "•",
            "WORKSPACES & PROJECTS",
            "•",
            "REAL-TIME TEAM CHAT",
            "•",
            "ANALYTICS DASHBOARD",
            "•",
            "SMART TASK MANAGEMENT",
            "•",
          ]).map((t, i) => (
            <span key={i} style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: t === "•" ? "#7c3aed" : "#e5e7eb" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════
          STATS
      ═══════════════════════════════ */}
      <section style={{ padding: "72px 28px", background: "#faf9ff" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 32, textAlign: "center" }}>
          {[
            { end: 2000, suffix: "+", label: "Teams worldwide" },
            { end: 50000, suffix: "+", label: "Tasks completed" },
            { end: 99, suffix: "%", label: "Uptime SLA" },
            { end: 12, suffix: "x", label: "Faster delivery" },
          ].map(({ end, suffix, label }, i) => (
            <FadeIn key={label} delay={i * 80}>
              <p style={{
                fontSize: 44, fontWeight: 900, letterSpacing: "-0.03em",
                background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                <AnimatedNumber end={end} suffix={suffix} />
              </p>
              <p style={{ fontSize: 13.5, color: "#6b7280", marginTop: 4, fontWeight: 500 }}>{label}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════
          FEATURES
      ═══════════════════════════════ */}
      <section id="features" style={{ padding: "88px 28px", background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span style={{ display: "inline-block", background: "#ede9fe", color: "#7c3aed", fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 99, marginBottom: 16, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Everything included
              </span>
              <h2 style={{ fontSize: "clamp(28px,4.5vw,46px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#111827", marginBottom: 14 }}>
                One platform.<br />
                <span style={{ background: "linear-gradient(90deg,#7c3aed,#0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Every tool you need.
                </span>
              </h2>
              <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 520, margin: "0 auto" }}>
                From solo freelancers to enterprise teams — Taskio has everything built in so you never need another tool.
              </p>
            </div>
          </FadeIn>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 18 }}>
            {features.map((f, i) => <FeatureCard key={f.title} {...f} delay={i * 60} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════ */}
      <section style={{ padding: "88px 28px", background: "#faf9ff" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span style={{ display: "inline-block", background: "#dbeafe", color: "#1d4ed8", fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 99, marginBottom: 16, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Simple setup
              </span>
              <h2 style={{ fontSize: "clamp(28px,4.5vw,46px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#111827" }}>
                Up and running in <span style={{ background: "linear-gradient(90deg,#7c3aed,#0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>3 steps</span>
              </h2>
            </div>
          </FadeIn>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 36 }}>
            {[
              { step: "01", icon: Users, title: "Create your workspace", desc: "Sign up and create your first workspace. Invite teammates in seconds.", color: "#7c3aed", bg: "#ede9fe" },
              { step: "02", icon: Folder, title: "Add projects & tasks", desc: "Structure your work into projects. Add tasks with priorities and deadlines.", color: "#0ea5e9", bg: "#dbeafe" },
              { step: "03", icon: TrendingUp, title: "Track & deliver", desc: "Monitor live analytics, chat with your team, and ship with confidence.", color: "#10b981", bg: "#dcfce7" },
            ].map(({ step, icon: Icon, title, desc, color, bg }, i) => (
              <FadeIn key={step} delay={i * 120}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ position: "relative", display: "inline-block", marginBottom: 20 }}>
                    <div style={{ width: 72, height: 72, borderRadius: 20, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={30} style={{ color }} />
                    </div>
                    <div style={{
                      position: "absolute", top: -8, right: -10,
                      width: 24, height: 24, borderRadius: "50%",
                      background: color, color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: 900, border: "2px solid #fff",
                    }}>{step}</div>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.6 }}>{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════ */}
      <section id="testimonials" style={{ padding: "88px 28px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span style={{ display: "inline-block", background: "#fef9c3", color: "#a16207", fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 99, marginBottom: 16, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                ★ Loved by teams
              </span>
              <h2 style={{ fontSize: "clamp(28px,4.5vw,46px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#111827" }}>
                Trusted by 2,000+ teams worldwide
              </h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {testimonials.map((t, i) => <TestiCard key={t.name} {...t} delay={i * 80} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          PRICING
      ═══════════════════════════════ */}
      {/* ═══════════════════════════════
          COMPLETELY FREE VALUE PROP
      ═══════════════════════════════ */}
      <section id="why-free" style={{ padding: "96px 28px", background: "#faf9ff" }}>
        <div style={{ maxWidth: 1050, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <span style={{ display: "inline-block", background: "#dcfce7", color: "#15803d", fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 99, marginBottom: 16, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Zero Cost, Infinite Value
              </span>
              <h2 style={{ fontSize: "clamp(28px,4.5vw,46px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#111827", marginBottom: 14 }}>
                100% Free. No Paywalls.<br />
                <span style={{ background: "linear-gradient(90deg,#7c3aed,#0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  No Compromises.
                </span>
              </h2>
              <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 620, margin: "0 auto", lineHeight: 1.7 }}>
                Unlike other platforms that restrict essential features to force you onto expensive monthly plans, Taskio is built to be open, accessible, and completely free.
              </p>
            </div>
          </FadeIn>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28, alignItems: "stretch" }}>
            {/* Left Box: Philosophy & Commitment */}
            <FadeIn delay={100}>
              <div style={{
                background: "#fff",
                border: "1.5px solid #e5e7eb",
                borderRadius: 20,
                padding: "36px 32px",
                height: "100%",
                boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 18 }}>Our Commitment</h3>
                <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, marginBottom: 16 }}>
                  We believe productivity software shouldn't carry a monthly penalty per seat. Your team sizes, workspaces, and projects should grow naturally without scaling up your bill.
                </p>
                <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, marginBottom: 20 }}>
                  Taskio provides full, unrestricted access to the entire platform. No hidden upgrades, no trials, and no "pro-only" features locked behind paywalls.
                </p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    "Unlimited workspaces and projects",
                    "Full analytics dashboard included",
                    "Unrestricted team size and members",
                    "Real-time workspace chat for all",
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: "#374151" }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%",
                        background: "#ede9fe",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <Check size={10} style={{ color: "#7c3aed" }} />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Right Box: Comparison */}
            <FadeIn delay={200}>
              <div style={{
                background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                borderRadius: 20,
                padding: "36px 32px",
                height: "100%",
                color: "#fff",
                boxShadow: "0 20px 40px rgba(124,58,237,0.18)",
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 18 }}>How We Compare</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { title: "No Per-Seat Pricing", desc: "Most apps charge $9–$29 per user every month. With Taskio, invite 5 or 500 team members for $0." },
                    { title: "No Locked Features", desc: "We don't disable charts, filters, archives, or chat to push you to upgrade. Everything is active from day one." },
                    { title: "No Constant Upselling", desc: "No frustrating alert boxes, locked buttons, or hidden menus. Enjoy a professional, distraction-free environment." },
                  ].map((comp, idx) => (
                    <div key={idx} style={{ borderBottom: idx < 2 ? "1px solid rgba(255,255,255,0.15)" : "none", paddingBottom: idx < 2 ? 14 : 0 }}>
                      <p style={{ fontSize: 14.5, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{comp.title}</p>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>{comp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          FINAL CTA
      ═══════════════════════════════ */}
      <section style={{
        padding: "88px 28px",
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(167,139,250,0.15) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <FadeIn>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", borderRadius: 99, padding: "5px 16px", marginBottom: 28, color: "#c4b5fd", fontSize: 13, fontWeight: 600 }}>
              <Sparkles size={13} /> Ready to ship faster?
            </div>
            <h2 style={{ fontSize: "clamp(32px,5vw,54px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", marginBottom: 18, lineHeight: 1.1 }}>
              Your team's next level awaits.
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", marginBottom: 36 }}>
              Join thousands of teams who use Taskio to collaborate smarter and ship faster — it's free to start.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
              <Link to="/sign-up" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#fff", color: "#111827",
                fontWeight: 800, fontSize: 15, textDecoration: "none",
                padding: "14px 30px", borderRadius: 12,
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}
              >
                Create free account <ArrowRight size={17} />
              </Link>
              <Link to="/sign-in" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                border: "1.5px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.08)",
                color: "#e5e7eb", fontWeight: 600, fontSize: 15, textDecoration: "none",
                padding: "14px 30px", borderRadius: 12, transition: "all 0.2s",
              }}>
                Sign in
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ═══════════════════════════════
          FOOTER
      ═══════════════════════════════ */}
      <footer style={{ background: "#fff", borderTop: "1px solid #f3f4f6", padding: "52px 28px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 36, marginBottom: 40 }}>
            <div style={{ gridColumn: "span 2" }}>
              <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 14 }}>
                <img src="/Logo.png" alt="Taskio" style={{ width: 30, height: 30 }} />
                <span style={{ fontSize: 17, fontWeight: 800, color: "#111827" }}>Taskio</span>
              </Link>
              <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.65, maxWidth: 240 }}>
                The all-in-one project management platform for modern teams. Organize, track, and ship.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>Product</p>
              {["Features", "Completely Free", "Dashboard", "My Tasks"].map(item => (
                <a key={item} href={item === "Completely Free" ? "#why-free" : item === "Features" ? "#features" : "#"} style={{ display: "block", fontSize: 13.5, color: "#6b7280", textDecoration: "none", marginBottom: 9, transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "#111827"}
                  onMouseLeave={e => e.target.style.color = "#6b7280"}
                >{item}</a>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>Account</p>
              <Link to="/sign-in" style={{ display: "block", fontSize: 13.5, color: "#6b7280", textDecoration: "none", marginBottom: 9 }}>Sign in</Link>
              <Link to="/sign-up" style={{ display: "block", fontSize: 13.5, color: "#6b7280", textDecoration: "none", marginBottom: 9 }}>Sign up</Link>
              <Link to="/forgot-password" style={{ display: "block", fontSize: 13.5, color: "#6b7280", textDecoration: "none" }}>Reset password</Link>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10 }}>
            <p style={{ fontSize: 12.5, color: "#9ca3af" }}>© 2026 Taskio. All rights reserved.</p>
            <p style={{ fontSize: 12.5, color: "#9ca3af" }}>Built with ❤️ for productive teams</p>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════
          GLOBAL STYLES & KEYFRAMES
      ═══════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes floatA {
          0%,100% { transform: translateY(0) rotate(-1deg); }
          50%     { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0) rotate(1deg); }
          50%     { transform: translateY(10px) rotate(-1deg); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.33%); }
        }
        @keyframes borderMove {
          0% { background-position: 0 0, 0% 50%; }
          50% { background-position: 0 0, 100% 50%; }
          100% { background-position: 0 0, 0% 50%; }
        }

        .hide-mobile { display: flex !important; }
        .show-mobile { display: none !important; }

        @media (max-width: 767px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
