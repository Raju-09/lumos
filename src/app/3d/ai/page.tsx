/**
 * AI Desk - Purposeful AI Interaction
 * Minimalist futuristic environment for AI queries
 */
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float, Sphere } from '@react-three/drei';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AIDesk3D() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [result, setResult] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleOrbClick = () => {
        setShowInput(true);
    };

    const handleQuery = async () => {
        if (!query.trim()) return;

        setProcessing(true);
        // Simulate AI processing
        setTimeout(() => {
            let response = '';

            if (query.toLowerCase().includes('summarize') || query.toLowerCase().includes('summary')) {
                response = '📊 Placement Summary:\n\n156 students registered\n24 companies visited\n42 students placed (26.9%)\nAverage package: ₹8.5 LPA\nTop recruiter: Google (3 offers)';
            } else if (query.toLowerCase().includes('eligibility') || query.toLowerCase().includes('eligible')) {
                response = '✓ Eligibility Analysis:\n\nYou are eligible for 18 out of 24 drives\nTop matches: Microsoft, Amazon, Google\nBlocked due to: CGPA in 6 drives';
            } else if (query.toLowerCase().includes('compare')) {
                response = '📈 Year-over-Year:\n\n2024: 142 placed (91%)\n2025: 42 placed (26.9% - in progress)\nAvg package increased by 9%';
            } else {
                response = '🤖 AI Response:\n\nI can help you with:\n• Placement summaries\n• Eligibility analysis\n• Year comparisons\n• Drive insights';
            }

            setResult(response);
            setProcessing(false);
        }, 2000);
    };

    return (
        <div className="w-full h-screen bg-gradient-to-b from-emerald-950 to-gray-900">
            {/* Header */}
            <div className="absolute top-6 left-6 z-10 text-white">
                <h1 className="text-2xl font-bold">AI Assistant Desk</h1>
                <p className="text-white/60 text-sm">Purposeful AI for Placement Insights</p>
            </div>

            {/* Back Button */}
            <button
                onClick={() => router.push('/3d')}
                className="absolute top-6 right-6 z-10 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/20 transition-colors"
            >
                ← Back to Hub
            </button>

            {/* Query Input Panel */}
            {showInput && (
                <div className="absolute bottom-6 left-6 z-10 w-96 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4">Ask AI</h3>

                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., Summarize placement season"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4 resize-none"
                        rows={3}
                    />

                    <button
                        onClick={handleQuery}
                        disabled={processing}
                        className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 rounded-lg transition-colors"
                    >
                        {processing ? 'Processing...' : 'Submit Query'}
                    </button>

                    {/* Suggestions */}
                    <div className="mt-4 space-y-1">
                        <p className="text-xs text-white/60 mb-2">Try asking:</p>
                        <button
                            onClick={() => setQuery('Summarize placement season')}
                            className="block w-full text-left text-xs text-white/80 hover:text-white px-2 py-1 hover:bg-white/5 rounded"
                        >
                            • Summarize placement season
                        </button>
                        <button
                            onClick={() => setQuery('Analyze my eligibility')}
                            className="block w-full text-left text-xs text-white/80 hover:text-white px-2 py-1 hover:bg-white/5 rounded"
                        >
                            • Analyze my eligibility
                        </button>
                        <button
                            onClick={() => setQuery('Compare with last year')}
                            className="block w-full text-left text-xs text-white/80 hover:text-white px-2 py-1 hover:bg-white/5 rounded"
                        >
                            • Compare with last year
                        </button>
                    </div>
                </div>
            )}

            {/* Result Panel */}
            {result && (
                <div className="absolute bottom-6 right-6 z-10 w-96 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">AI Response</h3>
                        <button
                            onClick={() => setResult('')}
                            className="text-white/60 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                    <pre className="text-sm whitespace-pre-wrap font-mono">{result}</pre>
                </div>
            )}

            <Canvas camera={{ position: [0, 2, 6], fov: 60 }}>
                {/* Lighting */}
                <ambientLight intensity={0.3} />
                <pointLight position={[5, 5, 5]} intensity={1} color="#10b981" />
                <pointLight position={[-5, 5, -5]} intensity={0.8} color="#059669" />
                <spotLight
                    position={[0, 8, 0]}
                    angle={0.5}
                    penumbra={1}
                    intensity={1}
                    color="#10b981"
                />

                {/* Floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                    <planeGeometry args={[20, 20]} />
                    <meshStandardMaterial color="#064e3b" />
                </mesh>

                {/* Desk */}
                <group position={[0, 0, 0]}>
                    {/* Desk Surface */}
                    <mesh position={[0, 1, 0]}>
                        <boxGeometry args={[4, 0.1, 2]} />
                        <meshStandardMaterial color="#1e293b" />
                    </mesh>

                    {/* Desk Legs */}
                    {[[-1.8, -0.9], [1.8, -0.9], [-1.8, 0.9], [1.8, 0.9]].map(([x, z], i) => (
                        <mesh key={i} position={[x, 0.5, z]}>
                            <cylinderGeometry args={[0.05, 0.05, 1, 16]} />
                            <meshStandardMaterial color="#334155" />
                        </mesh>
                    ))}
                </group>

                {/* AI Orb */}
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
                    <group position={[0, 1.5, 0]}>
                        {/* Main Orb */}
                        <mesh onClick={handleOrbClick}>
                            <sphereGeometry args={[0.5, 32, 32]} />
                            <meshStandardMaterial
                                color="#10b981"
                                emissive="#10b981"
                                emissiveIntensity={processing ? 1 : 0.6}
                                transparent
                                opacity={0.8}
                            />
                        </mesh>

                        {/* Outer Ring */}
                        <mesh rotation={[Math.PI / 2, 0, 0]}>
                            <torusGeometry args={[0.7, 0.02, 16, 100]} />
                            <meshBasicMaterial color="#10b981" />
                        </mesh>

                        {/* Inner Core */}
                        <mesh>
                            <sphereGeometry args={[0.2, 16, 16]} />
                            <meshBasicMaterial
                                color="#ffffff"
                            />
                        </mesh>

                        {/* Label */}
                        <Text
                            position={[0, -1, 0]}
                            fontSize={0.2}
                            color="#10b981"
                            anchorX="center"
                        >
                            {processing ? '🔄 Processing...' : '🤖 Click to Ask'}
                        </Text>
                    </group>
                </Float>

                {/* Result Screen */}
                {result && (
                    <group position={[0, 2.5, -2]}>
                        <mesh>
                            <planeGeometry args={[3, 2]} />
                            <meshStandardMaterial
                                color="#0f172a"
                                emissive="#10b981"
                                emissiveIntensity={0.1}
                            />
                        </mesh>
                    </group>
                )}

                {/* Camera Controls */}
                <OrbitControls
                    enablePan={false}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 6}
                    maxDistance={10}
                    minDistance={4}
                />
            </Canvas>
        </div>
    );
}
