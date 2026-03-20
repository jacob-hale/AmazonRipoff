using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SQLitePCL;
using AmazonRipoff.Data;


namespace AmazonRipoff.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookStoreDbContext _context;
        public BookController(BookStoreDbContext context)
        {
            _context = context;
        }
        [HttpGet("AllBooks")]
        public BookListData GetBooks(int pageSize = 5, int pageNum = 1, bool sortByTitle = false)
        {
            // Start with the full query
            var query = _context.Books.AsQueryable();

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

            var x = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumBooks = _context.Books.Count();

            return new BookListData()
            {
                Books = x,
                TotalNumBooks = totalNumBooks
            };
        }

    }
}
