namespace Aytaam.Infrastructure.Services.Files;
public class FileService : IFileService
{
    private readonly IWebHostEnvironment _webHostEnvironment;
    private readonly AytaamDbContext _db;
    private static decimal _fileNumber = 1;
    public FileService(IWebHostEnvironment webHostEnvironment, AytaamDbContext db)
    {
        _webHostEnvironment = webHostEnvironment;
        _db = db;
    }
    private void Delete(string? FilePath)
    {
        string path = _webHostEnvironment.WebRootPath + FilePath;
        if (File.Exists(path) && !path.Contains("blank-image")) File.Delete(path);
    }
    public async Task<string?> UpdateAsync(string? id, string folderName, IFormFile? NewFile, string EntityId, string EntityType)
    {
        UploadedFile? uploadedFile = await GetAsync(id, EntityType, EntityId);
        if (NewFile is null)
        {
            return id;
        }
        if (uploadedFile != null)
        {
            // DeleteAsync(uploadedFile.Path);
            var file = await UploadAsync(NewFile, folderName);
            if (file.Item1 is not null)
            {
                uploadedFile.FileName = file.Item2;
                uploadedFile.ContentType = file.Item3;
                uploadedFile.EntityId = uploadedFile.EntityId;
                uploadedFile.EntityType = uploadedFile.EntityType;
                uploadedFile.Path = file.Item1;
                _db.TblUploadedFiles.Update(uploadedFile);
                await _db.SaveChangesAsync();
                return uploadedFile.Id;
            }
            return uploadedFile.Id;
        }
        return "";
    }
    public async Task<string> CreateAsync(IFormFile? NewFile, string FolderName, string? EntityId, string? EntityType)
    {
        var path = await UploadAsync(NewFile, FolderName);
        UploadedFile entity = new()
        {
            Path = path.Item1,
            ContentType = path.Item3,
            FileName = path.Item2,
            EntityId = EntityId,
            EntityType = EntityType
        };
        if (entity is not null)
        {
            await _db.AddAsync(entity);
            await _db.SaveChangesAsync();
            return entity.Id;
        }
        return "";
    }
    public async Task<(string?, string?, string?)> UploadAsync(IFormFile? NewFile, string FolderName)
    {
        if (NewFile is not null)
        {
            _fileNumber++;
            string path = _webHostEnvironment.WebRootPath + "\\" + FolderName;
            var ContentType = Path.GetExtension(NewFile.FileName);
            // string fileName = Guid.NewGuid().ToString() + "-" + Path.GetFileNameWithoutExtension(NewFile.FileName) + Path.GetExtension(NewFile.FileName);
            string fileName = _fileNumber + "-" + Guid.NewGuid().ToString() + ContentType;
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            using FileStream fileStream = new(Path.Combine(path, fileName), FileMode.Create);
            await NewFile.CopyToAsync(fileStream);
            await fileStream.FlushAsync();
            fileStream.Close();

            return ("\\" + Path.Combine(FolderName, fileName), NewFile.FileName, ContentType);
        }
        return (null, null, null);
    }

    public Task<int> GetCountAsync() => _db.TblUploadedFiles.CountAsync();
    public async Task<List<UploadedFile>> GetAllAsync()
    {
        var dbQuery = _db.TblUploadedFiles.AsQueryable();
        return await dbQuery.ToListAsync();
    }
    public async Task<UploadedFile?> GetAsync(string? id, string? type, string EntityId) => await _db.TblUploadedFiles.SingleOrDefaultAsync(x => x.Id == id && x.EntityType == type && x.EntityId == EntityId);
    public async Task DeleteAsync(string id, string EntityId, string EntityType)
    {
        var uploaded = await GetAsync(id, EntityType, EntityId) ?? throw new();
        _db.TblUploadedFiles.Remove(uploaded);
        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DBConcurrencyException ex)
        {
            throw ex;
        }
    }


}