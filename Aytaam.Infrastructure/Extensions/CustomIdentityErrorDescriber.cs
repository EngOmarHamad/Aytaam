namespace Aytaam.Infrastructure.Extensions;

public class CustomIdentityErrorDescriber : IdentityErrorDescriber
{
    public override IdentityError DefaultError() { return new IdentityError { Code = nameof(DefaultError), Description = $"حدث فشل غير معروف." }; }
    public override IdentityError ConcurrencyFailure() { return new IdentityError { Code = nameof(ConcurrencyFailure), Description = "فشل متزامن متفائل، تم تعديل الكائن." }; }
    public override IdentityError PasswordMismatch() { return new IdentityError { Code = nameof(PasswordMismatch), Description = "كلمة مرور غير صحيحة." }; }
    public override IdentityError InvalidToken() { return new IdentityError { Code = nameof(InvalidToken), Description = "رمز غير صالح." }; }
    public override IdentityError LoginAlreadyAssociated() { return new IdentityError { Code = nameof(LoginAlreadyAssociated), Description = "يوجد بالفعل مستخدم لديه تسجيل الدخول هذا." }; }
    public override IdentityError InvalidUserName(string? userName) { return new IdentityError { Code = nameof(InvalidUserName), Description = $"اسم المستخدم «{userName}» غير صالح، ويمكن أن يحتوي فقط على أحرف أو أرقام." }; }
    public override IdentityError InvalidEmail(string? email) { return new IdentityError { Code = nameof(InvalidEmail), Description = $"البريد الإلكتروني '{email}' غير صالح." }; }
    public override IdentityError DuplicateUserName(string userName) { return new IdentityError { Code = nameof(DuplicateUserName), Description = $"تم أخذ اسم المستخدم «{userName}» بالفعل." }; }
    public override IdentityError DuplicateEmail(string email) { return new IdentityError { Code = nameof(DuplicateEmail), Description = $"تم أخذ البريد الإلكتروني «{email}» بالفعل." }; }
    public override IdentityError InvalidRoleName(string? role) { return new IdentityError { Code = nameof(InvalidRoleName), Description = $"اسم الدور «{role}» باطل." }; }
    public override IdentityError DuplicateRoleName(string role) { return new IdentityError { Code = nameof(DuplicateRoleName), Description = $"تم أخذ اسم الدور «{role}» بالفعل." }; }
    public override IdentityError UserAlreadyHasPassword() { return new IdentityError { Code = nameof(UserAlreadyHasPassword), Description = "المستخدم لديه بالفعل مجموعة كلمات مرور." }; }
    public override IdentityError UserLockoutNotEnabled() { return new IdentityError { Code = nameof(UserLockoutNotEnabled), Description = "الإغلاق غير مُمكن لهذا المستخدم." }; }
    public override IdentityError UserAlreadyInRole(string role) { return new IdentityError { Code = nameof(UserAlreadyInRole), Description = $"المستخدم بالفعل في الدور '{role}'." }; }
    public override IdentityError UserNotInRole(string role) { return new IdentityError { Code = nameof(UserNotInRole), Description = $"المستخدم ليس في الدور '{role}'." }; }
    public override IdentityError PasswordTooShort(int length) { return new IdentityError { Code = nameof(PasswordTooShort), Description = $"يجب أن تكون كلمات المرور على الأقل أحرف {length}." }; }
    public override IdentityError PasswordRequiresNonAlphanumeric() { return new IdentityError { Code = nameof(PasswordRequiresNonAlphanumeric), Description = "يجب أن تحتوي كلمات المرور حرف خاص واحد على الأقل." }; }
    public override IdentityError PasswordRequiresDigit() { return new IdentityError { Code = nameof(PasswordRequiresDigit), Description = "يجب أن تحتوي كلمات المرور على رقم واحد على الأقل 0 - 9)." }; }
    public override IdentityError PasswordRequiresLower() { return new IdentityError { Code = nameof(PasswordRequiresLower), Description = "يجب أن تحتوي كلمات المرور على حرف صغير واحد على الأقل ('a' - 'z')." }; }
    public override IdentityError PasswordRequiresUpper() { return new IdentityError { Code = nameof(PasswordRequiresUpper), Description = "يجب أن تحتوي كلمات المرور على حرف كبير واحد على الأقل ('A' - 'Z'). " }; }

}
