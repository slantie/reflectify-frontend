// src/app/feedback/layout.tsx

import { motion } from "framer-motion";

export default function PublicFeedbackLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
        >
            {children}
        </motion.div>
    );
}
