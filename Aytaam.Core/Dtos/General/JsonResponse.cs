namespace Aytaam.Core.Dtos.General;

public class JsonResponse<T>
{
    public int Status { get; set; }
    public string? Msg { get; set; }
    public T? Data { get; set; }
}
