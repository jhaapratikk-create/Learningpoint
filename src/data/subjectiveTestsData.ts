import { SubjectivePaper } from "../types";

export const INITIAL_SUBJECTIVE_PAPERS: SubjectivePaper[] = [
  {
    id: "subj_c12_phy_derivation",
    title: "Class 12 Physics: Electrostatics, Capacitance & Circuits Board Subjective Paper",
    subject: "Physics",
    classGrade: "Class 12",
    chapterName: "Electrostatics & Current Electricity",
    totalMarks: 35,
    timeLimitMinutes: 45,
    difficulty: "Standard Board",
    badge: "Board Exam Pattern",
    description:
      "Comprehensive subjective test featuring Gauss's Law derivations, dielectric capacitors, Kirchhoff's loop analysis, and step-by-step numericals with official marking scheme.",
    instructions: [
      "All questions are compulsory. Internal choice is provided in 5-mark derivations.",
      "Section A contains 3 Short Answer Questions of 2 Marks each.",
      "Section B contains 3 Conceptual & Derivation Questions of 3 Marks each.",
      "Section C contains 4 Long Answer Derivations & Numericals of 5 Marks each.",
      "Write clear steps with proper units (SI units) and specify standard formulas.",
    ],
    questions: [
      {
        id: "phy_q1",
        questionNumber: 1,
        section: "Section A (2 Marks - Short Answer)",
        marks: 2,
        topic: "Gauss's Law & Electric Flux",
        subject: "Physics",
        suggestedWordCount: "30-50 words",
        question:
          "State Gauss's law in electrostatics. What is the net electric flux passing through a closed Gaussian surface enclosing an electric dipole of dipole moment p?",
        keyKeywords: ["total electric flux", "1/epsilon_0", "net enclosed charge", "dipole has +q and -q", "zero net flux"],
        formulaeInvolved: ["∮ E · dA = q_enclosed / ε₀"],
        youtubeSearchTopic: "Gauss Law and Electric Flux Class 12 Physics",
        markingScheme: [
          { step: "Statement of Gauss's Law with mathematical expression (∮ E · dA = q_in / ε₀)", marks: 1 },
          { step: "Reasoning that an electric dipole has net charge q + (-q) = 0, so net flux through enclosing surface is 0", marks: 1 },
        ],
        modelAnswer:
          "1. Statement: Gauss's Law states that the total electric flux (Φ) passing through any closed Gaussian surface in vacuum is equal to 1/ε₀ times the total net charge (q_net) enclosed by that surface:\n   Φ = ∮ E · dA = q_enclosed / ε₀\n\n2. For an electric dipole: An electric dipole consists of two equal and opposite point charges (+q and -q). Therefore, the net enclosed charge inside the closed Gaussian surface is:\n   q_enclosed = (+q) + (-q) = 0\n   Hence, the net electric flux passing through the closed surface is Φ = 0 / ε₀ = 0.",
      },
      {
        id: "phy_q2",
        questionNumber: 2,
        section: "Section A (2 Marks - Short Answer)",
        marks: 2,
        topic: "Drift Velocity & Mobility",
        subject: "Physics",
        suggestedWordCount: "40-60 words",
        question:
          "Define mobility of charge carriers in a conductor. How does the drift velocity of free electrons in a metallic conductor change when the temperature of the conductor is increased, keeping the applied potential difference constant?",
        keyKeywords: ["drift velocity per unit electric field", "relaxation time decreases", "temperature increases collisions", "drift velocity decreases"],
        formulaeInvolved: ["μ = |v_d| / E", "v_d = (e E τ) / m"],
        youtubeSearchTopic: "Drift velocity and temperature dependence Class 12 Physics",
        markingScheme: [
          { step: "Definition of mobility μ = v_d / E and its SI unit (m² V⁻¹ s⁻¹)", marks: 1 },
          { step: "Explanation that increasing temperature increases thermal collisions, reducing relaxation time (τ), hence drift velocity (v_d = eEτ/m) decreases", marks: 1 },
        ],
        modelAnswer:
          "1. Mobility (μ): Mobility is defined as the magnitude of drift velocity acquired by a charge carrier per unit electric field applied across the conductor:\n   μ = |v_d| / E = (e · τ) / m   [SI Unit: m² / (V · s)]\n\n2. Effect of Temperature:\n   When temperature increases, the amplitude of thermal vibrations of metal ions increases. This causes more frequent collisions with free electrons, thereby decreasing the average relaxation time (τ).\n   Since v_d = (e · E · τ) / m, for a constant potential difference (and constant electric field E), the drift velocity v_d decreases as temperature rises.",
      },
      {
        id: "phy_q3",
        questionNumber: 3,
        section: "Section A (2 Marks - Short Answer)",
        marks: 2,
        topic: "Kirchhoff's Rules",
        subject: "Physics",
        suggestedWordCount: "30-50 words",
        question:
          "State Kirchhoff's First Law (Junction Rule) and Second Law (Loop Rule). Mention the fundamental conservation law on which each is based.",
        keyKeywords: ["Junction Rule", "Loop Rule", "Conservation of Charge", "Conservation of Energy", "Σ I = 0", "Σ ΔV = 0"],
        formulaeInvolved: ["Σ I_in = Σ I_out", "Σ ΔV = 0 (or Σ E = Σ IR)"],
        youtubeSearchTopic: "Kirchhoffs Laws Class 12 Physics",
        markingScheme: [
          { step: "Junction Rule statement and stating it is based on Conservation of Electric Charge", marks: 1 },
          { step: "Loop Rule statement and stating it is based on Conservation of Energy", marks: 1 },
        ],
        modelAnswer:
          "1. Kirchhoff's First Rule (Junction Rule): The algebraic sum of currents entering and leaving any junction in an electrical circuit is zero (Σ I = 0). It is based on the Law of Conservation of Electric Charge.\n\n2. Kirchhoff's Second Rule (Loop Rule): In any closed loop of an electrical circuit, the algebraic sum of changes in potential (emfs and IR drops) around the loop is equal to zero (Σ ΔV = 0). It is based on the Law of Conservation of Energy.",
      },
      {
        id: "phy_q4",
        questionNumber: 4,
        section: "Section B (3 Marks - Conceptual & Derivation)",
        marks: 3,
        topic: "Electric Dipole on Equatorial Line",
        subject: "Physics",
        suggestedWordCount: "70-100 words",
        diagramRequired: true,
        question:
          "Derive the expression for the electric field intensity at a point on the equatorial line (broadside-on position) of an electric dipole of length 2a at distance r from the dipole center (r >> a). State the direction of the resultant electric field relative to the dipole moment vector p.",
        keyKeywords: ["E_equatorial", "cosine components add", "sine components cancel", "opposite to dipole moment", "E = -p / (4πε₀ r³)"],
        formulaeInvolved: ["E_eq = (1 / 4πε₀) · (p / (r² + a²)^(3/2)) ≈ (1 / 4πε₀) · (p / r³)"],
        youtubeSearchTopic: "Electric Field on Equatorial Line of Dipole Class 12 Physics",
        markingScheme: [
          { step: "Geometry setup, resolving E_+q and E_-q into parallel and perpendicular components, showing sine components cancel", marks: 1 },
          { step: "Calculating total field E = 2 E₁ cosθ and substituting cosθ = a / √(r² + a²)", marks: 1 },
          { step: "Applying short dipole condition (r >> a) to arrive at E = (1/4πε₀) (p / r³) and stating direction is antiparallel to p", marks: 1 },
        ],
        modelAnswer:
          "1. Field Components:\n   Let dipole charges be -q at A(-a, 0) and +q at B(+a, 0). Point P is on the equatorial axis at distance r from center O. Distance AP = BP = √(r² + a²).\n   Magnitude of field from each charge:\n   E₁ = E₂ = (1 / 4πε₀) · q / (r² + a²)\n\n2. Vector Addition:\n   Normal components (E₁ sinθ and E₂ sinθ) are equal and opposite, so they cancel out.\n   Parallel components (E₁ cosθ and E₂ cosθ) add up in the direction opposite to dipole moment p:\n   E_net = 2 E₁ cosθ\n   From triangle OPA, cosθ = a / √(r² + a²)\n   E_net = 2 · [1 / (4πε₀)] · [q / (r² + a²)] · [a / (r² + a²)^(1/2)]\n   Since dipole moment p = q · 2a:\n   E_net = (1 / 4πε₀) · p / (r² + a²)^(3/2)\n\n3. For Short Dipole (r >> a):\n   Neglecting a² compared to r²:\n   E_equatorial = (1 / 4πε₀) · (p / r³)\n   Direction: The direction of E_equatorial is opposite (anti-parallel) to the dipole moment vector p (from +q towards -q).",
      },
      {
        id: "phy_q5",
        questionNumber: 5,
        section: "Section B (3 Marks - Conceptual & Derivation)",
        marks: 3,
        topic: "Parallel Plate Capacitor with Dielectric Slab",
        subject: "Physics",
        suggestedWordCount: "60-90 words",
        question:
          "A parallel plate capacitor with air between plates has capacitance C₀ = ε₀A/d. A dielectric slab of dielectric constant K and thickness t (where t < d) is introduced between the plates. Derive the formula for the new capacitance C of the capacitor.",
        keyKeywords: ["electric field in dielectric E = E₀/K", "potential difference V = E₀(d-t) + E₀/K(t)", "C = Q/V", "C = ε₀A / (d - t(1 - 1/K))"],
        formulaeInvolved: ["V = E₀ (d - t) + (E₀ / K) t", "C = ε₀ A / [d - t (1 - 1/K)]"],
        youtubeSearchTopic: "Capacitance with dielectric slab Class 12 Physics",
        markingScheme: [
          { step: "Expressing electric field in air region (E₀) and inside dielectric slab (E = E₀/K)", marks: 1 },
          { step: "Calculating total potential difference V = E₀(d - t) + (E₀/K)t and factoring out E₀ = Q/(ε₀A)", marks: 1 },
          { step: "Substituting in C = Q/V to obtain C = ε₀A / [d - t(1 - 1/K)]", marks: 1 },
        ],
        modelAnswer:
          "1. Electric Fields:\n   Let plate area be A and plate separation be d. Charge on plates is +Q and -Q.\n   In air region of thickness (d - t): Electric field is E₀ = σ / ε₀ = Q / (A ε₀).\n   Inside dielectric slab of thickness t: Electric field is reduced to E = E₀ / K.\n\n2. Potential Difference:\n   Total potential difference V between the plates is the sum of potentials across air and dielectric:\n   V = E₀ · (d - t) + E · t\n   V = E₀ (d - t) + (E₀ / K) t = E₀ [ (d - t) + t / K ]\n   V = (Q / A ε₀) · [ d - t (1 - 1/K) ]\n\n3. Capacitance Calculation:\n   Capacitance C = Q / V:\n   C = Q / [ (Q / A ε₀) · (d - t(1 - 1/K)) ]\n   C = (ε₀ A) / [ d - t (1 - 1/K) ]\n   Notice that as K > 1, the denominator decreases, thus capacitance C > C₀ always.",
      },
      {
        id: "phy_q6",
        questionNumber: 6,
        section: "Section B (3 Marks - Numerical & Analysis)",
        marks: 3,
        topic: "Wheatstone Bridge & Resistance Network",
        subject: "Physics",
        suggestedWordCount: "50-70 words",
        question:
          "In a Wheatstone bridge network ABCD, resistances are P = 10 Ω, Q = 20 Ω, R = 15 Ω, and S = 30 Ω in cyclic order. A galvanometer of resistance 50 Ω is connected across BD and a 6V battery is connected across AC. (i) Is the bridge balanced? (ii) What current flows through the galvanometer? (iii) Find the equivalent resistance across AC.",
        keyKeywords: ["P/Q = R/S condition", "10/20 = 15/30 = 1/2", "bridge is balanced", "galvanometer current is zero", "R_eq = (30 * 45) / 75 = 18 ohms"],
        formulaeInvolved: ["P / Q = R / S", "I_g = 0", "R_eq = (P + Q)(R + S) / (P + Q + R + S)"],
        youtubeSearchTopic: "Wheatstone Bridge numericals and balance condition Class 12",
        markingScheme: [
          { step: "Checking balance ratio P/Q = 10/20 = 1/2 and R/S = 15/30 = 1/2, confirming bridge is balanced", marks: 1 },
          { step: "Stating galvanometer current I_g = 0 because potential at B equals potential at D (V_B = V_D)", marks: 1 },
          { step: "Computing equivalent resistance R_eq = (10+20) || (15+30) = (30 * 45) / (30 + 45) = 1350 / 75 = 18 Ω", marks: 1 },
        ],
        modelAnswer:
          "1. Balance Condition Check:\n   Ratio of resistances: P / Q = 10 / 20 = 1 / 2\n   Ratio of resistances: R / S = 15 / 30 = 1 / 2\n   Since P / Q = R / S, the Wheatstone bridge is perfectly balanced.\n\n2. Current through Galvanometer:\n   Because the bridge is balanced, potential at node B is equal to potential at node D (V_B = V_D).\n   Therefore, potential difference across the galvanometer V_BD = 0.\n   Current through galvanometer I_g = 0 A.\n\n3. Equivalent Resistance Across AC:\n   With no current through BD, branch ABC (P + Q = 10 + 20 = 30 Ω) is in parallel with branch ADC (R + S = 15 + 30 = 45 Ω).\n   R_eq = (R_ABC × R_ADC) / (R_ABC + R_ADC) = (30 × 45) / (30 + 45) = 1350 / 75 = 18 Ω.",
      },
      {
        id: "phy_q7",
        questionNumber: 7,
        section: "Section C (5 Marks - Long Answer & Derivation)",
        marks: 5,
        topic: "Gauss's Law Application: Infinite Line of Charge",
        subject: "Physics",
        suggestedWordCount: "100-150 words",
        diagramRequired: true,
        question:
          "(a) Using Gauss's theorem, derive the expression for the electric field intensity due to an infinitely long straight wire of uniform linear charge density λ C/m at perpendicular distance r from the wire. (b) An infinite line charge produces an electric field of 9 × 10⁴ N/C at a distance of 2 cm. Calculate the linear charge density λ. (Take 1 / 4πε₀ = 9 × 10⁹ N m² C⁻²).",
        keyKeywords: ["cylindrical Gaussian surface", "flux through flat circular caps is zero", "curved surface area 2πrl", "E = λ / 2πε₀r", "numerical λ = 10^-7 C/m = 0.1 μC/m"],
        formulaeInvolved: ["Φ = ∮ E · dA = E (2π r l)", "q_enclosed = λ l", "E = λ / (2π ε₀ r)"],
        youtubeSearchTopic: "Electric Field due to infinite line charge Gauss Law Class 12",
        markingScheme: [
          { step: "Describing cylindrical Gaussian surface coaxial with line of radius r and length l", marks: 1 },
          { step: "Showing flux through 2 circular end caps is zero (E ⊥ dA) and flux through curved surface is E(2πrl)", marks: 1.5 },
          { step: "Equating to q_in/ε₀ = λl/ε₀ and deriving E = λ / (2πε₀r)", marks: 1 },
          { step: "Correct numerical calculation of λ with formula, substitution, and final value with units (10⁻⁷ C/m)", marks: 1.5 },
        ],
        modelAnswer:
          "(a) Derivation of Electric Field due to Infinitely Long Line Charge:\n1. Gaussian Surface:\n   Consider an infinitely long wire with uniform linear charge density λ. To find field at distance r, choose a coaxial cylindrical Gaussian surface of radius r and length l.\n\n2. Electric Flux:\n   - Circular flat end caps: Electric field E is radial, while area vectors dA are along the axis. E ⊥ dA, so Φ_ends = ∮ E · dA = 0.\n   - Curved surface: E is parallel to dA at all points, and magnitude E is uniform. Flux Φ_curved = E ∮ dA = E · (2π r l).\n   Total Flux Φ = E · (2π r l).\n\n3. Applying Gauss's Law:\n   q_enclosed = λ · l\n   Φ = q_enclosed / ε₀\n   E · (2π r l) = (λ · l) / ε₀\n   E = λ / (2π ε₀ r) = (1 / 4πε₀) · (2λ / r).\n\n(b) Numerical Solution:\n   Given: E = 9 × 10⁴ N/C, r = 2 cm = 0.02 m = 2 × 10⁻² m, k = 1 / (4πε₀) = 9 × 10⁹ N m²/C².\n   Formula: E = 2 k λ / r  =>  λ = (E · r) / (2 k)\n   λ = (9 × 10⁴ × 2 × 10⁻²) / (2 × 9 × 10⁹)\n   λ = (18 × 10²) / (18 × 10⁹) = 10⁻⁷ C/m = 0.1 μC/m.\n   Final Answer: Linear charge density λ = 10⁻⁷ C/m (or 0.1 μC/m).",
      },
    ],
  },
  {
    id: "subj_c12_math_calculus",
    title: "Class 12 Mathematics: Calculus, Integrals & Differential Equations Subjective Board Paper",
    subject: "Mathematics",
    classGrade: "Class 12",
    chapterName: "Calculus & Applications",
    totalMarks: 35,
    timeLimitMinutes: 45,
    difficulty: "Standard Board",
    badge: "Official Step-Marking",
    description:
      "Definite integrals properties, area under curve bounded region, homogeneous differential equations, and maxima-minima optimization with step-by-step proofs.",
    instructions: [
      "Show all intermediate algebraic steps, substitution limits, and definite integral properties clearly.",
      "Section A: 2 Questions of 2 Marks each.",
      "Section B: 3 Questions of 3 Marks each.",
      "Section C: 4 Long Step Questions of 5 Marks each.",
    ],
    questions: [
      {
        id: "math_q1",
        questionNumber: 1,
        section: "Section A (2 Marks - Short Answer)",
        marks: 2,
        topic: "Continuity & Differentiability",
        subject: "Mathematics",
        suggestedWordCount: "30-50 words",
        question:
          "Find the value of constant k so that the function f(x) is continuous at x = 0:\nf(x) = (1 - cos 4x) / (8x²), for x ≠ 0\nf(x) = k, for x = 0",
        keyKeywords: ["LHL = RHL = f(0)", "1 - cos 4x = 2 sin² 2x", "lim (sin 2x / 2x)² = 1", "k = 1"],
        formulaeInvolved: ["1 - cos 2θ = 2 sin² θ", "lim (x→0) sin(ax)/(ax) = 1"],
        youtubeSearchTopic: "Finding k for continuity Class 12 Maths",
        markingScheme: [
          { step: "Writing condition of continuity: lim (x→0) f(x) = f(0) = k", marks: 0.5 },
          { step: "Using trigonometric identity 1 - cos 4x = 2 sin² 2x and rewriting limit as 2 sin² 2x / (8x²) = (sin 2x / 2x)²", marks: 1 },
          { step: "Evaluating limit to get k = 1", marks: 0.5 },
        ],
        modelAnswer:
          "1. Condition for continuity at x = 0:\n   lim (x → 0) f(x) = f(0) = k\n\n2. Evaluating the limit:\n   lim (x → 0) [ (1 - cos 4x) / (8x²) ]\n   Using identity 1 - cos 4x = 2 sin²(2x):\n   = lim (x → 0) [ 2 sin²(2x) / (8x²) ]\n   = lim (x → 0) [ sin²(2x) / (4x²) ]\n   = lim (x → 0) [ (sin 2x) / (2x) ]²\n\n3. Since lim (θ → 0) (sin θ / θ) = 1:\n   = (1)² = 1\n   Therefore, for f(x) to be continuous at x = 0, k = 1.",
      },
      {
        id: "math_q2",
        questionNumber: 2,
        section: "Section A (2 Marks - Short Answer)",
        marks: 2,
        topic: "Definite Integral Property",
        subject: "Mathematics",
        suggestedWordCount: "30-50 words",
        question:
          "Evaluate the definite integral using properties:\nI = ∫_{-π/2}^{π/2} (sin⁷ x + x³ cos x) dx",
        keyKeywords: ["odd function f(-x) = -f(x)", "integral from -a to a is zero for odd function", "I = 0"],
        formulaeInvolved: ["∫_{-a}^{a} f(x) dx = 0 if f(-x) = -f(x)"],
        youtubeSearchTopic: "Properties of Definite Integrals Odd Even Function Class 12",
        markingScheme: [
          { step: "Let f(x) = sin⁷ x + x³ cos x, evaluate f(-x) = sin⁷(-x) + (-x)³ cos(-x)", marks: 1 },
          { step: "Show f(-x) = -sin⁷ x - x³ cos x = -f(x) proving f is an odd function, conclude I = 0", marks: 1 },
        ],
        modelAnswer:
          "1. Let f(x) = sin⁷ x + x³ cos x.\n\n2. Test for Odd / Even function:\n   f(-x) = [sin(-x)]⁷ + (-x)³ cos(-x)\n   Since sin(-x) = -sin x and cos(-x) = cos x:\n   f(-x) = (-sin x)⁷ + (-x³) (cos x)\n   f(-x) = -sin⁷ x - x³ cos x = -(sin⁷ x + x³ cos x) = -f(x)\n\n3. Applying Property:\n   Since f(-x) = -f(x), f(x) is an odd function.\n   By the definite integral property:\n   ∫_{-a}^{a} f(x) dx = 0 when f(x) is an odd function.\n   Hence, I = 0.",
      },
      {
        id: "math_q3",
        questionNumber: 3,
        section: "Section B (3 Marks - Definite Integral King's Property)",
        marks: 3,
        topic: "King's Property of Definite Integrals",
        subject: "Mathematics",
        suggestedWordCount: "60-90 words",
        question:
          "Evaluate the definite integral:\nI = ∫₀^{π/2} [ √sin x / (√sin x + √cos x) ] dx",
        keyKeywords: ["King's property", "f(a - x)", "sin(π/2 - x) = cos x", "2I = ∫ 1 dx = π/2", "I = π/4"],
        formulaeInvolved: ["∫₀ᵃ f(x) dx = ∫₀ᵃ f(a - x) dx", "2I = π/2 => I = π/4"],
        youtubeSearchTopic: "Evaluate root sin x by root sin x plus root cos x Class 12",
        markingScheme: [
          { step: "Writing equation (1) and applying property ∫₀ᵃ f(x) dx = ∫₀ᵃ f(a - x) dx to get equation (2)", marks: 1 },
          { step: "Adding (1) and (2) to get 2I = ∫₀^{π/2} 1 dx = [x]₀^{π/2}", marks: 1 },
          { step: "Evaluating 2I = π/2 to arrive at final answer I = π/4", marks: 1 },
        ],
        modelAnswer:
          "1. Let I = ∫₀^{π/2} [ √sin x / (√sin x + √cos x) ] dx  --- (Equation 1)\n\n2. Applying property ∫₀ᵃ f(x) dx = ∫₀ᵃ f(a - x) dx:\n   I = ∫₀^{π/2} [ √sin(π/2 - x) / (√sin(π/2 - x) + √cos(π/2 - x)) ] dx\n   Since sin(π/2 - x) = cos x and cos(π/2 - x) = sin x:\n   I = ∫₀^{π/2} [ √cos x / (√cos x + √sin x) ] dx  --- (Equation 2)\n\n3. Adding Equation (1) and Equation (2):\n   2I = ∫₀^{π/2} [ (√sin x + √cos x) / (√sin x + √cos x) ] dx\n   2I = ∫₀^{π/2} 1 dx\n   2I = [ x ]₀^{π/2} = π/2 - 0 = π/2\n   I = π / 4.",
      },
      {
        id: "math_q4",
        questionNumber: 4,
        section: "Section C (5 Marks - Differential Equation)",
        marks: 5,
        topic: "Homogeneous Differential Equation",
        subject: "Mathematics",
        suggestedWordCount: "100-140 words",
        question:
          "Solve the differential equation:\nx · (dy/dx) - y + x · sin(y/x) = 0, given that y = π/2 when x = 1.",
        keyKeywords: ["dy/dx = y/x - sin(y/x)", "put y = vx", "v + x dv/dx", "cosec v dv = -dx/x", "log|cosec v - cot v| = -log|x| + log C", "cosec(y/x) - cot(y/x) = 1/x"],
        formulaeInvolved: ["y = v x => dy/dx = v + x (dv/dx)", "∫ cosec v dv = ln|cosec v - cot v|"],
        youtubeSearchTopic: "Homogeneous differential equation with sin y by x Class 12",
        markingScheme: [
          { step: "Rearranging to dy/dx = y/x - sin(y/x) and substituting y = vx, dy/dx = v + x(dv/dx)", marks: 1.5 },
          { step: "Separating variables: -cosec v dv = dx/x and integrating both sides", marks: 1.5 },
          { step: "Finding general solution: ln|cosec(y/x) - cot(y/x)| = -ln|x| + ln C => cosec(y/x) - cot(y/x) = C/x", marks: 1 },
          { step: "Applying boundary condition y(1) = π/2 to find C = 1 and writing particular solution", marks: 1 },
        ],
        modelAnswer:
          "1. Rewrite the given differential equation:\n   dy/dx = (y / x) - sin(y / x)\n   This is a homogeneous differential equation of degree 0.\n\n2. Substitution:\n   Let y = v x  =>  dy/dx = v + x (dv/dx)\n   Substitute in the equation:\n   v + x (dv/dx) = v - sin v\n   x (dv/dx) = -sin v\n\n3. Separating Variables & Integrating:\n   -(1 / sin v) dv = (1 / x) dx\n   -cosec v dv = (1 / x) dx\n   Integrating both sides:\n   -∫ cosec v dv = ∫ (1 / x) dx\n   -ln|cosec v - cot v| = ln|x| + ln C₁\n   ln|cosec v - cot v|⁻¹ = ln|C₁ x|\n   1 / (cosec v - cot v) = C₁ x   (or: cosec v - cot v = C / x)\n\n4. Substituting back v = y/x:\n   cosec(y/x) - cot(y/x) = C / x\n\n5. Finding Particular Solution with y = π/2 at x = 1:\n   cosec(π/2) - cot(π/2) = C / 1\n   1 - 0 = C  =>  C = 1\n\n   Particular Solution:\n   cosec(y/x) - cot(y/x) = 1/x\n   (or in simplified trig form: (1 - cos(y/x)) / sin(y/x) = 1/x => tan(y / 2x) = 1/x).",
      },
    ],
  },
  {
    id: "subj_c10_sci_board",
    title: "Class 10 Science: Board Exam Subjective Model Paper 2026",
    subject: "Science",
    classGrade: "Class 10",
    chapterName: "Chemical Reactions, Light & Life Processes",
    totalMarks: 30,
    timeLimitMinutes: 40,
    difficulty: "Standard Board",
    badge: "CBSE Class 10 Special",
    description:
      "Balancing redox reactions, ray diagrams for concave mirror/convex lens, nephron structure & function, and electric power step numericals.",
    instructions: [
      "All questions are compulsory.",
      "Draw neat labeled ray diagrams and circuit schematics wherever asked.",
      "Write balanced chemical equations with state symbols.",
    ],
    questions: [
      {
        id: "c10_q1",
        questionNumber: 1,
        section: "Section A (2 Marks - Short Answer)",
        marks: 2,
        topic: "Chemical Reactions: Redox",
        subject: "Science",
        suggestedWordCount: "30-50 words",
        question:
          "Identify the substance oxidized, substance reduced, oxidizing agent, and reducing agent in the following reaction:\nMnO₂ + 4HCl → MnCl₂ + 2H₂O + Cl₂",
        keyKeywords: ["HCl is oxidized to Cl2", "MnO2 is reduced to MnCl2", "MnO2 is oxidizing agent", "HCl is reducing agent"],
        formulaeInvolved: ["Oxidation = Loss of H / Gain of O", "Reduction = Gain of H / Loss of O"],
        youtubeSearchTopic: "Identify oxidized and reduced substances Class 10 Chemistry",
        markingScheme: [
          { step: "Substance oxidized: HCl; Substance reduced: MnO₂", marks: 1 },
          { step: "Oxidizing agent: MnO₂; Reducing agent: HCl", marks: 1 },
        ],
        modelAnswer:
          "1. Substance Oxidized: HCl (Hydrogen is removed from HCl to form Cl₂).\n2. Substance Reduced: MnO₂ (Oxygen is removed from MnO₂ to form MnCl₂).\n3. Oxidizing Agent: MnO₂ (It provides oxygen / causes oxidation of HCl).\n4. Reducing Agent: HCl (It reduces MnO₂ to MnCl₂).",
      },
      {
        id: "c10_q2",
        questionNumber: 2,
        section: "Section B (3 Marks - Ray Optics & Mirror Formula)",
        marks: 3,
        topic: "Light: Reflection & Spherical Mirrors",
        subject: "Science",
        suggestedWordCount: "50-80 words",
        diagramRequired: true,
        question:
          "An object of height 5 cm is placed at a distance of 20 cm in front of a concave mirror of focal length 15 cm. Find the position, nature, and size of the image formed.",
        keyKeywords: ["u = -20 cm", "f = -15 cm", "1/v = 1/f - 1/u", "v = -60 cm", "m = -v/u = -3", "h' = -15 cm", "real inverted magnified"],
        formulaeInvolved: ["1/f = 1/v + 1/u", "m = h'/h = -v/u"],
        youtubeSearchTopic: "Concave mirror numericals and sign convention Class 10 Light",
        markingScheme: [
          { step: "Correct sign convention: u = -20 cm, f = -15 cm, h = +5 cm", marks: 0.5 },
          { step: "Using mirror formula 1/f = 1/v + 1/u to calculate image distance v = -60 cm", marks: 1.5 },
          { step: "Using magnification m = -v/u to find height h' = -15 cm and stating nature (Real, Inverted, Magnified)", marks: 1 },
        ],
        modelAnswer:
          "1. Given Data with Sign Convention:\n   Object height (h) = +5 cm\n   Object distance (u) = -20 cm\n   Focal length (f) = -15 cm (concave mirror has negative focal length)\n\n2. Finding Image Position (v):\n   Mirror formula: 1/f = 1/v + 1/u\n   1/v = 1/f - 1/u\n   1/v = (1 / -15) - (1 / -20) = -1/15 + 1/20\n   LCM of 15 and 20 = 60\n   1/v = (-4 + 3) / 60 = -1 / 60\n   v = -60 cm\n   The image is formed at 60 cm in front of the mirror (on the same side as the object).\n\n3. Finding Image Size (h') and Nature:\n   Magnification m = h' / h = -v / u\n   h' / 5 = -(-60) / (-20) = -(+3) = -3\n   h' = -3 × 5 = -15 cm\n\n4. Nature of Image:\n   - Position: 60 cm in front of the mirror\n   - Nature: Real and Inverted (negative sign of v and h')\n   - Size: Magnified (image height is 15 cm, 3 times the object size).",
      },
      {
        id: "c10_q3",
        questionNumber: 3,
        section: "Section C (5 Marks - Life Processes & Biology)",
        marks: 5,
        topic: "Excretion & Nephron Structure",
        subject: "Science",
        suggestedWordCount: "100-140 words",
        diagramRequired: true,
        question:
          "(a) What is a nephron? Describe the three main steps involved in urine formation in human kidneys.\n(b) Why is the amount of urine produced regulated in our body?",
        keyKeywords: ["structural and functional unit of kidney", "Ultrafiltration in Glomerulus", "Selective reabsorption of glucose amino acids salts water in tubules", "Tubular secretion", "regulated by water intake and waste presence"],
        formulaeInvolved: [],
        youtubeSearchTopic: "Structure and functioning of Nephron Class 10 Life Processes",
        markingScheme: [
          { step: "Definition of nephron as structural & functional filtration unit of kidney", marks: 1 },
          { step: "Detailed explanation of 3 steps: Ultrafiltration (Bowman's capsule), Selective Reabsorption (Tubule), and Tubular Secretion (Collecting duct)", marks: 2.5 },
          { step: "Explaining regulation: depends on excess water in body and amount of dissolved nitrogenous wastes", marks: 1.5 },
        ],
        modelAnswer:
          "(a) Nephron and Urine Formation:\n1. Nephron Definition: A nephron is the basic structural and functional microscopic filtration unit of the kidney. Each human kidney contains approximately 1 million nephrons.\n\n2. Three Steps of Urine Formation:\n   i. Glomerular Filtration (Ultrafiltration): Blood enters the glomerulus under high pressure through the afferent arteriole. Water, glucose, amino acids, urea, and mineral salts filter across the thin capillary walls into Bowman's capsule as primary filtrate.\n   ii. Selective Reabsorption: As the filtrate flows along the tubular part of the nephron (Henle's loop and convoluted tubules), useful substances such as all glucose, amino acids, essential salts, and major amount of water are selectively reabsorbed back into surrounding blood capillaries.\n   iii. Tubular Secretion: Extra ions (such as K⁺, H⁺) and waste substances are actively secreted from capillary blood into the tubule to maintain electrolyte and pH balance. The remaining fluid enters the collecting duct as urine.\n\n(b) Regulation of Urine Volume:\nThe amount of urine produced is regulated based on:\n1. The amount of excess water present in body fluids (if body is dehydrated, more water is reabsorbed under ADH hormone action, producing concentrated urine).\n2. The amount of dissolved nitrogenous waste (urea, uric acid) that needs to be excreted from the body.",
      },
    ],
  },
];
