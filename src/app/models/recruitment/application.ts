import { Attachment } from "./attachment";
import { Interview } from "./interview";

export interface Application {
    id?: number;           
  candidateId: number;
  jobOfferId: number;
  status?: string;        
  appliedDate?: string;   
  notes?: string;
  attachments?: Attachment[];
  interviews?: Interview[]
}
