using Microsoft.EntityFrameworkCore;
using Table.API.Data;
using static System.Runtime.InteropServices.JavaScript.JSType;

public class AppDbContext : DbContext
{
    public DbSet<TableRow> Customers { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TableRow>().HasData(GenerateCustomers(10_000));
    }

    private static List<TableRow> GenerateCustomers(int count)
    {
        var random = new Random();
        var startDate = DateTime.UtcNow.AddYears(-10);
        var customers = new List<TableRow>();
        for (int i = 1; i <= count; i++)
        {
            customers.Add(new TableRow
            {
                Id = i,
                Username = $"User {i}",
                Email = $"Example{i}@example.com",
                Date = startDate.AddDays(random.Next(0, 365 * 10)),
                Age = random.Next(10, 96),
                Active = random.Next(0, 2) == 1
            });
        }
        return customers;
    }
}