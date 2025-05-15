using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Table.API.Data;

namespace Table.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayments()
        {

            var payments = await _context.Payments.ToListAsync();
            return payments;
        }

        [HttpPost]
        public async Task<ActionResult> CreatePayment(List<Payment> payments)
        {
            try
            {
                if (payments == null || !payments.Any())
                {
                    return BadRequest("No payments provided.");
                }

                await _context.AddRangeAsync(payments);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdatePayment(List<Payment> payments)
        {
            try
            {
                if (payments == null || !payments.Any())
                {
                    return BadRequest("No payments provided.");
                }

                foreach (var payment in payments)
                {
                    if (string.IsNullOrEmpty(payment.Email))
                    {
                        return BadRequest("Email is required for all payments.");
                    }
                    if (payment.Amount < 0)
                    {
                        return BadRequest("Amount cannot be negative.");
                    }
                    if (payment.ExpirationDate <= payment.CreationDate)
                    {
                        return BadRequest("Expiration date must be after creation date.");
                    }
                }

                var paymentIds = payments.Select(p => p.Id).ToList();
                var existingPayments = await _context.Payments
                    .Where(p => paymentIds.Contains(p.Id))
                    .ToListAsync();

                foreach (var payment in payments)
                {
                    var existingPayment = existingPayments.First(p => p.Id == payment.Id);
                    existingPayment.Email = payment.Email;
                    existingPayment.Amount = payment.Amount;
                    existingPayment.StatusId = payment.StatusId;
                    existingPayment.CreationDate = payment.CreationDate;
                    existingPayment.ExpirationDate = payment.ExpirationDate;
                    existingPayment.Description = payment.Description;

                    _context.Entry(existingPayment).State = EntityState.Modified;
                }

                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeletePayment(List<int> paymentIds)
        {
            try
            {
                if (paymentIds == null || !paymentIds.Any())
                {
                    return BadRequest("No payments provided.");
                }

                var existingPayments = await _context.Payments
                    .Where(p => paymentIds.Contains(p.Id))
                    .ToListAsync();

                _context.Payments.RemoveRange(existingPayments);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500);
            }
        }
    }
}
