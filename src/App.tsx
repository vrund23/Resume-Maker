/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  FolderOpen,
  CloudUpload,
  CheckCircle2,
  AlertCircle,
  LogIn,
  X,
  Type,
  Layout,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeData, Experience, Education, SkillGroup } from './types';
import { supabase } from './supabaseClient';
import Auth from './Auth';

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

const ResumePreview = React.forwardRef<HTMLDivElement, { data: ResumeData; template: string; }>(
  ({ data, template }, ref) => {
    return (
      <div 
        ref={ref}
        className={`bg-white shadow-2xl relative flex font-sans overflow-hidden transition-all duration-500 ${
          template === 'modern-sidebar' ? 'flex-row' : 
          template === 'tech-stack' ? 'font-mono p-12 flex-col' : 
          template === 'classic-executive' ? 'p-16 flex-col' :
          'p-12 flex-col'
        }`}
        style={{ width: '595px', minHeight: '842px' }}
      >
        {template === 'modern-sidebar' ? (
          /* Modern Sidebar: 30/70 asymmetric layout */
          <>
            <div className="w-[200px] bg-slate-50 p-8 flex flex-col gap-8 h-full border-r border-slate-100 flex-shrink-0">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                  {data.personalInfo.fullName || "[Your Name]"}
                </h2>
                <p className="text-[10px] font-black text-brand-primary uppercase tracking-wider">
                  {data.personalInfo.jobTitle || "[Job Title]"}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact</h4>
                  <div className="space-y-2 text-[10px] text-slate-600 font-medium">
                    <p className="break-all">
                      <a href={`mailto:${data.personalInfo.email}`} className="hover:text-brand-primary transition-colors underline-offset-2 hover:underline">
                        {data.personalInfo.email || "[Email]"}
                      </a>
                    </p>
                    <p>{data.personalInfo.phone || "[Phone]"}</p>
                    {data.personalInfo.linkedin && (
                      <p className="break-all">
                        <a 
                          href={data.personalInfo.linkedin.startsWith('http') ? data.personalInfo.linkedin : `https://${data.personalInfo.linkedin}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:text-brand-primary transition-colors underline-offset-2 hover:underline"
                        >
                          {data.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      </p>
                    )}
                    <p>{data.personalInfo.location || "[Location]"}</p>
                  </div>
                </div>

                {data.skills.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Expertise</h4>
                    <div className="space-y-4">
                      {data.skills.map(group => (
                        <div key={group.id}>
                          <p className="text-[10px] font-black text-slate-900 uppercase mb-1">{group.category || "[Category]"}</p>
                          <p className="text-[10px] text-slate-700 leading-tight">{group.items || "[Skills]"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 p-10 flex flex-col h-full overflow-hidden">
              <div className="space-y-8">
                {/* Summary */}
                <section>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Profile</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed italic">
                    {data.summary || "[Professional profile summary goes here...]"}
                  </p>
                </section>

                {/* Experience */}
                <section>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Experience</h3>
                  <div className="space-y-6">
                    {(data.experiences.length > 0 ? data.experiences : [{ id: 'empty', jobTitle: '[Job Title]', employer: '[Employer]', startDate: 'Start', endDate: 'End', description: '[Job description...]' }]).map(exp => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="text-[11px] font-bold text-slate-900">{exp.jobTitle}</h4>
                          <span className="text-[9px] text-slate-400 font-bold uppercase">{exp.startDate} — {exp.endDate}</span>
                        </div>
                        <p className="text-[10px] text-brand-secondary font-bold mb-2">{exp.employer}</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed px-4 border-l border-slate-100">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Education */}
                <section>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Education</h3>
                  <div className="space-y-4">
                    {(data.education.length > 0 ? data.education : [{ id: 'empty', degree: '[Degree]', school: '[School]', startDate: 'Start Year', endDate: 'End Year' }]).map(edu => (
                      <div key={edu.id} className="flex justify-between items-baseline">
                        <div>
                          <h4 className="text-[11px] font-bold text-slate-900">{edu.degree}</h4>
                          <p className="text-[10px] text-slate-500 font-medium">{edu.school}</p>
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold">{edu.startDate} — {edu.endDate}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </>
        ) : template === 'tech-stack' ? (
          /* Tech-Stack Specialist: Single-column, focus on badges */
          <>
            <header className="mb-10">
              <h2 className="text-4xl font-black text-brand-primary mb-2">
                {data.personalInfo.fullName || "[Your Name]"}
              </h2>
              <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 uppercase font-black tracking-widest border-t-2 border-brand-primary pt-3">
                <span>{data.personalInfo.jobTitle || "[Job Title]"}</span>
                <a href={`mailto:${data.personalInfo.email}`} className="hover:text-brand-primary transition-colors underline-offset-2 hover:underline">{data.personalInfo.email || "[Email]"}</a>
                <span>{data.personalInfo.phone || "[Phone]"}</span>
                {data.personalInfo.linkedin && (
                  <a 
                    href={data.personalInfo.linkedin.startsWith('http') ? data.personalInfo.linkedin : `https://${data.personalInfo.linkedin}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-brand-primary transition-colors underline-offset-2 hover:underline"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </header>

            <div className="space-y-10">
              {/* Summary */}
              <section>
                <h3 className="text-xs font-black bg-brand-primary text-white w-fit px-2 py-1 mb-4 uppercase tracking-widest">About</h3>
                <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
                  {data.summary || "[Professional profile summary goes here...]"}
                </p>
              </section>

              {/* Stack / Skills */}
              <section>
                <h3 className="text-xs font-black bg-brand-primary text-white w-fit px-2 py-1 mb-6 uppercase tracking-widest">Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.length > 0 ? data.skills.flatMap(s => s.items.split(',')).filter(item => item.trim()).map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-900 text-white rounded text-[10px] font-bold uppercase tracking-tight">{skill.trim()}</span>
                  )) : <span className="text-slate-300 italic text-xs">[Add skills to see stack...]</span>}
                </div>
              </section>

              {/* Experience */}
              <section className="space-y-8">
                <h3 className="text-xs font-black bg-brand-primary text-white w-fit px-2 py-1 mb-2 uppercase tracking-widest">Logs</h3>
                {(data.experiences.length > 0 ? data.experiences : [{ id: 'empty', jobTitle: '[Job Title]', employer: '[Employer]', startDate: 'Start', endDate: 'End', description: '[Job description...]' }]).map(exp => (
                  <div key={exp.id} className="border-l-4 border-slate-900 pl-6 py-1">
                    <h4 className="text-sm font-black text-slate-900">{exp.jobTitle} <span className="text-brand-secondary">@</span> {exp.employer}</h4>
                    <p className="text-[10px] text-slate-400 mb-3 font-bold">{exp.startDate} - {exp.endDate}</p>
                    <p className="text-[12px] text-slate-600 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </section>
              
              {/* Education */}
              {data.education.length > 0 && (
                <section>
                  <h3 className="text-xs font-black bg-brand-primary text-white w-fit px-2 py-1 mb-6 uppercase tracking-widest">Education</h3>
                  <div className="space-y-4">
                    {data.education.map(edu => (
                      <div key={edu.id}>
                        <h4 className="text-[12px] font-black text-slate-900">{edu.degree}</h4>
                        <p className="text-[11px] text-slate-500 font-bold">{edu.school} | {edu.startDate} — {edu.endDate}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </>
        ) : template === 'classic-executive' ? (
          /* Classic Executive: Centered single-column, serif */
          <>
            <header className="text-center mb-12 border-b-2 border-slate-900 pb-8">
              <h2 className="text-5xl font-serif font-bold text-slate-900 mb-4">
                {data.personalInfo.fullName || "[Your Name]"}
              </h2>
              <div className="flex flex-wrap justify-center gap-4 text-sm font-serif italic text-slate-600">
                <span>{data.personalInfo.jobTitle || "[Job Title]"}</span>
                {data.personalInfo.email && <><span>•</span><a href={`mailto:${data.personalInfo.email}`} className="hover:text-slate-900 transition-colors uppercase tracking-widest text-[10px] font-bold not-italic font-sans">{data.personalInfo.email}</a></>}
                {data.personalInfo.phone && <><span>•</span><span>{data.personalInfo.phone}</span></>}
                {data.personalInfo.linkedin && (
                  <>
                    <span>•</span>
                    <a 
                      href={data.personalInfo.linkedin.startsWith('http') ? data.personalInfo.linkedin : `https://${data.personalInfo.linkedin}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-slate-900 transition-colors uppercase tracking-widest text-[10px] font-bold not-italic font-sans"
                    >
                      LinkedIn
                    </a>
                  </>
                )}
                {data.personalInfo.location && <><span>•</span><span>{data.personalInfo.location}</span></>}
              </div>
            </header>
            
            <div className="space-y-10 font-serif">
              {/* Summary */}
              {data.summary && (
                <section>
                  <h3 className="text-center text-sm font-bold text-slate-900 mb-4 uppercase tracking-[0.25em] border-b border-slate-100 pb-1">Professional Profile</h3>
                  <p className="text-sm text-slate-700 leading-relaxed text-center italic px-10">
                    {data.summary}
                  </p>
                </section>
              )}

              {/* Work Experience */}
              <section>
                <h3 className="text-center text-sm font-bold text-slate-900 mb-6 uppercase tracking-[0.25em] border-b border-slate-100 pb-1">Professional Experience</h3>
                <div className="space-y-10">
                  {(data.experiences.length > 0 ? data.experiences : [{ id: 'empty', jobTitle: '[Job Title]', employer: '[Employer]', startDate: 'Start', endDate: 'End', description: '[Job description...]', city: '[City]' }]).map(exp => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="text-base font-bold text-slate-900">{exp.jobTitle}</h4>
                        <span className="text-[11px] font-bold text-slate-600">{exp.startDate} — {exp.endDate}</span>
                      </div>
                      <p className="text-xs font-bold italic text-slate-500 mb-4">{exp.employer}, {exp.city}</p>
                      <p className="text-[13px] text-slate-700 leading-relaxed text-justify">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section className="page-break">
                <h3 className="text-center text-sm font-bold text-slate-900 mb-6 uppercase tracking-[0.25em] border-b border-slate-100 pb-1">Education</h3>
                <div className="space-y-4">
                  {(data.education.length > 0 ? data.education : [{ id: 'empty', degree: '[Degree]', school: '[School]', startDate: 'Start Year', endDate: 'End Year' }]).map(edu => (
                    <div key={edu.id} className="text-center">
                      <h4 className="text-sm font-bold text-slate-900">{edu.degree}</h4>
                      <p className="text-xs text-slate-500 italic">{edu.school}, {edu.startDate} — {edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </section>
              
              {/* Skills */}
              {data.skills.length > 0 && (
                <section>
                  <h3 className="text-center text-sm font-bold text-slate-900 mb-6 uppercase tracking-[0.25em] border-b border-slate-100 pb-1">Technical Expertise</h3>
                  <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                    {data.skills.map(group => (
                      <div key={group.id} className="text-center">
                        <span className="text-[12px] font-black uppercase text-slate-900 block mb-1">{group.category}</span>
                        <p className="text-xs text-slate-700">{group.items}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </>
        ) : (
          /* Bold Impact: Timeline borders */
          <>
            <header className="mb-12 bg-slate-900 text-white -mx-12 -mt-12 p-16 shadow-inner w-[calc(100%+96px)]">
              <h2 className="text-5xl font-black mb-3 leading-none">
                {data.personalInfo.fullName || "[Your Name]"}
              </h2>
              <p className="text-lg font-black text-brand-accent uppercase tracking-[0.3em]">
                {data.personalInfo.jobTitle || "[Job Title]"}
              </p>
              <div className="mt-8 flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <a href={`mailto:${data.personalInfo.email}`} className="hover:text-brand-accent transition-colors">{data.personalInfo.email}</a>
                <span>{data.personalInfo.phone}</span>
                {data.personalInfo.linkedin && (
                  <a 
                    href={data.personalInfo.linkedin.startsWith('http') ? data.personalInfo.linkedin : `https://${data.personalInfo.linkedin}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-brand-accent transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
                <span>{data.personalInfo.location}</span>
              </div>
            </header>

            <div className="space-y-16">
              {/* Summary */}
              <section className="relative pl-12">
                <div className="absolute left-0 top-0 w-2 h-full bg-brand-secondary opacity-10 rounded-full" />
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-4">
                  01 <span className="w-12 h-[2px] bg-brand-secondary" /> Profile
                </h3>
                <p className="text-base text-slate-600 leading-relaxed font-bold opacity-80 italic">
                  "{data.summary || "[Write your profile impact statement here...]"}"
                </p>
              </section>

              {/* Timeline Experience */}
              <section className="relative pl-12">
                <div className="absolute left-0 top-0 w-2 h-full bg-brand-secondary opacity-20 rounded-full" />
                <h3 className="text-xl font-black text-slate-900 mb-10 flex items-center gap-4">
                  02 <span className="w-12 h-[2px] bg-brand-secondary" /> Experience
                </h3>
                <div className="space-y-12">
                  {(data.experiences.length > 0 ? data.experiences : [{ id: 'empty', jobTitle: '[Job Title]', employer: '[Employer]', startDate: 'Start', endDate: 'End', description: '[Describe your achievements...]' }]).map((exp) => (
                    <div key={exp.id} className="relative group">
                      <div className="absolute -left-12 top-2 w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center text-white font-black text-[10px] group-hover:scale-125 transition-transform">
                        ✓
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mb-1">{exp.jobTitle}</h4>
                      <p className="text-xs font-black text-brand-secondary mb-4 uppercase tracking-widest">{exp.employer} | {exp.startDate} - {exp.endDate}</p>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium opacity-90 border-l-2 border-slate-100 pl-6">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Skills & Education side by side */}
              <div className="grid grid-cols-2 gap-12 pl-12 relative">
                <div className="absolute left-0 top-0 w-2 h-full bg-brand-secondary opacity-10 rounded-full" />
                
                <section>
                  <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map(group => (
                      <div key={group.id} className="w-full">
                        <span className="text-[10px] font-black uppercase text-slate-900 block mb-2">{group.category}</span>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {group.items.split(',').filter(i => i.trim()).map((s, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-black uppercase">{s.trim()}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Edge</h3>
                  <div className="space-y-4">
                    {data.education.map(edu => (
                      <div key={edu.id}>
                        <p className="text-xs font-black text-slate-900">{edu.degree}</p>
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">{edu.school} | {edu.startDate} — {edu.endDate}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';

export default function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_DATA);
  const [activeStep, setActiveStep] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState(false);
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'tech-stack' | 'modern-sidebar' | 'classic-executive' | 'bold-impact'>('classic-executive');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [session, setSession] = useState<any>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoadingSession(false);
      if (session) fetchDrafts(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchDrafts(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchDrafts = async (userId: string) => {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setDrafts(data);
    }
  };

  const saveDraft = async () => {
    if (!session?.user) return;
    setSaveStatus('saving');
    try {
      const id = currentDraftId || crypto.randomUUID();
      const { error } = await supabase
        .from('resumes')
        .upsert({ 
          id: id,
          user_id: session.user.id,
          content: { ...resumeData, template: selectedTemplate },
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Supabase error saving:', error);
        throw error;
      }
      
      setCurrentDraftId(id);
      setSaveStatus('success');
      fetchDrafts(session.user.id);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error: any) {
      console.error('Catch error saving resume:', error);
      setSaveStatus('error');
      // Show error message for a longer period if it's an error
      setTimeout(() => setSaveStatus('idle'), 5000);
    }
  };

  const loadDraft = (draft: any) => {
    setResumeData(draft.content);
    setSelectedTemplate(draft.content.template || 'professional');
    setCurrentDraftId(draft.id);
    setIsDraftsModalOpen(false);
    setIsSettingsOpen(false);
  };

  const handleExportPDF = async () => {
    if (!resumeRef.current) return;
    
    // Hide controls during capture if necessary, but here we just capture the ref
    const canvas = await html2canvas(resumeRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`resume_${resumeData.personalInfo.fullName.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  };

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

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-brand-accent border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-brand-surface'} selection:bg-brand-accent/30`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 border-b transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-brand-outline-variant shadow-sm'}`}>
        <div className="flex items-center gap-2">
          <span className={`text-xl font-black tracking-tight font-serif ${isDarkMode ? 'text-white' : 'text-blue-950'}`}>Resume Maker</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={saveDraft}
            disabled={saveStatus === 'saving'}
            className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-all active:scale-95 duration-150 text-sm ${
              saveStatus === 'success' 
                ? 'bg-green-500 text-white' 
                : saveStatus === 'error'
                ? 'bg-red-500 text-white'
                : isDarkMode 
                ? 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700' 
                : 'bg-white border border-brand-primary text-brand-primary hover:bg-slate-50'
            }`}
          >
            {saveStatus === 'saving' ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <CloudUpload size={18} />
              </motion.div>
            ) : saveStatus === 'success' ? (
              <CheckCircle2 size={18} />
            ) : saveStatus === 'error' ? (
              <AlertCircle size={18} />
            ) : (
              <FolderOpen size={18} />
            )}
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved' : saveStatus === 'error' ? 'Error' : 'Save Draft'}
          </button>
          
          <button 
            onClick={handleExportPDF}
            className="px-4 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary/90 transition-colors active:scale-95 duration-150 text-sm"
          >
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
                  <button 
                    onClick={() => setIsDraftsModalOpen(true)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                  >
                    <FolderOpen size={16} />
                    View Drafts
                  </button>
                  <button 
                    onClick={() => supabase.auth.signOut()}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-red-500 ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                  >
                    <LogIn size={16} className="rotate-180" />
                    Sign Out
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
                  else handleExportPDF();
                }}
                className="px-8 py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary/95 transition-all text-sm shadow-md active:scale-95"
              >
                {activeStep === 5 ? "Finalize & Download" : "Next Step"}
              </button>
            </footer>
          </section>

          {/* Live Canvas (Preview) */}
          <section className="canvas-bg flex justify-center items-start overflow-y-auto p-12 custom-scrollbar relative">
            <ResumePreview 
              ref={resumeRef}
              data={resumeData}
              template={selectedTemplate}
            />

            {/* Preview FAB Controls */}
            <div className="fixed bottom-10 right-10 flex flex-col items-end gap-4 z-[80]">
              {/* Template Gallery */}
              <AnimatePresence>
                {isTemplateGalleryOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className={`shadow-2xl rounded-2xl p-4 border w-48 mb-2 ${
                      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-brand-outline-variant'
                    }`}
                  >
                    <h4 className={`text-xs font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-brand-primary'}`}>
                      <Palette size={14} className="text-brand-secondary" />
                      Select Layout
                    </h4>
                    <div className="space-y-2">
                      {(['tech-stack', 'modern-sidebar', 'classic-executive', 'bold-impact'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setSelectedTemplate(t);
                            setIsTemplateGalleryOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            selectedTemplate === t 
                              ? 'bg-brand-primary text-white shadow-md' 
                              : isDarkMode 
                                ? 'hover:bg-slate-700 text-slate-300' 
                                : 'hover:bg-slate-100 text-slate-600'
                          }`}
                        >
                          {t.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setIsTemplateGalleryOpen(!isTemplateGalleryOpen)}
                  className={`w-14 h-14 shadow-xl rounded-full flex items-center justify-center transition-all active:scale-90 border mb-0 ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-white' 
                      : 'bg-white border-slate-100 text-brand-primary'
                  } ${isTemplateGalleryOpen ? 'ring-2 ring-brand-accent' : ''}`}
                >
                  <Paintbrush size={24} />
                </button>
                <button 
                  onClick={() => setIsFullScreenPreview(true)}
                  className="w-14 h-14 bg-brand-secondary text-white shadow-xl rounded-full flex items-center justify-center hover:bg-brand-secondary/90 transition-all active:scale-90"
                >
                  <Maximize2 size={24} />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Full Screen Preview Modal */}
      <AnimatePresence>
        {isFullScreenPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex justify-center items-start overflow-y-auto p-12 custom-scrollbar"
          >
            <div className="relative">
              <button 
                onClick={() => setIsFullScreenPreview(false)}
                className="fixed top-8 right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[110]"
              >
                <X size={24} />
              </button>
              <div className="origin-top scale-[1.1] transition-transform duration-300 hover:scale-[1.15]">
                <ResumePreview 
                  data={resumeData}
                  template={selectedTemplate}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drafts Modal */}
      <AnimatePresence>
        {isDraftsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-lg rounded-2xl shadow-2xl p-6 relative overflow-hidden ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border'}`}
            >
              <button 
                onClick={() => setIsDraftsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className={`text-xl font-serif font-bold mb-6 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-brand-primary'}`}>
                <FolderOpen className="text-brand-secondary" />
                Select a Saved Draft
              </h2>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {drafts.length > 0 ? drafts.map((draft) => (
                  <button
                    key={draft.id}
                    onClick={() => loadDraft(draft)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all group ${
                      isDarkMode 
                        ? 'border-slate-700 hover:bg-slate-700 text-white' 
                        : 'border-slate-100 hover:border-brand-accent hover:bg-slate-50 text-brand-primary'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-sm">{draft.content?.personalInfo?.fullName || 'Untitled Resume'}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{new Date(draft.updated_at).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-brand-secondary/10 text-brand-secondary rounded-full text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                      Load Draft
                    </div>
                  </button>
                )) : (
                  <div className="py-12 text-center">
                    <p className="text-slate-400 text-sm font-medium italic">No saved drafts found.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
