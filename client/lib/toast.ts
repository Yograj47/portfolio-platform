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