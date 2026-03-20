import { useEffect, useState } from 'react';
import type { Book } from './types/Books';

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortByTitle, setSortByTitle] = useState<boolean>(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `https://localhost:5000/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortByTitle=${sortByTitle}`
        );
        const data = await response.json();
        setBooks(data.books);
        setTotalItems(data.totalNumBooks);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchBooks();
  }, [pageSize, pageNum, totalItems, sortByTitle]);

  return (
    <>
      <h1>Book List</h1>
      <br />

      {books.map((b) => (
        <div key={b.bookID}>
          <h2>{b.title}</h2>
          <ul>
            <li>
              <strong>Author:</strong> {b.author}
            </li>
            <li>
              <strong>Publisher:</strong> {b.publisher}
            </li>
            <li>
              <strong>ISBN:</strong> {b.isbn}
            </li>
            <li>
              <strong>Classification:</strong> {b.classification}
            </li>
            <li>
              <strong>Category:</strong> {b.category}
            </li>
            <li>
              <strong>Page Count:</strong> {b.pageCount}
            </li>
            <li>
              <strong>Price:</strong> ${b.price.toFixed(2)}
            </li>
          </ul>
        </div>
      ))}

      <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
        Previous
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => setPageNum(index + 1)}
          disabled={pageNum === index + 1}
        >
          {index + 1}
        </button>
      ))}

      <button
        disabled={pageNum === totalPages}
        onClick={() => setPageNum(pageNum + 1)}
      >
        Next
      </button>
      <br />
      <label>
        Results per page:
        <select
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
      <label style={{ marginLeft: '20px' }}>
  Sort by Title:
  <input
    type="checkbox"
    checked={sortByTitle}
    onChange={(e) => {
      setSortByTitle(e.target.checked);
      setPageNum(1); // Reset to page 1 when sorting changes
    }}
  />
</label>
    </>
  );
}

export default BookList;
