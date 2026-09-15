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
        rounded-sm
        border
        border-border/60
        bg-background
        px-3
        py-1
        font-mono
        text-xs
        text-foreground
        transition-all
        hover:border-primary
        hover:bg-muted/50
        active:scale-[0.98]
        disabled:opacity-40
        disabled:pointer-events-none
        disabled:border-border/20
      "
    >
      {children}
    </button>
  );
}