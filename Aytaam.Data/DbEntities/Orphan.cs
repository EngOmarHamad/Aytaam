namespace Aytaam.Data.DbEntities;
public class Orphan
{
    [Key]
    public string? Code { get; set; }
    public int? NationalIdNumber { get; set; }
    public string? FullName { get; set; } // الاسم الرباعي
    public DateTime? DateOfBirth { get; set; } // تاريخ الميلاد
    public string? Residence { get; set; } // السكن
    public string? MedicalCondition { get; set; } // الحالة الطبية
    public string? ImagePath { get; set; } = "/assets/media/svg/files/blank-image.svg"; // صورة شخصية
    public string? BirthCertificatePath { get; set; } // شهادة الميلاد
    public string? DeathCertificatePath { get; set; } // شهادة الوفاة
    public int? NumberOfSiblings { get; set; } // عدد الأخوة
    public int? TotalFamilyMembers { get; set; } // عدد الأفراد الكلي
    public string? GuardianCertificatePath { get; set; } // شهادة الوصي
    public string? GuardianRelation { get; set; } // صلة الوصي
    public string? GuardianName { get; set; } // اسم الوصي
    public string? Notes { get; set; } // ملاحظات
    public string? WhatsApp { get; set; }
    public OrphanType? OrphanType { get; set; }
    public virtual List<Sponsorship>? Sponsorships { get; set; }
}


/*[Key]
    [StringLength(20)] // Limit the length to a reasonable size
    public string? Code { get; set; }

    [Required]
    [Range(100000000, 999999999)] // Ensuring it's a valid 9-digit number
    public int? NationalIdNumber { get; set; }

    [Required]
    [StringLength(100)] // Reasonable length for a full name
    public string? FullName { get; set; } // الاسم الرباعي

    [Required]
    [DataType(DataType.Date)]
    public DateTime? DateOfBirth { get; set; } // تاريخ الميلاد

    [StringLength(200)]
    public string? Residence { get; set; } // السكن

    [StringLength(200)]
    public string? MedicalCondition { get; set; } // الحالة الطبية

    [StringLength(300)]
    public string? ImagePath { get; set; } = "/assets/media/svg/files/blank-image.svg"; // صورة شخصية

    [StringLength(300)]
    public string? BirthCertificatePath { get; set; } // شهادة الميلاد

    [StringLength(300)]
    public string? DeathCertificatePath { get; set; } // شهادة الوفاة

    [Range(0, 20)] // Restricting to a reasonable number
    public int? NumberOfSiblings { get; set; } // عدد الأخوة

    [Range(1, 30)] // Assuming reasonable family size
    public int? TotalFamilyMembers { get; set; } // عدد الأفراد الكلي

    [StringLength(300)]
    public string? GuardianCertificatePath { get; set; } // شهادة الوصي

    [StringLength(50)]
    public string? GuardianRelation { get; set; } // صلة الوصي

    [StringLength(100)]
    public string? GuardianName { get; set; } // اسم الوصي

    [StringLength(500)]
    public string? Notes { get; set; } // ملاحظات

    [StringLength(15)]
    [RegularExpression(@"^\+?\d{10,15}$", ErrorMessage = "Invalid phone number format.")]
    public string? WhatsApp { get; set; }

    public OrphanType? OrphanType { get; set; }

    public virtual List<Sponsorship>? Sponsorships { get; set; }
*/