/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  BrainCircuit, 
  FileText, 
  Settings, 
  Trash2,
  GripVertical,
  PlusCircle,
  ArrowLeft,
  Paintbrush,
  Maximize2,
  Moon,
  Sun,
  Camera,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeData, Experience, Education, SkillGroup } from './types';

const INITIAL_DATA: ResumeData = {
  personalInfo: {
    fullName: "Marcus Sterling",
    jobTitle: "Senior Product Designer",
    email: "marcus.s@vertex.ai",
    phone: "+1 (555) 000-0000",
    linkedin: "linkedin.com/in/marcus",
    location: "San Francisco",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWzXQA8Orbfk_o1pDzG_bM2dX1JG3H5A3VpOLwBOCPKCSf_1GqeshBqptOiX8ZFM26kiH-T-L6Rs04QCOszu7kb2vaMMS0n_l605Laib7MpWRx4DlILrAM_v42ovFbSQ1uJcgMImyXBdcKrQ7ZG0LMMTp8ITgf8abg-A6mwbULIXQGRSos5ELoTLC-Us9T_H1O_3zFO23-XWqtVqvKKMKXcZQX84LlJpnHknh3_GiUjBsCflnn75gMPquitXgWMgQkzRlLOz9T8U4"
  },
  summary: "Results-driven Senior Product Designer with 5+ years of experience in creating user-centric digital products. Specializing in design systems and complex enterprise dashboards.",
  experiences: [
    {
      id: "1",
      jobTitle: "Senior Product Designer",
      employer: "Vertex AI Systems",
      city: "San Francisco, CA",
      startDate: "Jan 2021",
      endDate: "Present",
      description: "Led the redesign of the core enterprise dashboard, resulting in a 40% increase in user efficiency and a 25% reduction in churn."
    }
  ],
  education: [
    {
      id: "1",
      degree: "BFA in Interaction Design",
      school: "California College of the Arts",
      city: "San Francisco, CA",
      startDate: "2014",
      endDate: "2018"
    }
  ],
  skills: [
    {
      id: "1",
      category: "Design Systems",
      items: "Figma, Tailwind CSS, React",
      highlightedItems: "Atomic Design"
    }
  ]
};

export default function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_DATA);
  const [activeStep, setActiveStep] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo('avatarUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Math.random().toString(36).substr(2, 9),
      jobTitle: "",
      employer: "",
      city: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    setResumeData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExp]
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Math.random().toString(36).substr(2, 9),
      degree: "",
      school: "",
      city: "",
      startDate: "",
      endDate: ""
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const updateSkill = (id: string, field: keyof SkillGroup, value: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(s => 
        s.id === id ? { ...s, [field]: value } : s
      )
    }));
  };

  const addSkillGroup = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, { id: Math.random().toString(36).substr(2, 9), category: "", items: "", highlightedItems: "" }]
    }));
  };

  const removeSkillGroup = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
  };

  const STEPS = [
    { icon: User, label: 'Contact', step: 1 },
    { icon: GraduationCap, label: 'Education', step: 2 },
    { icon: Briefcase, label: 'Experience', step: 3 },
    { icon: BrainCircuit, label: 'Skills', step: 4 },
    { icon: FileText, label: 'Summary', step: 5 },
  ];

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-brand-surface'} selection:bg-brand-accent/30`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 border-b transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-brand-outline-variant shadow-sm'}`}>
        <div className="flex items-center gap-2">
          <span className={`text-xl font-black tracking-tight font-serif ${isDarkMode ? 'text-white' : 'text-blue-950'}`}>Resume Maker</span>
        </div>
        <div className="flex items-center gap-4">
          <button className={`px-4 py-2 border font-bold rounded-lg transition-colors active:scale-95 duration-150 text-sm ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-brand-primary text-brand-primary hover:bg-slate-50'}`}>
            Save Draft
          </button>
          <button className="px-4 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary/90 transition-colors active:scale-95 duration-150 text-sm">
            Export PDF
          </button>
          <div className="flex gap-2 ml-4 border-l pl-4 border-brand-outline-variant relative">
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors"
            >
              <Settings size={20} />
            </button>
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-2xl border p-2 z-[60] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-brand-outline-variant'}`}
                >
                  <button 
                    onClick={toggleTheme}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                  >
                    {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                    <FolderOpen size={16} />
                    Saved Drafts
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16 h-screen">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 border-r flex flex-col font-serif transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-brand-surface-low border-brand-outline-variant'}`}>
          <div className="px-6 py-8">
            <div className="flex flex-col mb-3">
              <h3 className={`font-bold leading-tight text-sm ${isDarkMode ? 'text-white' : 'text-brand-primary'}`}>Resume Draft</h3>
              <p className={`text-[10px] uppercase tracking-wider font-sans font-bold ${isDarkMode ? 'text-brand-accent' : 'text-brand-secondary'}`}>
                {Math.round((activeStep / 5) * 100)}%
              </p>
            </div>
            <div className={`w-full h-1 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(activeStep / 5) * 100}%` }}
                className="bg-brand-secondary h-full" 
              />
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-2 font-sans overflow-y-auto">
            {STEPS.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveStep(item.step)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium ${
                  activeStep === item.step 
                    ? isDarkMode 
                      ? 'bg-slate-800 text-white border-l-4 border-brand-accent shadow-lg translate-x-1 font-bold'
                      : 'bg-white text-brand-primary border-l-4 border-brand-accent shadow-sm translate-x-1 font-bold' 
                    : isDarkMode 
                      ? 'text-slate-500 hover:bg-slate-800 hover:text-slate-300' 
                      : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <item.icon size={18} strokeWidth={activeStep === item.step ? 2.5 : 2} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Grid */}
        <main className="ml-64 flex-1 grid grid-cols-[45%_55%] overflow-hidden">
          {/* Input Studio */}
          <section className="overflow-y-auto px-8 py-10 bg-white border-r border-brand-outline-variant custom-scrollbar relative">
            <header className="mb-10">
              <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-[0.2em] mb-2 block">Step {activeStep} of 5</span>
              <h1 className="text-3xl font-serif font-semibold text-brand-primary">
                {activeStep === 1 && "Contact Information"}
                {activeStep === 2 && "Education"}
                {activeStep === 3 && "Work Experience"}
                {activeStep === 4 && "Skills"}
                {activeStep === 5 && "Resume Summary"}
              </h1>
              <p className="text-slate-500 text-sm mt-2 font-sans font-medium">
                {activeStep === 1 && "Start with the basics. How can recruiters reach you?"}
                {activeStep === 2 && "Where did you study? Add your degrees and certifications."}
                {activeStep === 3 && "Highlight your impact with quantified achievements."}
                {activeStep === 4 && "What are you good at? Group your skills into categories."}
                {activeStep === 5 && "Write a compelling summary to grab attention."}
              </p>
            </header>

            <div className="pb-32">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* STEP 1: CONTACT */}
                  {activeStep === 1 && (
                    <div className="bg-white border border-brand-outline-variant p-6 rounded-lg resume-preview-shadow grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Full Name</label>
                        <input className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-3 filled-input text-on-surface text-sm" type="text" value={resumeData.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Professional Title</label>
                        <input className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-3 filled-input text-on-surface text-sm" type="text" value={resumeData.personalInfo.jobTitle} onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Email Address</label>
                        <input className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-3 filled-input text-on-surface text-sm" type="email" value={resumeData.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Phone Number</label>
                        <input className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-3 filled-input text-on-surface text-sm" type="text" value={resumeData.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">LinkedIn Profile</label>
                        <input className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-3 filled-input text-on-surface text-sm" type="text" value={resumeData.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Location</label>
                        <input className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-3 filled-input text-on-surface text-sm" type="text" value={resumeData.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} />
                      </div>
                    </div>
                  )}

                  {/* STEP 2: EDUCATION */}
                  {activeStep === 2 && (
                    <div className="space-y-6">
                      {resumeData.education.map((edu) => (
                        <div key={edu.id} className="bg-white border border-brand-outline-variant p-6 rounded-lg resume-preview-shadow relative group grid grid-cols-2 gap-4">
                          <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 p-1.5 opacity-0 group-hover:opacity-100 hover:text-red-500 text-slate-400 transition-all"><Trash2 size={16} /></button>
                          <div className="col-span-2">
                            <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Degree / Certification</label>
                            <input className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-3 filled-input text-on-surface text-sm" type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} placeholder="e.g. BS in Computer Science" />
                          </div>
                          <div className="col-span-2">
                            <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">School / Institution</label>
                            <input className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-3 filled-input text-on-surface text-sm" type="text" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Start Year</label>
                            <input className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-3 filled-input text-on-surface text-sm" type="text" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">End Year (or Expected)</label>
                            <input className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-3 filled-input text-on-surface text-sm" type="text" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} />
                          </div>
                        </div>
                      ))}
                      <button onClick={addEducation} className="w-full py-4 border-2 border-dashed border-brand-outline-variant text-brand-primary font-bold rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 text-sm"><PlusCircle size={20} className="text-brand-secondary" /> Add Education</button>
                    </div>
                  )}

                  {/* STEP 3: EXPERIENCE */}
                  {activeStep === 3 && (
                    <div className="space-y-6">
                      {resumeData.experiences.map((exp) => (
                        <div key={exp.id} className="bg-white border border-brand-outline-variant p-6 rounded-lg resume-preview-shadow relative group grid grid-cols-2 gap-4">
                          <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 p-1.5 opacity-0 group-hover:opacity-100 hover:text-red-500 text-slate-400 transition-all"><Trash2 size={16} /></button>
                          <div className="col-span-2">
                            <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Job Title</label>
                            <input className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-3 filled-input text-on-surface text-sm" type="text" value={exp.jobTitle} onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Employer</label>
                            <input className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-3 filled-input text-on-surface text-sm" type="text" value={exp.employer} onChange={(e) => updateExperience(exp.id, 'employer', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">City</label>
                            <input className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-3 filled-input text-on-surface text-sm" type="text" value={exp.city} onChange={(e) => updateExperience(exp.id, 'city', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Start Date</label>
                            <input className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-3 filled-input text-on-surface text-sm" type="text" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">End Date</label>
                            <input className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-3 filled-input text-on-surface text-sm" type="text" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} />
                          </div>
                          <div className="col-span-2">
                            <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Description</label>
                            <textarea className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-3 filled-input text-on-surface text-sm resize-none h-32" value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} />
                          </div>
                        </div>
                      ))}
                      <button onClick={addExperience} className="w-full py-4 border-2 border-dashed border-brand-outline-variant text-brand-primary font-bold rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 text-sm"><PlusCircle size={20} className="text-brand-secondary" /> Add Experience</button>
                    </div>
                  )}

                  {/* STEP 4: SKILLS */}
                  {activeStep === 4 && (
                    <div className="space-y-6">
                      {resumeData.skills.map((skillGroup) => (
                        <div key={skillGroup.id} className="bg-white border border-brand-outline-variant p-6 rounded-lg resume-preview-shadow relative group space-y-4">
                          <button onClick={() => removeSkillGroup(skillGroup.id)} className="absolute top-4 right-4 p-1.5 opacity-0 group-hover:opacity-100 hover:text-red-500 text-slate-400 transition-all"><Trash2 size={16} /></button>
                          <div>
                            <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Category</label>
                            <input className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-3 filled-input text-on-surface text-sm" type="text" value={skillGroup.category} onChange={(e) => updateSkill(skillGroup.id, 'category', e.target.value)} placeholder="e.g. Design Systems" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Skills (comma separated)</label>
                            <input className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-3 filled-input text-on-surface text-sm" type="text" value={skillGroup.items} onChange={(e) => updateSkill(skillGroup.id, 'items', e.target.value)} placeholder="Figma, Tailwind, React" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Highlighted Skill</label>
                            <input className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-3 filled-input text-on-surface text-sm" type="text" value={skillGroup.highlightedItems} onChange={(e) => updateSkill(skillGroup.id, 'highlightedItems', e.target.value)} placeholder="Atomic Design" />
                          </div>
                        </div>
                      ))}
                      <button onClick={addSkillGroup} className="w-full py-4 border-2 border-dashed border-brand-outline-variant text-brand-primary font-bold rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 text-sm"><PlusCircle size={20} className="text-brand-secondary" /> Add Skill Category</button>
                    </div>
                  )}

                  {/* STEP 5: SUMMARY */}
                  {activeStep === 5 && (
                    <div className="bg-white border border-brand-outline-variant p-6 rounded-lg resume-preview-shadow">
                      <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-2">Professional Summary</label>
                      <textarea 
                        className="w-full bg-brand-surface-low border-0 border-b border-brand-primary p-4 filled-input text-on-surface text-sm resize-none h-48 leading-relaxed" 
                        value={resumeData.summary} 
                        onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                        placeholder="e.g. Motivated Senior Product Designer with a track record of..."
                      />
                      <div className="mt-8 p-4 bg-brand-accent/5 border border-brand-accent/20 rounded-lg">
                        <p className="text-xs text-brand-secondary font-medium italic">
                          Tip: Keep your summary between 2-4 sentences and focus on your greatest strengths and career goals.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <footer className="absolute bottom-0 left-0 w-full px-8 py-8 bg-white/80 backdrop-blur-md border-t border-slate-100 flex justify-between z-10">
              <button 
                onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                disabled={activeStep === 1}
                className={`flex items-center gap-2 font-bold text-sm transition-all ${activeStep === 1 ? 'text-slate-300' : 'text-brand-primary hover:translate-x-[-4px]'}`}
              >
                <ArrowLeft size={18} />
                Previous
              </button>
              <button 
                onClick={() => {
                  if (activeStep < 5) setActiveStep(prev => prev + 1);
                }}
                className="px-8 py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary/95 transition-all text-sm shadow-md active:scale-95"
              >
                {activeStep === 5 ? "Finalize & Download" : "Next Step"}
              </button>
            </footer>
          </section>

          {/* Live Canvas (Preview) */}
          <section className="canvas-bg flex justify-center items-start overflow-y-auto p-12 custom-scrollbar">
            <motion.div 
              layout
              className="bg-white w-[595px] min-h-[842px] p-12 shadow-2xl relative mb-12 flex flex-col font-sans"
            >
              {/* Resume Header */}
              <header className="mb-10 text-center">
                <h2 className="text-4xl font-serif font-black text-brand-primary tracking-tight mb-3">
                  {resumeData.personalInfo.fullName || "Your Name"}
                </h2>
                <div className="flex flex-wrap justify-center items-center gap-3 text-[9px] font-bold text-brand-secondary uppercase tracking-[0.1em]">
                  <span className="text-brand-primary">{resumeData.personalInfo.jobTitle}</span>
                  <span className="w-1 h-1 bg-brand-secondary rounded-full opacity-30"></span>
                  <span>{resumeData.personalInfo.email}</span>
                  {resumeData.personalInfo.phone && (
                    <>
                      <span className="w-1 h-1 bg-brand-secondary rounded-full opacity-30"></span>
                      <span>{resumeData.personalInfo.phone}</span>
                    </>
                  )}
                  {resumeData.personalInfo.linkedin && (
                    <>
                      <span className="w-1 h-1 bg-brand-secondary rounded-full opacity-30"></span>
                      <span>{resumeData.personalInfo.linkedin}</span>
                    </>
                  )}
                  <span className="w-1 h-1 bg-brand-secondary rounded-full opacity-30"></span>
                  <span>{resumeData.personalInfo.location}</span>
                </div>
              </header>

              {/* Resume Sections */}
              <div className="space-y-10">
                {/* Summary Section */}
                {resumeData.summary && (
                  <section>
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Professional Summary</h3>
                      <div className="h-[1px] flex-1 bg-slate-100"></div>
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed italic font-medium">{resumeData.summary}</p>
                  </section>
                )}

                {/* Experience Section */}
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-base font-serif font-bold text-brand-primary whitespace-nowrap">Work Experience</h3>
                    <div className="h-[1px] flex-1 bg-slate-200"></div>
                  </div>
                  
                  <div className="space-y-8">
                    {resumeData.experiences.length > 0 ? resumeData.experiences.map((exp, idx) => (
                      <div key={exp.id} className={idx === 1 ? 'opacity-50 blur-[0.5px]' : ''}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="text-base font-bold text-brand-primary">{exp.jobTitle || "Job Title"}</h4>
                          <span className="text-[10px] text-slate-500 italic font-medium">{exp.startDate} — {exp.endDate}</span>
                        </div>
                        <p className="text-[11px] text-brand-secondary font-bold mb-2">{exp.employer}{exp.city ? `, ${exp.city}` : ''}</p>
                        <div className="text-[11px] text-slate-600 leading-relaxed font-medium">
                          {exp.description && (
                            <ul className="list-disc ml-5 space-y-1">
                              {exp.description.split('\n').map((line, i) => (
                                <li key={i}>{line}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )) : <p className="text-[11px] text-slate-400 italic">No experience added yet...</p>}
                  </div>
                </section>

                {/* Education Section */}
                {resumeData.education.length > 0 && (
                  <section>
                    <div className="flex items-center gap-4 mb-6">
                      <h3 className="text-base font-serif font-bold text-brand-primary whitespace-nowrap">Education</h3>
                      <div className="h-[1px] flex-1 bg-slate-200"></div>
                    </div>
                    <div className="space-y-4">
                      {resumeData.education.map(edu => (
                        <div key={edu.id} className="flex justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-brand-primary">{edu.degree || "Degree"}</h4>
                            <p className="text-[10px] text-brand-secondary font-semibold">{edu.school} {edu.city ? ` | ${edu.city}` : ''}</p>
                          </div>
                          <span className="text-[10px] text-slate-500 italic font-medium">{edu.startDate} — {edu.endDate}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Skills Section */}
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-base font-serif font-bold text-brand-primary whitespace-nowrap">Technical Expertise</h3>
                    <div className="h-[1px] flex-1 bg-slate-200"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {resumeData.skills.length > 0 ? resumeData.skills.map(skillGroup => (
                      <div key={skillGroup.id} className="p-4 bg-brand-surface-low border border-slate-100 rounded">
                        <h5 className="text-[9px] font-black text-brand-primary mb-2 uppercase tracking-wider">{skillGroup.category || "Category"}</h5>
                        <div className="flex flex-wrap gap-1.5">
                          {skillGroup.items.split(',').filter(item => item.trim()).map(item => (
                            <span key={item} className="px-1.5 py-0.5 bg-white border border-slate-200 text-slate-500 text-[8px] font-bold rounded uppercase">{item.trim()}</span>
                          ))}
                          {skillGroup.highlightedItems && (
                            <span className="px-1.5 py-0.5 bg-brand-secondary text-white text-[8px] font-bold rounded uppercase shadow-sm">{skillGroup.highlightedItems}</span>
                          )}
                        </div>
                      </div>
                    )) : <p className="text-[11px] text-slate-400 italic col-span-2">No skills added yet...</p>}
                  </div>
                </section>
              </div>

              {/* Signature/Footer Decorative */}
              <div className="mt-auto pt-12 flex justify-center">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiZRUrUx9Gp3rIxivGZUkCH3oGjBRXqyJCPgCjUHvPI_ZKbocpbKInnweoDL2T0yQ2BrQfg0BvPx79MpwA_-qxWPQQ34iNnFqPoUIn9ivAUECgmAf1uwfvBf3UPMco_0qB-uq1YUyFczztOOC9QumYHXSDPYX3w6zV37Qs5AHkvkgR9C24PrdcgH8JsX_mRKa81McroSmECQ0aI0MsmUg-KQDXV3TYumtJlj_c7Mst9DTD5CeP8aeuBkqSOtmwnwk3P_o6H3T_9X0" 
                  alt="Signature" 
                  className="w-24 opacity-10 grayscale"
                />
              </div>
            </motion.div>

            {/* Preview FAB Controls */}
            <div className="fixed bottom-10 right-10 flex flex-col gap-4">
              <button className="w-14 h-14 bg-white shadow-xl rounded-full flex items-center justify-center text-brand-primary hover:text-brand-secondary transition-all active:scale-90 border border-slate-100">
                <Paintbrush size={24} />
              </button>
              <button className="w-14 h-14 bg-brand-secondary text-white shadow-xl rounded-full flex items-center justify-center hover:bg-brand-secondary/90 transition-all active:scale-90">
                <Maximize2 size={24} />
              </button>
            </div>
          </section>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}} />
    </div>
  );
}
