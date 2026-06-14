import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [1];

  if (currentPage > 3) pages.push('...');

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (currentPage < totalPages - 2) pages.push('...');

  pages.push(totalPages);
  return pages;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  const handleChange = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full py-8">
      <div className="flex justify-start items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-transparent hover:opacity-50 disabled:opacity-30 -ml-2"
          disabled={currentPage === 1}
          onClick={() => handleChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {pages.map((page, idx) =>
            page === '...' ? (
              <span key={`ellipsis-${idx}`} className="mx-2 text-sm font-light text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant="ghost"
                size="sm"
                className={`min-w-8 h-8 hover:bg-transparent text-sm ${
                  page === currentPage
                    ? 'underline font-normal'
                    : 'hover:underline font-light'
                }`}
                onClick={() => handleChange(page)}
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-transparent hover:opacity-50 disabled:opacity-30"
          disabled={currentPage === totalPages}
          onClick={() => handleChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};

export default Pagination;
