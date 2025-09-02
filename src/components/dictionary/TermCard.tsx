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
      className={`flex p-[4px] sm:pl-3 sm:py-3 md:py-4   bg-white rounded-md sm:rounded-xl w-auto h-full hover:shadow-lg transition-all duration-300 hover:bg-blue-50 border border-gray-200 hover:border-blue-400 ${className}`}
    >
      <div className="space-y-[2px] sm:space-y-2">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold !text-gray-900 line-clamp-2 leading-tight px-2 !overflow-hidden">
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
