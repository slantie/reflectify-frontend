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
} from "@heroicons/react/24/outline";
import { showToast } from "@/lib/toast";

// Import UI components
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/common/Loader";

// Import services
import feedbackFormService from "@/services/feedbackFormService";
import academicStructureService from "@/services/academicStructure.service";
import type {
  AcademicSemester,
  AcademicDivision,
} from "@/interfaces/academicStructure";
import { useAllAcademicYears } from "@/hooks/useAcademicYears";

// Import interfaces
import { GenerateFormsData } from "@/interfaces/feedbackForm";
import { DepartmentWithAcademicStructure } from "@/interfaces/academicStructure";
import { Select } from "@/components/ui";

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

// --- Preview Modal ---
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
              <EyeIcon className="h-6 w-6 text-light-text dark:text-dark-text" />
              <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">
                Selection Preview
              </h2>
            </div>
            <button
              type="button"
              aria-label="Close preview"
              onClick={onClose}
              className="p-2 bg-transparent"
            >
              <XMarkIcon className="h-6 w-6 text-light-text dark:text-dark-text" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-light-text dark:text-dark-text">
                Selected Department
              </h3>
              <p className="text-light-muted-text dark:text-dark-muted-text mt-1">
                {academicStructure.find((d) => d.id === selection.departmentId)
                  ?.name || <span className="italic">None</span>}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-light-text dark:text-dark-text">
                Selected Semesters and Divisions
              </h3>
              <div className="mt-2 space-y-3">
                {Object.entries(selection.semesterSelections)
                  .filter(([, value]) => value.divisions.length > 0)
                  .map(([semId, value]) => {
                    const semester = academicStructure
                      .flatMap((d) => d.semesters)
                      .find((s) => s.id === semId);
                    return (
                      <div
                        key={semId}
                        className="bg-light-muted-background dark:bg-dark-muted-background p-3 rounded-lg"
                      >
                        <div className="font-medium text-light-text dark:text-dark-text">
                          {/* Use 'Semester X' if semesterNumber exists, else fallback to 'Semester' */}
                          {semester?.semesterNumber
                            ? `Semester ${semester.semesterNumber}`
                            : "Semester"}{" "}
                          {semester?.academicYear?.yearString
                            ? `(${semester.academicYear.yearString})`
                            : ""}
                        </div>
                        <div className="text-light-muted-text dark:text-dark-muted-text text-sm mt-1">
                          Divisions:{" "}
                          {value.divisions.length > 0
                            ? value.divisions.length
                            : 0}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {semester?.divisions
                            .filter((div) => value.divisions.includes(div.id))
                            .map((div) => (
                              <span
                                key={div.id}
                                className="px-2 py-1 bg-primary/10 text-light-text dark:text-dark-text rounded text-xs"
                              >
                                {div.divisionName}
                              </span>
                            ))}
                        </div>
                      </div>
                    );
                  })}
                {Object.keys(selection.semesterSelections).length === 0 && (
                  <div className="text-light-muted-text dark:text-dark-muted-text italic">
                    No semesters/divisions selected.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-light-secondary dark:border-dark-secondary">
            <button
              onClick={onGenerate}
              disabled={loading}
              className="w-full bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text rounded-xl px-4 py-2 flex items-center justify-center gap-2 hover:bg-light-secondary/80 dark:hover:bg-dark-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-light-noisy-text dark:border-dark-noisy-text"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader size="18" /> Generating...
                </span>
              ) : (
                "Generate Forms"
              )}
            </button>
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

  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string>(
    academicYears.find((year) => year.isActive)?.id || "",
  );
  const toggleSemester = (semesterId: string) => {
    setExpandedSems((prev) =>
      prev.includes(semesterId)
        ? prev.filter((id) => id !== semesterId)
        : [...prev, semesterId],
    );
  };

  const fetchAcademicStructure = useCallback(
    async (academicYearId?: string) => {
      setIsLoadingStructure(true);
      try {
        const structure = academicYearId
          ? await academicStructureService.getAcademicStructureByYear(
              academicYearId,
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
                const yearComparison = b.academicYear.yearString.localeCompare(
                  a.academicYear.yearString,
                );
                if (yearComparison !== 0) return yearComparison;
                // Then by semester number (ascending)
                return a.semesterNumber - b.semesterNumber;
              })
              .map((sem) => ({
                ...sem,
                divisions: sem.divisions.sort((a, b) =>
                  a.divisionName.localeCompare(b.divisionName),
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
    [],
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
        ..._prev,
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

  const handleSemesterSelect = (
    semId: string,
    divisions: AcademicDivision[],
  ) => {
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
    allDivisions: AcademicDivision[],
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
      newDivisions.includes(id),
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

      const generatedForms = await feedbackFormService.generateForms(formData);

      showToast.success(
        `Successfully generated ${generatedForms.length} feedback forms!`,
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

  const renderSemesterContent = (sem: AcademicSemester, semId: string) => (
    <div className="space-y-4 pt-4">
      {" "}
      {/* Added padding top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
            onClick={() => handleDivisionSelect(semId, div.id, sem.divisions)}
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
                  selection.semesterSelections[semId]?.divisions.includes(
                    div.id,
                  ) || false
                }
                onChange={(e) => {
                  e.stopPropagation();
                  handleDivisionSelect(semId, div.id, sem.divisions);
                }}
                aria-label={`Select division ${div.divisionName}`}
                className="h-5 w-5 rounded border-light-secondary text-light-text dark:text-dark-text focus:ring-primary"
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
          className="space-y-4"
        >
          <div className="flex items-center gap-4 mb-6">
            {" "}
            {/* Increased bottom margin */}
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full transition-colors text-light-muted-text dark:text-dark-muted-text hover:bg-light-hover dark:hover:bg-dark-hover"
              title="Go back"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
              Generate Feedback Forms
            </h1>
          </div>

          {/* Academic Year Selector */}
          {academicYears.length > 0 && (
            <Card className="bg-light-background dark:bg-dark-background shadow-md flex items-center justify-between">
              {" "}
              {/* Added shadow */}
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {" "}
                  {/* Responsive layout for year selector */}
                  <h3 className="text-xl font-semibold text-light-text dark:text-dark-text min-w-[120px]">
                    {" "}
                    {/* Min-width for consistent alignment */}
                    Academic Year:
                  </h3>
                  <Select
                    id="academic-year-select"
                    name="academicYear"
                    title="Select Academic Year"
                    value={selectedAcademicYearId}
                    className="text-lg w-full px-3 py-2 border border-light-secondary dark:border-dark-secondary rounded-xl shadow-sm
                               bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text
                               focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main
                             transition-colors appearance-none pr-10"
                    onChange={(e) => handleAcademicYearChange(e.target.value)}
                  >
                    {academicYears.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.yearString} {year.isActive && "(Active)"}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <Button
                onClick={handlePreviewSelection}
                disabled={
                  !selection.departmentId ||
                  Object.keys(selection.semesterSelections).length === 0
                } // Disable if no department or semesters selected
                className="flex items-center gap-2 w-full sm:w-auto" // Full width on small screens
              >
                <EyeIcon className="h-5 w-5 text-white" />
                <span className="text-white text-md font-normal">
                  Preview Selection
                </span>
              </Button>
            </Card>
          )}

          <div className="space-y-6">
            <Card className="bg-light-background dark:bg-dark-background shadow-md">
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text flex items-center gap-2 mb-4 rounded-xl">
                Academic Structure
              </h2>
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {" "}
                {/* Added pr-2 for scrollbar spacing */}
                <div className="space-y-4 rounded-xl">
                  {academicStructure.length > 0 ? (
                    academicStructure.map((dept) => (
                      <div
                        key={dept.id}
                        className={`rounded-xl border-2 transition-all duration-200
                                                    ${
                                                      selection.departmentId ===
                                                      dept.id
                                                        ? "border-primary bg-primary/5"
                                                        : "border-light-secondary dark:border-dark-secondary hover:border-light-primary/30 dark:hover:border-dark-primary/30"
                                                    }
                                                `}
                      >
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer"
                          onClick={() => handleDepartmentSelect(dept.id)}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent department selection when toggling expansion
                                setExpandedDepts((prev) =>
                                  prev.includes(dept.id)
                                    ? prev.filter((id) => id !== dept.id)
                                    : [...prev, dept.id],
                                );
                              }}
                              className="p-1.5 rounded-full hover:bg-light-muted-background dark:hover:bg-dark-muted-background"
                              aria-label={
                                expandedDepts.includes(dept.id)
                                  ? `Collapse ${dept.name} department`
                                  : `Expand ${dept.name} department`
                              }
                            >
                              {expandedDepts.includes(dept.id) ? (
                                <ChevronDownIcon className="h-5 w-5 text-light-text dark:text-dark-text" />
                              ) : (
                                <ChevronRightIcon className="h-5 w-5 text-light-text dark:text-dark-text" />
                              )}
                            </button>
                            <span
                              className="font-semibold text-light-text dark:text-dark-text cursor-pointer"
                              onClick={() =>
                                setExpandedDepts((prev) =>
                                  prev.includes(dept.id)
                                    ? prev.filter((id) => id !== dept.id)
                                    : [...prev, dept.id],
                                )
                              }
                            >
                              Department of {dept.name}
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={selection.departmentId === dept.id}
                            onChange={() => handleDepartmentSelect(dept.id)}
                            aria-label={`Select ${dept.name} department`}
                            className="h-5 w-5 rounded border-light-secondary text-light-text dark:text-dark-text focus:ring-primary"
                          />
                        </div>

                        <AnimatePresence>
                          {expandedDepts.includes(dept.id) && (
                            <motion.div
                              initial={{
                                opacity: 0,
                                height: 0,
                              }}
                              animate={{
                                opacity: 1,
                                height: "auto",
                              }}
                              exit={{
                                opacity: 0,
                                height: 0,
                              }}
                              transition={{
                                duration: 0.2,
                              }}
                              className="border-t border-light-secondary dark:border-dark-secondary bg-light-muted-background dark:bg-dark-muted-background overflow-hidden rounded-b-xl"
                            >
                              <div className="p-4 space-y-4">
                                {dept.semesters
                                  .filter((sem) => sem.divisions.length > 0)
                                  .map((sem) => (
                                    <div
                                      key={sem.id}
                                      className="border-l-2 border-primary pl-4"
                                    >
                                      <div
                                        className="flex items-center justify-between p-3 hover:bg-light-background dark:hover:bg-dark-background rounded-lg cursor-pointer"
                                        onClick={() =>
                                          handleSemesterSelect(
                                            sem.id,
                                            sem.divisions,
                                          )
                                        }
                                      >
                                        <div className="flex items-center gap-3">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleSemester(sem.id);
                                            }}
                                            className="p-1.5 rounded-full hover:bg-light-muted-background dark:hover:bg-dark-muted-background"
                                            aria-label={
                                              expandedSems.includes(sem.id)
                                                ? `Collapse semester ${sem.semesterNumber}`
                                                : `Expand semester ${sem.semesterNumber}`
                                            }
                                          >
                                            {expandedSems.includes(sem.id) ? (
                                              <ChevronDownIcon className="h-5 w-5 text-light-text dark:text-dark-text" />
                                            ) : (
                                              <ChevronRightIcon className="h-5 w-5 text-light-text dark:text-dark-text" />
                                            )}
                                          </button>
                                          <span
                                            className="font-medium text-light-text dark:text-dark-text"
                                            // Open close semester details on click
                                            onClick={() =>
                                              toggleSemester(sem.id)
                                            }
                                          >
                                            Semester {sem.semesterNumber}
                                            <span className="text-sm text-light-muted-text dark:text-dark-muted-text ml-2">
                                              ({sem.academicYear.yearString})
                                            </span>
                                          </span>
                                        </div>
                                        <input
                                          type="checkbox"
                                          checked={
                                            selection.semesterSelections[sem.id]
                                              ?.selected || false
                                          }
                                          onChange={() =>
                                            handleSemesterSelect(
                                              sem.id,
                                              sem.divisions,
                                            )
                                          }
                                          aria-label={`Select semester ${sem.semesterNumber}`}
                                          className="h-5 w-5 rounded border-light-secondary text-light-text dark:text-dark-text focus:ring-primary"
                                        />
                                      </div>
                                      <AnimatePresence>
                                        {expandedSems.includes(sem.id) && (
                                          <motion.div
                                            initial={{
                                              opacity: 0,
                                              height: 0,
                                            }}
                                            animate={{
                                              opacity: 1,
                                              height: "auto",
                                            }}
                                            exit={{
                                              opacity: 0,
                                              height: 0,
                                            }}
                                            transition={{
                                              duration: 0.2,
                                            }}
                                            className="overflow-hidden"
                                          >
                                            {renderSemesterContent(sem, sem.id)}
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-light-muted-text dark:text-dark-muted-text py-8">
                      No academic structure available for the selected year.
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showSelectionPreview && (
          <PreviewModal
            isOpen={showSelectionPreview}
            onClose={() => setShowSelectionPreview(false)}
            selection={selection}
            academicStructure={academicStructure}
            onGenerate={handleGenerateForms}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
