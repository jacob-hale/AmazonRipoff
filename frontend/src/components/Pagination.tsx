interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSize: number;
}

/**
 * Simple page controls + page-size selector, shared by admin lists that use server-side paging.
 * Renders Previous / numbered pages / Next and a results-per-page dropdown.
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSize,
}: PaginationProps) => {
  return (
    <div className="flex item-center justify-center mt-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => onPageChange(index + 1)}
          disabled={currentPage === index + 1}
        >
          {index + 1}
        </button>
      ))}

      <button
        disabled={totalPages === 0 || currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
      <br />
      <label>
        Results per page:
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
    </div>
  );
};

export default Pagination;
