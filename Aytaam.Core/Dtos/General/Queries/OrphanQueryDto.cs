namespace Aytaam.Core.Dtos.General.Queries;
public class OrphanQueryDto : QueryDto
{
    public OrphanType? OrphanType { get; set; }
    public SponsorshipType? SponsorshipType { get; set; }
    public AgeGroup? AgeGroup { get; set; }
}
