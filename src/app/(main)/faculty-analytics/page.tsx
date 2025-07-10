// "use client";

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//     ChartBarIcon,
//     AcademicCapIcon,
//     UserIcon,
//     CalendarIcon,
//     BookOpenIcon,
//     TrophyIcon,
//     ArrowPathIcon,
//     MagnifyingGlassIcon,
// } from "@heroicons/react/24/outline";
// import { showToast } from "@/lib/toast";

// // Import components
// import { Button } from "@/components/ui/Button";
// import { Card } from "@/components/ui/Card";
// import { StatCard } from "@/components/ui/StatCard";
// import { Loader } from "@/components/common/Loader";

// // Import hooks
// // import {
// //     useAllFacultyPerformanceData,
// //     useFacultyPerformanceYearData,
// // } from "@/hooks/useAnalytics";
// import { useAllAcademicYears } from "@/hooks/useAcademicYears";

// const FacultyAnalytics = () => {
//     const [selectedAcademicYear, setSelectedAcademicYear] =
//         useState<string>("");
//     const [selectedFacultyId, setSelectedFacultyId] = useState<string>("");
//     const [searchTerm, setSearchTerm] = useState<string>("");
//     const [activeTab, setActiveTab] = useState<"overview" | "individual">(
//         "overview"
//     );

//     // Fetch academic years
//     const {
//         data: academicYears,
//         isLoading: academicYearsLoading,
//         error: academicYearsError,
//     } = useAllAcademicYears();

//     // Fetch all faculty performance data
//     const {
//         data: allFacultyData,
//         isLoading: allFacultyLoading,
//         error: allFacultyError,
//         refetch: refetchAllFaculty,
//     } = useAllFacultyPerformanceData({
//         academicYearId: selectedAcademicYear,
//         enabled: !!selectedAcademicYear,
//     });

//     // Fetch individual faculty performance data
//     const {
//         data: individualFacultyData,
//         isLoading: individualFacultyLoading,
//         refetch: refetchIndividualFaculty,
//     } = useFacultyPerformanceYearData({
//         facultyId: selectedFacultyId,
//         academicYearId: selectedAcademicYear,
//         enabled: !!selectedFacultyId && !!selectedAcademicYear,
//     });

//     // Set default academic year when academic years are loaded
//     useEffect(() => {
//         if (
//             academicYears &&
//             academicYears.length > 0 &&
//             !selectedAcademicYear
//         ) {
//             // Get the most recent academic year
//             const sortedYears = [...academicYears].sort(
//                 (a, b) =>
//                     new Date(b.endDate).getTime() -
//                     new Date(a.endDate).getTime()
//             );
//             setSelectedAcademicYear(sortedYears[0].id.toString());
//         }
//     }, [academicYears, selectedAcademicYear]);

//     const handleRefreshAll = async () => {
//         showToast.promise(
//             Promise.all(
//                 [
//                     selectedAcademicYear && refetchAllFaculty(),
//                     selectedFacultyId &&
//                         selectedAcademicYear &&
//                         refetchIndividualFaculty(),
//                 ].filter(Boolean)
//             ),
//             {
//                 loading: "Refreshing faculty analytics data...",
//                 success: "Faculty analytics data refreshed successfully!",
//                 error: "Failed to refresh faculty analytics data",
//             }
//         );
//     };

//     const formatRating = (rating: number | null) => {
//         if (rating === null || rating === undefined) return "N/A";
//         return rating.toFixed(2);
//     };

//     const getRatingColor = (rating: number | null) => {
//         if (!rating) return "text-gray-500";
//         if (rating >= 4.5) return "text-green-600";
//         if (rating >= 4.0) return "text-blue-600";
//         if (rating >= 3.5) return "text-yellow-600";
//         if (rating >= 3.0) return "text-orange-600";
//         return "text-red-600";
//     };

//     const getRatingBadge = (rating: number | null) => {
//         if (!rating)
//             return { label: "No Data", color: "bg-gray-100 text-gray-600" };
//         if (rating >= 4.5)
//             return { label: "Excellent", color: "bg-green-100 text-green-700" };
//         if (rating >= 4.0)
//             return { label: "Good", color: "bg-blue-100 text-blue-700" };
//         if (rating >= 3.5)
//             return { label: "Average", color: "bg-yellow-100 text-yellow-700" };
//         if (rating >= 3.0)
//             return {
//                 label: "Below Average",
//                 color: "bg-orange-100 text-orange-700",
//             };
//         return { label: "Poor", color: "bg-red-100 text-red-700" };
//     };

//     // Filter faculty data based on search term
//     const filteredFacultyData =
//         allFacultyData?.filter(
//             (faculty) =>
//                 faculty.facultyName
//                     .toLowerCase()
//                     .includes(searchTerm.toLowerCase()) ||
//                 faculty.departmentName
//                     .toLowerCase()
//                     .includes(searchTerm.toLowerCase())
//         ) || [];

//     if (academicYearsLoading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-light-muted-background dark:bg-dark-background">
//                 <div className="text-center">
//                     <Loader />
//                     <p className="text-light-text dark:text-dark-text ml-2 mt-2">
//                         Loading faculty analytics data...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     if (academicYearsError) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-light-muted-background dark:bg-dark-background">
//                 <div className="text-center">
//                     <p className="text-red-600 mb-4">
//                         Failed to load academic years
//                     </p>
//                     <Button onClick={() => window.location.reload()}>
//                         <ArrowPathIcon className="h-4 w-4 mr-2" />
//                         Retry
//                     </Button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-light-muted-background dark:bg-dark-background">
//             <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="space-y-8"
//                 >
//                     {/* Header */}
//                     <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//                         <div>
//                             <h1 className="text-3xl font-semibold text-light-text dark:text-dark-text">
//                                 Faculty Analytics
//                             </h1>
//                             <p className="text-light-muted-text dark:text-dark-muted-text mt-1">
//                                 Performance analytics and insights for faculty
//                                 members
//                             </p>
//                         </div>

//                         <div className="flex items-center gap-3">
//                             <Button
//                                 variant="outline"
//                                 onClick={handleRefreshAll}
//                                 className="flex items-center gap-2"
//                             >
//                                 <ArrowPathIcon className="h-4 w-4" />
//                                 Refresh Data
//                             </Button>
//                         </div>
//                     </div>

//                     {/* Academic Year Selection */}
//                     <Card className="p-6">
//                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                             <div>
//                                 <h2 className="text-lg font-medium text-light-text dark:text-dark-text">
//                                     Select Academic Year
//                                 </h2>
//                                 <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
//                                     Choose an academic year to view faculty
//                                     analytics
//                                 </p>
//                             </div>

//                             <select
//                                 value={selectedAcademicYear}
//                                 onChange={(e) =>
//                                     setSelectedAcademicYear(e.target.value)
//                                 }
//                                 aria-label="Select academic year for faculty analytics"
//                                 className="w-full sm:w-64 px-3 py-2 border border-light-secondary dark:border-dark-secondary rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent"
//                             >
//                                 <option value="">
//                                     Select an academic year
//                                 </option>
//                                 {academicYears?.map((year) => (
//                                     <option
//                                         key={year.id}
//                                         value={year.id.toString()}
//                                     >
//                                         {year.yearString}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </Card>

//                     {/* Tab Navigation */}
//                     <div className="flex space-x-1 bg-light-background dark:bg-dark-background p-1 rounded-lg border border-light-secondary dark:border-dark-secondary">
//                         {[
//                             {
//                                 id: "overview",
//                                 label: "Faculty Overview",
//                                 icon: ChartBarIcon,
//                             },
//                             {
//                                 id: "individual",
//                                 label: "Individual Analysis",
//                                 icon: UserIcon,
//                             },
//                         ].map((tab) => (
//                             <button
//                                 key={tab.id}
//                                 onClick={() => setActiveTab(tab.id as any)}
//                                 className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//                                     activeTab === tab.id
//                                         ? "bg-primary text-white"
//                                         : "text-light-muted-text dark:text-dark-muted-text hover:text-light-text dark:hover:text-dark-text"
//                                 }`}
//                             >
//                                 <tab.icon className="h-4 w-4" />
//                                 {tab.label}
//                             </button>
//                         ))}
//                     </div>

//                     {/* Tab Content */}
//                     <AnimatePresence mode="wait">
//                         {activeTab === "overview" && (
//                             <motion.div
//                                 key="overview"
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -20 }}
//                                 className="space-y-6"
//                             >
//                                 {!selectedAcademicYear ? (
//                                     <Card className="p-8">
//                                         <div className="text-center">
//                                             <CalendarIcon className="h-12 w-12 text-light-muted-text dark:text-dark-muted-text mx-auto mb-4" />
//                                             <p className="text-light-muted-text dark:text-dark-muted-text text-lg">
//                                                 Please select an academic year
//                                                 to view faculty analytics
//                                             </p>
//                                         </div>
//                                     </Card>
//                                 ) : (
//                                     <>
//                                         {/* Search Bar */}
//                                         <Card className="p-4">
//                                             <div className="relative">
//                                                 <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-light-muted-text dark:text-dark-muted-text" />
//                                                 <input
//                                                     type="text"
//                                                     placeholder="Search faculty by name or department..."
//                                                     value={searchTerm}
//                                                     onChange={(e) =>
//                                                         setSearchTerm(
//                                                             e.target.value
//                                                         )
//                                                     }
//                                                     className="w-full pl-10 pr-4 py-2 border border-light-secondary dark:border-dark-secondary rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent"
//                                                 />
//                                             </div>
//                                         </Card>

//                                         {/* Faculty Overview Stats */}
//                                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                             <StatCard
//                                                 title="Total Faculty"
//                                                 value={
//                                                     allFacultyData?.length || 0
//                                                 }
//                                                 icon={AcademicCapIcon}
//                                                 isLoading={allFacultyLoading}
//                                             />

//                                             <StatCard
//                                                 title="Average Rating"
//                                                 value={
//                                                     allFacultyData?.length
//                                                         ? (
//                                                               allFacultyData.reduce(
//                                                                   (sum, f) =>
//                                                                       sum +
//                                                                       f.overallAverageRating,
//                                                                   0
//                                                               ) /
//                                                               allFacultyData.length
//                                                           ).toFixed(2)
//                                                         : "N/A"
//                                                 }
//                                                 icon={TrophyIcon}
//                                                 isLoading={allFacultyLoading}
//                                             />

//                                             <StatCard
//                                                 title="Total Responses"
//                                                 value={
//                                                     allFacultyData?.reduce(
//                                                         (sum, f) =>
//                                                             sum +
//                                                             f.totalResponses,
//                                                         0
//                                                     ) || 0
//                                                 }
//                                                 icon={BookOpenIcon}
//                                                 isLoading={allFacultyLoading}
//                                             />
//                                         </div>

//                                         {/* Faculty List */}
//                                         <Card className="p-6">
//                                             <div className="flex items-center justify-between mb-6">
//                                                 <h3 className="text-lg font-medium text-light-text dark:text-dark-text">
//                                                     Faculty Performance
//                                                 </h3>
//                                                 {searchTerm && (
//                                                     <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
//                                                         Showing{" "}
//                                                         {
//                                                             filteredFacultyData.length
//                                                         }{" "}
//                                                         of{" "}
//                                                         {allFacultyData?.length ||
//                                                             0}{" "}
//                                                         faculty
//                                                     </p>
//                                                 )}
//                                             </div>

//                                             {allFacultyLoading ? (
//                                                 <div className="flex justify-center py-8">
//                                                     <Loader />
//                                                 </div>
//                                             ) : allFacultyError ? (
//                                                 <p className="text-center text-red-600 py-8">
//                                                     Failed to load faculty data
//                                                 </p>
//                                             ) : filteredFacultyData.length >
//                                               0 ? (
//                                                 <div className="space-y-4">
//                                                     {filteredFacultyData.map(
//                                                         (faculty) => (
//                                                             <div
//                                                                 key={
//                                                                     faculty.facultyId
//                                                                 }
//                                                                 className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 bg-light-background dark:bg-dark-background rounded-lg border border-light-secondary dark:border-dark-secondary hover:shadow-md transition-shadow"
//                                                             >
//                                                                 <div className="flex-1">
//                                                                     <h4 className="font-medium text-light-text dark:text-dark-text">
//                                                                         {
//                                                                             faculty.facultyName
//                                                                         }
//                                                                     </h4>
//                                                                     <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
//                                                                         Department:{" "}
//                                                                         {
//                                                                             faculty.departmentName
//                                                                         }
//                                                                     </p>
//                                                                     <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
//                                                                         {
//                                                                             faculty.totalResponses
//                                                                         }{" "}
//                                                                         responses
//                                                                     </p>
//                                                                 </div>

//                                                                 <div className="flex items-center gap-4">
//                                                                     <div className="text-center">
//                                                                         <p
//                                                                             className={`text-lg font-semibold ${getRatingColor(
//                                                                                 faculty.overallAverageRating
//                                                                             )}`}
//                                                                         >
//                                                                             {formatRating(
//                                                                                 faculty.overallAverageRating
//                                                                             )}
//                                                                         </p>
//                                                                         <span
//                                                                             className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
//                                                                                 getRatingBadge(
//                                                                                     faculty.overallAverageRating
//                                                                                 )
//                                                                                     .color
//                                                                             }`}
//                                                                         >
//                                                                             {
//                                                                                 getRatingBadge(
//                                                                                     faculty.overallAverageRating
//                                                                                 )
//                                                                                     .label
//                                                                             }
//                                                                         </span>
//                                                                     </div>

//                                                                     <Button
//                                                                         variant="outline"
//                                                                         size="sm"
//                                                                         onClick={() => {
//                                                                             setSelectedFacultyId(
//                                                                                 faculty.facultyId.toString()
//                                                                             );
//                                                                             setActiveTab(
//                                                                                 "individual"
//                                                                             );
//                                                                         }}
//                                                                     >
//                                                                         View
//                                                                         Details
//                                                                     </Button>
//                                                                 </div>
//                                                             </div>
//                                                         )
//                                                     )}
//                                                 </div>
//                                             ) : (
//                                                 <p className="text-center text-light-muted-text dark:text-dark-muted-text py-8">
//                                                     {searchTerm
//                                                         ? "No faculty found matching your search"
//                                                         : "No faculty data available for this academic year"}
//                                                 </p>
//                                             )}
//                                         </Card>
//                                     </>
//                                 )}
//                             </motion.div>
//                         )}

//                         {activeTab === "individual" && (
//                             <motion.div
//                                 key="individual"
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -20 }}
//                                 className="space-y-6"
//                             >
//                                 {/* Faculty Selection */}
//                                 <Card className="p-6">
//                                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                                         <div>
//                                             <h3 className="text-lg font-medium text-light-text dark:text-dark-text">
//                                                 Select Faculty Member
//                                             </h3>
//                                             <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
//                                                 Choose a faculty member to view
//                                                 detailed analytics
//                                             </p>
//                                         </div>

//                                         <select
//                                             value={selectedFacultyId}
//                                             onChange={(e) =>
//                                                 setSelectedFacultyId(
//                                                     e.target.value
//                                                 )
//                                             }
//                                             aria-label="Select faculty member for detailed analytics"
//                                             className="w-full sm:w-64 px-3 py-2 border border-light-secondary dark:border-dark-secondary rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent"
//                                         >
//                                             <option value="">
//                                                 Select a faculty member
//                                             </option>
//                                             {allFacultyData?.map((faculty) => (
//                                                 <option
//                                                     key={faculty.facultyId}
//                                                     value={faculty.facultyId.toString()}
//                                                 >
//                                                     {faculty.facultyName} -{" "}
//                                                     {faculty.departmentName}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 </Card>

//                                 {/* Individual Faculty Details */}
//                                 {!selectedFacultyId || !selectedAcademicYear ? (
//                                     <Card className="p-8">
//                                         <div className="text-center">
//                                             <UserIcon className="h-12 w-12 text-light-muted-text dark:text-dark-muted-text mx-auto mb-4" />
//                                             <p className="text-light-muted-text dark:text-dark-muted-text text-lg">
//                                                 Please select both an academic
//                                                 year and faculty member to view
//                                                 detailed analytics
//                                             </p>
//                                         </div>
//                                     </Card>
//                                 ) : individualFacultyLoading ? (
//                                     <div className="flex justify-center py-8">
//                                         <Loader />
//                                     </div>
//                                 ) : individualFacultyData ? (
//                                     <div className="space-y-6">
//                                         {/* Faculty Overview */}
//                                         <Card className="p-6">
//                                             <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-4">
//                                                 {
//                                                     individualFacultyData.facultyName
//                                                 }{" "}
//                                                 - Performance Overview
//                                             </h3>
//                                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                                 <div className="text-center p-4 bg-light-background dark:bg-dark-background rounded-lg">
//                                                     <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
//                                                         Overall Rating
//                                                     </p>
//                                                     <p
//                                                         className={`text-xl font-semibold ${getRatingColor(
//                                                             individualFacultyData.overallAverageRating
//                                                         )}`}
//                                                     >
//                                                         {formatRating(
//                                                             individualFacultyData.overallAverageRating
//                                                         )}
//                                                     </p>
//                                                 </div>
//                                                 <div className="text-center p-4 bg-light-background dark:bg-dark-background rounded-lg">
//                                                     <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
//                                                         Total Responses
//                                                     </p>
//                                                     <p className="text-xl font-semibold text-light-text dark:text-dark-text">
//                                                         {individualFacultyData.totalResponses.toLocaleString()}
//                                                     </p>
//                                                 </div>
//                                                 <div className="text-center p-4 bg-light-background dark:bg-dark-background rounded-lg">
//                                                     <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
//                                                         Academic Year
//                                                     </p>
//                                                     <p className="text-xl font-semibold text-light-text dark:text-dark-text">
//                                                         {
//                                                             individualFacultyData.academicYearName
//                                                         }
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </Card>

//                                         {/* Semester Performance */}
//                                         <Card className="p-6">
//                                             <h4 className="text-lg font-medium text-light-text dark:text-dark-text mb-4">
//                                                 Semester-wise Performance
//                                             </h4>
//                                             {individualFacultyData
//                                                 .semesterPerformance.length >
//                                             0 ? (
//                                                 <div className="space-y-3">
//                                                     {individualFacultyData.semesterPerformance.map(
//                                                         (semester) => (
//                                                             <div
//                                                                 key={
//                                                                     semester.semesterId
//                                                                 }
//                                                                 className="flex items-center justify-between p-4 bg-light-background dark:bg-dark-background rounded-lg"
//                                                             >
//                                                                 <div>
//                                                                     <h5 className="font-medium text-light-text dark:text-dark-text">
//                                                                         {
//                                                                             semester.semesterName
//                                                                         }
//                                                                     </h5>
//                                                                     <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
//                                                                         {
//                                                                             semester.totalResponses
//                                                                         }{" "}
//                                                                         responses
//                                                                     </p>
//                                                                 </div>
//                                                                 <div className="text-right">
//                                                                     <p
//                                                                         className={`text-lg font-semibold ${getRatingColor(
//                                                                             semester.averageRating
//                                                                         )}`}
//                                                                     >
//                                                                         {formatRating(
//                                                                             semester.averageRating
//                                                                         )}
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//                                                         )
//                                                     )}
//                                                 </div>
//                                             ) : (
//                                                 <p className="text-center text-light-muted-text dark:text-dark-muted-text py-4">
//                                                     No semester performance data
//                                                     available
//                                                 </p>
//                                             )}
//                                         </Card>

//                                         {/* Subject Performance */}
//                                         <Card className="p-6">
//                                             <h4 className="text-lg font-medium text-light-text dark:text-dark-text mb-4">
//                                                 Subject-wise Performance
//                                             </h4>
//                                             {individualFacultyData
//                                                 .subjectPerformance.length >
//                                             0 ? (
//                                                 <div className="space-y-3">
//                                                     {individualFacultyData.subjectPerformance.map(
//                                                         (subject) => (
//                                                             <div
//                                                                 key={
//                                                                     subject.subjectId
//                                                                 }
//                                                                 className="flex items-center justify-between p-4 bg-light-background dark:bg-dark-background rounded-lg"
//                                                             >
//                                                                 <div>
//                                                                     <h5 className="font-medium text-light-text dark:text-dark-text">
//                                                                         {
//                                                                             subject.subjectName
//                                                                         }
//                                                                     </h5>
//                                                                     <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
//                                                                         {
//                                                                             subject.totalResponses
//                                                                         }{" "}
//                                                                         responses
//                                                                     </p>
//                                                                 </div>
//                                                                 <div className="text-right">
//                                                                     <p
//                                                                         className={`text-lg font-semibold ${getRatingColor(
//                                                                             subject.averageRating
//                                                                         )}`}
//                                                                     >
//                                                                         {formatRating(
//                                                                             subject.averageRating
//                                                                         )}
//                                                                     </p>
//                                                                     <span
//                                                                         className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
//                                                                             getRatingBadge(
//                                                                                 subject.averageRating
//                                                                             )
//                                                                                 .color
//                                                                         }`}
//                                                                     >
//                                                                         {
//                                                                             getRatingBadge(
//                                                                                 subject.averageRating
//                                                                             )
//                                                                                 .label
//                                                                         }
//                                                                     </span>
//                                                                 </div>
//                                                             </div>
//                                                         )
//                                                     )}
//                                                 </div>
//                                             ) : (
//                                                 <p className="text-center text-light-muted-text dark:text-dark-muted-text py-4">
//                                                     No subject performance data
//                                                     available
//                                                 </p>
//                                             )}
//                                         </Card>
//                                     </div>
//                                 ) : (
//                                     <Card className="p-8">
//                                         <p className="text-center text-light-muted-text dark:text-dark-muted-text">
//                                             No detailed data available for the
//                                             selected faculty member
//                                         </p>
//                                     </Card>
//                                 )}
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                 </motion.div>
//             </div>
//         </div>
//     );
// };

// export default FacultyAnalytics;
