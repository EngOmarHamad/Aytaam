namespace Aytaam.Core.Dtos.General
{
    public class LoginResponse
    {
        public string? Token { get; set; }
        public string? Email { get; set; }
        public OrphanType? userType { get; set; }
        public string? Name { get; set; }
        public string? ImagePath { get; set; }
        public string? Id { get; set; }
    }
}
