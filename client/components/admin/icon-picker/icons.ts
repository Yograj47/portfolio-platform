import {
    SiCss,
    SiDocker,
    SiExpress,
    SiFirebase,
    SiGit,
    SiGithub,
    SiHtml5,
    SiJavascript,
    SiLinux,
    SiMongodb,
    SiMysql,
    SiNestjs,
    SiNextdotjs,
    SiNodedotjs,
    SiPostgresql,
    SiPrisma,
    SiPython,
    SiReact,
    SiRedis,
    SiTailwindcss,
    SiTypescript,
    SiVuedotjs,
} from "react-icons/si";

import type { IconType } from "react-icons";
import { FaAws } from "react-icons/fa6";

export interface IconOption {
    label: string;
    value: string;
    icon: IconType;
}

export const icons: IconOption[] = [
    {
        label: "React",
        value: "SiReact",
        icon: SiReact,
    },
    {
        label: "Next.js",
        value: "SiNextdotjs",
        icon: SiNextdotjs,
    },
    {
        label: "Node.js",
        value: "SiNodedotjs",
        icon: SiNodedotjs,
    },
    {
        label: "NestJS",
        value: "SiNestjs",
        icon: SiNestjs,
    },
    {
        label: "Express",
        value: "SiExpress",
        icon: SiExpress,
    },
    {
        label: "TypeScript",
        value: "SiTypescript",
        icon: SiTypescript,
    },
    {
        label: "JavaScript",
        value: "SiJavascript",
        icon: SiJavascript,
    },
    {
        label: "HTML",
        value: "SiHtml5",
        icon: SiHtml5,
    },
    {
        label: "CSS",
        value: "SiCss3",
        icon: SiCss,
    },
    {
        label: "Tailwind CSS",
        value: "SiTailwindcss",
        icon: SiTailwindcss,
    },
    {
        label: "Prisma",
        value: "SiPrisma",
        icon: SiPrisma,
    },
    {
        label: "PostgreSQL",
        value: "SiPostgresql",
        icon: SiPostgresql,
    },
    {
        label: "MySQL",
        value: "SiMysql",
        icon: SiMysql,
    },
    {
        label: "MongoDB",
        value: "SiMongodb",
        icon: SiMongodb,
    },
    {
        label: "Redis",
        value: "SiRedis",
        icon: SiRedis,
    },
    {
        label: "Docker",
        value: "SiDocker",
        icon: SiDocker,
    },
    {
        label: "Git",
        value: "SiGit",
        icon: SiGit,
    },
    {
        label: "GitHub",
        value: "SiGithub",
        icon: SiGithub,
    },
    {
        label: "Linux",
        value: "SiLinux",
        icon: SiLinux,
    },
    {
        label: "Python",
        value: "SiPython",
        icon: SiPython,
    },
    {
        label: "Firebase",
        value: "SiFirebase",
        icon: SiFirebase,
    },
    {
        label: "AWS",
        value: "FaAws",
        icon: FaAws,
    },
    {
        label: "Vue",
        value: "SiVuedotjs",
        icon: SiVuedotjs,
    },
];

export const iconMap = Object.fromEntries(
    icons.map((icon) => [
        icon.value,
        icon.icon,
    ])
);