// src/components/analytics/TrendLineChart.tsx

import React from "react";
import { BaseChart } from "./BaseChart";
import {
    getBaseChartConfig,
    getAxisConfig,
    formatRatingTooltip,
} from "./chartConfigs";

// Actual backend trend data structure
interface ActualTrendData {
    semester: number;
    subject: string;
    averageRating: number;
    responseCount: number;
}

interface TrendLineChartProps {
    data: ActualTrendData[];
    isLoading?: boolean;
    error?: string | null;
    isDark?: boolean;
    title?: string;
    subtitle?: string;
    height?: number;
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({
    data,
    isLoading = false,
    error = null,
    isDark = false,
    title = "Rating Trends Over Time",
    subtitle = "Track performance changes across semesters",
    height = 300,
}) => {
    const baseConfig = getBaseChartConfig(isDark);
    const axisConfig = getAxisConfig(isDark);

    const options = {
        ...baseConfig,
        chart: {
            ...baseConfig.chart,
            type: "line",
            height,
            zoom: { enabled: false },
        },
        stroke: {
            curve: "smooth" as const,
            width: 3,
        },
        colors: ["#f97316"], // primary color
        xaxis: {
            ...axisConfig,
            categories: data.map((trend) => {
                // Show just the subject abbreviation without semester extension
                return trend.subject;
            }),
            labels: {
                ...axisConfig.labels,
                rotate: -45,
                maxHeight: 120,
            },
        },
        yaxis: {
            ...axisConfig,
            min: 0,
            max: 10,
            tickAmount: 5,
            title: {
                text: "Rating (0-10)",
                style: {
                    color: isDark ? "#98989F" : "#6B7280",
                    fontSize: "12px",
                    fontFamily: "Inter, ui-sans-serif, system-ui",
                },
            },
        },
        markers: {
            size: 6,
            colors: ["#f97316"],
            strokeColors: isDark ? "#1B1B1F" : "#ffffff",
            strokeWidth: 2,
            hover: {
                size: 8,
                sizeOffset: 2,
            },
        },
        tooltip: {
            ...baseConfig.tooltip,
            y: {
                formatter: formatRatingTooltip,
            },
        },
    };

    const series = [
        {
            name: "Average Rating",
            data: data.map((trend) => {
                // Handle potential undefined/null values
                const rating = trend.averageRating ?? 0;
                return Math.max(0, Math.min(10, rating));
            }),
        },
    ];

    return (
        <BaseChart
            title={title}
            subtitle={subtitle}
            options={options}
            series={series}
            type="line"
            height={height}
            isLoading={isLoading}
            error={error}
            noDataMessage="No trend data available"
        />
    );
};

export default TrendLineChart;
