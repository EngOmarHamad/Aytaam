namespace Aytaam.Infrastructure.Extensions;

public static class AuthenticationExtension
{
    public static IServiceCollection RegisterAuthentication(this IServiceCollection services)
    {
        services.AddIdentity<Account, IdentityRole>(config =>
        {
            config.User.RequireUniqueEmail = true; // to register a customer from another store
            config.Password.RequireDigit = true;
            config.Password.RequiredLength = 6;
            config.Password.RequireLowercase = true;
            config.Password.RequireNonAlphanumeric = false;
            config.Password.RequireUppercase = true;
            config.SignIn.RequireConfirmedEmail = false;
            config.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+"; // to accept digits and letters
            config.Lockout.AllowedForNewUsers = true;
            config.Lockout.MaxFailedAccessAttempts = 5;
            config.Lockout.DefaultLockoutTimeSpan = new TimeSpan(0, 5, 0);
        })
        .AddEntityFrameworkStores<AytaamDbContext>()
        .AddDefaultTokenProviders().AddErrorDescriber<CustomIdentityErrorDescriber>(); ;


        return services;
    }
    public static IServiceCollection ConfigureApplicationCookie(this IServiceCollection services)
    {
        services.ConfigureApplicationCookie(options =>
        {
            options.AccessDeniedPath = "/Error/Index/403";
            options.Cookie.Name = "AytaamAppCookie";
            options.LoginPath = "/Identity/Account/Login";
            options.LogoutPath = "/Identity/Account/Logout";
            options.ExpireTimeSpan = TimeSpan.FromDays(10);
            options.Cookie.HttpOnly = false;
            options.SlidingExpiration = true;

        });

        return services;
    }
}
