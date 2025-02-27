namespace Aytaam.Core.Helpers;

public static class StringHelper
{
    public static string? ConvertNumerals(this string? input, string Culture)
    {
        if (new string[] { "ar-lb", "ar-SA" }.Contains(Culture))
        {
            //return input.Replace('0', '\u06f0').Replace('1', '\u06f1') .Replace('2', '\u06f2')  .Replace('3', '\u06f3')   .Replace('4', '\u06f4') .Replace('5', '\u06f5').Replace('6', '\u06f6').Replace('7', '\u06f7').Replace('8', '\u06f8').Replace('9', '\u06f9');
            return input?
                .Replace('0', '٠')
                .Replace('1', '١')
                .Replace('2', '٢')
                .Replace('3', '٣')
                .Replace('4', '٤')
                .Replace('5', '٥')
                .Replace('6', '٦')
                .Replace('7', '٧')
                .Replace('8', '٨')
                .Replace('9', '٩');
        }
        else return input;
    }
}
