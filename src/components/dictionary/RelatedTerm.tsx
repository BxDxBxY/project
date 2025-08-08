import { Term } from "@/types";
import React from "react";
import Link from "next/link";

const RelatedTerm = ({ term, terms }: { term: Term; terms: Term[] }) => {
  // Check if related_terms has any IDs and map them to titles.
  const relatedTermTitles =
    term.related_terms.length > 0 && terms.length > 0
      ? term.related_terms
          .map((relatedId) =>
            terms.find((termItem) => termItem.id === relatedId)
          )
          .filter(Boolean) // Ensure no null results if any relatedId doesn't match
          .map((termItem) => (
            <Link
              key={termItem?.id}
              href={`/dictionary/${termItem?.id}`}
              style={{ marginRight: "8px" }}
            >
              {termItem?.title}
            </Link>
          ))
      : [];

  return (
    <div>
      {relatedTermTitles.length > 0 && (
        <div>
          <strong>Related Terms: </strong>
          {relatedTermTitles}
        </div>
      )}
    </div>
  );
};

export default RelatedTerm;
