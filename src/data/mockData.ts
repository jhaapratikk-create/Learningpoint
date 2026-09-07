import {
  Subject,
  Chapter,
  Note,
  Flashcard,
  Quiz,
  Goal,
  Exam,
  Achievement,
  NotificationItem,
  User,
  StudyPlan,
  MistakeItem,
  SyllabusSubject,
  StudyAlarm,
  SmartNoteItem,
} from "../types";
import { CLASS_9_CURRICULUM } from "./profileCurriculum";

export const initialUser: User = {
  id: "user_guest_001",
  name: "Student Scholar",
  email: "student@learningpoint.edu",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  grade: "Class 9 (Secondary Foundation - Rationalized NCERT)",
  board: "CBSE",
  aim: "Master Class 9 Science & Mathematics (Rationalized NCERT) & Score 98%+",
  stream: "Science, Mathematics & Social Science",
  targetExam: "CBSE Class 9 Annual Examinations 2026",
  targetYear: "2026",
  dreamCollege: "Top STEM Senior Secondary School / IIT-JEE Foundation",
  targetScore: "98.5% Aggregate",
  school: "Kendriya Vidyalaya / Senior Secondary School",
  city: "New Delhi",
  bio: "Dedicated Class 9 CBSE student aiming for 98%+ in annual examinations with rationalized NCERT curriculum across Science, Mathematics, and Social Science.",
  preferredLanguage: "English",
  accentColor: "indigo",
  subjects: ["Science", "Mathematics", "Social Science", "English", "Hindi", "Information Technology"],
  weakTopics: ["Force & Laws of Motion Numericals", "Surface Areas & Volumes", "Work & Energy Equations"],
  strongTopics: ["Matter in Our Surroundings", "Number Systems", "Motion & Velocity", "Polynomials"],
  targetDailyMinutes: 120,
  streak: 7,
  xp: 3450,
  level: 5,
  role: "student",
  joinedAt: "2026-01-15",
  lastLoginAt: "2026-09-04",
  studyGoals: [
    "Master Class 9 Rationalized NCERT Science Chapters (Physics, Chem, Bio)",
    "Solve all NCERT exemplar numerical problems in Mathematics",
    "Score 98%+ in Class 9 Annual Examinations",
    "Revise all weekly formula flashcards and mistake notebook",
  ],
  examDates: {
    Science: "2026-09-18",
    Mathematics: "2026-09-24",
    "Social Science": "2026-09-30",
  },
};

export const initialSubjects: Subject[] = CLASS_9_CURRICULUM.subjects;
export const initialChapters: Chapter[] = CLASS_9_CURRICULUM.chapters;

export const initialNotes: Note[] = [
  {
    id: "note_1",
    title: "Motion & Three Equations of Motion Master Guide",
    subjectId: "sub_c9_sci",
    chapterId: "ch_c9_sci_1",
    content: `# Motion — Class 9 Rationalized NCERT Physics

## 1. Distance vs Displacement
- **Distance**: Total path length traversed by an object. It is a scalar quantity.
- **Displacement**: Shortest straight-line vector between initial and final position. It is a vector quantity.
- $\\text{Displacement} \\le \\text{Distance}$.

## 2. Uniform vs Non-Uniform Motion
- **Uniform Motion**: Object travels equal distances in equal intervals of time.
- **Non-Uniform Motion**: Object travels unequal distances in equal intervals of time.

## 3. The 3 Equations of Uniformly Accelerated Motion
1. $v = u + at$
2. $s = ut + \\frac{1}{2}at^2$
3. $v^2 - u^2 = 2as$

Where:
- $u$ = Initial velocity ($m/s$)
- $v$ = Final velocity ($m/s$)
- $a$ = Uniform acceleration ($m/s^2$)
- $t$ = Time ($s$)
- $s$ = Distance travelled ($m$)

## 4. Key Velocity-Time ($v-t$) Graph Principles
- The **slope** of a $v-t$ graph gives the **acceleration**.
- The **area enclosed under** a $v-t$ graph gives the **distance travelled / displacement**.`,
    tags: ["Physics", "Class 9", "Equations of Motion", "NCERT High Yield"],
    createdAt: "2026-08-20",
    updatedAt: "2026-09-02",
    isFavorite: true,
  },
  {
    id: "note_2",
    title: "Polynomials & Algebraic Identities Formula Sheet",
    subjectId: "sub_c9_math",
    chapterId: "ch_c9_math_2",
    content: `# Polynomials — Class 9 Rationalized NCERT Mathematics

## 1. Important Algebraic Identities
1. $(x + y)^2 = x^2 + 2xy + y^2$
2. $(x - y)^2 = x^2 - 2xy + y^2$
3. $x^2 - y^2 = (x + y)(x - y)$
4. $(x + a)(x + b) = x^2 + (a + b)x + ab$
5. $(x + y + z)^2 = x^2 + y^2 + z^2 + 2xy + 2yz + 2zx$
6. $(x + y)^3 = x^3 + y^3 + 3xy(x + y)$
7. $(x - y)^3 = x^3 - y^3 - 3xy(x - y)$
8. $x^3 + y^3 + z^3 - 3xyz = (x + y + z)(x^2 + y^2 + z^2 - xy - yz - zx)$

*Special Identity*: If $x + y + z = 0$, then:
$$x^3 + y^3 + z^3 = 3xyz$$

## 2. Remainder and Factor Theorems
- If $p(a) = 0$, then $(x - a)$ is a factor of $p(x)$.
- A polynomial of degree $n$ has at most $n$ real zeros.`,
    tags: ["Mathematics", "Class 9", "Identities", "Algebra"],
    createdAt: "2026-08-22",
    updatedAt: "2026-09-03",
    isFavorite: true,
  },
  {
    id: "note_3",
    title: "Fundamental Unit of Life: Cell Structure & Organelles",
    subjectId: "sub_c9_sci",
    chapterId: "ch_c9_sci_5",
    content: `# The Fundamental Unit of Life — Class 9 Biology

## 1. Cell Discovery
- Robert Hooke (1665) observed cork cells under simple microscope.
- Antonie van Leeuwenhoek (1674) discovered free-living cells in pond water.
- Robert Brown (1831) discovered the cell nucleus.

## 2. Key Organelles & Functions
- **Mitochondria**: Known as the *"Powerhouse of the cell"*. Synthesizes ATP via respiration. Has its own DNA & ribosomes.
- **Endoplasmic Reticulum (ER)**:
  - *Rough ER (RER)*: Contains ribosomes; site of protein synthesis.
  - *Smooth ER (SER)*: Synthesizes lipids, essential for membrane biogenesis.
- **Golgi Apparatus**: Dispatches and packages materials synthesized near the ER.
- **Lysosomes**: *"Suicide bags"*, contain powerful digestive hydrolytic enzymes.
- **Plastids**: Double-membrane plant organelles (Chloroplasts for photosynthesis, Leucoplasts for storage).`,
    tags: ["Biology", "Class 9", "Cell Structure", "NCERT"],
    createdAt: "2026-08-25",
    updatedAt: "2026-09-01",
    isFavorite: false,
  },
];

export const initialFlashcards: Flashcard[] = CLASS_9_CURRICULUM.flashcards;
export const initialQuizzes: Quiz[] = CLASS_9_CURRICULUM.quizzes;
export const initialMistakes: MistakeItem[] = CLASS_9_CURRICULUM.mistakes;

export const initialGoals: Goal[] = [
  {
    id: "goal_1",
    title: "Daily Focus: Study 2 Hours per day",
    targetMetric: 14,
    currentMetric: 11.5,
    unit: "Hours this week",
    deadline: "2026-09-06",
    isCompleted: false,
    category: "Study Time",
  },
  {
    id: "goal_2",
    title: "Complete Class 9 NCERT Science & Mathematics Chapters",
    targetMetric: 12,
    currentMetric: 9,
    unit: "Chapters",
    deadline: "2026-09-20",
    isCompleted: false,
    category: "Chapters",
  },
  {
    id: "goal_3",
    title: "Maintain 90%+ Quiz Score Average",
    targetMetric: 90,
    currentMetric: 92,
    unit: "% Score",
    deadline: "2026-09-30",
    isCompleted: true,
    category: "Score",
  },
];

export const initialExams: Exam[] = CLASS_9_CURRICULUM.exams;
export const initialStudyPlan: StudyPlan = CLASS_9_CURRICULUM.studyPlan;

export const initialAchievements: Achievement[] = [
  {
    id: "ach_1",
    title: "First Quiz Champion",
    description: "Completed your first subject quiz with high accuracy.",
    icon: "Trophy",
    unlockedAt: "2026-08-16",
    progress: 1,
    maxProgress: 1,
    isUnlocked: true,
    category: "Quizzes",
  },
  {
    id: "ach_2",
    title: "7-Day Study Streak 🔥",
    description: "Maintained a continuous daily study habit for 7 straight days.",
    icon: "Flame",
    unlockedAt: "2026-08-31",
    progress: 7,
    maxProgress: 7,
    isUnlocked: true,
    category: "Streak",
  },
  {
    id: "ach_3",
    title: "Master Scholar: 10 Chapters",
    description: "Thoroughly completed and revised 10 academic chapters.",
    icon: "BookOpenCheck",
    unlockedAt: undefined,
    progress: 8,
    maxProgress: 10,
    isUnlocked: false,
    category: "Mastery",
  },
  {
    id: "ach_4",
    title: "Centurion: 100 Questions Solved",
    description: "Practiced and answered 100 total study questions.",
    icon: "BrainCircuit",
    unlockedAt: undefined,
    progress: 84,
    maxProgress: 100,
    isUnlocked: false,
    category: "Quizzes",
  },
  {
    id: "ach_5",
    title: "Deep Focus: 10 Hours Studied",
    description: "Logged over 10 hours in productive focus study sessions.",
    icon: "Timer",
    unlockedAt: "2026-08-25",
    progress: 10,
    maxProgress: 10,
    isUnlocked: true,
    category: "Study Time",
  },
  {
    id: "ach_6",
    title: "Top 90% Quiz Score",
    description: "Achieved a score of 90% or higher on an advanced mock quiz.",
    icon: "Star",
    unlockedAt: "2026-08-29",
    progress: 92,
    maxProgress: 90,
    isUnlocked: true,
    category: "Quizzes",
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: "notif_1",
    title: "Exam Alert: Mathematics Prelim",
    message: "Mathematics Board Prelim Exam is in 15 days (Sept 15, 2026). Start your revision schedule now.",
    type: "exam",
    timestamp: "10 minutes ago",
    isRead: false,
    actionView: "exams",
  },
  {
    id: "notif_2",
    title: "🔥 7-Day Streak Achieved!",
    message: "Congratulations! You've studied consistently for 7 days. Keep up the momentum!",
    type: "streak",
    timestamp: "2 hours ago",
    isRead: false,
    actionView: "achievements",
  },
  {
    id: "notif_3",
    title: "Smart Revision Recommended",
    message: "AI recommends revising 'Integration by Parts' based on your recent practice questions.",
    type: "revision",
    timestamp: "Yesterday",
    isRead: true,
    actionView: "practice",
  },
  {
    id: "notif_4",
    title: "Daily Study Target Check",
    message: "You've logged 75 out of 120 minutes today. Just 45 minutes remaining to hit your daily goal!",
    type: "goal",
    timestamp: "Yesterday",
    isRead: true,
    actionView: "goals",
  },
];

export const sampleAdminUsers = [
  {
    id: "user_std_001",
    name: "Rahul Sharma",
    email: "rahul.sharma@school.edu",
    grade: "Class 9",
    school: "Kendriya Vidyalaya / Secondary Foundation",
    streak: 7,
    studyHours: 42.5,
    quizCount: 19,
    lastActive: "Today at 09:12 AM",
    status: "Active",
    accuracy: "88%",
  },
  {
    id: "user_std_002",
    name: "Samantha Chen",
    email: "sam.chen@techhigh.org",
    grade: "Grade 11",
    school: "Westfield Prep",
    streak: 14,
    studyHours: 68.2,
    quizCount: 34,
    lastActive: "Yesterday at 08:30 PM",
    status: "Active",
    accuracy: "94%",
  },
  {
    id: "user_std_003",
    name: "Marcus Johnson",
    email: "marcus.j@oakridge.edu",
    grade: "Undergraduate (Year 1)",
    school: "State University",
    streak: 3,
    studyHours: 21.0,
    quizCount: 11,
    lastActive: "3 days ago",
    status: "Active",
    accuracy: "79%",
  },
  {
    id: "user_std_004",
    name: "Elena Rostova",
    email: "elena.r@academies.org",
    grade: "Grade 12",
    school: "Northstar Academy",
    streak: 0,
    studyHours: 14.5,
    quizCount: 6,
    lastActive: "1 week ago",
    status: "Inactive",
    accuracy: "72%",
  },
  {
    id: "user_std_005",
    name: "David Kim",
    email: "david.kim@sciencehub.edu",
    grade: "Grade 10",
    school: "Horizon International",
    streak: 19,
    studyHours: 85.0,
    quizCount: 48,
    lastActive: "Today at 07:45 AM",
    status: "Active",
    accuracy: "96%",
  },
];

export const initialSyllabusData: SyllabusSubject[] = [
  {
    id: "syl_c9_sci",
    name: "Science (Class 9 - New NCERT)",
    classGrade: "Class 9",
    board: "CBSE",
    isNewNcert: true,
    code: "SCI-09-NCERT",
    icon: "Atom",
    color: "from-emerald-500 to-teal-600",
    totalMarks: 100,
    examPatternSummary: "Theory: 80 marks (39 questions), Internal Assessment: 20 marks. Matter & Its Nature (25m), Organization in the Living World (22m), Motion, Force & Work (27m), Food Production (6m).",
    description: "Official Rationalized New NCERT Curriculum (2025-2026): Matter in Surroundings, Atoms & Molecules, Cells, Tissues, Motion, Laws of Motion, Gravitation, Work & Energy, Sound, and Food Resources.",
    chapters: [
      {
        id: "c9_s_ch1",
        title: "Matter in Our Surroundings",
        order: 1,
        weightageMarks: 6,
        weightagePercent: 8,
        difficulty: "Easy",
        summary: "Physical nature of matter, characteristics of particles, states of matter (solid, liquid, gas), change of state, latent heat of fusion & vaporization, evaporation and factors affecting it.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t9_1_1", title: "Characteristics of Particles of Matter & Diffusion", isCompleted: true, isImportant: true },
          { id: "t9_1_2", title: "States of Matter & Interconversion (Kelvin/Celsius)", isCompleted: true, isImportant: true },
          { id: "t9_1_3", title: "Latent Heat & Evaporation Cooling Mechanism", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c9_s_ch2",
        title: "Is Matter Around Us Pure?",
        order: 2,
        weightageMarks: 6,
        weightagePercent: 8,
        difficulty: "Medium",
        summary: "Mixtures, types of mixtures, solutions (concentration of solutions, mass percentage), suspensions, colloids, Tyndall effect, physical and chemical changes, elements, and compounds.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t9_2_1", title: "True Solutions, Colloids & Suspensions Comparison", isCompleted: true, isImportant: true },
          { id: "t9_2_2", title: "Concentration Calculations (Mass by Mass / Volume)", isCompleted: true, isImportant: true },
          { id: "t9_2_3", title: "Physical vs Chemical Changes & Compounds", isCompleted: false, isImportant: false },
        ],
      },
      {
        id: "c9_s_ch3",
        title: "Atoms and Molecules",
        order: 3,
        weightageMarks: 7,
        weightagePercent: 9,
        difficulty: "Hard",
        summary: "Law of conservation of mass, law of constant proportions, Dalton's atomic theory, atomic mass, molecules, ions, writing chemical formulas of simple compounds, molecular mass calculation.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t9_3_1", title: "Laws of Chemical Combination & Dalton's Postulates", isCompleted: true, isImportant: true },
          { id: "t9_3_2", title: "Writing Chemical Formulae (Criss-Cross Valency)", isCompleted: true, isImportant: true },
          { id: "t9_3_3", title: "Molecular Mass & Formula Unit Mass Numericals", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c9_s_ch4",
        title: "Structure of the Atom",
        order: 4,
        weightageMarks: 6,
        weightagePercent: 8,
        difficulty: "Medium",
        summary: "Discovery of sub-atomic particles, Thomson's model, Rutherford's alpha particle scattering experiment & nuclear model, Bohr's model of atom, distribution of electrons in orbits, valency, atomic number & mass number, isotopes & isobars.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t9_4_1", title: "Rutherford's Alpha Scattering Experiment & Drawbacks", isCompleted: true, isImportant: true },
          { id: "t9_4_2", title: "Bohr's Postulates & Electronic Configuration (2n^2 Rule)", isCompleted: true, isImportant: true },
          { id: "t9_4_3", title: "Valency, Isotopes Applications & Isobars", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c9_s_ch5",
        title: "The Fundamental Unit of Life (Cell)",
        order: 5,
        weightageMarks: 8,
        weightagePercent: 10,
        difficulty: "Medium",
        summary: "Cell as basic structural and functional unit of life, plasma membrane, diffusion and osmosis (hypotonic, hypertonic, isotonic), cell wall, nucleus, cytoplasm, organelles: endoplasmic reticulum, Golgi apparatus, lysosomes, mitochondria, plastids, vacuoles.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t9_5_1", title: "Plasma Membrane & Osmosis in Plant/Animal Cells", isCompleted: true, isImportant: true },
          { id: "t9_5_2", title: "Mitochondria, Plastids & Chloroplast Structure", isCompleted: true, isImportant: true },
          { id: "t9_5_3", title: "Prokaryotic vs Eukaryotic Cells & Lysosomes", isCompleted: false, isImportant: false },
        ],
      },
      {
        id: "c9_s_ch6",
        title: "Tissues (Plant & Animal)",
        order: 6,
        weightageMarks: 7,
        weightagePercent: 9,
        difficulty: "Hard",
        summary: "Plant tissues: meristematic (apical, intercalary, lateral) and permanent tissues (simple: parenchyma, collenchyma, sclerenchyma; complex: xylem, phloem). Animal tissues: epithelial, connective (blood, bone, cartilage, ligament, tendon, areolar, adipose), muscular, nervous tissue.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t9_6_1", title: "Meristematic vs Permanent Plant Tissues", isCompleted: true, isImportant: true },
          { id: "t9_6_2", title: "Complex Tissues: Xylem and Phloem Components", isCompleted: false, isImportant: true },
          { id: "t9_6_3", title: "Animal Connective & Muscular Tissues (Striated/Smooth/Cardiac)", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c9_s_ch7",
        title: "Motion & Equations of Motion",
        order: 7,
        weightageMarks: 8,
        weightagePercent: 10,
        difficulty: "Hard",
        summary: "Distance and displacement, speed and velocity, uniform and non-uniform motion along a straight line, acceleration, distance-time and velocity-time graphs, derivation of equations of motion (v = u + at, s = ut + 1/2 at^2, 2as = v^2 - u^2), uniform circular motion.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t9_7_1", title: "Distance vs Displacement & Velocity-Time Graphs", isCompleted: true, isImportant: true },
          { id: "t9_7_2", title: "Graphical Derivation of 3 Equations of Motion", isCompleted: true, isImportant: true },
          { id: "t9_7_3", title: "Uniform Circular Motion & Acceleration Numericals", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c9_s_ch8",
        title: "Force and Laws of Motion",
        order: 8,
        weightageMarks: 8,
        weightagePercent: 10,
        difficulty: "Hard",
        summary: "Balanced and unbalanced forces, Newton's first law of motion, inertia and mass, Newton's second law of motion, mathematical formulation of force (F = ma), Newton's third law of motion (action-reaction pairs), conservation of momentum.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t9_8_1", title: "Inertia Types & Newton's First Law", isCompleted: true, isImportant: true },
          { id: "t9_8_2", title: "Newton's Second Law (F = ma Derivation & Numericals)", isCompleted: true, isImportant: true },
          { id: "t9_8_3", title: "Third Law & Recoil of Gun / Rocket Propulsion", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c9_s_ch9",
        title: "Gravitation & Floatation",
        order: 9,
        weightageMarks: 7,
        weightagePercent: 9,
        difficulty: "Medium",
        summary: "Universal law of gravitation, importance of universal law, free fall, acceleration due to gravity 'g', difference between mass and weight, thrust and pressure, buoyancy, Archimedes' principle, relative density.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t9_9_1", title: "Universal Law of Gravitation (F = G*m1*m2/r^2)", isCompleted: true, isImportant: true },
          { id: "t9_9_2", title: "Acceleration Due to Gravity 'g' vs 'G' & Free Fall", isCompleted: true, isImportant: true },
          { id: "t9_9_3", title: "Archimedes' Principle & Buoyant Force", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c9_s_ch10",
        title: "Work and Energy",
        order: 10,
        weightageMarks: 7,
        weightagePercent: 9,
        difficulty: "Medium",
        summary: "Scientific conception of work, work done by constant force (W = F*s*cosθ), kinetic energy (Ek = 1/2 mv^2), potential energy (Ep = mgh), law of conservation of energy, power (rate of doing work, commercial unit kWh).",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t9_10_1", title: "Work Done Conditions (Positive, Negative & Zero Work)", isCompleted: true, isImportant: true },
          { id: "t9_10_2", title: "Kinetic & Potential Energy Derivations", isCompleted: true, isImportant: true },
          { id: "t9_10_3", title: "Law of Conservation of Mechanical Energy & Power", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c9_s_ch11",
        title: "Sound",
        order: 11,
        weightageMarks: 6,
        weightagePercent: 8,
        difficulty: "Medium",
        summary: "Production of sound, propagation of sound through a medium, longitudinal sound waves, compression and rarefaction, wave characteristics (wavelength, frequency, time period, amplitude, speed), reflection of sound, echo, reverberation, ultrasound applications.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t9_11_1", title: "Sound Waves as Longitudinal Waves & v = f * λ", isCompleted: true, isImportant: true },
          { id: "t9_11_2", title: "Echo Calculation (Minimum Distance 17.2m)", isCompleted: false, isImportant: true },
          { id: "t9_11_3", title: "Ultrasound Applications & SONAR System", isCompleted: false, isImportant: false },
        ],
      },
      {
        id: "c9_s_ch12",
        title: "Improvement in Food Resources",
        order: 12,
        weightageMarks: 4,
        weightagePercent: 5,
        difficulty: "Easy",
        summary: "Crop yield improvement, crop variety improvement (hybridization, genetically modified crops), crop production management (nutrients, manure, fertilizers, irrigation, cropping patterns), crop protection, animal husbandry (cattle, poultry, fish farming, beekeeping).",
        formulaSheetAvailable: false,
        hasPracticeTest: true,
        topics: [
          { id: "t9_12_1", title: "Manures vs Fertilizers & Nutrient Management", isCompleted: true, isImportant: true },
          { id: "t9_12_2", title: "Cropping Patterns (Mixed, Intercropping, Crop Rotation)", isCompleted: false, isImportant: true },
          { id: "t9_12_3", title: "Animal Husbandry & Composite Fish Culture", isCompleted: false, isImportant: false },
        ],
      },
    ],
  },
  {
    id: "syl_c9_math",
    name: "Mathematics (Class 9 - New NCERT)",
    classGrade: "Class 9",
    board: "CBSE",
    isNewNcert: true,
    code: "MATH-09-NCERT",
    icon: "Calculator",
    color: "from-blue-600 to-cyan-600",
    totalMarks: 100,
    examPatternSummary: "Theory: 80 marks + Internal: 20 marks. Number Systems (10m), Algebra (20m), Coordinate Geometry (4m), Geometry (27m), Mensuration (13m), Statistics (6m).",
    description: "Official Rationalized New NCERT Curriculum (2025-2026): Number Systems, Polynomials, Coordinate Geometry, Linear Equations, Lines & Angles, Triangles, Quadrilaterals, Circles, Heron's Formula, Surface Areas & Volumes, and Statistics.",
    chapters: [
      {
        id: "c9_m_ch1",
        title: "Number Systems",
        order: 1,
        weightageMarks: 10,
        weightagePercent: 12,
        difficulty: "Medium",
        summary: "Review of representation of natural numbers, integers, rational numbers on number line. Rational numbers as recurring/terminating decimals. Real numbers, operations on real numbers, rationalizing denominators, laws of exponents with integral powers.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "tm9_1_1", title: "Rational Numbers & Decimal Expansion Representation", isCompleted: true, isImportant: true },
          { id: "tm9_1_2", title: "Rationalizing Denominators (Surds & Conjugates)", isCompleted: true, isImportant: true },
          { id: "tm9_1_3", title: "Laws of Exponents for Real Numbers", isCompleted: true, isImportant: false },
        ],
      },
      {
        id: "c9_m_ch2",
        title: "Polynomials",
        order: 2,
        weightageMarks: 12,
        weightagePercent: 15,
        difficulty: "Hard",
        summary: "Definition of a polynomial in one variable, coefficients, degree, zero polynomial, zeroes of a polynomial. Remainder Theorem, Factor Theorem, factorization of polynomials by splitting the middle term and algebraic identities: (a+b)^2, (a-b)^2, a^2-b^2, (x+a)(x+b), (a+b+c)^2, (a±b)^3, a^3+b^3+c^3 - 3abc.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "tm9_2_1", title: "Zeroes of Polynomials & Factor Theorem", isCompleted: true, isImportant: true },
          { id: "tm9_2_2", title: "Factorization of Quadratic & Cubic Polynomials", isCompleted: true, isImportant: true },
          { id: "tm9_2_3", title: "8 Standard Algebraic Identities & Expansions", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c9_m_ch3",
        title: "Coordinate Geometry",
        order: 3,
        weightageMarks: 4,
        weightagePercent: 5,
        difficulty: "Easy",
        summary: "Cartesian plane, coordinates of a point, names and terms associated with the coordinate plane (abscissa, ordinate, quadrants), plotting points in the plane.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "tm9_3_1", title: "Cartesian Coordinates, Quadrants & Signs", isCompleted: true, isImportant: true },
          { id: "tm9_3_2", title: "Plotting Points on Cartesian Coordinate Plane", isCompleted: true, isImportant: false },
        ],
      },
      {
        id: "c9_m_ch4",
        title: "Linear Equations in Two Variables",
        order: 4,
        weightageMarks: 8,
        weightagePercent: 10,
        difficulty: "Medium",
        summary: "Recall of linear equations in one variable. Introduction to the equation in two variables: ax + by + c = 0. Solutions of a linear equation (infinitely many solutions), graphing linear equations.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "tm9_4_1", title: "Standard Form ax + by + c = 0 & Finding Solutions", isCompleted: true, isImportant: true },
          { id: "tm9_4_2", title: "Graph of Linear Equations in Two Variables", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c9_m_ch5",
        title: "Lines and Angles",
        order: 5,
        weightageMarks: 7,
        weightagePercent: 9,
        difficulty: "Medium",
        summary: "Basic terms and definitions, intersecting lines and non-intersecting lines, pairs of angles (linear pair axiom, vertically opposite angles proof), lines parallel to the same line, transversal theorem.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "tm9_5_1", title: "Linear Pair Axiom & Vertically Opposite Angles Proof", isCompleted: true, isImportant: true },
          { id: "tm9_5_2", title: "Parallel Lines & Transversal Angle Relationships", isCompleted: true, isImportant: true },
        ],
      },
      {
        id: "c9_m_ch6",
        title: "Triangles (Congruence & Proofs)",
        order: 6,
        weightageMarks: 10,
        weightagePercent: 12,
        difficulty: "Hard",
        summary: "Congruence of triangles, criteria for congruence: SAS, ASA, AAS, SSS, RHS congruence rules. Properties of a triangle: angles opposite to equal sides of a triangle are equal, inequalities in a triangle.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "tm9_6_1", title: "Criteria for Congruence (SAS, ASA, SSS, RHS Theorems)", isCompleted: true, isImportant: true },
          { id: "tm9_6_2", title: "Isosceles Triangle Properties & Geometric Proofs", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c9_m_ch7",
        title: "Quadrilaterals",
        order: 7,
        weightageMarks: 6,
        weightagePercent: 8,
        difficulty: "Hard",
        summary: "Properties of a parallelogram: diagonal divides into two congruent triangles, opposite sides/angles equal, diagonals bisect each other. The Mid-point Theorem and its converse.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "tm9_7_1", title: "Properties of Parallelograms, Rhombus, Rectangle, Square", isCompleted: true, isImportant: true },
          { id: "tm9_7_2", title: "The Mid-Point Theorem Proof & Application", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c9_m_ch8",
        title: "Circles",
        order: 8,
        weightageMarks: 8,
        weightagePercent: 10,
        difficulty: "Hard",
        summary: "Angle subtended by a chord at a point, perpendicular from the centre to a chord bisects the chord, equal chords and their distances from centre, angle subtended by an arc of a circle at centre is double the angle at remaining part, cyclic quadrilaterals.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "tm9_8_1", title: "Perpendicular from Centre to Chord & Distance Theorems", isCompleted: true, isImportant: true },
          { id: "tm9_8_2", title: "Angle Subtended by Arc at Centre is Double (Proof)", isCompleted: false, isImportant: true },
          { id: "tm9_8_3", title: "Cyclic Quadrilaterals Opposite Angles Sum = 180°", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c9_m_ch9",
        title: "Heron's Formula",
        order: 9,
        weightageMarks: 4,
        weightagePercent: 5,
        difficulty: "Easy",
        summary: "Area of a triangle using Heron's formula: Area = √[s(s-a)(s-b)(s-c)], where semi-perimeter s = (a+b+c)/2. Practical applications to scalene triangles.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "tm9_9_1", title: "Heron's Formula Definition & Semi-Perimeter", isCompleted: true, isImportant: true },
          { id: "tm9_9_2", title: "Area of Scalene Triangles & Ratio Word Problems", isCompleted: true, isImportant: true },
        ],
      },
      {
        id: "c9_m_ch10",
        title: "Surface Areas and Volumes",
        order: 10,
        weightageMarks: 9,
        weightagePercent: 11,
        difficulty: "Hard",
        summary: "Surface areas and volumes of right circular cones, spheres, and hemispheres. Rationalized curriculum focusing strictly on circular cones and spherical geometries.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "tm9_10_1", title: "Right Circular Cone CSA, TSA & Volume Formulas", isCompleted: true, isImportant: true },
          { id: "tm9_10_2", title: "Sphere & Hemisphere Surface Area and Volume Numericals", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c9_m_ch11",
        title: "Statistics",
        order: 11,
        weightageMarks: 6,
        weightagePercent: 8,
        difficulty: "Easy",
        summary: "Bar graphs, histograms (with varying base-lengths as well as uniform width), and frequency polygons. Graphical analysis of statistical grouped data.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "tm9_11_1", title: "Bar Graphs & Histograms with Continuous Intervals", isCompleted: true, isImportant: true },
          { id: "tm9_11_2", title: "Constructing Frequency Polygons with Mid-Points", isCompleted: false, isImportant: false },
        ],
      },
    ],
  },
  {
    id: "syl_c12_math",
    name: "Mathematics (Class 12)",
    classGrade: "Class 12",
    board: "CBSE",
    isNewNcert: true,
    code: "MATH-12-CBSE",
    icon: "Calculator",
    color: "from-blue-600 to-indigo-600",
    totalMarks: 100,
    examPatternSummary: "Section A: 20 MCQs (1 mark each), Section B: 5 VSA (2 marks), Section C: 6 SA (3 marks), Section D: 4 LA (5 marks), Section E: 3 Case Studies (4 marks). Total 80 theory + 20 internal.",
    description: "Full NCERT/CBSE/State Board Curriculum with Calculus, Vectors & 3D Geometry, Linear Programming & Probability.",
    chapters: [
      {
        id: "c12_m_ch1",
        title: "Relations and Functions",
        order: 1,
        weightageMarks: 8,
        weightagePercent: 10,
        difficulty: "Medium",
        summary: "Types of relations (reflexive, symmetric, transitive, equivalence). One-to-one and onto functions. Composite functions & inverse.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t_1_1", title: "Equivalence Relations & Partitions", isCompleted: true, isImportant: true },
          { id: "t_1_2", title: "Invertible Functions & Composition", isCompleted: true, isImportant: true },
          { id: "t_1_3", title: "Binary Operations & Cayley Tables", isCompleted: false, isImportant: false },
        ],
      },
      {
        id: "c12_m_ch2",
        title: "Inverse Trigonometric Functions",
        order: 2,
        weightageMarks: 6,
        weightagePercent: 8,
        difficulty: "Easy",
        summary: "Definition, range, domain, principal value branch. Graphs of inverse trigonometric functions and elementary properties.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t_2_1", title: "Principal Value Branches & Ranges", isCompleted: true, isImportant: true },
          { id: "t_2_2", title: "Sum & Difference Identities", isCompleted: true, isImportant: true },
          { id: "t_2_3", title: "Simplification & Conversion of Inverse Ratios", isCompleted: false, isImportant: false },
        ],
      },
      {
        id: "c12_m_ch3",
        title: "Matrices and Determinants",
        order: 3,
        weightageMarks: 10,
        weightagePercent: 12,
        difficulty: "Medium",
        summary: "Matrix operations, transpose, symmetric/skew-symmetric. Invertible matrices. Properties of determinants, minors, cofactors, adjoint and inverse. Solving linear systems using Matrix Method.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t_3_1", title: "Matrix Multiplication & Transpose Properties", isCompleted: true, isImportant: false },
          { id: "t_3_2", title: "Adjoint and Inverse of 3x3 Matrices", isCompleted: true, isImportant: true },
          { id: "t_3_3", title: "Solving System of Linear Equations (AX = B)", isCompleted: true, isImportant: true },
        ],
      },
      {
        id: "c12_m_ch4",
        title: "Continuity and Differentiability",
        order: 4,
        weightageMarks: 12,
        weightagePercent: 15,
        difficulty: "Hard",
        summary: "Continuity, derivative of composite functions, chain rule, derivative of implicit functions, exponential and logarithmic functions. Second order derivatives.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t_4_1", title: "Continuity at a Point and in an Interval", isCompleted: true, isImportant: true },
          { id: "t_4_2", title: "Logarithmic Differentiation & Parametric Forms", isCompleted: false, isImportant: true },
          { id: "t_4_3", title: "Second Order Derivatives & Proofs", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c12_m_ch5",
        title: "Integrals (Definite & Indefinite)",
        order: 5,
        weightageMarks: 16,
        weightagePercent: 20,
        difficulty: "Hard",
        summary: "Integration by substitution, partial fractions, integration by parts. Evaluation of definite integrals and special properties.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t_5_1", title: "Integration by Partial Fractions & Special Integrals", isCompleted: false, isImportant: true },
          { id: "t_5_2", title: "Integration by Parts (ILATE rule)", isCompleted: false, isImportant: true },
          { id: "t_5_3", title: "Definite Integral King & Queen Properties", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c12_m_ch6",
        title: "Vectors and 3D Geometry",
        order: 6,
        weightageMarks: 14,
        weightagePercent: 18,
        difficulty: "Medium",
        summary: "Direction cosines and direction ratios of a line. Cartesian and vector equation of a line. Shortest distance between two skew lines.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t_6_1", title: "Dot and Cross Products of Vectors", isCompleted: true, isImportant: true },
          { id: "t_6_2", title: "Shortest Distance Between Skew Lines", isCompleted: true, isImportant: true },
          { id: "t_6_3", title: "Equation of Lines in Space", isCompleted: true, isImportant: false },
        ],
      },
    ],
  },
  {
    id: "syl_c12_phy",
    name: "Physics (Class 12)",
    classGrade: "Class 12",
    code: "PHY-12-CBSE",
    icon: "Zap",
    color: "from-amber-500 to-rose-600",
    totalMarks: 100,
    examPatternSummary: "Theory: 70 marks (33 questions). Practical: 30 marks. Electrostatics & Magnetism carry 32 marks combined.",
    description: "Electromagnetism, Optics, Dual Nature, Atoms & Nuclei, Semiconductor Electronics.",
    chapters: [
      {
        id: "c12_p_ch1",
        title: "Electric Charges and Fields",
        order: 1,
        weightageMarks: 9,
        weightagePercent: 12,
        difficulty: "Medium",
        summary: "Coulomb's law, electric field due to dipole, electric flux, Gauss's theorem and its applications to infinite wire, plane sheet, and spherical shell.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "tp_1_1", title: "Gauss Law & Electric Flux", isCompleted: true, isImportant: true },
          { id: "tp_1_2", title: "Electric Dipole on Axial & Equatorial Lines", isCompleted: true, isImportant: true },
          { id: "tp_1_3", title: "Torque on Dipole in Uniform Field", isCompleted: true, isImportant: false },
        ],
      },
      {
        id: "c12_p_ch2",
        title: "Current Electricity",
        order: 2,
        weightageMarks: 8,
        weightagePercent: 11,
        difficulty: "Medium",
        summary: "Drift velocity, Ohm's law, temperature dependence of resistance, internal resistance, Kirchhoff's rules and Wheatstone bridge.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "tp_2_1", title: "Drift Velocity & Mobility Derivations", isCompleted: true, isImportant: true },
          { id: "tp_2_2", title: "Kirchhoff Laws & Loop Analysis", isCompleted: true, isImportant: true },
          { id: "tp_2_3", title: "Wheatstone Bridge & Meter Bridge", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c12_p_ch3",
        title: "Ray Optics and Optical Instruments",
        order: 3,
        weightageMarks: 10,
        weightagePercent: 14,
        difficulty: "Hard",
        summary: "Refraction at spherical surfaces, lenses, thin lens formula, lens maker's formula, magnification, prism formula, compound microscope & astronomical telescope.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "tp_3_1", title: "Lens Maker Formula & Combination", isCompleted: true, isImportant: true },
          { id: "tp_3_2", title: "Refraction Through Prism & Dispersion", isCompleted: false, isImportant: true },
          { id: "tp_3_3", title: "Compound Microscope & Astronomical Telescope Ray Diagrams", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c12_p_ch4",
        title: "Semiconductor Electronics: Materials & Devices",
        order: 4,
        weightageMarks: 7,
        weightagePercent: 10,
        difficulty: "Easy",
        summary: "Energy bands in conductors, semiconductors and insulators. Intrinsic and extrinsic semiconductors, p-n junction diode, V-I characteristics, diode as a rectifier.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "tp_4_1", title: "Energy Band Theory & Doping", isCompleted: true, isImportant: false },
          { id: "tp_4_2", title: "P-N Junction Forward & Reverse Bias", isCompleted: true, isImportant: true },
          { id: "tp_4_3", title: "Half Wave & Full Wave Rectifiers with Waveforms", isCompleted: false, isImportant: true },
        ],
      },
    ],
  },
  {
    id: "syl_c10_sci",
    name: "Science (Class 10)",
    classGrade: "Class 10",
    code: "SCI-10-CBSE",
    icon: "Atom",
    color: "from-emerald-500 to-teal-600",
    totalMarks: 100,
    examPatternSummary: "Theory: 80 marks. Chemical Substances (25m), World of Living (25m), Natural Phenomena (12m), Effects of Current (13m), Natural Resources (5m).",
    description: "Class 10 Board curriculum covering Chemical Reactions, Acids & Bases, Life Processes, Heredity, Light, Electricity & Magnetic Effects.",
    chapters: [
      {
        id: "c10_s_ch1",
        title: "Chemical Reactions and Equations",
        order: 1,
        weightageMarks: 6,
        weightagePercent: 8,
        difficulty: "Easy",
        summary: "Chemical equation, balanced chemical equation, implications of a balanced equation, types of reactions: combination, decomposition, displacement, double displacement, precipitation, neutralization, oxidation and reduction.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t10_1_1", title: "Balancing Chemical Equations", isCompleted: true, isImportant: true },
          { id: "t10_1_2", title: "Types of Chemical Reactions with Examples", isCompleted: true, isImportant: true },
          { id: "t10_1_3", title: "Corrosion and Rancidity Prevention", isCompleted: true, isImportant: false },
        ],
      },
      {
        id: "c10_s_ch2",
        title: "Life Processes",
        order: 2,
        weightageMarks: 9,
        weightagePercent: 12,
        difficulty: "Medium",
        summary: "Basic concept of nutrition (autotrophic & heterotrophic), respiration (aerobic & anaerobic), transportation in plants and animals (human heart, double circulation), excretion (human nephron).",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t10_2_1", title: "Human Digestive System & Enzymes", isCompleted: true, isImportant: true },
          { id: "t10_2_2", title: "Human Heart Structure & Double Circulation", isCompleted: true, isImportant: true },
          { id: "t10_2_3", title: "Structure of Nephron & Urine Formation", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c10_s_ch3",
        title: "Light – Reflection and Refraction",
        order: 3,
        weightageMarks: 8,
        weightagePercent: 10,
        difficulty: "Medium",
        summary: "Reflection of light by curved surfaces, spherical mirrors, center of curvature, principal axis, principal focus, focal length, mirror formula, magnification. Refraction: laws of refraction, refractive index, lens formula, power of a lens.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t10_3_1", title: "Ray Diagrams for Concave & Convex Mirrors", isCompleted: true, isImportant: true },
          { id: "t10_3_2", title: "Refraction & Snell's Law Numericals", isCompleted: true, isImportant: true },
          { id: "t10_3_3", title: "Lens Formula & Power of Lens Calculations", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c10_s_ch4",
        title: "Electricity & Circuits",
        order: 4,
        weightageMarks: 7,
        weightagePercent: 9,
        difficulty: "Medium",
        summary: "Electric current, potential difference, Ohm's law, resistance, resistivity, series and parallel combinations of resistors, Joule's heating effect and electric power.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t10_4_1", title: "Ohm's Law V-I Graph & Resistance Factors", isCompleted: true, isImportant: true },
          { id: "t10_4_2", title: "Series and Parallel Equivalent Resistance Numericals", isCompleted: true, isImportant: true },
          { id: "t10_4_3", title: "Joule's Law of Heating & Commercial Unit (kWh)", isCompleted: true, isImportant: false },
        ],
      },
    ],
  },
  {
    id: "syl_c10_math",
    name: "Mathematics (Class 10)",
    classGrade: "Class 10",
    code: "MATH-10-CBSE",
    icon: "Calculator",
    color: "from-blue-500 to-indigo-600",
    totalMarks: 100,
    examPatternSummary: "80 marks theory + 20 internal. Algebra (20m), Trigonometry (12m), Coordinate Geometry (6m), Geometry (15m), Mensuration (10m), Statistics & Probability (11m).",
    description: "Class 10 Board Math: Real Numbers, Polynomials, Quadratic Equations, Arithmetic Progressions, Triangles, Trigonometry, Circles, Surface Areas & Volumes.",
    chapters: [
      {
        id: "c10_m_ch1",
        title: "Quadratic Equations",
        order: 1,
        weightageMarks: 6,
        weightagePercent: 8,
        difficulty: "Medium",
        summary: "Standard form of a quadratic equation ax² + bx + c = 0. Solutions by factorization and by using quadratic formula. Nature of roots based on discriminant D.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "tm10_1_1", title: "Discriminant & Nature of Roots (D > 0, D = 0, D < 0)", isCompleted: true, isImportant: true },
          { id: "tm10_1_2", title: "Quadratic Formula and Factorization", isCompleted: true, isImportant: true },
          { id: "tm10_1_3", title: "Word Problems on Speed, Distance & Time", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c10_m_ch2",
        title: "Introduction to Trigonometry",
        order: 2,
        weightageMarks: 8,
        weightagePercent: 10,
        difficulty: "Medium",
        summary: "Trigonometric ratios of an acute angle of a right-angled triangle. Values of trigonometric ratios of 0°, 30°, 45°, 60° and 90°. Proof and applications of identity sin²A + cos²A = 1.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "tm10_2_1", title: "Trigonometric Ratios Table (0° to 90°)", isCompleted: true, isImportant: true },
          { id: "tm10_2_2", title: "Trigonometric Identities Proofs & Applications", isCompleted: true, isImportant: true },
          { id: "tm10_2_3", title: "Heights and Distances Angle of Elevation & Depression", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c10_m_ch3",
        title: "Triangles (Similar Figures)",
        order: 3,
        weightageMarks: 9,
        weightagePercent: 12,
        difficulty: "Hard",
        summary: "Definitions, examples, counter examples of similar triangles. Basic Proportionality Theorem (Thales Theorem) and criteria for similarity (AAA, SSS, SAS).",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "tm10_3_1", title: "Basic Proportionality Theorem (BPT Proof)", isCompleted: true, isImportant: true },
          { id: "tm10_3_2", title: "Criteria for Similarity of Triangles", isCompleted: false, isImportant: true },
        ],
      },
    ],
  },
  {
    id: "syl_jee_neet",
    name: "JEE & NEET Competitive Foundation",
    classGrade: "Competitive Exams",
    code: "JEE-NEET-2026",
    icon: "Trophy",
    color: "from-purple-600 to-pink-600",
    totalMarks: 300,
    examPatternSummary: "JEE Main: 75 questions (300 marks) with +4/-1 negative marking. NEET UG: 180 questions (720 marks) with Physics (180), Chemistry (180), Biology (360).",
    description: "High-yield competitive syllabus for IIT JEE Main & Advanced and NEET UG with deep concept linkages, high-weightage topics and speed problem shortcuts.",
    chapters: [
      {
        id: "c_comp_1",
        title: "Rotational Motion & Rigid Body Dynamics (Physics)",
        order: 1,
        weightageMarks: 12,
        weightagePercent: 12,
        difficulty: "Hard",
        summary: "Moment of Inertia of symmetrical bodies, Parallel and Perpendicular axis theorems, Torque, Angular momentum conservation, Pure rolling on inclined planes.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t_comp_1_1", title: "Moment of Inertia Calculus & Standard Forms", isCompleted: true, isImportant: true },
          { id: "t_comp_1_2", title: "Conservation of Angular Momentum Collisions", isCompleted: false, isImportant: true },
          { id: "t_comp_1_3", title: "Pure Rolling Dynamics & Friction Direction", isCompleted: false, isImportant: true },
        ],
      },
      {
        id: "c_comp_2",
        title: "Chemical Bonding & Molecular Structure (Chemistry)",
        order: 2,
        weightageMarks: 12,
        weightagePercent: 12,
        difficulty: "Medium",
        summary: "VSEPR Theory, Hybridization (sp to sp3d3), Molecular Orbital Theory (MOT) bond orders, Dipole moment, Hydrogen bonding.",
        formulaSheetAvailable: true,
        hasPracticeTest: true,
        topics: [
          { id: "t_comp_2_1", title: "VSEPR Shapes and Lone Pair Repulsions", isCompleted: true, isImportant: true },
          { id: "t_comp_2_2", title: "MOT Bond Order and Paramagnetic Character", isCompleted: true, isImportant: true },
          { id: "t_comp_2_3", title: "Fajan's Rules for Covalent Character in Ionic Bonds", isCompleted: false, isImportant: true },
        ],
      },
    ],
  },
];

export const initialStudyAlarms: StudyAlarm[] = [
  {
    id: "alarm_1",
    title: "Morning NCERT Core Concepts Revision",
    subject: "Science",
    topic: "Motion & Laws of Motion (Class 9)",
    classGrade: "Class 9",
    board: "CBSE",
    time: "06:30",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    isEnabled: true,
    sound: "bell",
    repeat: "weekdays",
    autoOpenView: "smart-notes",
    createdAt: "2026-09-01T06:00:00.000Z",
  },
  {
    id: "alarm_2",
    title: "Daily Mathematics Problem Solving Drill",
    subject: "Mathematics",
    topic: "Polynomials & Algebraic Identities",
    classGrade: "Class 9",
    board: "CBSE",
    time: "17:30",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    isEnabled: true,
    sound: "chime",
    repeat: "weekdays",
    autoOpenView: "focus-timer",
    createdAt: "2026-09-01T06:00:00.000Z",
  },
  {
    id: "alarm_3",
    title: "Night Formula & Flashcard Recap",
    subject: "Science & Math",
    topic: "Key Formulas and Board PYQs",
    classGrade: "Class 9",
    board: "CBSE",
    time: "21:15",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    isEnabled: true,
    sound: "zen",
    repeat: "daily",
    autoOpenView: "smart-notes",
    createdAt: "2026-09-01T06:00:00.000Z",
  },
];

export const initialSmartNotes: SmartNoteItem[] = [
  {
    id: "sn_c9_motion",
    title: "Motion & Laws of Motion — Class 9 Comprehensive NCERT Notes",
    topic: "Motion and Newton's Laws of Motion",
    classGrade: "Class 9",
    board: "CBSE",
    subject: "Science (Physics)",
    noteType: "comprehensive",
    syllabusContext: "Latest New NCERT Rationalized Syllabus (2025-2026) & CBSE Board Blueprint",
    overview: "Motion is the change in position of an object over time with respect to a reference point. In the New NCERT rationalized curriculum, this chapter establishes the foundational mechanics required for all high school physics: kinematic equations, graphical velocity-time analysis, inertia, and Newton's three laws of motion with momentum conservation.",
    keyConcepts: [
      {
        heading: "1. Distance vs Displacement & Velocity",
        explanation: "Distance is the actual path length traversed by an object and is always a scalar (magnitude only, never negative). Displacement is the shortest straight-line distance between initial and final positions and is a vector. An object can travel a distance of 100m while having a net displacement of 0m (e.g. returning to the starting point in a circle).",
        diagramDescription: "Draw a straight horizontal line with origin O, point A at +50m, and point B at +100m. Show path from O -> B -> A to illustrate Distance = 150m, Displacement = +50m.",
        examples: ["A car completing one complete circular lap of radius R has distance = 2πR and displacement = 0."]
      },
      {
        heading: "2. The Three Equations of Uniformly Accelerated Motion",
        explanation: "Derived graphically from velocity-time graphs where slope = acceleration (a) and the area under the v-t curve = displacement (s). (1) v = u + at, (2) s = ut + 1/2 at², (3) 2as = v² - u². These equations apply ONLY when acceleration is constant.",
        diagramDescription: "v-t graph with initial velocity u on y-axis at t=0 and final velocity v at time t. The total area is partitioned into a rectangle (u * t) and a triangle (1/2 * (v-u) * t).",
        examples: ["A stone dropped from rest (u=0) under gravity g=9.8 m/s² falls s = 1/2 g t² in t seconds."]
      },
      {
        heading: "3. Newton's Second Law & Momentum Conservation",
        explanation: "Newton's Second Law states that the rate of change of momentum is directly proportional to the applied unbalanced force: F ∝ dp/dt. Since p = mv, F = m(v-u)/t = ma. In an isolated system (no external force), total initial momentum equals total final momentum: m1*u1 + m2*u2 = m1*v1 + m2*v2.",
        diagramDescription: "Collision between two spheres A and B. Sphere A exerts force Fab on B; sphere B exerts equal and opposite reaction force Fba on A.",
        examples: ["A cricket fielder pulls his hands backward while catching a fast ball to increase the time of impact (t), thereby reducing the force (F) felt on his hands."]
      }
    ],
    formulasAndLaws: [
      {
        name: "First Equation of Motion",
        formula: "v = u + a * t",
        variables: "v = final velocity, u = initial velocity, a = acceleration, t = time",
        units: "v, u in m/s; a in m/s²; t in seconds"
      },
      {
        name: "Second Equation of Motion",
        formula: "s = u * t + (1/2) * a * t²",
        variables: "s = displacement, u = initial velocity, a = acceleration, t = time",
        units: "s in meters (m)"
      },
      {
        name: "Third Equation of Motion",
        formula: "v² - u² = 2 * a * s",
        variables: "v = final velocity, u = initial velocity, a = acceleration, s = distance",
        units: "velocities in m/s, distance in m"
      },
      {
        name: "Newton's Second Law Equation",
        formula: "F = m * a",
        variables: "F = Force, m = mass of object, a = acceleration produced",
        units: "F in Newtons (N or kg·m/s²)"
      },
      {
        name: "Linear Momentum",
        formula: "p = m * v",
        variables: "p = momentum, m = mass, v = velocity",
        units: "kg·m/s"
      }
    ],
    mustKnowExamQuestions: [
      {
        question: "Derive the second equation of motion s = ut + 1/2 at² graphically from a velocity-time graph.",
        marks: 5,
        answer: "Step 1: Draw the v-t graph for uniform acceleration with initial velocity OA = u, final velocity BC = v, and time duration OC = AD = t.\nStep 2: Distance travelled s = Area of trapezium OABC = Area of rectangle OADC + Area of triangle ABD.\nStep 3: Area of rectangle OADC = OA * OC = u * t.\nStep 4: Area of triangle ABD = 1/2 * base * height = 1/2 * AD * BD = 1/2 * t * (v - u).\nStep 5: From the first equation of motion, (v - u) = at. Substituting this into the triangle area gives 1/2 * t * (at) = 1/2 at².\nStep 6: Total distance s = ut + 1/2 at². Hence proved.",
        markingKeyPoints: [
          "Accurate labeled v-t graph with axes and shaded area (1 mark)",
          "Area of rectangle formulated correctly (1 mark)",
          "Area of triangle formulated correctly (1 mark)",
          "Substitution of (v - u) = at (1 mark)",
          "Final equation written with units specified (1 mark)"
        ]
      },
      {
        question: "A constant force acts on an object of mass 5 kg for a duration of 2 s. It increases the object's velocity from 3 m/s to 7 m/s. Find the magnitude of the applied force.",
        marks: 3,
        answer: "Given: Mass m = 5 kg, Initial velocity u = 3 m/s, Final velocity v = 7 m/s, Time t = 2 s.\nAcceleration a = (v - u) / t = (7 - 3) / 2 = 4 / 2 = 2 m/s².\nAccording to Newton's Second Law: F = m * a = 5 kg * 2 m/s² = 10 N.\nConclusion: The magnitude of the applied force is 10 Newtons.",
        markingKeyPoints: [
          "Correct identification of given variables (1 mark)",
          "Calculation of acceleration a = 2 m/s² (1 mark)",
          "Final force F = 10 N with units (1 mark)"
        ]
      }
    ],
    commonPitfalls: [
      "Forgetting to convert speed from km/h to m/s. Always multiply by 5/18!",
      "Confusing scalar speed with vector velocity. When velocity changes direction, the sign changes (+ to -).",
      "Treating action and reaction forces as cancelling each other out. They act on TWO DIFFERENT bodies, so they never cancel each other!",
      "Assuming weight and mass are identical. Mass (kg) is constant everywhere; weight (W = mg) is a force measured in Newtons and varies with gravity."
    ],
    quickRevisionPoints: [
      "Slope of distance-time graph gives speed; slope of velocity-time graph gives acceleration.",
      "Area under velocity-time graph represents the total displacement travelled.",
      "Newton's 1st Law defines Inertia; 2nd Law provides the formula F=ma; 3rd Law establishes action-reaction interaction.",
      "Recoil velocity of gun: V_gun = -(m_bullet * v_bullet) / M_gun.",
      "Inertia is directly proportional to mass — heavier objects have greater inertia."
    ],
    formattedMarkdown: `# Motion & Laws of Motion — Class 9 (CBSE / New NCERT)\n\n## 📌 Chapter Summary\nThis unit covers kinematic equations, graphical representations of motion, and Newton's three governing laws of mechanics.\n\n### ⚡ Essential Equations\n1. $v = u + at$\n2. $s = ut + \\frac{1}{2}at^2$\n3. $v^2 - u^2 = 2as$\n4. $F = ma$`,
    createdAt: "2026-09-02T10:00:00.000Z",
    isFavorite: true,
  },
  {
    id: "sn_c9_number_sys",
    title: "Number Systems & Real Numbers — Class 9 NCERT Smart Notes",
    topic: "Number Systems, Surds, and Rationalization",
    classGrade: "Class 9",
    board: "CBSE",
    subject: "Mathematics",
    noteType: "comprehensive",
    syllabusContext: "Latest New NCERT Rationalized Syllabus (2025-2026) & All State Boards",
    overview: "Number Systems in Class 9 unifies the complete spectrum of real numbers, distinguishing between terminating/non-terminating recurring rational numbers (p/q form) and non-terminating non-recurring irrational numbers. It introduces surd operations, conjugate rationalization of binomial denominators, and fractional laws of exponents.",
    keyConcepts: [
      {
        heading: "1. Rational vs Irrational Decimal Expansions",
        explanation: "A real number is Rational (Q) if and only if its decimal expansion is either terminating (e.g. 1/8 = 0.125) or non-terminating repeating/recurring (e.g. 1/3 = 0.333...). An irrational number has a non-terminating and non-repeating decimal expansion (e.g. √2, √3, π).",
        examples: ["Expressing 0.333... as 1/3 by letting x = 0.333... and subtracting x from 10x = 3.333... yielding 9x = 3 => x = 1/3."]
      },
      {
        heading: "2. Rationalizing the Denominator using Conjugates",
        explanation: "When a fraction contains a radical/surd in the denominator like 1 / (a + √b), we multiply both numerator and denominator by its conjugate (a - √b). By using the identity (x+y)(x-y) = x² - y², the radical in the denominator is eliminated: (a + √b)(a - √b) = a² - b.",
        diagramDescription: "Conjugate multiplication: [1 / (√5 + √2)] * [(√5 - √2) / (√5 - √2)] = (√5 - √2) / (5 - 2) = (√5 - √2) / 3.",
        examples: ["Rationalize 1 / (7 + 3√2): Multiply by (7 - 3√2) to obtain (7 - 3√2) / (49 - 18) = (7 - 3√2) / 31."]
      }
    ],
    formulasAndLaws: [
      {
        name: "Conjugate Radical Product",
        formula: "(√a + √b)(√a - √b) = a - b",
        variables: "a, b are positive real numbers",
        units: "Dimensionless algebraic numbers"
      },
      {
        name: "Laws of Exponents (Multiplication)",
        formula: "a^m * a^n = a^(m+n)",
        variables: "a is positive real base, m, n are rational exponents",
        units: "Algebraic power"
      },
      {
        name: "Fractional Power Identity",
        formula: "a^(m/n) = n-th root of (a^m)",
        variables: "n is a positive integer, a > 0",
        units: "Algebraic root"
      }
    ],
    mustKnowExamQuestions: [
      {
        question: "Express 0.2353535... (i.e. 0.235 with bar on 35) in the form p/q, where p and q are integers and q ≠ 0.",
        marks: 3,
        answer: "Let x = 0.2353535...  --- (Equation 1)\nMultiply both sides by 10 (to bring the non-repeating digit before the decimal point):\n10x = 2.353535...  --- (Equation 2)\nSince two digits (35) repeat, multiply Equation 2 by 100:\n1000x = 235.353535...  --- (Equation 3)\nSubtracting Equation 2 from Equation 3:\n1000x - 10x = 235.353535... - 2.353535...\n990x = 233\nx = 233 / 990.\nSince 233 and 990 are co-prime integers and 990 ≠ 0, this is the required p/q form.",
        markingKeyPoints: [
          "Setting up the variable x and multiplying by 10 (1 mark)",
          "Multiplying by 1000 and subtracting equations (1 mark)",
          "Simplifying to final fraction 233/990 (1 mark)"
        ]
      }
    ],
    commonPitfalls: [
      "Assuming π is exactly equal to 22/7. 22/7 is rational, whereas π is irrational (22/7 is only an approximation!).",
      "Forgetting parentheses when rationalizing denominators.",
      "Confusing √a + √b with √(a+b). Remember: √9 + √16 = 3 + 4 = 7, but √(9+16) = √25 = 5!"
    ],
    quickRevisionPoints: [
      "Every real number is represented by a unique point on the real number line.",
      "The sum, difference, product, or quotient of a non-zero rational number with an irrational number is always irrational.",
      "Zero is a rational number because it can be written as 0/1 or 0/q.",
      "For any real number a > 0 and rational numbers p, q: (a^p)^q = a^(p*q)."
    ],
    formattedMarkdown: `# Number Systems — Class 9 Mathematics (New NCERT)\n\n## 📌 Rational vs Irrational Numbers\n- **Rational**: Terminating or repeating decimals ($p/q$).\n- **Irrational**: Non-terminating and non-repeating decimals.\n\n### ⚡ Denominator Rationalization\nMultiply by the conjugate radical $(a - \\sqrt{b})$.`,
    createdAt: "2026-09-02T11:00:00.000Z",
    isFavorite: false,
  }
];


