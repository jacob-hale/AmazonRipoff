import { useEffect, useState } from 'react';
import type { Book } from './types/Books';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  // Local UI/query state used to request and render paged book results.
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortByTitle, setSortByTitle] = useState<boolean>(false);

  useEffect(() => {
    // Refetch whenever paging/sorting inputs change so the view stays in sync.
    const categoryParams = selectedCategories
        .map((cat) => `categories=${encodeURIComponent(cat)}`)
        .join('&');

    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `https://localhost:5000/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortByTitle=${sortByTitle}${selectedCategories.length ? `&${categoryParams}` : ''}`
        );
        const data = await response.json();
        setBooks(data.books);
        setTotalItems(data.totalNumBooks);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [pageSize, pageNum, totalItems, sortByTitle, selectedCategories]);

  return (
    <div className="container py-4">
      <div className="mx-auto" style={{ maxWidth: '960px' }}>
        <h1 className="display-5 fw-bold mb-2" style={{ color: 'black' }}>
          Book List
        </h1>
        <p className="text-muted mb-4">
          Browse {totalItems} books from the catalog
        </p>

        {/* Render each book as a Bootstrap card for quick scanning. */}
        {books.map((b) => (
          <div key={b.bookID} className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <h2 className="h4 card-title mb-3 d-flex justify-content-between align-items-center">
                <span>{b.title}</span>
                <span className="badge text-bg-primary">
                  ${b.price.toFixed(2)}
                </span>
              </h2>
              <ul className="list-group list-group-flush">
                <li className="list-group-item px-0">
                  <strong>Author:</strong> {b.author}
                </li>
                <li className="list-group-item px-0">
                  <strong>Publisher:</strong> {b.publisher}
                </li>
                <li className="list-group-item px-0">
                  <strong>ISBN:</strong> {b.isbn}
                </li>
                <li className="list-group-item px-0">
                  <strong>Classification:</strong> {b.classification}
                </li>
                <li className="list-group-item px-0">
                  <strong>Category:</strong> {b.category}
                </li>
                <li className="list-group-item px-0">
                  <strong>Page Count:</strong> {b.pageCount}
                </li>
              </ul>
            </div>
          </div>
        ))}

        {/* Pagination controls map 1..totalPages into numbered buttons. */}
        <nav aria-label="Book pagination" className="my-4">
          <ul className="pagination justify-content-center flex-wrap gap-1">
            <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link rounded"
                disabled={pageNum === 1}
                onClick={() => setPageNum(pageNum - 1)}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index + 1}
                className={`page-item ${pageNum === index + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link rounded"
                  onClick={() => setPageNum(index + 1)}
                  disabled={pageNum === index + 1}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}
            >
              <button
                className="page-link rounded"
                disabled={pageNum === totalPages}
                onClick={() => setPageNum(pageNum + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>

        {/* Query controls that drive server-side filtering and page size. */}
        <div className="card border-0 shadow-sm">
          <div className="card-body d-flex flex-column flex-md-row align-items-md-center gap-3">
            <label className="form-label mb-0 d-flex flex-column gap-1">
              <span className="small text-muted">Results per page</span>
              <select
                className="form-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageNum(1); // Reset to first page when page size changes
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </label>
            <label className="form-check form-switch m-0 ms-md-2">
              <input
                className="form-check-input"
                type="checkbox"
                checked={sortByTitle}
                onChange={(e) => {
                  setSortByTitle(e.target.checked);
                  setPageNum(1); // Reset to page 1 when sorting changes
                }}
              />
              <span className="form-check-label">Sort by Title</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookList;
