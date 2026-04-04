import '../App.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WelcomeBand from '../components/WelcomeBand';
import CategoryFilter from '../components/CategoryFilter';
import BookList from '../components/BookList';
import { useCart } from '../context/CartContext';

const CATEGORIES_STORAGE_KEY = 'amazonRipoffSelectedCategories';

// BooksPage composes filters, list, mini-cart offcanvas, and toast feedback.
function BooksPage() {
  const navigate = useNavigate();
  const { cart, totalItems, totalPrice, removeFromCart, clearCart } = useCart();
  const [sortByTitle, setSortByTitle] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(5);
  const [showMiniCart, setShowMiniCart] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);

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
    // Persist selected categories for this browsing session.
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.setItem(
      CATEGORIES_STORAGE_KEY,
      JSON.stringify(selectedCategories)
    );
  }, [selectedCategories]);

  useEffect(() => {
    // Auto-hide toasts after a short delay.
    if (!showToast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowToast(false);
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [showToast]);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleAddedToCart = (title: string) => {
    showToastMessage(`${title} added to cart`);
  };

  const handleRemoveOne = (bookId: number, title: string) => {
    removeFromCart(bookId);
    showToastMessage(`Removed 1 copy of ${title}`);
  };

  const handleClearCart = () => {
    clearCart();
    showToastMessage('Cart cleared');
  };

  return (
    <div className="container-fluid py-3">
      <div className="row mb-3">
        <div className="col-12 bg-primary text-white rounded-3 py-2">
          <WelcomeBand />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-12 d-flex justify-content-end">
          <Link
            to="/adminbooks"
            className="btn btn-outline-primary btn-sm"
          >
            Manage Books
          </Link>
        </div>
      </div>
      <div className="row g-3 align-items-start">
        <div className="col-12 col-lg-3">
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
        <div className="col-12 col-lg-9">
          <BookList
            selectedCategories={selectedCategories}
            sortByTitle={sortByTitle}
            pageSize={pageSize}
            onAddToCart={handleAddedToCart}
          />
        </div>
      </div>
      <div
        className="cart-summary-floating"
        onClick={() => setShowMiniCart(true)}
      >
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

      {showMiniCart && (
        <>
          {/* Offcanvas mini-cart for quick cart edits without leaving the page. */}
          <div
            className="offcanvas offcanvas-end show"
            tabIndex={-1}
            style={{ visibility: 'visible' }}
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">Mini Cart</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowMiniCart(false)}
              ></button>
            </div>
            <div className="offcanvas-body d-flex flex-column gap-3">
              {cart.length === 0 ? (
                <p className="mb-0">Your cart is empty.</p>
              ) : (
                <ul className="list-group">
                  {cart.map((item) => (
                    <li
                      key={item.bookId}
                      className="list-group-item d-flex justify-content-between align-items-start gap-2"
                    >
                      <div>
                        <div className="fw-semibold">{item.title}</div>
                        <small className="text-muted">
                          Qty: {item.quantity} x ${item.unitPrice.toFixed(2)}
                        </small>
                      </div>
                      <div className="text-end">
                        <div className="fw-semibold mb-1">
                          ${item.lineTotal.toFixed(2)}
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleRemoveOne(item.bookId, item.title)
                          }
                        >
                          Remove 1
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-auto border-top pt-3">
                <p className="mb-1">
                  <strong>Items:</strong> {totalItems}
                </p>
                <p className="mb-3">
                  <strong>Total:</strong> ${totalPrice.toFixed(2)}
                </p>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary flex-grow-1"
                    onClick={() => {
                      setShowMiniCart(false);
                      navigate('/cart');
                    }}
                  >
                    View Cart
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleClearCart}
                    disabled={cart.length === 0}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="offcanvas-backdrop fade show"
            onClick={() => setShowMiniCart(false)}
          ></div>
        </>
      )}

      {showToast && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className="toast show text-bg-dark border-0" role="status">
            <div className="d-flex">
              <div className="toast-body">{toastMessage}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                aria-label="Close"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BooksPage;
