"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import { useData } from "@/context/data-context";

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b']; // Blue, Green, Red, Amber

export function StudentAnalytics() {
    const { applications } = useData();

    // Aggregate application status for Pie Chart
    const statusCounts = applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const pieData = Object.keys(statusCounts).map(status => ({
        name: status,
        value: statusCounts[status]
    }));

    // Fallback if no data
    const finalPieData = pieData.length > 0 ? pieData : [{ name: "No Data", value: 1 }];
    const finalColors = pieData.length > 0 ? COLORS : ['#e5e7eb'];

    // Mock Activity Data for Bar Chart (since we don't have historical timestamps for everything yet)
    const activityData = [
        { name: 'Mon', active: 2 },
        { name: 'Tue', active: 5 },
        { name: 'Wed', active: 3 },
        { name: 'Thu', active: 7 },
        { name: 'Fri', active: 4 },
        { name: 'Sat', active: 1 },
        { name: 'Sun', active: 0 },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Application Status Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Application Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={finalPieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {finalPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={finalColors[index % finalColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4 text-xs text-muted-foreground">
                        {finalPieData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: finalColors[index % finalColors.length] }} />
                                {entry.name} ({entry.value})
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Weekly Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="active" fill="#3b82f6" radius={[4, 4, 0, 0]} className="fill-primary" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
