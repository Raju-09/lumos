/**
 * Resume Builder Page - Complete Profile Form with AI Generation
 * Features: Name, Email, Skills, Projects, Internships, Education
 */
'use client';

import { useState, useEffect } from 'react';
import {
    FileText, Sparkles, Download, Save, Loader2, Target, Wand2,
    User, Mail, GraduationCap, Briefcase, Code, Plus, Trash2, ChevronDown
} from 'lucide-react';
import { generateResume, Student } from '@/lib/gemini-ai';
import { getAccessLevel } from '@/lib/access-control';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
    title: string;
    techStack: string[];
    description: string;
}

interface Internship {
    company: string;
    role: string;
    duration: string;
    description: string;
}

export default function ResumeBuilderPage() {
    const [generating, setGenerating] = useState(false);
    const [resumeContent, setResumeContent] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [accessLevel, setAccessLevel] = useState<any>(null);
    const [expandedSection, setExpandedSection] = useState<string>('profile');

    // Profile Form State
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        branch: 'CSE',
        academicYear: 4,
        cgpa: 8.0,
        linkedIn: '',
        github: ''
    });

    // Skills
    const [skills, setSkills] = useState<string[]>(['JavaScript', 'React', 'Node.js']);
    const [newSkill, setNewSkill] = useState('');

    // Projects
    const [projects, setProjects] = useState<Project[]>([
        { title: '', techStack: [], description: '' }
    ]);

    // Internships
    const [internships, setInternships] = useState<Internship[]>([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('lumos_user') || '{}');
        if (user) {
            setProfile(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                branch: user.branch || 'CSE',
                academicYear: user.academicYear || 4,
                cgpa: user.cgpa || 8.0
            }));
            if (user.skills) setSkills(user.skills);
            if (user.academicYear) {
                setAccessLevel(getAccessLevel(user.academicYear));
            }
        }
    }, []);

    const addSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skill: string) => {
        setSkills(skills.filter(s => s !== skill));
    };

    const addProject = () => {
        setProjects([...projects, { title: '', techStack: [], description: '' }]);
    };

    const updateProject = (index: number, field: keyof Project, value: any) => {
        const updated = [...projects];
        if (field === 'techStack' && typeof value === 'string') {
            updated[index][field] = value.split(',').map(s => s.trim()).filter(Boolean);
        } else {
            (updated[index] as any)[field] = value;
        }
        setProjects(updated);
    };

    const removeProject = (index: number) => {
        setProjects(projects.filter((_, i) => i !== index));
    };

    const addInternship = () => {
        setInternships([...internships, { company: '', role: '', duration: '', description: '' }]);
    };

    const updateInternship = (index: number, field: keyof Internship, value: string) => {
        const updated = [...internships];
        updated[index][field] = value;
        setInternships(updated);
    };

    const removeInternship = (index: number) => {
        setInternships(internships.filter((_, i) => i !== index));
    };

    const handleGenerateResume = async () => {
        if (!targetRole.trim()) {
            alert('Please enter a target role');
            return;
        }
        if (!profile.name.trim()) {
            alert('Please enter your name');
            return;
        }

        setGenerating(true);
        try {
            const student: Student = {
                name: profile.name,
                branch: profile.branch,
                academicYear: profile.academicYear,
                cgpa: profile.cgpa,
                skills: skills,
                projects: projects.filter(p => p.title.trim()),
                internships: internships.filter(i => i.company.trim())
            };

            const content = await generateResume(student, targetRole);
            setResumeContent(content);

            // Save profile to localStorage
            const user = JSON.parse(localStorage.getItem('lumos_user') || '{}');
            user.skills = skills;
            user.projects = projects;
            user.internships = internships;
            user.cgpa = profile.cgpa;
            user.branch = profile.branch;
            localStorage.setItem('lumos_user', JSON.stringify(user));

        } catch (error) {
            console.error('Error generating resume:', error);
            alert('Failed to generate resume. Please check your API key and try again.');
        } finally {
            setGenerating(false);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([resumeContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${profile.name.replace(/\s+/g, '_')}_Resume_${targetRole.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const SectionHeader = ({ id, title, icon: Icon }: { id: string, title: string, icon: any }) => (
        <button
            onClick={() => setExpandedSection(expandedSection === id ? '' : id)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900 dark:text-white">{title}</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${expandedSection === id ? 'rotate-180' : ''}`} />
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Resume Builder</h1>
                        <p className="text-gray-600 dark:text-gray-400">Fill your profile and generate ATS-optimized resumes</p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Form */}
                <div className="space-y-4">
                    {/* Profile Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                        <SectionHeader id="profile" title="Personal Information" icon={User} />
                        <AnimatePresence>
                            {expandedSection === 'profile' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="p-4 space-y-4"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                                                placeholder="john@email.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Branch</label>
                                            <select
                                                value={profile.branch}
                                                onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                                            >
                                                <option value="CSE">CSE</option>
                                                <option value="IT">IT</option>
                                                <option value="ECE">ECE</option>
                                                <option value="EEE">EEE</option>
                                                <option value="MECH">MECH</option>
                                                <option value="CIVIL">CIVIL</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                                            <select
                                                value={profile.academicYear}
                                                onChange={(e) => setProfile({ ...profile, academicYear: Number(e.target.value) })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                                            >
                                                <option value={1}>1st Year</option>
                                                <option value={2}>2nd Year</option>
                                                <option value={3}>3rd Year</option>
                                                <option value={4}>4th Year</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CGPA</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="10"
                                                value={profile.cgpa}
                                                onChange={(e) => setProfile({ ...profile, cgpa: parseFloat(e.target.value) || 0 })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn URL</label>
                                            <input
                                                type="url"
                                                value={profile.linkedIn}
                                                onChange={(e) => setProfile({ ...profile, linkedIn: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                                                placeholder="linkedin.com/in/johndoe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
                                            <input
                                                type="url"
                                                value={profile.github}
                                                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                                placeholder="github.com/johndoe"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Skills Section */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <SectionHeader id="skills" title="Technical Skills" icon={Code} />
                        <AnimatePresence>
                            {expandedSection === 'skills' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="p-4"
                                >
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                                            placeholder="Add a skill (e.g., Python, React, AWS)"
                                        />
                                        <button
                                            onClick={addSkill}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-purple-100 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 text-purple-800 dark:text-purple-100 rounded-full text-sm flex items-center gap-2"
                                            >
                                                {skill}
                                                <button onClick={() => removeSkill(skill)} className="hover:text-purple-600 dark:hover:text-purple-400">
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Projects Section */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <SectionHeader id="projects" title="Projects" icon={Briefcase} />
                        <AnimatePresence>
                            {expandedSection === 'projects' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="p-4 space-y-4"
                                >
                                    {projects.map((project, i) => (
                                        <div key={i} className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg space-y-3">
                                            <div className="flex justify-between items-start">
                                                <input
                                                    type="text"
                                                    value={project.title}
                                                    onChange={(e) => updateProject(i, 'title', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                                                    placeholder="Project Title"
                                                />
                                                <button
                                                    onClick={() => removeProject(i)}
                                                    className="ml-2 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                value={project.techStack.join(', ')}
                                                onChange={(e) => updateProject(i, 'techStack', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                                                placeholder="Tech Stack (comma separated): React, Node.js, MongoDB"
                                            />
                                            <textarea
                                                value={project.description}
                                                onChange={(e) => updateProject(i, 'description', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                                                rows={2}
                                                placeholder="Brief description and impact..."
                                            />
                                        </div>
                                    ))}
                                    <button
                                        onClick={addProject}
                                        className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg text-gray-500 dark:text-gray-400 hover:border-purple-500 dark:hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Project
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Internships Section */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <SectionHeader id="internships" title="Internships / Experience" icon={GraduationCap} />
                        <AnimatePresence>
                            {expandedSection === 'internships' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="p-4 space-y-4"
                                >
                                    {internships.length === 0 && (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No internships added yet. Click below to add.</p>
                                    )}
                                    {internships.map((intern, i) => (
                                        <div key={i} className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg space-y-3">
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    value={intern.company}
                                                    onChange={(e) => updateInternship(i, 'company', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                                                    placeholder="Company Name"
                                                />
                                                <input
                                                    type="text"
                                                    value={intern.role}
                                                    onChange={(e) => updateInternship(i, 'role', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                                                    placeholder="Role"
                                                />
                                                <button
                                                    onClick={() => removeInternship(i)}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                value={intern.duration}
                                                onChange={(e) => updateInternship(i, 'duration', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                                                placeholder="Duration (e.g., May 2024 - July 2024)"
                                            />
                                            <textarea
                                                value={intern.description}
                                                onChange={(e) => updateInternship(i, 'description', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                                                rows={2}
                                                placeholder="Key responsibilities and achievements..."
                                            />
                                        </div>
                                    ))}
                                    <button
                                        onClick={addInternship}
                                        className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg text-gray-500 dark:text-gray-400 hover:border-purple-500 dark:hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Internship
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Generate Button */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Target className="w-4 h-4 inline mr-2" />
                                Target Role *
                            </label>
                            <input
                                type="text"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                placeholder="e.g., Software Engineer, Full Stack Developer, Data Analyst"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-950 text-gray-900 dark:text-white"
                            />
                        </div>
                        <button
                            onClick={handleGenerateResume}
                            disabled={generating || !targetRole.trim() || !profile.name.trim()}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating with Gemini AI...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-5 h-5" />
                                    Generate ATS Resume
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right: Preview */}
                <div>
                    {resumeContent ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden sticky top-6"
                        >
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white">
                                    <FileText className="w-5 h-5" />
                                    <span className="font-medium">Generated Resume</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDownload}
                                        className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <textarea
                                    value={resumeContent}
                                    onChange={(e) => setResumeContent(e.target.value)}
                                    className="w-full h-[600px] font-mono text-sm border border-gray-300 dark:border-slate-700 rounded-lg p-4 focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-900 rounded-xl border border-purple-200 dark:border-slate-800 p-8 text-center sticky top-6">
                            <div className="w-20 h-20 bg-purple-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-10 h-10 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your Resume Preview</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">Fill in your details and click "Generate ATS Resume" to create your personalized resume.</p>
                            <div className="text-left space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <p className="flex items-center gap-2">
                                    <span className="text-purple-600">✓</span>
                                    ATS-optimized formatting
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="text-purple-600">✓</span>
                                    Tailored to your target role
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="text-purple-600">✓</span>
                                    Industry-standard sections
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="text-purple-600">✓</span>
                                    Keyword optimization
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
