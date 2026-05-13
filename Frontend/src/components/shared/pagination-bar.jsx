import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getPaginationItems(page, totalPages, maxButtons = 7) {
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const leftSibling = Math.max(page - 1, 2);
  const rightSibling = Math.min(page + 1, totalPages - 1);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    return [1, 2, 3, 4, 5, "next-ellipsis", totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [
      1,
      "previous-ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [1, "previous-ellipsis", leftSibling, page, rightSibling, "next-ellipsis", totalPages];
}

export default function PaginationBar({
  page,
  totalPages,
  onPageChange,
  summary,
  previousLabel = "Trước",
  nextLabel = "Tiếp",
  className,
  maxButtons = 7,
}) {
  const safeTotalPages = Math.max(Number(totalPages) || 1, 1);
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), safeTotalPages);

  if (safeTotalPages <= 1) {
    if (!summary) return null;

    return (
      <div
        className={cn(
          className,
          "flex rounded-[2rem] border border-outline-variant/15 bg-surface-container-lowest px-6 py-5 shadow-sm",
        )}
      >
        <p className="text-base font-extrabold text-on-surface-variant md:text-lg">{summary}</p>
      </div>
    );
  }

  const items = getPaginationItems(currentPage, safeTotalPages, maxButtons);

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        className,
        "flex flex-col gap-5 rounded-[2rem] border border-outline-variant/15 bg-surface-container-lowest px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between md:px-7",
      )}
    >
      {summary ? (
        <p className="text-base font-extrabold text-on-surface-variant md:text-lg">{summary}</p>
      ) : (
        <span className="hidden sm:block" aria-hidden="true" />
      )}

      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          className="h-12 rounded-full border-outline-variant/20 bg-surface-container-low px-4 text-base font-extrabold text-on-surface shadow-sm hover:bg-primary/10 hover:text-primary disabled:bg-surface-container-low disabled:text-on-surface-variant disabled:opacity-55 md:px-5"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          <ChevronLeft className="size-5" />
          <span className="hidden sm:inline">{previousLabel}</span>
        </Button>

        {items.map((item) =>
          typeof item === "number" ? (
            <Button
              key={item}
              type="button"
              variant="outline"
              size="sm"
              aria-current={item === currentPage ? "page" : undefined}
              className={cn(
                "h-12 min-w-12 rounded-full border-outline-variant/20 px-4 text-base font-extrabold shadow-sm",
                item === currentPage
                  ? "border-primary/25 bg-primary/18 text-primary shadow-md shadow-primary/20 ring-1 ring-primary/15 hover:bg-primary/24 hover:text-primary"
                  : "bg-surface-container-low text-on-surface hover:bg-primary/10 hover:text-primary",
              )}
              onClick={() => onPageChange(item)}
            >
              {item}
            </Button>
          ) : (
            <span
              key={item}
              className="flex h-12 min-w-9 items-center justify-center rounded-full text-lg font-extrabold text-on-surface-variant"
            >
              ...
            </span>
          ),
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage >= safeTotalPages}
          className="h-12 rounded-full border-outline-variant/20 bg-surface-container-low px-4 text-base font-extrabold text-on-surface shadow-sm hover:bg-primary/10 hover:text-primary disabled:bg-surface-container-low disabled:text-on-surface-variant disabled:opacity-55 md:px-5"
          onClick={() => onPageChange(Math.min(safeTotalPages, currentPage + 1))}
        >
          <span className="hidden sm:inline">{nextLabel}</span>
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </nav>
  );
}
