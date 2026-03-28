import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { CartItem } from '../types/CartItem';

// CartPage shows full cart details and checkout-related actions.
function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    // Auto-dismiss action toasts so they don't stay on screen.
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

  const handleRemoveOne = (item: CartItem) => {
    removeFromCart(item.bookId);
    showToastMessage(`Removed 1 copy of ${item.title}`);
  };

  const handleClearCart = () => {
    clearCart();
    showToastMessage('Cart cleared');
  };

  return (
    <div className="container py-4">
      <div className="row g-3">
        <div className="col-12">
          <h2 className="mb-0 text-dark">Your Cart</h2>
        </div>

        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              {cart.length === 0 ? (
                <p className="mb-0">Your cart is empty.</p>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <thead>
                        <tr>
                          <th scope="col">Book</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">Price</th>
                          <th scope="col">Subtotal</th>
                          <th scope="col" className="text-end">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item: CartItem) => (
                          <tr key={item.bookId}>
                            <td>
                              <strong>{item.title}</strong>
                            </td>
                            <td>{item.quantity}</td>
                            <td>${item.unitPrice.toFixed(2)}</td>
                            <td>${item.lineTotal.toFixed(2)}</td>
                            <td className="text-end">
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRemoveOne(item)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-end">
                    <div className="text-end">
                      <p className="mb-1">
                        <strong>Total Items:</strong> {totalItems}
                      </p>
                      <p className="mb-0 fs-5">
                        <strong>Total:</strong> ${totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleClearCart}
              disabled={cart.length === 0}
            >
              Clear Cart
            </button>
            <button className="btn btn-primary" disabled={cart.length === 0}>
              Checkout
            </button>
          </div>
        </div>
      </div>

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

export default CartPage;
