// src/components/auth/AuthLayout.tsx
import Image from "next/image";
import loginImage from "/public/BG.svg"; // Assuming /public/BG.svg is correct
import { ThemeToggle } from "@/components/ui"; // Assuming ThemeToggle path

interface AuthLayoutProps {
    children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        // Main container: Switched to grid, adjusted columns and background
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-5 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            {/* A Fixed Div with the ThemeToggle Component on the Top right corner */}
            <div className="fixed top-5 right-5 z-50">
                <ThemeToggle />
            </div>

            {/* Left Section - Image (Takes 3/5 width on large screens) */}
            <div className="hidden lg:flex flex-col col-span-3 p-8 items-center justify-center">
                <div className="flex-grow flex items-center justify-center h-full max-h-screen">
                    <Image
                        src={loginImage}
                        alt="Authentication illustration"
                        className="max-w-full min-h-[85vh] w-auto object-contain"
                        priority
                    />
                </div>
            </div>

            {/* Right Section - Content (Takes 2/5 width on large screens) */}
            <div className="w-full lg:col-span-2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                {children}
            </div>
        </div>
    );
};
