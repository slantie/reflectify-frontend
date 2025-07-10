/**
 * @file src/components/dashboard/DashboardHeader.tsx
 * @description Displays the main header section of the dashboard with an overview and key metrics.
 */

import { Badge } from "@/components/ui";
import {
    ArrowTrendingUpIcon,
    ChartBarIcon,
    CalendarIcon,
} from "@heroicons/react/24/outline";
import CountUp from "react-countup";
import { DashboardStats } from "@/interfaces/dashboard";

export function DashboardHeader({
    stats,
    currentDate,
}: {
    stats: DashboardStats | undefined;
    currentDate: string;
}) {
    return (
        <div className="bg-light-background dark:bg-dark-muted-background p-5 rounded-xl shadow-sm border border-light-secondary dark:border-dark-secondary">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-light-text dark:text-dark-text flex items-center gap-2">
                        Dashboard Overview
                        <ChartBarIcon className="h-6 w-6 text-light-highlight dark:text-dark-highlight" />
                    </h1>
                    <p className="text-sm md:text-base text-light-muted-text dark:text-dark-muted-text flex items-center gap-1 mt-1">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-positive-main" />
                        System metrics and quick actions
                    </p>
                    {stats?.activeAcademicYear && (
                        <p className="text-sm text-light-muted-text dark:text-dark-muted-text flex items-center gap-1 mt-1">
                            <CalendarIcon className="h-4 w-4 text-light-highlight dark:text-dark-highlight" />
                            Active Year:{" "}
                            <span className="font-medium text-light-highlight dark:text-dark-highlight">
                                {stats.activeAcademicYear.yearString}
                            </span>
                        </p>
                    )}
                </div>
                <div className="w-full sm:w-auto text-left sm:text-right">
                    <div className="flex justify-start sm:justify-end mb-2">
                        <Badge variant="default" size="lg" className="gap-2">
                            <ChartBarIcon className="h-5 w-5" />
                            <span>
                                <CountUp
                                    end={stats?.responseCount || 0}
                                    duration={2}
                                    separator=","
                                    enableScrollSpy={true}
                                    scrollSpyOnce={true}
                                />{" "}
                                Responses
                            </span>
                        </Badge>
                    </div>
                    <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                        Last updated
                    </p>
                    <p className="text-sm font-medium text-light-text dark:text-dark-text">
                        {currentDate}
                    </p>
                </div>
            </div>
        </div>
    );
}
