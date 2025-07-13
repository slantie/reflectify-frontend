// src/app/faculty/page.tsx
"use client";

import { useCallback } from "react";
import { showToast } from "@/lib/toast";
import { AddFacultyModal } from "@/components/modals/faculty/AddFacultyModal";
import { EditFacultyModal } from "@/components/modals/faculty/EditFacultyModal";
import { DeleteFacultyModal } from "@/components/modals/faculty/DeleteFacultyModal";
import { FacultyHeader } from "@/components/faculty/FacultyHeader";
import { FacultyFilters } from "@/components/faculty/FacultyFilters";
import { FacultyTable } from "@/components/faculty/FacultyTable";
import { StatCard } from "@/components/ui/StatCard";
import { CreateFacultyData, UpdateFacultyData } from "@/interfaces/faculty"; // Use the updated interfaces
import { exportFacultyToExcel } from "@/utils/excelExport"; // Import the Excel utility
import { useFacultyData } from "@/hooks/faculty/useFacultyData"; // Import the data hook
import { useFacultyModals } from "@/hooks/faculty/useFacultyModals"; // Import the modals hook
import {
    useCreateFaculty,
    useUpdateFaculty,
    useSoftDeleteFaculty,
} from "@/hooks/faculty/useFaculties"; // Import mutation hooks
import { UserGroupIcon, ChartBarIcon } from "@heroicons/react/24/outline"; // Icons for StatCards
import Loader from "@/components/common/Loader"; // Import Loader
import ErrorDisplay from "@/components/common/Error"; // Import ErrorDisplay
import { useRouter } from "next/navigation";

export default function FacultyManagement() {
    const router = useRouter();
    // Use the custom data hook
    const {
        faculty, // Renamed from allFaculty for consistency with original page.tsx
        departments,
        departmentStats,
        searchTerm,
        setSearchTerm,
        selectedDepartment,
        setSelectedDepartment,
        sortOrder,
        setSortOrder,
        filteredAndSortedFaculty,
        isLoading, // Renamed from loading
        isError, // Renamed from error
        error, // The error object
        // refetchFaculty, // Function to re-fetch all data
    } = useFacultyData();

    // Use the custom modals hook
    const {
        isAddModalOpen,
        openAddModal,
        closeAddModal,
        isEditModalOpen,
        openEditModal,
        closeEditModal,
        isDeleteModalOpen,
        openDeleteModal,
        closeDeleteModal,
        selectedFaculty,
        facultyToDeleteId,
    } = useFacultyModals();

    // Initialize mutation hooks
    const createFacultyMutation = useCreateFaculty();
    const updateFacultyMutation = useUpdateFaculty();
    const softDeleteFacultyMutation = useSoftDeleteFaculty();

    const handleCreateFaculty = useCallback(
        async (formData: CreateFacultyData) => {
            // Use CreateFacultyData
            try {
                await createFacultyMutation.mutateAsync(formData);
                showToast.success("Faculty created successfully");
                // refetchFaculty is called by mutation's onSuccess, but can be explicitly called if needed
                // refetchFaculty();
                closeAddModal();
            } catch (err: any) {
                showToast.error(err.message || "Failed to create faculty");
            }
        },
        [createFacultyMutation, closeAddModal]
    );

    const handleUpdateFaculty = useCallback(
        async (id: string, formData: UpdateFacultyData) => {
            // Use UpdateFacultyData
            try {
                await updateFacultyMutation.mutateAsync({ id, data: formData });
                showToast.success("Faculty updated successfully");
                // refetchFaculty is called by mutation's onSuccess, but can be explicitly called if needed
                // refetchFaculty();
                closeEditModal();
            } catch (err: any) {
                showToast.error(err.message || "Failed to update faculty");
            }
        },
        [updateFacultyMutation, closeEditModal]
    );

    const confirmDeleteFaculty = useCallback(async () => {
        if (facultyToDeleteId) {
            try {
                await softDeleteFacultyMutation.mutateAsync(facultyToDeleteId);
                showToast.success("Faculty deleted successfully");
                // refetchFaculty is called by mutation's onSuccess, but can be explicitly called if needed
                // refetchFaculty();
                closeDeleteModal();
            } catch (err: any) {
                // Catch the error to show specific message if needed
                showToast.error(err.message || "Failed to delete faculty");
                console.error("Delete failed:", err);
            }
        }
    }, [facultyToDeleteId, softDeleteFacultyMutation, closeDeleteModal]);

    const handleExport = useCallback(() => {
        exportFacultyToExcel(filteredAndSortedFaculty);
    }, [filteredAndSortedFaculty]);

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 max-w-[1920px] min-h-[48.05rem] mx-auto flex items-center justify-center text-lg text-secondary-darker">
                <Loader />
                <p className="ml-2">Loading faculty data...</p>
            </div>
        );
    }

    // Display error if data fetch failed and there's no data to show
    if (isError && faculty.length === 0) {
        return (
            <div className="p-4 md:p-8 max-w-[1920px] min-h-[48.05rem] mx-auto flex items-center justify-center text-lg text-red-500">
                <ErrorDisplay
                    message={error?.message || "Failed to load faculty data."}
                />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-[1920px] min-h-[48.05rem] mx-auto space-y-6 md:space-y-4 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            {/* Header Section */}
            <FacultyHeader onExport={handleExport} />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Total Faculty"
                    value={faculty.length}
                    icon={UserGroupIcon}
                    onClick={() => router.push("/faculty")} // Example navigation
                />
                {departmentStats.map((stat) => (
                    <StatCard
                        key={stat.departmentName}
                        title={stat.departmentName}
                        value={stat.count}
                        icon={ChartBarIcon}
                        onClick={() => router.push("/department")} // Example navigation
                    />
                ))}
            </div>

            {/* Search, Filters and Add Button */}
            <FacultyFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedDepartment={selectedDepartment}
                setSelectedDepartment={setSelectedDepartment}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                departments={departments}
                onAddFaculty={openAddModal}
            />

            {/* Faculty Table */}
            <FacultyTable
                faculty={filteredAndSortedFaculty}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
            />

            {/* Modals */}
            <AddFacultyModal
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                onAdd={handleCreateFaculty}
            />

            <EditFacultyModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onEdit={handleUpdateFaculty}
                faculty={selectedFaculty}
            />

            <DeleteFacultyModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDeleteFaculty}
                isDeleting={softDeleteFacultyMutation.isPending}
                name={selectedFaculty?.name || "Faculty Member"}
            />
        </div>
    );
}
