import { useState, useEffect } from 'react';
import './CategoryFilter.css';

// CategoryFilter fetches categories and reports selected values back to BooksPage.
function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);

  // Load available categories once when the filter mounts.
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Simulate an API call to fetch categories
        const response = await fetch(
          'https://amazonripoff-hale-backend-afddh6achcc9e5a9.francecentral-01.azurewebsites.net/Book/GetBookCategories'
        );
        const data = await response.json();
        console.log('Fetched categories:', data);
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length === 0) {
      return;
    }

    const validSelections = selectedCategories.filter((category) =>
      categories.includes(category)
    );

    if (validSelections.length !== selectedCategories.length) {
      setSelectedCategories(validSelections);
    }
  }, [categories, selectedCategories, setSelectedCategories]);

  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    // Toggle category membership and push the latest list to the parent page.
    const updatedCategories = selectedCategories.includes(target.value)
      ? selectedCategories.filter((x) => x !== target.value)
      : [...selectedCategories, target.value];
    setSelectedCategories(updatedCategories);
  }

  return (
    <div className="category-filter">
      <h5>Book Categories</h5>
      <div className="category-list">
        {categories.map((c) => (
          <div key={c} className="category-item">
            <input
              type="checkbox"
              id={c}
              value={c}
              className="category-checkbox"
              checked={selectedCategories.includes(c)}
              onChange={handleCheckboxChange}
            />
            <label htmlFor={c}>{c}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
