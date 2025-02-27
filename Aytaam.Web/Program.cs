using Aytaam.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews().AddRazorRuntimeCompilation();
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
    throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");


builder.Services.AddDbContext<AytaamDbContext>(opts =>
{
    opts.UseSqlServer(connectionString, options =>
    {
        options.MigrationsAssembly("Aytaam.Data");
    });
    opts.EnableDetailedErrors();
    opts.EnableSensitiveDataLogging();
    opts.UseLazyLoadingProxies();
});
builder.Services.AddDatabaseDeveloperPageExceptionFilter();
builder.Services.AddSignalR();

//builder.Services.AddHostedService<OneTimeBackgroundService>();
//builder.Services.AddHostedService(provider =>
//{
//    var yourTask = provider.GetRequiredService<OneTimeBackgroundService>();
//    return new OneTimeBackgroundService(() => yourTask.ExecuteTask);
//});
builder.Services.RegisterServices()
    .RegisterAuthentication()
    .ConfigureApplicationCookie()
    .RegisterAuthorization()
    .RegisterMappingProfile();


builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(1);//You can set Time   
});
var app = builder.Build();


if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}
else
{

}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();


app.UseAuthorization();


app.UseStatusCodePagesWithReExecute("/Error/Index/{0}");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");


app.MapControllerRoute(
    name: "MyArea",
    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

app.MapControllers();

app.UseCors(options => options.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
await app.SeedDbAsync();
app.Run();



















