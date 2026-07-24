interface TerminalPromptProps {
    path?: string;
}

export function TerminalPrompt({
    path = "~",
}: TerminalPromptProps) {
    return (
        <>
            <span className="text-emerald-500">
                han@portfolio
            </span>

            <span>:</span>

            <span className="text-blue-400">
                {path}
            </span>

            <span>$</span>
        </>
    );
}