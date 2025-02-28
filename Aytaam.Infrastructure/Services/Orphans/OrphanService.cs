using Aytaam.Core.Constants;
using Aytaam.Core.Dtos.Orphans;

namespace Aytaam.Infrastructure.Services.Orphans;
public class OrphanService(AytaamDbContext db, IMapper mapper, IFileService fileService) : IOrphanService
{
    private readonly AytaamDbContext _db = db;
    private readonly IMapper _mapper = mapper;
    private readonly IFileService _fileService = fileService;

    public async Task<int> GetCountAsync() => await _db.TblOrphans.CountAsync();

    public async Task<List<Orphan>> GetAllAsync() => await _db.TblOrphans.ToListAsync();
    public async Task<List<Orphan>> GetAllAsync(OrphanQueryDto query)
    {
        var dbQuery = _db.TblOrphans.AsQueryable();
        if (!string.IsNullOrWhiteSpace(query.GeneralSearch))
        {
            dbQuery = dbQuery.Where(p =>
                   (p.NationalIdNumber != null && p.NationalIdNumber.ToString().ToLower().Trim().Contains(query.GeneralSearch.ToLower().Trim())) ||
                      (p.Code != null && p.Code.ToString().ToLower().Trim().Contains(query.GeneralSearch.ToLower().Trim())) ||
                           (p.FullName != null && p.FullName.ToLower().Trim().Contains(query.GeneralSearch.ToLower().Trim())
                   ));
        }
        if (query.OrphanType != null)
        {
            dbQuery = dbQuery.Where(x => x.OrphanType != null && x.OrphanType == query.OrphanType);
        }


        if (query.AgeGroup != null)

        {
            DateTime today = DateTime.Today;
            dbQuery = query.AgeGroup switch
            {
                AgeGroup.Age_0_5 => dbQuery.Where(x => EF.Functions.DateDiffYear(x.DateOfBirth, today) >= 0 &&
                                                       EF.Functions.DateDiffYear(x.DateOfBirth, today) <= 5),
                AgeGroup.Age_6_10 => dbQuery.Where(x => EF.Functions.DateDiffYear(x.DateOfBirth, today) >= 6 &&
                                                        EF.Functions.DateDiffYear(x.DateOfBirth, today) <= 10),
                AgeGroup.Age_11_15 => dbQuery.Where(x => EF.Functions.DateDiffYear(x.DateOfBirth, today) >= 11 &&
                                                         EF.Functions.DateDiffYear(x.DateOfBirth, today) <= 15),
                AgeGroup.Age_16_18 => dbQuery.Where(x => EF.Functions.DateDiffYear(x.DateOfBirth, today) >= 16 &&
                                                         EF.Functions.DateDiffYear(x.DateOfBirth, today) <= 18),
                _ => dbQuery
            };
        }

        return await dbQuery.ToListAsync();
    }

    public async Task<InputOrphanDto> GetAsync(string code)
    {
        var user = await _db.TblOrphans.SingleOrDefaultAsync(x => x.Code == code);
        return user == null ? null : _mapper.Map<InputOrphanDto>(user);
    }
    public static int? CalculateAge(DateTime? dateOfBirth)
    {
        var today = DateTime.Today;
        var age = today.Year - dateOfBirth?.Year ?? 0;

        // التحقق مما إذا كان عيد الميلاد قد مر خلال هذه السنة أم لا
        if (dateOfBirth?.Date > today.AddYears(-age))
        {
            age--;
        }

        return age;
    }
    public async Task<OrphanDto?> GetOrphanAsync(string code)
    {
        var user = await _db.TblOrphans.SingleOrDefaultAsync(x => x.Code == code);
        if (user is not null)
        {
            var EndDate = user.Sponsorships?.OrderByDescending(x => x.CreatedAt).FirstOrDefault()?.EndDate;
            var StartDate = user.Sponsorships?.OrderByDescending(x => x.CreatedAt).FirstOrDefault()?.StartDate;
            int? totalMonths = ((EndDate?.Year - StartDate?.Year) * 12) + (EndDate?.Month - StartDate?.Month);
            int? passedMonths = ((DateTime.Today.Year - StartDate?.Year) * 12) + (DateTime.Today.Month - StartDate?.Month);
            double? progressPercentage = totalMonths > 0 ? (passedMonths / (double)totalMonths) * 100 : 0;
            OrphanDto dto = new()
            {
                Code = user.Code,
                FullName = user.FullName,
                NationalIdNumber = user.NationalIdNumber,
                WhatsApp = user.WhatsApp,
                MedicalCondition = user.MedicalCondition,
                Residence = user.Residence,
                DateOfBirth = user.DateOfBirth,
                NumberOfSiblings = user.NumberOfSiblings,
                OrphanType = user.OrphanType,
                TotalFamilyMembers = user.TotalFamilyMembers,
                GuardianRelation = user.GuardianRelation,
                GuardianName = user.GuardianName,
                Notes = user.Notes,
                ImagePath = user.ImagePath,
                Amount = user.Sponsorships?.Sum(s => s.Amount),
                NumberOfSponsorShipMonths = totalMonths,
                NumberOfRemainderSponsorShipMonths = passedMonths,
                ProgressPercentage = progressPercentage == 0 ? 10 : progressPercentage,
                Age = CalculateAge(user.DateOfBirth)


            };
            return dto;
        }
        return null;
    }


    public async Task<string> GetOrphanFullNameAsync(string code)
    {
        var fullname = (await _db.TblOrphans.SingleOrDefaultAsync(x => x.Code == code))?.FullName;
        return fullname ?? throw new Exception();
    }
    public async Task<string?> CreateAsync(InputOrphanDto input)
    {
        var orphan = new Orphan()
        {
            Code = await GenerateOrphanCodeAsync(),
            FullName = input.FullName,
            NationalIdNumber = input.NationalIdNumber,
            WhatsApp = input.WhatsApp,
            MedicalCondition = input.MedicalCondition,
            Residence = input.Residence,
            DateOfBirth = input.DateOfBirth,
            NumberOfSiblings = input.NumberOfSiblings,
            OrphanType = input.OrphanType,
            TotalFamilyMembers = input.TotalFamilyMembers,
            GuardianRelation = input.GuardianRelation,
            GuardianName = input.GuardianName,
            Notes = input.Notes,

        };
        if (input.Image != null)
            orphan.ImagePath = (await _fileService.UploadAsync(input.Image, FolderNames.OrphansImages)).Item1;

        if (input.BirthCertificate != null)
            orphan.BirthCertificatePath = (await _fileService.UploadAsync(input.BirthCertificate, FolderNames.OrphansPdfs)).Item1;
        if (input.DeathCertificate != null)
            orphan.DeathCertificatePath = (await _fileService.UploadAsync(input.DeathCertificate, FolderNames.OrphansPdfs)).Item1;
        if (input.GuardianCertificate != null)
            orphan.GuardianCertificatePath = (await _fileService.UploadAsync(input.GuardianCertificate, FolderNames.OrphansPdfs)).Item1;


        var createOrphanResult = await _db.TblOrphans.AddAsync(orphan);

        if (await _db.SaveChangesAsync() == 0)
        {
            throw new Exception("لم تنجح إضافة يتيم جديد");

        }

        return input.Code;
    }


    private async Task<string> GenerateOrphanCodeAsync()
    {
        while (true)
        {
            string randomPart = new Random().Next(100000, 999999).ToString(); // رقم عشوائي 6 أرقام
            var Code = $"ORP-{randomPart}";
            var orphanCodes = (await GetAllAsync()).Select(o => o.Code).ToList();
            if (!orphanCodes.Contains(Code))
            {
                return Code;
            }
        }
        //string datePart = DateTime.UtcNow.ToString("yyyyMMdd"); // جزء التاريخ
    }
    public async Task UpdateAsync(InputOrphanDto input)
    {


        var user = await _db.TblOrphans.SingleOrDefaultAsync(x => x.Code == input.Code) ?? throw new InvalidOperationException();

        _mapper.Map(input, user);
        if (input.Image != null)
            user.ImagePath = (await _fileService.UploadAsync(input.Image, FolderNames.OrphansImages)).Item1;

        user.FullName = input.FullName;
        user.WhatsApp = input.WhatsApp;
        user.MedicalCondition = input.MedicalCondition;
        user.Residence = input.Residence;
        user.DateOfBirth = input.DateOfBirth;
        user.NumberOfSiblings = input.NumberOfSiblings;
        user.TotalFamilyMembers = input.TotalFamilyMembers;
        user.GuardianRelation = input.GuardianRelation;
        user.GuardianName = input.GuardianName;
        user.Notes = input.Notes;
        _db.TblOrphans.Update(user);

        if (await _db.SaveChangesAsync() == 0)
        {
            throw new Exception("لم تنجح عملية التحديث  ");

        }


    }


    public async Task DeleteAsync(string code)
    {
        var user = await _db.TblOrphans.SingleOrDefaultAsync(x => x.Code == code) ?? throw new InvalidOperationException();
        _db.TblOrphans.Remove(user);
        if (await _db.SaveChangesAsync() == 0)
        {
            throw new Exception("لم تنجح عملية الحذف  ");

        }
    }


    public async Task ChangeOrphanTypeAsync(string code, OrphanType orphanType)
    {
        var user = await _db.TblOrphans.SingleOrDefaultAsync(x => x.Code == code) ?? throw new InvalidOperationException();
        user.OrphanType = orphanType;
        _db.TblOrphans.Update(user);
        if (await _db.SaveChangesAsync() == 0)
        {
            throw new Exception("لم تنجح عملية التحديث  ");

        }

    }

    public async Task<List<BaseViewModel<string>>> ListAsync()
    {
        var users = _db.TblOrphans.AsQueryable();

        return await users.Select(x => new BaseViewModel<string>()
        {
            Id = x.Code,
            Name = x.FullName
        }).ToListAsync();
    }


}
