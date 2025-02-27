using Aytaam.Core.Constants;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Aytaam.Data
{
    public static class DBSeeder
    {
        public static async Task<IHost> SeedDbAsync(this IHost webHost)
        {
            using (var scope = webHost.Services.CreateScope())
            {
                try
                {
                    var context = scope.ServiceProvider.GetRequiredService<AytaamDbContext>();

                    if ((await context.Database.GetPendingMigrationsAsync()).Any())
                    {
                        context.Database.Migrate();
                    }
                    //context.SeedBranches();
                    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                    roleManager.SeedRolesAsync().Wait();
                    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<Account>>();
                    userManager.SeedOrphansAsync(context).Wait();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    //throw;
                }
            }
            return webHost;
        }

        private static async Task SeedRolesAsync(this RoleManager<IdentityRole> roleManager)
        {
            if (await roleManager.Roles.AnyAsync()) return;

            await roleManager.CreateAsync(new IdentityRole(RoleNames.Administrator));
        }

        private static async Task SeedOrphansAsync(this UserManager<Account> userManager, AytaamDbContext context)
        {
            try
            {


                await TransactionExtension.UseTransactionAsync(context, async () =>
                {
                    if (await userManager.Users.AnyAsync()) return;

                    // var branchId = context.Branches.First().Id;
                    var users = new List<Account>
                    {
                    new() {
                        FullName = "System Administrator",
                        UserName = "admin@test.com",
                        Email = "admin@test.com",
                        ImagePath = "/assets/media/svg/files/blank-image.svg",
                        EmailConfirmed = true,
                        PhoneNumberConfirmed = true,

                    },
                    };

                    foreach (var user in users)
                    {
                        var createOrphanResult = await userManager.CreateAsync(user, "Admin@123456");
                        if (createOrphanResult.Succeeded)
                        {

                            var res = await userManager.AddClaimAsync(user, new Claim("Permission", "Admin"));
                            var res2 = await userManager.AddToRoleAsync(user, "Admin");

                        }
                    }
                });
            }
            catch (Exception)
            {

                throw;
            }
        }




    }
}