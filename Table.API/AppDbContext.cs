using Microsoft.EntityFrameworkCore;
using Table.API.Data;
using static System.Runtime.InteropServices.JavaScript.JSType;

public class AppDbContext : DbContext
{
    public DbSet<Payment> Payments { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Payment>().HasData(GeneratePayments(10_000));
    }

    private static List<Payment> GeneratePayments(int count)
    {
        var random = new Random();
        var startDate = DateTime.UtcNow.AddYears(-1);
        var statuses = new[] { "Pending", "processing", "success", "failed" };
        var payments = new List<Payment>();
        for (int i = 1; i <= count; i++)
        {
            var creationDate = startDate.AddDays(random.Next(0, 365));
            payments.Add(new Payment
            {
                Id = i,
                Email = $"user{i}@example.com",
                Amount = (decimal)(random.NextDouble() * 10000 + 10),
                Status = statuses[random.Next(statuses.Length)],
                CreationDate = creationDate,
                ExpirationDate = creationDate.AddDays(30),
                Description = $"Payment for order {i}"
            });
        }
        return payments;
    }
}