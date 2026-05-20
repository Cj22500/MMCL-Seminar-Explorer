export interface SeminarSource {
  title: string;
  url: string;
}

export interface Seminar {
  id: string;
  title: string;
  host: string;
  description: string;
  date: string;
  type: 'onsite' | 'hybrid' | 'online';
  scale: 'local' | 'international';
  venue: string;
  link: string;
  sources: SeminarSource[];
  topics: string[];
  isRealTimeSearched?: boolean;
}

export interface SearchResponse {
  query: string;
  seminars: Seminar[];
}
