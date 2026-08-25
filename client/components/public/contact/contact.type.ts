export interface ContactProfileData {
    name: string;
    email: string;
    avatar: string | null;
    role: string | null;
    location: string | null;
    isAvailable: boolean;
    openToFullTime: boolean;
    openToOpenSource: boolean;
    openToFreelance: boolean;
    githubUrl: string | null;
    linkedinUrl: string | null;
    resumeUrl: string | null;
}