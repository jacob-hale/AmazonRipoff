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
        public BookListData GetBooks(int pageSize = 5, int pageNum = 1) 
        { 
            var x = _context.Books
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumBooks = _context.Books.Count();

            BookListData bookListData = new BookListData()
            {
                Books = x,
                TotalNumBooks = totalNumBooks
            };
            return bookListData;

        }

    }
}
