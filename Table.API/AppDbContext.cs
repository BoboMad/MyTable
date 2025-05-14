using Microsoft.EntityFrameworkCore;
using Table.API.Data;
using static System.Runtime.InteropServices.JavaScript.JSType;

public class AppDbContext : DbContext
{
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Status> Statuses { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Status>().HasData(
                new Status { Id = 1, Name = "Pending" },
                new Status { Id = 2, Name = "Processing" },
                new Status { Id = 3, Name = "Success" },
                new Status { Id = 4, Name = "Failed" }
            );

        modelBuilder.Entity<Payment>().HasData(GeneratePayments(10_000));

        modelBuilder.Entity<Payment>()
                .HasOne<Status>()
                .WithMany()
                .HasForeignKey(p => p.StatusId);
    }

    private static List<Payment> GeneratePayments(int count)
    {
        var random = new Random();
        var startDate = DateTime.UtcNow.AddYears(-1);
        var payments = new List<Payment>();
        for (int i = 1; i <= count; i++)
        {
            var creationDate = startDate.AddDays(random.Next(0, 365));
            payments.Add(new Payment
            {
                Id = i,
                Email = $"user{i}@example.com",
                Amount = Math.Round((decimal)(random.NextDouble() * 10000 + 10),2),
                StatusId = random.Next(1, 5),
                CreationDate = creationDate,
                ExpirationDate = creationDate.AddDays(30),
                Description = $"Payment for order {i}"
            });
        }
        return payments;
    }
}