namespace Aytaam.Core.Controllers;
[Route("[Controller]/[Action]")]
[ApiExplorerSettings(IgnoreApi = true)]

public class ErrorController : Controller
{
    private readonly ILogger<ErrorController> _logger;

    public ErrorController(ILogger<ErrorController> logger)
    {
        _logger = logger;
    }

    [Route("{statusCode}")]
    public IActionResult Index(int statusCode)
    {
        _logger.LogInformation($"Error:Status Code :{statusCode}");
        return statusCode switch
        {
            400 => View("Lockout"),
            401 => View("401"),
            403 => View("403"),
            404 => View("404"),
            500 => View("500"),
            _ => View("Index"),
        };
    }
}
