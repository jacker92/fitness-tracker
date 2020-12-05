using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Services
{
    public interface IGearService
    {
        Gear GetById(int id);
        List<Gear> ListForUser(string userId);
        Task<GearListResponse> Add(User user, EditGearRequest request);
        Task<GearListResponse> Update(User user, EditGearRequest request);
        Task<GearListResponse> Delete(User user, DeleteRequest request);
        Task<GearListResponse> SetActiveFlag(User user, SetGearActiveFlagRequest request);
    }
}