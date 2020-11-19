using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Services
{
    public interface IRecipeService
    {
        Recipe GetById(int id);
        List<Recipe> GetForUser(string userId, bool includePublic);
        Task<RecipeListResponse> AddRecipe(User user, EditRecipeRequest request);
        Task<RecipeListResponse> UpdateRecipe(User user, EditRecipeRequest request);
        Task<RecipeListResponse> DeleteRecipe(User user, DeleteRecipeRequest request);
    }
}