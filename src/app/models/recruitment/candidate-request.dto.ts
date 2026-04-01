export interface CandidateRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  yearsOfExperience?: number;
  currentCompany?: string;
  currentPosition?: string;
}
