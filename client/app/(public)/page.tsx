import { Terminal } from "@/components/public/terminal/terminal";
import { TerminalWorkspaceProvider } from "@/components/public/terminal/workspace/terminal-workspace-context";

export default function HomePage() {
    return(
    <TerminalWorkspaceProvider>
        <Terminal />
    </TerminalWorkspaceProvider>
    )
}