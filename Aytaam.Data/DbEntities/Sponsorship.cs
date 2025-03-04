using System.Text.Json.Serialization;

namespace Aytaam.Data.DbEntities;
public class Sponsorship
{
    [Key]
    public string? Id { get; set; } = Guid.NewGuid().ToString();
    public DateTime? StartDate { get; set; } // تاريخ البداية
    public DateTime? EndDate { get; set; } // تاريخ النهاية
    public decimal? Amount { get; set; } // المبلغ
    public string? SponsorName { get; set; } // اسم المتكفل
    public SponsorshipType2? SponsorshipType { get; set; } // نوع الكفالة
    public string? Notes { get; set; } // ملاحظات

    public string? OrphanCode { get; set; }
    [ForeignKey(nameof(OrphanCode))]
    [JsonIgnore]
    public Orphan Orphan { get; set; }
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow; // تاريخ الإنشاء
    public DateTime? UpdatedAt { get; set; } // تاريخ آخر تحديث
}
/*


    [Key]
    [StringLength(36)] // Guid length
    public string? Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [DataType(DataType.Date)]
    public DateTime? StartDate { get; set; } // تاريخ البداية

    [DataType(DataType.Date)]
    public DateTime? EndDate { get; set; } // تاريخ النهاية

    [Required]
    [Range(10, 10000, ErrorMessage = "Amount must be between 10 and 10,000.")]
    [Column(TypeName = "decimal(18,2)")]
    public decimal? Amount { get; set; } // المبلغ

    [Required]
    [StringLength(100, ErrorMessage = "Sponsor name cannot exceed 100 characters.")]
    public string? SponsorName { get; set; } // اسم المتكفل

    [Required]
    public SponsorshipType2? SponsorshipType { get; set; } // نوع الكفالة

    [StringLength(500)]
    public string? Notes { get; set; } // ملاحظات

    [Required]
    [StringLength(20)]
    public string? OrphanCode { get; set; } // Orphan reference

    [ForeignKey(nameof(OrphanCode))]
    [JsonIgnore]
    public virtual Orphan Orphan { get; set; }

    [Required]
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow; // تاريخ الإنشاء

    public DateTime? UpdatedAt { get; set; } // تاريخ آخر تحديث
*/