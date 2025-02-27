namespace Aytaam.Data.DbEntities;

public class UploadedFile
{
    [Key]
    public string? Id { get; set; }
    public string? FileName { get; set; }
    public string? Path { get; set; }
    public string? ContentType { get; set; }
    public string? EntityId { get; set; }
    public string? EntityType { get; set; }
}
