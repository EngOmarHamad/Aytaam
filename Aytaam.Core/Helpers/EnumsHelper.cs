using System.ComponentModel;
using System.Reflection;
namespace Aytaam.Core.Helpers;
public static class EnumsHelper
{

    public static List<(int, string)> GetListOrphanTypes()
    {
        Array enumvalues = Enum.GetValues<OrphanType>();
        List<(int, string)> values = [];
        foreach (var userType in enumvalues)
        {
            values.Add(((int)userType, GetDescription(userType, "")));
        }
        return values;
    }
    public static List<(int, string)> GetListAgeGroups()
    {
        Array enumvalues = Enum.GetValues<AgeGroup>();
        List<(int, string)> values = [];
        foreach (var userType in enumvalues)
        {
            values.Add(((int)userType, GetDescription(userType, "")));
        }
        return values;
    }
    public static List<(int, string)> GetListSponsorshipTypes()
    {
        Array enumvalues = Enum.GetValues<SponsorshipType>();
        List<(int, string)> values = [];
        foreach (var userType in enumvalues)
        {
            values.Add(((int)userType, GetDescription(userType, "")));
        }
        return values;
    }
    public static string GetDescription(object enumValue, string defDesc)
    {
        FieldInfo? fi = enumValue.GetType().GetField(enumValue.ToString());

        if (null != fi)
        {
            object[] attrs = fi.GetCustomAttributes(typeof(DescriptionAttribute), true);
            if (attrs != null && attrs.Length > 0)
                return ((DescriptionAttribute)attrs[0]).Description;
        }

        return defDesc;
    }
}
