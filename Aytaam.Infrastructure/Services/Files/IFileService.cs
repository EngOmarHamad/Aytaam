namespace Aytaam.Infrastructure.Services.Files;
public interface IFileService
{
    Task<List<UploadedFile>> GetAllAsync();
    Task<int> GetCountAsync();
    Task<UploadedFile?> GetAsync(string? id, string? type, string EntityId);
    Task<string> CreateAsync(IFormFile? NewFile, string FolderName, string? EntityId, string? EntityType);
    Task<string?> UpdateAsync(string? id, string folderName, IFormFile? NewFile, string EntityId, string EntityType);
    Task DeleteAsync(string id, string EntityId, string EntityType);
    Task<(string?, string?, string?)> UploadAsync(IFormFile? NewFile, string FolderName);

}
