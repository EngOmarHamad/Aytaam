using Aytaam.Core.Dtos.Orphans;

namespace Aytaam.Infrastructure.AutoMapper;
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        #region Orphans

        CreateMap<Orphan, OrphanDto>().ReverseMap();

        CreateMap<Orphan, InputOrphanDto>().ReverseMap();

        #endregion
        #region Sponsorships

        CreateMap<Sponsorship, SponsorshipDto>().ReverseMap();
        CreateMap<Sponsorship, InputSponsorshipDto>().ReverseMap();

        //CreateMap<Sponsorship, InputSponsorshipDto>()
        //    .ForMember(x => x.Orphans, x => x.Ignore())
        //    .ForMember(x => x.Orphans, x => x.MapFrom(x => x.Author.Name))
        //    .ReverseMap();

        #endregion
    }
}
