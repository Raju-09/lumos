/**
 * 3D Student Zone - Placement Cockpit
 * Interactive student dashboard with spatial context
 */
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float, Sphere, Box } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApplicationService, DriveService } from '@/lib/data-service';
import * as THREE from 'three';

export default function StudentZone3D() {
    const router = useRouter();
    const [studentData, setStudentData] = useState({
        applications: 0,
        shortlisted: 0,
        inProgress: 0,
        readiness: 0
    });
    const [drives, setDrives] = useState<any[]>([]);
    const [selectedOrb, setSelectedOrb] = useState<any>(null);

    useEffect(() => {
        loadStudentData();
    }, []);

    const loadStudentData = async () => {
        const user = JSON.parse(localStorage.getItem('lumos_user') || '{}');
        if (user.rollNumber) {
            const apps = await ApplicationService.getByStudentId(user.rollNumber);
            const allDrives = await DriveService.getActive();

            setStudentData({
                applications: apps.length,
                shortlisted: apps.filter(a => a.status === 'Shortlisted').length,
                inProgress: apps.filter(a => a.status === 'Applied').length,
                readiness: Math.min(95, (apps.length / 10) * 100)
            });

            setDrives(allDrives.slice(0, 8)); // Show max 8 drives
        }
    };

    return (
        <div className="w-full h-screen bg-gradient-to-b from-blue-950 to-gray-900">
            {/* Header */}
            <div className="absolute top-6 left-6 z-10 text-white">
                <h1 className="text-2xl font-bold">Student Zone</h1>
                <p className="text-white/60 text-sm">Your Placement Cockpit</p>
            </div>

            {/* Back Button */}
            <button
                onClick={() => router.push('/3d')}
                className="absolute top-6 right-6 z-10 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/20 transition-colors"
            >
                ← Back to Hub
            </button>

            {/* Selected Orb Panel */}
            {selectedOrb && (
                <div className="absolute bottom-6 right-6 z-10 w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">{selectedOrb.companyName}</h3>
                    <p className="text-sm text-white/80 mb-3">{selectedOrb.role}</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Package:</span>
                            <span className="font-medium">₹{selectedOrb.ctcMin}-{selectedOrb.ctcMax} LPA</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Status:</span>
                            <span className={selectedOrb.eligible ? 'text-green-400' : 'text-red-400'}>
                                {selectedOrb.eligible ? '✓ Eligible' : '✗ Not Eligible'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/student/opportunities')}
                        className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        View Details
                    </button>
                </div>
            )}

            <Canvas camera={{ position: [0, 3, 10], fov: 60 }}>
                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#60a5fa" />
                <pointLight position={[-10, 10, -10]} intensity={0.5} color="#8b5cf6" />

                {/* Floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                    <planeGeometry args={[40, 40]} />
                    <meshStandardMaterial color="#0f172a" />
                </mesh>

                {/* Readiness Gauge */}
                <ReadinessGauge value={studentData.readiness} position={[0, 1, -3]} />

                {/* Stat Pillars */}
                <StatPillar
                    position={[-6, 0, 0]}
                    height={studentData.applications / 2}
                    color="#3b82f6"
                    label="Applications"
                    value={studentData.applications}
                />
                <StatPillar
                    position={[-2, 0, 0]}
                    height={studentData.shortlisted / 2}
                    color="#10b981"
                    label="Shortlisted"
                    value={studentData.shortlisted}
                />
                <StatPillar
                    position={[2, 0, 0]}
                    height={studentData.inProgress / 2}
                    color="#f59e0b"
                    label="In Progress"
                    value={studentData.inProgress}
                />

                {/* Drive Orbs */}
                {drives.map((drive, idx) => {
                    const angle = (idx / drives.length) * Math.PI * 2;
                    const radius = 5;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;

                    return (
                        <DriveOrb
                            key={drive.id}
                            position={[x, 2, z]}
                            drive={drive}
                            onClick={() => setSelectedOrb({
                                ...drive,
                                eligible: true // Simplified for now
                            })}
                        />
                    );
                })}

                {/* Camera Controls */}
                <OrbitControls
                    enablePan={false}
                    maxPolarAngle={Math.PI / 2.2}
                    minPolarAngle={Math.PI / 6}
                />
            </Canvas>
        </div>
    );
}

function ReadinessGauge({ value, position }: any) {
    const needleRotation = -Math.PI / 2 + (value / 100) * Math.PI;

    return (
        <group position={position}>
            {/* Base */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>

            {/* Arc */}
            <mesh position={[0, 0.06, 0]} rotation={[0, 0, 0]}>
                <torusGeometry args={[1.2, 0.05, 16, 100, Math.PI]} />
                <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
            </mesh>

            {/* Needle */}
            <mesh position={[0, 0.1, 0]} rotation={[0, 0, needleRotation]}>
                <boxGeometry args={[0.05, 1.2, 0.05]} />
                <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
            </mesh>

            {/* Label */}
            <Float speed={1} floatIntensity={0.2}>
                <Text
                    position={[0, 1.5, 0]}
                    fontSize={0.3}
                    color="#60a5fa"
                    anchorX="center"
                >
                    Readiness: {Math.round(value)}%
                </Text>
            </Float>
        </group>
    );
}

function StatPillar({ position, height, color, label, value }: any) {
    const actualHeight = Math.max(0.5, height);

    return (
        <group position={position}>
            {/* Pillar */}
            <mesh position={[0, actualHeight / 2, 0]}>
                <boxGeometry args={[1, actualHeight, 1]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.3}
                />
            </mesh>

            {/* Value */}
            <Float speed={2} floatIntensity={0.3}>
                <Text
                    position={[0, actualHeight + 0.5, 0]}
                    fontSize={0.5}
                    color="white"
                    anchorX="center"
                >
                    {value}
                </Text>
            </Float>

            {/* Label */}
            <Text
                position={[0, -0.2, 0]}
                fontSize={0.2}
                color="#94a3b8"
                anchorX="center"
            >
                {label}
            </Text>
        </group>
    );
}

function DriveOrb({ position, drive, onClick }: any) {
    const [hovered, setHovered] = useState(false);
    const eligible = true; // Simplified

    return (
        <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={position}>
                {/* Orb */}
                <mesh
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                    onClick={onClick}
                >
                    <sphereGeometry args={[hovered ? 0.35 : 0.3, 32, 32]} />
                    <meshStandardMaterial
                        color={eligible ? '#10b981' : '#ef4444'}
                        emissive={eligible ? '#10b981' : '#ef4444'}
                        emissiveIntensity={hovered ? 0.8 : 0.4}
                        transparent
                        opacity={0.9}
                    />
                </mesh>

                {/* Company Name */}
                {hovered && (
                    <Text
                        position={[0, 0.6, 0]}
                        fontSize={0.15}
                        color="white"
                        anchorX="center"
                    >
                        {drive.companyName}
                    </Text>
                )}

                {/* Ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.4, 0.42, 32]} />
                    <meshBasicMaterial
                        color={eligible ? '#10b981' : '#ef4444'}
                        transparent
                        opacity={0.5}
                    />
                </mesh>
            </group>
        </Float>
    );
}
