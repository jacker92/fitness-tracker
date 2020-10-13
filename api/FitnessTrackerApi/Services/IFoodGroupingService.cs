using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Services
{
    public interface IFoodGroupingService
    {
        FoodGrouping GetById(int id);
        List<FoodGrouping> GetForUser(string userId);
        Task<EditFoodGroupingResponse> AddFoodGrouping(User user, AddFoodGroupingRequest request);
        Task<EditFoodGroupingResponse> UpdateFoodGrouping(User user, UpdateFoodGroupingRequest request);
        Task<EditFoodGroupingResponse> DeleteFoodGrouping(User user, DeleteFoodGroupingRequest request);
    }
}