using Aytaam.Core.Dtos.Orphans;
using Aytaam.Core.ViewModels.Orphans;
using Aytaam.Infrastructure.Services.Orphans;

namespace Aytaam.Web.Areas.Admin.Controllers;
[Area("Admin")]
[Authorize("Admin")]
[Route("[area]/[controller]/[action]")]
[ApiExplorerSettings(IgnoreApi = true)]
public class OrphanController(IMapper mapper, UserManager<Account> userManager, ILogger<OrphanController> logger, IFileService fileService, IOrphanService orphanService) : BaseController<OrphanController>(mapper, userManager, logger)
{


    private readonly IFileService fileService = fileService;
    private readonly IOrphanService orphanService = orphanService;

    [ApiExplorerSettings(IgnoreApi = true)]
    public IActionResult Index()
    {
        return View(new OrphansIndexViewModel()
        {
            OrphanTypes = [.. EnumsHelper.GetListOrphanTypes().Select(X => new SelectListItem() { Text = X.Item2, Value = X.Item1.ToString() })],
            SponsorshipTypes = [.. EnumsHelper.GetListSponsorshipTypes().Select(X => new SelectListItem() { Text = X.Item2, Value = X.Item1.ToString() })],
            AgeGroups = [.. EnumsHelper.GetListAgeGroups().Select(X => new SelectListItem() { Text = X.Item2, Value = X.Item1.ToString() })],
        });
    }
    public IActionResult AddOrphan()
    {
        return View(new AddOrphanViewModel()
        {
            OrphanTypes = [.. EnumsHelper.GetListOrphanTypes().Select(X => new SelectListItem() { Text = X.Item2, Value = X.Item1.ToString() })],
            SponsorshipTypes = [.. EnumsHelper.GetListSponsorshipTypes().Select(X => new SelectListItem() { Text = X.Item2, Value = X.Item1.ToString() })],
            AgeGroups = [.. EnumsHelper.GetListAgeGroups().Select(X => new SelectListItem() { Text = X.Item2, Value = X.Item1.ToString() })],
        });
    }
    [HttpPost]
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<ActionResult> GetOrphansAsync(OrphanQueryDto query)
    {
        var draw = Request.Form["draw"].FirstOrDefault();
        int pageSize = Convert.ToInt32(Request.Form["length"].FirstOrDefault() ?? "0");
        int skip = Convert.ToInt32(Request.Form["start"].FirstOrDefault() ?? "0");
        query.GeneralSearch = Request.Form["search[Value]"].FirstOrDefault();
        var sortColIndex = Request.Form["order[0][column]"].FirstOrDefault();
        var sortDir = Request.Form[$"order[0][dir]"].FirstOrDefault();
        string? sortCol = Request.Form[$"columns[{sortColIndex}][data]"].FirstOrDefault();
        var data = (await orphanService.GetAllAsync(query)).AsQueryable();
        int totalOfRecord = await orphanService.GetCountAsync();
        int FilteredRecord = data.Count();

        if (!string.IsNullOrEmpty(sortCol) && !string.IsNullOrEmpty(sortDir))
            data = data.OrderBy(string.Concat(sortCol, " ", sortDir));

        data = data.Skip(skip).Take(pageSize);
        List<OrphanDto> orphans = [];
        foreach (var item in data)
        {
            var dto = _mapper.Map<OrphanDto>(item);
            orphans.Add(dto);
        }
        var dataTableObj = new
        {
            draw,
            recordsTotal = totalOfRecord,
            recordsFiltered = FilteredRecord,
            data = orphans.ToList()
        };
        return Ok(dataTableObj);
    }

    [HttpPost]
    public async Task<ActionResult> AddOrUpdateOrphanAsync([FromForm] InputOrphanDto orphanDto)
    {
        try
        {

            var orphan = await orphanService.GetAsync(orphanDto.Code);
            if (orphan == null)
            {
                var addedAccount = await orphanService.CreateAsync(orphanDto);
                return Ok(new JsonResponse<string>() { Status = 1, Data = addedAccount, Msg = "تم الإضافة بنجاح" });
            }
            else
            {
                await orphanService.UpdateAsync(orphanDto);
                return Ok(new JsonResponse<Orphan>() { Status = 1, Msg = "تم التعديل بنجاح" });
            }
        }
        catch (Exception ex)
        {

            return Ok(new JsonResponse<Orphan>() { Status = 0, Msg = ex.Message });
        }

    }

    [HttpPost]
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<ActionResult> RenderOrphanDetailsAsync([FromForm] string id)
    {
        OrphanDto item = new();
        if (id != null)
        {
            var user = await orphanService.GetAsync(id);
            if (user != null)
            {
                item = _mapper.Map<OrphanDto>(user);
            }
        }
        return PartialView("Partials/Account/OrphanDetails", item);
    }

    [HttpPost]
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<IActionResult> RenderAddOrUpdateOrphanAsync(string id)
    {

        var orphanDto = new InputOrphanDto();

        if (id != null)
        {
            orphanDto = await orphanService.GetAsync(id);
            if (orphanDto == null)
            {
                return NotFound();
            }
        }
        orphanDto.OrphanTypes = EnumsHelper.GetListOrphanTypes().Select(X => new SelectListItem() { Text = X.Item2, Value = X.Item1.ToString() }).ToList();
        return PartialView("Partials/Account/AddOrUpdateOrphan", orphanDto);
    }


}
