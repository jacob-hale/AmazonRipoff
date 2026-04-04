import type { Book } from '../types/Books';

/**
 * HTTP helpers for the Book API. Matches the backend `BookController` routes
 * (read list, add, update, delete). Update `API_BASE_URL` when the API is hosted elsewhere.
 */

/** Shape of the JSON body from `GET .../AllBooks`. */
interface FetchBooksResponse {
  books: Book[];
  totalNumBooks: number;
}

const API_BASE_URL = 'https://amazonripoff-hale-backend-afddh6achcc9e5a9.francecentral-01.azurewebsites.net/book';

/** Loads one page of books; optional category filters and title sort match `AllBooks` query params. */
export const fetchBooks = async (
  pageSize: number,
  pageNum: number,
  sortByTitle: boolean,
  selectedCategories: string[]
): Promise<FetchBooksResponse> => {
  try {
    const normalizedCategories = selectedCategories
      .map((cat) => cat.trim())
      .filter((cat) => cat.length > 0);

    const categoryParams = normalizedCategories
      .map((cat) => `categories=${encodeURIComponent(cat)}`)
      .join('&');
    const response = await fetch(
      `${API_BASE_URL}/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortByTitle=${sortByTitle}${normalizedCategories.length ? `&${categoryParams}` : ''}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

/** Creates a row; send `bookID: 0` so the database can assign the key. */
export const addBook = async (newBook: Book): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/AddBook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

/** Replaces fields for the book with the given id; returns the updated book from the server. */
export const updateBook = async (
  bookId: number,
  updatedBook: Book
): Promise<Book> => {
  try {
    const response = await fetch(`${API_BASE_URL}/UpdateBook/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBook),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

/** Removes a book by id; backend responds with 204 No Content on success. */
export const deleteBook = async (bookId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DeleteBook/${bookId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};
