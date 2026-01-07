/**
 * 3D Entry Hall - First Impression Scene
 * Clean minimalist hall with 3 portal doors
 */
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

export default function EntryHall3D() {
    const router = useRouter();
    const [hoveredDoor, setHoveredDoor] = useState<string | null>(null);

    const handleDoorClick = (destination: string) => {
        switch (destination) {
            case 'student':
                router.push('/3d/student');
                break;
            case 'admin':
                router.push('/3d/admin');
                break;
            case 'ai':
                router.push('/3d/ai');
                break;
            case 'companies':
                router.push('/3d/companies');
                break;
        }
    };

    return (
        <div className="w-full h-screen bg-gray-900">
            {/* Skip to Dashboard Button */}
            <div className="absolute top-6 right-6 z-10">
                <button
                    onClick={() => router.push('/login')}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/20 transition-colors"
                >
                    Skip to Login →
                </button>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-6 left-6 z-10 text-white/80 text-sm">
                <p>🖱️ Drag to look around • Click doors to enter</p>
            </div>

            <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} />

                {/* Floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                    <planeGeometry args={[30, 30]} />
                    <meshStandardMaterial color="#1a1a1a" />
                </mesh>

                {/* Floating Logo */}
                <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
                    <Text
                        position={[0, 4, -2]}
                        fontSize={1}
                        color="#60a5fa"
                        anchorX="center"
                        anchorY="middle"
                        font="/fonts/inter-bold.woff"
                    >
                        LUMOS
                    </Text>
                    <Text
                        position={[0, 3.2, -2]}
                        fontSize={0.3}
                        color="#94a3b8"
                        anchorX="center"
                        anchorY="middle"
                        font="/fonts/inter-regular.woff"
                    >
                        Campus Placement Operating System
                    </Text>
                </Float>

                {/* Student Door (Left) */}
                <PortalDoor
                    position={[-4, 0, -5]}
                    color="#3b82f6"
                    label="Student Zone"
                    icon="🧑‍🎓"
                    isHovered={hoveredDoor === 'student'}
                    onPointerOver={() => setHoveredDoor('student')}
                    onPointerOut={() => setHoveredDoor(null)}
                    onClick={() => handleDoorClick('student')}
                />

                {/* Admin Door (Center) */}
                <PortalDoor
                    position={[0, 0, -5]}
                    color="#8b5cf6"
                    label="Placement Cell"
                    icon="🧑‍💼"
                    isHovered={hoveredDoor === 'admin'}
                    onPointerOver={() => setHoveredDoor('admin')}
                    onPointerOut={() => setHoveredDoor(null)}
                    onClick={() => handleDoorClick('admin')}
                />

                {/* AI Door (Right) */}
                <PortalDoor
                    position={[4, 0, -5]}
                    color="#10b981"
                    label="AI Assistant"
                    icon="🤖"
                    isHovered={hoveredDoor === 'ai'}
                    onPointerOver={() => setHoveredDoor('ai')}
                    onPointerOut={() => setHoveredDoor(null)}
                    onClick={() => handleDoorClick('ai')}
                />

                {/* Camera Controls */}
                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 4}
                    maxDistance={12}
                    minDistance={5}
                />
            </Canvas>
        </div>
    );
}

function PortalDoor({
    position,
    color,
    label,
    icon,
    isHovered,
    onPointerOver,
    onPointerOut,
    onClick
}: any) {
    return (
        <group position={position}>
            {/* Door Frame */}
            <mesh position={[0, 2, 0]}>
                <boxGeometry args={[2.5, 4, 0.2]} />
                <meshStandardMaterial
                    color={isHovered ? color : '#1f2937'}
                    emissive={color}
                    emissiveIntensity={isHovered ? 0.5 : 0.2}
                />
            </mesh>

            {/* Glow Ring */}
            {isHovered && (
                <mesh position={[0, 2, 0]}>
                    <ringGeometry args={[1.5, 1.7, 32]} />
                    <meshBasicMaterial color={color} transparent opacity={0.6} />
                </mesh>
            )}

            {/* Icon */}
            <Text
                position={[0, 3, 0.15]}
                fontSize={0.8}
                anchorX="center"
                anchorY="middle"
            >
                {icon}
            </Text>

            {/* Label */}
            <Text
                position={[0, 1.2, 0.15]}
                fontSize={0.3}
                color={isHovered ? '#ffffff' : '#9ca3af'}
                anchorX="center"
                anchorY="middle"
                font="/fonts/inter-medium.woff"
            >
                {label}
            </Text>

            {/* Invisible Click Area (larger for easier clicking) */}
            <mesh
                position={[0, 2, 0]}
                onPointerOver={onPointerOver}
                onPointerOut={onPointerOut}
                onClick={onClick}
            >
                <boxGeometry args={[3, 5, 0.5]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>
        </group>
    );
}
