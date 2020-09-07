using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Services
{
    public interface IGearService
    {
        Gear GetById(int id);
        Task<EditGearResponse> AddGear(User user, AddGearRequest request);
        Task<EditGearResponse> UpdateGear(User user, UpdateGearRequest request);
        Task<EditGearResponse> DeleteGear(User user, DeleteGearRequest request);
        Task<EditGearResponse> SetGearActiveFlag(User user, SetGearActiveFlagRequest request);
    }
}