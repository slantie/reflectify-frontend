/** @type {import('next').NextConfig} */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ["http://192.168.56.1:3000"], // Replace with the actual origin you're using
    reactStrictMode: true,
};

export default nextConfig;
