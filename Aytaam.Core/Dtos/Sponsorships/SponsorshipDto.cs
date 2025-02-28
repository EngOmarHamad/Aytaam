namespace Aytaam.Core.Dtos.Sponsorships;

public class SponsorshipDto
{
    public string? Id { get; set; }
    public DateTime? StartDate { get; set; } // تاريخ البداية
    public DateTime? EndDate { get; set; } // تاريخ النهاية
    public int? Duration { get; set; } // مدتها بالأشهر
    public decimal? Amount { get; set; } // المبلغ
    public string? SponsorName { get; set; } // اسم المتكفل
    public SponsorshipType2? SponsorshipType { get; set; } // نوع الكفالة
    public int? RemainingPeriod { get; set; } // الفترة المتبقية بالأشهر
    public string? Notes { get; set; } // ملاحظات

    public string? OrphanCode { get; set; }
    public string? OrphanName { get; set; } // اسم اليتيم
}