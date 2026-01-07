'use client';

import { motion } from 'framer-motion';
import { Clock, Video, Code, Calendar, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UpcomingEvent {
    id: string;
    type: 'test' | 'interview' | 'deadline';
    company: string;
    title: string;
    date: Date;
    time: string;
    location?: string;
    mode?: 'online' | 'offline';
}

export function UpcomingTimeline() {
    // Mock data - replace with actual data
    const events: UpcomingEvent[] = [
        {
            id: '1',
            type: 'test',
            company: 'Google',
            title: 'Coding Assessment',
            date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
            time: '2:30 PM',
            mode: 'online',
        },
        {
            id: '2',
            type: 'interview',
            company: 'Microsoft',
            title: 'Technical Interview',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            time: '10:00 AM',
            mode: 'online',
        },
        {
            id: '3',
            type: 'deadline',
            company: 'Amazon',
            title: 'Application Deadline',
            date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days
            time: '11:59 PM',
            mode: 'online',
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                        <Calendar className="w-5 h-5 text-secondary" />
                    </div>
                    <h3 className="text-lg font-semibold">Upcoming This Week</h3>
                </div>
                <span className="text-xs text-muted-foreground">
                    {events.length} events
                </span>
            </div>

            {/* Events List */}
            <div className="space-y-4">
                {events.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground text-sm">
                            All caught up! No upcoming events.
                        </p>
                    </div>
                ) : (
                    events.map((event, index) => (
                        <EventCard key={event.id} event={event} index={index} />
                    ))
                )}
            </div>
        </motion.div>
    );
}

function EventCard({ event, index }: { event: UpcomingEvent; index: number }) {
    const [countdown, setCountdown] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const diff = event.date.getTime() - now.getTime();

            if (diff <= 0) {
                setCountdown('Happening now');
                setIsUrgent(true);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const days = Math.floor(hours / 24);

            if (days > 0) {
                setCountdown(`${days}d ${hours % 24}h`);
                setIsUrgent(false);
            } else if (hours > 0) {
                setCountdown(`${hours}h ${minutes}m`);
                setIsUrgent(hours < 6);
            } else {
                setCountdown(`${minutes}m`);
                setIsUrgent(true);
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [event.date]);

    const getEventIcon = () => {
        switch (event.type) {
            case 'test':
                return <Code className="w-4 h-4" />;
            case 'interview':
                return <Video className="w-4 h-4" />;
            case 'deadline':
                return <Clock className="w-4 h-4" />;
        }
    };

    const getEventColor = () => {
        if (isUrgent) return 'border-red-500/50 bg-red-500/5';
        switch (event.type) {
            case 'test':
                return 'border-blue-500/50 bg-blue-500/5';
            case 'interview':
                return 'border-purple-500/50 bg-purple-500/5';
            case 'deadline':
                return 'border-yellow-500/50 bg-yellow-500/5';
        }
    };

    const getIconColor = () => {
        if (isUrgent) return 'text-red-500';
        switch (event.type) {
            case 'test':
                return 'text-blue-500';
            case 'interview':
                return 'text-purple-500';
            case 'deadline':
                return 'text-yellow-500';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={`p-4 border rounded-lg transition-all hover:shadow-md ${getEventColor()}`}
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-2 rounded-lg ${isUrgent ? 'bg-red-500/10' : 'bg-muted'} ${isUrgent && 'animate-pulse-slow'}`}>
                    {getEventIcon()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                            <h4 className="font-medium text-sm">{event.company}</h4>
                            <p className="text-xs text-muted-foreground">{event.title}</p>
                        </div>

                        {/* Countdown Badge */}
                        <div className={`
              px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap
              ${isUrgent
                                ? 'bg-red-500 text-white animate-pulse-slow'
                                : 'bg-muted text-muted-foreground'
                            }
            `}>
                            {countdown}
                        </div>
                    </div>

                    {/* Time and Mode */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{event.time}</span>
                        </div>
                        {event.mode && (
                            <div className="flex items-center gap-1">
                                {event.mode === 'online' ? (
                                    <>
                                        <Video className="w-3 h-3" />
                                        <span>Online</span>
                                    </>
                                ) : (
                                    <>
                                        <MapPin className="w-3 h-3" />
                                        <span>{event.location || 'Campus'}</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
