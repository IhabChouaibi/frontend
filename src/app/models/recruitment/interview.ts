export interface Interview {
     id?: number;             
  applicationId: number;
  interviewerId: number;
  interviewDate: string;   
  type: string;           
  status?: string;         
  feedback?: string;
  rating?: number;
}
