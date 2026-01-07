"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from "recharts";

const placementData = [
    { year: '2021', placed: 450 },
    { year: '2022', placed: 580 },
    { year: '2023', placed: 690 },
    { year: '2024', placed: 750 },
    { year: '2025', placed: 860 },
];

const deptData = [
    { name: 'CSE', placed: 240, total: 260 },
    { name: 'ECE', placed: 180, total: 200 },
    { name: 'ME', placed: 120, total: 180 },
    { name: 'CE', placed: 90, total: 150 },
    { name: 'IT', placed: 160, total: 170 },
    { name: 'EE', placed: 70, total: 120 },
];

export function AdminAnalytics() {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Placement Trends Area Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Placement Growth (Yearly)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={placementData}>
                                <defs>
                                    <linearGradient id="colorPlaced" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="year" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="placed" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPlaced)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Department-wise Stats Bar Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Department Wise Placements</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deptData} layout="vertical" barSize={20}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={30} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="total" stackId="a" fill="#e2e8f0" radius={[0, 4, 4, 0]} />
                                <Bar dataKey="placed" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} className="fill-primary" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> Placed</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-muted" /> Total Strength</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
