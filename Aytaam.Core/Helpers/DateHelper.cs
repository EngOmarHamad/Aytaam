namespace Aytaam.Core.Helpers;
public static class DateHelper
{

    private static readonly CultureInfo _culture = CultureInfo.CreateSpecificCulture("ar-SA");
    public static string? GetDayName(this DateTime? date) => date?.ToString("dddd");
    public static string? GetMonthName(this DateTime? date) => date?.ToString("MMMM");
    public static string? GetArabicDayName(this DateTime? date) => date?.ToString("dddd", _culture).ConvertNumerals(_culture.Name);
    public static string? GetArabicMonthName(this DateTime? date) => date?.ToString("MMMM", _culture).ConvertNumerals(_culture.Name);
    public static string? GetArabicDate(this DateTime? date, string format = "dddd dd,MMMM, yyyy") => date?.ToString(format, _culture).ConvertNumerals(_culture.Name);
    public static string? GetArabicDate(this DateTime? date) => date?.ToString("dddd dd,MMMM, yyyy", _culture).ConvertNumerals(_culture.Name);
    public static string? GetDate(this DateTime? date, CultureInfo culture, string format = "dddd dd,MMMM, yyyy") => date?.ToString(format, culture).ConvertNumerals(_culture.Name);
    public static string? GetPrettyDate(this DateTime date)
    {
        // 1.
        // Get time span elapsed since the date.
        TimeSpan s = DateTime.Now.Subtract(date);

        // 2.
        // Get total number of days elapsed.
        int dayDiff = (int)s.TotalDays;

        // 3.
        // Get total number of seconds elapsed.
        int secDiff = (int)s.TotalSeconds;

        // 4.
        // Don't allow out of range values.
        if (dayDiff is < 0 or >= 31)
        {
            return null;
        }

        // 5.
        // Handle same-day times.
        if (dayDiff == 0)
        {
            // A.
            // Less than one minute ago.
            if (secDiff < 60)
            {
                return " Just Now";
            }
            // B.
            // Less than 2 minutes ago.
            if (secDiff < 120)
            {
                return "Since One minute";
            }
            // C.
            // Less than one hour ago.
            if (secDiff < 3600)
            {
                return string.Format("few minutes ago",
                    Math.Floor((double)secDiff / 60));
            }
            // D.
            // Less than 2 hours ago.
            if (secDiff < 7200)
            {
                return "Since One Hour";
            }
            // E.
            // Less than one day ago.
            if (secDiff < 86400)
            {
                return string.Format("hours ago",
                    Math.Floor((double)secDiff / 3600));
            }
        }
        // 6.
        // Handle previous days.
        return dayDiff == 1
            ? "منذ أمس"
            : dayDiff < 7
            ? string.Format("days ago",
                dayDiff)
            : dayDiff < 31
            ? string.Format("weeks ago",
                Math.Ceiling((double)dayDiff / 7))
            : "";
    }
}
