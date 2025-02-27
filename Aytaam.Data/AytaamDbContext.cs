namespace Aytaam.Data;
public class AytaamDbContext : IdentityDbContext<Account>
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AytaamDbContext(DbContextOptions<AytaamDbContext> options, IHttpContextAccessor httpContextAccessor) : base(options)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public DbSet<UploadedFile> TblUploadedFiles { get; set; }
    public DbSet<Sponsorship> TblSponsorships { get; set; }
    public DbSet<Orphan> TblOrphans { get; set; }
    public DbSet<Account> TblAccounts { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    }
}
