/**
 * @file src/components/academic-year/AcademicYearManagement.tsx
 * @description Main component for managing academic years in the dashboard
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { AcademicYearForm } from "./AcademicYearForm";
import { AcademicYearList } from "./AcademicYearList";
import {
    useAllAcademicYears,
    useAcademicYearStats,
    useCreateAcademicYear,
    useUpdateAcademicYear,
    useSoftDeleteAcademicYear,
} from "@/hooks/useAcademicYears";
import {
    AcademicYear,
    CreateAcademicYearData,
    UpdateAcademicYearData,
} from "@/interfaces/academicYear";
import {
    Calendar,
    Plus,
    Clock,
    CheckCircle,
    AlertCircle,
    BookOpen,
} from "lucide-react";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export const AcademicYearManagement: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingAcademicYear, setEditingAcademicYear] =
        useState<AcademicYear | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
        null
    );

    // Queries and mutations
    const { data: academicYears = [], isLoading } = useAllAcademicYears();
    const { stats, isLoading: statsLoading } = useAcademicYearStats();
    const createMutation = useCreateAcademicYear();
    const updateMutation = useUpdateAcademicYear();
    const deleteMutation = useSoftDeleteAcademicYear();

    const handleCreate = () => {
        setEditingAcademicYear(null);
        setShowForm(true);
    };

    const handleEdit = (academicYear: AcademicYear) => {
        setEditingAcademicYear(academicYear);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingAcademicYear(null);
    };

    const handleSubmit = async (
        data: CreateAcademicYearData | UpdateAcademicYearData
    ) => {
        try {
            if (editingAcademicYear) {
                await updateMutation.mutateAsync({
                    id: editingAcademicYear.id,
                    data: data as UpdateAcademicYearData,
                });
            } else {
                await createMutation.mutateAsync(
                    data as CreateAcademicYearData
                );
            }
            handleCloseForm();
        } catch {
            // Error handling is done in the hooks
        }
    };

    const handleDelete = (id: string) => {
        setShowDeleteConfirm(id);
    };

    const confirmDelete = async () => {
        if (showDeleteConfirm) {
            try {
                await deleteMutation.mutateAsync(showDeleteConfirm);
                setShowDeleteConfirm(null);
            } catch {
                // Error handling is done in the hooks
            }
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="space-y-4">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-4"
            >
                {/* Header */}
                <motion.div variants={itemVariants}>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">
                                Academic Year Management
                            </h2>
                            <p className="text-light-muted-text dark:text-dark-muted-text mt-1">
                                Manage academic years for your institution
                            </p>
                        </div>
                        {!showForm && (
                            <Button
                                onClick={handleCreate}
                                className="bg-light-highlight dark:bg-dark-highlight hover:bg-primary-dark text-white flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Academic Year
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div variants={itemVariants}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Total Years"
                            value={stats.totalAcademicYears}
                            icon={Calendar}
                            isLoading={statsLoading}
                            subtitle="Academic years"
                        />
                        <StatCard
                            title="Active Years"
                            value={stats.activeYearsCount}
                            icon={CheckCircle}
                            isLoading={statsLoading}
                            subtitle="Not deleted"
                        />
                        <StatCard
                            title="Current Year"
                            value={stats.currentYear?.yearString || "None"}
                            icon={Clock}
                            isLoading={statsLoading}
                            subtitle="Active now"
                        />
                        <StatCard
                            title="Upcoming Year"
                            value={stats.upcomingYear?.yearString || "None"}
                            icon={BookOpen}
                            isLoading={statsLoading}
                            subtitle="Next period"
                        />
                    </div>
                </motion.div>

                {/* Form or List */}
                <motion.div variants={itemVariants}>
                    {showForm ? (
                        <AcademicYearForm
                            academicYear={editingAcademicYear || undefined}
                            onSubmit={handleSubmit}
                            onCancel={handleCloseForm}
                            isLoading={isSubmitting}
                            mode={editingAcademicYear ? "edit" : "create"}
                        />
                    ) : (
                        <AcademicYearList
                            academicYears={academicYears}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            isLoading={isLoading}
                        />
                    )}
                </motion.div>
            </motion.div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-light-background dark:bg-dark-muted-background rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/20">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                                Delete Academic Year
                            </h3>
                        </div>

                        <p className="text-light-muted-text dark:text-dark-muted-text mb-6">
                            Are you sure you want to delete this academic year?
                            This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteConfirm(null)}
                                disabled={deleteMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmDelete}
                                disabled={deleteMutation.isPending}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {deleteMutation.isPending ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                        Deleting...
                                    </div>
                                ) : (
                                    "Delete"
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
