namespace Aytaam.Data.DbEntities;
public class Sponsorship
{
    [Key]
    public string? Id { get; set; } = Guid.NewGuid().ToString();
    public DateTime? StartDate { get; set; } // تاريخ البداية
    public DateTime? EndDate { get; set; } // تاريخ النهاية
    public int? Duration { get; set; } // مدتها بالأشهر
    public decimal? Amount { get; set; } // المبلغ
    public string? SponsorName { get; set; } // اسم المتكفل
    public SponsorshipType? SponsorshipType { get; set; } // نوع الكفالة
    public int? RemainingPeriod { get; set; } // الفترة المتبقية بالأشهر
    public string? Notes { get; set; } // ملاحظات

    public string? OrphanCode { get; set; }
    [ForeignKey(nameof(OrphanCode))]
    public virtual Orphan Orphan { get; set; }
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow; // تاريخ الإنشاء
    public DateTime? UpdatedAt { get; set; } // تاريخ آخر تحديث
}
