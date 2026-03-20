using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace AmazonRipoff.Data
{
    // EF Core session for querying and saving bookstore data.
    public class BookStoreDbContext : DbContext
    {
        
            public BookStoreDbContext(DbContextOptions<BookStoreDbContext> options) : base(options)
            {
            }

            // Books table mapping.
            public DbSet<Book> Books { get; set; }
        }
    
}
