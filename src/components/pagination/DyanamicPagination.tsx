import React from "react";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const DyanamicPagination: React.FC<PaginationProps> = ({
  currentPage,
  onPageChange,
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <button
        className="btn btn-outline-secondary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        Previous
      </button>

      <button
        className="btn btn-outline-secondary"
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};
