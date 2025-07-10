/**
 * @file src/components/dashboard/DashboardAnalyticsCards.tsx
 * @description Provides navigation cards for general and faculty-specific analytics.
 */

import {
    ChartBarIcon,
    ChartPieIcon,
    PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DashboardAnalyticsCardsProps {
    router: AppRouterInstance;
}

export function DashboardAnalyticsCards({
    router,
}: DashboardAnalyticsCardsProps) {
    return (
        <div className="bg-light-background dark:bg-dark-muted-background p-5 rounded-xl shadow-sm border border-light-secondary dark:border-dark-secondary">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-light-text dark:text-dark-text flex items-center gap-2">
                    Analytics & Insights
                    <ChartPieIcon className="h-5 w-5 text-light-highlight dark:text-dark-highlight" />
                </h2>
                <p className="text-sm text-light-muted-text dark:text-dark-muted-text mt-1">
                    Access comprehensive feedback analytics and performance
                    insights
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                    onClick={() => router.push("/analytics")}
                    className="relative overflow-hidden cursor-pointer bg-light-background dark:bg-dark-muted-background hover:bg-light-muted-background dark:hover:bg-dark-noisy-background border border-light-secondary dark:border-dark-secondary hover:border-primary-main hover:shadow-lg transition-all duration-300 rounded-xl group p-6"
                >
                    <div className="absolute top-0 left-0 w-2 h-full bg-light-highlight dark:bg-dark-highlight transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text group-hover:text-light-highlight transition-colors">
                                General Analytics
                            </h3>
                            <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                Semester trends, subject analysis, and overall
                                insights
                            </p>
                            <div className="text-xs text-light-highlight dark:text-dark-highlight font-medium">
                                View Dashboard →
                            </div>
                        </div>
                        <ChartBarIcon className="h-12 w-12 text-light-highlight dark:text-dark-highlight transition-all duration-300 group-hover:scale-110" />
                    </div>
                </div>

                <div
                    onClick={() => router.push("/faculty-analytics")}
                    className="relative overflow-hidden cursor-pointer bg-light-background dark:bg-dark-muted-background hover:bg-light-muted-background dark:hover:bg-dark-noisy-background border border-light-secondary dark:border-dark-secondary hover:border-primary-main hover:shadow-lg transition-all duration-300 rounded-xl group p-6"
                >
                    <div className="absolute top-0 left-0 w-2 h-full bg-light-highlight dark:bg-dark-highlight transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text group-hover:text-light-highlight transition-colors">
                                Faculty Analytics
                            </h3>
                            <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                Individual faculty performance and comparisons
                            </p>
                            <div className="text-xs text-light-highlight dark:text-dark-highlight font-medium">
                                View Performance →
                            </div>
                        </div>
                        <PresentationChartLineIcon className="h-12 w-12 text-light-highlight dark:text-dark-highlight transition-all duration-300 group-hover:scale-110" />
                    </div>
                </div>
            </div>
        </div>
    );
}
