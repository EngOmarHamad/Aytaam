namespace Aytaam.Web.Controllers;
[Route("[controller]/[action]")]

public class SponsorshipsController : Controller
{
    private readonly ISponsorshipService _SponsorshipService;
    private readonly IFileService _fileService;
    private readonly IWebHostEnvironment _webHostEnvironment;

    private readonly IMapper _mapper;

    public SponsorshipsController(ISponsorshipService SponsorshipService, IFileService fileService, IMapper mapper, IWebHostEnvironment webHostEnvironment)
    {
        _SponsorshipService = SponsorshipService;
        _fileService = fileService;
        _mapper = mapper;
        _webHostEnvironment = webHostEnvironment;
    }
    [HttpPost]
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<ActionResult> RenderShareSponsorshipAsync([FromForm] string? id)
    {
        if (id is not null)
        {
            var Sponsorship = await _SponsorshipService.GetAsync(id);
            if (Sponsorship != null)
            {
                return PartialView("Partials/Share", new ShareViewModel() { Link = Request.Scheme + "://" + Request.Host + "/Sponsorships/DownLoadSponsorship/" + id, Title = Sponsorship.SponsorName });
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
    // GET: SponsorshipsController
    [HttpGet]
    public async Task<IActionResult> GetMoreSponsorshipsAsync([FromQuery] int currentIndex, int elementsNumber = 12)
    {
        var data = (await _SponsorshipService.GetAllAsync()).Skip(currentIndex * elementsNumber).Take(elementsNumber).ToList();
        List<SponsorshipDto> Sponsorships = [];
        var dtos = _mapper.Map<List<SponsorshipDto>>(data);
        return Ok(dtos);
    }
    [ApiExplorerSettings(IgnoreApi = true)]
    public IActionResult Index()
    {
        return View();
    }

    // GET: SponsorshipsController/DetailsAsync/5
    [ApiExplorerSettings(IgnoreApi = true)]
    public ActionResult Details(int id)
    {
        return View();
    }
    // GET: SponsorshipsController/DetailsAsync/5
    [ApiExplorerSettings(IgnoreApi = true)]
    public ActionResult Search(string SponsorshipTitle)
    {
        ViewBag.GeneralSearch = SponsorshipTitle;
        return View();
    }
    [HttpGet]
    public async Task<ActionResult> SearchSponsorshipsAsync(string SponsorshipTitle, int currentIndex, int elementsNumber = 12)
    {
        var data = (await _SponsorshipService.GetAllAsync(new SponsorshipQueryDto() { GeneralSearch = SponsorshipTitle })).Skip(currentIndex * elementsNumber).Take(elementsNumber);
        List<SponsorshipDto> Sponsorships = new();
        foreach (var item in data)
        {
            var dto = _mapper.Map<SponsorshipDto>(item);
            Sponsorships.Add(dto);
        }
        return Ok(Sponsorships);

    }
}
