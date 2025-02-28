namespace Aytaam.Core.ViewModels.Orphans;

public class OrphanQueryParamters : QueryParameters
{
    public OrphanType? OrphanType { get; set; }
    public AgeGroup? AgeGroup { get; set; }
    public SponsorshipType? SponsorshipType { get; set; }
    public string SearchTearm { get; set; } = string.Empty;
}
