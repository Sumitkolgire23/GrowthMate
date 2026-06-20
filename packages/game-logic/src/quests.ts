import { Quest, CharacterStats } from '@repo/types';

export interface QuestTemplate {
  title: string;
  description: string;
  rank: 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  xp: number;
  gold: number;
  statsAffected: (keyof CharacterStats)[];
}

export const questPools: Record<'daily' | 'weekly' | 'monthly' | 'challenge', QuestTemplate[]> = {
  daily: [
    { title: "Code Practice Session", description: "Complete 30 minutes of focused coding practice", rank: "E", xp: 50, gold: 10, statsAffected: ["productivity", "intelligence"] },
    { title: "Algorithm Challenge", description: "Solve one algorithmic problem on any platform", rank: "D", xp: 100, gold: 25, statsAffected: ["intelligence", "creativity"] },
    { title: "Code Review Practice", description: "Review and improve code from a previous project", rank: "C", xp: 250, gold: 50, statsAffected: ["intelligence", "knowledge"] },
    { title: "Debug Session", description: "Fix at least one bug in your current project", rank: "D", xp: 120, gold: 30, statsAffected: ["intelligence", "resilience"] },
    { title: "Documentation Deep Dive", description: "Read technical documentation for 20 minutes", rank: "E", xp: 50, gold: 10, statsAffected: ["knowledge"] },
    { title: "Learn New Concept", description: "Study a new programming concept for 25 minutes", rank: "E", xp: 60, gold: 15, statsAffected: ["knowledge", "intelligence"] },
    { title: "Reflection Journal", description: "Write about today's learning and challenges", rank: "E", xp: 40, gold: 10, statsAffected: ["resilience"] }
  ],
  weekly: [
    { title: "Mini Project Creation", description: "Build and deploy a small functional project", rank: "B", xp: 500, gold: 100, statsAffected: ["productivity", "creativity", "experience"] },
    { title: "Open Source Contribution", description: "Make a contribution to an open-source repository", rank: "A", xp: 1000, gold: 250, statsAffected: ["experience", "knowledge", "productivity"] },
    { title: "Component Library", description: "Build 3 reusable components for your projects", rank: "B", xp: 500, gold: 100, statsAffected: ["creativity", "productivity"] },
    { title: "Blog Post Writing", description: "Write a technical blog post about your learning", rank: "C", xp: 250, gold: 50, statsAffected: ["knowledge", "resilience"] }
  ],
  monthly: [
    { title: "Full-Stack Application", description: "Build complete full-stack app with authentication", rank: "A", xp: 1000, gold: 250, statsAffected: ["experience", "productivity", "intelligence"] },
    { title: "ML Model Development", description: "Train and deploy a machine learning model", rank: "S", xp: 2500, gold: 500, statsAffected: ["intelligence", "knowledge", "experience"] },
    { title: "Performance Optimization", description: "Improve application performance by 50% or more", rank: "A", xp: 800, gold: 200, statsAffected: ["intelligence", "creativity"] }
  ],
  challenge: [
    { title: "System Architecture Design", description: "Design a scalable microservices architecture", rank: "S", xp: 1500, gold: 300, statsAffected: ["intelligence", "creativity", "experience"] },
    { title: "Code Refactoring Marathon", description: "Refactor legacy codebase to modern standards", rank: "A", xp: 1200, gold: 240, statsAffected: ["intelligence", "productivity"] }
  ]
};

// ===== RANK-UP QUESTS =====
export interface RankUpQuest {
  level: number;
  title: string;
  description: string;
  xp: number;
  fromRank: string;
  toRank: string;
}

export const rankUpQuests: RankUpQuest[] = [
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
export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'quests' | 'streak' | 'level' | 'projects';
  gold_reward: number;
  xp_reward: number;
}

export const achievementDefinitions: AchievementDefinition[] = [
  { id: "first_steps", title: "First Steps", description: "Complete your first quest", icon: "🎯", requirement: 1, type: "quests", gold_reward: 50, xp_reward: 100 },
  { id: "week_warrior", title: "Week Warrior", description: "Maintain a 7-day learning streak", icon: "🔥", requirement: 7, type: "streak", gold_reward: 100, xp_reward: 200 },
  { id: "code_ninja", title: "Code Ninja", description: "Maintain a 30-day learning streak", icon: "⚡", requirement: 30, type: "streak", gold_reward: 500, xp_reward: 1000 },
  { id: "quest_master", title: "Quest Master", description: "Complete 50 quests", icon: "👑", requirement: 50, type: "quests", gold_reward: 300, xp_reward: 600 },
  { id: "level_10", title: "Rising Star", description: "Reach Level 10", icon: "⭐", requirement: 10, type: "level", gold_reward: 150, xp_reward: 300 },
  { id: "level_50", title: "Seasoned Professional", description: "Reach Level 50", icon: "💫", requirement: 50, type: "level", gold_reward: 500, xp_reward: 1000 },
  { id: "level_100", title: "Elite Status", description: "Reach Level 100 (Staff Engineer)", icon: "👑", requirement: 100, type: "level", gold_reward: 1000, xp_reward: 2000 },
  { id: "project_builder", title: "Project Builder", description: "Complete 5 project-based quests", icon: "🏗️", requirement: 5, type: "projects", gold_reward: 200, xp_reward: 400 }
];

export function getNewlyUnlockedAchievements(
  unlockedIds: string[],
  metrics: {
    questsCompleted: number;
    currentStreak: number;
    level: number;
    projectsCompleted: number;
  }
): AchievementDefinition[] {
  return achievementDefinitions.filter(ach => {
    if (unlockedIds.includes(ach.id)) return false;

    switch (ach.type) {
      case 'quests':
        return metrics.questsCompleted >= ach.requirement;
      case 'streak':
        return metrics.currentStreak >= ach.requirement;
      case 'level':
        return metrics.level >= ach.requirement;
      case 'projects':
        return metrics.projectsCompleted >= ach.requirement;
      default:
        return false;
    }
  });
}


// ===== SKILL TREE STRUCTURE =====
export interface SkillTreeNode {
  name: string;
  prereq: string | null;
  description: string;
}

export const skillTreeData: Record<'web_development' | 'ai_ml', Record<'beginner' | 'intermediate' | 'advanced', SkillTreeNode[]>> = {
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
export const aiMessages = {
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
    "You are currently unstoppable! Complete those quests and rise to the top."
  ]
};

// ===== QUEST GENERATORS =====

export function generateDailyQuests(seed: string = ''): Omit<Quest, 'id' | 'completed' | 'completed_at'>[] {
  const quests: Omit<Quest, 'id' | 'completed' | 'completed_at'>[] = [];
  const pool = [...questPools.daily];
  
  // Deterministic-ish or random selection
  const numQuests = 2 + Math.floor(Math.random() * 3); // 2-4 quests
  
  for (let i = 0; i < numQuests && pool.length > 0; i++) {
    const index = Math.floor(Math.random() * pool.length);
    const template = pool[index];
    if (template) {
      quests.push({
        title: template.title,
        description: template.description,
        rank: template.rank,
        xp_reward: template.xp,
        gold_reward: template.gold,
        stats_affected: template.statsAffected,
        category: 'daily'
      });
      pool.splice(index, 1);
    }
  }
  return quests;
}

export function generateWeeklyQuests(): Omit<Quest, 'id' | 'completed' | 'completed_at'>[] {
  const quests: Omit<Quest, 'id' | 'completed' | 'completed_at'>[] = [];
  const pool = [...questPools.weekly];
  const numQuests = 2;
  
  for (let i = 0; i < numQuests && pool.length > 0; i++) {
    const index = Math.floor(Math.random() * pool.length);
    const template = pool[index];
    if (template) {
      quests.push({
        title: template.title,
        description: template.description,
        rank: template.rank,
        xp_reward: template.xp,
        gold_reward: template.gold,
        stats_affected: template.statsAffected,
        category: 'weekly'
      });
      pool.splice(index, 1);
    }
  }
  return quests;
}

export function generateMonthlyQuests(): Omit<Quest, 'id' | 'completed' | 'completed_at'>[] {
  const quests: Omit<Quest, 'id' | 'completed' | 'completed_at'>[] = [];
  const pool = [...questPools.monthly];
  const numQuests = 1;
  
  for (let i = 0; i < numQuests && pool.length > 0; i++) {
    const index = Math.floor(Math.random() * pool.length);
    const template = pool[index];
    if (template) {
      quests.push({
        title: template.title,
        description: template.description,
        rank: template.rank,
        xp_reward: template.xp,
        gold_reward: template.gold,
        stats_affected: template.statsAffected,
        category: 'monthly'
      });
      pool.splice(index, 1);
    }
  }
  return quests;
}

export function generateChallengeQuests(level: number): Omit<Quest, 'id' | 'completed' | 'completed_at'>[] {
  if (level < 40) return []; // Unlock at level 40+
  const quests: Omit<Quest, 'id' | 'completed' | 'completed_at'>[] = [];
  const pool = [...questPools.challenge];
  const numQuests = 1;
  
  for (let i = 0; i < numQuests && pool.length > 0; i++) {
    const index = Math.floor(Math.random() * pool.length);
    const template = pool[index];
    if (template) {
      quests.push({
        title: template.title,
        description: template.description,
        rank: template.rank,
        xp_reward: template.xp,
        gold_reward: template.gold,
        stats_affected: template.statsAffected,
        category: 'challenge'
      });
      pool.splice(index, 1);
    }
  }
  return quests;
}

export function findSkillByName(name: string): SkillTreeNode | null {
  for (const path in skillTreeData) {
    const domain = (skillTreeData as any)[path];
    for (const tier in domain) {
      const skills = domain[tier] as SkillTreeNode[];
      const skill = skills.find(s => s.name === name);
      if (skill) return skill;
    }
  }
  return null;
}

export function getSkillTier(name: string): 'beginner' | 'intermediate' | 'advanced' | null {
  if (skillTreeData.web_development.beginner.some(s => s.name === name)) return 'beginner';
  if (skillTreeData.web_development.intermediate.some(s => s.name === name)) return 'intermediate';
  if (skillTreeData.web_development.advanced.some(s => s.name === name)) return 'advanced';

  if (skillTreeData.ai_ml.beginner.some(s => s.name === name)) return 'beginner';
  if (skillTreeData.ai_ml.intermediate.some(s => s.name === name)) return 'intermediate';
  if (skillTreeData.ai_ml.advanced.some(s => s.name === name)) return 'advanced';

  return null;
}
