import { useState } from 'react';
import type { Book } from '../types/Books';
import { addBook } from '../api/BooksAPI';

/** Form to insert a book. On success, the parent hides this form and reloads the list. */

interface NewBookFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewBookForm = ({ onSuccess, onCancel }: NewBookFormProps) => {
  const [formData, setFormData] = useState<Book>({
    bookID: 0,
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Coerce numeric fields before POST so JSON matches the API model.
    await addBook({
      ...formData,
      bookID: 0,
      pageCount: Number(formData.pageCount),
      price: Number(formData.price),
    });
    onSuccess();
  };

  return (
    <form>
      <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
      <label>
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </label>
      <label>
        Author:
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
        />
      </label>
      <label>
        Publisher:
        <input
          type="text"
          name="publisher"
          value={formData.publisher}
          onChange={handleChange}
        />
      </label>
      <label>
        ISBN:
        <input
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
        />
      </label>
      <label>
        Classification:
        <input
          type="text"
          name="classification"
          value={formData.classification}
          onChange={handleChange}
        />
      </label>
      <label>
        Category:
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
      </label>
      <label>
        Page Count:
        <input
          type="number"
          name="pageCount"
          value={formData.pageCount}
          onChange={handleChange}
        />
      </label>
      <label>
        Price:
        <input
          type="number"
          step="0.01"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
      </label>
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        onClick={handleSubmit}
      >
        Add Book
      </button>
      <button
        type="button"
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
        onClick={onCancel}
      >
        Cancel
      </button>
    </form>
  );
};

export default NewBookForm;
