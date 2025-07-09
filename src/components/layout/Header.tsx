"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "../ui/Button"; // Assuming your Button component is here
import ThemeToggle from "../ui/ThemeToggle"; // Assuming ThemeToggle is here
import { motion } from "framer-motion"; // Import motion for animations
import { Menu, X, Trash2 } from "lucide-react"; // Import Lucide icons for hamburger/close/trash
import Image from "next/image"; // Re-import Image for Next.js
import logo from "../../../public/Logo.svg"; // Re-import logo for Next.js
import { useDeleteAllData } from "@/hooks/useDashboardStats";
import { showToast } from "@/lib/toast";

const HeaderRoute = (route: string, label: string) => {
    return (
        <Link
            href={route}
            className="text-light-text dark:text-dark-text hover:text-light-highlight dark:hover:text-dark-highlight transition-colors duration-200 font-medium"
        >
            {label}
        </Link>
    );
};

export function Header() {
    const { user, logout, loading } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu when navigating or on auth state change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [user]); // Depend on user to close menu on login/logout

    const handleLogout = async () => {
        try {
            await logout();
            setIsMobileMenuOpen(false); // Close menu after logout
        } catch (error) {
            console.error("Logout failed in Header:", error);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Delete all data mutation (development only)
    const deleteAllDataMutation = useDeleteAllData();

    const handleDeleteAllData = async () => {
        // Only show in development
        if (process.env.NODE_ENV !== "development") {
            return;
        }

        // Double confirmation for safety
        const firstConfirm = window.confirm(
            "⚠️ WARNING: This will delete ALL data from the database!\n\nThis action cannot be undone. Are you sure you want to continue?"
        );

        if (!firstConfirm) return;

        const secondConfirm = window.confirm(
            "🚨 FINAL WARNING: You are about to permanently delete ALL database records!\n\nType confirmation or click OK to proceed."
        );

        if (!secondConfirm) return;

        try {
            await deleteAllDataMutation.mutateAsync();
            showToast.success("Database deleted successfully!");
        } catch (error: any) {
            console.error("Failed to delete database:", error);
            showToast.error(
                "Failed to delete database: " +
                    (error.message || "Unknown error")
            );
        }
    };

    // Define Framer Motion variants for consistency with Footer
    const headerVariants = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const logoVariants = {
        animate: {
            opacity: [0.8, 1, 0.8], // Subtle pulse effect
        },
        transition: {
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
        },
    };

    // Render a minimal header or null while authentication status is being checked
    if (loading) {
        return (
            <motion.header
                initial="initial"
                animate="animate"
                variants={headerVariants}
                className="p-4 bg-white shadow-md dark:bg-gray-800 dark:text-gray-200 text-center border-b border-secondary-lighter dark:border-dark-secondary z-50 relative"
            >
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex justify-between items-center">
                    <span className="text-xl font-bold text-primary-dark dark:text-primary-light">
                        Reflectify
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Checking authentication...
                    </span>
                </div>
            </motion.header>
        );
    }

    return (
        <>
            <motion.header
                initial="initial"
                animate="animate"
                variants={headerVariants}
                className="bg-white dark:bg-dark-background border-b border-secondary-lighter dark:border-dark-secondary relative z-50"
            >
                <nav className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 flex items-center justify-between">
                    {/* Logo / Site Title */}
                    <motion.div
                        className="text-2xl sm:text-3xl font-bold whitespace-nowrap"
                        variants={logoVariants}
                        initial="animate"
                    >
                        <div className="flex items-center gap-2">
                            {" "}
                            {/* Adjusted gap for logo and text */}
                            <Link href="/" className="flex items-center gap-2">
                                <Image
                                    src={logo}
                                    alt="Reflectify Logo"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                    priority
                                />
                                <span className="text-2xl md:text-3xl font-bold">
                                    <span className="bg-gradient-to-r from-primary-dark to-primary-main bg-clip-text text-transparent">
                                        Reflectify
                                    </span>
                                </span>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Conditional rendering for About Us and Contact - only if not authenticated */}
                        {!user && (
                            <>
                                <Link
                                    href="/about-us"
                                    className="text-secondary-dark dark:text-dark-tertiary hover:text-primary-dark dark:hover:text-primary-light transition-colors duration-200 font-medium"
                                >
                                    About Us
                                </Link>
                                <Link
                                    href="/contact"
                                    className="text-secondary-dark dark:text-dark-tertiary hover:text-primary-dark dark:hover:text-primary-light transition-colors duration-200 font-medium"
                                >
                                    Contact
                                </Link>

                                <div className="hidden md:flex items-center gap-4">
                                    <ThemeToggle />
                                </div>
                            </>
                        )}

                        {user ? (
                            <div className="flex items-center gap-4">
                                {HeaderRoute("/dashboard", "Dashboard")}

                                {user.isSuper &&
                                    HeaderRoute("/upload", "Upload Data")}
                                {user.isSuper &&
                                    HeaderRoute(
                                        "/faculty-matrix",
                                        "Faculty Matrix"
                                    )}
                                {user.isSuper &&
                                    HeaderRoute(
                                        "/feedback-forms",
                                        "Feedback Forms"
                                    )}
                                {user.isSuper &&
                                    HeaderRoute("/analytics", "Analytics")}
                                {user.isSuper &&
                                    HeaderRoute(
                                        "/faculty-analytics",
                                        "Faculty Analytics"
                                    )}

                                <div className="hidden md:flex items-center gap-4">
                                    <ThemeToggle />
                                    {/* Delete Database Button (Development Only) */}
                                    {process.env.NODE_ENV === "development" &&
                                        user?.isSuper && (
                                            <Button
                                                onClick={handleDeleteAllData}
                                                variant="destructive"
                                                size="sm"
                                                className="px-3 py-1.5 text-xs flex items-center gap-1 bg-red-600 hover:bg-red-700"
                                                disabled={
                                                    deleteAllDataMutation.isPending
                                                }
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                {deleteAllDataMutation.isPending
                                                    ? "Deleting..."
                                                    : "Delete DB"}
                                            </Button>
                                        )}
                                </div>

                                <Link
                                    href="/profile"
                                    className="px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary-darker transition-colors duration-200 text-sm font-semibold"
                                >
                                    Profile
                                </Link>

                                <Button
                                    onClick={handleLogout}
                                    variant="destructive"
                                    className="px-4 py-2 text-sm"
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary-darker transition-colors duration-200 text-sm font-semibold"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button (Hamburger) */}
                    <div className="md:hidden flex items-center gap-4">
                        <ThemeToggle />
                        <Button
                            onClick={toggleMobileMenu}
                            className="p-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-dark rounded-md"
                            aria-label="Toggle mobile menu"
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </Button>
                    </div>
                </nav>
            </motion.header>

            {/* Optional Backdrop for smoother UX */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
                    onClick={toggleMobileMenu}
                />
            )}

            {/* Mobile Menu (Outside Header) */}
            <motion.div
                id="mobile-menu"
                initial={false}
                animate={isMobileMenuOpen ? "open" : "closed"}
                variants={{
                    open: { opacity: 1, y: 0, display: "block" },
                    closed: {
                        opacity: 0,
                        y: "-100%",
                        transitionEnd: { display: "none" },
                    },
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden fixed top-[72px] left-0 w-full bg-white dark:bg-dark-background shadow-lg border-t border-secondary-lighter dark:border-dark-secondary overflow-hidden z-40"
            >
                <div className="flex flex-col p-4 space-y-3">
                    {/* Conditional rendering for About Us and Contact in mobile - only if not authenticated */}
                    {!user && (
                        <>
                            <Link
                                href="/about-us"
                                className="block text-secondary-dark dark:text-dark-tertiary hover:text-primary-dark dark:hover:text-primary-light py-2 font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About Us
                            </Link>
                            <Link
                                href="/contact"
                                className="block text-secondary-dark dark:text-dark-tertiary hover:text-primary-dark dark:hover:text-primary-light py-2 font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>
                        </>
                    )}

                    {user ? (
                        <>
                            <span className="block text-secondary-dark dark:text-dark-tertiary py-2 font-medium">
                                Hello, {user.name}
                            </span>
                            <Link
                                href="/dashboard"
                                className="block text-primary-dark dark:text-primary-light hover:underline py-2 font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                            {user.isSuper && (
                                <Link
                                    href="/upload"
                                    className="block text-primary-dark dark:text-primary-light hover:underline py-2 font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Upload Data
                                </Link>
                            )}
                            {user.isSuper && (
                                <Link
                                    href="/faculty-matrix"
                                    className="block text-primary-dark dark:text-primary-light hover:underline py-2 font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Faculty Matrix
                                </Link>
                            )}
                            {user.isSuper && (
                                <Link
                                    href="/feedback-forms"
                                    className="block text-primary-dark dark:text-primary-light hover:underline py-2 font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Feedback Forms
                                </Link>
                            )}
                            {user.isSuper && (
                                <Link
                                    href="/analytics"
                                    className="block text-primary-dark dark:text-primary-light hover:underline py-2 font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Analytics
                                </Link>
                            )}
                            {user.isSuper && (
                                <Link
                                    href="/faculty-analytics"
                                    className="block text-primary-dark dark:text-primary-light hover:underline py-2 font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Faculty Analytics
                                </Link>
                            )}

                            {/* Delete Database Button (Development Only - Mobile) */}
                            {process.env.NODE_ENV === "development" &&
                                user?.isSuper && (
                                    <Button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            handleDeleteAllData();
                                        }}
                                        variant="destructive"
                                        className="w-full mt-2 py-2.5 text-sm font-semibold bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
                                        disabled={
                                            deleteAllDataMutation.isPending
                                        }
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        {deleteAllDataMutation.isPending
                                            ? "Deleting Database..."
                                            : "Delete Database (DEV)"}
                                    </Button>
                                )}

                            {/* Changed "Logout" button to "Profile" link in mobile */}
                            <Link
                                href="/profile"
                                className="block px-4 py-2 bg-primary-dark text-white rounded-md text-center hover:bg-primary-darker transition-colors duration-200 mt-2 text-base font-semibold"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Profile
                            </Link>
                            {/* Keep Logout button alongside Profile in mobile */}
                            <Button
                                onClick={handleLogout}
                                variant="destructive"
                                className="w-full mt-2 py-2.5 text-base font-semibold"
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="block px-4 py-2 bg-primary-dark text-white rounded-md text-center hover:bg-primary-darker transition-colors duration-200 mt-2 text-base font-semibold"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </motion.div>
        </>
    );
}

export default Header;
