interface TerminalActionButtonProps {
    children: React.ReactNode;

    onClick: () => void;
}

export function TerminalActionButton({
    children,
    onClick,
}: TerminalActionButtonProps) {
    return (
        <button
            onClick={onClick}
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
            [{children}]
        </button>
    );
}