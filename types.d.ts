interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  available_copies: number;
  total_copies: number;
  description: string;
  color: string;
  cover: string;
  video: string;
  summary: string;
  isLoanedBook?: boolean;
}

interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}
