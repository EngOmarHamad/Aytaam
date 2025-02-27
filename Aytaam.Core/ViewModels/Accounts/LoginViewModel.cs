namespace Aytaam.Core.ViewModels.Accounts;

public class LoginViewModel
{
    [Required(ErrorMessage = "!البريد الإلكتروني الخاص بك مطلوب")]
    [Display(Name = "البريد الإلكتروني")]
    [EmailAddress(ErrorMessage = "يرجى إدخال عنوان بريد إلكتروني صالح")]
    public string Email { get; set; }

    [Required(ErrorMessage = "! كلمة المرور الخاصة بك مطلوبة")]
    [Display(Name = "كلمة المرور")]
    [DataType(DataType.Password)]
    [StringLength(100, ErrorMessage = "استخدم 6 أحرف أو أكثر مع مزيج من الأحرف والأرقام والرموز", MinimumLength = 6)]
    public string Password { get; set; }
    public bool RememberMe { get; set; }
}
