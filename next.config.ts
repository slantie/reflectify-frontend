/** @type {import('next').NextConfig} */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // allowedDevOrigins: ["http://localhost:3000"],
    reactStrictMode: true,
    swcMinify: true,
};

export default nextConfig;
