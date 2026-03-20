using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace AmazonRipoff.Data
{
    public class BookStoreDbContext : DbContext
    {
        
            public BookStoreDbContext(DbContextOptions<BookStoreDbContext> options) : base(options)
            {
            }
            public DbSet<Book> Books { get; set; }
        }
    
}
