
export interface Route {
  id: string;
  title: string;
  subtitle: string;
  difficulty: string;
  length: string;
  aspect: string;
  date: string;
  tags: string[];
  mainImage: string;
  gallery: string[];
  story: string;
  lead: string;
  approach: string;
  descent: string;
  gear: string[];
  climbers: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Experience {
  year: number;
  title: string;
  description: string;
}
