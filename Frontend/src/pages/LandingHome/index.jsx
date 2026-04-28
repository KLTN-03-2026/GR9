import React from "react";
import { Link } from "react-router-dom";

const departmentNodes = [
  {
    title: "HR",
    icon: "group",
    description: "Talent routing, onboarding copilots, policy automation.",
    x: 13,
    y: 18,
    z: -90,
    accent: "#89f5e7",
  },
  {
    title: "IT",
    icon: "dns",
    description: "Incident triage, knowledge sync, secure service resolution.",
    x: 74,
    y: 14,
    z: 120,
    accent: "#d8e3fb",
  },
  {
    title: "Finance",
    icon: "account_balance",
    description: "Approval intelligence, variance alerts, revenue visibility.",
    x: 80,
    y: 63,
    z: -60,
    accent: "#6bd8cb",
  },
  {
    title: "Operations",
    icon: "hub",
    description: "Live process orchestration across teams and suppliers.",
    x: 16,
    y: 72,
    z: 90,
    accent: "#ffb59a",
  },
  {
    title: "Sales",
    icon: "trending_up",
    description: "Pipeline insight, response drafting, next-best actions.",
    x: 52,
    y: 84,
    z: 150,
    accent: "#89f5e7",
  },
  {
    title: "Support",
    icon: "headset_mic",
    description: "Context-aware case resolution powered by shared memory.",
    x: 38,
    y: 8,
    z: 70,
    accent: "#bcc7de",
  },
];

const capabilities = [
  {
    icon: "neurology",
    title: "Neural Knowledge Mesh",
    description:
      "Thousands of contextual signals converge into a living enterprise graph that keeps every answer grounded.",
  },
  {
    icon: "lan",
    title: "Cross-Department Flow",
    description:
      "Virtual optical links stream intent, documents, and approvals between HR, IT, Finance, and Operations in real time.",
  },
  {
    icon: "shield_lock",
    title: "Executive-Grade Control",
    description:
      "Role-aware orchestration, observability, and governance built for high-trust enterprise environments.",
  },
];

const orchestrationSteps = [
  {
    number: "01",
    title: "Ingest live knowledge",
    description:
      "Policies, tickets, SOPs, contracts, and CRM records are continuously indexed into a shared intelligence layer.",
  },
  {
    number: "02",
    title: "Reason across workflows",
    description:
      "Agents map dependencies, identify bottlenecks, and trigger the right team actions with explainable confidence.",
  },
  {
    number: "03",
    title: "Deploy with feedback loops",
    description:
      "Every outcome retrains the system’s routing logic so teams get faster, sharper decisions over time.",
  },
];

const platformCards = [
  {
    title: "Decision Cockpit",
    label: "Executive layer",
    description:
      "See knowledge flow, escalation pressure, and team throughput in one cinematic operational view.",
  },
  {
    title: "Agent Command Grid",
    label: "Automation layer",
    description:
      "Spin up specialist AI agents across internal departments without losing governance or traceability.",
  },
  {
    title: "Trust Fabric",
    label: "Security layer",
    description:
      "Zero-friction permissions, audit trails, and policy checkpoints wrapped directly around every workflow.",
  },
];

const stats = [
  { value: "18x", label: "Faster internal answers" },
  { value: "94%", label: "Workflow visibility coverage" },
  { value: "24/7", label: "AI knowledge availability" },
  { value: "3.2M+", label: "Signals synchronized daily" },
];

const testimonials = [
  {
    quote:
      "The new orchestration layer feels like a command center for the whole business, not just another chatbot.",
    name: "Linh Tran",
    role: "Chief Transformation Officer",
  },
  {
    quote:
      "Our IT and Finance teams now operate on the same context stream. Escalations dropped almost immediately.",
    name: "Daniel Vo",
    role: "VP of Enterprise Systems",
  },
  {
    quote:
      "It delivers the premium visual language our leadership wanted, while actually making workflows faster.",
    name: "Mai Nguyen",
    role: "Head of Digital Experience",
  },
];

const footerGroups = [
  {
    title: "Platform",
    links: ["Knowledge Mesh", "AI Agents", "Trust Fabric"],
  },
  {
    title: "Solutions",
    links: ["HR Ops", "IT Service", "Finance Automation"],
  },
  {
    title: "Company",
    links: ["About", "Security", "Contact"],
  },
];

const ambientParticles = Array.from({ length: 140 }, (_, index) => ({
  id: index,
  size: (index % 4) + 1,
  left: (index * 17) % 100,
  top: (index * 23) % 100,
  duration: 10 + (index % 9) * 1.4,
  delay: (index % 13) * 0.6,
  opacity: 0.2 + (index % 5) * 0.12,
}));

const microNodes = Array.from({ length: 90 }, (_, index) => ({
  id: index,
  left: 8 + ((index * 11) % 84),
  top: 10 + ((index * 19) % 78),
  delay: (index % 12) * 0.35,
  duration: 4.5 + (index % 7),
}));

const neuralLinks = departmentNodes.map((node, index) => {
  const centerX = 50;
  const centerY = 50;
  const dx = centerX - node.x;
  const dy = centerY - node.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return {
    id: `${node.title}-${index}`,
    left: node.x,
    top: node.y,
    width: distance,
    angle,
    delay: index * 0.8,
    accent: node.accent,
  };
});

const LandingHome = () => {
  return (
    <div
      className="min-h-screen text-[var(--hero-text)] selection:bg-primary/30 selection:text-[var(--hero-text)]"
      style={{
        "--hero-bg": "#101416",
        "--hero-bg-deep": "#161a1c",
        "--hero-surface": "#1b2022",
        "--hero-surface-high": "#202628",
        "--hero-text": "#eff1f3",
        "--hero-muted": "#bcc9c6",
        "--hero-primary": "#6bd8cb",
        "--hero-primary-bright": "#89f5e7",
        "--hero-primary-deep": "#005049",
        "--hero-secondary": "#bcc7de",
        "--hero-secondary-deep": "#3c475a",
        "--hero-tertiary": "#ffb59a",
      }}
    >
      <style>{`
        .neural-shell {
          background:
            radial-gradient(circle at top, rgba(107, 216, 203, 0.14), transparent 34%),
            radial-gradient(circle at 85% 18%, rgba(255, 181, 154, 0.16), transparent 20%),
            radial-gradient(circle at 20% 80%, rgba(188, 199, 222, 0.14), transparent 26%),
            linear-gradient(180deg, var(--hero-bg) 0%, var(--hero-bg-deep) 45%, #0d1113 100%);
        }
        .neural-grid {
          background-image:
            linear-gradient(rgba(188, 201, 198, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(188, 201, 198, 0.08) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: radial-gradient(circle at center, black 55%, transparent 100%);
        }
        .glass-panel {
          background: linear-gradient(180deg, rgba(27, 32, 34, 0.78), rgba(16, 20, 22, 0.58));
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            0 28px 80px rgba(0, 0, 0, 0.34);
        }
        .hero-scene {
          perspective: 1800px;
          transform-style: preserve-3d;
        }
        .scene-drift {
          animation: scene-drift 14s ease-in-out infinite;
        }
        .core-pulse {
          animation: core-pulse 4.8s ease-in-out infinite;
        }
        .ring-rotate {
          animation: ring-rotate 22s linear infinite;
        }
        .ring-rotate-slow {
          animation: ring-rotate-reverse 30s linear infinite;
        }
        .particle-float {
          animation: particle-float var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
        }
        .signal-run {
          overflow: hidden;
        }
        .signal-run::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 38%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.85), transparent);
          filter: blur(1px);
          animation: signal-run 2.8s linear infinite;
          animation-delay: var(--delay);
        }
        .node-breathe {
          animation: node-breathe var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
        }
        .data-scan {
          animation: data-scan 7s linear infinite;
        }
        .halo-spin {
          animation: halo-spin 18s linear infinite;
        }
        @keyframes scene-drift {
          0%, 100% { transform: rotateX(10deg) rotateY(-7deg) translateY(0px); }
          50% { transform: rotateX(14deg) rotateY(7deg) translateY(-10px); }
        }
        @keyframes core-pulse {
          0%, 100% { transform: translateZ(90px) scale(1); box-shadow: 0 0 60px rgba(107, 216, 203, 0.28), 0 0 120px rgba(188, 199, 222, 0.14); }
          50% { transform: translateZ(110px) scale(1.06); box-shadow: 0 0 90px rgba(107, 216, 203, 0.46), 0 0 160px rgba(255, 181, 154, 0.18); }
        }
        @keyframes ring-rotate {
          from { transform: translate(-50%, -50%) rotateX(72deg) rotateZ(0deg); }
          to { transform: translate(-50%, -50%) rotateX(72deg) rotateZ(360deg); }
        }
        @keyframes ring-rotate-reverse {
          from { transform: translate(-50%, -50%) rotateX(72deg) rotateZ(360deg); }
          to { transform: translate(-50%, -50%) rotateX(72deg) rotateZ(0deg); }
        }
        @keyframes particle-float {
          0%, 100% { transform: translate3d(0, 0, 0) scale(0.92); opacity: 0.25; }
          50% { transform: translate3d(0, -18px, 20px) scale(1.12); opacity: 1; }
        }
        @keyframes signal-run {
          0% { transform: translateX(-140%); }
          100% { transform: translateX(360%); }
        }
        @keyframes node-breathe {
          0%, 100% { transform: translate3d(-50%, -50%, 0px) scale(0.9); opacity: 0.35; }
          50% { transform: translate3d(-50%, -50%, 30px) scale(1.2); opacity: 1; }
        }
        @keyframes data-scan {
          0% { transform: translateY(-110%); }
          100% { transform: translateY(260%); }
        }
        @keyframes halo-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="neural-shell relative overflow-hidden">
        <div className="neural-grid pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(circle_at_top,rgba(107,216,203,0.18),transparent_46%)]" />

        <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[color:rgba(16,20,22,0.78)] backdrop-blur-2xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link
              to="/"
              className="font-heading text-xl font-extrabold tracking-[0.18em] text-[var(--hero-text)] uppercase"
            >
              Neural Voyager
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              <a
                href="#capabilities"
                className="text-sm font-medium text-white/70 transition-colors hover:text-primary"
              >
                Capabilities
              </a>
              <a
                href="#orchestration"
                className="text-sm font-medium text-white/70 transition-colors hover:text-primary"
              >
                Orchestration
              </a>
              <a
                href="#impact"
                className="text-sm font-medium text-white/70 transition-colors hover:text-primary"
              >
                Impact
              </a>
              <Link
                to="/apply-provider"
                className="text-sm font-medium text-white/70 transition-colors hover:text-primary"
              >
                Provider Portal
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/signup"
                className="rounded-full border border-white/15 bg-white/[0.08] px-5 py-2.5 text-sm font-semibold text-[var(--hero-text)] transition-all hover:border-primary/40 hover:bg-white/[0.12]"
              >
                Live Demo
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-[linear-gradient(135deg,var(--hero-primary-bright),var(--hero-secondary))] px-5 py-2.5 text-sm font-semibold text-[var(--hero-bg)] shadow-[0_0_24px_rgba(107,216,203,0.28)] transition-transform hover:scale-[1.02]"
              >
                Start Now
              </Link>
            </div>
          </div>
        </nav>

        <header className="relative overflow-hidden px-6 pb-24 pt-32 md:pt-36">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="relative z-10 max-w-3xl">
              <span className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-primary-fixed">
                Neural Knowledge Web 3D
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_16px_rgba(107,216,203,0.9)]" />
              </span>

              <h1 className="mt-8 font-heading text-5xl leading-[0.95] font-extrabold tracking-[-0.04em] text-[var(--hero-text)] md:text-7xl xl:text-[5.6rem]">
                Build a
                <span className="bg-[linear-gradient(135deg,var(--hero-primary-bright),var(--hero-secondary),var(--hero-tertiary))] bg-clip-text text-transparent">
                  {" "}
                  cinematic AI command center
                </span>
                {" "}for every team.
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--hero-muted)] md:text-xl">
                A multi-layer 3D intelligence experience where HR, IT, Finance,
                and Operations become glowing data nodes streaming live context
                into one trusted AI core.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--hero-primary-bright),var(--hero-secondary))] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[var(--hero-bg)] shadow-[0_12px_36px_rgba(107,216,203,0.22)] transition-transform hover:scale-[1.02]"
                >
                  Launch Experience
                </Link>
                <a
                  href="#orchestration"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.08] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[var(--hero-text)] backdrop-blur-xl transition-colors hover:border-secondary/40 hover:bg-white/[0.12]"
                >
                  Explore Workflow
                </a>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {capabilities.map((item) => (
                  <article
                    key={item.title}
                    className="glass-panel rounded-[1.75rem] p-5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.08] text-primary-fixed shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                      <span className="material-symbols-outlined text-[26px]">
                        {item.icon}
                      </span>
                    </div>
                    <h3 className="mt-4 font-heading text-lg font-bold text-[var(--hero-text)]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--hero-muted)]">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <div className="hero-scene relative mx-auto h-[680px] w-full max-w-[720px]">
                <div className="scene-drift absolute inset-0">
                  <div className="absolute inset-[10%] rounded-full border border-primary/10 bg-[radial-gradient(circle_at_center,rgba(107,216,203,0.08),transparent_62%)] blur-3xl" />
                  <div className="absolute left-1/2 top-1/2 h-[84%] w-[84%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary/10" />

                  {ambientParticles.map((particle) => (
                    <span
                      key={particle.id}
                      className="particle-float absolute rounded-full bg-white"
                      style={{
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                        width: `${particle.size * 2}px`,
                        height: `${particle.size * 2}px`,
                        opacity: particle.opacity,
                        boxShadow:
                          particle.id % 2 === 0
                            ? "0 0 14px rgba(107,216,203,0.75)"
                            : "0 0 16px rgba(188,199,222,0.65)",
                        "--duration": `${particle.duration}s`,
                        "--delay": `${particle.delay}s`,
                      }}
                    />
                  ))}

                  <div className="ring-rotate absolute left-1/2 top-1/2 h-[68%] w-[68%] rounded-full border border-primary/35 shadow-[0_0_50px_rgba(107,216,203,0.12)]" />
                  <div className="ring-rotate-slow absolute left-1/2 top-1/2 h-[88%] w-[88%] rounded-full border border-secondary/25 shadow-[0_0_60px_rgba(188,199,222,0.12)]" />
                  <div className="absolute left-1/2 top-1/2 h-[56%] w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8 bg-[radial-gradient(circle_at_center,rgba(27,32,34,0.24),rgba(27,32,34,0))]" />

                  {neuralLinks.map((link) => (
                    <div
                      key={link.id}
                      className="signal-run absolute h-px origin-left"
                      style={{
                        left: `${link.left}%`,
                        top: `${link.top}%`,
                        width: `${link.width}%`,
                        transform: `rotate(${link.angle}deg)`,
                        background: `linear-gradient(90deg, ${link.accent}99, rgba(255,255,255,0.08))`,
                        boxShadow: `0 0 16px ${link.accent}55`,
                        "--delay": `${link.delay}s`,
                      }}
                    />
                  ))}

                  {microNodes.map((node) => (
                    <span
                      key={node.id}
                      className="node-breathe absolute h-1.5 w-1.5 rounded-full"
                      style={{
                        left: `${node.left}%`,
                        top: `${node.top}%`,
                        background:
                          node.id % 2 === 0
                            ? "rgba(107,216,203,0.85)"
                            : "rgba(255,181,154,0.82)",
                        boxShadow:
                          node.id % 2 === 0
                            ? "0 0 12px rgba(107,216,203,0.78)"
                            : "0 0 12px rgba(255,181,154,0.72)",
                        "--delay": `${node.delay}s`,
                        "--duration": `${node.duration}s`,
                      }}
                    />
                  ))}

                  <div className="core-pulse glass-panel absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full">
                    <div className="halo-spin absolute inset-3 rounded-full border border-primary/25 border-dashed" />
                    <div className="absolute inset-5 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.95),rgba(107,216,203,0.25)_26%,rgba(16,20,22,0.86)_70%)]" />
                    <div className="absolute inset-0 overflow-hidden rounded-full">
                      <div className="data-scan absolute inset-x-6 top-0 h-14 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(107,216,203,0.22),rgba(255,255,255,0))] blur-md" />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-primary-fixed/80">
                        AI Core
                      </span>
                      <span className="mt-2 font-heading text-3xl font-extrabold text-[var(--hero-text)]">
                        SYNAPSE
                      </span>
                      <span className="mt-2 text-[11px] uppercase tracking-[0.25em] text-white/55">
                        Unified reasoning layer
                      </span>
                    </div>
                  </div>

                  {departmentNodes.map((node, index) => (
                    <article
                      key={node.title}
                      className="glass-panel absolute w-40 rounded-[1.4rem] p-4"
                      style={{
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                        transform: `translate3d(-50%, -50%, ${node.z}px) rotateX(8deg) rotateY(${index % 2 === 0 ? "-10deg" : "10deg"})`,
                      }}
                    >
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-2xl"
                        style={{
                          background: `${node.accent}20`,
                          boxShadow: `inset 0 0 0 1px ${node.accent}40, 0 0 18px ${node.accent}35`,
                        }}
                      >
                        <span
                          className="material-symbols-outlined text-[24px]"
                          style={{ color: node.accent }}
                        >
                          {node.icon}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <h3 className="font-heading text-lg font-bold text-[var(--hero-text)]">
                          {node.title}
                        </h3>
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            background: node.accent,
                            boxShadow: `0 0 14px ${node.accent}`,
                          }}
                        />
                      </div>
                      <p className="mt-2 text-xs leading-5 text-[var(--hero-muted)]">
                        {node.description}
                      </p>
                    </article>
                  ))}

                  <div className="glass-panel absolute bottom-5 left-5 w-48 rounded-[1.6rem] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-primary-fixed/75">
                      Throughput
                    </p>
                    <p className="mt-2 font-heading text-3xl font-extrabold text-[var(--hero-text)]">
                      12.8 Tb/s
                    </p>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                      <div className="h-full w-[78%] rounded-full bg-[linear-gradient(90deg,var(--hero-primary-bright),var(--hero-secondary))] shadow-[0_0_18px_rgba(107,216,203,0.5)]" />
                    </div>
                    <p className="mt-3 text-xs text-[var(--hero-muted)]">
                      Continuous optical knowledge flow into the central AI
                      reasoning core.
                    </p>
                  </div>

                  <div className="glass-panel absolute right-4 top-10 w-52 rounded-[1.6rem] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-secondary/75">
                      Neural Density
                    </p>
                    <div className="mt-4 grid grid-cols-6 gap-1.5">
                      {Array.from({ length: 24 }, (_, index) => (
                        <span
                          key={index}
                          className="h-3 rounded-full"
                          style={{
                            background:
                              index % 3 === 0
                                ? "rgba(107,216,203,0.95)"
                                : "rgba(188,199,222,0.72)",
                            boxShadow:
                              index % 3 === 0
                                ? "0 0 10px rgba(107,216,203,0.48)"
                                : "0 0 10px rgba(188,199,222,0.38)",
                            opacity: 0.35 + ((index % 6) + 1) * 0.1,
                          }}
                        />
                      ))}
                    </div>
                    <p className="mt-4 text-xs text-[var(--hero-muted)]">
                      Thousands of micro-signals rendered as a living 3D
                      enterprise web.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section id="capabilities" className="px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-3xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-fixed/70">
                Platform Depth
              </span>
              <h2 className="mt-4 font-heading text-4xl font-extrabold tracking-[-0.03em] text-[var(--hero-text)] md:text-5xl">
                Glassmorphism surfaces wrapped around a living knowledge
                universe.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--hero-muted)]">
                Every card, control, and data lens is designed to float above a
                detailed neural backdrop without sacrificing clarity or trust.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="glass-panel rounded-[2rem] p-7 md:p-8">
                <div className="grid gap-6 md:grid-cols-3">
                  {platformCards.map((card) => (
                    <article
                      key={card.title}
                      className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary-fixed/70">
                        {card.label}
                      </p>
                      <h3 className="mt-4 font-heading text-2xl font-bold text-[var(--hero-text)]">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[var(--hero-muted)]">
                        {card.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-[2rem] p-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-secondary/75">
                  Live Signal Board
                </p>
                <div className="mt-6 space-y-4">
                  {[
                    "Policy update cascaded from HR to Support in 1.2s",
                    "Finance approval agent reconciled 184 requests",
                    "IT incident swarm rerouted high-priority service queue",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.3rem] border border-white/10 bg-white/[0.06] px-4 py-4 text-sm text-[var(--hero-text)]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="orchestration" className="px-6 py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-fixed/70">
                Workflow Intelligence
              </span>
              <h2 className="mt-4 font-heading text-4xl font-extrabold tracking-[-0.03em] text-[var(--hero-text)] md:text-5xl">
                How the 3D orchestration layer thinks.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--hero-muted)]">
                The visual system is not decoration. It mirrors how knowledge
                enters, transforms, and propagates through the enterprise.
              </p>
            </div>

            <div className="glass-panel rounded-[2rem] p-7 md:p-8">
              <div className="space-y-6">
                {orchestrationSteps.map((step) => (
                  <div
                    key={step.number}
                    className="flex gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(107,216,203,0.22),rgba(188,199,222,0.28))] font-heading text-sm font-extrabold text-[var(--hero-text)]">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-[var(--hero-text)]">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--hero-muted)]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="impact" className="px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <article
                  key={stat.label}
                  className="glass-panel rounded-[1.8rem] p-6 text-center"
                >
                  <p className="font-heading text-4xl font-extrabold text-[var(--hero-text)] md:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[var(--hero-muted)]">
                    {stat.label}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-fixed/70">
                Enterprise Proof
              </span>
              <h2 className="mt-4 font-heading text-4xl font-extrabold tracking-[-0.03em] text-[var(--hero-text)] md:text-5xl">
                Premium enough for leadership. Practical enough for operators.
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {testimonials.map((item) => (
                <article
                  key={item.name}
                  className="glass-panel rounded-[1.8rem] p-7"
                >
                  <span className="material-symbols-outlined text-5xl text-primary/35">
                    format_quote
                  </span>
                  <p className="mt-5 text-base leading-7 text-[var(--hero-text)]">
                    {item.quote}
                  </p>
                  <div className="mt-8">
                    <p className="font-heading text-lg font-bold text-[var(--hero-text)]">
                      {item.name}
                    </p>
                    <p className="text-sm text-white/60">{item.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="glass-panel relative overflow-hidden rounded-[2.5rem] p-10 text-center md:p-16">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(107,216,203,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(255,181,154,0.16),transparent_28%)]" />
              <div className="relative z-10 mx-auto max-w-3xl">
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-fixed/70">
                  Ready To Deploy
                </span>
                <h2 className="mt-4 font-heading text-4xl font-extrabold tracking-[-0.03em] text-[var(--hero-text)] md:text-6xl">
                  Turn your homepage into a high-trust AI flagship.
                </h2>
                <p className="mt-6 text-lg leading-8 text-[var(--hero-muted)]">
                  Launch a landing experience that feels like enterprise-grade
                  software cinema: immersive, credible, and conversion-focused.
                </p>
                <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                  <Link
                    to="/signup"
                    className="rounded-full bg-[linear-gradient(135deg,var(--hero-primary-bright),var(--hero-secondary))] px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[var(--hero-bg)] shadow-[0_14px_40px_rgba(107,216,203,0.24)] transition-transform hover:scale-[1.02]"
                  >
                    Activate Neural Demo
                  </Link>
                  <Link
                    to="/apply-provider"
                    className="rounded-full border border-white/15 bg-white/[0.08] px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[var(--hero-text)] transition-colors hover:bg-white/[0.12]"
                  >
                    Become a Partner
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/8 px-6 pb-10 pt-16">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
            <div>
              <span className="font-heading text-lg font-extrabold uppercase tracking-[0.18em] text-[var(--hero-text)]">
                Neural Voyager
              </span>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/60">
                A premium AI orchestration experience built around living
                knowledge, cinematic light, and enterprise trust.
              </p>
            </div>

            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-[var(--hero-text)]">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-white/60">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="transition-colors hover:text-primary-fixed">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-7xl border-t border-white/8 pt-8 text-xs uppercase tracking-[0.18em] text-white/45">
            © 2026 Neural Voyager. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingHome;
