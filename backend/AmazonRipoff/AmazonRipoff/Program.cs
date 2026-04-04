using Microsoft.EntityFrameworkCore;
using AmazonRipoff.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Enables attribute-routed API controllers.
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Registers EF Core with SQLite using the configured connection string.
builder.Services.AddDbContext<BookStoreDbContext>(options => 
    options.UseSqlite(builder.Configuration.GetConnectionString("BookStoreConnection")));

// Allow frontend app to call this API from a different origin.
builder.Services.AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Frontend dev server origin. JSON POST/PUT send a preflight that must allow Content-Type.
app.UseCors(x =>
    x.WithOrigins("http://localhost:3000",
    "https://jolly-rock-0e964e01e.7.azurestaticapps.net")
        .AllowAnyHeader()
        .AllowAnyMethod());

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
