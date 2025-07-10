/**
 * @file src/hooks/useDatabase.ts
 * @description React Query hook for cleaning the database (destructive operation).
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import databaseService from "@/services/databaseService";
import { showToast } from "@/lib/toast";

// Clean the entire database (destructive!)
export const useCleanDatabase = () => {
    const queryClient = useQueryClient();
    return useMutation<string, Error, void>({
        mutationFn: databaseService.cleanDatabase,
        onSuccess: (message) => {
            queryClient.invalidateQueries({ queryKey: [""] }); // Invalidate all queries
            showToast.success(message);
        },
        onError: (error) => {
            showToast.error(`Failed to clean database: ${error.message}`);
        },
    });
};
