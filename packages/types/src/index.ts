export type SkillLevel = 'none' | 'learning' | 'basic' | 'intermediate' | 'advanced' | 'expert';

export interface Skill {
  name: string;
  level: SkillLevel;
}

export type SkillsData = Record<string, Skill[]>;

export interface AssessmentData {
  yearsExperience?: number;
  projectsCompleted?: number;
  liveProjects?: number;
  hoursPerWeek?: number;
  uniqueProjects?: number;
  newTechTried?: number;
  completedCourses?: number;
  startedCourses?: number;
  weeklyLearningHours?: number;
  userReach?: number;
  teamProjects?: number;
  algorithmSkill?: 'none' | 'basic' | 'intermediate' | 'advanced' | 'expert';
  debugSpeed?: 'slow' | 'average' | 'fast' | 'veryfast';
  streakDays?: number;
  stressHandling?: number; // 1 to 5
  recoveryTime?: 'hours' | 'oneday' | 'fewdays' | 'week' | 'weeks';
  skills?: SkillsData;
  [key: string]: any;
}

export interface CharacterStats {
  productivity: number;
  creativity: number;
  knowledge: number;
  experience: number;
  intelligence: number;
  resilience: number;
}

export interface RankingInfo {
  rank: string;
  stage: string;
  title: string;
  color: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'monthly' | 'challenge' | 'recommendation';
  rank: 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  xp_reward: number;
  gold_reward: number;
  stats_affected: (keyof CharacterStats)[];
  completed: boolean;
  completed_at?: string;
  created_at?: string;
}
