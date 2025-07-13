/**
 * @file src/components/academic-year/AcademicYearForm.tsx
 * @description Form component for creating/editing academic years
 */

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Calendar, X } from "lucide-react";
import { Switch } from "@/components/ui/Switch";
import { useConfirmDialog } from "@/components/modals/SimpleConfirmDialog";
import {
  AcademicYear,
  CreateAcademicYearData,
  UpdateAcademicYearData,
} from "@/interfaces/academicYear";

interface AcademicYearFormProps {
  academicYear?: AcademicYear;
  onSubmit: (data: CreateAcademicYearData | UpdateAcademicYearData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

export const AcademicYearForm: React.FC<AcademicYearFormProps> = ({
  academicYear,
  onSubmit,
  onCancel,
  isLoading = false,
  mode,
}) => {
  const [formData, setFormData] = useState({
    yearString: "",
    isActive: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (academicYear && mode === "edit") {
      setFormData({
        yearString: academicYear.yearString || "",
        isActive: academicYear.isActive || false,
      });
    }
  }, [academicYear, mode]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.yearString.trim()) {
      newErrors.yearString = "Year string is required";
    } else if (!/^\d{4}-\d{4}$/.test(formData.yearString.trim())) {
      newErrors.yearString =
        "Year string must be in format YYYY-YYYY (e.g., 2023-2024)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = {
      yearString: formData.yearString.trim(),
      isActive: formData.isActive,
    };

    onSubmit(submitData);
  };

  const { showConfirmDialog } = useConfirmDialog();

  // Modified handleInputChange to correctly handle boolean for isActive
  const handleInputChange = (
    field: keyof typeof formData,
    value: string | boolean, // Allow boolean for isActive
  ) => {
    if (field === "isActive") {
      const isActive = value as boolean; // Cast value directly to boolean

      // If trying to activate, show confirmation first
      if (isActive && !formData.isActive) {
        showConfirmDialog({
          message:
            "Setting this as the active academic year will deactivate any currently active year. Are you sure you want to continue?",
          onConfirm: () => {
            setFormData((prev) => ({ ...prev, [field]: isActive }));
          },
        });
      } else {
        setFormData((prev) => ({ ...prev, [field]: isActive }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value as string })); // Cast value to string for other fields
    }
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Card className="bg-light-background dark:bg-dark-muted-background border border-light-secondary dark:border-dark-secondary rounded-2xl shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-lighter dark:bg-primary-darker">
              <Calendar className="h-5 w-5 text-light-highlight dark:text-dark-highlight" />
            </div>
            <CardTitle className="text-light-text dark:text-dark-text">
              {mode === "create"
                ? "Create Academic Year"
                : "Edit Academic Year"}
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="yearString"
              className="text-light-text dark:text-dark-text"
            >
              Academic Year *
            </Label>
            <Input
              id="yearString"
              type="text"
              placeholder="e.g., 2023-2024"
              value={formData.yearString}
              onChange={(e) => handleInputChange("yearString", e.target.value)}
              className={errors.yearString ? "border-red-500" : ""}
            />
            {errors.yearString && (
              <p className="text-sm text-red-500">{errors.yearString}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                handleInputChange(
                  "isActive",
                  checked, // Pass the boolean directly
                )
              }
            />
            <Label
              htmlFor="isActive"
              className="text-light-text dark:text-dark-text"
            >
              Set as Active Academic Year
            </Label>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-light-highlight dark:bg-dark-highlight hover:bg-primary-dark text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  {mode === "create" ? "Creating..." : "Updating..."}
                </div>
              ) : mode === "create" ? (
                "Create Academic Year"
              ) : (
                "Update Academic Year"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
