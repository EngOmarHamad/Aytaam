using Aytaam.Core.ViewModels.Orphans;

namespace Aytaam.Web.Controllers;
[ApiExplorerSettings(IgnoreApi = true)]
public class HomeController : Controller
{
    [Route("/")]
    public IActionResult Index()
    {
        return View(new OrphansIndexViewModel()
        {
            OrphanTypes = [.. EnumsHelper.GetListOrphanTypes().Select(X => new SelectListItem() { Text = X.Item2, Value = X.Item1.ToString() })],
            SponsorshipTypes = [.. EnumsHelper.GetListSponsorshipTypes().Select(X => new SelectListItem() { Text = X.Item2, Value = X.Item1.ToString() })],
            AgeGroups = [.. EnumsHelper.GetListAgeGroups().Select(X => new SelectListItem() { Text = X.Item2, Value = X.Item1.ToString() })],
        });
    }
    public IActionResult Privacy()
    {
        return View();
    }
}