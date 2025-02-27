namespace Aytaam.Infrastructure.Extensions;

public static class AuthorizationExtension
{
    public static IServiceCollection RegisterAuthorization(this IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            options.AddPolicy("Admin", policyBuilder => policyBuilder.RequireAssertion(context =>

            context.User.HasClaim("Permission", "Admin")

            ));
        });
        return services;
    }
}

