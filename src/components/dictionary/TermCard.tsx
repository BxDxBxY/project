import React from "react";
import Link from "next/link";
import { Category, TermSummary } from "@/types";
import {
  getTermTranslation,
  getTermDescription,
  formatDate,
} from "@/lib/utils";

interface TermCardProps {
  term: TermSummary;
  // language: string;
  className?: string;
  adminPanel?: boolean;
  // categories: Category[];
}

export const TermCard: React.FC<TermCardProps> = ({
  term,
  // language,
  // categories,
  adminPanel,
  className = "",
}) => {
  // const translatedTitle = getTermTranslation(term, language);
  // const translatedDescription = getTermDescription(term, language);

  return (
    <Link
      href={adminPanel ? "" : `/dictionary/${term.id}`}
      className={`flex p-3  sm:p-4 md:p-5 bg-white rounded-xl w-full hover:shadow-lg transition-all duration-300 hover:bg-blue-50 border border-gray-200 hover:border-blue-400 ${className}`}
    >
      <div className="space-y-1 sm:space-y-2">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
          {term.title}
        </h3>
      </div>
    </Link>
  );
};
// {/* <p className="text-sm text-gray-600 line-clamp-3">
//   {translatedDescription}
// </p>
// <div className="flex items-center justify-between text-xs text-gray-500">
// <span>Created: {formatDate(term.created_at)}</span>
// <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
//     Category:{" "}
//     {categories.find((category) => category.id === term.category)?.name}
//   </span>
// </div> */}
