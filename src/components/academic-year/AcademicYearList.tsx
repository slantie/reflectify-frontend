/**
 * @file src/components/academic-year/AcademicYearList.tsx
 * @description List component for displaying academic years
 */

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AcademicYear } from "@/interfaces/academicYear";
import { Edit2, Trash2, Clock, Calendar } from "lucide-react";

interface AcademicYearListProps {
  academicYears: AcademicYear[];
  onEdit: (academicYear: AcademicYear) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const AcademicYearList: React.FC<AcademicYearListProps> = ({
  academicYears,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  // No need to determine status based on dates anymore, we only care about isActive
  const getAcademicYearStatus = (academicYear: AcademicYear) => {
    return academicYear.isActive ? "active" : "inactive";
  };

  // Get active badge
  const getActiveBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge className="ml-2 bg-primary-lighter text-light-highlight dark:text-dark-highlight dark:bg-primary-darker dark:text-primary-lighter">
          Active
        </Badge>
      );
    }
    return null;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Active
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
            Inactive
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-light-background dark:bg-dark-muted-background border border-light-secondary dark:border-dark-secondary rounded-2xl shadow-sm">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-main border-t-transparent"></div>
            <span className="ml-2 text-light-muted-text dark:text-dark-muted-text">
              Loading academic years...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (academicYears.length === 0) {
    return (
      <Card className="bg-light-background dark:bg-dark-muted-background border border-light-secondary dark:border-dark-secondary rounded-2xl shadow-sm">
        <CardContent className="p-8">
          <div className="text-center">
            <Calendar className="h-12 w-12 mx-auto text-light-muted-text dark:text-dark-muted-text opacity-50 mb-4" />
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
              No Academic Years Found
            </h3>
            <p className="text-light-muted-text dark:text-dark-muted-text">
              Create your first academic year to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-light-background dark:bg-dark-muted-background border border-light-secondary dark:border-dark-secondary rounded-2xl shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-light-text dark:text-dark-text">
          <div className="p-2 rounded-xl bg-primary-lighter dark:bg-primary-darker">
            <Calendar className="h-5 w-5 text-light-highlight dark:text-dark-highlight" />
          </div>
          Academic Years ({academicYears.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {academicYears.map((academicYear) => {
            const status = getAcademicYearStatus(academicYear);

            return (
              <div
                key={academicYear.id}
                className="p-4 border border-light-secondary dark:border-dark-secondary rounded-xl hover:bg-light-muted-background dark:hover:bg-dark-noisy-background transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-light-text dark:text-dark-text">
                        {academicYear.yearString}
                      </h4>
                      {getStatusBadge(status)}
                      {getActiveBadge(academicYear.isActive)}
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-light-muted-text dark:text-dark-muted-text">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Created:{" "}
                        {new Date(academicYear.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Updated:{" "}
                        {new Date(academicYear.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(academicYear)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(academicYear.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
