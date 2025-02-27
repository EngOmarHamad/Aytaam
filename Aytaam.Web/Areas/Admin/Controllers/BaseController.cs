namespace Aytaam.Web.Areas.Admin.Controllers;

public class BaseController<T>(IMapper mapper, UserManager<Account> userManager, ILogger<T> logger) : Controller where T : BaseController<T>
{
    protected readonly ILogger<T> _logger = logger;
    protected readonly IMapper _mapper = mapper;
}