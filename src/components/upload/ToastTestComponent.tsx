// Test component to verify Flask warnings and errors are properly displayed
// This can be used to debug the toast functionality

import React from "react";
import { handleFacultyMatrixUploadResponse } from "@/utils/facultyMatrixToasts";
import { FacultyMatrixUploadResult } from "@/interfaces/upload";

export const ToastTestComponent: React.FC = () => {
    // Mock data based on your actual backend response
    const mockResponseWithFlaskIssues: FacultyMatrixUploadResult = {
        status: "success",
        message:
            "Faculty matrix processing completed with Flask errors. Please review the issues.",
        rowsAffected: 425,
        totalRowsSkippedDueToMissingEntities: 0,
        missingFaculties: [],
        missingSubjects: [],
        skippedRowsDetails: [],
        flaskWarnings: [
            "Warning: No valid data extracted from sheet 'Sheet2'. It might be empty or malformed.",
            "Warning: No valid data extracted from sheet 'Sheet1'. It might be empty or malformed.",
        ],
        flaskErrors: [
            "Error parsing subject info for faculty KR, day Thursday: Semester not found in: SE DAA",
        ],
        flaskSuccess: false,
    };

    const mockResponsePerfect: FacultyMatrixUploadResult = {
        status: "success",
        message: "Faculty matrix import complete.",
        rowsAffected: 500,
        totalRowsSkippedDueToMissingEntities: 0,
        missingFaculties: [],
        missingSubjects: [],
        skippedRowsDetails: [],
        flaskWarnings: [],
        flaskErrors: [],
        flaskSuccess: true,
    };

    const mockResponseMissingEntities: FacultyMatrixUploadResult = {
        status: "success",
        message: "Faculty matrix import complete.",
        rowsAffected: 300,
        totalRowsSkippedDueToMissingEntities: 15,
        missingFaculties: ["JD", "AB", "XY"],
        missingSubjects: ["CS101", "MATH201"],
        skippedRowsDetails: [
            "Faculty 'JD' not found for subject CS101",
            "Subject 'MATH201' not found in database",
        ],
        flaskWarnings: [],
        flaskErrors: [],
        flaskSuccess: true,
    };

    const testScenario = (
        mockData: FacultyMatrixUploadResult,
        scenarioName: string
    ) => {
        console.log(`🧪 Testing scenario: ${scenarioName}`);
        console.log("Mock data:", mockData);
        handleFacultyMatrixUploadResponse(mockData);
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Toast Testing Component</h2>
            <p className="mb-4 text-gray-600">
                Use these buttons to test different toast scenarios. Check your
                browser console for debugging information.
            </p>

            <div className="space-y-3">
                <button
                    onClick={() =>
                        testScenario(
                            mockResponseWithFlaskIssues,
                            "Flask Warnings & Errors"
                        )
                    }
                    className="block w-full px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
                >
                    🧪 Test Flask Warnings & Errors (Your Current Case)
                </button>

                <button
                    onClick={() =>
                        testScenario(mockResponsePerfect, "Perfect Success")
                    }
                    className="block w-full px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200"
                >
                    🧪 Test Perfect Success (No Issues)
                </button>

                <button
                    onClick={() =>
                        testScenario(
                            mockResponseMissingEntities,
                            "Missing Entities"
                        )
                    }
                    className="block w-full px-4 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                >
                    🧪 Test Missing Faculties & Subjects
                </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded">
                <h3 className="font-semibold text-blue-900 mb-2">
                    Expected Toasts for Your Case:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>
                        • ✅ Success: &quot;Successfully processed 425 subject
                        allocations&quot;
                    </li>
                    <li>
                        • ⚠️ Flask Warning 1: About Sheet2 being empty/malformed
                    </li>
                    <li>
                        • ⚠️ Flask Warning 2: About Sheet1 being empty/malformed
                    </li>
                    <li>
                        • ❌ Flask Error: About semester not found for faculty
                        KR
                    </li>
                    <li>
                        • 🚨 Critical Status: &quot;Flask processing encountered
                        critical errors &quot;
                    </li>
                    <li>• 📊 Summary: Overview of all issues found</li>
                </ul>
            </div>

            <div className="mt-4 p-4 bg-amber-50 rounded">
                <h3 className="font-semibold text-amber-900 mb-2">
                    Debugging Info:
                </h3>
                <p className="text-sm text-amber-800">
                    Open your browser&apos;s developer console to see detailed
                    logging from the toast handler. Look for messages starting
                    with &quot;🍞 Toast Handler&quot;.
                </p>
            </div>
        </div>
    );
};

export default ToastTestComponent;
