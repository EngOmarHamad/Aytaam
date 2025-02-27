namespace Aytaam.Infrastructure.Services.Sponsorships;
public interface ISponsorshipService
{
    Task<List<Sponsorship>> GetAllAsync();
    Task<List<Sponsorship>> GetAllAsync(SponsorshipQueryDto query);
    Task<int> GetCountAsync();
    Task<Sponsorship?> GetAsync(string? id);
    Task<string> CreateAsync(Sponsorship input);
    Task UpdateAsync(Sponsorship input);
    Task DeleteAsync(string id);
    Task<List<BaseViewModel<string>>> ListAsync();
}