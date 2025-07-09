// src/hooks/useDashboardStats.ts (No further changes needed here after service update)

import { useQuery, useMutation } from "@tanstack/react-query";
import dashboardService from "@/services/dashboardService";
import { DashboardStats } from "@/interfaces/dashboard";

export const DASHBOARD_STATS_QUERY_KEY = ["dashboardStats"];
export const DASHBOARD_DELETE_ALL_DATA_MUTATION_KEY = ["deleteAllData"];

export const useDashboardStats = () => {
    return useQuery<DashboardStats, Error>({
        queryKey: DASHBOARD_STATS_QUERY_KEY,
        queryFn: dashboardService.getDashboardStats,
    });
};

export const useDeleteAllData = () => {
    return useMutation({
        mutationKey: DASHBOARD_DELETE_ALL_DATA_MUTATION_KEY,
        mutationFn: dashboardService.deleteAllData,
    });
};
