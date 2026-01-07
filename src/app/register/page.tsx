"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate registration delay
        setTimeout(() => {
            setIsLoading(false);
            window.location.href = "/login"; // Force redirect
        }, 1500);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Branding & Info */}
            <div className="hidden lg:flex flex-col justify-center p-12 bg-zinc-900 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2940&auto=format&fit=crop')] bg-cover opacity-20" />
                <div className="relative z-10 max-w-lg">
                    <div className="mb-8 p-3 bg-white/10 w-fit rounded-lg backdrop-blur-sm border border-white/10">
                        <span className="font-bold text-xl tracking-tight">Lumos | Campus</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-6">Join the Next Generation of Campus Placements</h1>
                    <p className="text-lg text-zinc-300 leading-relaxed mb-8">
                        Create your profile to unlock exclusive opportunities, track your applications in real-time, and get AI-powered career guidance.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">1</div>
                            <div>
                                <h3 className="font-semibold">One-Click Apply</h3>
                                <p className="text-sm text-zinc-400">Apply to multiple drives instantly</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">2</div>
                            <div>
                                <h3 className="font-semibold">AI Assistant</h3>
                                <p className="text-sm text-zinc-400">Get resume feedback and prep tips</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Registration Form */}
            <div className="flex items-center justify-center p-8 bg-background">
                <Card className="w-full max-w-md border-0 shadow-none">
                    <CardHeader className="px-0">
                        <CardTitle className="text-2xl font-bold">Student Registration</CardTitle>
                        <CardDescription>
                            Enter your details to create your student account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" placeholder="Arjun" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" placeholder="Kumar" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">College Email</Label>
                                <Input id="email" type="email" placeholder="arjun@college.edu" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input id="dob" type="date" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mobile">Mobile No</Label>
                                    <Input id="mobile" placeholder="+91 9876543210" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="branch">Branch / Department</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cse">Computer Science (CSE)</SelectItem>
                                        <SelectItem value="ece">Electronics (ECE)</SelectItem>
                                        <SelectItem value="me">Mechanical (ME)</SelectItem>
                                        <SelectItem value="ce">Civil (CE)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" required />
                            </div>

                            <div className="pt-4">
                                <Button className="w-full h-11" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="text-center text-sm text-muted-foreground pt-2">
                                Already have an account? <Link href="/login" className="text-primary hover:underline font-medium">Sign In</Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
