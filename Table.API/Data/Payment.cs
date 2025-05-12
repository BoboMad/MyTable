namespace Table.API.Data
{
    public class Payment
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string Description { get; set; }
    }
}
