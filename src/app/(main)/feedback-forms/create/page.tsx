// src/app/(main)/feedback/create/page.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowLeftIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    EyeIcon,
    XMarkIcon,
    BoltIcon,
} from "@heroicons/react/24/outline";
import { showToast } from "@/lib/toast";

// Import UI components
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/common/Loader";

// Import services
import feedbackFormService from "@/services/feedbackFormService";
import academicStructureService, {
    Semester,
    Division,
} from "@/services/academicStructureService";
import { useAllAcademicYears } from "@/hooks/useAcademicYears";

// Import interfaces
import { GenerateFormsData } from "@/interfaces/feedbackForm";
import { DepartmentWithAcademicStructure } from "@/interfaces/academicStructure";

interface Selection {
    departmentId: string;
    academicYearId: string;
    semesterSelections: {
        [semesterId: string]: {
            selected: boolean;
            indeterminate: boolean;
            divisions: string[];
        };
    };
}

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    selection: Selection;
    academicStructure: DepartmentWithAcademicStructure[];
    onGenerate: () => void;
    loading: boolean;
}

const PreviewModal = ({
    isOpen,
    onClose,
    selection,
    academicStructure,
    onGenerate,
    loading,
}: PreviewModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-light-background dark:bg-dark-background rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto mx-4">
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <EyeIcon className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">
                                Selection Preview
                            </h2>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                            className="p-2"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-light-text dark:text-dark-text">
                                Selected Department
                            </h3>
                            <p className="text-light-muted-text dark:text-dark-muted-text mt-1">
                                {
                                    academicStructure.find(
                                        (d) => d.id === selection.departmentId
                                    )?.name
                                }
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-light-text dark:text-dark-text">
                                Selected Semesters and Divisions
                            </h3>
                            <div className="mt-2 space-y-3">
                                {Object.entries(selection.semesterSelections)
                                    .filter(
                                        ([, value]) =>
                                            value.divisions.length > 0
                                    )
                                    .map(([semId, value]) => {
                                        const semester = academicStructure
                                            .flatMap((d) => d.semesters)
                                            .find((s) => s.id === semId);
                                        return (
                                            <div
                                                key={semId}
                                                className="bg-light-muted-background dark:bg-dark-muted-background p-3 rounded-lg"
                                            >
                                                <p className="font-medium text-light-text dark:text-dark-text">
                                                    Semester{" "}
                                                    {semester?.semesterNumber}
                                                    <span className="text-sm text-light-muted-text dark:text-dark-muted-text ml-2">
                                                        (
                                                        {
                                                            semester
                                                                ?.academicYear
                                                                .yearString
                                                        }
                                                        )
                                                    </span>
                                                </p>
                                                <p className="text-sm text-light-muted-text dark:text-dark-muted-text mt-1">
                                                    Divisions:{" "}
                                                    {value.divisions
                                                        .map(
                                                            (divId) =>
                                                                semester?.divisions.find(
                                                                    (d) =>
                                                                        d.id ===
                                                                        divId
                                                                )?.divisionName
                                                        )
                                                        .join(", ")}
                                                </p>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-light-secondary dark:border-dark-secondary">
                        <Button
                            onClick={onGenerate}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader />
                                    Generating Forms...
                                </span>
                            ) : (
                                "Generate Forms"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function CreateFeedbackForm() {
    const router = useRouter();
    const { data: academicYears = [] } = useAllAcademicYears();
    const [academicStructure, setAcademicStructure] = useState<
        DepartmentWithAcademicStructure[]
    >([]);
    const [selectedAcademicYearId, setSelectedAcademicYearId] =
        useState<string>("");
    const [selection, setSelection] = useState<Selection>({
        departmentId: "",
        academicYearId: "",
        semesterSelections: {},
    });
    const [showSelectionPreview, setShowSelectionPreview] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLoadingStructure, setIsLoadingStructure] = useState(true);
    const [expandedDepts, setExpandedDepts] = useState<string[]>([]);
    const [expandedSems, setExpandedSems] = useState<string[]>([]);

    const toggleSemester = (semesterId: string) => {
        setExpandedSems((prev) =>
            prev.includes(semesterId)
                ? prev.filter((id) => id !== semesterId)
                : [...prev, semesterId]
        );
    };

    const fetchAcademicStructure = useCallback(
        async (academicYearId?: string) => {
            setIsLoadingStructure(true);
            try {
                const structure = academicYearId
                    ? await academicStructureService.getAcademicStructureByYear(
                          academicYearId
                      )
                    : await academicStructureService.getAcademicStructure();

                // Sort the academic structure
                const sortedStructure = structure
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((dept) => ({
                        ...dept,
                        semesters: dept.semesters
                            .sort((a, b) => {
                                // First sort by academic year (descending - newest first)
                                const yearComparison =
                                    b.academicYear.yearString.localeCompare(
                                        a.academicYear.yearString
                                    );
                                if (yearComparison !== 0) return yearComparison;
                                // Then by semester number (ascending)
                                return a.semesterNumber - b.semesterNumber;
                            })
                            .map((sem) => ({
                                ...sem,
                                divisions: sem.divisions.sort((a, b) =>
                                    a.divisionName.localeCompare(b.divisionName)
                                ),
                            })),
                    }));

                setAcademicStructure(sortedStructure);
            } catch (error) {
                console.error("Failed to fetch academic structure:", error);
                showToast.error("Failed to load academic structure");
            } finally {
                setIsLoadingStructure(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchAcademicStructure();
    }, [fetchAcademicStructure]);

    // Effect to set default academic year when academic years are loaded
    useEffect(() => {
        if (academicYears.length > 0 && !selectedAcademicYearId) {
            const activeYear = academicYears.find((year) => year.isActive);
            const defaultYear = activeYear || academicYears[0];
            setSelectedAcademicYearId(defaultYear.id);
            setSelection((_prev) => ({
                ..._prev,
                academicYearId: defaultYear.id,
            }));
        }
    }, [academicYears, selectedAcademicYearId]);

    // Effect to refetch structure when academic year changes
    useEffect(() => {
        if (selectedAcademicYearId) {
            fetchAcademicStructure(selectedAcademicYearId);
            // Reset selection when academic year changes
            setSelection((_prev) => ({
                departmentId: "",
                academicYearId: selectedAcademicYearId,
                semesterSelections: {},
            }));
        }
    }, [selectedAcademicYearId, fetchAcademicStructure]);

    const handleAcademicYearChange = (yearId: string) => {
        setSelectedAcademicYearId(yearId);
    };

    const handleDepartmentSelect = (deptId: string) => {
        const currentDeptId = selection.departmentId === deptId ? "" : deptId;
        setSelection({
            departmentId: currentDeptId,
            academicYearId: selection.academicYearId,
            semesterSelections:
                currentDeptId === "" ? {} : selection.semesterSelections,
        });
    };

    const handleSemesterSelect = (semId: string, divisions: Division[]) => {
        const currentSelection = selection.semesterSelections[semId];
        const allDivisionIds = divisions.map((d) => d.id);

        setSelection({
            ...selection,
            semesterSelections: {
                ...selection.semesterSelections,
                [semId]: {
                    selected: !currentSelection?.selected,
                    indeterminate: false,
                    divisions: currentSelection?.selected ? [] : allDivisionIds,
                },
            },
        });
    };

    const handleDivisionSelect = (
        semId: string,
        divId: string,
        allDivisions: Division[]
    ) => {
        const currentSemSelection = selection.semesterSelections[semId] || {
            selected: false,
            indeterminate: false,
            divisions: [],
        };

        const newDivisions = currentSemSelection.divisions.includes(divId)
            ? currentSemSelection.divisions.filter((id) => id !== divId)
            : [...currentSemSelection.divisions, divId];

        const allDivisionIds = allDivisions.map((d) => d.id);
        const isAllSelected = allDivisionIds.every((id) =>
            newDivisions.includes(id)
        );
        const isPartiallySelected = newDivisions.length > 0 && !isAllSelected;

        setSelection({
            ...selection,
            semesterSelections: {
                ...selection.semesterSelections,
                [semId]: {
                    selected: isAllSelected,
                    indeterminate: isPartiallySelected,
                    divisions: newDivisions,
                },
            },
        });
    };

    const handlePreviewSelection = () => {
        if (
            !selection.departmentId ||
            Object.keys(selection.semesterSelections).length === 0
        ) {
            showToast.error("Please select at least one department and semester");
            return;
        }
        setShowSelectionPreview(true);
    };

    const handleGenerateForms = async () => {
        setLoading(true);
        try {
            const formData: GenerateFormsData = {
                departmentId: selection.departmentId,
                selectedSemesters: Object.entries(selection.semesterSelections)
                    .filter(([, value]) => value.divisions.length > 0)
                    .map(([semesterId, value]) => ({
                        id: semesterId,
                        divisions: value.divisions,
                    })),
            };

            const generatedForms = await feedbackFormService.generateForms(
                formData
            );

            showToast.success(
                `Successfully generated ${generatedForms.length} feedback forms!`
            );
            setShowSelectionPreview(false);
            setSelection({
                departmentId: "",
                academicYearId: selectedAcademicYearId,
                semesterSelections: {},
            });

            // Redirect back to main feedback page
            router.push("/feedback-forms");
        } catch (error) {
            console.error("Failed to generate forms:", error);
            showToast.error("Failed to generate forms. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderSemesterContent = (sem: Semester, semId: string) => (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sem.divisions.map((div) => (
                    <div
                        key={div.id}
                        className={`
                            p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                            ${
                                selection.semesterSelections[
                                    semId
                                ]?.divisions.includes(div.id)
                                    ? "border-primary bg-primary/10"
                                    : "border-light-secondary dark:border-dark-secondary hover:border-primary/50"
                            }
                        `}
                        onClick={() =>
                            handleDivisionSelect(semId, div.id, sem.divisions)
                        }
                    >
                        <div className="flex items-center justify-between space-x-4">
                            <div>
                                {" "}
                                <p className="font-medium text-light-text dark:text-dark-text">
                                    Division {div.divisionName}
                                </p>
                                <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                    Semester {sem.semesterNumber}
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={
                                    selection.semesterSelections[
                                        semId
                                    ]?.divisions.includes(div.id) || false
                                }
                                onChange={(e) => {
                                    e.stopPropagation();
                                    handleDivisionSelect(
                                        semId,
                                        div.id,
                                        sem.divisions
                                    );
                                }}
                                aria-label={`Select division ${div.divisionName}`}
                                className="h-5 w-5 rounded border-light-secondary text-primary focus:ring-primary"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (isLoadingStructure) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-muted-background dark:bg-dark-background">
                <div className="text-center">
                    <Loader />
                    <p className="text-light-text dark:text-dark-text ml-2 mt-2">
                        Loading academic structure...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light-muted-background dark:bg-dark-background">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.back()}
                            className="p-2"
                        >
                            <ArrowLeftIcon className="h-6 w-6" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-semibold text-light-text dark:text-dark-text">
                                Generate Feedback Forms
                            </h1>
                            <p className="text-light-muted-text dark:text-dark-muted-text mt-1">
                                Select departments, semesters, and divisions to
                                generate feedback forms
                            </p>
                        </div>
                    </div>

                    {/* Academic Year Selector */}
                    {academicYears.length > 0 && (
                        <Card className="bg-light-background dark:bg-dark-background">
                            <div className="p-6">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                                        Academic Year:
                                    </h3>
                                    <select
                                        title="Select Academic Year"
                                        value={selectedAcademicYearId}
                                        onChange={(e) =>
                                            handleAcademicYearChange(
                                                e.target.value
                                            )
                                        }
                                        className="px-4 py-2 border border-light-secondary dark:border-dark-secondary rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        {academicYears.map((year) => (
                                            <option
                                                key={year.id}
                                                value={year.id}
                                            >
                                                {year.yearString}{" "}
                                                {year.isActive && "(Active)"}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Main Content */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text flex items-center gap-2">
                                <BoltIcon className="h-6 w-6 text-primary" />
                                Academic Structure
                            </h2>
                            <Button
                                onClick={handlePreviewSelection}
                                disabled={!selection.departmentId}
                                className="flex items-center gap-2"
                            >
                                <EyeIcon className="h-4 w-4" />
                                Preview Selection
                            </Button>
                        </div>

                        <Card className="bg-light-background dark:bg-dark-background">
                            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                                <div className="space-y-4 p-6">
                                    {academicStructure.map((dept) => (
                                        <div
                                            key={dept.id}
                                            className="rounded-xl bg-light-background dark:bg-dark-background border border-light-secondary dark:border-dark-secondary"
                                        >
                                            <div
                                                className="flex items-center justify-between p-4 hover:bg-light-muted-background dark:hover:bg-dark-muted-background rounded-t-xl cursor-pointer"
                                                onClick={() =>
                                                    handleDepartmentSelect(
                                                        dept.id
                                                    )
                                                }
                                            >
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setExpandedDepts(
                                                                (prev) =>
                                                                    prev.includes(
                                                                        dept.id
                                                                    )
                                                                        ? prev.filter(
                                                                              (
                                                                                  id
                                                                              ) =>
                                                                                  id !==
                                                                                  dept.id
                                                                          )
                                                                        : [
                                                                              ...prev,
                                                                              dept.id,
                                                                          ]
                                                            );
                                                        }}
                                                        className="p-1.5 rounded-full hover:bg-light-muted-background dark:hover:bg-dark-muted-background"
                                                    >
                                                        {expandedDepts.includes(
                                                            dept.id
                                                        ) ? (
                                                            <ChevronDownIcon className="h-5 w-5 text-primary" />
                                                        ) : (
                                                            <ChevronRightIcon className="h-5 w-5 text-primary" />
                                                        )}
                                                    </button>
                                                    <span className="font-semibold text-light-text dark:text-dark-text">
                                                        Department of{" "}
                                                        {dept.name}
                                                    </span>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selection.departmentId ===
                                                        dept.id
                                                    }
                                                    onChange={() =>
                                                        handleDepartmentSelect(
                                                            dept.id
                                                        )
                                                    }
                                                    aria-label={`Select ${dept.name} department`}
                                                    className="h-5 w-5 rounded border-light-secondary text-primary focus:ring-primary"
                                                />
                                            </div>

                                            {expandedDepts.includes(
                                                dept.id
                                            ) && (
                                                <div className="border-t border-light-secondary dark:border-dark-secondary bg-light-muted-background dark:bg-dark-muted-background">
                                                    <div className="p-4 space-y-4">
                                                        {dept.semesters
                                                            .filter(
                                                                (sem) =>
                                                                    sem
                                                                        .divisions
                                                                        .length >
                                                                    0
                                                            )
                                                            .map((sem) => (
                                                                <div
                                                                    key={sem.id}
                                                                    className="border-l-2 border-primary pl-4 ml-4"
                                                                >
                                                                    <div
                                                                        className="flex items-center justify-between p-3 hover:bg-light-background dark:hover:bg-dark-background rounded-lg cursor-pointer"
                                                                        onClick={() =>
                                                                            handleSemesterSelect(
                                                                                sem.id,
                                                                                sem.divisions
                                                                            )
                                                                        }
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <button
                                                                                onClick={(
                                                                                    e
                                                                                ) => {
                                                                                    e.stopPropagation();
                                                                                    toggleSemester(
                                                                                        sem.id
                                                                                    );
                                                                                }}
                                                                                className="p-1.5 rounded-full hover:bg-light-muted-background dark:hover:bg-dark-muted-background"
                                                                            >
                                                                                {expandedSems.includes(
                                                                                    sem.id
                                                                                ) ? (
                                                                                    <ChevronDownIcon className="h-5 w-5 text-primary" />
                                                                                ) : (
                                                                                    <ChevronRightIcon className="h-5 w-5 text-primary" />
                                                                                )}
                                                                            </button>
                                                                            <span className="font-medium text-light-text dark:text-dark-text">
                                                                                Semester{" "}
                                                                                {
                                                                                    sem.semesterNumber
                                                                                }
                                                                                <span className="text-sm text-light-muted-text dark:text-dark-muted-text ml-2">
                                                                                    (
                                                                                    {
                                                                                        sem
                                                                                            .academicYear
                                                                                            .yearString
                                                                                    }

                                                                                    )
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={
                                                                                selection
                                                                                    .semesterSelections[
                                                                                    sem
                                                                                        .id
                                                                                ]
                                                                                    ?.selected ||
                                                                                false
                                                                            }
                                                                            onChange={() =>
                                                                                handleSemesterSelect(
                                                                                    sem.id,
                                                                                    sem.divisions
                                                                                )
                                                                            }
                                                                            aria-label={`Select semester ${sem.semesterNumber}`}
                                                                            className="h-5 w-5 rounded border-light-secondary text-primary focus:ring-primary"
                                                                        />
                                                                    </div>
                                                                    {expandedSems.includes(
                                                                        sem.id
                                                                    ) &&
                                                                        renderSemesterContent(
                                                                            sem,
                                                                            sem.id
                                                                        )}
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>

                    <AnimatePresence>
                        <PreviewModal
                            isOpen={showSelectionPreview}
                            onClose={() => setShowSelectionPreview(false)}
                            selection={selection}
                            academicStructure={academicStructure}
                            onGenerate={handleGenerateForms}
                            loading={loading}
                        />
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
