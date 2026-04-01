export interface JobOfferRequestDto {
  title: string;
  description: string;
  requiredSkills?: string;
  experienceLevel?: string;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  location?: string;
  organisationId?: number;
}
