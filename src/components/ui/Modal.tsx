/**
 * @file src/components/ui/Modal.tsx
 * @description Flexible modal/dialog component with overlay, animations, and accessibility features
 */

import React, { useEffect, useRef, ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "./Button";

// Modal size options
export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

// Modal props interface
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
  showOverlay?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  preventScroll?: boolean;
}

// Size configurations
const sizeClasses = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-none w-full h-full m-0",
};

// Modal component
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  showCloseButton = true,
  showOverlay = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = "",
  overlayClassName = "",
  contentClassName = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  preventScroll = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!preventScroll) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, preventScroll]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 ${className}`}>
      {/* Overlay */}
      {showOverlay && (
        <div
          className={`
            absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm
            transition-opacity duration-300
            ${overlayClassName}
          `}
          onClick={handleOverlayClick}
        />
      )}

      {/* Modal Container */}
      <div
        className={`
          absolute inset-0 flex items-center justify-center p-4
          ${size === "full" ? "p-0" : ""}
        `}
        onClick={handleOverlayClick}
      >
        {/* Modal Content */}
        <div
          ref={modalRef}
          className={`
            relative w-full ${sizeClasses[size]}
            bg-light-background dark:bg-dark-background
            border border-light-secondary dark:border-dark-secondary
            rounded-lg shadow-xl
            transform transition-all duration-300 ease-out
            focus:outline-none
            ${size === "full" ? "rounded-none h-full" : ""}
            ${contentClassName}
          `}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div
              className={`
                flex items-center justify-between px-6 py-4
                border-b border-light-secondary dark:border-dark-secondary
                ${headerClassName}
              `}
            >
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-light-text dark:text-dark-text"
                >
                  {title}
                </h2>
              )}

              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="
                    p-2 -mr-2 rounded-lg
                    text-light-muted-text dark:text-dark-muted-text
                    hover:bg-light-hover dark:hover:bg-dark-hover
                    hover:text-light-text dark:hover:text-dark-text
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary-main
                  "
                  aria-label="Close modal"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div
            className={`
              px-6 py-4
              ${!title && !showCloseButton ? "pt-6" : ""}
              ${!footer ? "pb-6" : ""}
              ${bodyClassName}
            `}
          >
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div
              className={`
                px-6 py-4
                border-t border-light-secondary dark:border-dark-secondary
                bg-light-muted-background dark:bg-dark-muted-background
                ${size === "full" ? "rounded-none" : "rounded-b-lg"}
                ${footerClassName}
              `}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Confirmation Dialog component
export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "destructive";
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "default",
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmText}
          </Button>
        </div>
      }
    >
      <p className="text-light-text dark:text-dark-text">{message}</p>
    </Modal>
  );
};

// Alert Dialog component
export interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  type?: "info" | "success" | "warning" | "error";
  actionText?: string;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  title,
  message = "Something happened.",
  type = "info",
  actionText = "OK",
}) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case "success":
        return "Success";
      case "warning":
        return "Warning";
      case "error":
        return "Error";
      default:
        return "Information";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      size="sm"
      footer={
        <div className="flex justify-end">
          <Button onClick={onClose}>{actionText}</Button>
        </div>
      }
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{getIcon()}</span>
        <p className="text-light-text dark:text-dark-text flex-1">{message}</p>
      </div>
    </Modal>
  );
};

export default Modal;
