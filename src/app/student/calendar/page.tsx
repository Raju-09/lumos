'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Video,
    Users,
    Code,
    ChevronLeft,
    ChevronRight,
    Plus,
    Filter
} from 'lucide-react';

const mockEvents = [
    {
        id: 'e1',
        title: 'Google Coding Assessment',
        company: 'Google',
        type: 'test',
        date: new Date(2024, 1, 12, 14, 30),
        duration: '90 mins',
        mode: 'online',
        link: 'https://meet.google.com/abc',
        attendees: 45
    },
    {
        id: 'e2',
        title: 'Microsoft Technical Interview',
        company: 'Microsoft',
        type: 'interview',
        date: new Date(2024, 1, 13, 10, 0),
        duration: '1 hour',
        mode: 'online',
        link: 'https://teams.microsoft.com/xyz',
        attendees: 12
    },
    {
        id: 'e3',
        title: 'Amazon Pre-Placement Talk',
        company: 'Amazon',
        type: 'ppt',
        date: new Date(2024, 1, 14, 15, 0),
        duration: '2 hours',
        mode: 'offline',
        location: 'Auditorium',
        attendees: 200
    },
    {
        id: 'e4',
        title: 'Goldman Sachs Aptitude Test',
        company: 'Goldman Sachs',
        type: 'test',
        date: new Date(2024, 1, 15, 9, 0),
        duration: '60 mins',
        mode: 'online',
        link: 'https://assessment.gs.com',
        attendees: 28
    }
];

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

export default function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState(today);
    const [viewMode, setViewMode] = useState<'month' | 'list'>('list');

    const upcomingEvents = mockEvents
        .filter(event => event.date >= today)
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-start"
            >
                <div>
                    <h1 className="text-3xl font-bold mb-2">Event Calendar</h1>
                    <p className="text-muted-foreground">
                        View all placement events, tests, and interviews
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Event
                    </button>
                </div>
            </motion.div>

            {/* View Toggle */}
            <div className="flex gap-2">
                <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'list'
                            ? 'bg-primary text-white'
                            : 'bg-card border border-border hover:bg-muted'
                        }`}
                >
                    List View
                </button>
                <button
                    onClick={() => setViewMode('month')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'month'
                            ? 'bg-primary text-white'
                            : 'bg-card border border-border hover:bg-muted'
                        }`}
                >
                    Month View
                </button>
            </div>

            {/* Events List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Upcoming Events</h3>
                {upcomingEvents.map((event, idx) => (
                    <EventCard key={event.id} event={event} index={idx} />
                ))}
            </div>

            {upcomingEvents.length === 0 && (
                <div className="text-center py-12">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No upcoming events</p>
                </div>
            )}
        </div>
    );
}

function EventCard({ event, index }: any) {
    const typeConfig: any = {
        test: {
            icon: Code,
            bg: 'bg-blue-500/10',
            text: 'text-blue-500',
            border: 'border-blue-500/20',
            label: 'Test'
        },
        interview: {
            icon: Video,
            bg: 'bg-purple-500/10',
            text: 'text-purple-500',
            border: 'border-purple-500/20',
            label: 'Interview'
        },
        ppt: {
            icon: Users,
            bg: 'bg-green-500/10',
            text: 'text-green-500',
            border: 'border-green-500/20',
            label: 'PPT'
        }
    };

    const config = typeConfig[event.type];
    const Icon = config.icon;

    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    };

    const isToday = event.date.toDateString() === new Date().toDateString();
    const isTomorrow = event.date.toDateString() === new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-card border rounded-xl p-6 hover-lift ${isToday ? 'border-primary' : 'border-border'
                }`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${config.bg}`}>
                        <Icon className={`w-6 h-6 ${config.text}`} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.company}</p>
                    </div>
                </div>
                <div className={`px-3 py-1.5 ${config.bg} ${config.border} border rounded-full`}>
                    <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <div>
                        <div className="text-xs text-muted-foreground">Date</div>
                        <div className="font-medium">
                            {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : formatDate(event.date)}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                        <div className="text-xs text-muted-foreground">Duration</div>
                        <div className="font-medium">{event.duration}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    {event.mode === 'online' ? (
                        <>
                            <Video className="w-4 h-4 text-muted-foreground" />
                            <div>
                                <div className="text-xs text-muted-foreground">Mode</div>
                                <div className="font-medium">Online</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <div>
                                <div className="text-xs text-muted-foreground">Venue</div>
                                <div className="font-medium">{event.location}</div>
                            </div>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                        <div className="text-xs text-muted-foreground">Attendees</div>
                        <div className="font-medium">{event.attendees}</div>
                    </div>
                </div>
            </div>

            {isToday && (
                <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary animate-pulse-slow" />
                    <span className="text-sm font-medium text-primary">Happening today!</span>
                </div>
            )}

            <div className="flex gap-3">
                {event.mode === 'online' && event.link && (
                    <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all text-center flex items-center justify-center gap-2"
                    >
                        <Video className="w-4 h-4" />
                        Join Meeting
                    </a>
                )}
                <button className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                    View Details
                </button>
                <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                    📅 Add to Calendar
                </button>
            </div>
        </motion.div>
    );
}
