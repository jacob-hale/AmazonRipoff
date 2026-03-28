import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BooksPage from './pages/BooksPage';
import CartPage from './pages/CartPage';
import ConfirmAddToCart from './pages/ConfirmAddToCart';
import { CartProvider } from './context/CartContext';

// App wires the global cart provider and all top-level routes.
function App() {
  return (
    <>
      <CartProvider>
        <Router>
          {/* Keep routes centralized so navigation paths are easy to manage. */}
          <Routes>
            <Route path="/" element={<BooksPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/confirm-add/:bookId" element={<ConfirmAddToCart />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App;
