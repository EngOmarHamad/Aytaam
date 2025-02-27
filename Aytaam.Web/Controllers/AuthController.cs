namespace Aytaam.Web.Controllers;
public class AuthController : Controller
{
    private readonly UserManager<Account> _userManager;
    private readonly SignInManager<Account> _signInManager;
    private readonly ILogger<AuthController> _logger;
    private readonly IConfiguration _configuration;

    public AuthController(UserManager<Account> userManager, SignInManager<Account> signInManager, ILogger<AuthController> logger, IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _logger = logger;
        _configuration = configuration;
    }

    [HttpPost("/Api/Login")]
    public async Task<IActionResult> Signup([FromBody] LoginViewModel loginDto)
    {
        if (ModelState.IsValid)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user is null)
            {
                return Ok(new JsonResponse<LoginResponse>()
                {
                    Status = 0,
                    Msg = "المستخدم غير موجود"
                });
            }
            var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, false, false);
            if (result.Succeeded)
            {
                _logger.LogInformation("User logged in.");
                return Ok(new JsonResponse<LoginResponse>()
                {
                    Data = new LoginResponse()
                    {
                        Token = GenerateJwtToken(user, new List<Claim>()),
                        Email = user.Email,
                        Id = user.Id,
                        Name = user.FullName
                    },
                    Status = 1,
                });
            }
            else
            {
                return Ok(new JsonResponse<LoginResponse>()
                {
                    Msg = "محاولة تسجيل دخول غير معروفة",
                    Status = 0,
                });
            }
        }
        return Ok((new JsonResponse<LoginResponse>()
        {
            Msg = "يرجى إدخال الحقول المطلوبة",
            Status = 0,
        }));
    }


    private string GenerateJwtToken(Account user, List<Claim> claims)
    {
        claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));
        claims.Add(new Claim(JwtRegisteredClaimNames.Sub, user.Email));
        claims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expired = DateTime.Now.AddHours(10).AddHours(Convert.ToDouble(_configuration["Jwt:Expire"]));
        var token = new JwtSecurityToken(_configuration["Jwt:Issuer"], _configuration["Jwt:Audience"], claims, expires: expired, signingCredentials: cred);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
