interface TerminalPromptProps {
    path: string;
}

export function TerminalPrompt({ path }: TerminalPromptProps) {
    return (
        <div className="flex items-center gap-0.5 whitespace-nowrap">
            <span className="text-emerald-500">
                yograj@workspace
            </span>

            <span>:</span>

            <span className="text-blue-400">
                {path}
            </span>

            <span>$</span>
        </div>
    );
}