using System.ComponentModel;

namespace Aytaam.Core.Enums
{
    public enum AgeGroup
    {
        [Description("من 0 إلى 5 سنوات")]
        Age_0_5 = 1,

        [Description("من 6 إلى 10 سنوات")]
        Age_6_10 = 2,

        [Description("من 11 إلى 15 سنة")]
        Age_11_15 = 3,

        [Description("من 16 إلى 18 سنة")]
        Age_16_18 = 4
    }

}
