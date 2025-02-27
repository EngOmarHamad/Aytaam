namespace Aytaam.Core.CustomValidation;

public class CustomPhoneValidation : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is string phone)
        {
            var isNumeric = int.TryParse(phone, out _);
            var isPhoneValid = isNumeric && phone.Length == 10 && phone.StartsWith("05");
            if (isPhoneValid)
            {
                return ValidationResult.Success;
            }

            return new ValidationResult("");
        }

        return ValidationResult.Success;
    }
}
