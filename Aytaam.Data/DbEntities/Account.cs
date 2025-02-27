namespace Aytaam.Data.DbEntities
{
    public class Account : IdentityUser
    {
        public string? ImagePath { get; set; }
        public string? FullName { get; set; }
    }
}
