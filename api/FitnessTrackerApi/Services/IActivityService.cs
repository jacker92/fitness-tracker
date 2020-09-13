using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Services
{
    public interface IActivityService
    {
        Activity GetById(int id);
        Task<EditActivityResponse> AddActivity(User user, AddActivityRequest request);
        Task<EditActivityResponse> UpdateActivity(User user, UpdateActivityRequest request);
        Task<EditActivityResponse> DeleteActivity(User user, DeleteActivityRequest request);
    }
}