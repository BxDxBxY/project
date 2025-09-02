// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Authentication Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface CreateUserData {
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user_type: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  full_name: string;
  // last_name: string;
  // is_staff: boolean;
  // is_active: boolean;
  // date_joined: string;
}

// Dictionary Types - Updated to match Swagger
export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export type ModalType = "add" | "edit" | "delete";

export interface Country {
  id: number;
  name: string;
  iso_code: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Source {
  id: number;
  title: string;
  url: string;
  publication_date: string;
  created_at: string;
  updated_at: string;
}

export interface TermSummary {
  id: number;
  title: string;
}

// Full term details (when opening a specific term)
export interface TermDetail {
  id: number;
  title: string;
  definition: string;
  created_at: string;
  updated_at: string;
  categories: Category[];
  related_terms: TermSummary[];
  related_countries: Country[];
  sources: Source[];
}
export interface TermDetailEdit {
  id: number;
  title: string;
  definition: string;
  created_at?: string;
  updated_at?: string;
  categories?: number[];
  related_terms?: number[];
  related_countries?: number[];
  sources?: number[];
}

// export interface Term {
//   id: number;
//   title: string;
//   definition: string;
//   created_at: string;
//   updated_at: string;
//   // photo_id: number[];
//   categories: number[];
//   related_terms: number[];
//   related_countries: any[];
//   sources: any[];
// }

export interface TermTranslation {
  id: number;
  term: number;
  language: string;
  title: string;
  description: string;
}

export interface CreateTermData {
  title: string;
  // photo: File | null;
  definition: string;
  categories: number[];
  related_terms: number[];
  related_countries: number[];
  sources: number[];
}

export interface UpdateTermData {
  title?: string;
  photo?: File | null;
  definition?: string;
  categories?: number[];
  related_terms?: number[];
}

export interface CreateCategoryData {
  name: string;
}

export interface UpdateCategoryData {
  name?: string;
}

// UI State Types
export interface DictionaryState {
  terms: TermSummary[];
  termDetail?: TermDetail;
  categories: Category[];
  loading: boolean;
  error: string | null;
  search: string;
  selectedCategory: string;
  language: string;
}

export interface AdminState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// Language Types
// export interface Language {
//   code: string;
//   label: string;
// }

// Error Types
export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// Component Props Types
export interface DictionaryPageProps {
  initialTerms?: TermSummary[];
  initialCategories?: Category[];
}

export interface TermCardProps {
  term: TermSummary;
  // language: string;
}

// export interface CategoryFilterProps {
//   categories: Category[];
//   selectedCategory: string;
//   onCategoryChange: (categoryId: string) => void;
// }

export interface SearchBarProps {
  search: string;
  onSearchChange: (search: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// export interface LanguageSelectorProps {
// languages: Language[];
// currentLanguage: string;
// onLanguageChange: (language: string) => void;
// }
