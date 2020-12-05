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
        List<Gear> GetUserGear(string userId);
        Task<GearListResponse> AddGear(User user, EditGearRequest request);
        Task<GearListResponse> UpdateGear(User user, EditGearRequest request);
        Task<GearListResponse> DeleteGear(User user, DeleteRequest request);
        Task<GearListResponse> SetGearActiveFlag(User user, SetGearActiveFlagRequest request);
    }
}