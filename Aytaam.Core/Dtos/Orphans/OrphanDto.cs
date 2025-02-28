namespace Aytaam.Core.Dtos.Orphans
{
    public class OrphanDto
    {
        [Key]
        public string? Code { get; set; }
        public int? NationalIdNumber { get; set; }

        [Display(Name = "الاسم كامل")]
        public string? FullName { get; set; }
        public string? WhatsApp { get; set; }
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
        public OrphanType? OrphanType { get; set; }
        public SponsorshipType SponsorshipType { get; set; }
        public decimal? Amount { get; set; }
        public double? ProgressPercentage { get; set; }
        public int? NumberOfSponsorShipMonths { get; set; }
        public int? NumberOfRemainderSponsorShipMonths { get; set; }
    }
}
