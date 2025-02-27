using Aytaam.Core.Dtos.Orphans;

namespace Aytaam.Infrastructure.Services.Orphans;

public interface IOrphanService
{
    Task<List<Orphan>> GetAllAsync();
    Task<List<Orphan>> GetAllAsync(OrphanQueryDto query);
    Task<InputOrphanDto> GetAsync(string id);
    Task<int> GetCountAsync();
    Task<string> GetOrphanFullNameAsync(string Id);
    Task<string?> CreateAsync(InputOrphanDto input);
    Task UpdateAsync(InputOrphanDto input);
    Task DeleteAsync(string id);
    Task ChangeOrphanTypeAsync(string id, OrphanType userType);
    Task<List<BaseViewModel<string>>> ListAsync(OrphanType? userType = null);
}