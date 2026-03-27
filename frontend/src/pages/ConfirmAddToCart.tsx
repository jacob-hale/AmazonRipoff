import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ConfirmAddToCart() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const { cart } = useCart();
  const cartItem = cart.find((item) => item.bookId === Number(bookId));
  const title = cartItem?.title ?? 'Book';

  const handleContinueShopping = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 text-center">
              <h2 className="h3 mb-3">Added to Cart</h2>
              <p className="mb-4">
                <strong>{title}</strong> was added to your shopping cart.
              </p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/cart')}
                >
                  View Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmAddToCart;
