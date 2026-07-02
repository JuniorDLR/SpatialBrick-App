export type ExamPhase = "login" | "register" | "dashboard" | "welcome" | "instructions" | "test" | "completed";

export type UserDemographics = {
  identificacion: string;
  fullName: string;
  birthDate: string;
  gender: string;
  educationLevel: string;
  email: string;
  phone: string;
  jobPosition: string;
  profession: string;
};
