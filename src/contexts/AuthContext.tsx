/**
 * @file src/contexts/AuthContext.tsx
 * @description Authentication context and provider for user state and actions
 */
"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { showToast } from "@/lib/toast";
import authService from "@/services/authService";
import { Admin } from "@/interfaces/auth";

// Auth context type
interface AuthContextType {
    user: Admin | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider for authentication state
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Admin | null>(null);
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);
    const router = useRouter();

    // Check authentication status
    const checkAuth = useCallback(async () => {
        setLoading(true);
        try {
            const token = Cookies.get("authToken");
            if (!token) {
                setUser(null);
                return;
            }
            const response = await authService.getMe();
            setUser(response.data.admin);
        } catch {
            Cookies.remove("authToken");
            setUser(null);
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    }, []);

    // Run checkAuth on mount
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Handle user login
    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login(email, password);
            const {
                token,
                data: { admin: userData },
            } = response;
            Cookies.set("authToken", token, {
                expires: 7,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
            });
            setUser(userData);
            showToast.success("Logged in successfully!");
            router.replace("/dashboard");
        } catch {
            throw new Error("Login failed");
        }
    };

    // Handle user logout
    const logout = async () => {
        try {
            Cookies.remove("authToken");
            setUser(null);
            showToast.success("Logged out successfully!");
            router.replace("/");
        } catch {
            showToast.error("Failed to log out. Please try again.");
            Cookies.remove("authToken");
            setUser(null);
        }
    };

    // Prevent rendering until initial auth check is complete
    if (initialLoad) {
        return null;
    }

    return (
        <AuthContext.Provider
            value={{ user, loading, login, logout, checkAuth }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
