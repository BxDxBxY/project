import React from "react";
import Link from "next/link";
import { TermSummary } from "@/types";

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
      className={`flex items-center p-4 sm:p-5 md:p-6 bg-white rounded-xl w-auto h-full hover:shadow-xl transition-all duration-300 hover:bg-blue-50/50 border border-gray-100 hover:border-blue-200 group/card ${className}`}
    >
      <div className="flex-1">
        <h3 className="text-[15px] sm:text-base md:text-lg font-bold text-gray-800 group-hover/card:text-[#001c3b] line-clamp-2 leading-snug transition-colors">
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
