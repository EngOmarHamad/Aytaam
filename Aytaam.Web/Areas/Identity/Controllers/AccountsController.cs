namespace Aytaam.Web.Areas.Identity.Controllers;

[Area("Identity")]
[Route("[area]/[controller]/[action]")]
[ApiExplorerSettings(IgnoreApi = true)]
public class AccountsController : Controller
{
    private readonly SignInManager<Account> _signInManager;
    private readonly ILogger<AccountsController> _logger;
    private readonly UserManager<Account> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly AytaamDbContext _dbContext;
    private int NoAttempt { get; set; }
    public AccountsController(SignInManager<Account> signInManager, ILogger<AccountsController> logger, UserManager<Account> userManager, IHttpContextAccessor httpContextAccessor, AytaamDbContext dbContext)
    {
        _signInManager = signInManager;
        NoAttempt = _signInManager.Options.Lockout.MaxFailedAccessAttempts;
        _logger = logger;
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
        _dbContext = dbContext;
    }
    public IActionResult Index()
    {
        return View();
    }

    [HttpGet]
    public IActionResult Login()
    {
        return View();
    }
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> LoginAsync(LoginViewModel model)
    {
        if (ModelState.IsValid)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                _logger.LogInformation($"{model.Email} isn't connected to an User and trying to log in !");
                ModelState.AddModelError("model.Email", "البريد الإلكتروني الذي أدخلته غير متصل بحساب");
                return View(model);
            }

            var signinResult = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, true);
            if (signinResult.Succeeded)
            {
                _logger.LogInformation($"User {model.Email} logged in.");
                return LocalRedirect("/");
            }
            else if (signinResult.IsLockedOut)
            {
                _logger.LogInformation($"المستخدم {model.Email} مغلق");
                return RedirectToAction("Lockout");
            }
            else if (signinResult.IsNotAllowed)
            {
                if (!await _userManager.IsEmailConfirmedAsync(user))
                {
                    _logger.LogInformation($"User {model.Email} trying to log in but email isn't confirmed");
                    ModelState.AddModelError("model.Email", "لم يتم تأكيد البريد الإلكتروني!");
                }
            }
            else if (signinResult.RequiresTwoFactor)
            {
                _logger.LogInformation($"User {model.Email} trying to log in but 2FA is required");
                ModelState.AddModelError("model.Email", "2FA required");
            }
            else
            {
                if (user != null)
                {
                    NoAttempt--;
                    ModelState.AddModelError("InputModelLog.Password", $"كلمة سر خاطئة! لديك {NoAttempt} لإعادة المحاولة قبل الإغلاق!");
                }
            }
        }

        return View(model);
    }
    public async Task<IActionResult> LogoutAsync()
    {
        await _signInManager.SignOutAsync();
        _logger.LogInformation("User logged out.");
        return RedirectToAction("Index", "Home");
    }

}
