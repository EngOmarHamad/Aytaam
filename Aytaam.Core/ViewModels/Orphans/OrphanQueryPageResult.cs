using Aytaam.Core.Dtos.Orphans;

namespace Aytaam.Core.ViewModels.Orphans;

public class OrphanQueryPageResult : QueryPageResult<OrphanDto>
{
    public List<int>? BodyfocusCounters { get; set; }
    public List<int>? TraningTypeCounters { get; set; }
    public List<int>? DifficultyCounters { get; set; }
    public List<int>? EquipmentCounters { get; set; }
    public List<int>? ProgramLengthCounters { get; set; }
}
