export interface JobOffer {
     id?: number;          
  title: string;
  description: string;
  requiredSkills?: string;
  experienceLevel?: string;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  location?: string;
  organisationId?: number;
  status?: string;   
}
