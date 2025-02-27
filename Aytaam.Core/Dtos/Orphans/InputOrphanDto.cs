namespace Aytaam.Core.Dtos.Orphans
{
    public class InputOrphanDto
    {
        [Key]
        public string? Code { get; set; } = "";
        public int? NationalIdNumber { get; set; }

        [Display(Name = "الاسم كامل")]
        public string? FullName { get; set; }
        public string? WhatsApp { get; set; }
        public DateTime? DateOfBirth { get; set; } // تاريخ الميلاد
        public string? Residence { get; set; } // السكن
        public string? MedicalCondition { get; set; } // الحالة الطبية
        public string? ImagePath { get; set; } = "/assets/media/svg/files/blank-image.svg"; // صورة شخصية
        public IFormFile? Image { get; set; }
        public string? BirthCertificatePath { get; set; } // شهادة الميلاد
        public IFormFile? BirthCertificate { get; set; }
        public string? DeathCertificatePath { get; set; } // شهادة الوفاة
        public IFormFile? DeathCertificate { get; set; }
        public int? NumberOfSiblings { get; set; } // عدد الأخوة
        public int? TotalFamilyMembers { get; set; } // عدد الأفراد الكلي
        public string? GuardianCertificatePath { get; set; } // شهادة الوصي
        public IFormFile? GuardianCertificate { get; set; }

        public string? GuardianRelation { get; set; } // صلة الوصي
        public string? GuardianName { get; set; } // اسم الوصي
        public string? Notes { get; set; } // ملاحظات
        public OrphanType OrphanType { get; set; }
        public SponsorshipType SponsorshipType { get; set; }
        public List<SelectListItem> OrphanTypes { get; set; }
    }
}
