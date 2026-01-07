/**
 * COMPLETE FIX: Initialize ALL data properly
 * This ensures students, drives, and everything works
 */

import { StudentService, DriveService } from './data-service';

export async function initializeCompleteSystem() {
    console.log('🚀 Initializing Lumos complete system...');

    // Check if already initialized
    const existingStudents = await StudentService.getAll();
    if (existingStudents.length > 0) {
        console.log('✅ System already initialized');
        return;
    }

    // ===== STUDENTS =====
    console.log('📚 Creating students...');

    const students = [
        {
            name: 'Raj Kumar',
            email: '21CS3042@mbu.edu',
            rollNo: '21CS3042',
            branch: 'CSE',
            batch: 2025,
            cgpa: 8.5,
            backlogs: 0,
            phone: '+91-98765 43210',
            skills: ['React', 'Node.js', 'Python', 'Machine Learning'],
        },
        {
            name: 'Priya Sharma',
            email: '21IT3021@mbu.edu',
            rollNo: '21IT3021',
            branch: 'IT',
            batch: 2025,
            cgpa: 7.8,
            backlogs: 0,
            phone: '+91-98765 43211',
            skills: ['Java', 'Spring Boot', 'MySQL', 'AWS'],
        },
        {
            name: 'Arjun Patel',
            email: '21ECE2015@mbu.edu',
            rollNo: '21ECE2015',
            branch: 'ECE',
            batch: 2025,
            cgpa: 7.2,
            backlogs: 1,
            phone: '+91-98765 43212',
            skills: ['Embedded C', 'VLSI', 'Digital Signal Processing'],
        },
        {
            name: 'Ananya Reddy',
            email: '21CS3055@mbu.edu',
            rollNo: '21CS3055',
            branch: 'CSE',
            batch: 2025,
            cgpa: 9.1,
            backlogs: 0,
            phone: '+91-98765 43213',
            skills: ['React', 'TypeScript', 'AWS', 'Docker', 'Kubernetes'],
        },
    ];

    for (const student of students) {
        await StudentService.create(student);
    }
    console.log('✅ Created 4 students');

    // ===== DRIVES =====
    console.log('🏢 Creating drives...');

    const drives = [
        {
            companyName: 'Google',
            role: 'Software Engineer',
            type: 'Full-Time' as const,
            ctcMin: 18,
            ctcMax: 25,
            location: ['Bangalore', 'Hyderabad'],
            deadline: new Date('2026-02-28'),
            status: 'OPEN' as const,
            logo: '🔰',
            eligibility: {
                cgpaCutoff: 7.5,
                allowedBranches: ['CSE', 'IT'],
                maxBacklogs: 0,
            },
            rounds: ['Online Assessment', 'Technical Interview', 'System Design', 'HR Round'],
        },
        {
            companyName: 'Microsoft',
            role: 'SDE Intern',
            type: 'Internship' as const,
            ctcMin: 80000,
            ctcMax: 100000,
            location: ['Bangalore'],
            deadline: new Date('2026-02-15'),
            status: 'OPEN' as const,
            logo: '🏢',
            eligibility: {
                cgpaCutoff: 7.0,
                allowedBranches: ['CSE', 'IT', 'ECE'],
                maxBacklogs: 1,
            },
            rounds: ['Resume Screening', 'Coding Test', 'Technical Interview'],
        },
        {
            companyName: 'Amazon',
            role: 'Full Stack Developer',
            type: 'Full-Time' as const,
            ctcMin: 15,
            ctcMax: 20,
            location: ['Bangalore', 'Chennai'],
            deadline: new Date('2026-03-10'),
            status: 'OPEN' as const,
            logo: '📦',
            eligibility: {
                cgpaCutoff: 7.5,
                allowedBranches: ['CSE', 'IT'],
                maxBacklogs: 0,
            },
            rounds: ['Online Coding', 'Technical Round 1', 'Technical Round 2', 'Bar Raiser', 'HR'],
        },
    ];

    for (const drive of drives) {
        await DriveService.create(drive);
    }
    console.log('✅ Created 3 drives');

    console.log('🎉 System initialization complete!');
    console.log('📊 Summary:');
    console.log('   - 4 Students');
    console.log('   - 3 Active Drives');
    console.log('   - Ready to use!');
}

// Auto-initialize on import (browser only)
if (typeof window !== 'undefined') {
    initializeCompleteSystem();
}
