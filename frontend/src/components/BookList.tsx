import { useEffect, useState } from 'react';
import type { Book } from '../types/Books';
import { fetchBooks } from '../api/BooksAPI';
import { useCart } from '../context/CartContext';

const LIST_STATE_STORAGE_KEY = 'amazonRipoffBookListState';

// BookList handles catalog fetching, pagination, and add-to-cart actions.
function BookList({
  selectedCategories,
  sortByTitle,
  pageSize,
  onAddToCart,
}: {
  selectedCategories: string[];
  sortByTitle: boolean;
  pageSize: number;
  onAddToCart: (title: string) => void;
}) {
  const { addToCart } = useCart();

  // Restore the last viewed page so users can keep browsing where they left off.
  const getStoredState = () => {
    if (typeof window === 'undefined') {
      return null;
    }

    const storedState = window.sessionStorage.getItem(LIST_STATE_STORAGE_KEY);
    if (!storedState) {
      return null;
    }

    try {
      return JSON.parse(storedState) as {
        pageNum?: number;
      };
    } catch {
      return null;
    }
  };

  const initialState = getStoredState();

  // Local UI/query state used to request and render paged book results.
  const [books, setBooks] = useState<Book[]>([]);
  const [pageNum, setPageNum] = useState<number>(initialState?.pageNum ?? 1);
  const [previousPageSize, setPreviousPageSize] = useState<number>(pageSize);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    // Reset paging when the requested page size changes.
    if (pageSize !== previousPageSize) {
      setPageNum(1);
      setPreviousPageSize(pageSize);
    }
  }, [pageSize, previousPageSize]);

  useEffect(() => {
    // Persist current page number for smoother return navigation.
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.setItem(
      LIST_STATE_STORAGE_KEY,
      JSON.stringify({ pageNum })
    );
  }, [pageNum]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        // Shared API module (same base URL and query string as `BookController.AllBooks`).
        const data = await fetchBooks(
          pageSize,
          pageNum,
          sortByTitle,
          selectedCategories
        );
        setBooks(data.books);
        setTotalItems(data.totalNumBooks);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    loadBooks();
  }, [pageSize, pageNum, sortByTitle, selectedCategories]);

  const handleAddToCart = (book: Book) => {
    // Add one copy and notify the page so it can show feedback.
    addToCart({
      bookId: book.bookID,
      title: book.title,
      unitPrice: book.price,
    });
    onAddToCart(book.title);
  };

  return (
    <div className="row g-3">
      <div className="col-12">
        <h1 className="display-5 fw-bold mb-2" style={{ color: 'black' }}>
          Book List
        </h1>
        <p className="text-muted mb-4">
          Browse {totalItems} books from the catalog
        </p>
      </div>

      {/* Render each book as a Bootstrap card for quick scanning. */}
      {books.map((b) => (
        <div key={b.bookID} className="col-12">
          <div className="card shadow-sm border-0">
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
              <div className="mt-3 text-end">
                <button
                  className="btn btn-success"
                  onClick={() => handleAddToCart(b)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination controls map 1..totalPages into numbered buttons. */}
      <div className="col-12">
        <nav aria-label="Book pagination" className="my-2">
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
      </div>
    </div>
  );
}

export default BookList;
