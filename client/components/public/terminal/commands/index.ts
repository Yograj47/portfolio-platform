import { clearCommand } from "./clear";
import { helpCommand } from "./help";
import { lsCommand } from "./ls";
import { openCommand } from "./open";
import { cdCommand } from "./cd";
import { pwdCommand } from "./pwd";
import { aboutCommand } from "./about";
import { contactCommand } from "./contact";
import { themeCommand } from "./theme";

export const commandRegistry = {
    help: helpCommand,
    ls: lsCommand,
    cd: cdCommand,
    pwd: pwdCommand,
    open: openCommand,
    clear: clearCommand,

    about: aboutCommand,
    contact: contactCommand,
    theme: themeCommand,
};
