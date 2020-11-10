using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Services
{
    public interface IFoodService
    {
        Food GetById(int id);
        List<Food> GetForUser(string userId, bool includePublic);
        Task<EditFoodResponse> AddFood(User user, AddFoodRequest request);
        Task<EditFoodResponse> UpdateFood(User user, UpdateFoodRequest request);
        Task<EditFoodResponse> DeleteFood(User user, DeleteFoodRequest request);
        List<Food> Search(User user, string keywords);
    }
}