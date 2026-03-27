import '../App.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeBand from '../components/WelcomeBand';
import CategoryFilter from '../components/CategoryFilter';
import BookList from '../components/BookList';
import { useCart } from '../context/CartContext';

const CATEGORIES_STORAGE_KEY = 'amazonRipoffSelectedCategories';

function BooksPage() {
  const navigate = useNavigate();
  const { totalItems, totalPrice } = useCart();
  const [sortByTitle, setSortByTitle] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(5);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    const storedCategories = window.sessionStorage.getItem(
      CATEGORIES_STORAGE_KEY
    );
    if (!storedCategories) {
      return [];
    }

    try {
      const parsedCategories = JSON.parse(storedCategories) as string[];
      return Array.isArray(parsedCategories) ? parsedCategories : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.setItem(
      CATEGORIES_STORAGE_KEY,
      JSON.stringify(selectedCategories)
    );
  }, [selectedCategories]);

  return (
    <div className="container">
      <div className="row bg-primary text-white">
        <WelcomeBand />
      </div>
      <div className="row">
        <div className="col-md-3">
          <CategoryFilter
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
          <div className="card mt-3 shadow-sm border-0">
            <div className="card-body text-start">
              <h5 className="card-title mb-3">Sort</h5>
              <label className="form-check form-switch m-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={sortByTitle}
                  onChange={(e) => setSortByTitle(e.target.checked)}
                />
                <span className="form-check-label">Order by Book Title</span>
              </label>
            </div>
          </div>
          <div className="card mt-3 shadow-sm border-0">
            <div className="card-body text-start">
              <h5 className="card-title mb-3">Display</h5>
              <label className="form-label mb-0 d-flex flex-column gap-1">
                <span className="small text-muted">Results per page</span>
                <select
                  className="form-select"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </label>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <BookList
            selectedCategories={selectedCategories}
            sortByTitle={sortByTitle}
            pageSize={pageSize}
          />
        </div>
      </div>
      <div className="cart-summary-floating" onClick={() => navigate('/cart')}>
        <span className="cart-summary-icon" aria-hidden="true">
          🛒
        </span>
        <div className="cart-summary-text">
          <strong>${totalPrice.toFixed(2)}</strong>
          <span>
            {totalItems} item{totalItems === 1 ? '' : 's'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default BooksPage;
