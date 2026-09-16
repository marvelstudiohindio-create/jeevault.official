const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'diagrams');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Helper to write SVG
function writeSvg(filename, svgContent) {
  fs.writeFileSync(path.join(outDir, filename), svgContent.trim());
}

// 1. Q1 Question Diagram: 3 blocks connected by strings pulled by F = 60 N
writeSvg('nlm-q1.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 180" width="100%" height="100%">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
    </marker>
    <pattern id="hatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="10" stroke="#475569" stroke-width="1.5" />
    </pattern>
  </defs>
  <!-- Background ground -->
  <line x1="20" y1="130" x2="520" y2="130" stroke="#64748b" stroke-width="3" />
  <rect x="20" y="130" width="500" height="20" fill="url(#hatch)" opacity="0.6"/>

  <!-- Block A (10 kg) -->
  <rect x="50" y="70" width="70" height="60" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <text x="85" y="100" fill="#f8fafc" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle">A</text>
  <text x="85" y="120" fill="#94a3b8" font-size="12" font-family="sans-serif" text-anchor="middle">10 kg</text>

  <!-- String 1: A to B -->
  <line x1="120" y1="100" x2="190" y2="100" stroke="#cbd5e1" stroke-width="3"/>
  <text x="155" y="90" fill="#38bdf8" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">T₁</text>

  <!-- Block B (20 kg) -->
  <rect x="190" y="60" width="80" height="70" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <text x="230" y="95" fill="#f8fafc" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle">B</text>
  <text x="230" y="118" fill="#94a3b8" font-size="12" font-family="sans-serif" text-anchor="middle">20 kg</text>

  <!-- String 2: B to C -->
  <line x1="270" y1="100" x2="340" y2="100" stroke="#cbd5e1" stroke-width="3"/>
  <text x="305" y="90" fill="#38bdf8" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">T₂</text>

  <!-- Block C (30 kg) -->
  <rect x="340" y="50" width="90" height="80" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <text x="385" y="90" fill="#f8fafc" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle">C</text>
  <text x="385" y="115" fill="#94a3b8" font-size="12" font-family="sans-serif" text-anchor="middle">30 kg</text>

  <!-- Pulling Force F -->
  <line x1="430" y1="95" x2="500" y2="95" stroke="#38bdf8" stroke-width="3.5" marker-end="url(#arrow)"/>
  <text x="470" y="80" fill="#38bdf8" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">F = 60 N</text>
  <text x="270" y="168" fill="#94a3b8" font-size="13" font-family="sans-serif" text-anchor="middle">Smooth horizontal surface</text>
</svg>
`);

// 2. Q1 Solution Diagram: FBD
writeSvg('nlm-sol-q1.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 150" width="100%" height="100%">
  <defs>
    <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4ade80"/>
    </marker>
  </defs>
  <!-- Total system box -->
  <rect x="120" y="40" width="220" height="70" rx="8" fill="#1e293b" stroke="#4ade80" stroke-width="2"/>
  <text x="230" y="70" fill="#f8fafc" font-size="15" font-family="sans-serif" font-weight="bold" text-anchor="middle">System (10 + 20 + 30 kg)</text>
  <text x="230" y="95" fill="#94a3b8" font-size="13" font-family="sans-serif" text-anchor="middle">Total Mass M = 60 kg</text>

  <!-- Force F -->
  <line x1="340" y1="75" x2="430" y2="75" stroke="#4ade80" stroke-width="3" marker-end="url(#arrow-green)"/>
  <text x="390" y="65" fill="#4ade80" font-size="13" font-family="sans-serif" font-weight="bold">F = 60 N</text>

  <!-- Accel vector -->
  <line x1="200" y1="20" x2="260" y2="20" stroke="#facc15" stroke-width="2.5" marker-end="url(#arrow-green)"/>
  <text x="275" y="24" fill="#facc15" font-size="12" font-family="sans-serif" font-weight="bold">a = 1 m/s²</text>
  <text x="230" y="138" fill="#94a3b8" font-size="12" font-family="sans-serif" text-anchor="middle">T₁ = 10a = 10 N  |  T₂ = (10+20)a = 30 N</text>
</svg>
`);

// 3. Q2 Question Diagram: Pulley with 2 kg on left, 1 kg + spring + 3 kg on right
writeSvg('nlm-q2.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 380" width="100%" height="100%">
  <defs>
    <pattern id="hatch2" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="10" stroke="#475569" stroke-width="1.5" />
    </pattern>
  </defs>
  <!-- Ceiling -->
  <line x1="70" y1="30" x2="270" y2="30" stroke="#64748b" stroke-width="3"/>
  <rect x="70" y="15" width="200" height="15" fill="url(#hatch2)" opacity="0.6"/>

  <!-- Pulley bracket -->
  <line x1="170" y1="30" x2="170" y2="65" stroke="#94a3b8" stroke-width="4"/>
  <circle cx="170" cy="80" r="26" fill="#334155" stroke="#38bdf8" stroke-width="3"/>
  <circle cx="170" cy="80" r="5" fill="#f8fafc"/>

  <!-- Left String & 2 kg block -->
  <line x1="144" y1="80" x2="144" y2="180" stroke="#cbd5e1" stroke-width="2.5"/>
  <rect x="114" y="180" width="60" height="50" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="144" y="210" fill="#f8fafc" font-size="15" font-family="sans-serif" font-weight="bold" text-anchor="middle">2 kg</text>

  <!-- Right String to 1 kg block -->
  <line x1="196" y1="80" x2="196" y2="140" stroke="#cbd5e1" stroke-width="2.5"/>
  <rect x="171" y="140" width="50" height="42" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="196" y="166" fill="#f8fafc" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">1 kg</text>

  <!-- Spring connecting 1 kg and 3 kg -->
  <path d="M 196 182 L 196 190 L 186 195 L 206 205 L 186 215 L 206 225 L 186 235 L 206 245 L 196 250 L 196 258" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
  <text x="235" y="222" fill="#f59e0b" font-size="12" font-family="sans-serif" font-weight="bold">k = 100 N/m</text>

  <!-- 3 kg block below spring -->
  <rect x="166" y="258" width="60" height="55" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="196" y="292" fill="#f8fafc" font-size="15" font-family="sans-serif" font-weight="bold" text-anchor="middle">3 kg</text>
</svg>
`);

// 4. Q3 Question Diagram: Block A (1 kg) on Block B (2 kg)
writeSvg('nlm-q3.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 200" width="100%" height="100%">
  <defs>
    <marker id="arrow-q3" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
    </marker>
    <pattern id="hatch3" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="10" stroke="#475569" stroke-width="1.5" />
    </pattern>
  </defs>
  <!-- Floor -->
  <line x1="30" y1="150" x2="430" y2="150" stroke="#64748b" stroke-width="3"/>
  <rect x="30" y="150" width="400" height="16" fill="url(#hatch3)" opacity="0.5"/>
  <text x="230" y="180" fill="#94a3b8" font-size="12" font-family="sans-serif" text-anchor="middle">Smooth floor</text>

  <!-- Block B (2 kg) -->
  <rect x="80" y="95" width="220" height="55" rx="5" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
  <text x="230" y="128" fill="#f8fafc" font-size="15" font-family="sans-serif" font-weight="bold" text-anchor="middle">B (2 kg)</text>

  <!-- Block A (1 kg) placed on B, left-aligned with 4 cm offset from front face -->
  <rect x="80" y="45" width="110" height="50" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <text x="135" y="75" fill="#38bdf8" font-size="15" font-family="sans-serif" font-weight="bold" text-anchor="middle">A (1 kg)</text>

  <!-- Force F = 5 N on A -->
  <line x1="190" y1="70" x2="265" y2="70" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow-q3)"/>
  <text x="235" y="60" fill="#38bdf8" font-size="13" font-family="sans-serif" font-weight="bold">F = 5 N</text>

  <!-- Offset dimension 4 cm -->
  <line x1="190" y1="35" x2="300" y2="35" stroke="#facc15" stroke-width="1.5"/>
  <line x1="190" y1="30" x2="190" y2="40" stroke="#facc15" stroke-width="1.5"/>
  <line x1="300" y1="30" x2="300" y2="40" stroke="#facc15" stroke-width="1.5"/>
  <text x="245" y="28" fill="#facc15" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">s = 4 cm</text>

  <!-- Rough interface label -->
  <text x="135" y="110" fill="#f43f5e" font-size="11" font-family="sans-serif" text-anchor="middle">μ = 0.2</text>
</svg>
`);

// 5. Q3 Solution Diagram: FBD of A and B
writeSvg('nlm-sol-q3.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 160" width="100%" height="100%">
  <defs>
    <marker id="arr-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4ade80"/>
    </marker>
    <marker id="arr-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f43f5e"/>
    </marker>
  </defs>
  <!-- Block A FBD -->
  <rect x="70" y="45" width="80" height="45" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="110" y="72" fill="#fff" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle">A (1 kg)</text>
  <line x1="150" y1="67" x2="200" y2="67" stroke="#4ade80" stroke-width="2.5" marker-end="url(#arr-green)"/>
  <text x="175" y="60" fill="#4ade80" font-size="11" font-family="sans-serif">5 N</text>
  <line x1="70" y1="67" x2="25" y2="67" stroke="#f43f5e" stroke-width="2.5" marker-end="url(#arr-red)"/>
  <text x="45" y="60" fill="#f43f5e" font-size="11" font-family="sans-serif" text-anchor="middle">f = 2 N</text>
  <text x="110" y="110" fill="#38bdf8" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">a_A = (5-2)/1 = 3 m/s²</text>

  <!-- Block B FBD -->
  <rect x="290" y="45" width="90" height="45" rx="4" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
  <text x="335" y="72" fill="#fff" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle">B (2 kg)</text>
  <line x1="380" y1="67" x2="430" y2="67" stroke="#f43f5e" stroke-width="2.5" marker-end="url(#arr-red)"/>
  <text x="405" y="60" fill="#f43f5e" font-size="11" font-family="sans-serif">f = 2 N</text>
  <text x="335" y="110" fill="#94a3b8" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">a_B = 2/2 = 1 m/s²</text>

  <text x="230" y="145" fill="#facc15" font-size="12" font-family="sans-serif" text-anchor="middle">a_rel = 3 - 1 = 2 m/s²  ⇒  t = √(2s/a_rel) = √(0.08/2) = 0.20 s</text>
</svg>
`);

// 6. Q4 Question Diagram: Atwood system m1 stationary with m2, m3
writeSvg('nlm-q4.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 360" width="100%" height="100%">
  <!-- Ceiling -->
  <line x1="60" y1="30" x2="280" y2="30" stroke="#64748b" stroke-width="3"/>
  <!-- Top fixed pulley -->
  <line x1="170" y1="30" x2="170" y2="60" stroke="#94a3b8" stroke-width="3"/>
  <circle cx="170" cy="75" r="22" fill="#334155" stroke="#38bdf8" stroke-width="2.5"/>
  <circle cx="170" cy="75" r="4" fill="#f8fafc"/>

  <!-- Left string & mass m1 -->
  <line x1="148" y1="75" x2="148" y2="200" stroke="#cbd5e1" stroke-width="2.5"/>
  <rect x="123" y="200" width="50" height="50" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="148" y="230" fill="#f8fafc" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle">m₁</text>
  <text x="148" y="270" fill="#38bdf8" font-size="12" font-family="sans-serif" text-anchor="middle">(Stationary)</text>

  <!-- Right string to movable pulley -->
  <line x1="192" y1="75" x2="192" y2="150" stroke="#cbd5e1" stroke-width="2.5"/>
  <circle cx="192" cy="165" r="16" fill="#334155" stroke="#a855f7" stroke-width="2.5"/>
  <circle cx="192" cy="165" r="3" fill="#f8fafc"/>

  <!-- Strings from movable pulley to m2 and m3 -->
  <line x1="176" y1="165" x2="176" y2="240" stroke="#cbd5e1" stroke-width="2"/>
  <rect x="156" y="240" width="40" height="40" rx="5" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
  <text x="176" y="265" fill="#f8fafc" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">m₂</text>

  <line x1="208" y1="165" x2="208" y2="280" stroke="#cbd5e1" stroke-width="2"/>
  <rect x="188" y="280" width="40" height="40" rx="5" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
  <text x="208" y="305" fill="#f8fafc" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">m₃</text>
</svg>
`);

// 7. Q5 Question Diagram: Masses M, M with extra mass m at A dropping h to B
writeSvg('nlm-q5.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 340" width="100%" height="100%">
  <!-- Ceiling -->
  <line x1="70" y1="25" x2="270" y2="25" stroke="#64748b" stroke-width="3"/>
  <!-- Pulley -->
  <line x1="170" y1="25" x2="170" y2="55" stroke="#94a3b8" stroke-width="3"/>
  <circle cx="170" cy="70" r="22" fill="#334155" stroke="#38bdf8" stroke-width="2.5"/>

  <!-- Left block with extra mass m at position A -->
  <line x1="148" y1="70" x2="148" y2="130" stroke="#cbd5e1" stroke-width="2.5"/>
  <rect x="123" y="130" width="50" height="45" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="148" y="158" fill="#f8fafc" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">M</text>

  <!-- Small mass m on top at A -->
  <rect x="133" y="112" width="30" height="18" rx="3" fill="#f59e0b" stroke="#d97706" stroke-width="1.5"/>
  <text x="148" y="125" fill="#000" font-size="10" font-family="sans-serif" font-weight="bold" text-anchor="middle">m</text>
  <text x="100" y="125" fill="#f59e0b" font-size="12" font-family="sans-serif" font-weight="bold">Pos A</text>

  <!-- Falling distance h to B -->
  <line x1="90" y1="130" x2="90" y2="220" stroke="#38bdf8" stroke-dasharray="4 4" stroke-width="2"/>
  <text x="75" y="180" fill="#38bdf8" font-size="12" font-family="sans-serif" font-weight="bold">h</text>
  <text x="100" y="225" fill="#94a3b8" font-size="12" font-family="sans-serif">Pos B</text>

  <!-- Position B ghost box -->
  <rect x="123" y="220" width="50" height="45" rx="5" fill="none" stroke="#64748b" stroke-dasharray="4 4" stroke-width="1.5"/>

  <!-- Right block M -->
  <line x1="192" y1="70" x2="192" y2="180" stroke="#cbd5e1" stroke-width="2.5"/>
  <rect x="167" y="180" width="50" height="45" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="192" y="208" fill="#f8fafc" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">M</text>
</svg>
`);

// 8. Q6 Question Diagram: Constraint pulley system Block A and Block B
writeSvg('nlm-q6.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 280" width="100%" height="100%">
  <!-- Table surface -->
  <line x1="30" y1="120" x2="260" y2="120" stroke="#64748b" stroke-width="3"/>
  <line x1="260" y1="120" x2="260" y2="260" stroke="#64748b" stroke-width="3"/>

  <!-- Block A on table -->
  <rect x="60" y="70" width="60" height="50" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="90" y="100" fill="#f8fafc" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">A (M)</text>

  <!-- Corner pulley 1 -->
  <circle cx="260" cy="70" r="14" fill="#334155" stroke="#38bdf8" stroke-width="2"/>
  <line x1="120" y1="70" x2="260" y2="70" stroke="#cbd5e1" stroke-width="2.5"/>

  <!-- Movable pulley with block B -->
  <circle cx="310" cy="170" r="14" fill="#334155" stroke="#a855f7" stroke-width="2"/>
  <rect x="285" y="195" width="50" height="45" rx="5" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
  <text x="310" y="222" fill="#f8fafc" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle">B (M)</text>
  <line x1="310" y1="184" x2="310" y2="195" stroke="#cbd5e1" stroke-width="2.5"/>

  <!-- Fixed pulley 2 at top right ceiling -->
  <line x1="280" y1="30" x2="380" y2="30" stroke="#64748b" stroke-width="3"/>
  <circle cx="350" cy="50" r="14" fill="#334155" stroke="#38bdf8" stroke-width="2"/>
  <line x1="350" y1="30" x2="350" y2="50" stroke="#94a3b8" stroke-width="2"/>

  <!-- String weaving through -->
  <path d="M 260 70 L 296 170 L 336 50 L 324 170" fill="none" stroke="#cbd5e1" stroke-width="2"/>
  <text x="310" y="260" fill="#38bdf8" font-size="12" font-family="sans-serif" text-anchor="middle">3T supports B ⇒ a_A = 3 a_B</text>
</svg>
`);

// 9. Q7 Question Diagram: Block C with mounted pulleys and blocks A, B
writeSvg('nlm-q7.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 250" width="100%" height="100%">
  <defs>
    <marker id="arr-q7" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
    </marker>
  </defs>
  <!-- Ground -->
  <line x1="40" y1="210" x2="400" y2="210" stroke="#64748b" stroke-width="3"/>

  <!-- Block C (2m) -->
  <rect x="120" y="90" width="180" height="120" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>
  <text x="210" y="155" fill="#f8fafc" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle">C (2m)</text>

  <!-- Block B (m) on top of C -->
  <rect x="150" y="45" width="55" height="45" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <text x="177" y="72" fill="#38bdf8" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle">B (m)</text>

  <!-- Top Pulley on C -->
  <circle cx="280" cy="55" r="10" fill="#334155" stroke="#38bdf8" stroke-width="2"/>
  <line x1="205" y1="67" x2="280" y2="67" stroke="#cbd5e1" stroke-width="2"/>

  <!-- Block A (m) on side -->
  <rect x="65" y="110" width="45" height="50" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <text x="87" y="140" fill="#38bdf8" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle">A (m)</text>

  <!-- String connecting A and B -->
  <circle cx="120" cy="90" r="8" fill="#334155" stroke="#38bdf8" stroke-width="1.5"/>
  <line x1="87" y1="110" x2="87" y2="90" stroke="#cbd5e1" stroke-width="2"/>
  <line x1="87" y1="90" x2="150" y2="70" stroke="#cbd5e1" stroke-width="2"/>

  <!-- String pulled with force F -->
  <line x1="280" y1="55" x2="360" y2="55" stroke="#38bdf8" stroke-width="3" marker-end="url(#arr-q7)"/>
  <text x="385" y="59" fill="#38bdf8" font-size="14" font-family="sans-serif" font-weight="bold">F</text>
  <text x="210" y="235" fill="#94a3b8" font-size="12" font-family="sans-serif" text-anchor="middle">All surfaces smooth</text>
</svg>
`);

// 10. Q8 Question Diagram: Bead of mass m sliding on string with 2m block
writeSvg('nlm-q8.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="100%" height="100%">
  <!-- Ceiling -->
  <line x1="60" y1="30" x2="260" y2="30" stroke="#64748b" stroke-width="3"/>
  <line x1="160" y1="30" x2="160" y2="60" stroke="#94a3b8" stroke-width="3"/>
  <circle cx="160" cy="75" r="20" fill="#334155" stroke="#38bdf8" stroke-width="2.5"/>

  <!-- Left string & 2m block -->
  <line x1="140" y1="75" x2="140" y2="180" stroke="#cbd5e1" stroke-width="2.5"/>
  <rect x="115" y="180" width="50" height="50" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="140" y="210" fill="#f8fafc" font-size="15" font-family="sans-serif" font-weight="bold" text-anchor="middle">2m</text>

  <!-- Right string passing through bead -->
  <line x1="180" y1="75" x2="180" y2="280" stroke="#cbd5e1" stroke-width="2.5"/>

  <!-- Bead m -->
  <ellipse cx="180" cy="160" rx="14" ry="9" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
  <text x="215" y="165" fill="#f59e0b" font-size="13" font-family="sans-serif" font-weight="bold">Bead (m)</text>

  <!-- Hanging length l -->
  <line x1="195" y1="160" x2="195" y2="280" stroke="#facc15" stroke-dasharray="3 3" stroke-width="1.5"/>
  <text x="208" y="225" fill="#facc15" font-size="12" font-family="sans-serif" font-weight="bold">ℓ</text>
</svg>
`);

// 11. Q9 Question Diagram: 5 kg with spring, 4 kg with string, 2 kg with friction & force 10 N
writeSvg('nlm-q9.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 180" width="100%" height="100%">
  <defs>
    <marker id="arr-q9" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
    </marker>
    <marker id="arr-acc" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#facc15"/>
    </marker>
  </defs>
  <!-- Ground -->
  <line x1="20" y1="130" x2="500" y2="130" stroke="#64748b" stroke-width="3"/>

  <!-- 5 kg block -->
  <rect x="50" y="65" width="65" height="65" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="82" y="102" fill="#f8fafc" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">5 kg</text>
  <line x1="90" y1="45" x2="50" y2="45" stroke="#facc15" stroke-width="2" marker-end="url(#arr-acc)"/>
  <text x="70" y="38" fill="#facc15" font-size="11" font-family="sans-serif">2 m/s²</text>

  <!-- Spring -->
  <path d="M 115 97 L 125 97 L 132 87 L 142 107 L 152 87 L 162 107 L 172 87 L 182 107 L 190 97 L 200 97" fill="none" stroke="#f59e0b" stroke-width="2.5"/>

  <!-- 4 kg block -->
  <rect x="200" y="70" width="60" height="60" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="230" y="105" fill="#f8fafc" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">4 kg</text>
  <line x1="220" y1="50" x2="260" y2="50" stroke="#facc15" stroke-width="2" marker-end="url(#arr-acc)"/>
  <text x="240" y="42" fill="#facc15" font-size="11" font-family="sans-serif">2 m/s²</text>

  <!-- String -->
  <line x1="260" y1="100" x2="330" y2="100" stroke="#cbd5e1" stroke-width="2.5"/>

  <!-- 2 kg block -->
  <rect x="330" y="80" width="55" height="50" rx="5" fill="#1e293b" stroke="#f43f5e" stroke-width="2"/>
  <text x="357" y="110" fill="#f8fafc" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">2 kg</text>
  <text x="357" y="148" fill="#f43f5e" font-size="11" font-family="sans-serif" text-anchor="middle">Rough (μ)</text>

  <!-- Force F = 10 N -->
  <line x1="385" y1="105" x2="455" y2="105" stroke="#38bdf8" stroke-width="3" marker-end="url(#arr-q9)"/>
  <text x="420" y="95" fill="#38bdf8" font-size="13" font-family="sans-serif" font-weight="bold">F = 10 N</text>
</svg>
`);

// 12. Q10 Question Diagram: 4 blocks on 37° inclined plane moving upward with 5 m/s²
writeSvg('nlm-q10.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 260" width="100%" height="100%">
  <defs>
    <marker id="arr-q10" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
    </marker>
  </defs>
  <!-- Incline triangle 37 degrees -->
  <polygon points="40,210 380,210 380,50" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>
  <text x="90" y="200" fill="#94a3b8" font-size="13" font-family="sans-serif">37°</text>

  <!-- Group rotated along incline -->
  <g transform="translate(40,210) rotate(-25.2)">
    <!-- Force F from bottom -->
    <line x1="30" y1="-20" x2="80" y2="-20" stroke="#4ade80" stroke-width="3" marker-end="url(#arr-q10)"/>
    <text x="50" y="-30" fill="#4ade80" font-size="12" font-family="sans-serif" font-weight="bold">F</text>

    <!-- Blocks 4, 3, 2, 1 in contact -->
    <rect x="80" y="-35" width="45" height="35" fill="#334155" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="102" y="-12" fill="#fff" font-size="11" font-family="sans-serif" text-anchor="middle">4 kg</text>

    <rect x="125" y="-35" width="40" height="35" fill="#334155" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="145" y="-12" fill="#fff" font-size="11" font-family="sans-serif" text-anchor="middle">3 kg</text>

    <rect x="165" y="-35" width="35" height="35" fill="#334155" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="182" y="-12" fill="#fff" font-size="11" font-family="sans-serif" text-anchor="middle">2 kg</text>

    <rect x="200" y="-35" width="30" height="35" fill="#334155" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="215" y="-12" fill="#fff" font-size="11" font-family="sans-serif" text-anchor="middle">1 kg</text>

    <!-- 20 N opposing force -->
    <line x1="280" y1="-20" x2="230" y2="-20" stroke="#f43f5e" stroke-width="3" marker-end="url(#arr-q10)"/>
    <text x="250" y="-30" fill="#f43f5e" font-size="12" font-family="sans-serif" font-weight="bold">20 N</text>

    <!-- Accel a = 5 m/s² -->
    <text x="150" y="-50" fill="#facc15" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">a = 5 m/s² ↗</text>
  </g>
</svg>
`);

// 13. Q11 Question Diagram: Knotted strings with 2 kg block on table, 3 kg block hanging
writeSvg('nlm-q11.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 280" width="100%" height="100%">
  <!-- Left Wall -->
  <line x1="40" y1="40" x2="40" y2="200" stroke="#64748b" stroke-width="4"/>
  <!-- Table -->
  <line x1="40" y1="120" x2="220" y2="120" stroke="#64748b" stroke-width="3"/>

  <!-- String 1 -->
  <line x1="40" y1="95" x2="100" y2="95" stroke="#cbd5e1" stroke-width="2.5"/>
  <text x="70" y="85" fill="#38bdf8" font-size="12" font-family="sans-serif" font-weight="bold">T₁</text>

  <!-- 2 kg block -->
  <rect x="100" y="70" width="55" height="50" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="127" y="100" fill="#f8fafc" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle">2 kg</text>

  <!-- String 2 -->
  <line x1="155" y1="95" x2="250" y2="95" stroke="#cbd5e1" stroke-width="2.5"/>
  <text x="200" y="85" fill="#38bdf8" font-size="12" font-family="sans-serif" font-weight="bold">T₂</text>

  <!-- Knot at (250, 95) -->
  <circle cx="250" cy="95" r="4" fill="#f59e0b"/>

  <!-- Ceiling -->
  <line x1="200" y1="30" x2="380" y2="30" stroke="#64748b" stroke-width="3"/>

  <!-- String 3 going to ceiling at 53° to vertical -->
  <line x1="250" y1="95" x2="330" y2="30" stroke="#cbd5e1" stroke-width="2.5"/>
  <text x="290" y="55" fill="#38bdf8" font-size="12" font-family="sans-serif" font-weight="bold">T₃</text>
  <text x="260" y="48" fill="#94a3b8" font-size="11" font-family="sans-serif">53°</text>

  <!-- String 4 hanging 3 kg block -->
  <line x1="250" y1="95" x2="250" y2="180" stroke="#cbd5e1" stroke-width="2.5"/>
  <text x="265" y="140" fill="#38bdf8" font-size="12" font-family="sans-serif" font-weight="bold">T₄</text>
  <rect x="225" y="180" width="50" height="45" rx="4" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
  <text x="250" y="208" fill="#f8fafc" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle">3 kg</text>
</svg>
`);

// 14. Q12 Question Diagram: 8 kg block with force 5t at 53°
writeSvg('nlm-q12.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 200" width="100%" height="100%">
  <defs>
    <marker id="arr-q12" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
    </marker>
  </defs>
  <!-- Floor -->
  <line x1="30" y1="140" x2="350" y2="140" stroke="#64748b" stroke-width="3"/>

  <!-- 8 kg block -->
  <rect x="100" y="80" width="80" height="60" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="140" y="115" fill="#f8fafc" font-size="15" font-family="sans-serif" font-weight="bold" text-anchor="middle">m = 8 kg</text>

  <!-- Force vector 5t at 53 degrees -->
  <line x1="180" y1="110" x2="260" y2="46" stroke="#38bdf8" stroke-width="3" marker-end="url(#arr-q12)"/>
  <line x1="180" y1="110" x2="250" y2="110" stroke="#94a3b8" stroke-dasharray="3 3" stroke-width="1.5"/>
  <text x="220" y="103" fill="#94a3b8" font-size="12" font-family="sans-serif">53°</text>
  <text x="245" y="40" fill="#38bdf8" font-size="14" font-family="sans-serif" font-weight="bold">F = 5t</text>
  <text x="140" y="170" fill="#94a3b8" font-size="12" font-family="sans-serif" text-anchor="middle">Frictionless horizontal surface</text>
</svg>
`);

// 15. Q13 Question Diagram: Pulley A pulled up with F = 300 N, pulley B with m = 5 kg, M = 10 kg
writeSvg('nlm-q13.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 380" width="100%" height="100%">
  <defs>
    <marker id="arr-q13" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4ade80"/>
    </marker>
  </defs>
  <!-- Floor -->
  <line x1="40" y1="340" x2="320" y2="340" stroke="#64748b" stroke-width="3"/>

  <!-- Pulley A with force F = 300 N upwards -->
  <circle cx="170" cy="110" r="22" fill="#334155" stroke="#38bdf8" stroke-width="2.5"/>
  <line x1="170" y1="110" x2="170" y2="50" stroke="#4ade80" stroke-width="3.5" marker-end="url(#arr-q13)"/>
  <text x="170" y="40" fill="#4ade80" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">F = 300 N</text>
  <text x="135" y="115" fill="#38bdf8" font-size="13" font-family="sans-serif" font-weight="bold">A</text>

  <!-- String on left of Pulley A anchored to floor -->
  <line x1="148" y1="110" x2="148" y2="340" stroke="#cbd5e1" stroke-width="2.5"/>

  <!-- String on right of Pulley A goes to center of Pulley B -->
  <line x1="192" y1="110" x2="192" y2="200" stroke="#cbd5e1" stroke-width="2.5"/>

  <!-- Pulley B -->
  <circle cx="192" cy="216" r="16" fill="#334155" stroke="#a855f7" stroke-width="2"/>
  <text x="220" y="220" fill="#a855f7" font-size="13" font-family="sans-serif" font-weight="bold">B</text>

  <!-- Left string of B to m = 5 kg -->
  <line x1="176" y1="216" x2="176" y2="270" stroke="#cbd5e1" stroke-width="2"/>
  <rect x="156" y="270" width="40" height="40" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="176" y="295" fill="#f8fafc" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle">5 kg</text>

  <!-- Right string of B to M = 10 kg resting on floor -->
  <line x1="208" y1="216" x2="208" y2="295" stroke="#cbd5e1" stroke-width="2"/>
  <rect x="188" y="295" width="48" height="45" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="212" y="322" fill="#f8fafc" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle">10 kg</text>
</svg>
`);

// 16. Q14 Question Diagram: Blocks m1 and m2 on inclined plane with F1, F2
writeSvg('nlm-q14.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
  <defs>
    <marker id="arr-q14" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
    </marker>
  </defs>
  <!-- Incline -->
  <polygon points="40,200 360,200 360,60" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>
  <text x="90" y="190" fill="#94a3b8" font-size="13" font-family="sans-serif">θ</text>

  <g transform="translate(40,200) rotate(-23.6)">
    <!-- Block m1 (higher on incline) -->
    <rect x="180" y="-35" width="45" height="35" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
    <text x="202" y="-12" fill="#fff" font-size="12" font-family="sans-serif" text-anchor="middle">m₁</text>
    <line x1="250" y1="-18" x2="225" y2="-18" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arr-q14)"/>
    <text x="245" y="-28" fill="#38bdf8" font-size="11" font-family="sans-serif">F₁</text>

    <!-- Block m2 (in contact with m1) -->
    <rect x="135" y="-35" width="45" height="35" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>
    <text x="157" y="-12" fill="#fff" font-size="12" font-family="sans-serif" text-anchor="middle">m₂</text>
    <line x1="135" y1="-18" x2="105" y2="-18" stroke="#a855f7" stroke-width="2.5" marker-end="url(#arr-q14)"/>
    <text x="110" y="-28" fill="#a855f7" font-size="11" font-family="sans-serif">F₂</text>
  </g>
</svg>
`);

// 17. Q15 Question Diagram: 3 Atwood machines (1) 25 & 15, (2) 15 & 5, (3) 20 & 30
writeSvg('nlm-q15.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 220" width="100%" height="100%">
  <!-- Setup 1 -->
  <g transform="translate(10, 0)">
    <line x1="40" y1="20" x2="140" y2="20" stroke="#64748b" stroke-width="3"/>
    <line x1="90" y1="20" x2="90" y2="40" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="90" cy="52" r="14" fill="#334155" stroke="#38bdf8" stroke-width="2"/>
    <line x1="76" y1="52" x2="76" y2="110" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="61" y="110" width="30" height="30" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="76" y="130" fill="#fff" font-size="10" font-family="sans-serif" text-anchor="middle">25 kg</text>

    <line x1="104" y1="52" x2="104" y2="135" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="89" y="135" width="30" height="30" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="104" y="155" fill="#fff" font-size="10" font-family="sans-serif" text-anchor="middle">15 kg</text>
    <text x="90" y="190" fill="#38bdf8" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">Fig (1)</text>
  </g>

  <!-- Setup 2 -->
  <g transform="translate(180, 0)">
    <line x1="40" y1="20" x2="140" y2="20" stroke="#64748b" stroke-width="3"/>
    <line x1="90" y1="20" x2="90" y2="40" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="90" cy="52" r="14" fill="#334155" stroke="#4ade80" stroke-width="2"/>
    <line x1="76" y1="52" x2="76" y2="110" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="61" y="110" width="30" height="30" fill="#1e293b" stroke="#4ade80" stroke-width="1.5"/>
    <text x="76" y="130" fill="#fff" font-size="10" font-family="sans-serif" text-anchor="middle">15 kg</text>

    <line x1="104" y1="52" x2="104" y2="140" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="89" y="140" width="28" height="28" fill="#1e293b" stroke="#4ade80" stroke-width="1.5"/>
    <text x="103" y="158" fill="#fff" font-size="10" font-family="sans-serif" text-anchor="middle">5 kg</text>
    <text x="90" y="190" fill="#4ade80" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">Fig (2)</text>
  </g>

  <!-- Setup 3 -->
  <g transform="translate(350, 0)">
    <line x1="40" y1="20" x2="140" y2="20" stroke="#64748b" stroke-width="3"/>
    <line x1="90" y1="20" x2="90" y2="40" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="90" cy="52" r="14" fill="#334155" stroke="#f59e0b" stroke-width="2"/>
    <line x1="76" y1="52" x2="76" y2="115" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="61" y="115" width="30" height="30" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="76" y="135" fill="#fff" font-size="10" font-family="sans-serif" text-anchor="middle">20 kg</text>

    <line x1="104" y1="52" x2="104" y2="135" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="89" y="135" width="30" height="30" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="104" y="155" fill="#fff" font-size="10" font-family="sans-serif" text-anchor="middle">30 kg</text>
    <text x="90" y="190" fill="#f59e0b" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">Fig (3)</text>
  </g>
</svg>
`);

// 18. Q16 Question Diagram: Incline alpha, block held by string at beta to line of greatest slope
writeSvg('nlm-q16.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 240" width="100%" height="100%">
  <!-- Inclined surface -->
  <polygon points="40,200 340,200 340,70" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>
  <text x="80" y="190" fill="#94a3b8" font-size="13" font-family="sans-serif">α</text>

  <!-- Plane view coordinate -->
  <g transform="translate(190, 110)">
    <rect x="-20" y="-18" width="40" height="36" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
    <text x="0" y="5" fill="#fff" font-size="12" font-family="sans-serif" text-anchor="middle">m</text>
    <!-- String line at angle beta -->
    <line x1="0" y1="0" x2="90" y2="-50" stroke="#cbd5e1" stroke-width="2.5"/>
    <line x1="0" y1="0" x2="80" y2="0" stroke="#94a3b8" stroke-dasharray="3 3" stroke-width="1.5"/>
    <text x="45" y="-8" fill="#facc15" font-size="12" font-family="sans-serif">β</text>
    <text x="75" y="-45" fill="#38bdf8" font-size="13" font-family="sans-serif" font-weight="bold">T</text>
  </g>
</svg>
`);

// 19. Q17 Question Diagram: Block B on A with string around wall pulley, force F
writeSvg('nlm-q17.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 220" width="100%" height="100%">
  <defs>
    <marker id="arr-q17" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
    </marker>
  </defs>
  <!-- Floor -->
  <line x1="30" y1="160" x2="400" y2="160" stroke="#64748b" stroke-width="3"/>
  <!-- Right wall with pulley -->
  <line x1="380" y1="50" x2="380" y2="160" stroke="#64748b" stroke-width="4"/>
  <circle cx="370" cy="100" r="14" fill="#334155" stroke="#38bdf8" stroke-width="2"/>

  <!-- Block A (1 kg) on smooth ground -->
  <rect x="140" y="115" width="120" height="45" rx="5" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
  <text x="200" y="142" fill="#fff" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">A (1 kg)</text>

  <!-- Block B (1 kg) on A -->
  <rect x="140" y="70" width="100" height="45" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <text x="190" y="98" fill="#38bdf8" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">B (1 kg)</text>

  <!-- String around pulley -->
  <line x1="240" y1="88" x2="370" y2="88" stroke="#cbd5e1" stroke-width="2"/>
  <line x1="260" y1="130" x2="370" y2="114" stroke="#cbd5e1" stroke-width="2"/>

  <!-- Force F pulling B left -->
  <line x1="140" y1="92" x2="70" y2="92" stroke="#38bdf8" stroke-width="3" marker-end="url(#arr-q17)"/>
  <text x="50" y="96" fill="#38bdf8" font-size="14" font-family="sans-serif" font-weight="bold">F</text>
  <text x="190" y="185" fill="#94a3b8" font-size="12" font-family="sans-serif" text-anchor="middle">μ = 0.2 between A and B, ground smooth</text>
</svg>
`);

// 20. Q18 Question Diagram: Triangular block B accelerating along plane at 2 m/s², block A on wedge
writeSvg('nlm-q18.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
  <defs>
    <marker id="arr-q18" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#facc15"/>
    </marker>
  </defs>
  <!-- Floor -->
  <line x1="40" y1="200" x2="360" y2="200" stroke="#64748b" stroke-width="3"/>
  <!-- Triangular wedge B -->
  <polygon points="100,200 320,200 100,80" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <text x="180" y="170" fill="#f8fafc" font-size="16" font-family="sans-serif" font-weight="bold">B</text>
  <text x="270" y="190" fill="#94a3b8" font-size="13" font-family="sans-serif">θ</text>

  <!-- Block A on incline -->
  <g transform="translate(180, 125) rotate(-28)">
    <rect x="-20" y="-30" width="40" height="30" rx="4" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>
    <text x="0" y="-10" fill="#fff" font-size="12" font-family="sans-serif" text-anchor="middle">A</text>
  </g>

  <!-- Accel vector a = 2 m/s² -->
  <line x1="280" y1="120" x2="330" y2="120" stroke="#facc15" stroke-width="3" marker-end="url(#arr-q18)"/>
  <text x="305" y="105" fill="#facc15" font-size="12" font-family="sans-serif" font-weight="bold">a = 2 m/s²</text>
</svg>
`);

// 21. Q19 Question Diagram: 10 kg with 20 N right, 50 kg with 100 N right
writeSvg('nlm-q19.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 200" width="100%" height="100%">
  <defs>
    <marker id="arr-q19" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
    </marker>
  </defs>
  <!-- Floor -->
  <line x1="30" y1="150" x2="430" y2="150" stroke="#64748b" stroke-width="3"/>
  <text x="230" y="175" fill="#94a3b8" font-size="12" font-family="sans-serif" text-anchor="middle">Smooth horizontal floor</text>

  <!-- 50 kg block -->
  <rect x="90" y="90" width="220" height="60" rx="5" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>
  <text x="200" y="125" fill="#f8fafc" font-size="15" font-family="sans-serif" font-weight="bold" text-anchor="middle">50 kg</text>
  <line x1="310" y1="120" x2="380" y2="120" stroke="#38bdf8" stroke-width="3" marker-end="url(#arr-q19)"/>
  <text x="345" y="110" fill="#38bdf8" font-size="13" font-family="sans-serif" font-weight="bold">100 N</text>

  <!-- 10 kg block on top -->
  <rect x="140" y="45" width="110" height="45" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <text x="195" y="73" fill="#38bdf8" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">10 kg</text>
  <line x1="250" y1="68" x2="320" y2="68" stroke="#38bdf8" stroke-width="3" marker-end="url(#arr-q19)"/>
  <text x="285" y="58" fill="#38bdf8" font-size="13" font-family="sans-serif" font-weight="bold">20 N</text>
</svg>
`);

// 22. Q20 Question Diagram: Constraint pulley system Block A and Block B
writeSvg('nlm-q20.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 280" width="100%" height="100%">
  <!-- Table & Pulleys -->
  <line x1="30" y1="90" x2="260" y2="90" stroke="#64748b" stroke-width="3"/>

  <!-- Block A -->
  <rect x="60" y="50" width="65" height="40" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="92" y="75" fill="#fff" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle">A</text>
  <text x="92" y="38" fill="#facc15" font-size="11" font-family="sans-serif" text-anchor="middle">v_A = 1 m/s ←, a_A = 2 m/s² →</text>

  <!-- Movable & fixed pulleys -->
  <circle cx="260" cy="90" r="12" fill="#334155" stroke="#38bdf8" stroke-width="2"/>
  <circle cx="320" cy="180" r="14" fill="#334155" stroke="#a855f7" stroke-width="2"/>
  <rect x="295" y="205" width="50" height="40" rx="4" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
  <text x="320" y="230" fill="#fff" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">B</text>

  <!-- Strings -->
  <line x1="125" y1="70" x2="260" y2="70" stroke="#cbd5e1" stroke-width="2"/>
  <path d="M 260 70 L 308 180 L 332 90 L 332 180" fill="none" stroke="#cbd5e1" stroke-width="2"/>
  <text x="220" y="265" fill="#38bdf8" font-size="12" font-family="sans-serif" text-anchor="middle">Find v_B and a_B (choose incorrect options)</text>
</svg>
`);

// 23. Q21 Question Diagram: Wedge B on incline with block A on top horizontal face
writeSvg('nlm-q21.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
  <!-- Incline -->
  <polygon points="40,210 360,210 360,70" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>
  <text x="90" y="200" fill="#94a3b8" font-size="13" font-family="sans-serif">θ</text>

  <!-- Wedge B with horizontal top -->
  <g transform="translate(160, 110)">
    <polygon points="0,45 85,45 0,0" fill="#334155" stroke="#38bdf8" stroke-width="2"/>
    <text x="25" y="35" fill="#fff" font-size="13" font-family="sans-serif" font-weight="bold">B (2m)</text>

    <!-- Block A on top horizontal surface of B -->
    <rect x="0" y="-30" width="45" height="30" rx="4" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>
    <text x="22" y="-10" fill="#fff" font-size="12" font-family="sans-serif" text-anchor="middle">A (m)</text>
  </g>
  <text x="200" y="235" fill="#94a3b8" font-size="12" font-family="sans-serif" text-anchor="middle">μ = √3 between A and B, plane smooth</text>
</svg>
`);

// 24. Q22 Question Diagram: Force F pushing block m against vertical face of wedge M
writeSvg('nlm-q22.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220" width="100%" height="100%">
  <defs>
    <marker id="arr-q22" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
    </marker>
  </defs>
  <!-- Floor -->
  <line x1="30" y1="170" x2="390" y2="170" stroke="#64748b" stroke-width="3"/>

  <!-- Block m -->
  <rect x="110" y="70" width="45" height="60" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <text x="132" y="105" fill="#38bdf8" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">m</text>

  <!-- Force F on m -->
  <line x1="40" y1="100" x2="110" y2="100" stroke="#38bdf8" stroke-width="3" marker-end="url(#arr-q22)"/>
  <text x="75" y="90" fill="#38bdf8" font-size="14" font-family="sans-serif" font-weight="bold">F</text>

  <!-- Wedge M with vertical face at x = 155 -->
  <polygon points="155,50 155,170 320,170" fill="#1e293b" stroke="#94a3b8" stroke-width="2.5"/>
  <text x="210" y="140" fill="#f8fafc" font-size="16" font-family="sans-serif" font-weight="bold">M</text>
  <text x="200" y="200" fill="#94a3b8" font-size="12" font-family="sans-serif" text-anchor="middle">Rough face (μ) between m and M, ground smooth</text>
</svg>
`);

// 25. Q23 Question Diagram: Incline at 30° with blocks A and B connected by string
writeSvg('nlm-q23.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 250" width="100%" height="100%">
  <!-- Incline 30 degrees -->
  <polygon points="40,210 380,210 380,70" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>
  <text x="90" y="200" fill="#94a3b8" font-size="13" font-family="sans-serif">30°</text>

  <g transform="translate(40,210) rotate(-22.4)">
    <!-- Block A (lower) -->
    <rect x="100" y="-35" width="45" height="35" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
    <text x="122" y="-12" fill="#fff" font-size="12" font-family="sans-serif" text-anchor="middle">A (m)</text>
    <text x="122" y="-42" fill="#38bdf8" font-size="10" font-family="sans-serif" text-anchor="middle">μ_A = 0</text>

    <!-- String -->
    <line x1="145" y1="-18" x2="200" y2="-18" stroke="#cbd5e1" stroke-width="2.5"/>

    <!-- Block B (higher) -->
    <rect x="200" y="-35" width="45" height="35" rx="4" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>
    <text x="222" y="-12" fill="#fff" font-size="12" font-family="sans-serif" text-anchor="middle">B (m)</text>
    <text x="222" y="-42" fill="#a855f7" font-size="10" font-family="sans-serif" text-anchor="middle">μ_B = √(2/3)</text>
  </g>
</svg>
`);

// 26. Q24 Question Diagram: 1 kg on 3 kg plank with force 5t at 37°
writeSvg('nlm-q24.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 200" width="100%" height="100%">
  <defs>
    <marker id="arr-q24" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
    </marker>
  </defs>
  <!-- Floor -->
  <line x1="30" y1="150" x2="410" y2="150" stroke="#64748b" stroke-width="3"/>

  <!-- Plank (3 kg) -->
  <rect x="80" y="105" width="240" height="45" rx="4" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
  <text x="200" y="133" fill="#fff" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">Plank (3 kg)</text>

  <!-- Block (1 kg) -->
  <rect x="120" y="60" width="70" height="45" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <text x="155" y="88" fill="#38bdf8" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle">1 kg</text>

  <!-- Force F = 5t at 37 degrees -->
  <line x1="190" y1="82" x2="260" y2="40" stroke="#38bdf8" stroke-width="3" marker-end="url(#arr-q24)"/>
  <line x1="190" y1="82" x2="250" y2="82" stroke="#94a3b8" stroke-dasharray="3 3" stroke-width="1.5"/>
  <text x="225" y="76" fill="#94a3b8" font-size="11" font-family="sans-serif">37°</text>
  <text x="250" y="32" fill="#38bdf8" font-size="13" font-family="sans-serif" font-weight="bold">F = 5t</text>
  <text x="155" y="118" fill="#f43f5e" font-size="10" font-family="sans-serif">μ = 0.5</text>
</svg>
`);

// 27. Q25 Question Diagram: Object moving right with v, force F applied to left
writeSvg('nlm-q25.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 180" width="100%" height="100%">
  <defs>
    <marker id="arr-q25" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
    </marker>
    <marker id="arr-vel" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4ade80"/>
    </marker>
  </defs>
  <!-- Floor -->
  <line x1="30" y1="130" x2="350" y2="130" stroke="#64748b" stroke-width="3"/>

  <!-- Block m -->
  <rect x="150" y="70" width="70" height="60" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="185" y="105" fill="#fff" font-size="15" font-family="sans-serif" font-weight="bold" text-anchor="middle">m</text>

  <!-- Velocity vector to right -->
  <line x1="185" y1="45" x2="245" y2="45" stroke="#4ade80" stroke-width="2.5" marker-end="url(#arr-vel)"/>
  <text x="215" y="38" fill="#4ade80" font-size="12" font-family="sans-serif" font-weight="bold">v →</text>

  <!-- Force F to left -->
  <line x1="150" y1="100" x2="80" y2="100" stroke="#38bdf8" stroke-width="3" marker-end="url(#arr-q25)"/>
  <text x="110" y="90" fill="#38bdf8" font-size="14" font-family="sans-serif" font-weight="bold">F</text>
  <text x="185" y="160" fill="#94a3b8" font-size="12" font-family="sans-serif" text-anchor="middle">Rough horizontal surface</text>
</svg>
`);

// 28. Q26 Question Diagram: Cart accelerating with a, rod at angle theta, sleeve S
writeSvg('nlm-q26.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 260" width="100%" height="100%">
  <defs>
    <marker id="arr-q26" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#facc15"/>
    </marker>
  </defs>
  <!-- Floor -->
  <line x1="30" y1="220" x2="390" y2="220" stroke="#64748b" stroke-width="3"/>

  <!-- Cart body with wheels -->
  <rect x="70" y="70" width="220" height="130" rx="8" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
  <circle cx="120" cy="210" r="12" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
  <circle cx="240" cy="210" r="12" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
  <text x="100" y="100" fill="#94a3b8" font-size="13" font-family="sans-serif">Cart (C)</text>

  <!-- Inclined rod inside cart -->
  <line x1="110" y1="90" x2="250" y2="190" stroke="#cbd5e1" stroke-width="4"/>

  <!-- Sleeve S on rod -->
  <circle cx="150" cy="118" r="10" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
  <text x="175" y="115" fill="#f59e0b" font-size="12" font-family="sans-serif" font-weight="bold">S (m)</text>

  <!-- Height h & angle theta -->
  <line x1="95" y1="90" x2="95" y2="190" stroke="#38bdf8" stroke-dasharray="3 3" stroke-width="1.5"/>
  <text x="80" y="145" fill="#38bdf8" font-size="12" font-family="sans-serif" font-weight="bold">h</text>
  <text x="220" y="180" fill="#94a3b8" font-size="12" font-family="sans-serif">θ</text>

  <!-- Acceleration a of cart -->
  <line x1="295" y1="135" x2="360" y2="135" stroke="#facc15" stroke-width="3" marker-end="url(#arr-q26)"/>
  <text x="325" y="125" fill="#facc15" font-size="13" font-family="sans-serif" font-weight="bold">a</text>
</svg>
`);

// 29. Q27-Q29 Comprehension Diagram: 1 kg block on 2 kg plank, F on 1 kg block
writeSvg('nlm-q27.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 200" width="100%" height="100%">
  <defs>
    <marker id="arr-q27" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
    </marker>
  </defs>
  <!-- Floor -->
  <line x1="30" y1="150" x2="410" y2="150" stroke="#64748b" stroke-width="3"/>
  <text x="220" y="175" fill="#f43f5e" font-size="12" font-family="sans-serif" text-anchor="middle">Floor: μ₂ = 0.1</text>

  <!-- 2 kg plank -->
  <rect x="80" y="100" width="220" height="50" rx="5" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
  <text x="190" y="130" fill="#fff" font-size="15" font-family="sans-serif" font-weight="bold" text-anchor="middle">Plank (2 kg)</text>

  <!-- 1 kg block on top -->
  <rect x="130" y="50" width="90" height="50" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <text x="175" y="80" fill="#38bdf8" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">1 kg</text>
  <text x="245" y="95" fill="#facc15" font-size="11" font-family="sans-serif">μ₁ = 0.4</text>

  <!-- Force F -->
  <line x1="220" y1="75" x2="295" y2="75" stroke="#38bdf8" stroke-width="3" marker-end="url(#arr-q27)"/>
  <text x="260" y="65" fill="#38bdf8" font-size="14" font-family="sans-serif" font-weight="bold">F</text>
</svg>
`);

// 30. Q30-Q32 Comprehension Diagram: 2 kg on 3 kg block, force F on 2 kg block
writeSvg('nlm-q30.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 200" width="100%" height="100%">
  <defs>
    <marker id="arr-q30" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
    </marker>
  </defs>
  <!-- Floor -->
  <line x1="30" y1="150" x2="410" y2="150" stroke="#64748b" stroke-width="3"/>
  <text x="220" y="175" fill="#94a3b8" font-size="12" font-family="sans-serif" text-anchor="middle">Smooth table</text>

  <!-- 3 kg block -->
  <rect x="90" y="95" width="220" height="55" rx="5" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
  <text x="200" y="130" fill="#fff" font-size="15" font-family="sans-serif" font-weight="bold" text-anchor="middle">3 kg</text>

  <!-- 2 kg block on top -->
  <rect x="140" y="45" width="100" height="50" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <text x="190" y="75" fill="#38bdf8" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">2 kg</text>

  <!-- Force F -->
  <line x1="240" y1="70" x2="315" y2="70" stroke="#38bdf8" stroke-width="3" marker-end="url(#arr-q30)"/>
  <text x="280" y="60" fill="#38bdf8" font-size="14" font-family="sans-serif" font-weight="bold">F</text>
  <text x="200" y="25" fill="#facc15" font-size="12" font-family="sans-serif" text-anchor="middle">Slipping starts at F = 25 N</text>
</svg>
`);

// 31. Q32 Diagram: Graph Options (1), (2), (3), (4)
writeSvg('nlm-q32.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 240" width="100%" height="100%">
  <!-- Graph (1) - Correct Option -->
  <g transform="translate(20, 20)">
    <rect x="0" y="0" width="115" height="90" fill="#0f172a" stroke="#4ade80" stroke-width="2" rx="4"/>
    <line x1="15" y1="75" x2="105" y2="75" stroke="#64748b" stroke-width="1.5"/>
    <line x1="15" y1="75" x2="15" y2="10" stroke="#64748b" stroke-width="1.5"/>
    <!-- Common line then split: a3 flat, a2 steep -->
    <line x1="15" y1="75" x2="50" y2="50" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="50" y1="50" x2="100" y2="50" stroke="#38bdf8" stroke-width="2"/>
    <line x1="50" y1="50" x2="90" y2="15" stroke="#f43f5e" stroke-width="2"/>
    <text x="10" y="9" fill="#94a3b8" font-size="8">a</text>
    <text x="100" y="85" fill="#94a3b8" font-size="8">F</text>
    <text x="58" y="103" fill="#4ade80" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">(1) Correct</text>
  </g>

  <!-- Graph (2) -->
  <g transform="translate(150, 20)">
    <rect x="0" y="0" width="115" height="90" fill="#0f172a" stroke="#64748b" stroke-width="1.5" rx="4"/>
    <line x1="15" y1="75" x2="105" y2="75" stroke="#64748b" stroke-width="1.5"/>
    <line x1="15" y1="75" x2="15" y2="10" stroke="#64748b" stroke-width="1.5"/>
    <line x1="15" y1="75" x2="50" y2="50" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="50" y1="50" x2="100" y2="25" stroke="#38bdf8" stroke-width="2"/>
    <line x1="50" y1="50" x2="100" y2="65" stroke="#f43f5e" stroke-width="2"/>
    <text x="58" y="103" fill="#94a3b8" font-size="11" font-family="sans-serif" text-anchor="middle">(2)</text>
  </g>

  <!-- Graph (3) -->
  <g transform="translate(280, 20)">
    <rect x="0" y="0" width="115" height="90" fill="#0f172a" stroke="#64748b" stroke-width="1.5" rx="4"/>
    <line x1="15" y1="75" x2="105" y2="75" stroke="#64748b" stroke-width="1.5"/>
    <line x1="15" y1="75" x2="15" y2="10" stroke="#64748b" stroke-width="1.5"/>
    <line x1="15" y1="75" x2="95" y2="20" stroke="#38bdf8" stroke-width="2"/>
    <line x1="15" y1="75" x2="95" y2="50" stroke="#f43f5e" stroke-width="2"/>
    <text x="58" y="103" fill="#94a3b8" font-size="11" font-family="sans-serif" text-anchor="middle">(3)</text>
  </g>

  <!-- Graph (4) -->
  <g transform="translate(410, 20)">
    <rect x="0" y="0" width="115" height="90" fill="#0f172a" stroke="#64748b" stroke-width="1.5" rx="4"/>
    <line x1="15" y1="75" x2="105" y2="75" stroke="#64748b" stroke-width="1.5"/>
    <line x1="15" y1="75" x2="15" y2="10" stroke="#64748b" stroke-width="1.5"/>
    <line x1="15" y1="75" x2="50" y2="50" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="50" y1="50" x2="95" y2="20" stroke="#38bdf8" stroke-width="2"/>
    <line x1="50" y1="50" x2="95" y2="20" stroke="#f43f5e" stroke-width="2" stroke-dasharray="2 2"/>
    <text x="58" y="103" fill="#94a3b8" font-size="11" font-family="sans-serif" text-anchor="middle">(4)</text>
  </g>
  <text x="270" y="170" fill="#38bdf8" font-size="12" font-family="sans-serif" text-anchor="middle">Blue line = a₃, Red line = a₂ vs Applied Force F</text>
</svg>
`);

// 32. Q33 Question Diagram: Pulley pulled up with 200 N, 4 kg and 5 kg on ground
writeSvg('nlm-q33.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 320" width="100%" height="100%">
  <defs>
    <marker id="arr-q33" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4ade80"/>
    </marker>
  </defs>
  <!-- Ground -->
  <line x1="40" y1="280" x2="300" y2="280" stroke="#64748b" stroke-width="3"/>

  <!-- Pulley with 200 N upwards -->
  <circle cx="170" cy="100" r="22" fill="#334155" stroke="#38bdf8" stroke-width="2.5"/>
  <line x1="170" y1="100" x2="170" y2="40" stroke="#4ade80" stroke-width="3.5" marker-end="url(#arr-q33)"/>
  <text x="170" y="30" fill="#4ade80" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">200 N</text>

  <!-- Left rope to 4 kg block on ground -->
  <line x1="148" y1="100" x2="148" y2="235" stroke="#cbd5e1" stroke-width="2.5"/>
  <rect x="123" y="235" width="50" height="45" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="148" y="262" fill="#f8fafc" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">4 kg</text>

  <!-- Right rope to 5 kg block on ground -->
  <line x1="192" y1="100" x2="192" y2="230" stroke="#cbd5e1" stroke-width="2.5"/>
  <rect x="167" y="230" width="50" height="50" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="192" y="260" fill="#f8fafc" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">5 kg</text>
</svg>
`);

// 33. Q34 Question Diagram: Incline at 53°, 2 kg block & 1 kg block, F = 15t
writeSvg('nlm-q34.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
  <defs>
    <marker id="arr-q34" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
    </marker>
  </defs>
  <!-- Incline 53 degrees -->
  <polygon points="40,200 360,200 360,40" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>
  <text x="90" y="190" fill="#94a3b8" font-size="13" font-family="sans-serif">53°</text>

  <g transform="translate(40,200) rotate(-26.6)">
    <!-- 2 kg block (lower) -->
    <rect x="100" y="-35" width="45" height="35" rx="4" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>
    <text x="122" y="-12" fill="#fff" font-size="12" font-family="sans-serif" text-anchor="middle">2 kg</text>

    <!-- String (max tension 50 N) -->
    <line x1="145" y1="-18" x2="200" y2="-18" stroke="#cbd5e1" stroke-width="2.5"/>
    <text x="172" y="-26" fill="#facc15" font-size="10" font-family="sans-serif" text-anchor="middle">T_max = 50 N</text>

    <!-- 1 kg block (higher) -->
    <rect x="200" y="-35" width="40" height="35" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
    <text x="220" y="-12" fill="#fff" font-size="12" font-family="sans-serif" text-anchor="middle">1 kg</text>

    <!-- Pulling force F = 15t -->
    <line x1="240" y1="-18" x2="300" y2="-18" stroke="#38bdf8" stroke-width="3" marker-end="url(#arr-q34)"/>
    <text x="270" y="-28" fill="#38bdf8" font-size="12" font-family="sans-serif" font-weight="bold">F = 15t</text>
  </g>
</svg>
`);

// 34. Q35 Question Diagram: Smooth hemisphere arrangements (i) and (ii)
writeSvg('nlm-q35.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" width="100%" height="100%">
  <!-- Arrangement (i) -->
  <g transform="translate(20, 20)">
    <line x1="10" y1="140" x2="210" y2="140" stroke="#64748b" stroke-width="2.5"/>
    <!-- Hemisphere -->
    <path d="M 30 140 A 80 80 0 0 1 190 140 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
    <!-- m1 at apex -->
    <rect x="100" y="42" width="20" height="18" fill="#38bdf8" rx="3"/>
    <text x="110" y="55" fill="#000" font-size="9" font-weight="bold" text-anchor="middle">m₁</text>

    <!-- String over curvature to m3 -->
    <path d="M 120 52 A 80 80 0 0 1 165 85" fill="none" stroke="#cbd5e1" stroke-width="2"/>
    <circle cx="165" cy="85" r="10" fill="#a855f7"/>
    <text x="165" y="88" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle">m₃</text>
    <text x="110" y="175" fill="#38bdf8" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">Arrangement (i)</text>
  </g>

  <!-- Arrangement (ii) -->
  <g transform="translate(270, 20)">
    <line x1="10" y1="140" x2="210" y2="140" stroke="#64748b" stroke-width="2.5"/>
    <!-- Hemisphere -->
    <path d="M 30 140 A 80 80 0 0 1 190 140 Z" fill="#1e293b" stroke="#4ade80" stroke-width="2"/>
    <!-- Symmetric string passing over apex -->
    <path d="M 68 95 A 80 80 0 0 1 152 95" fill="none" stroke="#cbd5e1" stroke-width="2"/>

    <!-- m1 on left -->
    <circle cx="68" cy="95" r="10" fill="#38bdf8"/>
    <text x="68" y="98" fill="#000" font-size="9" font-weight="bold" text-anchor="middle">m₁</text>

    <!-- m2 on right -->
    <circle cx="152" cy="95" r="12" fill="#f59e0b"/>
    <text x="152" y="99" fill="#000" font-size="9" font-weight="bold" text-anchor="middle">m₂</text>
    <text x="110" y="175" fill="#4ade80" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">Arrangement (ii)</text>
  </g>
</svg>
`);

// 35. Q36 Question Diagram: Block A pressed by P = 50 N on rough vertical wall
writeSvg('nlm-q36.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 320" width="100%" height="100%">
  <defs>
    <marker id="arr-q36" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
    </marker>
  </defs>
  <!-- Vertical wall on left -->
  <line x1="60" y1="30" x2="60" y2="280" stroke="#64748b" stroke-width="4"/>
  <line x1="45" y1="40" x2="60" y2="30" stroke="#475569" stroke-width="1.5"/>
  <line x1="45" y1="70" x2="60" y2="60" stroke="#475569" stroke-width="1.5"/>
  <line x1="45" y1="100" x2="60" y2="90" stroke="#475569" stroke-width="1.5"/>
  <line x1="45" y1="130" x2="60" y2="120" stroke="#475569" stroke-width="1.5"/>
  <line x1="45" y1="160" x2="60" y2="150" stroke="#475569" stroke-width="1.5"/>

  <!-- Pulley at top right -->
  <circle cx="180" cy="50" r="16" fill="#334155" stroke="#38bdf8" stroke-width="2"/>

  <!-- Block A on wall -->
  <rect x="60" y="110" width="45" height="60" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <text x="82" y="145" fill="#38bdf8" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle">A (6 kg)</text>

  <!-- Force P = 50 N pushing A to wall -->
  <line x1="165" y1="140" x2="105" y2="140" stroke="#38bdf8" stroke-width="3" marker-end="url(#arr-q36)"/>
  <text x="140" y="130" fill="#38bdf8" font-size="13" font-family="sans-serif" font-weight="bold">P = 50 N</text>

  <!-- String from A to pulley to hanging block X -->
  <line x1="82" y1="110" x2="180" y2="34" stroke="#cbd5e1" stroke-width="2.5"/>
  <line x1="196" y1="50" x2="196" y2="180" stroke="#cbd5e1" stroke-width="2.5"/>
  <rect x="176" y="180" width="40" height="45" rx="4" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
  <text x="196" y="208" fill="#f59e0b" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">X (α)</text>
  <text x="180" y="260" fill="#94a3b8" font-size="12" font-family="sans-serif" text-anchor="middle">μ_s = 0.40, verge of slipping up</text>
</svg>
`);

// 36. Q37 Question Diagram: Wedge with 37° pulled right with a = 10 m/s², block 1 kg
writeSvg('nlm-q37.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 220" width="100%" height="100%">
  <defs>
    <marker id="arr-q37" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#facc15"/>
    </marker>
  </defs>
  <!-- Floor -->
  <line x1="30" y1="180" x2="350" y2="180" stroke="#64748b" stroke-width="3"/>

  <!-- Wedge with 37 degrees -->
  <polygon points="80,180 300,180 80,60" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <text x="230" y="170" fill="#94a3b8" font-size="13" font-family="sans-serif">37°</text>

  <!-- 1 kg block near bottom -->
  <g transform="translate(190, 120) rotate(-28.6)">
    <rect x="-18" y="-25" width="36" height="25" rx="3" fill="#0f172a" stroke="#4ade80" stroke-width="2"/>
    <text x="0" y="-8" fill="#4ade80" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">1 kg</text>
  </g>

  <!-- Accel vector of wedge -->
  <line x1="260" y1="90" x2="325" y2="90" stroke="#facc15" stroke-width="3" marker-end="url(#arr-q37)"/>
  <text x="290" y="78" fill="#facc15" font-size="12" font-family="sans-serif" font-weight="bold">a = 10 m/s²</text>
</svg>
`);

console.log('Successfully generated all diagrams in ' + outDir);
