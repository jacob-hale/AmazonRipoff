// Cart item model stores per-book totals used across cart views and summaries.
export interface CartItem {
  bookId: number;
  title: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}
