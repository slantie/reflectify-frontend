// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css"; // Your global styles

// Import the client-side React Query Provider
import ReactQueryProvider from "@/providers/ReactQueryProvider";
// Import your AuthProvider
import { AuthProvider } from "@/contexts/AuthContext";
// Import your NEW custom ThemeProvider
import { ThemeProvider } from "@/providers/ThemeProvider";

// Import DM Sans from Google Fonts
import { DM_Sans } from "next/font/google";

// Import your ToastProvider from its new location
import { ToastProvider } from "@/components/providers/ToastProvider";

export const metadata: Metadata = {
    title: "Reflectify - Feedback System",
    description: "A comprehensive student feedback management system",
};

const dmsans = DM_Sans({
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={dmsans.className}>
                <ThemeProvider>
                    <ReactQueryProvider>
                        <AuthProvider>
                            <ToastProvider>{children}</ToastProvider>
                        </AuthProvider>
                    </ReactQueryProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
