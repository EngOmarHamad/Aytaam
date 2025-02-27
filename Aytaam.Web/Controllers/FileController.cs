namespace Aytaam.Web.Controllers;

[Route("[controller]/[action]")]
public class FileController : Controller
{
    private readonly IFileService _fileService;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public FileController(IFileService fileService, IWebHostEnvironment webHostEnvironment)
    {
        _fileService = fileService;
        _webHostEnvironment = webHostEnvironment;
    }
    [HttpPost]
    public async Task<IActionResult> UploadAsync([FromForm] UploadFileDto uploadFileDto)
    {
        if (uploadFileDto.IsUpdate)
        {
            return Ok(new JsonResponse<string?>() { Data = await _fileService.UpdateAsync(uploadFileDto.UploadedFileId, uploadFileDto.FolderName, uploadFileDto.File, uploadFileDto.Entityid, uploadFileDto.Entityname), Msg = "success", Status = 1 });
        }
        else
        {
            return Ok(new JsonResponse<string>() { Data = await _fileService.CreateAsync(uploadFileDto.File, uploadFileDto.FolderName, uploadFileDto.Entityid, uploadFileDto.Entityname), Msg = "success", Status = 1 });
        }
    }
    [HttpPost]
    public async Task<IActionResult> UploadOrphanImageAsync([FromForm] UploadOrphanImageDto uploadOrphanImageDto)
    {
        return Ok(new JsonResponse<string>() { Data = (await _fileService.UploadAsync(uploadOrphanImageDto.File, uploadOrphanImageDto.FolderName)).Item1, Msg = "success", Status = 1 });
    }

    public async Task<IActionResult> DownLoadFileAsync([FromForm] DownLoadFileDto downLoadFileDto)
    {
        UploadedFile? file = await _fileService.GetAsync(downLoadFileDto.UploadedFileId, downLoadFileDto.Entityname, downLoadFileDto.Entityid);

        if (file is null || file.Path is null) return NotFound();

        var path = _webHostEnvironment.WebRootPath + file.Path;
        try
        {
            FileStream stream = new(path, FileMode.Open);
            return File(stream, "application/octet-stream", file.FileName);
        }
        catch (Exception)
        {
            return NotFound();
        }
    }
}
public class UploadOrphanImageDto
{
    public IFormFile File { get; set; }
    public string FolderName { get; set; }
}
public class UploadFileDto : UploadOrphanImageDto
{
    public string Entityname { get; set; }
    public string Entityid { get; set; }
    public bool IsUpdate { get; set; }
    public string UploadedFileId { get; set; }
}
public class DownLoadFileDto
{
    public string Entityname { get; set; }

    public string Entityid { get; set; }
    public bool IsUpdate { get; set; }
    public string UploadedFileId { get; set; }
}