import React from "react";
import Link from "next/link";
import { Category, Term } from "@/types";
import {
  getTermTranslation,
  getTermDescription,
  formatDate,
} from "@/lib/utils";

interface TermCardProps {
  term: Term;
  language: string;
  className?: string;
  categories: Category[];
}

export const TermCard: React.FC<TermCardProps> = ({
  term,
  language,
  categories,
  className = "",
}) => {
  const translatedTitle = getTermTranslation(term, language);
  const translatedDescription = getTermDescription(term, language);

  return (
    <Link
      href={`/dictionary/${term.id}`}
      className={`block p-4 bg-white rounded-lg w-fit hover:shadow-md transition-all duration-200 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 ${className}`}
    >
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {translatedTitle}
        </h3>
        {/* <p className="text-sm text-gray-600 line-clamp-3">
          {translatedDescription}
        </p> */}
        {/* <div className="flex items-center justify-between text-xs text-gray-500"> */}
        {/* <span>Created: {formatDate(term.created_at)}</span> */}
        {/* <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
            Category:{" "}
            {categories.find((category) => category.id === term.category)?.name}
          </span> */}
        {/* </div> */}
      </div>
    </Link>
  );
};
