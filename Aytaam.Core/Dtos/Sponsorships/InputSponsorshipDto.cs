namespace Aytaam.Core.Dtos.Sponsorships;

public class InputSponsorshipDto

{
    public string? Id { get; set; }
    [Display(Name = "تاريخ البداية")]
    public DateTime? StartDate { get; set; }

    [Display(Name = "تاريخ النهاية")]
    public DateTime? EndDate { get; set; }

    [Display(Name = "مدة الكفالة (بالأشهر)")]
    public int? Duration { get; set; }

    [Display(Name = "المبلغ")]
    public decimal? Amount { get; set; }

    [Display(Name = "اسم المتكفل")]
    public string? SponsorName { get; set; }

    [Display(Name = "نوع الكفالة")]
    public SponsorshipType? SponsorshipType { get; set; }

    [Display(Name = "الفترة المتبقية (بالأشهر)")]
    public int? RemainingPeriod { get; set; }

    [Display(Name = "ملاحظات")]
    public string? Notes { get; set; }

    [Display(Name = "اليتيم")]
    public string? OrphanCode { get; set; }

    [Display(Name = "اسم اليتيم")]
    public string? OrphanName { get; set; }

    public SelectList? Orphans { get; set; }
    public SelectList? SponsorshipTypes { get; set; }
}
