// src/components/modals/DeleteFacultyModal.tsx
"use client";

import React from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/common/Loader";

interface DeleteFacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
  name?: string; // Optional name for the faculty member being deleted
}

export function DeleteFacultyModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  name = "Faculty Member",
}: DeleteFacultyModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  // Log the name of the faculty member being deleted
  console.log(`Deleting faculty member: ${name}`);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Confirm Deletion"
      description={
        <span>
          Are you sure you want to delete{" "}
          <span className="font-bold">{name}</span>? This action cannot be
          undone.
        </span>
      }
    >
      <div className="p-4 pt-4">
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader className="w-4 h-4 mr-2 border-white" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
