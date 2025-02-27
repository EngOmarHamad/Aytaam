using System.ComponentModel;

namespace Aytaam.Core.Enums;

public enum SponsorshipType
{
    [Description("كلية")]
    Full,

    [Description("جزئية")]
    Partial,

    [Description("غير مكفول")]
    UnSponsored
}

