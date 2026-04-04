import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Book } from '../types/Books';
import { deleteBook, fetchBooks } from '../api/BooksAPI';
import Pagination from '../components/Pagination';
import NewBookForm from '../components/NewBookForm';
import EditBookForm from '../components/EditBookForm';

/**
 * Staff-only style page: list books with paging, add new rows, edit or delete.
 * Route: `/adminbooks` (see `App.tsx`). Uses the same API module as the public catalog.
 */
const AdminBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        // Admin list: no category filter, default sort (by id) via `sortByTitle: false`.
        const data = await fetchBooks(pageSize, pageNum, false, []);
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [pageSize, pageNum]);

  /** Deletes after confirm; updates local state so the table matches the server. */
  const handleDelete = async (bookId: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this book?'
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await deleteBook(bookId);
      setBooks(books.filter((b) => b.bookID !== bookId));
    } catch (err) {
      alert('Failed to delete book: ' + (err as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-3">
        <AdminBooksNav />
        <div>Loading books...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container-fluid py-3">
        <AdminBooksNav />
        <div className="text-danger">Error loading books: {error}</div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      <header className="mb-4">
        <AdminBooksNav />
        <h1 className="h2 fw-bold text-dark mb-0">Admin - Books</h1>
      </header>

      {!showForm && (
        <button
          className="mb-4 btn btn-success text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          Add Book
        </button>
      )}

      {showForm && (
        <NewBookForm
          onSuccess={() => {
            setShowForm(false);
            fetchBooks(pageSize, pageNum, false, []).then((data) =>
              setBooks(data.books)
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSuccess={() => {
            setEditingBook(null);
            fetchBooks(pageSize, pageNum, false, []).then((data) =>
              setBooks(data.books)
            );
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}

      <table className="table table-bordered table-striped">
        <thead>
          <tr className="table-dark">
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.bookID}>
              <td>{b.bookID}</td>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.publisher}</td>
              <td>{b.isbn}</td>
              <td>{b.classification}</td>
              <td>{b.category}</td>
              <td>{b.pageCount}</td>
              <td>${b.price.toFixed(2)}</td>
              <td>
                <button
                  onClick={() => setEditingBook(b)}
                  className="btn btn-primary text-white px-2 py-1 rounded w-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(b.bookID)}
                  className="btn btn-danger text-white px-2 py-1 rounded w-100"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
    </div>
  );
};

/** Back link used on every admin state so users can return to the public catalog. */
function AdminBooksNav() {
  return (
    <div className="mb-3">
      <Link
        to="/books"
        className="btn btn-outline-secondary btn-sm"
      >
        ← Back to book list
      </Link>
    </div>
  );
}

export default AdminBooksPage;
