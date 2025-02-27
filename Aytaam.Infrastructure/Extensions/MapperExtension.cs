using Aytaam.Infrastructure.AutoMapper;

namespace Aytaam.Infrastructure.Extensions
{
    public static class MapperExtension
    {
        public static IServiceCollection RegisterMappingProfile(this IServiceCollection services)
        {
            services.AddSingleton(new MapperConfiguration(cfg =>
             {
                 cfg.AddProfile(new MappingProfile());
             }).CreateMapper());

            return services;
        }
    }
}
