using Aytaam.Core.Dtos.Orphans;
using Aytaam.Core.ViewModels.Orphans;
using Aytaam.Infrastructure.Services.Orphans;

namespace Aytaam.Web.Controllers;
public class HomeController(IOrphanService orphanService) : Controller
{
    private readonly IOrphanService _orphanService = orphanService;

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
    [HttpPost]
    public async Task<QueryPageResult<OrphanDto>> GetOrphansAsync([FromForm] OrphanQueryParamters orphanQueryParams)
    {
        try
        {

            List<OrphanDto> program2 = [];
            IQueryable<OrphanDto> ListOfOrphans = (await _orphanService.GetAllAsync(new OrphanQueryDto()
            {
                AgeGroup = orphanQueryParams.AgeGroup,
                GeneralSearch = orphanQueryParams.SearchTearm,
                OrphanType = orphanQueryParams.OrphanType,
                SponsorshipType = orphanQueryParams.SponsorshipType
            })).Select(p =>
            {

                var EndDate = p.Sponsorships?.OrderByDescending(x => x.CreatedAt).FirstOrDefault()?.EndDate;
                var StartDate = p.Sponsorships?.OrderByDescending(x => x.CreatedAt).FirstOrDefault()?.StartDate;
                int? totalMonths = ((EndDate?.Year - StartDate?.Year) * 12) + (EndDate?.Month - StartDate?.Month);
                int? passedMonths = ((DateTime.Today.Year - StartDate?.Year) * 12) + (DateTime.Today.Month - StartDate?.Month);
                double? progressPercentage = totalMonths > 0 ? (passedMonths / (double)totalMonths) * 100 : 0;

                OrphanDto dto = new()
                {
                    Code = p.Code,
                    FullName = p.FullName,
                    NationalIdNumber = p.NationalIdNumber,
                    WhatsApp = p.WhatsApp,
                    MedicalCondition = p.MedicalCondition,
                    Residence = p.Residence,
                    DateOfBirth = p.DateOfBirth,
                    NumberOfSiblings = p.NumberOfSiblings,
                    OrphanType = p.OrphanType,
                    TotalFamilyMembers = p.TotalFamilyMembers,
                    GuardianRelation = p.GuardianRelation,
                    GuardianName = p.GuardianName,
                    Notes = p.Notes,
                    ImagePath = p.ImagePath,
                    Amount = p.Sponsorships?.Sum(s => s.Amount),
                    NumberOfSponsorShipMonths = totalMonths,
                    NumberOfRemainderSponsorShipMonths = passedMonths,
                    ProgressPercentage = progressPercentage == 0 ? 10 : progressPercentage


                };
                return dto;
            }).AsQueryable();
            QueryPageResult<OrphanDto> qpres = CommonMethods.GetPageResult(ListOfOrphans, orphanQueryParams);
            return qpres;

        }
        catch (Exception ex)
        {

            throw;
        }
    }
}