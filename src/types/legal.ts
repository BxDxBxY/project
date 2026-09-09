// Legal content types
export interface LegalSection {
  id: string;
  title: string;
  content: string;
  subsections?: LegalSection[];
}

export interface LegalDocument {
  title: string;
  lastUpdated: string;
  version: string;
  effectiveDate: string;
  sections: LegalSection[];
}

export interface LegalContent {
  uz: LegalDocument;
  ru: LegalDocument;
}
