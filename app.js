// ===== ASSESSMENT DOMAIN DATA =====
const domainData = {
  frontend: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'TailwindCSS', 'Bootstrap', 'Sass/SCSS', 'Redux', 'MobX', 'Webpack'],
  backend: ['Node.js', 'Express', 'Python', 'Django', 'Flask', 'FastAPI', 'Java Spring Boot', '.NET Core', 'Ruby on Rails', 'Go', 'PHP Laravel', 'GraphQL', 'REST APIs', 'WebSockets'],
  database: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Firebase'],
  devops: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'CI/CD', 'Terraform', 'Jenkins'],
  aiml: ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn', 'Statistics', 'Linear Algebra', 'Jupyter', 'Data Cleaning', 'Feature Engineering'],
  nlp: ['NLP Basics', 'BERT', 'GPT Models', 'Text Classification'],
  cv: ['Computer Vision', 'Image Processing', 'CNN', 'Object Detection'],
  soft: ['Communication', 'Leadership', 'Problem-Solving', 'Time Management', 'Teamwork', 'Adaptability', 'Critical Thinking', 'Conflict Resolution', 'Mentoring', 'Presentation Skills']
};

// ===== DATA STORAGE (In-Memory) =====
let appState = {
  currentView: 'landing',
  assessmentStep: 1,
  totalAssessmentSteps: 8,
  assessmentComplete: false,
  assessmentData: {},
  userData: null,
  profileAvatars: ['👤', '👨‍💻', '👩‍💻', '🧑‍💻', '👨‍🔬', '👩‍🔬', '🧙', '🧙‍♀️', '🦸', '🦸‍♀️', '🤖', '👾', '🐱', '🐶', '🦊', '🐼', '🐨', '🦁', '🐯', '🐸'],
  quests: {
    daily: [],
    weekly: [],
    monthly: [],
    emergency: [],
    challenge: []
  },
  completedQuests: [],
  achievements: [],
  skillsArsenal: {
    technicalSkills: [],
    softSkills: [],
    certifications: [],
    projects: [],
    resources: [],
    network: []
  },
  skillTree: {},
  streak: {
    current: 0,
    lastLogin: null
  }
};

// ===== QUEST TEMPLATES =====
const questPools = {
  daily: [
    { title: "Code Practice Session", description: "Complete 30 minutes of focused coding practice", rank: "E", xp: 50, gold: 10, statsAffected: ["Productivity", "Intelligence"] },
    { title: "Algorithm Challenge", description: "Solve one algorithmic problem on any platform", rank: "D", xp: 100, gold: 25, statsAffected: ["Intelligence", "Creativity"] },
    { title: "Code Review Practice", description: "Review and improve code from a previous project", rank: "C", xp: 250, gold: 50, statsAffected: ["Intelligence", "Knowledge"] },
    { title: "Debug Session", description: "Fix at least one bug in your current project", rank: "D", xp: 120, gold: 30, statsAffected: ["Intelligence", "Resilience"] },
    { title: "Documentation Deep Dive", description: "Read technical documentation for 20 minutes", rank: "E", xp: 50, gold: 10, statsAffected: ["Knowledge"] },
    { title: "Learn New Concept", description: "Study a new programming concept for 25 minutes", rank: "E", xp: 60, gold: 15, statsAffected: ["Knowledge", "Intelligence"] },
    { title: "Reflection Journal", description: "Write about today's learning and challenges", rank: "E", xp: 40, gold: 10, statsAffected: ["Resilience"] }
  ],
  weekly: [
    { title: "Mini Project Creation", description: "Build and deploy a small functional project", rank: "B", xp: 500, gold: 100, statsAffected: ["Productivity", "Creativity", "Experience"] },
    { title: "Open Source Contribution", description: "Make a contribution to an open-source repository", rank: "A", xp: 1000, gold: 250, statsAffected: ["Experience", "Knowledge", "Productivity"] },
    { title: "Component Library", description: "Build 3 reusable components for your projects", rank: "B", xp: 500, gold: 100, statsAffected: ["Creativity", "Productivity"] },
    { title: "Blog Post Writing", description: "Write a technical blog post about your learning", rank: "C", xp: 250, gold: 50, statsAffected: ["Knowledge", "Resilience"] }
  ],
  monthly: [
    { title: "Full-Stack Application", description: "Build complete full-stack app with authentication", rank: "A", xp: 1000, gold: 250, statsAffected: ["Experience", "Productivity", "Intelligence"] },
    { title: "ML Model Development", description: "Train and deploy a machine learning model", rank: "S", xp: 2500, gold: 500, statsAffected: ["Intelligence", "Knowledge", "Experience"] },
    { title: "Performance Optimization", description: "Improve application performance by 50% or more", rank: "A", xp: 800, gold: 200, statsAffected: ["Intelligence", "Creativity"] }
  ],
  challenge: [
    { title: "System Architecture Design", description: "Design a scalable microservices architecture", rank: "S", xp: 1500, gold: 300, statsAffected: ["Intelligence", "Creativity", "Experience"] },
    { title: "Code Refactoring Marathon", description: "Refactor legacy codebase to modern standards", rank: "A", xp: 1200, gold: 240, statsAffected: ["Intelligence", "Productivity"] }
  ]
};

// ===== RANK-UP QUESTS =====
const rankUpQuests = [
  { level: 6, title: "First Deployment Challenge", description: "Deploy 1 feature to production + Complete 3 code reviews", xp: 100, fromRank: "F", toRank: "F+" },
  { level: 11, title: "Independence Milestone", description: "Complete 3 features independently + 1 bug bounty", xp: 150, fromRank: "E", toRank: "E+" },
  { level: 16, title: "Advanced Independence", description: "Complete 5 features with minimal guidance", xp: 150, fromRank: "E+", toRank: "D" },
  { level: 31, title: "Complexity Master Challenge", description: "Complete 1 complex feature + Resolve 5 critical bugs", xp: 200, fromRank: "D", toRank: "D+" },
  { level: 51, title: "Mid-Level Ascension", description: "Lead 1 architectural decision + Mentor 2 developers", xp: 300, fromRank: "C", toRank: "C+" },
  { level: 71, title: "Senior Level Challenge", description: "Lead team initiative + Design 1 system + 50+ code reviews", xp: 400, fromRank: "B", toRank: "B+" },
  { level: 86, title: "Staff Engineer Ascension", description: "Influence 2+ teams + 2 technical docs + Internal conference talk", xp: 500, fromRank: "A", toRank: "AA" },
  { level: 96, title: "Distinguished Mastery", description: "Define company standard + Mentor 5+ developers + Industry contribution", xp: 600, fromRank: "AAA", toRank: "AAA+" },
  { level: 101, title: "Principal Engineer Awakening", description: "Launch company initiative OR Solve critical problem OR Build revolutionary system", xp: 1000, fromRank: "AAA+", toRank: "S" }
];

// ===== ACHIEVEMENT DEFINITIONS =====
const achievementDefinitions = [
  { id: "first_steps", title: "First Steps", description: "Complete your first quest", icon: "🎯", requirement: 1, type: "quests" },
  { id: "week_warrior", title: "Week Warrior", description: "Maintain a 7-day learning streak", icon: "🔥", requirement: 7, type: "streak" },
  { id: "code_ninja", title: "Code Ninja", description: "Maintain a 30-day learning streak", icon: "⚡", requirement: 30, type: "streak" },
  { id: "quest_master", title: "Quest Master", description: "Complete 50 quests", icon: "👑", requirement: 50, type: "quests" },
  { id: "level_10", title: "Rising Star", description: "Reach Level 10", icon: "⭐", requirement: 10, type: "level" },
  { id: "level_50", title: "Seasoned Professional", description: "Reach Level 50", icon: "💫", requirement: 50, type: "level" },
  { id: "level_100", title: "Elite Status", description: "Reach Level 100 (Staff Engineer)", icon: "👑", requirement: 100, type: "level" },
  { id: "project_builder", title: "Project Builder", description: "Complete 5 project-based quests", icon: "🏗️", requirement: 5, type: "projects" }
];

// ===== GROWTH MARKETPLACE ITEMS =====
const marketplaceItems = {
  learningCredits: [
    { id: "course_access", name: "Online Course Access", description: "Access to premium Udemy or Coursera course", cost: 500, icon: "🎓" },
    { id: "certification", name: "Certification Voucher", description: "AWS, Azure, or Google Cloud certification exam", cost: 1500, icon: "📜" },
    { id: "tech_book", name: "Technical Book", description: "O'Reilly or Manning technical book of choice", cost: 300, icon: "📚" },
    { id: "conference", name: "Conference Ticket", description: "Virtual tech conference access", cost: 2000, icon: "🎫" }
  ],
  wellnessRewards: [
    { id: "flexible_day", name: "Flexible Work Day", description: "Take a flexible day off for rest", cost: 400, icon: "🏖️" },
    { id: "extended_break", name: "Extended Break", description: "2-hour extended break allowance", cost: 100, icon: "☕" },
    { id: "fitness_sub", name: "Fitness Subscription", description: "Monthly fitness class subscription", cost: 600, icon: "🏃" },
    { id: "mental_health", name: "Mental Health Session", description: "Professional counseling session", cost: 800, icon: "🧘" }
  ],
  careerDevelopment: [
    { id: "resume_review", name: "Resume Review", description: "Professional resume review service", cost: 500, icon: "📄" },
    { id: "mock_interview", name: "Mock Interview", description: "Technical mock interview session", cost: 700, icon: "💼" },
    { id: "career_coaching", name: "Career Coaching", description: "1-hour career coaching consultation", cost: 1000, icon: "🎯" },
    { id: "linkedin_premium", name: "LinkedIn Premium", description: "1-month LinkedIn Premium access", cost: 300, icon: "💼" }
  ],
  teamSocial: [
    { id: "team_lunch", name: "Team Lunch Budget", description: "Budget for team lunch or social event", cost: 400, icon: "🍽️" },
    { id: "coffee_chat", name: "Coffee Chat Credit", description: "Buy a colleague coffee for networking", cost: 50, icon: "☕" },
    { id: "peer_recognition", name: "Peer Recognition Award", description: "Send appreciation award to peer", cost: 200, icon: "🏆" }
  ]
};

// ===== SKILL TREE STRUCTURE =====
const skillTreeData = {
  web_development: {
    beginner: [
      { name: "HTML Fundamentals", prereq: null, description: "Master the structure of web pages" },
      { name: "CSS Basics", prereq: "HTML Fundamentals", description: "Style your web pages beautifully" },
      { name: "JavaScript Essentials", prereq: "HTML Fundamentals", description: "Add interactivity to your websites" },
      { name: "Git Version Control", prereq: null, description: "Track and manage your code changes" }
    ],
    intermediate: [
      { name: "React Framework", prereq: "JavaScript Essentials", description: "Build modern UIs with components" },
      { name: "Node.js Backend", prereq: "JavaScript Essentials", description: "Create server-side applications" },
      { name: "RESTful APIs", prereq: "Node.js Backend", description: "Design and build web APIs" },
      { name: "Database Design", prereq: "Node.js Backend", description: "Store and query data efficiently" }
    ],
    advanced: [
      { name: "System Architecture", prereq: "RESTful APIs", description: "Design scalable systems" },
      { name: "Performance Optimization", prereq: "React Framework", description: "Make applications lightning fast" },
      { name: "Security Best Practices", prereq: "RESTful APIs", description: "Protect your applications" },
      { name: "CI/CD Pipeline", prereq: "Git Version Control", description: "Automate deployment workflows" }
    ]
  },
  ai_ml: {
    beginner: [
      { name: "Python Programming", prereq: null, description: "Master Python for data science" },
      { name: "Math Foundations", prereq: null, description: "Linear algebra and calculus basics" },
      { name: "Statistics Basics", prereq: null, description: "Understand data and probability" },
      { name: "Data Visualization", prereq: "Python Programming", description: "Visualize data insights" }
    ],
    intermediate: [
      { name: "ML Algorithms", prereq: "Python Programming", description: "Implement core ML algorithms" },
      { name: "Deep Learning Basics", prereq: "ML Algorithms", description: "Neural networks fundamentals" },
      { name: "Data Preprocessing", prereq: "Python Programming", description: "Clean and prepare datasets" },
      { name: "Model Evaluation", prereq: "ML Algorithms", description: "Measure model performance" }
    ],
    advanced: [
      { name: "Neural Networks", prereq: "Deep Learning Basics", description: "Build complex architectures" },
      { name: "NLP Techniques", prereq: "Neural Networks", description: "Process natural language" },
      { name: "Computer Vision", prereq: "Neural Networks", description: "Analyze images and video" },
      { name: "MLOps", prereq: "Model Evaluation", description: "Deploy and monitor models" }
    ]
  }
};

// ===== AI MESSAGES =====
const aiMessages = {
  welcome: [
    "Welcome, Developer! Your journey to mastery begins now.",
    "The System recognizes your potential. Let's unlock it together.",
    "Every expert was once a beginner. Today, you take your first step."
  ],
  questComplete: [
    "Excellent work! Your skills grow stronger with each completed quest.",
    "Quest completed! You're one step closer to mastering your craft.",
    "Your dedication is paying off. The System acknowledges your progress!",
    "Another quest conquered! Your growth is impressive."
  ],
  levelUp: [
    "LEVEL UP! Your hard work has elevated you to new heights!",
    "Congratulations! You've grown stronger. Allocate your stat points wisely.",
    "The System recognizes your growth. You are now Level {level}!"
  ],
  lowEngagement: [
    "Your engagement is low. Consider taking on a challenging quest to reignite your passion!",
    "Motivation dip detected. Try exploring a new technology or working on a creative project.",
    "The System notices you need a spark. How about a learning credit from the marketplace?"
  ],
  lowEnergy: [
    "Your energy reserves are depleted. Time for a wellness reward - your health matters!",
    "Burnout risk detected. Please consider taking a flexible work day or extended break.",
    "The System recommends rest. High performance requires recovery time."
  ],
  optimal: [
    "You're in peak condition! This is the perfect time for a challenge quest.",
    "Optimal state achieved! Your focus and energy are aligned for maximum growth.",
    "Peak performance detected. The System recommends tackling your most ambitious goals now."
  ]
};

// ===== AI AGENT RECOMMENDATIONS =====
function getAIRecommendation(engagement, energy) {
  const recommendations = [];
  const stats = appState.userData.stats;
  const weakestStat = Object.entries(stats).sort((a, b) => a[1] - b[1])[0];
  const strongestStat = Object.entries(stats).sort((a, b) => b[1] - a[1])[0];
  
  // Energy/Engagement warnings
  if (energy < 30) {
    recommendations.push({
      type: 'critical',
      message: '⚠️ Critical Energy Low! Your performance will suffer. Immediate rest recommended.',
      action: 'Take a Wellness Reward from the Marketplace or skip today\'s quests'
    });
  } else if (energy < 50) {
    recommendations.push({
      type: 'warning',
      message: '💤 Energy levels are dropping. Consider taking a break to maintain optimal performance.',
      action: 'Purchase an Extended Break or Flexible Work Day'
    });
  }
  
  if (engagement < 40) {
    recommendations.push({
      type: 'warning',
      message: '📚 Engagement is low. Try learning something new or working on a creative project.',
      action: 'Consider taking on a challenge quest or exploring a new technology'
    });
  }
  
  // Stat-based recommendations
  if (weakestStat[1] < 40) {
    recommendations.push({
      type: 'focus',
      message: `🎯 Focus Area Identified: Your ${weakestStat[0]} stat (${Math.round(weakestStat[1])}/100) needs attention.`,
      action: `Complete quests that boost ${weakestStat[0]} or purchase relevant learning credits`
    });
  }
  
  // Positive reinforcement
  if (engagement > 75 && energy > 70) {
    recommendations.push({
      type: 'success',
      message: '✨ Peak Performance State! You\'re in optimal condition for challenging work.',
      action: 'Perfect time to tackle Challenge Quests or learn advanced concepts'
    });
  }
  
  // Strength recognition
  if (strongestStat[1] > 70) {
    recommendations.push({
      type: 'info',
      message: `🏆 Your ${strongestStat[0]} stat (${Math.round(strongestStat[1])}/100) is excellent! Consider mentoring others in this area.`,
      action: 'Share your expertise through blog posts or open source contributions'
    });
  }
  
  // Level progression
  const xpToNext = getXPForLevel(appState.userData.level + 1) - appState.userData.xp;
  if (xpToNext < 200) {
    recommendations.push({
      type: 'progress',
      message: `🎆 Level Up Imminent! Only ${xpToNext} XP needed to reach Level ${appState.userData.level + 1}.`,
      action: 'Complete 2-3 more quests to level up!'
    });
  }
  
  // Default if no specific recommendations
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'info',
      message: '🚀 You\'re making steady progress! Keep up the consistent effort.',
      action: 'Continue completing daily quests to maintain your momentum'
    });
  }
  
  return recommendations;
}

function generateSmartQuests(userData) {
  const weakStats = Object.entries(userData.stats)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2)
    .map(([stat]) => stat);
  
  const recommendations = [];
  const allQuests = [...questPools.daily, ...questPools.weekly, ...questPools.monthly];
  
  weakStats.forEach(stat => {
    const relevantQuest = allQuests.find(q => 
      q.statsAffected && q.statsAffected.some(s => s.toLowerCase() === stat)
    );
    if (relevantQuest) {
      recommendations.push({
        ...relevantQuest,
        id: `rec_${stat}_${Date.now()}`,
        completed: false,
        reason: `Recommended to improve ${stat.charAt(0).toUpperCase() + stat.slice(1)}`
      });
    }
  });
  
  return recommendations;
}

// ===== RANKING SYSTEM =====
function getRankingInfo(level) {
  if (level >= 1 && level <= 5) return { rank: "F", stage: "F", title: "Novice Developer", color: "#9ca3af" };
  if (level >= 6 && level <= 10) return { rank: "F", stage: "F+", title: "Novice Developer", color: "#9ca3af" };
  if (level >= 11 && level <= 15) return { rank: "E", stage: "E", title: "Apprentice Engineer", color: "#84cc16" };
  if (level >= 16 && level <= 20) return { rank: "E", stage: "E+", title: "Apprentice Engineer", color: "#84cc16" };
  if (level >= 21 && level <= 30) return { rank: "D", stage: "D", title: "Junior Developer", color: "#06b6d4" };
  if (level >= 31 && level <= 40) return { rank: "D", stage: "D+", title: "Junior Developer", color: "#06b6d4" };
  if (level >= 41 && level <= 50) return { rank: "C", stage: "C", title: "Mid-Level Engineer", color: "#8b5cf6" };
  if (level >= 51 && level <= 60) return { rank: "C", stage: "C+", title: "Mid-Level Engineer", color: "#8b5cf6" };
  if (level >= 61 && level <= 70) return { rank: "B", stage: "B", title: "Senior Developer", color: "#f59e0b" };
  if (level >= 71 && level <= 80) return { rank: "B", stage: "B+", title: "Senior Developer", color: "#f59e0b" };
  if (level >= 81 && level <= 85) return { rank: "A", stage: "A", title: "Staff Engineer", color: "#ec4899" };
  if (level >= 86 && level <= 90) return { rank: "A", stage: "AA", title: "Staff Engineer", color: "#ec4899" };
  if (level >= 91 && level <= 95) return { rank: "A", stage: "AAA", title: "Staff Engineer", color: "#ec4899" };
  if (level >= 96 && level <= 100) return { rank: "A", stage: "AAA+", title: "Staff Engineer", color: "#ec4899" };
  if (level >= 101 && level <= 105) return { rank: "S", stage: "S", title: "Principal Engineer", color: "#fbbf24" };
  if (level >= 106 && level <= 110) return { rank: "S", stage: "SS", title: "Principal Engineer", color: "#fbbf24" };
  return { rank: "S", stage: "SSS", title: "Principal Engineer", color: "#fbbf24" };
}

// ===== XP CALCULATION =====
function getXPForLevel(level) {
  return 50 * level * (level + 1);
}

// ===== ENGAGEMENT & ENERGY THRESHOLDS =====
function getEngagementStatus(value) {
  if (value >= 90) return { label: "Peak", color: "#10b981", description: "Maximum focus and drive" };
  if (value >= 75) return { label: "Excellent", color: "#3b82f6", description: "High engagement" };
  if (value >= 60) return { label: "Good", color: "#8b5cf6", description: "Solid motivation" };
  if (value >= 40) return { label: "Moderate", color: "#f59e0b", description: "Average engagement" };
  if (value >= 20) return { label: "Low", color: "#f97316", description: "Struggling motivation" };
  return { label: "Critical", color: "#ef4444", description: "Disengagement risk" };
}

function getEnergyStatus(value) {
  if (value >= 80) return { label: "Fresh", color: "#10b981", description: "Fully energized" };
  if (value >= 60) return { label: "Active", color: "#3b82f6", description: "Good energy levels" };
  if (value >= 40) return { label: "Tired", color: "#f59e0b", description: "Moderate fatigue" };
  if (value >= 20) return { label: "Exhausted", color: "#f97316", description: "High fatigue - rest recommended" };
  return { label: "Burnout Risk", color: "#ef4444", description: "Critical - immediate rest needed" };
}

function getPerformanceMultiplier(engagement, energy) {
  if (engagement > 75 && energy < 40) return { multiplier: 1.5, message: "Optimal Performance! 1.5x XP bonus" };
  if (engagement < 40 && energy > 60) return { multiplier: 0.75, message: "Performance penalty -25% XP. Consider taking a break." };
  return { multiplier: 1.0, message: "" };
}

// ===== MATHEMATICAL UTILITY FUNCTIONS =====

// Sigmoid function for smooth saturation
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

// Hyperbolic tangent for symmetric saturation
function tanh(x) {
  const e2x = Math.exp(2 * x);
  return (e2x - 1) / (e2x + 1);
}

// Exponential decay for time-based weighting
function exponentialDecay(t, lambda = 0.05) {
  return Math.exp(-lambda * t);
}

// Logarithmic growth with diminishing returns
function logGrowth(x, base = 10) {
  return Math.log(1 + x) / Math.log(base);
}

// Geometric mean for balanced averaging
function geometricMean(values) {
  if (values.length === 0) return 0;
  const product = values.reduce((acc, val) => acc * Math.max(0.01, val), 1);
  return Math.pow(product, 1 / values.length);
}

// Normalize value to 0-1 range
function normalize(value, min, max) {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

// Shannon entropy for diversity measurement
function shannonEntropy(distribution) {
  const total = distribution.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  
  return -distribution.reduce((entropy, count) => {
    if (count === 0) return entropy;
    const p = count / total;
    return entropy + p * Math.log2(p);
  }, 0);
}

// Confidence score based on data quality
function calculateConfidence(dataPoints, recencyDays, diversitySources) {
  const pointsFactor = Math.min(1.0, dataPoints / 30); // Need 30+ points for full confidence
  const recencyFactor = Math.exp(-recencyDays / 180); // 6 months = 180 days
  const diversityFactor = Math.min(1.0, diversitySources / 3); // 3 sources ideal
  
  return pointsFactor * recencyFactor * diversityFactor;
}

// ===== REAL STAT CALCULATION ALGORITHMS =====
function calculateProductivity(data) {
  const timeScore = Math.min((data.hoursPerWeek || 10) / 40, 1);
  const projectScore = Math.min((data.projectsCompleted || 0) / 20, 1);
  const deploymentScore = data.deploymentFreq === 'continuous' ? 1 : data.deploymentFreq === 'frequent' ? 0.9 : data.deploymentFreq === 'regular' ? 0.7 : data.deploymentFreq === 'few' ? 0.4 : 0.2;
  const efficiencyScore = (data.taskCompletionRate || 0.5);
  return Math.round(100 * (timeScore * 0.25 + projectScore * 0.3 + deploymentScore * 0.25 + efficiencyScore * 0.2));
}

function calculateProductivityAdvanced(assessmentData) {
  // Extract relevant data with defaults
  const yearsExp = assessmentData.yearsExperience || 0;
  const projectCount = assessmentData.projectsCompleted || 0;
  const completedProjects = assessmentData.projectsCompleted || 0;
  const deployedProjects = assessmentData.liveProjects || 0;
  const hoursPerWeek = assessmentData.hoursPerWeek || 20;
  
  // Component 1: Commit Regularity (with exponential moving average)
  const targetCommitsPerWeek = 3;
  const estimatedCommitsPerWeek = Math.min(20, yearsExp * 2 + projectCount * 0.5);
  const C_r = Math.min(1.0, (0.7 * estimatedCommitsPerWeek + 0.3 * targetCommitsPerWeek) / (targetCommitsPerWeek * 2));
  
  // Component 2: Task Completion Rate (with quality weighting)
  const T_c = projectCount > 0 ? completedProjects / projectCount : 0;
  const onTimeRatio = 0.7; // Estimated from experience
  const T_c_adjusted = T_c * (1 + 0.2 * onTimeRatio);
  
  // Component 3: Deployment Frequency (logarithmic scaling)
  const deploymentsPerMonth = deployedProjects / Math.max(1, yearsExp * 12);
  const D_f = logGrowth(deploymentsPerMonth, 21); // Normalized to max 21/month
  const deploymentSuccessRate = 0.85; // Estimated
  const D_f_final = D_f * (0.5 + 0.5 * deploymentSuccessRate);
  
  // Component 4: Sprint Velocity (normalized with intensity)
  const intensityMultiplier = hoursPerWeek / 40;
  const S_v = tanh((intensityMultiplier - 0.5) / 0.5) * 0.5 + 0.5;
  
  // Component 5: Quality Metrics
  const technicalDebtRatio = Math.max(0, Math.min(0.5, 0.2 - yearsExp * 0.02));
  const codeCoverage = Math.min(1.0, 0.3 + yearsExp * 0.05 + projectCount * 0.02);
  const bugDensity = Math.max(0, 1 - (5 - yearsExp) / 20);
  const Q_m = (1 - technicalDebtRatio) * codeCoverage * bugDensity;
  
  // Weighted combination
  const weights = [0.25, 0.20, 0.25, 0.20, 0.10];
  const components = [C_r, T_c_adjusted, D_f_final, S_v, Q_m];
  const weightedSum = components.reduce((sum, comp, i) => sum + weights[i] * comp, 0);
  
  // Apply tanh for smooth saturation
  const baseScore = 100 * tanh(2 * weightedSum); // Scale factor 2 for proper range
  
  // Confidence adjustment
  const confidence = calculateConfidence(projectCount + yearsExp * 10, 0, 2);
  const finalScore = baseScore * (0.7 + 0.3 * confidence);
  
  return Math.round(Math.max(1, Math.min(100, finalScore)));
}

function calculateCreativity(data) {
  const uniqueProjects = Math.min((data.uniqueProjects || 0) / 10, 1);
  const newTechTried = Math.min((data.newTechTried || 0) / 10, 1);
  const innovativeSolutions = Math.min((data.innovativeSolutions || 0) / 5, 1);
  const refactoring = data.refactoringProjects ? Math.min(data.refactoringProjects / data.projectsCompleted, 0.5) : 0;
  const contributions = Math.min(((data.blogPosts || 0) + (data.openSourceContribs || 0)) / 10, 1);
  return Math.round(100 * (uniqueProjects * 0.3 + newTechTried * 0.25 + innovativeSolutions * 0.25 + refactoring * 0.1 + contributions * 0.1));
}

function calculateCreativityAdvanced(assessmentData) {
  const projectCount = assessmentData.projectsCompleted || 0;
  const uniqueProjects = assessmentData.uniqueProjects || Math.floor(projectCount * 0.3);
  const newTechCount = assessmentData.newTechTried || 0;
  const refactoringProjects = Math.floor(projectCount * 0.2);
  const blogsWritten = 0;
  const openSourceContributions = 0;
  
  // Component 1: Originality Score (code similarity analysis)
  const novelArchitectureCount = uniqueProjects;
  const O_s = Math.min(1.0, (uniqueProjects / Math.max(1, projectCount)) * (1 + 0.3 * novelArchitectureCount / Math.max(1, projectCount)));
  
  // Component 2: Experimentation Rate (time-weighted)
  const adoptionScore = newTechCount * 0.7; // Average adoption weight
  const E_x = 1 - Math.exp(-0.5 * adoptionScore / 10); // Diminishing returns
  
  // Component 3: Refactoring Innovation
  const complexityReduction = refactoringProjects / Math.max(1, projectCount);
  const maintainabilityImprovement = Math.min(1.0, 0.2 + complexityReduction * 0.8);
  const R_f = 0.6 * complexityReduction + 0.4 * maintainabilityImprovement;
  
  // Component 4: Idea Generation
  const ideaOutputRaw = blogsWritten + 2 * openSourceContributions;
  const I_d_base = tanh(0.1 * ideaOutputRaw);
  const engagementScore = 1.2; // Estimated
  const I_d = I_d_base * Math.min(2.0, engagementScore);
  
  // Component 5: Design Vision
  const architecturalDecisions = Math.floor(projectCount * 0.4);
  const impactScore = Math.min(3.0, 0.5 + projectCount * 0.1);
  const D_v = Math.min(1.0, (architecturalDecisions * impactScore) / Math.max(1, projectCount * 2));
  
  // Weighted combination
  const weights = [0.30, 0.25, 0.20, 0.15, 0.10];
  const components = [O_s, E_x, R_f, I_d, D_v];
  const innovationScore = components.reduce((sum, comp, i) => sum + weights[i] * comp, 0);
  
  // S-curve transformation
  const k = 2.0;
  const baseScore = 100 * (1 - Math.exp(-k * innovationScore));
  
  // Confidence adjustment
  const confidence = calculateConfidence(projectCount, 0, 2);
  const finalScore = baseScore * (0.7 + 0.3 * confidence);
  
  return Math.round(Math.max(1, Math.min(100, finalScore)));
}

function calculateKnowledge(data) {
  const courseCompletion = data.completedCourses ? data.completedCourses / Math.max(data.startedCourses || 1, 1) : 0.3;
  const skillDiversity = calculateSkillDiversity(data.skills || {});
  const docsContribution = Math.min((data.documentationWritten || 0) / 20, 1);
  const learningHours = Math.min((data.weeklyLearningHours || 5) / 10, 1);
  return Math.round(100 * (courseCompletion * 0.25 + skillDiversity * 0.35 + docsContribution * 0.15 + learningHours * 0.25));
}

function calculateKnowledgeAdvanced(assessmentData) {
  const completedCourses = assessmentData.completedCourses || 0;
  const startedCourses = assessmentData.startedCourses || Math.max(completedCourses, 1);
  const techStack = [];
  const docsWritten = 0;
  const learningHours = assessmentData.weeklyLearningHours || 5;
  
  // Build tech stack from skills
  if (assessmentData.skills) {
    Object.entries(assessmentData.skills).forEach(([category, skills]) => {
      skills.forEach(skill => {
        techStack.push({ name: skill.name, proficiency: getLevelValue(skill.level) * 20, category });
      });
    });
  }
  
  // Component 1: Course Completion (with retention factor)
  const completionRate = completedCourses / startedCourses;
  const retentionScore = 0.8; // Recent completion assumed
  const difficultyMultiplier = 1.2; // Average difficulty
  const C_c = completionRate * retentionScore * difficultyMultiplier;
  
  // Component 2: Tech Stack Diversity (Shannon entropy)
  const categoryScores = {
    frontend: 0, backend: 0, database: 0, devops: 0, aiml: 0
  };
  
  techStack.forEach(skill => {
    const proficiency = skill.proficiency || 50;
    const category = skill.category || 'frontend';
    if (categoryScores.hasOwnProperty(category)) {
      categoryScores[category] += proficiency;
    }
  });
  
  const distribution = Object.values(categoryScores);
  const entropy = shannonEntropy(distribution);
  const maxEntropy = Math.log2(Object.keys(categoryScores).length);
  const diversityScore = maxEntropy > 0 ? entropy / maxEntropy : 0;
  
  const avgMastery = techStack.length > 0 
    ? techStack.reduce((sum, skill) => sum + (skill.proficiency || 50), 0) / techStack.length / 100
    : 0.3;
  
  const alpha = 0.6; // Favor diversity
  const T_s = alpha * diversityScore + (1 - alpha) * avgMastery;
  
  // Component 3: Documentation Contributions (quality-weighted)
  const docQuality = 0.7; // Estimated
  const usefulness = 1.2; // Above average
  const maintenance = 0.9; // Recently updated
  const D_c = Math.min(1.0, (docsWritten / 20) * docQuality * usefulness * maintenance);
  
  // Component 4: Learning Hours (with effectiveness)
  const targetHours = 10;
  const practiceRatio = 0.6;
  const teachingRatio = 0.2;
  const effectiveness = 1 + practiceRatio * 0.5 + teachingRatio * 0.3;
  const R_l = Math.min(1.0, (learningHours / targetHours) * effectiveness);
  
  // Calculate breadth and depth
  const breadth = Math.min(1.0, techStack.length / 30); // 30 technologies for full breadth
  const depth = avgMastery;
  
  // Geometric mean of breadth and depth
  const baseScore = 100 * Math.sqrt(breadth * depth);
  
  // Cross-domain synergy bonus
  const domainCount = Object.values(categoryScores).filter(score => score > 0).length;
  const synergyBonus = domainCount >= 3 ? Math.pow(avgMastery, 1/3) : 0;
  const finalScore = baseScore * (1 + 0.2 * synergyBonus);
  
  // Confidence adjustment
  const confidence = calculateConfidence(completedCourses + techStack.length, 0, 3);
  const adjustedScore = finalScore * (0.7 + 0.3 * confidence);
  
  return Math.round(Math.max(1, Math.min(100, adjustedScore)));
}

function calculateExperience(data) {
  const projectsDeployed = data.liveProjects ? data.liveProjects / Math.max(data.projectsCompleted || 1, 1) : 0.3;
  const workDuration = Math.min((data.yearsExperience || 0) / 10, 1);
  const collaboration = data.teamProjects ? Math.min((data.teamProjects / Math.max(data.projectsCompleted || 1, 1)) * 1.2, 1) : 0.5;
  const userImpact = assessUserImpact(data.userReach || 0);
  return Math.round(100 * (projectsDeployed * 0.25 + workDuration * 0.35 + collaboration * 0.2 + userImpact * 0.2));
}

function calculateExperienceAdvanced(assessmentData) {
  const yearsExp = assessmentData.yearsExperience || 0;
  const projectCount = assessmentData.projectsCompleted || 0;
  const deployedProjects = assessmentData.liveProjects || 0;
  const hoursPerWeek = assessmentData.hoursPerWeek || 20;
  const userReach = assessmentData.userReach || 0;
  const teamSize = assessmentData.teamProjects || 1;
  
  // Component 1: Projects Deployed (impact-weighted)
  const avgUsersPerProject = userReach / Math.max(1, deployedProjects);
  const projectScale = logGrowth(avgUsersPerProject, 1000001);
  const longevity = 0.7; // Estimated running projects
  const complexity = Math.min(1.0, 0.3 + projectCount * 0.05);
  const P_d = projectScale * longevity * complexity;
  
  // Component 2: Work Duration (experience curve)
  const growthRate = 0.15;
  const W_d_base = 1 - Math.exp(-growthRate * yearsExp);
  const intensityMultiplier = Math.min(1.5, hoursPerWeek / 40);
  const W_d = W_d_base * intensityMultiplier;
  
  // Component 3: Collaboration Metric (network effect)
  const communicationFreq = Math.min(1.0, teamSize / 10);
  const codeReviewParticipation = 0.6; // Estimated
  const C_m_base = teamSize * communicationFreq * codeReviewParticipation / 5;
  
  const ledProjects = Math.floor(projectCount * 0.2);
  const leadershipScore = ledProjects > 0 ? Math.log10(1 + ledProjects * teamSize) : 0;
  const C_m = C_m_base * (1 + 0.3 * leadershipScore);
  
  // Component 4: User Impact (logarithmic scale)
  const U_i_base = logGrowth(userReach, 10000001);
  const retentionFactor = 0.7; // Estimated
  const U_i = U_i_base * (0.5 + 0.5 * retentionFactor);
  
  // Quality factor (geometric mean)
  const qualityFactor = geometricMean([P_d, W_d, Math.min(1.0, C_m), U_i]);
  
  // Experience formula with growth curve
  const time = yearsExp;
  const baseScore = 100 * (1 - Math.exp(-growthRate * time)) * qualityFactor;
  
  // Confidence adjustment
  const confidence = calculateConfidence(deployedProjects + yearsExp * 10, 0, 2);
  const finalScore = baseScore * (0.7 + 0.3 * confidence);
  
  return Math.round(Math.max(1, Math.min(100, finalScore)));
}

function calculateIntelligence(data) {
  const debugSpeed = data.debugSpeed === 'veryfast' ? 1 : data.debugSpeed === 'fast' ? 0.8 : data.debugSpeed === 'average' ? 0.5 : 0.2;
  const optimization = Math.min((data.optimizationsMade || 0) / 10, 1);
  const algoSkill = data.algorithmSkill === 'expert' ? 1 : data.algorithmSkill === 'advanced' ? 0.9 : data.algorithmSkill === 'intermediate' ? 0.6 : data.algorithmSkill === 'basic' ? 0.3 : 0;
  const learningSpeed = Math.min((data.newSkillsPerYear || 2) / 6, 1);
  return Math.round(100 * (debugSpeed * 0.25 + optimization * 0.25 + algoSkill * 0.3 + learningSpeed * 0.2));
}

function calculateIntelligenceAdvanced(assessmentData) {
  const yearsExp = assessmentData.yearsExperience || 0;
  const algorithmSkill = assessmentData.algorithmSkill || 'basic';
  const debugSpeed = assessmentData.debugSpeed || 'average';
  const optimizationsMade = Math.floor(assessmentData.projectsCompleted * 0.3) || 0;
  const newSkillsPerYear = assessmentData.newSkillsPerYear || assessmentData.newTechTried || 2;
  
  // Component 1: Debugging Efficiency (exponential improvement)
  const debugScores = { slow: 0.2, average: 0.5, fast: 0.8, veryfast: 1.0 };
  const D_e_base = debugScores[debugSpeed] || 0.5;
  const patternRecognitionBonus = Math.min(1.0, yearsExp * 0.1);
  const D_e = Math.min(1.0, D_e_base * (1 + patternRecognitionBonus));
  
  // Component 2: Code Optimization (multi-dimensional)
  const timeImprovement = Math.min(2.0, optimizationsMade * 0.2);
  const spaceImprovement = timeImprovement * 0.8; // Correlated
  const maintainabilityImprovement = timeImprovement * 0.6;
  const C_o_raw = geometricMean([timeImprovement, spaceImprovement, maintainabilityImprovement]);
  const C_o = tanh(0.2 * C_o_raw);
  
  // Component 3: Problem-Solving Speed
  const algoScores = { none: 0, basic: 0.3, intermediate: 0.6, advanced: 0.9, expert: 1.0 };
  const P_s_base = algoScores[algorithmSkill] || 0.3;
  const novelSolutionBonus = 0.2; // Estimated
  const P_s = P_s_base * (1 + novelSolutionBonus);
  
  // Component 4: Learning Curve (rate of skill acquisition)
  const k = newSkillsPerYear / 6; // Learning rate constant (6 skills/year = 1.0)
  const L = 1.0; // Asymptotic proficiency
  const L_c = Math.min(1.0, k * L / 4);
  
  // Learning rate and problem-solving efficiency
  const learningRate = L_c;
  const problemSolvingEfficiency = (D_e + C_o + P_s) / 3;
  
  // Final formula
  const baseScore = 100 * tanh(learningRate + problemSolvingEfficiency);
  
  // Confidence adjustment
  const confidence = calculateConfidence(optimizationsMade + yearsExp * 5, 0, 2);
  const finalScore = baseScore * (0.7 + 0.3 * confidence);
  
  return Math.round(Math.max(1, Math.min(100, finalScore)));
}

function calculateResilience(data) {
  const recoveryTime = data.recoveryTime === 'hours' ? 1 : data.recoveryTime === 'oneday' ? 0.8 : data.recoveryTime === 'fewdays' ? 0.5 : data.recoveryTime === 'week' ? 0.3 : 0.1;
  const consistency = Math.min((data.streakDays || 0) / 90, 1);
  const stressHandling = (data.stressHandling || 3) / 5;
  const persistence = data.completedChallenges ? data.completedChallenges / Math.max(data.attemptedChallenges || 1, 1) : 0.5;
  const selfCare = Math.min(((data.breaksPerWeek || 2) / 10 + (data.restDaysPerMonth || 2) / 4) / 2, 1);
  return Math.round(100 * (recoveryTime * 0.2 + consistency * 0.2 + stressHandling * 0.2 + persistence * 0.2 + selfCare * 0.2));
}

function calculateResilienceAdvanced(assessmentData) {
  const streakDays = assessmentData.streakDays || 0;
  const stressHandling = assessmentData.stressHandling || 3; // 1-5 scale
  const recoverySpeed = assessmentData.recoveryTime || 'oneday';
  const persistenceRatio = 0.7; // Estimated completed/attempted under pressure
  const restDaysPerMonth = 4;
  
  // Component 1: Recovery Time (exponential decay)
  const recoveryTimes = { hours: 12, oneday: 24, fewdays: 72, week: 168, weeks: 336 };
  const actualRecovery = recoveryTimes[recoverySpeed] || 24;
  const baselineRecovery = 48;
  const R_t = Math.exp(-actualRecovery / baselineRecovery);
  
  // Component 2: Resilience Score (stress adaptation)
  const performanceUnderStress = stressHandling / 5;
  const stressExposureCount = Math.floor(streakDays / 30);
  const adaptationRate = 1 - Math.exp(-0.1 * stressExposureCount);
  const R_s = performanceUnderStress * (0.5 + 0.5 * adaptationRate);
  
  // Component 3: Emotional Regulation (sentiment analysis)
  const positiveSentimentRatio = 0.6 + stressHandling * 0.08; // Higher stress handling = better sentiment
  const emotionalStability = 0.7 + stressHandling * 0.05;
  const E_r_base = (positiveSentimentRatio + emotionalStability) / 2;
  const improvementRate = 0.1;
  const E_r = E_r_base * (1 + improvementRate);
  
  // Component 4: Persistence Metric (completion under adversity)
  const retryFactor = 1.5; // Average attempts before completion
  const gritBonus = Math.min(0.5, 0.1 * retryFactor);
  const P_m = persistenceRatio * (1 + gritBonus);
  
  // Component 5: Self-Care (sustainable work pattern)
  const targetHours = 40;
  const actualHours = assessmentData.hoursPerWeek || 20;
  const workLifeBalance = 1 - Math.abs(actualHours / targetHours - 1);
  const recoveryActivities = Math.min(1.0, (restDaysPerMonth + 2) / 6); // exercise, rest, hobbies
  const consecutiveWorkDays = Math.floor(streakDays / 7);
  const burnoutPrevention = Math.max(0, 1 - Math.max(0, (consecutiveWorkDays - 6) / 14));
  const S_c = (workLifeBalance + recoveryActivities + burnoutPrevention) / 3;
  
  // Geometric mean of all components
  const components = [R_t, R_s, E_r, P_m, S_c];
  const baseScore = 100 * geometricMean(components);
  
  // Consistency bonus
  const streakFactor = Math.min(1.0, streakDays / 90);
  const consistencyBonus = 1 + 0.3 * streakFactor;
  const finalScore = baseScore * consistencyBonus;
  
  // Confidence adjustment
  const confidence = calculateConfidence(streakDays / 7, 0, 2);
  const adjustedScore = finalScore * (0.7 + 0.3 * confidence);
  
  return Math.round(Math.max(1, Math.min(100, adjustedScore)));
}

function calculateSkillDiversity(skills) {
  const domains = ['frontend', 'backend', 'database', 'devops', 'testing', 'aiml', 'nlp', 'cv'];
  let masteredCount = 0;
  domains.forEach(domain => {
    if (skills[domain] && skills[domain].length > 0) {
      const avgLevel = skills[domain].reduce((sum, s) => sum + (getLevelValue(s.level) || 0), 0) / skills[domain].length;
      if (avgLevel >= 2) masteredCount++; // At least basic proficiency
    }
  });
  return Math.min(masteredCount / 6, 1);
}

function getLevelValue(level) {
  const mapping = { 'none': 0, 'learning': 1, 'basic': 2, 'intermediate': 3, 'advanced': 4, 'expert': 5 };
  return mapping[level] || 0;
}

function assessUserImpact(users) {
  if (users === 0) return 0;
  if (users < 100) return 0.2;
  if (users < 1000) return 0.4;
  if (users < 10000) return 0.7;
  return 1.0;
}

// ===== CROSS-STAT SYNERGIES =====
function applyStatSynergies(stats) {
  // Intelligence × Knowledge → Learning Boost
  const learningBoost = 1 + 0.3 * (stats.intelligence / 100) * (stats.knowledge / 100);
  
  // Productivity × Resilience → Consistency Boost
  const consistencyBoost = 1 + 0.5 * Math.sqrt(stats.productivity / 100) * (stats.resilience / 100);
  
  // Creativity × Experience → Innovation Multiplier
  const innovationMultiplier = 1 + 0.4 * (stats.creativity / 100) * (stats.experience / 100);
  
  return {
    learningBoost,
    consistencyBoost,
    innovationMultiplier,
    sRankUnlocked: innovationMultiplier > 1.2
  };
}

// ===== STAT CALCULATION FROM ASSESSMENT (6 STATS) =====
function calculateStats(data) {
  return {
    productivity: calculateProductivity(data),
    creativity: calculateCreativity(data),
    knowledge: calculateKnowledge(data),
    experience: calculateExperience(data),
    intelligence: calculateIntelligence(data),
    resilience: calculateResilience(data)
  };
}

function calculateInitialStats(assessmentData) {
  console.log('Calculating stats with advanced algorithms...');
  
  // Calculate each stat using advanced formulas
  const stats = {
    productivity: calculateProductivityAdvanced(assessmentData),
    creativity: calculateCreativityAdvanced(assessmentData),
    knowledge: calculateKnowledgeAdvanced(assessmentData),
    experience: calculateExperienceAdvanced(assessmentData),
    intelligence: calculateIntelligenceAdvanced(assessmentData),
    resilience: calculateResilienceAdvanced(assessmentData)
  };
  
  // Calculate synergies
  const synergies = applyStatSynergies(stats);
  
  // Calculate average for initial level
  const avgStat = Object.values(stats).reduce((a, b) => a + b) / 6;
  
  // Level calculation with polynomial growth
  const initialLevel = Math.max(1, Math.min(50, Math.round(avgStat / 2)));
  
  // Rank and title
  const rankInfo = getRankingInfo(initialLevel);
  
  // Initial engagement and energy
  const engagement = 50 + Math.round(avgStat * 0.3);
  const energy = 70 + Math.round(stats.resilience * 0.3);
  
  console.log('Advanced calculations complete:', stats);
  console.log('Synergies:', synergies);
  console.log('Initial level:', initialLevel, 'Rank:', rankInfo.stage);
  
  return {
    stats,
    level: initialLevel,
    rank: rankInfo.stage,
    title: rankInfo.title,
    engagement: Math.min(100, engagement),
    energy: Math.min(100, energy),
    gold: 100,
    synergies
  };
}

// ===== QUEST GENERATION =====
function generateDailyQuests(userData) {
  const quests = [];
  const pool = [...questPools.daily];
  const numQuests = 2 + Math.floor(Math.random() * 3); // 2-4 quests
  for (let i = 0; i < numQuests && pool.length > 0; i++) {
    const index = Math.floor(Math.random() * pool.length);
    const quest = { ...pool[index], id: `daily_${Date.now()}_${i}`, completed: false };
    quests.push(quest);
    pool.splice(index, 1);
  }
  return quests;
}

function generateWeeklyQuests(userData) {
  const quests = [];
  const pool = [...questPools.weekly];
  const numQuests = 2;
  for (let i = 0; i < numQuests && pool.length > 0; i++) {
    const index = Math.floor(Math.random() * pool.length);
    const quest = { ...pool[index], id: `weekly_${Date.now()}_${i}`, completed: false };
    quests.push(quest);
    pool.splice(index, 1);
  }
  return quests;
}

function generateMonthlyQuests(userData) {
  const quests = [];
  const pool = [...questPools.monthly];
  const numQuests = 1;
  for (let i = 0; i < numQuests && pool.length > 0; i++) {
    const index = Math.floor(Math.random() * pool.length);
    const quest = { ...pool[index], id: `monthly_${Date.now()}_${i}`, completed: false };
    quests.push(quest);
    pool.splice(index, 1);
  }
  return quests;
}

function generateChallengeQuests(userData) {
  if (userData.level < 40) return []; // Unlock at level 40+
  const quests = [];
  const pool = [...questPools.challenge];
  const numQuests = 1;
  for (let i = 0; i < numQuests && pool.length > 0; i++) {
    const index = Math.floor(Math.random() * pool.length);
    const quest = { ...pool[index], id: `challenge_${Date.now()}_${i}`, completed: false };
    quests.push(quest);
    pool.splice(index, 1);
  }
  return quests;
}

// ===== RENDERING FUNCTIONS =====
function render() {
  const app = document.getElementById('app');
  
  switch (appState.currentView) {
    case 'landing':
      app.innerHTML = renderLanding();
      attachLandingListeners();
      break;
    case 'assessment':
      app.innerHTML = renderAssessment();
      attachAssessmentListeners();
      break;
    case 'loading':
      app.innerHTML = renderLoading();
      setTimeout(() => {
        appState.currentView = 'character-creation';
        render();
      }, 2000);
      break;
    case 'character-creation':
      app.innerHTML = renderCharacterCreation();
      attachCharacterListeners();
      break;
    case 'dashboard':
      app.innerHTML = renderDashboard();
      attachDashboardListeners();
      break;
    case 'quests':
      app.innerHTML = renderQuests();
      attachQuestsListeners();
      break;
    case 'skill-tree':
      app.innerHTML = renderSkillTree();
      attachSkillTreeListeners();
      break;
    case 'progress':
      app.innerHTML = renderProgress();
      attachProgressListeners();
      setTimeout(renderCharts, 100);
      break;
    case 'skills-arsenal':
      app.innerHTML = renderSkillsArsenal();
      attachSkillsArsenalListeners();
      break;
    case 'marketplace':
      app.innerHTML = renderMarketplace();
      attachMarketplaceListeners();
      break;
    case 'settings':
      app.innerHTML = renderSettings();
      attachSettingsListeners();
      break;
  }
}

function renderLanding() {
  return `
    <div class="system-init-page">
      <div class="system-header">
        <h1 class="glitch-text">DEVELOPER GROWTH SYSTEM v3.0</h1>
        <div class="system-status">
          <span class="status-indicator pulse"></span>
          <span>SYSTEM ONLINE | AI MENTOR ACTIVE | QUEST ENGINE READY</span>
        </div>
      </div>
      
      <div class="init-console">
        <pre class="console-output">> Initializing Solo Leveling Developer Growth System v3.0...
> Loading AI Mentor Engine... [OK]
> Skill Tree Database... [CONNECTED]
> Quest Generation System... [ACTIVE]
> 6-Stat Calculation Algorithms... [READY]
> Gamification Layer... [ENABLED]
> Growth Marketplace... [ONLINE]

> System Status: READY FOR ASSESSMENT
> Next Step: Complete 8-Step Comprehensive Skill Assessment

WELCOME, DEVELOPER. YOUR JOURNEY TO MASTERY BEGINS NOW.</pre>
      </div>
      
      <div class="init-actions">
        <button class="btn-primary-large" id="begin-journey">
          <span class="btn-icon">▶</span>
          BEGIN SYSTEM INITIALIZATION
        </button>
        <p class="init-subtitle">Complete comprehensive skill assessment to calculate your starting stats</p>
      </div>
      
      <div class="system-features">
          <div class="feature-card">
            <h3>⚡ 6-Stats System</h3>
            <p>Productivity, Creativity, Knowledge, Experience, Intelligence, Resilience</p>
          </div>
          <div class="feature-card">
            <h3>🤖 AI-Powered Mentor</h3>
            <p>Personalized quest generation and growth recommendations</p>
          </div>
          <div class="feature-card">
            <h3>🌳 Skill Tree</h3>
            <p>Visual progression through Web Dev and AI/ML paths</p>
          </div>
          <div class="feature-card">
            <h3>🏪 Growth Marketplace</h3>
            <p>Spend earned gold on learning credits and wellness rewards</p>
          </div>
          <div class="feature-card">
            <h3>📊 Advanced Analytics</h3>
            <p>Radar charts, XP tracking, and engagement metrics</p>
          </div>
          <div class="feature-card">
            <h3>🏆 Achievements & Ranks</h3>
            <p>Progress from F-rank to S-rank through 100+ levels</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderAssessment() {
  const progress = (appState.assessmentStep / appState.totalAssessmentSteps) * 100;
  
  return `
    <div class="assessment">
      <div class="assessment-container">
        <h2>Skill Assessment</h2>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <p style="text-align: center; color: var(--sl-text-secondary); margin-bottom: 24px;">Step ${appState.assessmentStep} of ${appState.totalAssessmentSteps}</p>
        
        ${renderAssessmentStep(appState.assessmentStep)}
        
        <div class="form-buttons">
          ${appState.assessmentStep > 1 ? '<button class="btn-secondary" id="prev-step">Previous</button>' : '<div></div>'}
          <button class="btn-primary" id="next-step">${appState.assessmentStep === 8 ? 'Calculate My Stats' : 'Next'}</button>
        </div>
      </div>
    </div>
  `;
}

function renderAssessmentStep(step) {
  switch(step) {
    case 1:
      return `
        <div class="form-step active">
          <h3>Step 1: Personal Information</h3>
          <div class="form-group">
            <label>Your Name</label>
            <input type="text" id="user-name" placeholder="Enter your name" value="${appState.assessmentData.name || ''}" />
          </div>
          <div class="form-group">
            <label>Current Status</label>
            <select id="user-status">
              <option value="student" ${appState.assessmentData.status === 'student' ? 'selected' : ''}>Student</option>
              <option value="professional" ${appState.assessmentData.status === 'professional' ? 'selected' : ''}>Working Professional</option>
              <option value="self-taught" ${appState.assessmentData.status === 'self-taught' ? 'selected' : ''}>Self-Taught Learner</option>
              <option value="bootcamp" ${appState.assessmentData.status === 'bootcamp' ? 'selected' : ''}>Bootcamp Graduate</option>
            </select>
          </div>
          <div class="form-group">
            <label>Years of Experience</label>
            <input type="number" id="years-exp" min="0" max="30" value="${appState.assessmentData.yearsExperience || 0}" />
          </div>
          <div class="form-group">
            <label>Career Goal</label>
            <select id="career-goal">
              <option value="web-dev">Web Developer</option>
              <option value="full-stack">Full-Stack Developer</option>
              <option value="ai-ml">AI/ML Engineer</option>
              <option value="data-science">Data Scientist</option>
              <option value="devops">DevOps Engineer</option>
              <option value="mobile">Mobile Developer</option>
            </select>
          </div>
        </div>
      `;
    case 2:
      return `
        <div class="form-step active">
          <h3>Step 2: Frontend Development Skills</h3>
          <p style="margin-bottom: 16px; color: var(--sl-text-secondary);">Rate your experience level (0-5)</p>
          <div class="slider-group">
            ${domainData.frontend.slice(0, 10).map(skill => {
              const skillId = skill.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
              return `
                <div class="slider-item">
                  <label>${skill} <span id="${skillId}-val">0</span></label>
                  <input type="range" min="0" max="5" value="0" id="skill-${skillId}" class="skill-slider" data-skill="${skill}" data-domain="frontend" />
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    case 3:
      return `
        <div class="form-step active">
          <h3>Step 3: Backend Development Skills</h3>
          <p style="margin-bottom: 16px; color: var(--sl-text-secondary);">Rate your experience level (0-5)</p>
          <div class="slider-group">
            ${domainData.backend.slice(0, 10).map(skill => {
              const skillId = skill.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
              return `
                <div class="slider-item">
                  <label>${skill} <span id="${skillId}-val">0</span></label>
                  <input type="range" min="0" max="5" value="0" id="skill-${skillId}" class="skill-slider" data-skill="${skill}" data-domain="backend" />
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    case 4:
      return `
        <div class="form-step active">
          <h3>Step 4: Database & DevOps Skills</h3>
          <p style="margin-bottom: 16px; color: var(--sl-text-secondary);">Rate your experience level (0-5)</p>
          <div class="slider-group">
            ${[...domainData.database.slice(0, 6), ...domainData.devops.slice(0, 6)].map(skill => {
              const skillId = skill.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
              const domain = domainData.database.includes(skill) ? 'database' : 'devops';
              return `
                <div class="slider-item">
                  <label>${skill} <span id="${skillId}-val">0</span></label>
                  <input type="range" min="0" max="5" value="0" id="skill-${skillId}" class="skill-slider" data-skill="${skill}" data-domain="${domain}" />
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    case 5:
      return `
        <div class="form-step active">
          <h3>Step 5: AI/ML Fundamentals</h3>
          <p style="margin-bottom: 16px; color: var(--sl-text-secondary);">Rate your experience level (0-5)</p>
          <div class="slider-group">
            ${[...domainData.aiml, ...domainData.nlp.slice(0, 3)].map(skill => {
              const skillId = skill.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
              return `
                <div class="slider-item">
                  <label>${skill} <span id="${skillId}-val">0</span></label>
                  <input type="range" min="0" max="5" value="0" id="skill-${skillId}" class="skill-slider" data-skill="${skill}" data-domain="aiml" />
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    case 6:
      return `
        <div class="form-step active">
          <h3>Step 6: AI/ML Advanced Skills</h3>
          <p style="margin-bottom: 16px; color: var(--sl-text-secondary);">Rate your experience level (0-5)</p>
          <div class="slider-group">
            ${['TensorFlow', 'PyTorch', 'Keras', 'Deep Learning', 'Neural Networks', 'Transformers', 'GANs', 'Reinforcement Learning', 'LangChain', 'Hugging Face'].map(skill => {
              const skillId = skill.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
              return `
                <div class="slider-item">
                  <label>${skill} <span id="${skillId}-val">0</span></label>
                  <input type="range" min="0" max="5" value="0" id="skill-${skillId}" class="skill-slider" data-skill="${skill}" data-domain="aiml_advanced" />
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    case 7:
      return `
        <div class="form-step active">
          <h3>Step 7: Soft Skills & Work Style</h3>
          <p style="margin-bottom: 16px; color: var(--sl-text-secondary);">Rate your soft skills (1-5)</p>
          <div class="slider-group">
            ${domainData.soft.slice(0, 8).map(skill => {
              const skillId = skill.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
              return `
                <div class="slider-item">
                  <label>${skill} <span id="${skillId}-val">3</span></label>
                  <input type="range" min="1" max="5" value="3" id="skill-${skillId}" class="skill-slider" data-skill="${skill}" data-domain="soft" />
                </div>
              `;
            }).join('')}
          </div>
          <div class="form-group" style="margin-top: 24px;">
            <label>Preferred learning style</label>
            <select id="learning-style">
              <option value="video">Video Tutorials</option>
              <option value="docs">Reading Documentation</option>
              <option value="interactive">Interactive Courses</option>
              <option value="projects">Project-Based Learning</option>
            </select>
          </div>
          <div class="form-group">
            <label>Work environment preference</label>
            <select id="work-env">
              <option value="solo">Solo Work</option>
              <option value="pair">Pair Programming</option>
              <option value="team">Team Collaboration</option>
            </select>
          </div>
        </div>
      `;
    case 8:
      return `
        <div class="form-step active">
          <h3>Step 8: Goals & Preferences</h3>
          <div class="form-group">
            <label>Short-term goals (3 months)</label>
            <textarea id="short-goals" placeholder="What do you want to achieve in the next 3 months?"></textarea>
          </div>
          <div class="form-group">
            <label>Long-term goals (1 year)</label>
            <textarea id="long-goals" placeholder="Where do you see yourself in 1 year?"></textarea>
          </div>
          <div class="form-group">
            <label>Industry interest</label>
            <div class="checkbox-group">
              <label class="checkbox-label"><input type="checkbox" value="web-apps" /> Web Apps</label>
              <label class="checkbox-label"><input type="checkbox" value="data-science" /> Data Science</label>
              <label class="checkbox-label"><input type="checkbox" value="ai-ml" /> AI/ML</label>
              <label class="checkbox-label"><input type="checkbox" value="gaming" /> Gaming</label>
              <label class="checkbox-label"><input type="checkbox" value="finance" /> Finance</label>
              <label class="checkbox-label"><input type="checkbox" value="health" /> Healthcare</label>
            </div>
          </div>
          <div class="form-group">
            <label>Project preferences</label>
            <div class="checkbox-group">
              <label class="checkbox-label"><input type="checkbox" value="personal" /> Personal Projects</label>
              <label class="checkbox-label"><input type="checkbox" value="opensource" /> Open Source</label>
              <label class="checkbox-label"><input type="checkbox" value="freelance" /> Freelance</label>
              <label class="checkbox-label"><input type="checkbox" value="corporate" /> Corporate</label>
            </div>
          </div>
        </div>
      `;
    default:
      return `
        <div class="form-step active">
          <h3>Step 6: Project Experience & Work Style</h3>
          <div class="form-group">
            <label>Total completed projects</label>
            <input type="number" id="project-count" min="0" value="${appState.assessmentData.projectsCompleted || 0}" />
          </div>
          <div class="form-group">
            <label>Live/deployed projects</label>
            <input type="number" id="live-projects" min="0" value="${appState.assessmentData.liveProjects || 0}" />
          </div>
          <div class="form-group">
            <label>Team projects</label>
            <input type="number" id="team-projects" min="0" value="${appState.assessmentData.teamProjects || 0}" />
          </div>
          <div class="form-group">
            <label>Estimated user reach of your projects</label>
            <select id="user-reach">
              <option value="0">0 users</option>
              <option value="50">1-100 users</option>
              <option value="500">100-1,000 users</option>
              <option value="5000">1,000-10,000 users</option>
              <option value="50000">10,000+ users</option>
            </select>
          </div>
        </div>
      `;
    case 7:
      return `
        <div class="form-step active">
          <h3>Step 7: Work Habits & Problem-Solving</h3>
          <div class="form-group">
            <label>Hours available per week for development</label>
            <input type="number" id="hours-per-week" min="1" max="80" value="${appState.assessmentData.hoursPerWeek || 20}" />
          </div>
          <div class="form-group">
            <label>Debugging speed</label>
            <select id="debug-speed">
              <option value="slow">Slow - I struggle with debugging</option>
              <option value="average">Average - I can debug with some effort</option>
              <option value="fast">Fast - I debug efficiently</option>
              <option value="veryfast">Very Fast - I excel at debugging</option>
            </select>
          </div>
          <div class="form-group">
            <label>Algorithm/problem-solving skill</label>
            <select id="algo-skill">
              <option value="none">None - I avoid algorithms</option>
              <option value="basic">Basic - Simple problems only</option>
              <option value="intermediate">Intermediate - Medium difficulty</option>
              <option value="advanced">Advanced - Complex problems</option>
              <option value="expert">Expert - Competition level</option>
            </select>
          </div>
          <div class="form-group">
            <label>New technologies/tools tried per year</label>
            <input type="number" id="new-tech" min="0" max="20" value="${appState.assessmentData.newTechTried || 2}" />
          </div>
        </div>
      `;
    case 8:
      return `
        <div class="form-step active">
          <h3>Step 8: Resilience & Learning</h3>
          <div class="form-group">
            <label>How quickly do you recover from setbacks?</label>
            <select id="recovery-time">
              <option value="hours">Within hours</option>
              <option value="oneday">Within a day</option>
              <option value="fewdays">A few days</option>
              <option value="week">About a week</option>
              <option value="weeks">Several weeks</option>
            </select>
          </div>
          <div class="form-group">
            <label>How do you handle stress? (1-5)</label>
            <input type="range" min="1" max="5" value="3" id="stress-handling" />
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--sl-text-secondary);">
              <span>Poorly</span>
              <span id="stress-val">3</span>
              <span>Excellently</span>
            </div>
          </div>
          <div class="form-group">
            <label>Completed courses or certifications</label>
            <input type="number" id="completed-courses" min="0" value="${appState.assessmentData.completedCourses || 0}" />
          </div>
          <div class="form-group">
            <label>Weekly learning hours (outside work)</label>
            <input type="number" id="learning-hours" min="0" max="40" value="${appState.assessmentData.weeklyLearningHours || 5}" />
          </div>
          <div class="form-group">
            <label>Learning preference</label>
            <select id="learning-pref">
              <option value="video">Video Tutorials</option>
              <option value="docs">Reading Documentation</option>
              <option value="hands-on">Hands-on Coding</option>
              <option value="interactive">Interactive Courses</option>
            </select>
          </div>
        </div>
      `;
  }
}

function renderLoading() {
  return `
    <div class="loading">
      <div class="loading-spinner"></div>
      <h2 class="loading-text">Calculating Your Stats...</h2>
      <p style="color: var(--sl-text-secondary);">The System is analyzing your potential</p>
    </div>
  `;
}

function renderCharacterCreation() {
  const { name, level, xp, stats, engagement, energy, avatar } = appState.userData;
  const xpRequired = getXPForLevel(level + 1);
  const rankInfo = getRankingInfo(level);
  
  return `
    <div class="character-creation">
      <div class="character-card">
        <h2 style="color: var(--sl-accent-gold); font-size: 2rem; margin-bottom: 16px;">✨ CHARACTER CREATED ✨</h2>
        <p style="color: var(--sl-text-secondary); margin-bottom: 24px;">The System has analyzed your skills and calculated your starting stats</p>
        <div class="character-avatar">${avatar}</div>
        <h2>${name}</h2>
        <p class="character-title" style="color: ${rankInfo.color};">Level ${level} | ${rankInfo.stage} ${rankInfo.title}</p>
        
        <div class="stats-container">
          <h3 style="margin-bottom: 16px;">Your Starting Stats</h3>
          ${Object.entries(stats).map(([key, value]) => {
            const icons = {productivity: "⚡", creativity: "💡", knowledge: "📚", experience: "🎯", intelligence: "🧠", resilience: "💪"};
            return `
            <div class="stat-item">
              <div class="stat-label">
                <span>${icons[key]} ${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <span>${Math.round(value)}</span>
              </div>
              <div class="stat-bar">
                <div class="stat-fill" style="width: ${value}%">${Math.round(value)}</div>
              </div>
            </div>
          `}).join('')}
        </div>
        
        <div style="margin: 24px 0;">
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 14px;">Engagement Index</span>
              <span style="font-size: 14px; font-weight: bold;">${engagement}/100</span>
            </div>
            <div class="stat-bar">
              <div class="stat-fill" style="width: ${engagement}%; background: linear-gradient(90deg, #3b82f6, #8b5cf6);"></div>
            </div>
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 14px;">Energy Reserve</span>
              <span style="font-size: 14px; font-weight: bold;">${energy}/100</span>
            </div>
            <div class="stat-bar">
              <div class="stat-fill" style="width: ${energy}%; background: linear-gradient(90deg, #10b981, #3b82f6);"></div>
            </div>
          </div>
        </div>
        
        <div class="xp-display">
          <div class="xp-text">Starting XP: ${xp.toLocaleString()} / ${xpRequired.toLocaleString()}</div>
          <div class="stat-bar">
            <div class="stat-fill" style="width: ${(xp / xpRequired) * 100}%"></div>
          </div>
        </div>
        
        <div style="margin-top: 16px; padding: 16px; background: rgba(59, 130, 246, 0.1); border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.3);">
          <div style="font-size: 14px; color: var(--sl-accent-blue); font-weight: 600; margin-bottom: 8px;">🤖 AI Assessment Complete</div>
          <div style="font-size: 13px; color: var(--sl-text-secondary); line-height: 1.6;">
            Your profile has been created based on your comprehensive skill assessment. Complete daily quests to gain XP, level up, and unlock new features. Your growth journey starts now!
          </div>
        </div>
        
        <button class="btn-primary" id="enter-system" style="margin-top: 24px; width: 100%;">Enter the System →</button>
      </div>
    </div>
  `;
}

function renderDashboard() {
  const { name, level, xp, stats, gold, engagement, energy } = appState.userData;
  const xpRequired = getXPForLevel(level);
  const rankInfo = getRankingInfo(level);
  const engagementStatus = getEngagementStatus(engagement);
  const energyStatus = getEnergyStatus(energy);
  const performance = getPerformanceMultiplier(engagement, energy);
  
  return `
    <div class="dashboard">
      ${renderSidebar()}
      <div class="main-content">
        <div class="content-header">
          <h1>Dashboard</h1>
          <p class="welcome-message">Welcome back, ${name}! Ready to level up?</p>
        </div>
        
        <div class="dashboard-grid">
          <div class="stat-card">
            <h3>Current Level & Rank</h3>
            <div style="text-align: center; margin-bottom: 12px;">
              <div style="font-size: 2rem; font-weight: bold; color: ${rankInfo.color};">Level ${level} | ${rankInfo.stage}</div>
              <div style="color: var(--sl-accent-gold); margin-top: 4px;">${rankInfo.title}</div>
            </div>
            <div class="xp-bar">
              <div class="xp-text">${xp.toLocaleString()} / ${xpRequired.toLocaleString()} XP</div>
              <div class="stat-bar">
                <div class="stat-fill" style="width: ${(xp / xpRequired) * 100}%"></div>
              </div>
            </div>
          </div>
          
          <div class="stat-card">
            <h3>Gold</h3>
            <div class="gold-display" style="justify-content: center;">
              <span style="font-size: 3rem;">💰</span>
              <span style="font-size: 2.5rem; font-weight: bold;">${gold}</span>
            </div>
          </div>
          
          <div class="stat-card">
            <h3>Streak</h3>
            <div class="streak-display" style="justify-content: center;">
              <span class="streak-flame" style="font-size: 3rem;">🔥</span>
              <div>
                <div class="streak-number">${appState.streak.current}</div>
                <div class="streak-text">Day Streak</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="dashboard-grid" style="grid-template-columns: 1fr 1fr;">
          <div class="stat-card">
            <h3>Engagement Index</h3>
            <div style="text-align: center; margin-bottom: 12px;">
              <div style="font-size: 2rem; font-weight: bold; color: ${engagementStatus.color};">${engagement}/100</div>
              <div style="color: ${engagementStatus.color}; font-size: 14px; margin-top: 4px;">[${engagementStatus.label}]</div>
              <div style="color: var(--sl-text-secondary); font-size: 12px; margin-top: 4px;">${engagementStatus.description}</div>
            </div>
            <div class="stat-bar">
              <div class="stat-fill" style="width: ${engagement}%; background: ${engagementStatus.color};"></div>
            </div>
          </div>
          
          <div class="stat-card">
            <h3>Energy Reserve</h3>
            <div style="text-align: center; margin-bottom: 12px;">
              <div style="font-size: 2rem; font-weight: bold; color: ${energyStatus.color};">${energy}/100</div>
              <div style="color: ${energyStatus.color}; font-size: 14px; margin-top: 4px;">[${energyStatus.label}]</div>
              <div style="color: var(--sl-text-secondary); font-size: 12px; margin-top: 4px;">${energyStatus.description}</div>
            </div>
            <div class="stat-bar">
              <div class="stat-fill" style="width: ${energy}%; background: ${energyStatus.color};"></div>
            </div>
          </div>
        </div>
        
        ${performance.message ? `
        <div style="padding: 16px; background: var(--sl-dark-surface); border-radius: 12px; border: 1px solid ${performance.multiplier > 1 ? '#10b981' : '#f97316'}; margin-bottom: 24px;">
          <div style="font-size: 14px; font-weight: 600; color: ${performance.multiplier > 1 ? '#10b981' : '#f97316'};">
            🤖 AI Agent: ${performance.message}
          </div>
        </div>
        ` : ''}
        
        <div class="quest-section" style="margin-bottom: 24px;">
          <div class="section-header">
            <h2>🤖 AI Insights & Recommendations</h2>
          </div>
          <div style="background: var(--sl-dark-surface); padding: 20px; border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.2); margin-bottom: 16px;">
            <div style="font-size: 13px; color: var(--sl-text-secondary); margin-bottom: 12px;">
              📊 The AI Agent continuously monitors your progress, analyzes your stats, and provides personalized recommendations to optimize your growth.
            </div>
          </div>
          ${getAIRecommendation(engagement, energy).map(rec => `
            <div style="padding: 16px; background: var(--sl-dark-bg); border-radius: 8px; border-left: 4px solid ${
              rec.type === 'success' ? '#10b981' : 
              rec.type === 'warning' ? '#f59e0b' : 
              rec.type === 'critical' ? '#ef4444' : '#3b82f6'
            }; margin-bottom: 12px;">
              <div style="font-size: 14px; margin-bottom: 8px;">${rec.message}</div>
              <div style="font-size: 12px; color: var(--sl-text-secondary); font-style: italic;">${rec.action}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="quest-section">
          <div class="section-header">
            <h2>Daily Quests</h2>
            <button class="btn-secondary" id="refresh-quests">🔄 Refresh</button>
          </div>
          <div class="quest-list">
            ${appState.quests.daily.map(quest => renderQuestCard(quest)).join('')}
          </div>
        </div>
        
        <div class="quest-section">
          <div class="section-header">
            <h2>Recent Achievements</h2>
          </div>
          <div class="achievements-grid">
            ${achievementDefinitions.slice(0, 6).map(ach => {
              const earned = appState.achievements.includes(ach.id);
              return `
                <div class="achievement-card ${earned ? '' : 'locked'}">
                  <div class="achievement-icon">${ach.icon}</div>
                  <div class="achievement-title">${ach.title}</div>
                  <div class="achievement-desc">${ach.description}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div style="margin-top: 24px; padding: 20px; background: var(--sl-dark-surface); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.2);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="margin: 0; color: var(--sl-accent-blue);">📊 Your Stats (6 Core Attributes)</h3>
            <button class="btn-secondary" onclick="showCalculationDetails()" style="font-size: 12px; padding: 8px 16px;">View Calculation Details</button>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
            ${Object.entries(stats).map(([key, value]) => {
              const icons = {productivity: "⚡", creativity: "💡", knowledge: "📚", experience: "🎯", intelligence: "🧠", resilience: "💪"};
              const colors = {productivity: "#3b82f6", creativity: "#8b5cf6", knowledge: "#10b981", experience: "#f59e0b", intelligence: "#06b6d4", resilience: "#ec4899"};
              return `
              <div>
                <div class="stat-label">
                  <span>${icons[key]} ${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <span>${Math.round(value)}/100</span>
                </div>
                <div class="stat-bar">
                  <div class="stat-fill" style="width: ${value}%; background: ${colors[key]};"></div>
                </div>
              </div>
            `}).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSidebar() {
  const { name, level, xp, avatar } = appState.userData;
  const xpRequired = getXPForLevel(level);
  const rankInfo = getRankingInfo(level);
  
  return `
    <div class="sidebar">
      <div class="profile-section">
        <div class="profile-avatar">
          ${avatar}
          <div class="level-badge">${level}</div>
        </div>
        <div class="profile-name">${name}</div>
        <div class="profile-title" style="color: ${rankInfo.color};">${rankInfo.stage} ${rankInfo.title}</div>
        <div class="quick-stats">Level ${level} | ${xp.toLocaleString()}/${xpRequired.toLocaleString()} XP</div>
      </div>
      
      <ul class="nav-menu">
        <li class="nav-item">
          <a class="nav-link ${appState.currentView === 'dashboard' ? 'active' : ''}" data-view="dashboard">
            <span>🏠</span> Dashboard
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${appState.currentView === 'quests' ? 'active' : ''}" data-view="quests">
            <span>⚔️</span> Quests
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${appState.currentView === 'skill-tree' ? 'active' : ''}" data-view="skill-tree">
            <span>🌳</span> Skill Tree
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${appState.currentView === 'skills-arsenal' ? 'active' : ''}" data-view="skills-arsenal">
            <span>🎒</span> Skills Arsenal
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${appState.currentView === 'marketplace' ? 'active' : ''}" data-view="marketplace">
            <span>🏪</span> Marketplace
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${appState.currentView === 'progress' ? 'active' : ''}" data-view="progress">
            <span>📊</span> Progress
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${appState.currentView === 'settings' ? 'active' : ''}" data-view="settings">
            <span>⚙️</span> Settings
          </a>
        </li>
      </ul>
    </div>
  `;
}

function renderQuestCard(quest) {
  const statsInfo = quest.statsAffected ? ` | Affects: ${quest.statsAffected.join(', ')}` : '';
  return `
    <div class="quest-card ${quest.completed ? 'completed' : ''}">
      <input type="checkbox" class="quest-checkbox" data-quest-id="${quest.id}" ${quest.completed ? 'checked' : ''} />
      <div class="quest-info">
        <div class="quest-title">${quest.title}</div>
        <div class="quest-description">${quest.description}</div>
        ${statsInfo ? `<div style="font-size: 11px; color: var(--sl-accent-purple); margin-top: 4px;">💪 ${statsInfo.substring(10)}</div>` : ''}
      </div>
      <div class="quest-rewards">
        <span class="rank-badge rank-${quest.rank.toLowerCase()}">${quest.rank}</span>
        <span class="reward-badge">⭐ ${quest.xp} XP</span>
        <span class="reward-badge">💰 ${quest.gold} Gold</span>
      </div>
    </div>
  `;
}

function renderQuests() {
  return `
    <div class="dashboard">
      ${renderSidebar()}
      <div class="main-content">
        <div class="content-header">
          <h1>Active Quests</h1>
          <p class="welcome-message">Complete quests to gain XP and level up!</p>
        </div>
        
        <div class="tabs">
          <button class="tab active" data-tab="daily">Daily Quests</button>
          <button class="tab" data-tab="weekly">Weekly Objectives</button>
          <button class="tab" data-tab="monthly">Monthly Milestones</button>
          <button class="tab" data-tab="challenge">Challenge Quests</button>
        </div>
        
        <div class="tab-content" id="daily-quests">
          <div class="quest-section">
            <div class="quest-list">
              ${appState.quests.daily.map(quest => renderQuestCard(quest)).join('')}
            </div>
          </div>
        </div>
        
        <div class="tab-content" id="weekly-quests" style="display: none;">
          <div class="quest-section">
            <div class="quest-list">
              ${appState.quests.weekly.map(quest => renderQuestCard(quest)).join('')}
            </div>
          </div>
        </div>
        
        <div class="tab-content" id="monthly-quests" style="display: none;">
          <div class="quest-section">
            <div class="quest-list">
              ${appState.quests.monthly.map(quest => renderQuestCard(quest)).join('')}
            </div>
          </div>
        </div>
        
        <div class="tab-content" id="challenge-quests" style="display: none;">
          <div class="quest-section">
            ${appState.userData.level >= 40 ? `
            <div class="quest-list">
              ${appState.quests.challenge.map(quest => renderQuestCard(quest)).join('')}
            </div>
            ` : '<p style="color: var(--sl-text-secondary); text-align: center; padding: 32px;">Challenge Quests unlock at Level 40+. Keep leveling up!</p>'}
          </div>
        </div>
        
        <div class="quest-section" style="margin-top: 32px;">
          <h2>AI Recommended Quests</h2>
          <p style="color: var(--sl-text-secondary); margin-bottom: 16px;">Based on your current skills, the System recommends focusing on these areas:</p>
          <div class="quest-list">
            ${generateRecommendedQuests().map(quest => renderQuestCard(quest)).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateRecommendedQuests() {
  return generateSmartQuests(appState.userData);
}

function renderSkillTree() {
  return `
    <div class="dashboard">
      ${renderSidebar()}
      <div class="main-content">
        <div class="content-header">
          <h1>Skill Tree</h1>
          <p class="welcome-message">Unlock and master skills across different domains</p>
        </div>
        
        <div class="skill-tree-container">
          <div class="skill-path">
            <h2>🌐 Web Development</h2>
            ${renderSkillTier('Beginner', skillTreeData.web_development.beginner)}
            ${renderSkillTier('Intermediate', skillTreeData.web_development.intermediate)}
            ${renderSkillTier('Advanced', skillTreeData.web_development.advanced)}
          </div>
          
          <div class="skill-path">
            <h2>🤖 AI/ML Engineering</h2>
            ${renderSkillTier('Beginner', skillTreeData.ai_ml.beginner)}
            ${renderSkillTier('Intermediate', skillTreeData.ai_ml.intermediate)}
            ${renderSkillTier('Advanced', skillTreeData.ai_ml.advanced)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSkillTier(tier, skills) {
  return `
    <div class="skill-tier">
      <h3>${tier}</h3>
      <div class="skill-nodes">
        ${skills.map(skill => {
          const unlocked = appState.skillTree[skill.name] || (tier === 'Beginner');
          const progress = appState.skillTree[skill.name] || 0;
          return `
            <div class="skill-node ${unlocked ? 'unlocked' : 'locked'}" data-skill="${skill.name}">
              <div class="skill-name">${skill.name}</div>
              <div class="skill-progress">
                <div class="skill-progress-fill" style="width: ${progress}%"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderSkillsArsenal() {
  return `
    <div class="dashboard">
      ${renderSidebar()}
      <div class="main-content">
        <div class="content-header">
          <h1>🎒 Skills Arsenal</h1>
          <p class="welcome-message">Your professional portfolio and acquired skills</p>
        </div>
        
        <div class="tabs">
          <button class="tab active" data-tab="technical">Technical Skills</button>
          <button class="tab" data-tab="soft">Soft Skills</button>
          <button class="tab" data-tab="certs">Certifications</button>
          <button class="tab" data-tab="projects">Projects</button>
        </div>
        
        <div class="tab-content" id="technical-skills">
          <div class="quest-section">
            <div class="inventory-grid">
              ${renderTechnicalSkills()}
            </div>
          </div>
        </div>
        
        <div class="tab-content" id="soft-skills" style="display: none;">
          <div class="quest-section">
            <div class="inventory-grid">
              ${renderSoftSkills()}
            </div>
          </div>
        </div>
        
        <div class="tab-content" id="certs-skills" style="display: none;">
          <div class="quest-section">
            <div class="inventory-grid">
              ${renderCertifications()}
            </div>
          </div>
        </div>
        
        <div class="tab-content" id="projects-skills" style="display: none;">
          <div class="quest-section">
            <div class="inventory-grid">
              ${renderProjects()}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderProgress() {
  const totalXP = appState.completedQuests.reduce((sum, q) => sum + (q.xp || 0), 0);
  const totalQuests = appState.completedQuests.length;
  const { level } = appState.userData;
  
  return `
    <div class="dashboard">
      ${renderSidebar()}
      <div class="main-content">
        <div class="content-header">
          <h1>Progress Reports</h1>
          <p class="welcome-message">Track your growth and analyze your journey</p>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${totalXP}</div>
            <div class="metric-label">Total XP Earned</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${totalQuests}</div>
            <div class="metric-label">Quests Completed</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${level}</div>
            <div class="metric-label">Current Level</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${appState.streak.current}</div>
            <div class="metric-label">Day Streak</div>
          </div>
        </div>
        
        <div class="chart-container" style="border: 2px solid rgba(251, 191, 36, 0.3); position: relative;">
          <h3 style="margin-bottom: 16px; color: var(--sl-accent-gold);">✨ Your Stat Distribution</h3>
          <div style="display: flex; justify-content: center; align-items: center; padding: 20px;">
            <canvas id="stats-radar"></canvas>
          </div>
        </div>
        
        <div class="chart-container">
          <h3 style="margin-bottom: 16px;">XP Growth Over Time</h3>
          <canvas id="xp-chart"></canvas>
        </div>
        
        <div class="ai-insights">
          <h2 style="margin-bottom: 16px; color: var(--sl-accent-blue);">🤖 AI Insights & Analysis</h2>
          ${generateDetailedInsights()}
        </div>
        
        <div class="quest-section" style="margin-top: 32px;">
          <h2>All Achievements</h2>
          <div class="achievements-grid">
            ${achievementDefinitions.map(ach => {
              const earned = appState.achievements.includes(ach.id);
              return `
                <div class="achievement-card ${earned ? '' : 'locked'}">
                  <div class="achievement-icon">${ach.icon}</div>
                  <div class="achievement-title">${ach.title}</div>
                  <div class="achievement-desc">${ach.description}</div>
                  ${earned ? '<div style="color: var(--sl-accent-gold); font-size: 10px; margin-top: 4px;">✓ UNLOCKED</div>' : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSettings() {
  return `
    <div class="dashboard">
      ${renderSidebar()}
      <div class="main-content">
        <div class="content-header">
          <h1>Settings</h1>
          <p class="welcome-message">Customize your experience</p>
        </div>
        
        <div class="settings-section">
          <h3>Profile Settings</h3>
          <div class="setting-item">
            <div>
              <div style="font-weight: 600;">Character Name</div>
              <div style="font-size: 12px; color: var(--sl-text-secondary);">Change your display name</div>
            </div>
            <input type="text" value="${appState.userData.name}" id="setting-name" style="padding: 8px; background: var(--sl-dark-bg); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; color: white;" />
          </div>
          <div class="setting-item">
            <div>
              <div style="font-weight: 600;">Profile Avatar</div>
              <div style="font-size: 12px; color: var(--sl-text-secondary);">Choose your character avatar</div>
            </div>
            <button class="btn-secondary" id="change-avatar">Change Avatar</button>
          </div>
        </div>
        
        <div class="settings-section">
          <h3>Notifications</h3>
          <div class="setting-item">
            <div>
              <div style="font-weight: 600;">Daily Quest Reminders</div>
              <div style="font-size: 12px; color: var(--sl-text-secondary);">Get notified about new daily quests</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" checked />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div>
              <div style="font-weight: 600;">Streak Reminders</div>
              <div style="font-size: 12px; color: var(--sl-text-secondary);">Don't break your streak!</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" checked />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div>
              <div style="font-weight: 600;">Achievement Notifications</div>
              <div style="font-size: 12px; color: var(--sl-text-secondary);">Celebrate your milestones</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" checked />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
        
        <div class="settings-section">
          <h3>AI Agent Settings</h3>
          <div class="setting-item">
            <div>
              <div style="font-weight: 600;">Difficulty Level</div>
              <div style="font-size: 12px; color: var(--sl-text-secondary);">Adjust quest difficulty</div>
            </div>
            <select style="padding: 8px; background: var(--sl-dark-bg); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; color: white;">
              <option value="easy">Easy</option>
              <option value="normal" selected>Normal</option>
              <option value="hard">Hard</option>
              <option value="adaptive">Adaptive</option>
            </select>
          </div>
        </div>
        
        <div class="settings-section">
          <h3>Data Management</h3>
          <div class="setting-item">
            <div>
              <div style="font-weight: 600;">Export Progress</div>
              <div style="font-size: 12px; color: var(--sl-text-secondary);">Download your data as JSON</div>
            </div>
            <button class="btn-secondary" id="export-data">Export</button>
          </div>
          <div class="setting-item">
            <div>
              <div style="font-weight: 600;">Reset All Progress</div>
              <div style="font-size: 12px; color: var(--sl-text-secondary);">Delete all data and restart (cannot be undone)</div>
            </div>
            <button class="btn-danger" id="reset-progress">Reset & Log Out</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCharts() {
  // Stats Radar Chart (6 stats) - Centered with gold frame
  const statsCtx = document.getElementById('stats-radar');
  if (statsCtx) {
    const stats = appState.userData.stats;
    new Chart(statsCtx, {
      type: 'radar',
      data: {
        labels: ['Productivity', 'Creativity', 'Knowledge', 'Experience', 'Intelligence', 'Resilience'],
        datasets: [{
          label: 'Current Stats',
          data: [stats.productivity, stats.creativity, stats.knowledge, stats.experience, stats.intelligence, stats.resilience],
          backgroundColor: 'rgba(251, 191, 36, 0.15)',
          borderColor: 'rgba(251, 191, 36, 1)',
          borderWidth: 3,
          pointBackgroundColor: 'rgba(251, 191, 36, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { 
              color: '#9ca3af',
              backdropColor: 'transparent',
              stepSize: 20
            },
            grid: { color: 'rgba(251, 191, 36, 0.2)' },
            angleLines: { color: 'rgba(251, 191, 36, 0.2)' },
            pointLabels: { 
              color: '#fbbf24', 
              font: { size: 13, weight: 'bold' }
            }
          }
        },
        plugins: {
          legend: { 
            labels: { color: '#e5e7eb' },
            position: 'bottom'
          }
        }
      }
    });
  }
  
  // XP Growth Chart - Using real XP history
  const xpCtx = document.getElementById('xp-chart');
  if (xpCtx) {
    // Generate data from completed quests
    const completedQuests = appState.completedQuests.slice(-10); // Last 10 quests
    let cumulativeXP = 0;
    const labels = [];
    const xpData = [0];
    
    completedQuests.forEach((quest, idx) => {
      cumulativeXP += quest.xp || 50;
      labels.push(`Quest ${idx + 1}`);
      xpData.push(cumulativeXP);
    });
    
    // Add current total
    labels.push('Current');
    xpData.push(appState.userData.xp);
    
    // Fallback if no quests completed yet
    if (labels.length === 0) {
      labels.push('Start', 'Current');
      xpData.push(0, appState.userData.xp);
    }
    
    new Chart(xpCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total XP Progress',
          data: xpData,
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: { 
            beginAtZero: true,
            ticks: { color: '#9ca3af' },
            grid: { color: 'rgba(59, 130, 246, 0.1)' }
          },
          x: {
            ticks: { color: '#9ca3af' },
            grid: { color: 'rgba(59, 130, 246, 0.1)' }
          }
        },
        plugins: {
          legend: { labels: { color: '#e5e7eb' } }
        }
      }
    });
  }
}

function getTopStat() {
  if (!appState.userData || !appState.userData.stats) return 'Knowledge';
  const stats = appState.userData.stats;
  const top = Object.keys(stats).reduce((a, b) => stats[a] > stats[b] ? a : b);
  return top.charAt(0).toUpperCase() + top.slice(1);
}

function getWeakestStat() {
  if (!appState.userData || !appState.userData.stats) return 'Intelligence';
  const stats = appState.userData.stats;
  const weakest = Object.keys(stats).reduce((a, b) => stats[a] < stats[b] ? a : b);
  return weakest.charAt(0).toUpperCase() + weakest.slice(1);
}

function generateDetailedInsights() {
  const totalQuests = appState.completedQuests.length;
  const topStat = getTopStat();
  const weakStat = getWeakestStat();
  const stats = appState.userData.stats;
  const level = appState.userData.level;
  const rankInfo = getRankingInfo(level);
  
  // Calculate stat balance
  const statValues = Object.values(stats);
  const avgStat = statValues.reduce((a, b) => a + b, 0) / statValues.length;
  const statVariance = Math.sqrt(statValues.reduce((sum, val) => sum + Math.pow(val - avgStat, 2), 0) / statValues.length);
  const isBalanced = statVariance < 15;
  
  // Generate personalized insights
  let insights = `
    <div class="insight-text">
      <p>🎯 <strong>Progress Summary:</strong> ${totalQuests === 0 ? 
        'You\'re just getting started! Complete your first quest to begin tracking your progress.' :
        `You've completed ${totalQuests} quest${totalQuests > 1 ? 's' : ''} and earned ${appState.userData.xp.toLocaleString()} XP. ${totalQuests > 10 ? 'Excellent consistency!' : 'Keep up the momentum!'}`
      }</p>
      
      <p>📈 <strong>Stat Analysis:</strong> Your ${topStat} (${Math.round(stats[topStat.toLowerCase()])}%) is your strongest area. ${
        isBalanced ? 
        'Your stats are well-balanced across all domains!' :
        `Your ${weakStat} (${Math.round(stats[weakStat.toLowerCase()])}%) needs attention to create a more balanced profile.`
      }</p>
      
      <p>🎯 <strong>Current Rank:</strong> You're at ${rankInfo.stage} ${rankInfo.title}. ${
        level < 20 ? 'Focus on completing daily quests to build a strong foundation.' :
        level < 50 ? 'You\'re progressing well! Consider taking on weekly objectives for bigger XP gains.' :
        level < 80 ? 'You\'re in the senior range. Challenge quests are now available!' :
        'You\'re approaching elite status. Continue pushing your limits!'
      }</p>
      
      <p>🚀 <strong>Next Steps:</strong> ${generateNextStepsRecommendation()}</p>
    </div>
    
    <div>
      <h3 style="margin: 16px 0; color: var(--sl-accent-gold);">Recommended Focus Areas</h3>
      <div class="focus-areas">
        ${generateFocusTags()}
      </div>
    </div>
  `;
  
  return insights;
}

function generateNextStepsRecommendation() {
  const level = appState.userData.level;
  const completedQuests = appState.completedQuests.length;
  const certs = appState.skillsArsenal.certifications.length;
  const projects = appState.skillsArsenal.projects.length;
  
  if (projects === 0) {
    return 'Add your completed projects to the Skills Arsenal to showcase your work and earn bonus XP!';
  }
  if (certs === 0 && level > 10) {
    return 'Consider earning a certification to boost your Knowledge stat and credibility.';
  }
  if (completedQuests < 5) {
    return 'Complete 5 daily quests to establish a strong learning habit.';
  }
  if (level < 20) {
    return 'Continue with daily quests and add your projects to accelerate growth.';
  }
  if (level < 50) {
    return 'You\'re ready for weekly objectives! These provide substantial XP and skill development.';
  }
  return 'Tackle challenge quests and consider contributing to open source projects to reach the next tier.';
}

function generateFocusTags() {
  const stats = appState.userData.stats;
  const sortedStats = Object.entries(stats).sort((a, b) => a[1] - b[1]);
  const weakest = sortedStats.slice(0, 3);
  
  const recommendations = {
    productivity: ['Time Management Techniques', 'Task Automation', 'CI/CD Pipelines'],
    creativity: ['Design Patterns', 'UI/UX Principles', 'Creative Problem Solving'],
    knowledge: ['Online Courses', 'Technical Documentation', 'System Architecture'],
    experience: ['Real-World Projects', 'Code Reviews', 'Team Collaboration'],
    intelligence: ['Algorithm Practice', 'Code Optimization', 'System Design'],
    resilience: ['Stress Management', 'Debugging Skills', 'Learning from Failure']
  };
  
  let tags = [];
  weakest.forEach(([stat]) => {
    const recs = recommendations[stat];
    if (recs) tags.push(...recs);
  });
  
  // Add some general recommendations
  tags.push('Open Source Contributions', 'Technical Blogging');
  
  return tags.slice(0, 6).map(tag => `<span class="focus-tag">${tag}</span>`).join('');
}

// ===== EVENT LISTENERS =====
function attachLandingListeners() {
  document.getElementById('begin-journey')?.addEventListener('click', () => {
    appState.currentView = 'assessment';
    render();
  });
}

function attachAssessmentListeners() {
  // Removed - now handled in next-step listener
  
  // Update all sliders
  document.querySelectorAll('.skill-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const skillId = e.target.id.replace('skill-', '');
      const valSpan = document.getElementById(`${skillId}-val`);
      if (valSpan) valSpan.textContent = e.target.value;
    });
  });
  
  // Stress handling slider
  document.getElementById('stress-handling')?.addEventListener('input', (e) => {
    document.getElementById('stress-val').textContent = e.target.value;
  });
  
  document.getElementById('next-step')?.addEventListener('click', () => {
    // Save current step data
    saveAssessmentStepData();
    
    if (appState.assessmentStep < appState.totalAssessmentSteps) {
      appState.assessmentStep++;
      render();
    } else {
      // Process assessment and create user
      processAssessment();
      appState.currentView = 'loading';
      render();
    }
  });
  
  function saveAssessmentStepData() {
    const step = appState.assessmentStep;
    if (step === 1) {
      appState.assessmentData.name = document.getElementById('user-name')?.value || 'Hunter';
      appState.assessmentData.status = document.getElementById('user-status')?.value;
      appState.assessmentData.yearsExperience = parseInt(document.getElementById('years-exp')?.value || '0');
      appState.assessmentData.careerGoal = document.getElementById('career-goal')?.value;
    } else if (step >= 2 && step <= 5) {
      // Save skill ratings
      document.querySelectorAll('.skill-slider').forEach(slider => {
        const skill = slider.dataset.skill;
        const domain = slider.dataset.domain;
        const level = parseInt(slider.value);
        if (!appState.assessmentData.skills) appState.assessmentData.skills = {};
        if (!appState.assessmentData.skills[domain]) appState.assessmentData.skills[domain] = [];
        if (level > 0) {
          appState.assessmentData.skills[domain].push({ name: skill, level: getLevelName(level) });
        }
      });
    } else if (step === 6) {
      // Save AI/ML advanced skills
      document.querySelectorAll('.skill-slider').forEach(slider => {
        const skill = slider.dataset.skill;
        const domain = slider.dataset.domain;
        const level = parseInt(slider.value);
        if (!appState.assessmentData.skills) appState.assessmentData.skills = {};
        if (!appState.assessmentData.skills[domain]) appState.assessmentData.skills[domain] = [];
        if (level > 0) {
          appState.assessmentData.skills[domain].push({ name: skill, level: getLevelName(level) });
        }
      });
    } else if (step === 7) {
      // Save soft skills
      document.querySelectorAll('.skill-slider').forEach(slider => {
        const skill = slider.dataset.skill;
        const domain = slider.dataset.domain;
        const level = parseInt(slider.value);
        if (!appState.assessmentData.skills) appState.assessmentData.skills = {};
        if (!appState.assessmentData.skills[domain]) appState.assessmentData.skills[domain] = [];
        appState.assessmentData.skills[domain].push({ name: skill, level: getLevelName(level) });
      });
      appState.assessmentData.learningStyle = document.getElementById('learning-style')?.value;
      appState.assessmentData.workEnv = document.getElementById('work-env')?.value;
    } else if (step === 8) {
      appState.assessmentData.shortGoals = document.getElementById('short-goals')?.value;
      appState.assessmentData.longGoals = document.getElementById('long-goals')?.value;
      
      const industryInterests = [];
      document.querySelectorAll('input[type="checkbox"][value^="web-"], input[type="checkbox"][value^="data-"], input[type="checkbox"][value^="ai-"], input[type="checkbox"][value^="gaming"], input[type="checkbox"][value^="finance"], input[type="checkbox"][value^="health"]').forEach(cb => {
        if (cb.checked) industryInterests.push(cb.value);
      });
      appState.assessmentData.industryInterests = industryInterests;
      
      const projectPrefs = [];
      document.querySelectorAll('input[type="checkbox"][value^="personal"], input[type="checkbox"][value^="opensource"], input[type="checkbox"][value^="freelance"], input[type="checkbox"][value^="corporate"]').forEach(cb => {
        if (cb.checked) projectPrefs.push(cb.value);
      });
      appState.assessmentData.projectPrefs = projectPrefs;
    }
    
    // Old step 6 content moved here (not used anymore)
    if (false) {
      appState.assessmentData.projectsCompleted = parseInt(document.getElementById('project-count')?.value || '0');
      appState.assessmentData.liveProjects = parseInt(document.getElementById('live-projects')?.value || '0');
      appState.assessmentData.teamProjects = parseInt(document.getElementById('team-projects')?.value || '0');
      appState.assessmentData.userReach = parseInt(document.getElementById('user-reach')?.value || '0');
    } else if (step === 7) {
      appState.assessmentData.hoursPerWeek = parseInt(document.getElementById('hours-per-week')?.value || '20');
      appState.assessmentData.debugSpeed = document.getElementById('debug-speed')?.value;
      appState.assessmentData.algorithmSkill = document.getElementById('algo-skill')?.value;
      appState.assessmentData.newTechTried = parseInt(document.getElementById('new-tech')?.value || '2');
    } else if (step === 8) {
      appState.assessmentData.recoveryTime = document.getElementById('recovery-time')?.value;
      appState.assessmentData.stressHandling = parseInt(document.getElementById('stress-handling')?.value || '3');
      appState.assessmentData.completedCourses = parseInt(document.getElementById('completed-courses')?.value || '0');
      appState.assessmentData.weeklyLearningHours = parseInt(document.getElementById('learning-hours')?.value || '5');
      appState.assessmentData.learningPreference = document.getElementById('learning-pref')?.value;
    }
  }
  
  function getLevelName(val) {
    if (val === 0) return 'none';
    if (val === 1) return 'learning';
    if (val === 2) return 'basic';
    if (val === 3) return 'intermediate';
    if (val === 4) return 'advanced';
    return 'expert';
  }
  
  document.getElementById('prev-step')?.addEventListener('click', () => {
    if (appState.assessmentStep > 1) {
      appState.assessmentStep--;
      render();
    }
  });
}

// ===== CALCULATION DETAILS MODAL =====
function showCalculationDetails() {
  const synergies = appState.userData.synergies || { learningBoost: 1, consistencyBoost: 1, innovationMultiplier: 1, sRankUnlocked: false };
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 800px;">
      <h2>🧮 Advanced Stat Calculations</h2>
      <div style="text-align: left; margin: 24px 0;">
        <h3 style="color: var(--sl-accent-blue); margin-bottom: 16px;">Mathematical Algorithms Used:</h3>
        <ul style="color: var(--sl-text-secondary); line-height: 1.8;">
          <li><strong>Productivity:</strong> Weighted tanh transformation with quality metrics</li>
          <li><strong>Creativity:</strong> S-curve with innovation scoring and diminishing returns</li>
          <li><strong>Knowledge:</strong> Geometric mean of breadth × depth with Shannon entropy</li>
          <li><strong>Experience:</strong> Exponential growth curve with impact weighting</li>
          <li><strong>Intelligence:</strong> Learning rate × problem-solving efficiency</li>
          <li><strong>Resilience:</strong> Geometric mean of 5 components with streak bonus</li>
        </ul>
        
        <h3 style="color: var(--sl-accent-blue); margin: 24px 0 16px;">Advanced Features:</h3>
        <ul style="color: var(--sl-text-secondary); line-height: 1.8;">
          <li>✓ Non-linear transformations (sigmoid, tanh, exponential)</li>
          <li>✓ Time decay for recency bias</li>
          <li>✓ Logarithmic scaling for large numbers</li>
          <li>✓ Confidence intervals based on data quality</li>
          <li>✓ Cross-stat synergies</li>
          <li>✓ Anti-gaming mechanisms</li>
        </ul>
        
        <h3 style="color: var(--sl-accent-gold); margin: 24px 0 16px;">Your Synergy Bonuses:</h3>
        <div style="background: var(--sl-dark-bg); padding: 16px; border-radius: 8px; border: 1px solid rgba(251, 191, 36, 0.3);">
          <p style="margin-bottom: 8px;"><strong>Learning Boost:</strong> ${((synergies.learningBoost - 1) * 100).toFixed(1)}% faster XP gain</p>
          <p style="margin-bottom: 8px;"><strong>Consistency Boost:</strong> ${((synergies.consistencyBoost - 1) * 100).toFixed(1)}% streak bonus</p>
          <p style="margin-bottom: 8px;"><strong>Innovation Multiplier:</strong> ${((synergies.innovationMultiplier - 1) * 100).toFixed(1)}% creative XP</p>
          ${synergies.sRankUnlocked ? '<p style="color: var(--sl-accent-gold); margin-top: 12px;">🏆 S-Rank Quests Unlocked!</p>' : ''}
        </div>
      </div>
      <button class="btn-primary" onclick="closeModal()">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
  
  setTimeout(() => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }, 100);
}

function processAssessment() {
  // Add defaults for missing data based on skill levels
  const data = appState.assessmentData;
  
  // Calculate project counts from skill data
  let totalSkillLevels = 0;
  let skillCount = 0;
  if (data.skills) {
    Object.values(data.skills).forEach(domain => {
      domain.forEach(skill => {
        totalSkillLevels += getLevelValue(skill.level);
        skillCount++;
      });
    });
  }
  
  const avgSkillLevel = skillCount > 0 ? totalSkillLevels / skillCount : 1;
  data.projectsCompleted = Math.floor(avgSkillLevel * 3);
  data.liveProjects = Math.floor(data.projectsCompleted * 0.4);
  data.teamProjects = Math.floor(data.projectsCompleted * 0.5);
  data.userReach = data.liveProjects > 3 ? 500 : data.liveProjects > 0 ? 50 : 0;
  
  data.taskCompletionRate = 0.7;
  data.deploymentFreq = data.liveProjects > 0 ? (data.liveProjects >= 5 ? 'frequent' : 'regular') : 'few';
  data.uniqueProjects = Math.floor(data.projectsCompleted * 0.6);
  data.innovativeSolutions = Math.floor(data.projectsCompleted * 0.3);
  data.completedCourses = Math.floor(avgSkillLevel);
  data.startedCourses = data.completedCourses * 1.5;
  data.weeklyLearningHours = Math.min(10, avgSkillLevel * 2);
  data.hoursPerWeek = data.yearsExperience > 2 ? 30 : 20;
  data.newTechTried = Math.floor(avgSkillLevel * 1.5);
  data.newSkillsPerYear = data.newTechTried;
  data.debugSpeed = avgSkillLevel > 3 ? 'fast' : avgSkillLevel > 2 ? 'average' : 'slow';
  data.algorithmSkill = avgSkillLevel > 4 ? 'advanced' : avgSkillLevel > 3 ? 'intermediate' : avgSkillLevel > 2 ? 'basic' : 'none';
  data.recoveryTime = data.yearsExperience > 3 ? 'oneday' : 'fewdays';
  data.stressHandling = Math.min(5, Math.floor(avgSkillLevel));
  data.streakDays = 0;
  data.breaksPerWeek = 3;
  data.restDaysPerMonth = 2;
  data.attemptedChallenges = 10;
  data.completedChallenges = 6;
  
  const statsResult = calculateInitialStats(data);
  const stats = statsResult.stats;
  const synergies = statsResult.synergies;
  
  // Calculate initial level based on average stat
  const avgStat = Object.values(stats).reduce((a, b) => a + b) / 6;
  const initialLevel = Math.max(1, Math.min(10, Math.floor(avgStat / 10)));
  const initialXP = initialLevel > 1 ? getXPForLevel(initialLevel) : 0;
  
  appState.userData = {
    name: data.name,
    level: statsResult.level,
    xp: statsResult.level > 1 ? getXPForLevel(statsResult.level) : 0,
    gold: statsResult.gold,
    stats,
    engagement: statsResult.engagement,
    energy: statsResult.energy,
    avatar: appState.profileAvatars[0],
    synergies: synergies
  };
  
  // Generate initial quests
  appState.quests.daily = generateDailyQuests(appState.userData);
  appState.quests.weekly = generateWeeklyQuests(appState.userData);
  appState.quests.monthly = generateMonthlyQuests(appState.userData);
  appState.quests.challenge = generateChallengeQuests(appState.userData);
  appState.quests.emergency = [];
  
  // Initialize Skills Arsenal from assessment
  const techSkills = [];
  if (data.skills) {
    Object.entries(data.skills).forEach(([domain, skills]) => {
      skills.forEach(skill => {
        techSkills.push({
          name: skill.name,
          level: skill.level,
          domain: domain,
          progress: getLevelValue(skill.level) * 20
        });
      });
    });
  }
  
  appState.skillsArsenal = {
    technicalSkills: techSkills,
    softSkills: [],
    certifications: [],
    projects: []
  };
  
  // Initialize skill tree based on assessment
  appState.skillTree = {};
  if (data.skills) {
    Object.entries(data.skills).forEach(([domain, skills]) => {
      skills.forEach(skill => {
        appState.skillTree[skill.name] = getLevelValue(skill.level) * 20;
      });
    });
  }
  
  // Update streak
  const today = new Date().toDateString();
  if (!appState.streak.lastLogin) {
    appState.streak.current = 1;
    appState.streak.lastLogin = today;
  } else if (appState.streak.lastLogin !== today) {
    // Check if it's consecutive
    const lastDate = new Date(appState.streak.lastLogin);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      appState.streak.current++;
    } else if (diffDays > 1) {
      appState.streak.current = 1; // Reset streak
    }
    appState.streak.lastLogin = today;
  }
}

function attachCharacterListeners() {
  document.getElementById('enter-system')?.addEventListener('click', () => {
    appState.currentView = 'dashboard';
    render();
  });
}

function attachDashboardListeners() {
  // Navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const view = e.currentTarget.dataset.view;
      if (view) {
        appState.currentView = view;
        render();
      }
    });
  });
  
  // Quest checkboxes
  document.querySelectorAll('.quest-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const questId = e.target.dataset.questId;
      handleQuestComplete(questId, e.target.checked);
    });
  });
  
  // Refresh quests
  document.getElementById('refresh-quests')?.addEventListener('click', () => {
    appState.quests.daily = generateDailyQuests(appState.userData);
    render();
  });
}

function attachQuestsListeners() {
  attachDashboardListeners();
  
  // Tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const parent = e.target.closest('.main-content');
      parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      
      const tabName = e.target.dataset.tab;
      parent.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
      });
      
      // Handle different tab naming conventions
      const tabContent = parent.querySelector(`#${tabName}-quests`) || 
                        parent.querySelector(`#${tabName}-marketplace`) ||
                        parent.querySelector(`#${tabName}-skills`);
      if (tabContent) {
        tabContent.style.display = 'block';
      }
    });
  });
}

function attachSkillTreeListeners() {
  attachDashboardListeners();
  
  document.querySelectorAll('.skill-node').forEach(node => {
    node.addEventListener('click', (e) => {
      const skillName = e.currentTarget.dataset.skill;
      const skill = findSkillByName(skillName);
      if (skill) {
        showModal('Skill Details', `
          <h3>${skill.name}</h3>
          <p>${skill.description}</p>
          <p style="margin-top: 16px; color: var(--sl-text-secondary);">Complete related quests to improve this skill!</p>
        `);
      }
    });
  });
}

function findSkillByName(name) {
  for (const path in skillTreeData) {
    for (const tier in skillTreeData[path]) {
      const skill = skillTreeData[path][tier].find(s => s.name === name);
      if (skill) return skill;
    }
  }
  return null;
}

function renderTechnicalSkills() {
  const skills = appState.skillsArsenal.technicalSkills;
  if (skills.length === 0) {
    return `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div style="font-size: 4rem; opacity: 0.3; margin-bottom: 16px;">💻</div>
        <h3>No Technical Skills Recorded</h3>
        <p>Complete the assessment or add skills manually to see them here.</p>
      </div>
    `;
  }
  const icons = {'frontend': '🎨', 'backend': '⚙️', 'database': '🗄️', 'devops': '🚀', 'testing': '🧪', 'aiml': '🤖', 'nlp': '💬', 'cv': '👁️'};
  return skills.map(skill => {
    const color = skill.progress >= 80 ? '#fbbf24' : skill.progress >= 60 ? '#8b5cf6' : skill.progress >= 40 ? '#3b82f6' : '#f59e0b';
    return `
    <div class="item-card">
      <div class="item-icon">${icons[skill.domain] || '💡'}</div>
      <div class="item-name">${skill.name}</div>
      <div class="item-quantity">${skill.level}</div>
      <div class="stat-bar" style="margin-top: 8px;">
        <div class="stat-fill" style="width: ${skill.progress}%; background: ${color};"></div>
      </div>
    </div>
  `}).join('');
}

function renderSoftSkills() {
  const skills = appState.skillsArsenal.softSkills;
  const addButton = `
    <div class="item-card" style="cursor: pointer; border: 2px dashed rgba(59, 130, 246, 0.5);" onclick="openAddSoftSkillModal()">
      <div class="item-icon">➕</div>
      <div class="item-name">Add Soft Skill</div>
      <div class="item-quantity" style="color: var(--sl-accent-blue);">Click to add</div>
    </div>
  `;
  if (skills.length === 0) {
    return `
      ${addButton}
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div style="font-size: 4rem; opacity: 0.3; margin-bottom: 16px;">🤝</div>
        <h3>No Soft Skills Added</h3>
        <p>Add your soft skills like Communication, Leadership, Time Management, etc.</p>
      </div>
    `;
  }
  const icons = {'Communication': '💬', 'Leadership': '👥', 'Problem-Solving': '🧩', 'Time Management': '⏰', 'Teamwork': '🤝', 'Adaptability': '🔄', 'Critical Thinking': '🧠', 'Conflict Resolution': '☮️', 'Mentoring': '👨‍🏫', 'Presentation Skills': '📊'};
  return addButton + skills.map(skill => `
    <div class="item-card">
      <div class="item-icon">${icons[skill.name] || '⭐'}</div>
      <div class="item-name">${skill.name}</div>
      <div class="item-quantity">${'⭐'.repeat(skill.level)}</div>
      <div style="font-size: 11px; color: var(--sl-text-secondary); margin-top: 8px;">${skill.description || ''}</div>
    </div>
  `).join('');
}

function renderCertifications() {
  const certs = appState.skillsArsenal.certifications;
  const addButton = `
    <div class="item-card" style="cursor: pointer; border: 2px dashed rgba(59, 130, 246, 0.5);" onclick="openAddCertificationModal()">
      <div class="item-icon">➕</div>
      <div class="item-name">Add Certification</div>
      <div class="item-quantity" style="color: var(--sl-accent-blue);">Click to add</div>
    </div>
  `;
  if (certs.length === 0) {
    return `
      ${addButton}
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div style="font-size: 4rem; opacity: 0.3; margin-bottom: 16px;">📜</div>
        <h3>No Certifications Added</h3>
        <p>Add your professional certifications to showcase your expertise and earn bonus XP!</p>
      </div>
    `;
  }
  return addButton + certs.map(cert => `
    <div class="item-card">
      <div class="item-icon">📜</div>
      <div class="item-name">${cert.name}</div>
      <div class="item-quantity">${cert.organization}</div>
      <div style="font-size: 11px; color: var(--sl-accent-gold); margin-top: 8px;">Earned: ${cert.dateEarned}</div>
      ${cert.credentialId ? `<div style="font-size: 10px; color: var(--sl-text-secondary); margin-top: 4px;">ID: ${cert.credentialId}</div>` : ''}
    </div>
  `).join('');
}

function renderProjects() {
  const projects = appState.skillsArsenal.projects;
  const addButton = `
    <div class="item-card" style="cursor: pointer; border: 2px dashed rgba(59, 130, 246, 0.5);" onclick="openAddProjectModal()">
      <div class="item-icon">➕</div>
      <div class="item-name">Add Project</div>
      <div class="item-quantity" style="color: var(--sl-accent-blue);">Click to add</div>
    </div>
  `;
  if (projects.length === 0) {
    return `
      ${addButton}
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div style="font-size: 4rem; opacity: 0.3; margin-bottom: 16px;">🏗️</div>
        <h3>No Projects Yet</h3>
        <p>Add your completed projects to showcase your work and earn XP!</p>
        <button class="btn-primary" onclick="openAddProjectModal()" style="margin-top: 12px;">Add Your First Project</button>
      </div>
    `;
  }
  const statusColors = {'Completed': '#10b981', 'Deployed': '#3b82f6', 'In Progress': '#f59e0b'};
  const typeIcons = {'Personal': '👤', 'Work': '💼', 'Open Source': '🌐', 'Freelance': '💰', 'Academic': '🎓'};
  return addButton + projects.map(proj => `
    <div class="item-card">
      <div class="item-icon">${typeIcons[proj.type] || '🚀'}</div>
      <div class="item-name">${proj.name}</div>
      <div class="item-quantity" style="color: ${statusColors[proj.status] || '#9ca3af'};">${proj.status}</div>
      <div style="font-size: 11px; color: var(--sl-text-secondary); margin-top: 8px;">${proj.technologies.slice(0, 3).join(', ')}</div>
      <div style="font-size: 10px; color: var(--sl-accent-purple); margin-top: 4px;">Complexity: ${'⭐'.repeat(proj.complexity)}</div>
    </div>
  `).join('');
}

function renderMarketplace() {
  const { gold } = appState.userData;
  
  return `
    <div class="dashboard">
      ${renderSidebar()}
      <div class="main-content">
        <div class="content-header">
          <h1>🏪 Growth Marketplace</h1>
          <div class="gold-display">
            <span>💰</span>
            <span>${gold} Gold</span>
          </div>
        </div>
        
        <div class="tabs">
          <button class="tab active" data-tab="learning">Learning Credits</button>
          <button class="tab" data-tab="wellness">Wellness Rewards</button>
          <button class="tab" data-tab="career">Career Development</button>
          <button class="tab" data-tab="social">Team & Social</button>
        </div>
        
        ${renderMarketplaceCategory('learning', marketplaceItems.learningCredits, gold)}
        ${renderMarketplaceCategory('wellness', marketplaceItems.wellnessRewards, gold)}
        ${renderMarketplaceCategory('career', marketplaceItems.careerDevelopment, gold)}
        ${renderMarketplaceCategory('social', marketplaceItems.teamSocial, gold)}
      </div>
    </div>
  `;
}

function renderMarketplaceCategory(category, items, gold) {
  return `
    <div class="tab-content" id="${category}-marketplace" style="display: ${category === 'learning' ? 'block' : 'none'};">
      <div class="quest-section">
        <div class="inventory-grid">
          ${items.map(item => `
            <div class="item-card">
              <div class="item-icon">${item.icon}</div>
              <div class="item-name">${item.name}</div>
              <div class="item-quantity">💰 ${item.cost} Gold</div>
              <div class="item-description">${item.description}</div>
              <button class="btn-use" data-buy-item="${item.id}" ${gold < item.cost ? 'disabled' : ''}>Purchase</button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function attachSkillsArsenalListeners() {
  attachDashboardListeners();
}

function attachMarketplaceListeners() {
  attachDashboardListeners();
  
  document.querySelectorAll('[data-buy-item]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemId = e.target.dataset.buyItem;
      buyMarketplaceItem(itemId);
    });
  });
}

function buyMarketplaceItem(itemId) {
  const allItems = [...marketplaceItems.learningCredits, ...marketplaceItems.wellnessRewards, ...marketplaceItems.careerDevelopment, ...marketplaceItems.teamSocial];
  const item = allItems.find(i => i.id === itemId);
  
  if (!item) {
    showModal('Error', 'Item not found.');
    return;
  }
  
  if (appState.userData.gold < item.cost) {
    showModal('Insufficient Gold', `You need ${item.cost} gold but only have ${appState.userData.gold} gold.`);
    return;
  }
  
  appState.userData.gold -= item.cost;
  
  // Apply item effects based on category
  if (item.id.includes('flexible') || item.id.includes('break')) {
    appState.userData.energy = Math.min(100, appState.userData.energy + 20);
    appState.userData.engagement = Math.min(100, appState.userData.engagement + 5);
    showModal('Purchase Complete! 🎉', `${item.name} purchased!<br>Energy +20, Engagement +5`);
  } else if (item.id.includes('fitness') || item.id.includes('mental')) {
    appState.userData.stats.resilience = Math.min(100, appState.userData.stats.resilience + 5);
    appState.userData.energy = Math.min(100, appState.userData.energy + 15);
    showModal('Purchase Complete! 🎉', `${item.name} purchased!<br>Resilience +5, Energy +15`);
  } else if (item.id.includes('course') || item.id.includes('book') || item.id.includes('conference')) {
    appState.userData.stats.knowledge = Math.min(100, appState.userData.stats.knowledge + 8);
    showModal('Purchase Complete! 🎉', `${item.name} purchased!<br>Knowledge +8`);
  } else if (item.id.includes('certification')) {
    appState.userData.stats.knowledge = Math.min(100, appState.userData.stats.knowledge + 15);
    appState.userData.xp += 100;
    showModal('Purchase Complete! 🎉', `${item.name} purchased!<br>Knowledge +15, XP +100`);
  } else if (item.id.includes('resume') || item.id.includes('interview') || item.id.includes('coaching')) {
    appState.userData.stats.experience = Math.min(100, appState.userData.stats.experience + 5);
    showModal('Purchase Complete! 🎉', `${item.name} purchased!<br>Experience +5`);
  } else if (item.id.includes('linkedin')) {
    appState.userData.stats.experience = Math.min(100, appState.userData.stats.experience + 3);
    appState.userData.engagement = Math.min(100, appState.userData.engagement + 5);
    showModal('Purchase Complete! 🎉', `${item.name} purchased!<br>Experience +3, Engagement +5`);
  } else if (item.id.includes('team') || item.id.includes('coffee') || item.id.includes('peer')) {
    appState.userData.engagement = Math.min(100, appState.userData.engagement + 10);
    showModal('Purchase Complete! 🎉', `${item.name} purchased!<br>Engagement +10`);
  } else {
    showModal('Purchase Complete! 🎉', `${item.name} purchased!`);
  }
  
  checkLevelUp();
  render();
}

function attachProgressListeners() {
  attachDashboardListeners();
}

function attachSettingsListeners() {
  attachDashboardListeners();
  
  document.getElementById('setting-name')?.addEventListener('change', (e) => {
    appState.userData.name = e.target.value;
    render();
  });
  
  document.getElementById('export-data')?.addEventListener('click', () => {
    const dataStr = JSON.stringify(appState, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'solo-leveling-progress.json';
    link.click();
    URL.revokeObjectURL(url);
  });
  
  document.getElementById('change-avatar')?.addEventListener('click', () => {
    showAvatarSelectionModal();
  });
  
  document.getElementById('reset-progress')?.addEventListener('click', () => {
    showResetConfirmationModal();
  });
}

// ===== QUEST COMPLETION LOGIC =====
function handleQuestComplete(questId, completed) {
  // Find quest in all categories
  let quest = null;
  let category = null;
  
  for (const cat of ['daily', 'weekly', 'monthly', 'challenge', 'emergency']) {
    const found = appState.quests[cat].find(q => q.id === questId);
    if (found) {
      quest = found;
      category = cat;
      break;
    }
  }
  
  if (!quest) return;
  
  if (completed) {
    quest.completed = true;
    appState.completedQuests.push(quest);
    
    // Apply performance multiplier
    const performance = getPerformanceMultiplier(appState.userData.engagement, appState.userData.energy);
    const xpGained = Math.floor(quest.xp * performance.multiplier);
    
    // Award XP and Gold
    appState.userData.xp += xpGained;
    appState.userData.gold += quest.gold;
    
    // Update stats affected by quest
    if (quest.statsAffected) {
      quest.statsAffected.forEach(stat => {
        const statKey = stat.toLowerCase();
        if (appState.userData.stats[statKey]) {
          appState.userData.stats[statKey] = Math.min(100, appState.userData.stats[statKey] + 2);
        }
      });
    }
    
    // Update engagement and energy
    appState.userData.engagement = Math.min(100, appState.userData.engagement + 3);
    appState.userData.energy = Math.max(0, appState.userData.energy - 5);
    
    // Check for level up
    checkLevelUp();
    
    // Check for achievements
    checkAchievements();
    
    // Show completion modal
    const message = aiMessages.questComplete[Math.floor(Math.random() * aiMessages.questComplete.length)];
    showModal('Quest Complete! 🎉', `
      <p>${message}</p>
      <div class="modal-rewards">
        <div class="modal-reward">⭐ +${xpGained} XP ${performance.multiplier !== 1 ? `(${performance.multiplier}x)` : ''}</div>
        <div class="modal-reward">💰 +${quest.gold} Gold</div>
        ${quest.statsAffected ? `<div class="modal-reward">💪 ${quest.statsAffected.join(', ')} +2</div>` : ''}
      </div>
      ${performance.multiplier > 1 ? `<p style="color: #10b981; margin-top: 12px; font-size: 14px;">Optimal Performance Bonus!</p>` : ''}
    `);
  } else {
    quest.completed = false;
    const index = appState.completedQuests.findIndex(q => q.id === questId);
    if (index > -1) {
      appState.completedQuests.splice(index, 1);
    }
  }
  
  render();
}

function checkLevelUp() {
  const currentLevel = appState.userData.level;
  const xpRequired = getXPForLevel(currentLevel);
  
  if (appState.userData.xp >= xpRequired) {
    appState.userData.level++;
    appState.userData.xp -= xpRequired;
    
    const statPoints = 2 + Math.floor(appState.userData.level / 5);
    
    // Check for rank-up quest
    const rankUpQuest = rankUpQuests.find(q => q.level === appState.userData.level);
    if (rankUpQuest) {
      showRankUpNotification(rankUpQuest);
    }
    
    showLevelUpModal(statPoints);
  }
}

function showRankUpNotification(rankUpQuest) {
  const rankInfo = getRankingInfo(appState.userData.level);
  showModal('🎉 Rank Up Available!', `
    <h3 style="color: ${rankInfo.color};">You've reached ${rankInfo.stage}!</h3>
    <p style="margin: 16px 0;">${rankInfo.title}</p>
    <div style="background: rgba(59, 130, 246, 0.1); padding: 16px; border-radius: 8px; margin: 16px 0;">
      <h4 style="color: var(--sl-accent-gold); margin-bottom: 8px;">⚡ Rank-Up Quest Available</h4>
      <p style="font-weight: 600;">${rankUpQuest.title}</p>
      <p style="font-size: 14px; color: var(--sl-text-secondary); margin-top: 8px;">${rankUpQuest.description}</p>
      <p style="color: var(--sl-accent-gold); margin-top: 8px;">Reward: ${rankUpQuest.xp} XP</p>
    </div>
    <p style="font-size: 14px; color: var(--sl-text-secondary);">Complete this special quest to cement your new rank!</p>
  `);
}

function showLevelUpModal(statPoints) {
  const level = appState.userData.level;
  const message = aiMessages.levelUp[Math.floor(Math.random() * aiMessages.levelUp.length)].replace('{level}', level);
  
  let availablePoints = statPoints;
  const tempStats = { ...appState.userData.stats };
  
  const modalContent = `
    <h2 style="font-size: 2rem; margin-bottom: 16px; color: var(--sl-accent-gold);">LEVEL UP!</h2>
    <p style="margin-bottom: 24px;">You've reached Level ${level}!</p>
    <p style="color: var(--sl-text-secondary); margin-bottom: 24px;">${message}</p>
    <div class="stat-allocation">
      <p style="margin-bottom: 16px;">Available Points: <span id="available-points">${availablePoints}</span></p>
      ${Object.keys(appState.userData.stats).map(stat => {
        const icons = {productivity: "⚡", creativity: "💡", knowledge: "📚", experience: "🎯", intelligence: "🧠", resilience: "💪"};
        return `
        <div class="stat-allocate">
          <span>${icons[stat]} ${stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
          <span id="stat-${stat}-val">${Math.round(tempStats[stat])}</span>
          <div class="allocate-buttons">
            <button class="btn-allocate" data-stat="${stat}" data-action="add">+</button>
            <button class="btn-allocate" data-stat="${stat}" data-action="sub">-</button>
          </div>
        </div>
      `}).join('')}
    </div>
    <button class="btn-primary" id="confirm-allocation" style="margin-top: 24px;">Confirm</button>
  `;
  
  showModal('', modalContent, () => {
    document.querySelectorAll('.btn-allocate').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const stat = e.target.dataset.stat;
        const action = e.target.dataset.action;
        
        if (action === 'add' && availablePoints > 0) {
          tempStats[stat] += 5;
          availablePoints--;
        } else if (action === 'sub' && tempStats[stat] > appState.userData.stats[stat]) {
          tempStats[stat] -= 5;
          availablePoints++;
        }
        
        document.getElementById(`stat-${stat}-val`).textContent = Math.round(tempStats[stat]);
        document.getElementById('available-points').textContent = availablePoints;
      });
    });
    
    document.getElementById('confirm-allocation')?.addEventListener('click', () => {
      appState.userData.stats = tempStats;
      closeModal();
      render();
    });
  });
}

function checkAchievements() {
  achievementDefinitions.forEach(ach => {
    if (!appState.achievements.includes(ach.id)) {
      let earned = false;
      
      switch (ach.type) {
        case 'quests':
          if (appState.completedQuests.length >= ach.requirement) earned = true;
          break;
        case 'streak':
          if (appState.streak.current >= ach.requirement) earned = true;
          break;
        case 'level':
          if (appState.userData.level >= ach.requirement) earned = true;
          break;
        case 'projects':
          const projectQuests = appState.completedQuests.filter(q => q.category === 'project');
          if (projectQuests.length >= ach.requirement) earned = true;
          break;
      }
      
      if (earned) {
        appState.achievements.push(ach.id);
        showModal('Achievement Unlocked! 🏆', `
          <div style="font-size: 4rem; margin: 16px 0;">${ach.icon}</div>
          <h3>${ach.title}</h3>
          <p style="color: var(--sl-text-secondary);">${ach.description}</p>
        `);
      }
    }
  });
}

// ===== MODAL SYSTEM =====
function showModal(title, content, callback) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      ${title ? `<div class="modal-title">${title}</div>` : ''}
      ${content}
    </div>
  `;
  
  document.body.appendChild(modal);
  
  if (callback) {
    callback();
  } else {
    setTimeout(() => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });
    }, 100);
  }
}

function closeModal() {
  const modal = document.querySelector('.modal');
  if (modal) {
    modal.remove();
  }
}

// ===== MODAL FUNCTIONS FOR SKILLS ARSENAL =====
function openAddSoftSkillModal() {
  const modalContent = `
    <h2>Add Soft Skill</h2>
    <div class="modal-form">
      <div class="form-group">
        <label>Skill Name</label>
        <select id="soft-skill-name">
          ${domainData.soft.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Proficiency Level (1-5 stars)</label>
        <input type="range" min="1" max="5" value="3" id="soft-skill-level" />
        <div style="text-align: center; font-size: 1.5rem; margin-top: 8px;" id="soft-skill-stars">⭐⭐⭐</div>
      </div>
      <div class="form-group">
        <label>Description/Examples</label>
        <textarea id="soft-skill-desc" placeholder="Describe how you demonstrate this skill..."></textarea>
      </div>
      <div class="form-buttons">
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn-primary" onclick="saveSoftSkill()">Add Skill</button>
      </div>
    </div>
  `;
  showModal('', modalContent, () => {
    document.getElementById('soft-skill-level')?.addEventListener('input', (e) => {
      document.getElementById('soft-skill-stars').textContent = '⭐'.repeat(parseInt(e.target.value));
    });
  });
}

function saveSoftSkill() {
  const name = document.getElementById('soft-skill-name')?.value;
  const level = parseInt(document.getElementById('soft-skill-level')?.value || '3');
  const description = document.getElementById('soft-skill-desc')?.value;
  
  appState.skillsArsenal.softSkills.push({ name, level, description });
  closeModal();
  render();
}

function openAddCertificationModal() {
  const modalContent = `
    <h2>Add Certification</h2>
    <div class="modal-form">
      <div class="form-group">
        <label>Certification Name</label>
        <input type="text" id="cert-name" placeholder="e.g., AWS Certified Developer" />
      </div>
      <div class="form-group">
        <label>Issuing Organization</label>
        <input type="text" id="cert-org" placeholder="e.g., Amazon Web Services" />
      </div>
      <div class="form-group">
        <label>Date Earned</label>
        <input type="date" id="cert-date" />
      </div>
      <div class="form-group">
        <label>Credential ID (optional)</label>
        <input type="text" id="cert-id" placeholder="e.g., ABC123XYZ" />
      </div>
      <div class="form-buttons">
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn-primary" onclick="saveCertification()">Add Certification</button>
      </div>
    </div>
  `;
  showModal('', modalContent);
}

function saveCertification() {
  const name = document.getElementById('cert-name')?.value;
  const organization = document.getElementById('cert-org')?.value;
  const dateEarned = document.getElementById('cert-date')?.value;
  const credentialId = document.getElementById('cert-id')?.value;
  
  if (!name || !organization) {
    alert('Please fill in required fields');
    return;
  }
  
  // Award bonus XP for certification
  const xpBonus = 150;
  appState.userData.xp += xpBonus;
  appState.userData.stats.knowledge = Math.min(100, appState.userData.stats.knowledge + 10);
  
  appState.skillsArsenal.certifications.push({ name, organization, dateEarned, credentialId });
  closeModal();
  showModal('Certification Added! 🎓', `You earned ${xpBonus} XP and +10 Knowledge!`);
  checkLevelUp();
  render();
}

function openAddProjectModal() {
  const allTechSkills = appState.skillsArsenal.technicalSkills.map(s => s.name);
  const modalContent = `
    <h2>Add Project</h2>
    <div class="modal-form">
      <div class="form-group">
        <label>Project Name</label>
        <input type="text" id="proj-name" placeholder="e.g., E-commerce Platform" />
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea id="proj-desc" placeholder="Brief description of the project..."></textarea>
      </div>
      <div class="form-group">
        <label>Technologies Used (select multiple)</label>
        <div class="checkbox-group-modal">
          ${allTechSkills.slice(0, 15).map(tech => `
            <label><input type="checkbox" class="proj-tech" value="${tech}" /> ${tech}</label>
          `).join('')}
        </div>
      </div>
      <div class="form-group">
        <label>Project Type</label>
        <select id="proj-type">
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="Open Source">Open Source</option>
          <option value="Freelance">Freelance</option>
          <option value="Academic">Academic</option>
        </select>
      </div>
      <div class="form-group">
        <label>Status</label>
        <select id="proj-status">
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Deployed">Deployed</option>
        </select>
      </div>
      <div class="form-group">
        <label>Complexity (1-5 stars)</label>
        <input type="range" min="1" max="5" value="3" id="proj-complexity" />
        <div style="text-align: center; font-size: 1.5rem; margin-top: 8px;" id="proj-complexity-stars">⭐⭐⭐</div>
      </div>
      <div class="form-buttons">
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn-primary" onclick="saveProject()">Add Project</button>
      </div>
    </div>
  `;
  showModal('', modalContent, () => {
    document.getElementById('proj-complexity')?.addEventListener('input', (e) => {
      document.getElementById('proj-complexity-stars').textContent = '⭐'.repeat(parseInt(e.target.value));
    });
  });
}

function saveProject() {
  const name = document.getElementById('proj-name')?.value;
  const description = document.getElementById('proj-desc')?.value;
  const technologies = Array.from(document.querySelectorAll('.proj-tech:checked')).map(cb => cb.value);
  const type = document.getElementById('proj-type')?.value;
  const status = document.getElementById('proj-status')?.value;
  const complexity = parseInt(document.getElementById('proj-complexity')?.value || '3');
  
  if (!name) {
    alert('Please enter a project name');
    return;
  }
  
  // Calculate XP based on complexity and technologies
  const xpBonus = complexity * 50 + technologies.length * 10;
  appState.userData.xp += xpBonus;
  
  // Boost relevant stats
  appState.userData.stats.experience = Math.min(100, appState.userData.stats.experience + complexity * 2);
  appState.userData.stats.productivity = Math.min(100, appState.userData.stats.productivity + complexity);
  if (status === 'Deployed') {
    appState.userData.stats.creativity = Math.min(100, appState.userData.stats.creativity + 5);
  }
  
  appState.skillsArsenal.projects.push({ name, description, technologies, type, status, complexity });
  closeModal();
  showModal('Project Added! 🏗️', `You earned ${xpBonus} XP and boosted your stats!`);
  checkLevelUp();
  render();
}

function showAvatarSelectionModal() {
  const modalContent = `
    <h2>Choose Your Avatar</h2>
    <div class="avatar-selector">
      ${appState.profileAvatars.map(avatar => `
        <div class="avatar-option ${appState.userData.avatar === avatar ? 'selected' : ''}" data-avatar="${avatar}" onclick="selectAvatar('${avatar}')">
          ${avatar}
        </div>
      `).join('')}
    </div>
    <div style="text-align: center; margin-top: 24px;">
      <button class="btn-primary" onclick="closeModal(); render();">Confirm</button>
    </div>
  `;
  showModal('', modalContent);
}

function selectAvatar(avatar) {
  appState.userData.avatar = avatar;
  document.querySelectorAll('.avatar-option').forEach(opt => {
    opt.classList.remove('selected');
    if (opt.dataset.avatar === avatar) {
      opt.classList.add('selected');
    }
  });
}

function showResetConfirmationModal() {
  const modalContent = `
    <div class="confirm-modal">
      <h2 style="color: #ef4444; margin-bottom: 16px;">⚠️ Warning</h2>
      <p style="margin-bottom: 16px;">This will <strong>permanently delete</strong> all your progress:</p>
      <ul style="text-align: left; margin-bottom: 16px; color: var(--sl-text-secondary);">
        <li>All stats and levels</li>
        <li>Completed quests and achievements</li>
        <li>Skills Arsenal (certifications, projects)</li>
        <li>Gold and XP</li>
        <li>Everything will be reset</li>
      </ul>
      <div class="confirm-checkbox">
        <input type="checkbox" id="confirm-reset" />
        <label for="confirm-reset">I understand this will permanently delete all my data and I will be logged out</label>
      </div>
      <div class="form-buttons" style="justify-content: center;">
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn-danger" id="confirm-reset-btn" disabled onclick="executeReset()">Delete Everything & Log Out</button>
      </div>
    </div>
  `;
  showModal('', modalContent, () => {
    document.getElementById('confirm-reset')?.addEventListener('change', (e) => {
      document.getElementById('confirm-reset-btn').disabled = !e.target.checked;
    });
  });
}

function executeReset() {
  // Reset everything
  appState = {
    currentView: 'landing',
    assessmentStep: 1,
    totalAssessmentSteps: 8,
    assessmentData: {},
    userData: null,
    profileAvatars: appState.profileAvatars,
    quests: { daily: [], weekly: [], monthly: [], emergency: [], challenge: [] },
    completedQuests: [],
    achievements: [],
    skillsArsenal: { technicalSkills: [], softSkills: [], certifications: [], projects: [] },
    skillTree: {},
    streak: { current: 0, lastLogin: null }
  };
  
  closeModal();
  render();
  
  setTimeout(() => {
    showModal('Progress Reset Complete', 'All data has been deleted. Start a new journey!');
  }, 500);
}

// ===== INITIALIZE APP =====
function init() {
  // Check for saved state (would use localStorage in non-sandboxed environment)
  // For now, start fresh each time
  render();
}

init();