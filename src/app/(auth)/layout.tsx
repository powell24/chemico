import { ParticleBackground } from "./_components/particle-background"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-logo   { animation: fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both 0.1s; }
        .anim-head   { animation: fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both 0.25s; }
        .anim-stats  { animation: fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both 0.4s; }
        .anim-footer { animation: fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both 0.55s; }
      `}</style>

      {/* Left — brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden p-12 text-white"
        style={{ background: "linear-gradient(160deg, oklch(0.48 0.17 248) 0%, oklch(0.52 0.15 240) 50%, oklch(0.44 0.16 230) 100%)" }}
      >
        <ParticleBackground />

        {/* Logo */}
        <div className="relative flex items-center gap-3 anim-logo">
          <div className="h-9 w-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Aria</span>
        </div>

        {/* Headline + stats */}
        <div className="relative space-y-8">
          <div className="space-y-4 anim-head">
            <p className="text-4xl font-semibold leading-tight">
              Compliance &amp; SDS<br />Intelligence Copilot
            </p>
            <p className="text-base leading-relaxed max-w-sm text-white/65">
              AI-powered chemical lifecycle management. Stay ahead of regulatory
              requirements across all 50 locations.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 anim-stats">
            {[
              { value: "50+",  label: "Sites managed"  },
              { value: "12K+", label: "SDS documents"  },
              { value: "98%",  label: "Compliance rate" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/65">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/30 anim-footer">
          © 2026 The Chemico Group
        </p>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center bg-muted p-8 relative overflow-hidden">
        {/* Minimal line art */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 600 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {/* Three diagonal lines */}
          <line x1="-100" y1="200"  x2="700" y2="1000" stroke="oklch(0.52 0.15 240)" strokeWidth="1"   opacity="0.10" />
          <line x1="100"  y1="-100" x2="700" y2="500"  stroke="oklch(0.52 0.15 240)" strokeWidth="1"   opacity="0.07" />
          <line x1="400"  y1="-100" x2="700" y2="200"  stroke="oklch(0.67 0.12 187)" strokeWidth="0.8" opacity="0.08" />

          {/* Two accent dots */}
          <circle cx="200" cy="300" r="2" fill="oklch(0.52 0.15 240)" opacity="0.14" />
          <circle cx="480" cy="580" r="2" fill="oklch(0.67 0.12 187)" opacity="0.14" />
        </svg>

        <div className="relative z-10 w-full flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}
