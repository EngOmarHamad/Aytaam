namespace Aytaam.Core.ViewModels;

public class AppToolBarViewModel
{
    public string? Title { get; set; }
    public List<Link>? BreadcrumbLinks { get; set; }
}

public class Link
{
    public string? Url { get; set; }
    public string? Title { get; set; }

}
