using Aytaam.Infrastructure.Services.Orphans;

namespace Aytaam.Infrastructure.Extensions;
public static class ContainerRegistryExtension
{
    public static IServiceCollection RegisterServices(this IServiceCollection services)
    {
        services.AddScoped<IOrphanService, OrphanService>();
        services.AddScoped<IFileService, FileService>();
        services.AddScoped<ISponsorshipService, SponsorshipService>();
        return services;
    }
}
