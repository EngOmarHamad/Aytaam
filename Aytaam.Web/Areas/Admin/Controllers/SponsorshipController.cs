using Aytaam.Infrastructure.Services.Orphans;
using Aytaam.Web.Areas.Admin.Controllers;

namespace Aytaam.Core.Areas.Admin.Controllers;
[Area("Admin")]
[Route("[area]/[controller]/[action]")]
[Authorize("Admin")]
public class SponsorshipController : BaseController<SponsorshipController>
{
    private readonly IFileService _fileService;
    private readonly IOrphanService _orphanService;
    private readonly ISponsorshipService _SponsorshipService;
    private readonly IWebHostEnvironment _webHostEnvironment;


    public SponsorshipController(IFileService fileService,
                          ISponsorshipService SponsorshipService,
                          IWebHostEnvironment webHostEnvironment,
                          IMapper mapper,
                          UserManager<Account> userManager,
                          ILogger<SponsorshipController> logger,
                          IOrphanService orphanService) : base(mapper, userManager, logger)
    {
        _fileService = fileService;
        _SponsorshipService = SponsorshipService;
        _webHostEnvironment = webHostEnvironment;
        _orphanService = orphanService;
    }
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<ActionResult> IndexAsync()
    {
        try
        {
            return View(new SponsorshipsIndexViewModel()
            {
                OrphanNames = [.. (await _orphanService.ListAsync()).Select(o => new SelectListItem() { Text = o.Id, Value = o.Name })],
                SponsorshipTypes = [.. EnumsHelper.GetListSponsorshipTypes().Select(X => new SelectListItem() { Text = X.Item2, Value = X.Item1.ToString() })],
            });
        }
        catch (Exception)
        {

            throw;
        }

    }
    [HttpGet]
    public async Task<ActionResult> GetSponsorshipsAsync()
    {
        var data = (await _SponsorshipService.GetAllAsync()).AsQueryable();
        List<SponsorshipDto> Sponsorships = [];
        foreach (var item in data)
        {
            var dto = _mapper.Map<SponsorshipDto>(item);
            Sponsorships.Add(dto);
        }
        return Ok(new JsonResponse<List<SponsorshipDto>>() { Data = Sponsorships, Status = 1 });
    }
    [HttpPost]
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<ActionResult> GetSponsorshipsAsync(SponsorshipQueryDto query)
    {
        var draw = Request.Form["draw"].FirstOrDefault();
        int pageSize = Convert.ToInt32(Request.Form["length"].FirstOrDefault() ?? "0");
        int skip = Convert.ToInt32(Request.Form["start"].FirstOrDefault() ?? "0");
        query.GeneralSearch = Request.Form["search[Value]"].FirstOrDefault();
        var sortColIndex = Request.Form["order[0][column]"].FirstOrDefault();
        var sortDir = Request.Form[$"order[0][dir]"].FirstOrDefault();
        string? sortCol = Request.Form[$"columns[{sortColIndex}][data]"].FirstOrDefault();


        var data = (await _SponsorshipService.GetAllAsync(query)).AsQueryable();
        int totalOfRecord = await _SponsorshipService.GetCountAsync();
        int FilteredRecord = data.Count();

        if (!string.IsNullOrEmpty(sortCol) && !string.IsNullOrEmpty(sortDir))
            data = data.OrderBy(string.Concat(sortCol, " ", sortDir));

        data = data.Skip(skip).Take(pageSize);

        List<SponsorshipDto> Sponsorships = new();
        foreach (var item in data)
        {
            var dto = _mapper.Map<SponsorshipDto>(item);
            Sponsorships.Add(dto);
        }
        var dataTableObj = new
        {
            draw,
            recordsTotal = totalOfRecord,
            recordsFiltered = FilteredRecord,
            data = Sponsorships.ToList()
        };
        return Ok(dataTableObj);
    }
    [HttpPost]
    public async Task<ActionResult> AddOrUpdateSponsorshipAsync([FromForm] InputSponsorshipDto SponsorshipDto)
    {
        var Sponsorship = await _SponsorshipService.GetAsync(SponsorshipDto.Id);
        if (Sponsorship == null)
        {



            var SponsorshipAdd = new Sponsorship
            {
                Notes = SponsorshipDto.Notes,
                SponsorName = SponsorshipDto.SponsorName,
                EndDate = SponsorshipDto.EndDate,
                StartDate = SponsorshipDto.StartDate,
                Amount = SponsorshipDto.Amount,
                Duration = SponsorshipDto.Duration,

            };
            var addedSponsorship = await _SponsorshipService.CreateAsync(SponsorshipAdd);
            await _SponsorshipService.UpdateAsync(SponsorshipAdd);
            return Ok(new JsonResponse<string>() { Status = 1, Data = addedSponsorship, Msg = "تم الإضافة بنجاح" });
        }
        else
        {

            await _SponsorshipService.UpdateAsync(Sponsorship);
            return Ok(new JsonResponse<Sponsorship>() { Status = 1, Data = Sponsorship, Msg = "تم التعديل بنجاح" });
        }
    }
    [HttpPost]
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<ActionResult> RenderAddOrUpdateSponsorshipAsync([FromForm] string? id)
    {
        InputSponsorshipDto item = new();
        if (id is not null)
        {
            var Sponsorship = await _SponsorshipService.GetAsync(id);
            if (Sponsorship != null)
            {

                item = _mapper.Map<InputSponsorshipDto>(await _SponsorshipService.GetAsync(id));

            }
        }
        return PartialView("Partials/Sponsorship/AddOrUpdateSponsorship", item);
    }
    [HttpPost]
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<ActionResult> RenderSponsorshipDetailsAsync([FromForm] string? id)
    {
        if (id is not null)
        {
            var Sponsorship = await _SponsorshipService.GetAsync(id);
            if (Sponsorship != null)
            {
                SponsorshipDto item = _mapper.Map<SponsorshipDto>(await _SponsorshipService.GetAsync(id));

                return PartialView("Partials/Sponsorship/SponsorshipDetails", item);
            }
            else
            {
                return NotFound();
            }
        }
        else
        {
            return NotFound();
        }
    }
    [HttpPost]
    public async Task<ActionResult> DeleteSponsorshipAsync(string id)
    {
        try
        {
            var Sponsorship = await _SponsorshipService.GetAsync(id);
            if (Sponsorship != null)
            {

                await _SponsorshipService.DeleteAsync(id);
                return Ok(new JsonResponse<string>() { Data = id, Msg = "تم حذف الكفالة بنجاح", Status = 1 });
            }

            return NotFound();
        }
        catch (Exception ex)
        {
            return Ok(new JsonResponse<string>() { Data = id, Msg = ex.Message, Status = 0 });
        }
    }
    [HttpPost]
    public async Task<ActionResult> DeleteMultiSponsorshipAsync(List<string> ids)
    {
        try
        {
            List<string?> SuccessDeletedSponsorships = [];
            foreach (var item in ids)
            {
                Sponsorship? Sponsorship = await _SponsorshipService.GetAsync(item);
                if (Sponsorship != null)
                {
                    await _SponsorshipService.DeleteAsync(item);
                    SuccessDeletedSponsorships.Add(Sponsorship.SponsorName);
                }
            }
            return Ok(new JsonResponse<List<string?>>() { Data = SuccessDeletedSponsorships, Msg = "تم حذف الكتب بنجاح", Status = 1 });
        }
        catch (Exception ex)
        {
            return Ok(new JsonResponse<int>() { Msg = ex.Message, Status = 0 });
        }
    }


}
