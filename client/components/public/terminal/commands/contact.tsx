import { TerminalCommand } from "@/types/terminal.type";
import { ContactOutput } from "../../contact/contact-output";

export const contactCommand: TerminalCommand = {
    name: "contact",
    description: "Show contact information.",

    execute() {
        return {
            output: <ContactOutput />
        };
    },
};