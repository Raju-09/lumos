
/**
 * Student Profile Page - Comprehensive Tabbed Interface
 * Detailed profile management similar to Lumos style
 */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, GraduationCap, Briefcase, Code, Award, FileText, Save, CheckCircle,
    Plus, Edit2, Trash2, BookOpen, Globe, Building2, Calendar, Mail, Phone, MapPin, TrendingUp, Camera
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// Tab configuration
const TABS = [
    { id: 'basic', label: 'Basic Details', icon: User },
    { id: 'performance', label: 'Performance Tracking', icon: TrendingUp },
    { id: 'education', label: 'Education Details', icon: GraduationCap },
    { id: 'experience', label: 'Internship & Work Ex', icon: Briefcase },
    { id: 'skills', label: 'Skills & Languages', icon: Code },
    { id: 'projects', label: 'Projects', icon: BookOpen },
    { id: 'achievements', label: 'Accomplishments', icon: Award },
    { id: 'resume', label: 'Resume & Docs', icon: FileText },
];

interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    link?: string;
}

interface Internship {
    id: string;
    company: string;
    role: string;
    duration: string;
    description: string;
}

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('basic');
    const [userData, setUserData] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        branch: '',
        academicYear: 4,
        cgpa: '',
        rollNumber: '',
        college: '',
        passoutYear: 2027,
        skills: [] as string[],
        languages: [] as string[],
        projects: [] as Project[],
        internships: [] as Internship[],
        achievements: [] as string[],
    });

    const [newSkill, setNewSkill] = useState('');
    const [newLanguage, setNewLanguage] = useState('');
    const [newAchievement, setNewAchievement] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('lumos_user') || '{}');
        setUserData(user);
        setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            dateOfBirth: user.dateOfBirth || '',
            gender: user.gender || '',
            address: user.address || '',
            branch: user.branch || '',
            academicYear: user.academicYear || 4,
            cgpa: user.cgpa || '',
            rollNumber: user.rollNumber || user.rollNo || '',
            college: user.college || 'University',
            passoutYear: user.passoutYear || 2027,
            skills: user.skills || [],
            languages: user.languages || [],
            projects: user.projects || [],
            internships: user.internships || [],
            achievements: user.achievements || [],
        });
        setAvatar(user.avatar || null);
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const updatedUser = { ...userData, ...formData, avatar };
        localStorage.setItem('lumos_user', JSON.stringify(updatedUser));
        await new Promise(r => setTimeout(r, 500));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const addSkill = () => {
        if (newSkill && !formData.skills.includes(newSkill)) {
            setFormData({ ...formData, skills: [...formData.skills, newSkill] });
            setNewSkill('');
        }
    };

    const removeSkill = (skill: string) => {
        setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
    };

    const addLanguage = () => {
        if (newLanguage && !formData.languages.includes(newLanguage)) {
            setFormData({ ...formData, languages: [...formData.languages, newLanguage] });
            setNewLanguage('');
        }
    };

    const addAchievement = () => {
        if (newAchievement) {
            setFormData({ ...formData, achievements: [...formData.achievements, newAchievement] });
            setNewAchievement('');
        }
    };

    const addProject = () => {
        const newProject: Project = {
            id: Date.now().toString(),
            title: 'New Project',
            description: '',
            techStack: [],
        };
        setFormData({ ...formData, projects: [...formData.projects, newProject] });
    };

    const updateProject = (id: string, updates: Partial<Project>) => {
        setFormData({
            ...formData,
            projects: formData.projects.map(p => p.id === id ? { ...p, ...updates } : p)
        });
    };

    const addInternship = () => {
        const newInternship: Internship = {
            id: Date.now().toString(),
            company: '',
            role: '',
            duration: '',
            description: '',
        };
        setFormData({ ...formData, internships: [...formData.internships, newInternship] });
    };

    const updateInternship = (id: string, updates: Partial<Internship>) => {
        setFormData({
            ...formData,
            internships: formData.internships.map(i => i.id === id ? { ...i, ...updates } : i)
        });
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setAvatar(base64);
                setFormData({ ...formData, avatar: base64 } as any);
            };
            reader.readAsDataURL(file);
        }
    };

    // Performance Data (Mock)
    const attendanceData = [
        { month: 'Jan', attendance: 85 },
        { month: 'Feb', attendance: 88 },
        { month: 'Mar', attendance: 92 },
        { month: 'Apr', attendance: 90 },
        { month: 'May', attendance: 95 },
        { month: 'Jun', attendance: 88 },
    ];

    const skillData = [
        { subject: 'Coding', A: 120, fullMark: 150 },
        { subject: 'Communication', A: 98, fullMark: 150 },
        { subject: 'Aptitude', A: 86, fullMark: 150 },
        { subject: 'Technical', A: 99, fullMark: 150 },
        { subject: 'Projects', A: 85, fullMark: 150 },
        { subject: 'Teamwork', A: 65, fullMark: 150 },
    ];

    const applicationData = [
        { name: 'Applied', value: 12, color: '#6366f1' },
        { name: 'Shortlisted', value: 5, color: '#8b5cf6' },
        { name: 'Rejected', value: 3, color: '#ef4444' },
        { name: 'Offers', value: 1, color: '#10b981' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 transition-colors duration-300">
            <div className="flex">
                {/* Sidebar */}
                <div className="w-72 min-h-screen bg-slate-900 border-r border-slate-800 fixed transition-colors duration-300 left-0 top-[138px] h-[calc(100vh-138px)] z-10 hidden lg:block overflow-y-auto pb-20">
                    {/* User Card */}
                    <div className="p-6 border-b border-slate-800 text-center">
                        <div className="relative w-24 h-24 mx-auto mb-4 group">
                            <div className="w-full h-full rounded-full overflow-hidden border-2 border-slate-700 shadow-lg bg-slate-800 flex items-center justify-center">
                                {avatar ? (
                                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                                        {formData.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || 'U'}
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-slate-700 rounded-full shadow-md cursor-pointer hover:bg-slate-600 transition-colors border border-slate-600">
                                <Camera className="w-4 h-4 text-gray-300" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                            </label>
                        </div>
                        <h2 className="text-lg font-bold text-white">{formData.name || 'Student Name'}</h2>
                        <p className="text-sm text-gray-400">Roll No: {formData.rollNumber || 'Not set'}</p>
                    </div>

                    {/* Navigation */}
                    <nav className="py-4">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full px-6 py-3 text-left flex items-center gap-3 transition-all ${isActive
                                        ? 'bg-purple-900/20 text-purple-400 border-r-4 border-purple-500 font-semibold'
                                        : 'text-gray-400 hover:bg-slate-800/50'
                                        } `}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-sm">{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="lg:ml-72 flex-1 p-8 w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-4xl"
                        >
                            {/* Performance Tab */}
                            {activeTab === 'performance' && (
                                <div className="space-y-6">
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Performance Analytics</h1>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Attendance Chart */}
                                        <Card title="Attendance Consistency">
                                            <div className="h-64 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={attendanceData}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                                                        <YAxis stroke="#6b7280" fontSize={12} domain={[0, 100]} />
                                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                                        <Line type="monotone" dataKey="attendance" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </Card>

                                        {/* Application Status */}
                                        <Card title="Application Funnel">
                                            <div className="h-64 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={applicationData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={80}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                        >
                                                            {applicationData.map((entry, index) => (
                                                                <Cell key={`cell - ${index} `} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip />
                                                        <Legend verticalAlign="bottom" height={36} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </Card>

                                        {/* Skill Radar */}
                                        <Card title="Skill Assessment Proficiency">
                                            <div className="h-80 w-full col-span-2">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                                        <PolarGrid />
                                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                                        <PolarRadiusAxis angle={30} domain={[0, 150]} />
                                                        <Radar name="Student" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                                                        <Tooltip />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </Card>

                                        <div className="col-span-1 md:col-span-2">
                                            <Card title="Recent Activities">
                                                <div className="space-y-4">
                                                    {[1, 2, 3].map((_, i) => (
                                                        <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                                                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white">Applied to Google (SDE Intern)</p>
                                                                <p className="text-xs text-gray-500">2 days ago</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Basic Details Tab */}
                            {activeTab === 'basic' && (
                                <div className="space-y-6">
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Basic Details</h1>

                                    <Card title="About">
                                        <div className="grid grid-cols-2 gap-6">
                                            <FormField label="Full Name" value={formData.name} onChange={(v: string) => setFormData({ ...formData, name: v })} />
                                            <FormField label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={(v: string) => setFormData({ ...formData, dateOfBirth: v })} />
                                            <FormSelect label="Gender" value={formData.gender} onChange={(v: string) => setFormData({ ...formData, gender: v })} options={['Male', 'Female', 'Other']} />
                                            <FormField label="College" value={formData.college} onChange={(v: string) => setFormData({ ...formData, college: v })} />
                                        </div>
                                    </Card>

                                    <Card title="Contact Information">
                                        <div className="grid grid-cols-2 gap-6">
                                            <FormField label="Email" type="email" value={formData.email} disabled />
                                            <FormField label="Phone" value={formData.phone} onChange={(v: string) => setFormData({ ...formData, phone: v })} placeholder="+91 98765 43210" />
                                            <div className="col-span-2">
                                                <FormField label="Address" value={formData.address} onChange={(v: string) => setFormData({ ...formData, address: v })} placeholder="Your current address" />
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {/* Education Tab */}
                            {activeTab === 'education' && (
                                <div className="space-y-6">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Education Details</h1>

                                    <Card title="Current Course" badge={`${formData.cgpa || 0} CGPA`}>
                                        <div className="grid grid-cols-2 gap-6">
                                            <FormSelect label="Branch" value={formData.branch} onChange={(v: string) => setFormData({ ...formData, branch: v })}
                                                options={['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'AIML', 'Data Science']} />
                                            <FormSelect label="Academic Year" value={formData.academicYear.toString()} onChange={(v: string) => setFormData({ ...formData, academicYear: parseInt(v) })}
                                                options={[{ v: '1', l: '1st Year' }, { v: '2', l: '2nd Year' }, { v: '3', l: '3rd Year' }, { v: '4', l: '4th Year' }]} />
                                            <FormField label="CGPA" type="number" value={formData.cgpa} onChange={(v: string) => setFormData({ ...formData, cgpa: v })} placeholder="8.5" />
                                            <FormField label="Roll Number" value={formData.rollNumber} onChange={(v: string) => setFormData({ ...formData, rollNumber: v })} />
                                            <FormField label="Passout Year" type="number" value={formData.passoutYear.toString()} onChange={(v: string) => setFormData({ ...formData, passoutYear: parseInt(v) })} />
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {/* Experience Tab */}
                            {activeTab === 'experience' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h1 className="text-2xl font-bold text-gray-900">Internship & Work Experience</h1>
                                        <button onClick={addInternship} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                            <Plus className="w-4 h-4" /> Add Experience
                                        </button>
                                    </div>

                                    {formData.internships.length === 0 ? (
                                        <EmptyState title="No experience added" description="Add your internships and work experience to strengthen your profile" onAdd={addInternship} />
                                    ) : (
                                        formData.internships.map((intern) => (
                                            <Card key={intern.id} title={intern.company || 'New Experience'}>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <FormField label="Company" value={intern.company} onChange={(v: string) => updateInternship(intern.id, { company: v })} />
                                                    <FormField label="Role" value={intern.role} onChange={(v: string) => updateInternship(intern.id, { role: v })} />
                                                    <FormField label="Duration" value={intern.duration} onChange={(v: string) => updateInternship(intern.id, { duration: v })} placeholder="June 2024 - Aug 2024" />
                                                    <div className="col-span-2">
                                                        <FormField label="Description" value={intern.description} onChange={(v: string) => updateInternship(intern.id, { description: v })} placeholder="What did you do?" />
                                                    </div>
                                                </div>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Skills Tab */}
                            {activeTab === 'skills' && (
                                <div className="space-y-6">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Skills, Subjects & Languages</h1>

                                    <Card title="Technical Skills">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {formData.skills.map(skill => (
                                                <span key={skill} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2">
                                                    {skill}
                                                    <button onClick={() => removeSkill(skill)} className="text-purple-500 hover:text-purple-700">×</button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                                                placeholder="Add a skill (e.g., React, Python)" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                            <button onClick={addSkill} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add</button>
                                        </div>
                                    </Card>

                                    <Card title="Languages">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {formData.languages.map(lang => (
                                                <span key={lang} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm">{lang}</span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addLanguage()}
                                                placeholder="Add a language" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                            <button onClick={addLanguage} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add</button>
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {/* Projects Tab */}
                            {activeTab === 'projects' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                                        <button onClick={addProject} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                            <Plus className="w-4 h-4" /> Add Project
                                        </button>
                                    </div>

                                    {formData.projects.length === 0 ? (
                                        <EmptyState title="No projects added" description="Add your projects to showcase your skills" onAdd={addProject} />
                                    ) : (
                                        formData.projects.map((project) => (
                                            <Card key={project.id} title={project.title || 'New Project'}>
                                                <div className="space-y-4">
                                                    <FormField label="Project Title" value={project.title} onChange={(v: string) => updateProject(project.id, { title: v })} />
                                                    <FormField label="Description" value={project.description} onChange={(v: string) => updateProject(project.id, { description: v })} placeholder="What does this project do?" />
                                                    <FormField label="Tech Stack (comma-separated)" value={project.techStack.join(', ')} onChange={(v: string) => updateProject(project.id, { techStack: v.split(',').map((s: string) => s.trim()) })} placeholder="React, Node.js, MongoDB" />
                                                    <FormField label="Link (optional)" value={project.link || ''} onChange={(v: string) => updateProject(project.id, { link: v })} placeholder="https://github.com/..." />
                                                </div>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Achievements Tab */}
                            {activeTab === 'achievements' && (
                                <div className="space-y-6">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Accomplishments</h1>

                                    <Card title="Achievements & Awards">
                                        {formData.achievements.length > 0 && (
                                            <ul className="space-y-2 mb-4">
                                                {formData.achievements.map((ach, i) => (
                                                    <li key={i} className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                        <Award className="w-5 h-5 text-green-600" />
                                                        <span>{ach}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <div className="flex gap-2">
                                            <input value={newAchievement} onChange={(e) => setNewAchievement(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addAchievement()}
                                                placeholder="Add an achievement" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                            <button onClick={addAchievement} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add</button>
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {/* Resume Tab */}
                            {activeTab === 'resume' && (
                                <div className="space-y-6">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Resume, Docs & Write-ups</h1>

                                    <Card title="My Resume">
                                        <div className="text-center py-8">
                                            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                            <p className="text-gray-500 mb-4">Upload your resume or generate one using our AI Resume Builder</p>
                                            <div className="flex gap-4 justify-center">
                                                <button className="px-6 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50">Upload Resume</button>
                                                <a href="/student/resume-builder" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Generate with AI</a>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {/* Save Button */}
                            <div className="mt-8 flex justify-end">
                                <button onClick={handleSave} disabled={saving}
                                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all shadow-md">
                                    {saving ? (
                                        <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                                    ) : saved ? (
                                        <><CheckCircle className="w-5 h-5" /> Saved!</>
                                    ) : (
                                        <><Save className="w-5 h-5" /> Save All Changes</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// Reusable Components
function Card({ title, children, badge }: { title: string; children: React.ReactNode; badge?: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                {badge && <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold border border-green-200 dark:border-green-900/50">{badge}</span>}
            </div>
            {children}
        </div>
    );
}

function FormField({ label, value, onChange, type = 'text', placeholder, disabled }: any) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} disabled={disabled}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${disabled ? 'bg-gray-50 text-gray-500' : ''}`} />
        </div>
    );
}

function FormSelect({ label, value, onChange, options }: any) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="">Select {label}</option>
                {options.map((opt: any) => typeof opt === 'string' ? (
                    <option key={opt} value={opt}>{opt}</option>
                ) : (
                    <option key={opt.v} value={opt.v}>{opt.l}</option>
                ))}
            </select>
        </div>
    );
}

function EmptyState({ title, description, onAdd }: { title: string; description: string; onAdd: () => void }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Plus className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 mb-6">{description}</p>
            <button onClick={onAdd} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                + Add new
            </button>
        </div>
    );
}
