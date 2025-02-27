namespace Aytaam.Infrastructure.Services.Sponsorships;
public class SponsorshipService : ISponsorshipService
{
    private readonly AytaamDbContext _db;
    public SponsorshipService(AytaamDbContext db) => _db = db;
    public Task<int> GetCountAsync() => _db.TblSponsorships.CountAsync();
    public async Task<List<Sponsorship>> GetAllAsync()
    {
        var dbQuery = _db.TblSponsorships.OrderByDescending(x => x.CreatedAt).AsQueryable();
        return await dbQuery.ToListAsync();
    }
    public async Task<List<Sponsorship>> GetAllAsync(SponsorshipQueryDto query)
    {
        var dbQuery = _db.TblSponsorships.OrderByDescending(x => x.CreatedAt).AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.GeneralSearch))
        {
            dbQuery = dbQuery.Where(x => x.SponsorName != null && x.SponsorName.Trim().ToLower().Contains(query.GeneralSearch.Trim().ToLower()));
        }
        if (query.OrphanId != null)
        {
            dbQuery = dbQuery.Where(x => x.OrphanId != null && x.OrphanId == query.OrphanId);
        }
        return await dbQuery.ToListAsync();
    }
    public async Task<Sponsorship?> GetAsync(string? id) => await _db.TblSponsorships.SingleOrDefaultAsync(x => x.Id == id);
    public async Task<string> CreateAsync(Sponsorship input)
    {
        await _db.TblSponsorships.AddAsync(input);
        try
        {
            await _db.SaveChangesAsync();

        }
        catch (DBConcurrencyException ex)
        {
            throw ex;
        }
        return input.Id;
    }
    public async Task UpdateAsync(Sponsorship input)
    {
        var Sponsorship = await _db.TblSponsorships.SingleOrDefaultAsync(x => x.Id == input.Id) ?? throw new();
        _db.TblSponsorships.Update(input);
        try
        {
            await _db.SaveChangesAsync();

        }
        catch (DBConcurrencyException ex)
        {
            throw ex;
        }
    }
    public async Task DeleteAsync(string id)
    {
        var Sponsorship = await _db.TblSponsorships.SingleOrDefaultAsync(x => x.Id == id) ?? throw new();
        _db.TblSponsorships.Remove(Sponsorship);
        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DBConcurrencyException ex)
        {
            throw ex;
        }
    }
    public async Task<List<BaseViewModel<string>>> ListAsync()
    {
        var branchs = _db.TblSponsorships.AsQueryable();
        return await branchs.OrderByDescending(x => x.CreatedAt).Select(x => new BaseViewModel<string>
        {
            Id = x.Id,
            Name = x.SponsorName
        }).ToListAsync();
    }
}
