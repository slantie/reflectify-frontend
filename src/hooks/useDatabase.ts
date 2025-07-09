// src/hooks/useDatabase.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import databaseService from "@/services/databaseService"; // Adjust path
import { showToast } from "@/lib/toast"; // Example if you want specific toast feedback here

// --- Mutation Hook: Clean Database ---
export const useCleanDatabase = () => {
    const queryClient = useQueryClient();
    return useMutation<string, Error, void>({
        // No variables passed for cleaning
        mutationFn: databaseService.cleanDatabase,
        onSuccess: (message) => {
            console.log("Database cleaned successfully:", message);
            // Optionally, you might invalidate ALL queries if the entire database state has changed
            // This is a powerful and potentially dangerous operation, use with caution.
            queryClient.invalidateQueries({ queryKey: [""] }); // Invalidate all queries
            showToast.success(message); // Example toast
        },
        onError: (error) => {
            console.error("Failed to clean database:", error);
            // showToast.error(`Failed to clean database: ${error.message}`); // Example toast
        },
        // No optimistic update for destructive operations like this typically
    });
};
