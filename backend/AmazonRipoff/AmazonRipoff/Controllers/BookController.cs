using Microsoft.AspNetCore.Mvc;
using AmazonRipoff.Data;

namespace AmazonRipoff.Controllers
{
    // Bookstore API: paged reads, categories, and admin CRUD (add / update / delete).
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookStoreDbContext _context;
        public BookController(BookStoreDbContext context)
        {
            _context = context;
        }

        // Returns a single page of books plus the total count for pagination UI.
        [HttpGet("AllBooks")]
        public BookListData GetBooks(int pageSize = 5, int pageNum = 1, bool sortByTitle = false, [FromQuery] List<string>? categories = null)
        {
            // Start with the full query
            var query = _context.Books.AsQueryable();

            // Apply category filtering if categories are provided. This is done before sorting and pagination to ensure we are working with the correct subset of data.
            if (categories != null && categories.Any())
            {
                query = query.Where(b => categories.Contains(b.Category));
            }

            // Apply sorting BEFORE pagination
            if (sortByTitle)
            {
                query = query.OrderBy(b => b.Title);
            }
            else
            {
                // It is best practice to have a default sort (like ID) for stable pagination
                query = query.OrderBy(b => b.BookID);
            }
            var totalNumBooks = query.Count();

            var x = query
                // Page index is 1-based from the client.
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Total rows is returned separately so the client can compute total pages.

            return new BookListData()
            {
                Books = x,
                TotalNumBooks = totalNumBooks
            };
        }

        // Distinct category values for filter UI on the public book list.
        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories()
        {
            var categories = _context.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();
            return Ok(categories);
        }

        // Inserts a book; client should send BookID = 0 for database-generated keys.
        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _context.Books.Add(newBook);
            _context.SaveChanges();
            return Ok();
        }

        // Updates every mutable field on the book with the given id; 404 if missing.
        [HttpPut("UpdateBook/{id}")]
        public IActionResult UpdateBook(int id, [FromBody] Book updatedBook)
        {
            var existingBook = _context.Books.Find(id);
            if (existingBook == null)
            {
                return NotFound();
            }

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            _context.Books.Update(existingBook);
            _context.SaveChanges();
            return Ok(existingBook);
        }

        // Removes a book by id; 204 on success, 404 if not found.
        [HttpDelete("DeleteBook/{id}")]
        public IActionResult DeleteBook(int id)
        {
            var existingBook = _context.Books.Find(id);
            if (existingBook == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            _context.Books.Remove(existingBook);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
