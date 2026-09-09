"use client";


interface PageContainerProps {
  children: React.ReactNode;
  /** Maximum width: "sm" = 4xl, "md" = 6xl, "lg" = 7xl, "full" = no limit */
  maxWidth?: "sm" | "md" | "lg" | "full";
  /** Additional CSS classes */
  className?: string;
}

/**
 * Shared page container — provides consistent padding and centering.
 * Every public page should wrap its content in this component.
 *
 * Usage:
 *   <PageContainer maxWidth="md">  → max-w-6xl (dictionary, about, contact)
 *   <PageContainer maxWidth="sm">  → max-w-4xl (privacy, terms, term detail)
 *   <PageContainer maxWidth="full"> → no max-width (home hero variants)
 *   <PageContainer noPadding>      → removes default padding (for custom layouts)
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = "md",
  className = "",
}) => {
  const widthClass = {
    sm: "max-w-4xl",
    md: "max-w-6xl",
    lg: "max-w-7xl",
    full: "",
  }[maxWidth];

  return (
    <div
      className={`px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 mx-auto ${widthClass} ${className}`}
    >
      {children}
    </div>
  );
};
