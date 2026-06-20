import {
  geometricMean,
  logGrowth,
  shannonEntropy,
  tanh,
  calculateConfidence
} from './math-utils';
import {
  AssessmentData,
  CharacterStats,
  SkillLevel,
  SkillsData
} from '@repo/types';

export function getLevelValue(level: SkillLevel): number {
  const mapping: Record<SkillLevel, number> = {
    none: 0,
    learning: 1,
    basic: 2,
    intermediate: 3,
    advanced: 4,
    expert: 5
  };
  return mapping[level] || 0;
}

export function assessUserImpact(users: number): number {
  if (users === 0) return 0;
  if (users < 100) return 0.2;
  if (users < 1000) return 0.4;
  if (users < 10000) return 0.7;
  return 1.0;
}

export function calculateSkillDiversity(skills: SkillsData): number {
  const domains = ['frontend', 'backend', 'database', 'devops', 'testing', 'aiml', 'nlp', 'cv'];
  let masteredCount = 0;
  domains.forEach(domain => {
    const domainSkills = skills[domain];
    if (domainSkills && domainSkills.length > 0) {
      const avgLevel = domainSkills.reduce((sum, s) => sum + getLevelValue(s.level), 0) / domainSkills.length;
      if (avgLevel >= 2) masteredCount++; // At least basic proficiency
    }
  });
  return Math.min(masteredCount / 6, 1);
}

// ===== REAL STAT CALCULATION ALGORITHMS =====

export function calculateProductivity(data: AssessmentData): number {
  const timeScore = Math.min((data.hoursPerWeek || 10) / 40, 1);
  const projectScore = Math.min((data.projectsCompleted || 0) / 20, 1);
  const deploymentScore = data.deploymentFreq === 'continuous' ? 1 
    : data.deploymentFreq === 'frequent' ? 0.9 
    : data.deploymentFreq === 'regular' ? 0.7 
    : data.deploymentFreq === 'few' ? 0.4 
    : 0.2;
  const efficiencyScore = (data.taskCompletionRate || 0.5);
  return Math.round(100 * (timeScore * 0.25 + projectScore * 0.3 + deploymentScore * 0.25 + efficiencyScore * 0.2));
}

export function calculateProductivityAdvanced(assessmentData: AssessmentData): number {
  const yearsExp = assessmentData.yearsExperience || 0;
  const projectCount = assessmentData.projectsCompleted || 0;
  const completedProjects = assessmentData.projectsCompleted || 0;
  const deployedProjects = assessmentData.liveProjects || 0;
  const hoursPerWeek = assessmentData.hoursPerWeek || 20;
  
  // Component 1: Commit Regularity (with exponential moving average estimation)
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
  const weightedSum = components.reduce((sum, comp, i) => sum + (weights[i] || 0) * comp, 0);
  
  // Apply tanh for smooth saturation
  const baseScore = 100 * tanh(2 * weightedSum); // Scale factor 2 for proper range
  
  // Confidence adjustment
  const confidence = calculateConfidence(projectCount + yearsExp * 10, 0, 2);
  const finalScore = baseScore * (0.7 + 0.3 * confidence);
  
  return Math.round(Math.max(1, Math.min(100, finalScore)));
}

export function calculateCreativity(data: AssessmentData): number {
  const uniqueProjects = Math.min((data.uniqueProjects || 0) / 10, 1);
  const newTechTried = Math.min((data.newTechTried || 0) / 10, 1);
  const innovativeSolutions = Math.min((data.innovativeSolutions || 0) / 5, 1);
  const refactoring = data.refactoringProjects ? Math.min(data.refactoringProjects / (data.projectsCompleted || 1), 0.5) : 0;
  const contributions = Math.min(((data.blogPosts || 0) + (data.openSourceContribs || 0)) / 10, 1);
  return Math.round(100 * (uniqueProjects * 0.3 + newTechTried * 0.25 + innovativeSolutions * 0.25 + refactoring * 0.1 + contributions * 0.1));
}

export function calculateCreativityAdvanced(assessmentData: AssessmentData): number {
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
  const innovationScore = components.reduce((sum, comp, i) => sum + (weights[i] || 0) * comp, 0);
  
  // S-curve transformation
  const k = 2.0;
  const baseScore = 100 * (1 - Math.exp(-k * innovationScore));
  
  // Confidence adjustment
  const confidence = calculateConfidence(projectCount, 0, 2);
  const finalScore = baseScore * (0.7 + 0.3 * confidence);
  
  return Math.round(Math.max(1, Math.min(100, finalScore)));
}

export function calculateKnowledge(data: AssessmentData): number {
  const courseCompletion = data.completedCourses ? data.completedCourses / Math.max(data.startedCourses || 1, 1) : 0.3;
  const skillDiversity = calculateSkillDiversity(data.skills || {});
  const docsContribution = Math.min((data.documentationWritten || 0) / 20, 1);
  const learningHours = Math.min((data.weeklyLearningHours || 5) / 10, 1);
  return Math.round(100 * (courseCompletion * 0.25 + skillDiversity * 0.35 + docsContribution * 0.15 + learningHours * 0.25));
}

export function calculateKnowledgeAdvanced(assessmentData: AssessmentData): number {
  const completedCourses = assessmentData.completedCourses || 0;
  const startedCourses = assessmentData.startedCourses || Math.max(completedCourses, 1);
  const techStack: { name: string; proficiency: number; category: string }[] = [];
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
  const categoryScores: Record<string, number> = {
    frontend: 0, backend: 0, database: 0, devops: 0, aiml: 0
  };
  
  techStack.forEach(skill => {
    const proficiency = skill.proficiency || 50;
    const category = skill.category || 'frontend';
    if (categoryScores.hasOwnProperty(category)) {
      categoryScores[category] = (categoryScores[category] || 0) + proficiency;
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

export function calculateExperience(data: AssessmentData): number {
  const projectsDeployed = data.liveProjects ? data.liveProjects / Math.max(data.projectsCompleted || 1, 1) : 0.3;
  const workDuration = Math.min((data.yearsExperience || 0) / 10, 1);
  const collaboration = data.teamProjects ? Math.min((data.teamProjects / Math.max(data.projectsCompleted || 1, 1)) * 1.2, 1) : 0.5;
  const userImpact = assessUserImpact(data.userReach || 0);
  return Math.round(100 * (projectsDeployed * 0.25 + workDuration * 0.35 + collaboration * 0.2 + userImpact * 0.2));
}

export function calculateExperienceAdvanced(assessmentData: AssessmentData): number {
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

export function calculateIntelligence(data: AssessmentData): number {
  const debugSpeed = data.debugSpeed === 'veryfast' ? 1 
    : data.debugSpeed === 'fast' ? 0.8 
    : data.debugSpeed === 'average' ? 0.5 
    : 0.2;
  const optimization = Math.min((data.optimizationsMade || 0) / 10, 1);
  const algoSkill = data.algorithmSkill === 'expert' ? 1 
    : data.algorithmSkill === 'advanced' ? 0.9 
    : data.algorithmSkill === 'intermediate' ? 0.6 
    : data.algorithmSkill === 'basic' ? 0.3 
    : 0;
  const learningSpeed = Math.min((data.newSkillsPerYear || 2) / 6, 1);
  return Math.round(100 * (debugSpeed * 0.25 + optimization * 0.25 + algoSkill * 0.3 + learningSpeed * 0.2));
}

export function calculateIntelligenceAdvanced(assessmentData: AssessmentData): number {
  const yearsExp = assessmentData.yearsExperience || 0;
  const algorithmSkill = assessmentData.algorithmSkill || 'basic';
  const debugSpeed = assessmentData.debugSpeed || 'average';
  const optimizationsMade = Math.floor((assessmentData.projectsCompleted || 0) * 0.3) || 0;
  const newSkillsPerYear = assessmentData.newSkillsPerYear || assessmentData.newTechTried || 2;
  
  // Component 1: Debugging Efficiency (exponential improvement)
  const debugScores: Record<string, number> = { slow: 0.2, average: 0.5, fast: 0.8, veryfast: 1.0 };
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
  const algoScores: Record<string, number> = { none: 0, basic: 0.3, intermediate: 0.6, advanced: 0.9, expert: 1.0 };
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

export function calculateResilience(data: AssessmentData): number {
  const recoveryTime = data.recoveryTime === 'hours' ? 1 
    : data.recoveryTime === 'oneday' ? 0.8 
    : data.recoveryTime === 'fewdays' ? 0.5 
    : data.recoveryTime === 'week' ? 0.3 
    : 0.1;
  const consistency = Math.min((data.streakDays || 0) / 90, 1);
  const stressHandling = (data.stressHandling || 3) / 5;
  const persistence = data.completedChallenges ? data.completedChallenges / Math.max(data.attemptedChallenges || 1, 1) : 0.5;
  const selfCare = Math.min(((data.breaksPerWeek || 2) / 10 + (data.restDaysPerMonth || 2) / 4) / 2, 1);
  return Math.round(100 * (recoveryTime * 0.2 + consistency * 0.2 + stressHandling * 0.2 + persistence * 0.2 + selfCare * 0.2));
}

export function calculateResilienceAdvanced(assessmentData: AssessmentData): number {
  const streakDays = assessmentData.streakDays || 0;
  const stressHandling = assessmentData.stressHandling || 3; // 1-5 scale
  const recoverySpeed = assessmentData.recoveryTime || 'oneday';
  const persistenceRatio = 0.7; // Estimated completed/attempted under pressure
  const restDaysPerMonth = 4;
  
  // Component 1: Recovery Time (exponential decay)
  const recoveryTimes: Record<string, number> = { hours: 12, oneday: 24, fewdays: 72, week: 168, weeks: 336 };
  const actualRecovery = recoveryTimes[recoverySpeed] || 24;
  const baselineRecovery = 48;
  const R_t = Math.exp(-actualRecovery / baselineRecovery);
  
  // Component 2: Resilience Score (stress adaptation)
  const performanceUnderStress = stressHandling / 5;
  const stressExposureCount = Math.floor(streakDays / 30);
  const adaptationRate = 1 - Math.exp(-0.1 * stressExposureCount);
  const R_s = performanceUnderStress * (0.5 + 0.5 * adaptationRate);
  
  // Component 3: Emotional Regulation
  const positiveSentimentRatio = 0.6 + stressHandling * 0.08;
  const emotionalStability = 0.7 + stressHandling * 0.05;
  const E_r_base = (positiveSentimentRatio + emotionalStability) / 2;
  const improvementRate = 0.1;
  const E_r = E_r_base * (1 + improvementRate);
  
  // Component 4: Persistence Metric
  const retryFactor = 1.5;
  const gritBonus = Math.min(0.5, 0.1 * retryFactor);
  const P_m = persistenceRatio * (1 + gritBonus);
  
  // Component 5: Self-Care
  const targetHours = 40;
  const actualHours = assessmentData.hoursPerWeek || 20;
  const workLifeBalance = 1 - Math.abs(actualHours / targetHours - 1);
  const recoveryActivities = Math.min(1.0, (restDaysPerMonth + 2) / 6);
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

// ===== CROSS-STAT SYNERGIES =====

export function applyStatSynergies(stats: CharacterStats) {
  const learningBoost = 1 + 0.3 * (stats.intelligence / 100) * (stats.knowledge / 100);
  const consistencyBoost = 1 + 0.5 * Math.sqrt(stats.productivity / 100) * (stats.resilience / 100);
  const innovationMultiplier = 1 + 0.4 * (stats.creativity / 100) * (stats.experience / 100);
  
  return {
    learningBoost,
    consistencyBoost,
    innovationMultiplier,
    sRankUnlocked: innovationMultiplier > 1.2
  };
}

// ===== STAT CALCULATION FROM ASSESSMENT =====

export function calculateStats(data: AssessmentData): CharacterStats {
  return {
    productivity: calculateProductivity(data),
    creativity: calculateCreativity(data),
    knowledge: calculateKnowledge(data),
    experience: calculateExperience(data),
    intelligence: calculateIntelligence(data),
    resilience: calculateResilience(data)
  };
}

export function calculateInitialStats(assessmentData: AssessmentData): CharacterStats {
  return {
    productivity: calculateProductivityAdvanced(assessmentData),
    creativity: calculateCreativityAdvanced(assessmentData),
    knowledge: calculateKnowledgeAdvanced(assessmentData),
    experience: calculateExperienceAdvanced(assessmentData),
    intelligence: calculateIntelligenceAdvanced(assessmentData),
    resilience: calculateResilienceAdvanced(assessmentData)
  };
}
