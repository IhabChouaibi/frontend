import { AttachmentResponseDto } from './attachment-response.dto';

export interface CandidateResponseDto {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  yearsOfExperience?: number;
  currentCompany?: string;
  currentPosition?: string;
  attachments?: AttachmentResponseDto[];
}
