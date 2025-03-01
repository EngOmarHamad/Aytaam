using Aytaam.Core.Dtos.Orphans;

namespace Aytaam.Infrastructure.AutoMapper;
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        #region Orphans

        CreateMap<Orphan, OrphanDto>().
            ForMember(x => x.DateOfBirth, x => x.MapFrom(x => $"{x.DateOfBirth.GetDate(new System.Globalization.CultureInfo("ar-EG"), "dd, MMMM, yyyy")}" ?? null))

            .ReverseMap();

        CreateMap<Orphan, InputOrphanDto>().ReverseMap();

        #endregion
        #region Sponsorships

        CreateMap<Sponsorship, SponsorshipDto>()
            .ForMember(x => x.StartDate, x => x.MapFrom(x => $"{x.StartDate.GetDate(new System.Globalization.CultureInfo("ar-EG"), "dd, MMMM, yyyy")}" ?? null))
            .ForMember(x => x.EndDate, x => x.MapFrom(x => $"{x.EndDate.GetDate(new System.Globalization.CultureInfo("ar-EG"), "dd, MMMM, yyyy")}" ?? null))
.ReverseMap();
        CreateMap<Sponsorship, InputSponsorshipDto>().ReverseMap();

        //CreateMap<Sponsorship, InputSponsorshipDto>()
        //    .ForMember(x => x.Orphans, x => x.Ignore())
        //    .ForMember(x => x.Orphans, x => x.MapFrom(x => x.Author.Name))
        //    .ReverseMap();

        #endregion
    }
}
