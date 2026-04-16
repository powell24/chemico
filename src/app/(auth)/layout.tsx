export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden p-12 text-primary-foreground"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.38 0.16 245) 0%, oklch(0.52 0.15 240) 45%, oklch(0.58 0.13 210) 100%)",
        }}
      >
        {/* Chemical-themed SVG background */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 600 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            {/* Hex lattice dot grid */}
            <pattern id="hexdots" x="0" y="0" width="40" height="35" patternUnits="userSpaceOnUse">
              <circle cx="0"  cy="0"    r="1.5" fill="white" />
              <circle cx="20" cy="17.5" r="1.5" fill="white" />
              <circle cx="40" cy="0"    r="1.5" fill="white" />
              <circle cx="0"  cy="35"   r="1.5" fill="white" />
              <circle cx="40" cy="35"   r="1.5" fill="white" />
            </pattern>
          </defs>

          {/* Background dot lattice */}
          <rect width="100%" height="100%" fill="url(#hexdots)" opacity="0.07" />

          {/* ── Benzene ring (top-right) ── */}
          <g transform="translate(490,145)" opacity="0.13" stroke="white" fill="white" strokeLinecap="round">
            <polygon
              points="0,-70 60.6,-35 60.6,35 0,70 -60.6,35 -60.6,-35"
              fill="none" strokeWidth="1.5"
            />
            {/* Inner dashed circle — double-bond representation */}
            <circle cx="0" cy="0" r="40" fill="none" strokeWidth="1.2" strokeDasharray="21 21" />
            {/* Vertex atoms */}
            <circle cx="0"     cy="-70" r="4.5" />
            <circle cx="60.6"  cy="-35" r="4.5" />
            <circle cx="60.6"  cy="35"  r="4.5" />
            <circle cx="0"     cy="70"  r="4.5" />
            <circle cx="-60.6" cy="35"  r="4.5" />
            <circle cx="-60.6" cy="-35" r="4.5" />
            {/* Substituent bonds extending outward */}
            <line x1="0"    y1="-70" x2="0"   y2="-105" strokeWidth="1.5" />
            <line x1="60.6" y1="-35" x2="86"  y2="-50"  strokeWidth="1.5" />
            <line x1="60.6" y1="35"  x2="86"  y2="50"   strokeWidth="1.5" />
            <line x1="0"    y1="70"  x2="0"   y2="105"  strokeWidth="1.5" />
            <circle cx="0"  cy="-109" r="3.5" />
            <circle cx="89" cy="-52"  r="3.5" />
            <circle cx="89" cy="52"   r="3.5" />
            <circle cx="0"  cy="109"  r="3.5" />
          </g>

          {/* ── Tetrahedral molecule (left mid) ── */}
          <g transform="translate(38,370)" opacity="0.11" stroke="white" fill="white" strokeLinecap="round">
            <circle cx="0"  cy="0"   r="7" />
            <circle cx="55" cy="-28" r="5" />
            <circle cx="55" cy="28"  r="5" />
            <circle cx="0"  cy="-68" r="5" />
            <circle cx="0"  cy="68"  r="5" />
            <line x1="0" y1="0"   x2="55" y2="-28" strokeWidth="1.5" />
            <line x1="0" y1="0"   x2="55" y2="28"  strokeWidth="1.5" />
            <line x1="0" y1="0"   x2="0"  y2="-68" strokeWidth="1.5" />
            <line x1="0" y1="0"   x2="0"  y2="68"  strokeWidth="1.5" />
            <line x1="55" y1="-28" x2="55" y2="28"  strokeWidth="1" strokeDasharray="4 3" />
          </g>

          {/* ── Atom with electron orbits (mid-right) ── */}
          <g transform="translate(510,490)" opacity="0.09" stroke="white" fill="white">
            <circle cx="0" cy="0" r="9"  fill="none" strokeWidth="2" />
            <circle cx="0" cy="0" r="4"  />
            <ellipse cx="0" cy="0" rx="55" ry="18" fill="none" strokeWidth="1.2" transform="rotate(0)"   />
            <ellipse cx="0" cy="0" rx="55" ry="18" fill="none" strokeWidth="1.2" transform="rotate(60)"  />
            <ellipse cx="0" cy="0" rx="55" ry="18" fill="none" strokeWidth="1.2" transform="rotate(120)" />
            {/* Electrons on orbits */}
            <circle cx="55"   cy="0"    r="3.5" />
            <circle cx="-27.5" cy="47.6" r="3.5" />
            <circle cx="27.5" cy="-47.6" r="3.5" />
          </g>

          {/* ── Zigzag carbon chain (lower area) ── */}
          <g transform="translate(25,710)" opacity="0.10" stroke="white" fill="white" strokeLinecap="round">
            {([
              [0, 0], [55, -32], [110, 0], [165, -32], [220, 0], [275, -32],
            ] as [number, number][]).map(([x, y], i, arr) => (
              <g key={i}>
                <circle cx={x} cy={y} r="5" />
                {i < arr.length - 1 && (
                  <line x1={x} y1={y} x2={arr[i + 1][0]} y2={arr[i + 1][1]} strokeWidth="1.5" />
                )}
                {/* OH branch on every even atom */}
                {i % 2 === 0 && i > 0 && (
                  <>
                    <line x1={x} y1={y} x2={x} y2={y + 36} strokeWidth="1.5" />
                    <circle cx={x} cy={y + 40} r="4" />
                  </>
                )}
              </g>
            ))}
          </g>

          {/* ── Partial hex cluster (bottom-right) ── */}
          <g transform="translate(430,775)" opacity="0.09" stroke="white" fill="none" strokeWidth="1.2" strokeLinecap="round">
            <polygon points="0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20" />
            <polygon points="34.6,-20 69.3,-40 69.3,0 34.6,20" />
            <polygon points="-34.6,-20 0,-40 0,-80 -34.6,-60" />
          </g>

          {/* ── Faint chemical formula labels ── */}
          <g fill="white" opacity="0.055" fontFamily="monospace" fontSize="12" letterSpacing="0.5">
            <text x="42"  y="575">H₂SO₄</text>
            <text x="295" y="255">NaOH</text>
            <text x="75"  y="845">C₆H₆</text>
            <text x="435" y="625">CH₄</text>
            <text x="22"  y="185">CO₂</text>
            <text x="330" y="785">HNO₃</text>
          </g>
        </svg>

        {/* Content — above the SVG */}
        <div className="relative flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-sm">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Chemico Group</span>
        </div>

        <div className="relative space-y-6">
          <blockquote className="space-y-3">
            <p className="text-3xl font-semibold leading-snug">
              Compliance &amp; SDS<br />Intelligence Copilot
            </p>
            <p className="text-primary-foreground/70 text-base leading-relaxed max-w-sm">
              AI-powered chemical lifecycle management. Stay ahead of regulatory
              requirements across all 50 locations.
            </p>
          </blockquote>

          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { value: "50+",  label: "Sites managed"  },
              { value: "12K+", label: "SDS documents"  },
              { value: "98%",  label: "Compliance rate" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-2xl font-bold text-accent">{stat.value}</p>
                <p className="text-xs text-primary-foreground/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-primary-foreground/40">
          © 2026 The Chemico Group. Powered by Zaigo AI.
        </p>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center bg-muted p-8">
        {children}
      </div>
    </div>
  )
}
