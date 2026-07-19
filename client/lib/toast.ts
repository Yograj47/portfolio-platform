import { toast as sonner } from "sonner";

export const toast = {
    success: (message: string) =>
        sonner.success(message),

    error: (message: string) =>
        sonner.error(message),

    info: (message: string) =>
        sonner.info(message),

    warning: (message: string) =>
        sonner.warning(message),

    loading: (message: string) =>
        sonner.loading(message),

    dismiss: (id?: string | number) =>
        sonner.dismiss(id),

    promise: sonner.promise,
};

export const showSuccess = (message: string) =>
    toast.success(message);

export const showError = (message: string) =>
    toast.error(message);

export const showInfo = (message: string) =>
    toast.info(message);

export const showWarning = (message: string) =>
    toast.warning(message);