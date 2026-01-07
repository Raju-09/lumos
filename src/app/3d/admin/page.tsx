/**
 * Admin Control Room - 3D Analytics Center
 * Dark, serious admin dashboard environment
 */
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnalyticsService, StudentService } from '@/lib/data-service';

export default function AdminRoom3D() {
    const router = useRouter();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalDrives: 0,
        placementRate: 0,
        avgPackage: 0
    });

    useEffect(() => {
        loadAdminData();
    }, []);

    const loadAdminData = async () => {
        const data = await AnalyticsService.getPlacementStats();
        setStats(data);
    };

    return (
        <div className="w-full h-screen bg-gray-950">
            {/* Header */}
            <div className="absolute top-6 left-6 z-10 text-white">
                <h1 className="text-2xl font-bold">Admin Control Room</h1>
                <p className="text-white/60 text-sm">Placement Analytics Center</p>
            </div>

            {/* Back Button */}
            <button
                onClick={() => router.push('/3d')}
                className="absolute top-6 right-6 z-10 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/20 transition-colors"
            >
                ← Back to Hub
            </button>

            {/* Stats Panel */}
            <div className="absolute bottom-6 left-6 z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Live Analytics</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm text-white/60">Students</div>
                        <div className="text-2xl font-bold">{stats.totalStudents}</div>
                    </div>
                    <div>
                        <div className="text-sm text-white/60">Active Drives</div>
                        <div className="text-2xl font-bold">{stats.totalDrives}</div>
                    </div>
                    <div>
                        <div className="text-sm text-white/60">Placement Rate</div>
                        <div className="text-2xl font-bold">{stats.placementRate}%</div>
                    </div>
                    <div>
                        <div className="text-sm text-white/60">Avg Package</div>
                        <div className="text-2xl font-bold">{stats.avgPackage} LPA</div>
                    </div>
                </div>
                <button
                    onClick={() => router.push('/admin/institutional')}
                    className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                    View Full Dashboard
                </button>
            </div>

            <Canvas camera={{ position: [0, 4, 12], fov: 60 }}>
                {/* Dark Lighting */}
                <ambientLight intensity={0.2} />
                <pointLight position={[5, 8, 5]} intensity={0.8} color="#8b5cf6" />
                <pointLight position={[-5, 8, -5]} intensity={0.6} color="#3b82f6" />
                <spotLight
                    position={[0, 10, 0]}
                    angle={0.4}
                    penumbra={1}
                    intensity={1}
                    color="#6366f1"
                    castShadow
                />

                {/* Dark Floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                    <planeGeometry args={[30, 30]} />
                    <meshStandardMaterial color="#09090b" />
                </mesh>

                {/* Analytics Screens */}
                <AnalyticsScreen
                    position={[-4, 2.5, -3]}
                    title="Students"
                    value={stats.totalStudents}
                    color="#3b82f6"
                />
                <AnalyticsScreen
                    position={[0, 2.5, -3]}
                    title="Placement Rate"
                    value={`${stats.placementRate}%`}
                    color="#10b981"
                />
                <AnalyticsScreen
                    position={[4, 2.5, -3]}
                    title="Avg Package"
                    value={`${stats.avgPackage} LPA`}
                    color="#8b5cf6"
                />

                {/* Control Console */}
                <group position={[0, 0, 2]}>
                    {/* Main Console */}
                    <mesh position={[0, 0.5, 0]}>
                        <boxGeometry args={[6, 1, 3]} />
                        <meshStandardMaterial color="#18181b" />
                    </mesh>

                    {/* Console Screen */}
                    <mesh position={[0, 1.5, -0.5]}>
                        <boxGeometry args={[4, 2, 0.1]} />
                        <meshStandardMaterial
                            color="#0f172a"
                            emissive="#6366f1"
                            emissiveIntensity={0.3}
                        />
                    </mesh>

                    {/* Buttons */}
                    {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
                        <mesh key={i} position={[x, 0.6, 1.4]}>
                            <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
                            <meshStandardMaterial
                                color="#3b82f6"
                                emissive="#3b82f6"
                                emissiveIntensity={0.5}
                            />
                        </mesh>
                    ))}
                </group>

                {/* Audit Log Wall */}
                <AuditWall position={[8, 1, -5]} />

                {/* Upload Terminal */}
                <group position={[-8, 0, 0]}>
                    <mesh position={[0, 1.5, 0]}>
                        <boxGeometry args={[2, 3, 0.2]} />
                        <meshStandardMaterial
                            color="#1e293b"
                            emissive="#10b981"
                            emissiveIntensity={0.2}
                        />
                    </mesh>
                    <Float speed={2} floatIntensity={0.3}>
                        <Text
                            position={[0, 2, 0.2]}
                            fontSize={0.2}
                            color="#10b981"
                            anchorX="center"
                        >
                            📤 Upload
                        </Text>
                        <Text
                            position={[0, 1.5, 0.2]}
                            fontSize={0.15}
                            color="#94a3b8"
                            anchorX="center"
                        >
                            Sheets Sync
                        </Text>
                    </Float>
                </group>

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

function AnalyticsScreen({ position, title, value, color }: any) {
    return (
        <group position={position}>
            {/* Screen Frame */}
            <mesh>
                <boxGeometry args={[2, 2, 0.1]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>

            {/* Screen */}
            <mesh position={[0, 0, 0.06]}>
                <planeGeometry args={[1.8, 1.8]} />
                <meshStandardMaterial
                    color="#0f172a"
                    emissive={color}
                    emissiveIntensity={0.2}
                />
            </mesh>

            {/* Content */}
            <Float speed={1} floatIntensity={0.1}>
                <Text
                    position={[0, 0.3, 0.1]}
                    fontSize={0.5}
                    color={color}
                    anchorX="center"
                >
                    {value}
                </Text>
                <Text
                    position={[0, -0.3, 0.1]}
                    fontSize={0.15}
                    color="#94a3b8"
                    anchorX="center"
                >
                    {title}
                </Text>
            </Float>
        </group>
    );
}

function AuditWall({ position }: any) {
    return (
        <group position={position} rotation={[0, -Math.PI / 4, 0]}>
            {/* Wall */}
            <mesh>
                <boxGeometry args={[4, 3, 0.1]} />
                <meshStandardMaterial color="#18181b" />
            </mesh>

            {/* Timeline Entries */}
            {[0.8, 0.3, -0.2, -0.7].map((y, i) => (
                <group key={i}>
                    {/* Dot */}
                    <mesh position={[-1.5, y, 0.1]}>
                        <sphereGeometry args={[0.05, 16, 16]} />
                        <meshStandardMaterial
                            color="#3b82f6"
                            emissive="#3b82f6"
                            emissiveIntensity={1}
                        />
                    </mesh>

                    {/* Line */}
                    <mesh position={[-1, y, 0.1]}>
                        <boxGeometry args={[1, 0.02, 0.02]} />
                        <meshStandardMaterial color="#3b82f6" />
                    </mesh>

                    {/* Text */}
                    <Text
                        position={[-0.3, y, 0.1]}
                        fontSize={0.1}
                        color="#94a3b8"
                        anchorX="left"
                    >
                        Action {i + 1}
                    </Text>
                </group>
            ))}

            {/* Title */}
            <Text
                position={[0, 1.3, 0.1]}
                fontSize={0.2}
                color="#f1f5f9"
                anchorX="center"
            >
                Audit Log
            </Text>
        </group>
    );
}
