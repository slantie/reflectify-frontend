/**
 * @file src/components/modals/SimpleConfirmDialog.tsx
 * @description A simple confirmation dialog component using native browser confirm
 */

import React from "react";

interface SimpleConfirmDialogProps {
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

export const useConfirmDialog = () => {
    const showConfirmDialog = ({
        message,
        onConfirm,
        onCancel,
    }: SimpleConfirmDialogProps) => {
        const confirmed = window.confirm(message);
        if (confirmed) {
            onConfirm();
        } else if (onCancel) {
            onCancel();
        }
    };

    return { showConfirmDialog };
};
