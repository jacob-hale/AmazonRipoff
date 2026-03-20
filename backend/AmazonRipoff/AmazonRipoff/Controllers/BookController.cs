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
        public IEnumerable<Book> GetBooks() 
        { 
            var x = _context.Books.ToList();
            return x;

        }

    }
}
