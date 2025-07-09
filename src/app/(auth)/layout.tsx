// src/app/(auth)/layout.tsx
// No "use client" needed here typically, as it's just a container.
// It can be a Server Component.

export const metadata = {
    title: "Auth - Reflectify",
    description: "Login or Register pages",
};

export default function AuthGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div>{children} </div>;
}
