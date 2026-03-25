import { Application } from "./application";
import { Attachment } from "./attachment";

export interface Candidate {
     id?: number;                   // présent si Response
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  yearsOfExperience?: number;
  currentCompany?: string;
  currentPosition?: string;
  attachments?: Attachment[];    // optionnel, liste des fichiers
  applications?: Application[];
}
