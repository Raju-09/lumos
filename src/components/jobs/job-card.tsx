"use client";

import { useAuth } from "@/context/auth-context";
import { useData } from "@/context/data-context";
import { Drive } from "@/lib/data-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Calendar, MapPin, Building, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function JobCard({ drive }: { drive: Drive }) {
    const { user } = useAuth();
    const { applyToDrive, hasApplied } = useData();
    const [isApplying, setIsApplying] = useState(false);

    const applied = hasApplied(drive.id);

    // -- ELIGIBILITY ENGINE --
    let isEligible = true;
    let ineligibilityReason = "";

    if (user && user.role === "STUDENT") {
        // Type assertion for StudentProfile
        const student = user as any;

        // 1. Check CGPA
        if (student.cgpa < drive.eligibility.cgpaCutoff) {
            isEligible = false;
            ineligibilityReason = `CGPA < ${drive.eligibility.cgpaCutoff}`;
        }
        // 2. Check Backlogs
        else if (student.backlogs > drive.eligibility.maxBacklogs) {
            isEligible = false;
            ineligibilityReason = `Backlogs > ${drive.eligibility.maxBacklogs}`;
        }
        // 3. Check Branch
        else if (!drive.eligibility.allowedBranches.includes(student.department)) {
            const stdBranch = student.department === "Computer Science" ? "CSE" : student.department;
            if (!drive.eligibility.allowedBranches.includes(stdBranch)) {
                isEligible = false;
                ineligibilityReason = "Branch not allowed";
            }
        }
    }

    const handleApply = async () => {
        setIsApplying(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        applyToDrive(drive.id);
        setIsApplying(false);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-primary group h-full flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center font-bold text-xl text-primary">
                            {drive.companyName.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{drive.role}</h3>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Building className="w-3 h-3" />
                                {drive.companyName}
                            </div>
                        </div>
                    </div>
                    <Badge variant={isEligible ? "default" : "destructive"} className="uppercase text-xs tracking-wider">
                        {isEligible ? "Eligible" : "Not Eligible"}
                    </Badge>
                </CardHeader>

                <CardContent className="space-y-4 flex-1">
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1.5 bg-accent/50 px-2 py-1 rounded text-muted-foreground">
                            <MapPin className="w-3 h-3" /> {drive.location.join(', ')}
                        </div>
                        <div className="flex items-center gap-1.5 bg-accent/50 px-2 py-1 rounded text-muted-foreground">
                            <span className="font-semibold text-foreground">₹{drive.ctcMin}-{drive.ctcMax} LPA</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-accent/50 px-2 py-1 rounded text-muted-foreground">
                            <Calendar className="w-3 h-3" /> Ends {new Date(drive.deadline).toLocaleDateString()}
                        </div>
                    </div>

                    {!isEligible && (
                        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-2 rounded">
                            <AlertCircle className="w-4 h-4" />
                            <span>Why? {ineligibilityReason}</span>
                        </div>
                    )}
                </CardContent>

                <CardFooter>
                    {applied ? (
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white" disabled>
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Applied
                        </Button>
                    ) : (
                        <Button
                            className="w-full"
                            disabled={!isEligible || isApplying}
                            variant={isEligible ? "default" : "outline"}
                            onClick={handleApply}
                        >
                            {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : isEligible ? "Apply Now" : "Restricted"}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
}
