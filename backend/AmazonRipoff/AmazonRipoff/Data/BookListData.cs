namespace AmazonRipoff.Data
{
    // Response DTO for paged book queries.
    public class BookListData
    {
        // Current page of books.
        public List<Book> Books { get; set; }

        // Total books across all pages.
        public int TotalNumBooks { get; set; }
    }
}
