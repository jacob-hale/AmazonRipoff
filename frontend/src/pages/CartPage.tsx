import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { CartItem } from '../types/CartItem';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, totalItems, totalPrice } = useCart();

  return (
    <div className="container py-4">
      <h2 className="mb-4">Your Cart</h2>
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
                            onClick={() => removeFromCart(item.bookId)}
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

      <div className="d-flex flex-wrap gap-2 mt-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </button>
        <button
          className="btn btn-secondary"
          onClick={clearCart}
          disabled={cart.length === 0}
        >
          Clear Cart
        </button>
        <button className="btn btn-primary" disabled={cart.length === 0}>
          Checkout
        </button>
      </div>
    </div>
  );
}

export default CartPage;
