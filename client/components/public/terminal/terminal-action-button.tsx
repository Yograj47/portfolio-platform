interface TerminalActionButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

export function TerminalActionButton({
    children,
    onClick,
    disabled = false,
}: TerminalActionButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="
                border
                border-border
                px-3
                py-1
                font-mono
                text-sm
                transition-colors
                hover:border-primary
                hover:bg-muted
            "
        >
            {children}
        </button>
    );
}
