import { ScholarVideoItem } from "../types";

export const SCHOLAR_ALL_VIDEOS: ScholarVideoItem[] = [
  // ==========================================
  // --- 1. MATHEMATICS (Class 6 - 12 & Competitive) ---
  // ==========================================
  {
    id: "vid_math_quad_eq",
    type: "long",
    platform: "youtube",
    title: "Quadratic Equations Complete One Shot - Formulas, Roots & Discriminant",
    concept: "Quadratic Equations & Roots",
    subject: "Mathematics",
    classGrade: "Class 10",
    chapter: "Quadratic Equations",
    duration: "28:15",
    durationSeconds: 1695,
    channel: "Khan Academy & CBSE Math",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.youtube.com/watch?v=i7idZfS8t8w",
    youtubeUrl: "https://www.youtube.com/watch?v=i7idZfS8t8w",
    shortsUrl: "https://www.youtube.com/shorts/5eM8qZ1k4aA",
    reelsUrl: "https://www.instagram.com/reels/C4k89z1aQv/",
    youtubeId: "i7idZfS8t8w",
    thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=80",
    description: "Complete masterclass on quadratic equations: standard form ax² + bx + c = 0, discriminant nature of roots, and quadratic formula derivation.",
    tags: ["Quadratic Equations", "Discriminant", "Class 10 Math", "CBSE Board", "Roots"],
    views: "2.8M",
    likes: "140K",
    rating: 4.9,
    difficulty: "Exam-Oriented",
    quickExplanation: "A quadratic equation is a second-degree polynomial equation ax² + bx + c = 0 where a ≠ 0. The discriminant D = b² - 4ac dictates whether roots are real and distinct (D > 0), real and equal (D = 0), or non-real/imaginary (D < 0).",
    keyPoints: [
      "Standard format is ax² + bx + c = 0 with a ≠ 0.",
      "Discriminant D = b² - 4ac.",
      "If D > 0: two distinct real roots.",
      "If D = 0: two equal real roots (-b/2a).",
      "If D < 0: no real roots (complex roots).",
      "Quadratic formula: x = (-b ± √D) / (2a)."
    ],
    formulaOrDefinition: "Quadratic Formula: x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\quad \\text{where } D = b^2 - 4ac",
    practiceQuestion: {
      question: "For the quadratic equation 2x² - 4x + 2 = 0, what is the nature of its roots?",
      options: [
        "Two distinct real roots",
        "Two equal real roots",
        "No real roots (imaginary)",
        "Three real roots"
      ],
      correctIndex: 1,
      explanation: "D = b² - 4ac = (-4)² - 4(2)(2) = 16 - 16 = 0. Since D = 0, the equation has two equal real roots x = -(-4)/(2*2) = 1."
    },
    keyTimestamps: [
      { time: "0:00", label: "Introduction to Quadratic Form" },
      { time: "7:20", label: "Discriminant & Nature of Roots" },
      { time: "18:40", label: "Solving Board Word Problems" }
    ]
  },
  {
    id: "vid_math_trig_class10",
    type: "long",
    platform: "youtube",
    title: "Introduction to Trigonometry: sin, cos, tan & Standard Values Table",
    concept: "Trigonometric Ratios & Table",
    subject: "Mathematics",
    classGrade: "Class 10",
    chapter: "Introduction to Trigonometry",
    duration: "34:20",
    durationSeconds: 2060,
    channel: "Vedantu Class 9 & 10",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.youtube.com/watch?v=PUB0TaZ7bhA",
    youtubeUrl: "https://www.youtube.com/watch?v=PUB0TaZ7bhA",
    shortsUrl: "https://www.youtube.com/shorts/8dJ7z1k3xPq",
    reelsUrl: "https://www.instagram.com/reels/C5m91x8zKm/",
    youtubeId: "PUB0TaZ7bhA",
    thumbnailUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=80",
    description: "Learn all 6 trigonometric ratios (sin, cos, tan, cosec, sec, cot) using right-angled triangles and memorize the 0°, 30°, 45°, 60°, 90° angle table easily.",
    tags: ["Trigonometry", "sin cos tan", "Class 10 Board", "Right Triangle", "Identities"],
    views: "4.1M",
    likes: "210K",
    rating: 4.8,
    difficulty: "Easy",
    quickExplanation: "Trigonometry studies relationships between side lengths and angles of triangles. For an acute angle θ in a right triangle: sin θ = Opposite/Hypotenuse, cos θ = Adjacent/Hypotenuse, tan θ = Opposite/Adjacent.",
    keyPoints: [
      "sin θ = P / H, cos θ = B / H, tan θ = P / B (SOH CAH TOA).",
      "cosec θ = 1/sin θ, sec θ = 1/cos θ, cot θ = 1/tan θ.",
      "Fundamental identity: sin²θ + cos²θ = 1.",
      "1 + tan²θ = sec²θ and 1 + cot²θ = cosec²θ.",
      "sin 30° = 1/2, cos 60° = 1/2, tan 45° = 1."
    ],
    formulaOrDefinition: "\\sin^2\\theta + \\cos^2\\theta = 1, \\quad 1 + \\tan^2\\theta = \\sec^2\\theta, \\quad 1 + \\cot^2\\theta = \\csc^2\\theta",
    practiceQuestion: {
      question: "If sin θ = 3/5 in a right-angled triangle, what is the value of cos θ?",
      options: ["4/5", "5/3", "3/4", "4/3"],
      correctIndex: 0,
      explanation: "Using cos²θ = 1 - sin²θ = 1 - (9/25) = 16/25. Thus cos θ = √(16/25) = 4/5."
    }
  },
  {
    id: "vid_math_integration_jee",
    type: "long",
    platform: "youtube",
    title: "Integration by Parts, Substitution & Definite Properties One Shot",
    concept: "Integral Calculus & LIATE Rule",
    subject: "Mathematics",
    classGrade: "Class 12",
    chapter: "Integrals",
    duration: "45:10",
    durationSeconds: 2710,
    channel: "Physics Galaxy / Math Merits",
    creatorAvatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.youtube.com/watch?v=2I-_SV8cwsw",
    youtubeUrl: "https://www.youtube.com/watch?v=2I-_SV8cwsw",
    shortsUrl: "https://www.youtube.com/shorts/8dJ7z1k3xPq",
    reelsUrl: "https://www.instagram.com/reels/C4k89z1aQv/",
    youtubeId: "2I-_SV8cwsw",
    thumbnailUrl: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=500&auto=format&fit=crop&q=80",
    description: "Master high-weightage integration techniques for Class 12 Boards and JEE Main. Full coverage of LIATE order and definite integration king properties.",
    tags: ["Integration", "Calculus", "LIATE", "Class 12 Math", "JEE Main"],
    views: "3.5M",
    likes: "190K",
    rating: 4.9,
    difficulty: "Exam-Oriented",
    quickExplanation: "Integration by parts formula is derived from the product rule of differentiation: ∫ u v dx = u ∫ v dx - ∫ [u' (∫ v dx)] dx. The choice of the first function u follows the LIATE mnemonic (Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential).",
    keyPoints: [
      "LIATE Order: Logarithmic → Inverse Trig → Algebraic → Trigonometric → Exponential.",
      "Formula: ∫ u · v' dx = u·v - ∫ u'·v dx.",
      "Definite property (King Rule): ∫[a to b] f(x) dx = ∫[a to b] f(a + b - x) dx.",
      "Even/Odd functions: If f(-x) = -f(x), then ∫[-a to a] f(x) dx = 0."
    ],
    formulaOrDefinition: "\\int u \\, v \\, dx = u \\int v \\, dx - \\int \\left( \\frac{du}{dx} \\int v \\, dx \\right) dx",
    practiceQuestion: {
      question: "According to the LIATE rule, which function should be chosen as 'u' in the integral ∫ x · ln(x) dx?",
      options: [
        "x (Algebraic)",
        "ln(x) (Logarithmic)",
        "dx",
        "Either can be chosen arbitrarily"
      ],
      correctIndex: 1,
      explanation: "In LIATE, 'L' (Logarithmic) comes before 'A' (Algebraic). Therefore, u = ln(x) and dv = x dx."
    }
  },
  {
    id: "short_math_pythagoras_trick",
    type: "short",
    platform: "youtube",
    title: "Pythagoras Theorem in 30 Seconds with Visual Proof! 📐",
    concept: "Pythagoras Theorem Visual Proof",
    subject: "Mathematics",
    classGrade: "Class 10",
    chapter: "Triangles",
    duration: "0:42",
    durationSeconds: 42,
    channel: "Math In 60s",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.youtube.com/shorts/5eM8qZ1k4aA",
    youtubeUrl: "https://www.youtube.com/watch?v=PUB0TaZ7bhA",
    shortsUrl: "https://www.youtube.com/shorts/5eM8qZ1k4aA",
    reelsUrl: "https://www.instagram.com/reels/C4k89z1aQv/",
    youtubeId: "5eM8qZ1k4aA",
    thumbnailUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=80",
    description: "Visual rearrangement proof of Pythagoras Theorem a² + b² = c² in a right-angled triangle.",
    tags: ["Pythagoras", "Shorts", "Math Tricks", "Class 10", "Geometry"],
    views: "1.4M",
    likes: "89K",
    rating: 4.9,
    difficulty: "Easy",
    quickExplanation: "In any right-angled triangle, the area of the square on the hypotenuse equals the sum of the areas of the squares on the other two sides: a² + b² = c².",
    keyPoints: [
      "Applies only to right-angled triangles (90° angle).",
      "Hypotenuse (c) is always the longest side opposite the 90° angle.",
      "Common Pythagorean triplets: (3, 4, 5), (5, 12, 13), (8, 15, 17)."
    ],
    formulaOrDefinition: "a^2 + b^2 = c^2 \\quad (\\text{where } c \\text{ is hypotenuse})",
    practiceQuestion: {
      question: "If a right triangle has legs of lengths 6 cm and 8 cm, what is the length of its hypotenuse?",
      options: ["10 cm", "12 cm", "14 cm", "9 cm"],
      correctIndex: 0,
      explanation: "c = √(6² + 8²) = √(36 + 64) = √100 = 10 cm."
    }
  },
  {
    id: "short_math_derivative_power_rule",
    type: "short",
    platform: "youtube",
    title: "Power Rule of Differentiation in 35s! d/dx (xⁿ) = n·xⁿ⁻¹ ⚡",
    concept: "Derivatives Power Rule",
    subject: "Mathematics",
    classGrade: "Class 11",
    chapter: "Limits and Derivatives",
    duration: "0:35",
    durationSeconds: 35,
    channel: "Calculus Shorts Hub",
    creatorAvatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.youtube.com/shorts/8dJ7z1k3xPq",
    youtubeUrl: "https://www.youtube.com/watch?v=2I-_SV8cwsw",
    shortsUrl: "https://www.youtube.com/shorts/8dJ7z1k3xPq",
    reelsUrl: "https://www.instagram.com/reels/C5m91x8zKm/",
    youtubeId: "8dJ7z1k3xPq",
    thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=80",
    description: "Bring the power to the front, subtract 1 from the power! Master the fundamental derivative formula with quick examples.",
    tags: ["Calculus", "Derivatives", "Power Rule", "Shorts", "Math"],
    views: "1.8M",
    likes: "115K",
    rating: 4.8,
    difficulty: "Easy",
    quickExplanation: "The power rule states that the derivative of x to any constant power n is obtained by multiplying by the original exponent n and decrementing the exponent by 1: d/dx (xⁿ) = n · xⁿ⁻¹.",
    keyPoints: [
      "Formula: d/dx (xⁿ) = n · xⁿ⁻¹.",
      "Example: d/dx (x⁴) = 4x³.",
      "Constant derivative is always 0: d/dx (c) = 0.",
      "Square root rule: d/dx (√x) = 1 / (2√x)."
    ],
    formulaOrDefinition: "\\frac{d}{dx}(x^n) = n \\cdot x^{n-1}",
    practiceQuestion: {
      question: "What is the derivative of f(x) = 5x³ with respect to x?",
      options: ["15x²", "15x³", "5x²", "10x²"],
      correctIndex: 0,
      explanation: "d/dx (5x³) = 5 · (3 · x³⁻¹) = 15x²."
    }
  },

  // ==========================================
  // --- 2. SCIENCE & PHYSICS ---
  // ==========================================
  {
    id: "vid_sci_light_class10",
    type: "long",
    platform: "youtube",
    title: "Light: Reflection & Refraction, Mirror Formula & Lens Sign Convention",
    concept: "Light Reflection, Refraction & Lenses",
    subject: "Science",
    classGrade: "Class 10",
    chapter: "Light - Reflection and Refraction",
    duration: "38:40",
    durationSeconds: 2320,
    channel: "Magnet Brains / Physics Wallah Foundation",
    creatorAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.youtube.com/watch?v=d_a3Jb2k9aI",
    youtubeUrl: "https://www.youtube.com/watch?v=d_a3Jb2k9aI",
    shortsUrl: "https://www.youtube.com/shorts/5eM8qZ1k4aA",
    reelsUrl: "https://www.instagram.com/reels/C4k89z1aQv/",
    youtubeId: "d_a3Jb2k9aI",
    thumbnailUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=500&auto=format&fit=crop&q=80",
    description: "Complete chapter guide on spherical mirrors (concave & convex), Snell's law of refraction, lens formula, and magnification sign conventions.",
    tags: ["Light", "Refraction", "Mirror Formula", "Class 10 Science", "Snell Law"],
    views: "5.2M",
    likes: "310K",
    rating: 4.9,
    difficulty: "Exam-Oriented",
    quickExplanation: "Light reflects according to the law of reflection (∠i = ∠r) and refracts due to change in light speed across optical media (Snell's Law: n₁ sin i = n₂ sin r). Mirror formula is 1/f = 1/v + 1/u, while Lens formula is 1/f = 1/v - 1/u.",
    keyPoints: [
      "Mirror formula: 1/f = 1/v + 1/u (Magnification m = -v/u).",
      "Lens formula: 1/f = 1/v - 1/u (Magnification m = +v/u).",
      "Convex mirror always forms a virtual, erect, and diminished image.",
      "Snell's Law: n = sin(i) / sin(r) = c / v.",
      "Power of Lens P = 1 / f (in meters), measured in Dioptres (D)."
    ],
    formulaOrDefinition: "\\text{Mirror: } \\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}, \\quad \\text{Lens: } \\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}, \\quad P = \\frac{1}{f(\\text{in m})}",
    practiceQuestion: {
      question: "A convex lens has a focal length of +20 cm. What is its optical power in dioptres?",
      options: ["+5 D", "-5 D", "+0.05 D", "+2 D"],
      correctIndex: 0,
      explanation: "f = +20 cm = +0.20 m. Power P = 1 / f(m) = 1 / 0.20 = +5 Dioptres (D)."
    }
  },
  {
    id: "vid_phy_current_electricity",
    type: "long",
    platform: "youtube",
    title: "Current Electricity: Ohm's Law, Kirchhoff's Laws & Wheatstone Bridge",
    concept: "Kirchhoff's Laws & Current Circuits",
    subject: "Physics",
    classGrade: "Class 12",
    chapter: "Current Electricity",
    duration: "41:15",
    durationSeconds: 2475,
    channel: "Unacademy JEE / Physics Wallah",
    creatorAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.youtube.com/watch?v=1bV4gq1_GqU",
    youtubeUrl: "https://www.youtube.com/watch?v=1bV4gq1_GqU",
    shortsUrl: "https://www.youtube.com/shorts/5eM8qZ1k4aA",
    reelsUrl: "https://www.instagram.com/reels/C4k89z1aQv/",
    youtubeId: "1bV4gq1_GqU",
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80",
    description: "Master complex circuit analysis with Kirchhoff's Current Law (Junction Rule), Kirchhoff's Voltage Law (Loop Rule), and the balanced Wheatstone bridge condition.",
    tags: ["Current Electricity", "Kirchhoff Laws", "Ohm Law", "Wheatstone Bridge", "Class 12 Board"],
    views: "2.9M",
    likes: "165K",
    rating: 4.8,
    difficulty: "Exam-Oriented",
    quickExplanation: "Kirchhoff's Current Law (KCL) states total current entering a junction equals current leaving (conservation of charge). Kirchhoff's Voltage Law (KVL) states the algebraic sum of potential drops around any closed loop is zero (conservation of energy).",
    keyPoints: [
      "KCL is based on the Principle of Conservation of Electric Charge.",
      "KVL is based on the Principle of Conservation of Energy.",
      "Ohm's Law: V = I · R where R = ρ · (L / A).",
      "Balanced Wheatstone Bridge condition: R₁ / R₂ = R₃ / R₄ (no current flows through galvanometer)."
    ],
    formulaOrDefinition: "\\sum I_{\\text{in}} = \\sum I_{\\text{out}} \\quad (\\text{KCL}), \\quad \\sum \\Delta V_{\\text{closed loop}} = 0 \\quad (\\text{KVL})",
    practiceQuestion: {
      question: "Kirchhoff's Junction Rule (Current Law) is a direct consequence of the conservation of which physical quantity?",
      options: ["Energy", "Electric Charge", "Momentum", "Mass"],
      correctIndex: 1,
      explanation: "KCL asserts that no charge can accumulate at a junction point, directly manifesting the law of Conservation of Electric Charge."
    }
  },
  {
    id: "short_phy_flemings_left_hand",
    type: "short",
    platform: "instagram",
    title: "Fleming's Left Hand Rule Trick (FBI Hand Rule) ⚡🧲",
    concept: "Fleming's Left Hand Rule",
    subject: "Physics",
    classGrade: "Class 10",
    chapter: "Magnetic Effects of Electric Current",
    duration: "0:38",
    durationSeconds: 38,
    channel: "@physics_daily_reels",
    creatorAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.instagram.com/reels/C4k89z1aQv/",
    youtubeUrl: "https://www.youtube.com/watch?v=1bV4gq1_GqU",
    shortsUrl: "https://www.youtube.com/shorts/5eM8qZ1k4aA",
    reelsUrl: "https://www.instagram.com/reels/C4k89z1aQv/",
    instagramId: "C4k89z1aQv",
    thumbnailUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=500&auto=format&fit=crop&q=80",
    description: "Remember the FBI mnemonic for Fleming's Left Hand Rule: Thumb = Force (F), Forefinger = Magnetic field (B), Middle finger = Current (I).",
    tags: ["Flemings Rule", "Magnetic Force", "FBI Trick", "Instagram Reel", "Physics"],
    views: "980K",
    likes: "72K",
    rating: 4.8,
    difficulty: "Easy",
    quickExplanation: "Fleming's Left Hand Rule determines the direction of magnetic force acting on a current-carrying conductor placed inside an external magnetic field.",
    keyPoints: [
      "F = Thumb = Force / Motion of conductor.",
      "B = Forefinger = Magnetic Field direction (North to South).",
      "I = Middle finger = Direction of conventional Electric Current.",
      "All three fingers are held mutually perpendicular (90°)."
    ],
    formulaOrDefinition: "\\vec{F} = I (\\vec{L} \\times \\vec{B}) \\quad \\implies \\quad F = I L B \\sin\\theta",
    practiceQuestion: {
      question: "In Fleming's Left Hand Rule, what does the Forefinger represent?",
      options: [
        "Magnetic Field direction",
        "Force / Motion direction",
        "Current direction",
        "Electric Potential"
      ],
      correctIndex: 0,
      explanation: "Using the FBI mnemonic: F (Thumb) = Force, B (Forefinger) = Magnetic Field, I (Middle finger) = Current."
    }
  },

  // ==========================================
  // --- 3. CHEMISTRY ---
  // ==========================================
  {
    id: "vid_chem_chemical_rxns_class10",
    type: "long",
    platform: "youtube",
    title: "Chemical Reactions and Equations: Balancing, Types & Redox in One Shot",
    concept: "Chemical Equations & Redox Reactions",
    subject: "Chemistry",
    classGrade: "Class 10",
    chapter: "Chemical Reactions and Equations",
    duration: "32:50",
    durationSeconds: 1970,
    channel: "Next Level Academy / Khan Academy India",
    creatorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.youtube.com/watch?v=g-f19h1JkYg",
    youtubeUrl: "https://www.youtube.com/watch?v=g-f19h1JkYg",
    shortsUrl: "https://www.youtube.com/shorts/3jK8qZ1k9aB",
    reelsUrl: "https://www.instagram.com/reels/C5m91x8zKm/",
    youtubeId: "g-f19h1JkYg",
    thumbnailUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500&auto=format&fit=crop&q=80",
    description: "Learn how to balance any chemical equation, identify combination, decomposition, displacement, double displacement, and redox (oxidation-reduction) reactions.",
    tags: ["Chemical Reactions", "Balancing Equations", "Redox", "Class 10 Chemistry", "Displacement"],
    views: "3.9M",
    likes: "180K",
    rating: 4.9,
    difficulty: "Easy",
    quickExplanation: "Chemical reactions transform reactants into products with conservation of mass. Oxidation involves addition of oxygen or loss of electrons (OIL), while reduction involves addition of hydrogen or gain of electrons (RIG).",
    keyPoints: [
      "Law of Conservation of Mass requires balancing number of atoms on both sides.",
      "Combination: A + B → AB.",
      "Decomposition: AB → A + B (Thermal, Electrolytic, Photolytic).",
      "Displacement: Highly reactive metal displaces less reactive metal.",
      "Redox: Oxidation is loss of electrons; Reduction is gain of electrons (OIL RIG)."
    ],
    formulaOrDefinition: "\\text{Redox: } \\text{Oxidation (Loss of } e^-) \\iff \\text{Reduction (Gain of } e^-)",
    practiceQuestion: {
      question: "In the reaction CuO + H₂ → Cu + H₂O, which substance is being oxidized?",
      options: ["CuO", "H₂", "Cu", "H₂O"],
      correctIndex: 1,
      explanation: "Hydrogen (H₂) gains oxygen to form H₂O, which means H₂ is oxidized. CuO loses oxygen and is reduced to Cu."
    }
  },
  {
    id: "short_chem_sn1_sn2_trick",
    type: "short",
    platform: "instagram",
    title: "SN1 vs SN2 in 40 Seconds! Never Forget Again 🧪",
    concept: "SN1 vs SN2 Quick Reaction Comparison",
    subject: "Chemistry",
    classGrade: "Class 12",
    chapter: "Haloalkanes and Haloarenes",
    duration: "0:40",
    durationSeconds: 40,
    channel: "@organic_chemistry_hacks",
    creatorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.instagram.com/reels/C5m91x8zKm/",
    youtubeUrl: "https://www.youtube.com/watch?v=g-f19h1JkYg",
    shortsUrl: "https://www.youtube.com/shorts/3jK8qZ1k9aB",
    reelsUrl: "https://www.instagram.com/reels/C5m91x8zKm/",
    instagramId: "C5m91x8zKm",
    thumbnailUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500&auto=format&fit=crop&q=80",
    description: "Quick mnemonic: SN1 = 2 steps, 3° carbocation, polar protic solvent, racemization. SN2 = 1 step, 1° carbon, backside attack, inversion of configuration!",
    tags: ["SN1", "SN2", "Organic Chemistry", "Reels", "NEET Tricks"],
    views: "1.2M",
    likes: "94K",
    rating: 4.9,
    difficulty: "Exam-Oriented",
    quickExplanation: "SN1 is unimolecular with a carbocation intermediate (favors 3° > 2° > 1°). SN2 is bimolecular with concerted backside attack and Walden inversion (favors 1° > 2° > 3°).",
    keyPoints: [
      "SN1: Rate = k[Substrate], 2 steps, carbocation formed, racemization.",
      "SN2: Rate = k[Substrate][Nu⁻], 1 concerted step, Walden inversion.",
      "Solvent: SN1 loves Polar Protic (H₂O, EtOH); SN2 loves Polar Aprotic (Acetone, DMSO)."
    ],
    formulaOrDefinition: "\\text{SN1 Rate} = k[\\text{RX}], \\quad \\text{SN2 Rate} = k[\\text{RX}][\\text{Nu}^-]",
    practiceQuestion: {
      question: "Which alkyl halide undergoes substitution most rapidly via the SN2 pathway?",
      options: [
        "CH₃-Cl (Methyl chloride - 1°)",
        "(CH₃)₃C-Cl (tert-butyl chloride - 3°)",
        "(CH₃)₂CH-Cl (isopropyl chloride - 2°)",
        "Sterically crowded neopentyl chloride"
      ],
      correctIndex: 0,
      explanation: "SN2 is hindered by steric bulk. Methyl chloride (CH₃-Cl) has the lowest steric hindrance, enabling rapid backside nucleophilic attack."
    }
  },

  // ==========================================
  // --- 4. BIOLOGY ---
  // ==========================================
  {
    id: "vid_bio_life_processes_class10",
    type: "long",
    platform: "youtube",
    title: "Life Processes Full Chapter: Nutrition, Respiration, Transport & Excretion",
    concept: "Life Processes & Human Systems",
    subject: "Biology",
    classGrade: "Class 10",
    chapter: "Life Processes",
    duration: "48:30",
    durationSeconds: 2910,
    channel: "Vedantu Class 10 / Biology Simplified",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.youtube.com/watch?v=8kK2zwjRV0M",
    youtubeUrl: "https://www.youtube.com/watch?v=8kK2zwjRV0M",
    shortsUrl: "https://www.youtube.com/shorts/3jK8qZ1k9aB",
    reelsUrl: "https://www.instagram.com/reels/C3n82x9vLa/",
    youtubeId: "8kK2zwjRV0M",
    thumbnailUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=500&auto=format&fit=crop&q=80",
    description: "Complete animated walkthrough of autotrophic nutrition (photosynthesis), human digestive system enzymes, aerobic vs anaerobic respiration, double circulation in heart, and nephron excretion.",
    tags: ["Life Processes", "Photosynthesis", "Nephron", "Double Circulation", "Class 10 Biology"],
    views: "6.4M",
    likes: "420K",
    rating: 4.9,
    difficulty: "Exam-Oriented",
    quickExplanation: "Life processes are the essential physiological activities performed by living organisms to sustain life, including autotrophic/heterotrophic nutrition, cellular respiration yielding ATP, double circulatory blood transport, and nephron filtration.",
    keyPoints: [
      "Photosynthesis equation: 6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂.",
      "Aerobic respiration occurs in Mitochondria generating ~38 ATP molecules.",
      "Human heart has 4 chambers; prevents mixing of oxygenated and deoxygenated blood.",
      "Nephron is the structural and functional filtration unit of kidneys (Bowman's capsule + Glomerulus)."
    ],
    formulaOrDefinition: "6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow[\\text{Chlorophyll}]{\\text{Sunlight}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2",
    practiceQuestion: {
      question: "What is the structural and functional filtration unit of the human kidney?",
      options: ["Neuron", "Nephron", "Alveoli", "Villi"],
      correctIndex: 1,
      explanation: "Nephrons filter blood in the kidneys, reabsorbing glucose, amino acids, and water while excreting urea in urine."
    }
  },
  {
    id: "short_sci_photosynthesis",
    type: "short",
    platform: "youtube",
    title: "Photosynthesis Explained in 45 Seconds! 🌿☀️",
    concept: "Photosynthesis Mechanism in 45s",
    subject: "Biology",
    classGrade: "Class 10",
    chapter: "Life Processes",
    duration: "0:45",
    durationSeconds: 45,
    channel: "BioSnap Science",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.youtube.com/shorts/3jK8qZ1k9aB",
    youtubeUrl: "https://www.youtube.com/watch?v=8kK2zwjRV0M",
    shortsUrl: "https://www.youtube.com/shorts/3jK8qZ1k9aB",
    reelsUrl: "https://www.instagram.com/reels/C3n82x9vLa/",
    youtubeId: "3jK8qZ1k9aB",
    thumbnailUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=500&auto=format&fit=crop&q=80",
    description: "Quick breakdown: Plants take in Sunlight + CO₂ + Water via stomata & roots to generate Glucose and Oxygen.",
    tags: ["Photosynthesis", "Shorts", "Biology", "Class 10", "Plants"],
    views: "2.1M",
    likes: "155K",
    rating: 4.9,
    difficulty: "Easy",
    quickExplanation: "Chlorophyll in chloroplasts traps sunlight energy to split water into hydrogen and oxygen (photolysis), then reduces carbon dioxide into glucose.",
    keyPoints: [
      "Takes place in chloroplasts (containing green pigment chlorophyll).",
      "Light reactions produce ATP and NADPH.",
      "Dark reactions (Calvin Cycle) fix CO₂ into glucose.",
      "Byproduct released through stomata: Oxygen (O₂)."
    ],
    formulaOrDefinition: "6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{Light + Chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2",
    practiceQuestion: {
      question: "Which gas is released into the atmosphere as a byproduct during photosynthesis?",
      options: ["Oxygen (O₂)", "Carbon Dioxide (CO₂)", "Nitrogen (N₂)", "Hydrogen (H₂)"],
      correctIndex: 0,
      explanation: "Water photolysis in light reactions releases Oxygen (O₂) as a vital byproduct."
    }
  },
  {
    id: "short_bio_mitochondria",
    type: "short",
    platform: "instagram",
    title: "Why Mitochondria is the Powerhouse of the Cell in 30s! 🔋⚡",
    concept: "Mitochondria ATP Synthesis",
    subject: "Biology",
    classGrade: "Class 9",
    chapter: "The Fundamental Unit of Life",
    duration: "0:30",
    durationSeconds: 30,
    channel: "@cell_biology_explained",
    creatorAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.instagram.com/reels/C3n82x9vLa/",
    youtubeUrl: "https://www.youtube.com/watch?v=8kK2zwjRV0M",
    shortsUrl: "https://www.youtube.com/shorts/3jK8qZ1k9aB",
    reelsUrl: "https://www.instagram.com/reels/C3n82x9vLa/",
    instagramId: "C3n82x9vLa",
    thumbnailUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=500&auto=format&fit=crop&q=80",
    description: "Mitochondria produces ATP (Adenosine Triphosphate) through oxidative phosphorylation on its folded cristae inner membrane.",
    tags: ["Mitochondria", "ATP", "Cell Biology", "Reels", "Science"],
    views: "2.7M",
    likes: "210K",
    rating: 4.9,
    difficulty: "Easy",
    quickExplanation: "Mitochondria has a double membrane where the inner folded membrane (cristae) contains ATP synthase enzymes generating cellular energy currency ATP.",
    keyPoints: [
      "Known as the 'Powerhouse of the Cell'.",
      "Produces energy in the form of ATP (Adenosine Triphosphate).",
      "Has its own circular DNA and 70S ribosomes (semi-autonomous organelle).",
      "Inner membrane folds are called cristae, increasing surface area."
    ],
    formulaOrDefinition: "\\text{ADP} + \\text{P}_i + \\text{Energy} \\xrightarrow{\\text{ATP Synthase}} \\text{ATP}",
    practiceQuestion: {
      question: "Which cellular energy currency is generated by the mitochondria?",
      options: ["ATP (Adenosine Triphosphate)", "DNA", "Glucose", "Hemoglobin"],
      correctIndex: 0,
      explanation: "ATP is the universal chemical energy currency synthesized during cellular respiration in mitochondria."
    }
  },

  // ==========================================
  // --- 5. SOCIAL SCIENCE & HISTORY ---
  // ==========================================
  {
    id: "vid_sst_nationalism_india",
    type: "long",
    platform: "youtube",
    title: "Nationalism in India Full Chapter Animation - Non-Cooperation to Dandi March",
    concept: "Nationalism in India & Satyagraha",
    subject: "Social Science",
    classGrade: "Class 10",
    chapter: "Nationalism in India",
    duration: "35:10",
    durationSeconds: 2110,
    channel: "Magnet Brains / Social Science Hub",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.youtube.com/watch?v=kY9q2xN8rLk",
    youtubeUrl: "https://www.youtube.com/watch?v=kY9q2xN8rLk",
    shortsUrl: "https://www.youtube.com/shorts/5eM8qZ1k4aA",
    reelsUrl: "https://www.instagram.com/reels/C4k89z1aQv/",
    youtubeId: "kY9q2xN8rLk",
    thumbnailUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&auto=format&fit=crop&q=80",
    description: "Detailed timeline of the Indian Independence Movement: Rowlatt Act 1919, Jallianwala Bagh massacre, Khilafat Movement, and the historic Civil Disobedience Salt March 1930.",
    tags: ["Nationalism in India", "Dandi March", "Class 10 History", "CBSE SST", "Satyagraha"],
    views: "3.1M",
    likes: "175K",
    rating: 4.9,
    difficulty: "Exam-Oriented",
    quickExplanation: "Mahatma Gandhi championed Satyagraha (truth-force) through non-violent resistance against British colonial rule, mobilizing millions across Non-Cooperation (1920-22) and Civil Disobedience (1930).",
    keyPoints: [
      "Champaran (1917), Kheda (1918), Ahmedabad (1918) were Gandhi's first Satyagrahas.",
      "Rowlatt Act (1919) authorized detention without trial, leading to Jallianwala Bagh on 13 April 1919.",
      "Non-Cooperation Movement launched in 1920, called off after Chauri Chaura incident (1922).",
      "Salt March from Sabarmati to Dandi (12 March – 6 April 1930) broke the colonial salt monopoly."
    ],
    formulaOrDefinition: "\\text{Satyagraha} = \\text{Satya (Truth)} + \\text{Agraha (Insistence / Soul-Force)}",
    practiceQuestion: {
      question: "On which date did Mahatma Gandhi reach Dandi and violate the salt law by manufacturing salt?",
      options: ["6 April 1930", "12 March 1930", "15 August 1947", "26 January 1930"],
      correctIndex: 0,
      explanation: "Gandhi started the 240-mile march on 12 March 1930 and reached Dandi on 6 April 1930, ceremonially breaking the salt law."
    }
  },

  // ==========================================
  // --- 6. ENGLISH GRAMMAR & WRITING ---
  // ==========================================
  {
    id: "vid_eng_active_passive_voice",
    type: "long",
    platform: "youtube",
    title: "Active and Passive Voice Rules, Tricks & Board Exam Practice",
    concept: "Active vs Passive Voice Transformation",
    subject: "English",
    classGrade: "Class 10",
    chapter: "Grammar: Voice & Modals",
    duration: "24:45",
    durationSeconds: 1485,
    channel: "Dear Sir English Academy",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.youtube.com/watch?v=nRGLDD0BBdc",
    youtubeUrl: "https://www.youtube.com/watch?v=nRGLDD0BBdc",
    shortsUrl: "https://www.youtube.com/shorts/8dJ7z1k3xPq",
    reelsUrl: "https://www.instagram.com/reels/C5m91x8zKm/",
    youtubeId: "nRGLDD0BBdc",
    thumbnailUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop&q=80",
    description: "Learn foolproof rules to convert any sentence from Active to Passive Voice across all 12 tenses with past participle (V3) rules.",
    tags: ["English Grammar", "Active Passive", "Tenses", "Class 10 English", "Writing Skills"],
    views: "8.9M",
    likes: "610K",
    rating: 4.9,
    difficulty: "Easy",
    quickExplanation: "In active voice, the subject performs the action (Subject + Verb + Object). In passive voice, the object becomes the subject and receives the action (Object + helping verb + V3 + by + Subject).",
    keyPoints: [
      "Subject becomes Object and Object becomes Subject.",
      "Always use the third form of the verb (Past Participle - V3) in passive voice.",
      "Insert appropriate form of 'to be' (is/am/are/was/were/been/being).",
      "Perfect continuous tenses and Future continuous tense do not form standard passive."
    ],
    formulaOrDefinition: "\\text{Active: } S + V + O \\quad \\longrightarrow \\quad \\text{Passive: } O + \\text{Be-form} + V_3 + \\text{by} + S",
    practiceQuestion: {
      question: "What is the passive voice of 'The teacher is explaining the lesson'?",
      options: [
        "The lesson is being explained by the teacher.",
        "The lesson was explained by the teacher.",
        "The lesson has been explained by the teacher.",
        "The lesson is explained by the teacher."
      ],
      correctIndex: 0,
      explanation: "Present continuous tense 'is explaining' converts to 'is being + V3' (is being explained)."
    }
  },

  // ==========================================
  // --- 7. COMPUTER SCIENCE & PYTHON ---
  // ==========================================
  {
    id: "vid_cs_python_functions",
    type: "long",
    platform: "youtube",
    title: "Python Functions: Parameters, Return Values & Recursion in One Shot",
    concept: "Python Functions & Scope",
    subject: "Computer Science",
    classGrade: "Class 12",
    chapter: "Functions in Python",
    duration: "31:20",
    durationSeconds: 1880,
    channel: "CodeWithHarry / CS Class 12",
    creatorAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.youtube.com/watch?v=7wnove7K-ZQ",
    youtubeUrl: "https://www.youtube.com/watch?v=7wnove7K-ZQ",
    shortsUrl: "https://www.youtube.com/shorts/5eM8qZ1k4aA",
    reelsUrl: "https://www.instagram.com/reels/C4k89z1aQv/",
    youtubeId: "7wnove7K-ZQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80",
    description: "Complete guide on Python functions for CBSE Class 12: positional vs keyword arguments, default arguments, LEGB variable scope, and recursion base conditions.",
    tags: ["Python", "Functions", "Computer Science", "Class 12 CS", "Coding"],
    views: "2.4M",
    likes: "150K",
    rating: 4.9,
    difficulty: "Exam-Oriented",
    quickExplanation: "Functions in Python are defined using 'def' keyword to encapsulate reusable logic. Variables have scope following the LEGB rule (Local, Enclosing, Global, Built-in).",
    keyPoints: [
      "Syntax: def function_name(arguments): return result",
      "Positional arguments must be passed in correct positional order.",
      "Default arguments must follow non-default positional arguments.",
      "LEGB rule dictates variable resolution order: Local → Enclosing → Global → Built-in."
    ],
    formulaOrDefinition: "\\text{def factorial}(n): \\quad \\text{return } 1 \\text{ if } n \\le 1 \\text{ else } n \\times \\text{factorial}(n-1)",
    practiceQuestion: {
      question: "Which keyword is used in Python to modify a global variable inside a local function scope?",
      options: ["global", "nonlocal", "def", "export"],
      correctIndex: 0,
      explanation: "The 'global' keyword explicitly allows a function to reassign or modify a variable defined at the module/global level."
    }
  },
  {
    id: "short_eng_active_passive_30s",
    type: "short",
    platform: "youtube",
    title: "Active to Passive Voice 3-Step Trick in 30 Seconds! ✍️⚡",
    concept: "Active vs Passive Voice Trick",
    subject: "English",
    classGrade: "Class 10",
    chapter: "Grammar: Voice & Modals",
    duration: "0:30",
    durationSeconds: 30,
    channel: "Dear Sir English Shorts",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.youtube.com/shorts/8dJ7z1k3xPq",
    youtubeUrl: "https://www.youtube.com/watch?v=nRGLDD0BBdc",
    shortsUrl: "https://www.youtube.com/shorts/8dJ7z1k3xPq",
    reelsUrl: "https://www.instagram.com/reels/C5m91x8zKm/",
    youtubeId: "nRGLDD0BBdc",
    thumbnailUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop&q=80",
    description: "Convert any sentence into passive voice in 3 steps: 1. Swap Object & Subject, 2. Add 'be' verb form, 3. Always use V3 past participle!",
    tags: ["English Grammar", "Active Passive", "Shorts", "Board Exams", "English"],
    views: "3.4M",
    likes: "260K",
    rating: 4.9,
    difficulty: "Easy",
    quickExplanation: "Passive voice puts the receiver of the action in the subject position using the past participle (V3) along with the auxiliary verb 'be'.",
    keyPoints: [
      "Rule 1: Move Object to Subject position.",
      "Rule 2: Insert form of 'be' (is/are/was/were/being/been).",
      "Rule 3: Main verb MUST be in past participle (V3).",
      "Example: 'He wrote a letter' → 'A letter was written by him'."
    ],
    formulaOrDefinition: "\\text{Active: } S + V + O \\quad \\implies \\quad \\text{Passive: } O + \\text{Be} + V_3 + \\text{by } S",
    practiceQuestion: {
      question: "Convert 'She sings a melodious song' into Passive Voice:",
      options: [
        "A melodious song is sung by her.",
        "A melodious song was sung by her.",
        "A melodious song has sung by her.",
        "A melodious song is singing by her."
      ],
      correctIndex: 0,
      explanation: "Present simple 'sings' becomes 'is sung' with past participle V3 of sing (sung)."
    }
  },
  {
    id: "short_sst_dandi_march_40s",
    type: "short",
    platform: "instagram",
    title: "Dandi Salt March (1930) Key Dates in 40 Seconds! 🏛️🇮🇳",
    concept: "Dandi Salt March & Civil Disobedience",
    subject: "Social Science",
    classGrade: "Class 10",
    chapter: "Nationalism in India",
    duration: "0:40",
    durationSeconds: 40,
    channel: "@history_reels_india",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.instagram.com/reels/C4k89z1aQv/",
    youtubeUrl: "https://www.youtube.com/watch?v=kY9q2xN8rLk",
    shortsUrl: "https://www.youtube.com/shorts/5eM8qZ1k4aA",
    reelsUrl: "https://www.instagram.com/reels/C4k89z1aQv/",
    instagramId: "C4k89z1aQv",
    thumbnailUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&auto=format&fit=crop&q=80",
    description: "Key dates: 12 March 1930 (Started from Sabarmati with 78 volunteers, 240 miles) → 6 April 1930 (Reached Dandi, manufactured salt to launch Civil Disobedience).",
    tags: ["Dandi March", "History", "Reels", "Class 10 SST", "Mahatma Gandhi"],
    views: "1.9M",
    likes: "140K",
    rating: 4.9,
    difficulty: "Easy",
    quickExplanation: "The Salt March was a 24-day nonviolent direct action campaign led by Mahatma Gandhi against the British salt monopoly, sparking the nationwide Civil Disobedience Movement.",
    keyPoints: [
      "Started: 12 March 1930 from Sabarmati Ashram.",
      "Completed: 6 April 1930 at coastal village of Dandi.",
      "Total Distance: 240 miles (covered in 24 days).",
      "78 trusted volunteers accompanied Gandhi initially."
    ],
    formulaOrDefinition: "\\text{12 March 1930 (Sabarmati)} \\xrightarrow{\\text{240 miles / 24 days}} \\text{6 April 1930 (Dandi Salt Law Broken)}",
    practiceQuestion: {
      question: "How many trusted volunteers accompanied Mahatma Gandhi when the Salt March commenced on 12 March 1930?",
      options: ["78 volunteers", "50 volunteers", "100 volunteers", "240 volunteers"],
      correctIndex: 0,
      explanation: "Gandhi set out with 78 trusted volunteers from his Sabarmati Ashram to walk 240 miles to Dandi."
    }
  },
  {
    id: "short_cs_python_list_comp",
    type: "short",
    platform: "youtube",
    title: "Python List Comprehensions in 30 Seconds! 🐍💻",
    concept: "Python List Comprehensions & Loops",
    subject: "Computer Science",
    classGrade: "Class 12",
    chapter: "Functions in Python",
    duration: "0:30",
    durationSeconds: 30,
    channel: "Python Byte Shorts",
    creatorAvatar: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.youtube.com/shorts/5eM8qZ1k4aA",
    youtubeUrl: "https://www.youtube.com/watch?v=7wnove7K-ZQ",
    shortsUrl: "https://www.youtube.com/shorts/5eM8qZ1k4aA",
    reelsUrl: "https://www.instagram.com/reels/C4k89z1aQv/",
    youtubeId: "7wnove7K-ZQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80",
    description: "Replace 4 lines of for-loop with a single elegant list comprehension: [x**2 for x in range(10) if x % 2 == 0].",
    tags: ["Python", "List Comprehension", "Shorts", "Class 12 CS", "Coding"],
    views: "1.5M",
    likes: "110K",
    rating: 4.8,
    difficulty: "Easy",
    quickExplanation: "List comprehension provides a concise syntax to create lists based on existing lists or iterables using [expression for item in iterable if condition].",
    keyPoints: [
      "Syntax: [expression for item in iterable if condition]",
      "Faster and more readable than standard for-loops with .append().",
      "Can filter elements using trailing 'if' condition.",
      "Creates a new list object without mutating original input."
    ],
    formulaOrDefinition: "\\text{squares} = [x^2 \\text{ for } x \\text{ in range}(1, 6) \\text{ if } x \\% 2 == 0]",
    practiceQuestion: {
      question: "What is the output of [x * 2 for x in [1, 2, 3] if x > 1] in Python?",
      options: ["[4, 6]", "[2, 4, 6]", "[4]", "[2, 4]"],
      correctIndex: 0,
      explanation: "For x = 2: 2 * 2 = 4; for x = 3: 3 * 2 = 6. Since x = 1 is filtered out by x > 1, the result is [4, 6]."
    }
  },
  {
    id: "short_math_trig_hand_trick",
    type: "short",
    platform: "instagram",
    title: "Trigonometry Left Hand Trick (0°, 30°, 45°, 60°, 90°) in 40s! ✋📐",
    concept: "Trigonometric Left Hand Table Trick",
    subject: "Mathematics",
    classGrade: "Class 10",
    chapter: "Introduction to Trigonometry",
    duration: "0:40",
    durationSeconds: 40,
    channel: "@math_tricks_daily",
    creatorAvatar: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=100&auto=format&fit=crop&q=80",
    externalUrl: "https://www.instagram.com/reels/C5m91x8zKm/",
    youtubeUrl: "https://www.youtube.com/watch?v=PUB0TaZ7bhA",
    shortsUrl: "https://www.youtube.com/shorts/8dJ7z1k3xPq",
    reelsUrl: "https://www.instagram.com/reels/C5m91x8zKm/",
    instagramId: "C5m91x8zKm",
    thumbnailUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=80",
    description: "Look at your 5 fingers (Thumb 0°, Index 30°, Middle 45°, Ring 60°, Little 90°). sin θ = √(fingers below)/2, cos θ = √(fingers above)/2!",
    tags: ["Trigonometry", "Hand Trick", "Reels", "Class 10 Math", "Shortcuts"],
    views: "4.8M",
    likes: "390K",
    rating: 4.9,
    difficulty: "Easy",
    quickExplanation: "The Left Hand Trick allows instant calculation of sin, cos, and tan for standard angles without memorizing tables: sin θ = √(fingers below)/2 and cos θ = √(fingers above)/2.",
    keyPoints: [
      "Thumb = 0°, Index = 30°, Middle = 45°, Ring = 60°, Little finger = 90°.",
      "sin θ = √(fingers below folded finger) / 2.",
      "cos θ = √(fingers above folded finger) / 2.",
      "tan θ = √(fingers below) / √(fingers above)."
    ],
    formulaOrDefinition: "\\sin\\theta = \\frac{\\sqrt{\\text{Fingers Below}}}{2}, \\quad \\cos\\theta = \\frac{\\sqrt{\\text{Fingers Above}}}{2}",
    practiceQuestion: {
      question: "Using the hand trick, for 30° (Index finger), there is 1 finger below. What is sin 30°?",
      options: ["1/2", "√3/2", "1/√2", "0"],
      correctIndex: 0,
      explanation: "sin 30° = √(1)/2 = 1/2."
    }
  }
];

// ==========================================
// --- HELPER SEARCH & URL UTILITIES ---
// ==========================================

export function normalizeSearchKeywords(query: string): {
  normalized: string;
  isShortsIntent: boolean;
  detectedSubject?: string;
  detectedGrade?: string;
} {
  const q = query.toLowerCase().trim();
  const isShortsIntent =
    q.includes("short") ||
    q.includes("shorts") ||
    q.includes("reel") ||
    q.includes("reels") ||
    q.includes("quick") ||
    q.includes("trick") ||
    q.includes("formula in 60s") ||
    q.includes("30 seconds");

  let detectedSubject: string | undefined;
  if (q.includes("math") || q.includes("trig") || q.includes("calculus") || q.includes("quadratic") || q.includes("algebra") || q.includes("pythagoras")) {
    detectedSubject = "Mathematics";
  } else if (q.includes("physic") || q.includes("light") || q.includes("current") || q.includes("electric") || q.includes("newton") || q.includes("optics") || q.includes("fleming")) {
    detectedSubject = "Physics";
  } else if (q.includes("chem") || q.includes("sn1") || q.includes("reaction") || q.includes("periodic") || q.includes("organic") || q.includes("redox")) {
    detectedSubject = "Chemistry";
  } else if (q.includes("bio") || q.includes("photosynthesis") || q.includes("cell") || q.includes("heart") || q.includes("kidney") || q.includes("genetics") || q.includes("mitochondria")) {
    detectedSubject = "Biology";
  } else if (q.includes("history") || q.includes("sst") || q.includes("nationalism") || q.includes("gandhi")) {
    detectedSubject = "Social Science";
  } else if (q.includes("grammar") || q.includes("english") || q.includes("voice") || q.includes("tense")) {
    detectedSubject = "English";
  } else if (q.includes("python") || q.includes("code") || q.includes("computer")) {
    detectedSubject = "Computer Science";
  }

  let detectedGrade: string | undefined;
  if (q.includes("class 10") || q.includes("10th")) detectedGrade = "Class 10";
  else if (q.includes("class 12") || q.includes("12th") || q.includes("jee") || q.includes("neet")) detectedGrade = "Class 12";
  else if (q.includes("class 11") || q.includes("11th")) detectedGrade = "Class 11";
  else if (q.includes("class 9") || q.includes("9th")) detectedGrade = "Class 9";

  return {
    normalized: q,
    isShortsIntent,
    detectedSubject,
    detectedGrade
  };
}

export function getConceptYouTubeUrl(video: ScholarVideoItem): string {
  if (video.youtubeUrl) return video.youtubeUrl;
  if (video.platform === "youtube" && video.externalUrl) return video.externalUrl;
  const clean = `${video.concept} ${video.classGrade} ${video.subject} full concept lecture cbse`.trim();
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(clean)}`;
}

export function getConceptShortsUrl(video: ScholarVideoItem): string {
  if (video.shortsUrl) return video.shortsUrl;
  if (video.platform === "youtube" && video.type === "short" && video.externalUrl) return video.externalUrl;
  const clean = `${video.concept} ${video.subject} quick trick concept shorts`.trim();
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(clean)}`;
}

export function getConceptReelsUrl(video: ScholarVideoItem): string {
  if (video.reelsUrl) return video.reelsUrl;
  if (video.platform === "instagram" && video.externalUrl) return video.externalUrl;
  const clean = `${video.concept} ${video.subject}`.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `https://www.instagram.com/explore/tags/${encodeURIComponent(clean)}/`;
}

export function getYouTubeLongSearchUrl(concept: string, grade?: string, subject?: string): string {
  const clean = `${concept} ${grade || ""} ${subject || ""} full concept lecture one shot cbse`.trim();
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(clean)}`;
}

export function getYouTubeShortsSearchUrl(concept: string, grade?: string, subject?: string): string {
  const clean = `${concept} ${grade || ""} ${subject || ""} shorts quick trick concept`.trim();
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(clean)}`;
}

export function getInstagramReelsSearchUrl(concept: string, grade?: string, subject?: string): string {
  const clean = `${concept} ${subject || ""} concept reels`.trim().replace(/\s+/g, "");
  return `https://www.instagram.com/explore/tags/${encodeURIComponent(clean)}/`;
}
