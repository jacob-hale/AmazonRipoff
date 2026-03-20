import { useEffect, useState } from 'react';
import type { Book } from './types/Books';

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);



useEffect(() => {
    const fetchBooks = async () => {
        try {
            const response = await fetch('https://localhost:5000/Book/AllBooks');
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    fetchBooks();
  }, []);


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
    </>
  );
}

export default BookList;
