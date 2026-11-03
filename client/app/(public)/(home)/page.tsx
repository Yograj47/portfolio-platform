import type { Metadata } from "next";
import { CvHome } from "@/components/public/cv/cv-home";
export const metadata: Metadata = {
  title: "Yograj Rijal | Full-Stack Developer",
  description: "Projects, skills, and the journey of Yograj Rijal, a full-stack developer.",
};
export default function HomePage() {
  return <CvHome />;
}
