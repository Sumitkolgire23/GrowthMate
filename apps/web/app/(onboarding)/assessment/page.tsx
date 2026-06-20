'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { initializeCharacter } from '../../actions/assessment';
import { 
  User, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Activity,
  Code,
  Server,
  Database as DbIcon,
  Cpu,
  Brain,
  MessageSquare,
  Trophy,
  Target
} from 'lucide-react';
import { SkillLevel } from '@repo/types';

// Map numerical slider values (0-5) to string levels
const sliderLevelMap: Record<number, SkillLevel> = {
  0: 'none',
  1: 'learning',
  2: 'basic',
  3: 'intermediate',
  4: 'advanced',
  5: 'expert'
};

const skillList = {
  frontend: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'TailwindCSS', 'Redux'],
  backend: ['Node.js', 'Express', 'Python', 'Django', 'FastAPI', 'Go', 'GraphQL', 'REST APIs'],
  databaseDevops: [
    { name: 'PostgreSQL', category: 'database' },
    { name: 'MongoDB', category: 'database' },
    { name: 'Redis', category: 'database' },
    { name: 'Docker', category: 'devops' },
    { name: 'Kubernetes', category: 'devops' },
    { name: 'AWS', category: 'devops' },
    { name: 'CI/CD', category: 'devops' }
  ],
  aiml: ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'Statistics', 'Linear Algebra'],
  aimlAdvanced: ['TensorFlow', 'PyTorch', 'Deep Learning', 'Neural Networks', 'Transformers', 'LangChain'],
  soft: ['Communication', 'Leadership', 'Problem-Solving', 'Time Management', 'Teamwork', 'Adaptability']
};

export default function AssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial Form State
  const [name, setName] = useState('');
  const [status, setStatus] = useState('student');
  const [yearsExperience, setYearsExperience] = useState(0);
  const [careerGoal, setCareerGoal] = useState('full-stack');

  // Sliders Skills State
  const [frontendLevels, setFrontendLevels] = useState<Record<string, number>>({});
  const [backendLevels, setBackendLevels] = useState<Record<string, number>>({});
  const [databaseDevopsLevels, setDatabaseDevopsLevels] = useState<Record<string, number>>({});
  const [aimlLevels, setAimlLevels] = useState<Record<string, number>>({});
  const [aimlAdvancedLevels, setAimlAdvancedLevels] = useState<Record<string, number>>({});
  const [softLevels, setSoftLevels] = useState<Record<string, number>>({});

  // Step 7: Project stats
  const [projectsCompleted, setProjectsCompleted] = useState(0);
  const [liveProjects, setLiveProjects] = useState(0);
  const [teamProjects, setTeamProjects] = useState(0);
  const [userReach, setUserReach] = useState(0);

  // Step 8: Work habits & Goals
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  const [debugSpeed, setDebugSpeed] = useState<'slow' | 'average' | 'fast' | 'veryfast'>('average');
  const [algorithmSkill, setAlgorithmSkill] = useState<'none' | 'basic' | 'intermediate' | 'advanced' | 'expert'>('basic');
  const [newTechTried, setNewTechTried] = useState(2);
  const [shortGoals, setShortGoals] = useState('');
  const [longGoals, setLongGoals] = useState('');
  const [industries, setIndustries] = useState<string[]>([]);
  const [projectPreferences, setProjectPreferences] = useState<string[]>([]);

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      setError('Please enter your character name.');
      return;
    }
    setError(null);
    setStep(prev => Math.min(prev + 1, 8));
  };

  const handleBack = () => {
    setError(null);
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleIndustryChange = (val: string) => {
    setIndustries(prev => 
      prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]
    );
  };

  const handlePrefChange = (val: string) => {
    setProjectPreferences(prev => 
      prev.includes(val) ? prev.filter(p => p !== val) : [...prev, val]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Format all skills into the AssessmentData interface format
    const skillsData: Record<string, { name: string; level: SkillLevel }[]> = {
      frontend: skillList.frontend.map(name => ({
        name,
        level: sliderLevelMap[frontendLevels[name] || 0] || 'none'
      })),
      backend: skillList.backend.map(name => ({
        name,
        level: sliderLevelMap[backendLevels[name] || 0] || 'none'
      })),
      database: skillList.databaseDevops
        .filter(s => s.category === 'database')
        .map(s => ({
          name: s.name,
          level: sliderLevelMap[databaseDevopsLevels[s.name] || 0] || 'none'
        })),
      devops: skillList.databaseDevops
        .filter(s => s.category === 'devops')
        .map(s => ({
          name: s.name,
          level: sliderLevelMap[databaseDevopsLevels[s.name] || 0] || 'none'
        })),
      aiml: [
        ...skillList.aiml.map(name => ({
          name,
          level: sliderLevelMap[aimlLevels[name] || 0] || 'none'
        })),
        ...skillList.aimlAdvanced.map(name => ({
          name,
          level: sliderLevelMap[aimlAdvancedLevels[name] || 0] || 'none'
        }))
      ],
      soft: skillList.soft.map(name => ({
        name,
        level: sliderLevelMap[softLevels[name] || 3] || 'intermediate' // default soft skill is 3
      }))
    };

    const finalPayload = {
      name,
      status,
      yearsExperience,
      careerGoal,
      skills: skillsData,
      projectsCompleted,
      liveProjects,
      teamProjects,
      userReach,
      hoursPerWeek,
      debugSpeed,
      algorithmSkill,
      newTechTried,
      shortGoals,
      longGoals,
      industries,
      projectPreferences
    };

    const result = await initializeCharacter(finalPayload);

    if (result.success) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setError(result.error || 'Failed to complete character creation.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background Neon Grid / Vignette */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
      
      {/* Radiant Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-2xl bg-slate-900/80 border border-cyan-500/20 rounded-xl p-8 backdrop-blur-md shadow-2xl relative z-10">
        
        {/* Step Indicator Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
              {step}
            </div>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Step {step} of 8: Assessment
            </span>
          </div>
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            {Math.round((step / 8) * 100)}% COMPLETE
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mb-8 border border-slate-800">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${(step / 8) * 100}%` }}
          ></div>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-500/30 text-red-300 rounded-lg p-3 text-sm mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* STEP CONTENT */}
        <div className="min-h-[300px]">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-cyan-500" />
                <h2 className="text-xl font-bold tracking-wider text-cyan-400">Personal Information</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Hunter Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500 rounded-lg py-2.5 px-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Current Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500 rounded-lg py-2.5 px-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition text-sm"
                    >
                      <option value="student">Student</option>
                      <option value="professional">Working Professional</option>
                      <option value="self-taught">Self-Taught Learner</option>
                      <option value="bootcamp">Bootcamp Graduate</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Years of Experience</label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500 rounded-lg py-2.5 px-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Ultimate Career Goal</label>
                  <select
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500 rounded-lg py-2.5 px-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition text-sm"
                  >
                    <option value="web-dev">Web Developer</option>
                    <option value="full-stack">Full-Stack Developer</option>
                    <option value="ai-ml">AI/ML Engineer</option>
                    <option value="data-science">Data Scientist</option>
                    <option value="devops">DevOps Engineer</option>
                    <option value="mobile">Mobile Developer</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-5 h-5 text-cyan-500" />
                <h2 className="text-xl font-bold tracking-wider text-cyan-400">Frontend Development</h2>
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">Rate your expertise level (0-5)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2">
                {skillList.frontend.map(skill => (
                  <div key={skill} className="bg-slate-950/30 border border-slate-800/40 rounded-lg p-3 space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{skill}</span>
                      <span className="text-cyan-400 uppercase tracking-widest">{sliderLevelMap[frontendLevels[skill] || 0]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={frontendLevels[skill] || 0}
                      onChange={(e) => setFrontendLevels(prev => ({ ...prev, [skill]: parseInt(e.target.value) }))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-5 h-5 text-cyan-500" />
                <h2 className="text-xl font-bold tracking-wider text-cyan-400">Backend Development</h2>
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">Rate your expertise level (0-5)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2">
                {skillList.backend.map(skill => (
                  <div key={skill} className="bg-slate-950/30 border border-slate-800/40 rounded-lg p-3 space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{skill}</span>
                      <span className="text-cyan-400 uppercase tracking-widest">{sliderLevelMap[backendLevels[skill] || 0]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={backendLevels[skill] || 0}
                      onChange={(e) => setBackendLevels(prev => ({ ...prev, [skill]: parseInt(e.target.value) }))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <DbIcon className="w-5 h-5 text-cyan-500" />
                <h2 className="text-xl font-bold tracking-wider text-cyan-400">Database & DevOps</h2>
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">Rate your expertise level (0-5)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2">
                {skillList.databaseDevops.map(skill => (
                  <div key={skill.name} className="bg-slate-950/30 border border-slate-800/40 rounded-lg p-3 space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{skill.name} <span className="text-[10px] text-slate-500 uppercase">({skill.category})</span></span>
                      <span className="text-cyan-400 uppercase tracking-widest">{sliderLevelMap[databaseDevopsLevels[skill.name] || 0]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={databaseDevopsLevels[skill.name] || 0}
                      onChange={(e) => setDatabaseDevopsLevels(prev => ({ ...prev, [skill.name]: parseInt(e.target.value) }))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-cyan-500" />
                <h2 className="text-xl font-bold tracking-wider text-cyan-400">AI / ML Fundamentals</h2>
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">Rate your expertise level (0-5)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2">
                {skillList.aiml.map(skill => (
                  <div key={skill} className="bg-slate-950/30 border border-slate-800/40 rounded-lg p-3 space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{skill}</span>
                      <span className="text-cyan-400 uppercase tracking-widest">{sliderLevelMap[aimlLevels[skill] || 0]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={aimlLevels[skill] || 0}
                      onChange={(e) => setAimlLevels(prev => ({ ...prev, [skill]: parseInt(e.target.value) }))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-5 h-5 text-cyan-500" />
                <h2 className="text-xl font-bold tracking-wider text-cyan-400">Advanced AI / Deep Learning</h2>
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">Rate your expertise level (0-5)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2">
                {skillList.aimlAdvanced.map(skill => (
                  <div key={skill} className="bg-slate-950/30 border border-slate-800/40 rounded-lg p-3 space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{skill}</span>
                      <span className="text-cyan-400 uppercase tracking-widest">{sliderLevelMap[aimlAdvancedLevels[skill] || 0]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={aimlAdvancedLevels[skill] || 0}
                      onChange={(e) => setAimlAdvancedLevels(prev => ({ ...prev, [skill]: parseInt(e.target.value) }))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-cyan-500" />
                <h2 className="text-xl font-bold tracking-wider text-cyan-400">Project Experience</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Completed Projects</label>
                  <input
                    type="number"
                    min="0"
                    value={projectsCompleted}
                    onChange={(e) => setProjectsCompleted(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500 rounded-lg py-2.5 px-3 text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Live / Deployed Projects</label>
                  <input
                    type="number"
                    min="0"
                    value={liveProjects}
                    onChange={(e) => setLiveProjects(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500 rounded-lg py-2.5 px-3 text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Team Projects</label>
                  <input
                    type="number"
                    min="0"
                    value={teamProjects}
                    onChange={(e) => setTeamProjects(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500 rounded-lg py-2.5 px-3 text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Estimated User Reach</label>
                  <select
                    value={userReach}
                    onChange={(e) => setUserReach(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500 rounded-lg py-2.5 px-3 text-slate-100 focus:outline-none"
                  >
                    <option value="0">0 users</option>
                    <option value="50">1-100 users</option>
                    <option value="500">100-1,000 users</option>
                    <option value="5000">1,000-10,000 users</option>
                    <option value="50000">10,000+ users</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-cyan-500" />
                <h2 className="text-xl font-bold tracking-wider text-cyan-400">Habits, Goals & Soft Skills</h2>
              </div>
              
              {/* Soft Skills Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-1">Soft Skills Rate (1-5)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skillList.soft.map(skill => (
                    <div key={skill} className="bg-slate-950/30 border border-slate-800/40 rounded-lg p-2.5 space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>{skill}</span>
                        <span className="text-cyan-400">{softLevels[skill] || 3}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={softLevels[skill] || 3}
                        onChange={(e) => setSoftLevels(prev => ({ ...prev, [skill]: parseInt(e.target.value) }))}
                        className="w-full accent-cyan-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Habits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-850">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Weekly Study Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="80"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(parseInt(e.target.value) || 20)}
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500 rounded-lg py-2 px-3 text-slate-100 focus:outline-none text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Technologies tried/year</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={newTechTried}
                    onChange={(e) => setNewTechTried(parseInt(e.target.value) || 2)}
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500 rounded-lg py-2 px-3 text-slate-100 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Debugging Efficiency</label>
                  <select
                    value={debugSpeed}
                    onChange={(e) => setDebugSpeed(e.target.value as 'slow' | 'average' | 'fast' | 'veryfast')}
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500 rounded-lg py-2 px-3 text-slate-100 focus:outline-none text-sm"
                  >
                    <option value="slow">Slow - Struggles</option>
                    <option value="average">Average - Functional</option>
                    <option value="fast">Fast - Efficient</option>
                    <option value="veryfast">Very Fast - Excellent</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Algorithm Proficiency</label>
                  <select
                    value={algorithmSkill}
                    onChange={(e) => setAlgorithmSkill(e.target.value as 'none' | 'basic' | 'intermediate' | 'advanced' | 'expert')}
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500 rounded-lg py-2 px-3 text-slate-100 focus:outline-none text-sm"
                  >
                    <option value="none">None</option>
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>

              {/* Goals */}
              <div className="space-y-2 pt-4 border-t border-slate-850">
                <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Short-Term Goal (3 Months)</label>
                <textarea
                  value={shortGoals}
                  onChange={(e) => setShortGoals(e.target.value)}
                  placeholder="What is your immediate goal?"
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-600 focus:outline-none text-sm h-20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Long-Term Goal (1 Year)</label>
                <textarea
                  value={longGoals}
                  onChange={(e) => setLongGoals(e.target.value)}
                  placeholder="Where do you want to be in 1 year?"
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500 rounded-lg py-2 px-3 text-slate-100 placeholder-slate-600 focus:outline-none text-sm h-20"
                />
              </div>

              {/* Industries */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">Industry Interest</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['web-apps', 'data-science', 'ai-ml', 'gaming', 'finance', 'health'].map(ind => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => handleIndustryChange(ind)}
                      className={`text-xs uppercase tracking-wider py-2 px-3 rounded-lg border text-center transition ${
                        industries.includes(ind) 
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold' 
                          : 'border-slate-800 bg-slate-950/20 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {ind.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">Project Preference</label>
                <div className="grid grid-cols-2 gap-2">
                  {['personal', 'opensource', 'freelance', 'corporate'].map(pref => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => handlePrefChange(pref)}
                      className={`text-xs uppercase tracking-wider py-2 px-3 rounded-lg border text-center transition ${
                        projectPreferences.includes(pref) 
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold' 
                          : 'border-slate-800 bg-slate-950/20 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* NAVIGATION CONTROLS */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1 || loading}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-100 transition uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          {step < 8 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold py-2.5 px-5 rounded-lg text-xs uppercase tracking-widest transition"
            >
              <span>Next Stage</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-purple-600 border border-cyan-400/40 hover:from-cyan-500 hover:to-purple-500 text-slate-100 font-bold py-2.5 px-6 rounded-lg text-xs uppercase tracking-widest transition shadow-lg shadow-purple-950/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'CALCULATING INITIATION...' : 'INITIALIZE SYSTEM'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
