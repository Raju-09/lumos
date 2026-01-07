/**
 * Company Hall - 3D Drive Gallery
 * Visual exploration of placement opportunities
 */
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DriveService } from '@/lib/data-service';

export default function CompanyHall3D() {
    const router = useRouter();
    const [drives, setDrives] = useState<any[]>([]);
    const [selectedDesk, setSelectedDesk] = useState<any>(null);

    useEffect(() => {
        loadDrives();
    }, []);

    const loadDrives = async () => {
        const allDrives = await DriveService.getAll();
        setDrives(allDrives.slice(0, 12)); // Max 12 companies for performance
    };

    return (
        <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-slate-800">
            {/* Header */}
            <div className="absolute top-6 left-6 z-10 text-white">
                <h1 className="text-2xl font-bold">Company Hall</h1>
                <p className="text-white/60 text-sm">Explore Placement Opportunities</p>
            </div>

            {/* Back Button */}
            <button
                onClick={() => router.push('/3d')}
                className="absolute top-6 right-6 z-10 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/20 transition-colors"
            >
                ← Back to Hub
            </button>

            {/* Legend */}
            <div className="absolute top-24 right-6 z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 text-white text-sm">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Eligible</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Not Eligible</span>
                </div>
            </div>

            {/* Selected Desk Panel */}
            {selectedDesk && (
                <div className="absolute bottom-6 left-6 z-10 w-96 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-white">
                    <h3 className="text-xl font-bold mb-3">{selectedDesk.companyName}</h3>
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-white/70">Role:</span>
                            <span className="font-medium">{selectedDesk.role}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-white/70">Package:</span>
                            <span className="font-medium">₹{selectedDesk.ctcMin}-{selectedDesk.ctcMax} LPA</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-white/70">Eligibility:</span>
                            <span className={selectedDesk.eligible ? 'text-green-400' : 'text-red-400'}>
                                {selectedDesk.eligible ? '✓ Eligible' : '✗ Not Eligible'}
                            </span>
                        </div>
                    </div>

                    {!selectedDesk.eligible && (
                        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded text-xs mb-4">
                            <strong>Mismatch:</strong> CGPA requirement not met (Need {selectedDesk.cgpaCutoff}+)
                        </div>
                    )}

                    <button
                        onClick={() => router.push('/student/opportunities')}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        View Full Details
                    </button>
                </div>
            )}

            <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#60a5fa" />
                <pointLight position={[-10, 10, -10]} intensity={0.8} color="#8b5cf6" />
                <directionalLight position={[5, 10, 5]} intensity={0.5} />

                {/* Floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                    <planeGeometry args={[50, 50]} />
                    <meshStandardMaterial color="#1e293b" />
                </mesh>

                {/* Company Desks in Grid */}
                {drives.map((drive, idx) => {
                    const row = Math.floor(idx / 4);
                    const col = idx % 4;
                    const x = (col - 1.5) * 5;
                    const z = (row - 1) * 6;
                    const packageHeight = (drive.ctcMax / 100) * 3; // Package affects height
                    const eligible = drive.cgpaCutoff <= 8; // Simplified eligibility

                    return (
                        <CompanyDesk
                            key={drive.id}
                            position={[x, 0, z]}
                            drive={drive}
                            height={packageHeight}
                            eligible={eligible}
                            onClick={() => setSelectedDesk({ ...drive, eligible })}
                        />
                    );
                })}

                {/* Camera Controls */}
                <OrbitControls
                    enablePan={true}
                    maxPolarAngle={Math.PI / 2.2}
                    minPolarAngle={Math.PI / 6}
                    maxDistance={25}
                    minDistance={8}
                />
            </Canvas>
        </div>
    );
}

function CompanyDesk({ position, drive, height, eligible, onClick }: any) {
    const [hovered, setHovered] = useState(false);
    const glowColor = eligible ? '#10b981' : '#ef4444';

    return (
        <group position={position}>
            {/* Desk Base */}
            <mesh position={[0, height / 2, 0]} castShadow>
                <boxGeometry args={[3, height, 2]} />
                <meshStandardMaterial
                    color="#1f2937"
                    emissive={hovered ? glowColor : '#000000'}
                    emissiveIntensity={hovered ? 0.3 : 0}
                />
            </mesh>

            {/* Eligibility Ring */}
            <mesh position={[0, height + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.6, 1.8, 32]} />
                <meshBasicMaterial
                    color={glowColor}
                    transparent
                    opacity={hovered ? 0.8 : 0.4}
                />
            </mesh>

            {/* Company Name */}
            <Float speed={2} floatIntensity={0.2}>
                <Text
                    position={[0, height + 1, 0]}
                    fontSize={0.3}
                    color={hovered ? '#ffffff' : '#e2e8f0'}
                    anchorX="center"
                    maxWidth={2.5}
                >
                    {drive.companyName}
                </Text>
            </Float>

            {/* Package Amount */}
            <Text
                position={[0, height + 0.5, 0]}
                fontSize={0.25}
                color="#94a3b8"
                anchorX="center"
            >
                ₹{drive.ctcMax} LPA
            </Text>

            {/* Info Icon */}
            {hovered && (
                <Text
                    position={[0, height - 0.3, 0]}
                    fontSize={0.2}
                    color="#60a5fa"
                    anchorX="center"
                >
                    ❓ Click for details
                </Text>
            )}

            {/* Click Area */}
            <mesh
                position={[0, height / 2, 0]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={onClick}
            >
                <boxGeometry args={[3.5, height + 2, 2.5]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>
        </group>
    );
}
