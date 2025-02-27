using System.ComponentModel;

public enum OrphanType
{
    [Description("يتيم الأب")]
    FatherlessOrphan,

    [Description("يتيم الأم")]
    MotherlessOrphan,

    [Description("يتيم الأبوين")]
    OrphanofBothParents
}
