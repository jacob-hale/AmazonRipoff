import {
  useContext,
  useEffect,
  useState,
  createContext,
  type ReactNode,
} from 'react';
import type { CartItem } from '../types/CartItem';

const CART_STORAGE_KEY = 'amazonRipoffCart';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Pick<CartItem, 'bookId' | 'title' | 'unitPrice'>) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    const storedCart = window.sessionStorage.getItem(CART_STORAGE_KEY);
    if (!storedCart) {
      return [];
    }

    try {
      const parsedCart = JSON.parse(storedCart) as CartItem[];
      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    item: Pick<CartItem, 'bookId' | 'title' | 'unitPrice'>
  ) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((c) => c.bookId === item.bookId);

      if (!existingItem) {
        return [
          ...prevCart,
          {
            bookId: item.bookId,
            title: item.title,
            unitPrice: item.unitPrice,
            quantity: 1,
            lineTotal: item.unitPrice,
          },
        ];
      }

      return prevCart.map((c) =>
        c.bookId === item.bookId
          ? {
              ...c,
              quantity: c.quantity + 1,
              lineTotal: (c.quantity + 1) * c.unitPrice,
            }
          : c
      );
    });
  };

  const removeFromCart = (bookId: number) => {
    setCart((prevCart) =>
      prevCart
        .map((c) => {
          if (c.bookId !== bookId) {
            return c;
          }

          const nextQuantity = c.quantity - 1;
          if (nextQuantity <= 0) {
            return null;
          }

          return {
            ...c,
            quantity: nextQuantity,
            lineTotal: nextQuantity * c.unitPrice,
          };
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => {
    setCart(() => []);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.lineTotal, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
