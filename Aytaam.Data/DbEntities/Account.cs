namespace Aytaam.Data.DbEntities
{
    public class Account : IdentityUser
    {
        public string? ImagePath { get; set; } = "/assets/media/svg/files/blank-image.svg";
        public string? FullName { get; set; }
    }
}
