namespace Aytaam.Core.Dtos.General.Queries
{
    public class SponsorshipQueryDto : QueryDto
    {
        public string? OrphanCode { get; set; }
        public SponsorshipType2? SponsorshipType { get; set; }
    }
}
