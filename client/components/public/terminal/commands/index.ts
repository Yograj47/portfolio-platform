import { clearCommand } from "./clear";
import { helpCommand } from "./help";
import { lsCommand } from "./ls";
import { openCommand } from "./open";

export const commandRegistry = {
    help: helpCommand,
    ls: lsCommand,
    clear: clearCommand,
    open: openCommand,
};
