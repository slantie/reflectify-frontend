"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserPlus, Users, Loader2, AlertCircle } from "lucide-react";
import { showToast } from "@/lib/toast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { OverrideStudent } from "@/interfaces/overrideStudent";
import overrideStudentsService from "@/services/overrideStudentsService";

interface OverrideStudentsListProps {
    formId: string;
    isExpanded: boolean;
}

export const OverrideStudentsList = ({
    formId,
    isExpanded,
}: OverrideStudentsListProps) => {
    const [students, setStudents] = useState<OverrideStudent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isExpanded) return;

        const fetchStudents = async () => {
            setLoading(true);
            try {
                const data =
                    await overrideStudentsService.getAllOverrideStudents(
                        formId
                    );
                setStudents(data);
                setError(null);
            } catch (err: any) {
                console.error("Failed to fetch override students:", err);
                setError(err.message || "Failed to fetch override students");
                showToast.error("Failed to load override students");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [formId, isExpanded]);

    if (!isExpanded) return null;

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-light-background dark:bg-dark-muted-background rounded-md"
            >
                <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-light-highlight dark:text-dark-highlight" />
                    <span className="ml-2 text-light-text dark:text-dark-text">
                        Loading override students...
                    </span>
                </div>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-light-background dark:bg-dark-muted-background rounded-md"
            >
                <div className="flex items-center justify-center py-4 text-red-500">
                    <AlertCircle className="w-6 h-6" />
                    <span className="ml-2">{error}</span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-light-background dark:bg-dark-muted-background rounded-md"
        >
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text flex items-center">
                    <Users className="mr-2 w-5 h-5" />
                    Override Students
                    <Badge variant="secondary" className="ml-2">
                        {students.length}
                    </Badge>
                </h4>
                <Button size="sm" className="flex items-center gap-1">
                    <UserPlus className="w-4 h-4" />
                    Add Student
                </Button>
            </div>

            {students.length === 0 ? (
                <div className="text-center py-8 text-light-muted-text dark:text-dark-muted-text">
                    <Users className="w-12 h-12 mx-auto opacity-40 mb-2" />
                    <p>
                        No override students have been added to this form yet.
                    </p>
                    <p className="text-sm">
                        Override students are manually added students who can
                        access this form.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-light-muted-background dark:bg-dark-muted-background">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Enrollment</th>
                                <th className="px-4 py-3">Department</th>
                                <th className="px-4 py-3">Semester</th>
                                <th className="px-4 py-3">Batch</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr
                                    key={student.id}
                                    className="border-b border-light-border dark:border-dark-border hover:bg-light-muted-background dark:hover:bg-dark-muted-background"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {student.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {student.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        {student.enrollmentNumber || "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                        {student.department || "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                        {student.semester || "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                        {student.batch || "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm">
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    );
};
