using Aytaam.Core.Dtos.Orphans;

namespace Aytaam.Core.ViewModels.Orphans;

public class AddOrphanViewModel
{
    public List<SelectListItem>? OrphanTypes { get; set; }
    public List<SelectListItem>? SponsorshipTypes { get; set; }
    public List<SelectListItem>? AgeGroups { get; set; }
    public InputOrphanDto? Dto { get; set; }

}
