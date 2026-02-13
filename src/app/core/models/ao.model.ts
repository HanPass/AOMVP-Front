export interface AO {
  id: number;
  reference: string;
  title: string;
  sector: string;
  region: string;
  budget: number;
  publicationDate: string;
  deadlineDate: string;
  status: 'open' | 'submitted' | 'awarded' | 'closed';
}
