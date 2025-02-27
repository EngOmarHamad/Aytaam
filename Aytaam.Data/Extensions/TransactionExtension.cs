namespace Aytaam.Data.Extensions;
public static class TransactionExtension
{
    public static async Task UseTransactionAsync(this AytaamDbContext context, Func<Task> func)
    {
        var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            await func();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
