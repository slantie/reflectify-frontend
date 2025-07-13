/**
@file src/hooks/faculty/useFacultyModals.ts
@description Modal state and handlers for faculty add/edit/delete dialogs
*/

import { useState, useCallback } from "react";
import { Faculty } from "@/interfaces/faculty";
import { IdType } from "@/interfaces/common";

interface UseFacultyModalsResult {
  isAddModalOpen: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;
  isEditModalOpen: boolean;
  openEditModal: (faculty: Faculty) => void;
  closeEditModal: () => void;
  isDeleteModalOpen: boolean;
  openDeleteModal: (faculty: Faculty) => void;
  closeDeleteModal: () => void;
  selectedFaculty: Faculty | null;
  facultyToDeleteId: IdType | null;
}

export const useFacultyModals = (): UseFacultyModalsResult => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [facultyToDeleteId, setFacultyToDeleteId] = useState<IdType | null>(
    null,
  );

  const openAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const closeAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const openEditModal = useCallback((faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setIsEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedFaculty(null); // Clear selected faculty on close
  }, []);

  const openDeleteModal = useCallback((faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setFacultyToDeleteId(faculty.id);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setFacultyToDeleteId(null);
    setSelectedFaculty(null);
  }, []);

  return {
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
  };
};
