using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Services
{
    public class RecipeService : IRecipeService
    {
        private readonly IRepository<Recipe> _recipeRepository;
        private readonly IRepository<RecipeFood> _recipeFoodRepository;

        public RecipeService(IRepository<Recipe> recipeRepo, IRepository<RecipeFood> recipeFoodRepo)
        {
            _recipeRepository = recipeRepo;
            _recipeFoodRepository = recipeFoodRepo;
        }

        public Recipe GetById(int recipeId)
        {
            return _recipeRepository.GetById(recipeId);
        }

        public List<Recipe> GetForUser(string userId, bool includePublic = true)
        {
            if (includePublic)
            {
                return _recipeRepository.Get(r => r.UserID == userId || r.IsPublic)
                                            .OrderBy(r => r.Name)
                                            .ToList();
            }
            else
            {
                return _recipeRepository.Get(r => r.UserID == userId)
                                            .OrderBy(r => r.Name)
                                            .ToList();
            }
        }

        public async Task<RecipeListResponse> AddRecipe(User user, AddRecipeRequest request)
        {
            try
            {
                if (user != null)
                {
                    var recipe = new Recipe
                    {
                        UserID = user.Id,
                        Name = request.Name,
                        IsPublic = request.IsPublic,
                        Servings = request.Servings,
                        Ingredients = request.Ingredients,
                    };

                    await _recipeRepository.Add(recipe);

                    return new RecipeListResponse
                    {
                        Recipes = GetForUser(user.Id, false)
                    };
                }

                return new RecipeListResponse
                {
                    Successful = false,
                    ErrorMessage = "Cannot find user"
                };
            }
            catch (Exception ex)
            {
                return new RecipeListResponse
                {
                    Successful = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<RecipeListResponse> UpdateRecipe(User user, UpdateRecipeRequest request)
        {
            try
            {
                if (user != null)
                {
                    var recipe = GetById(request.ID);

                    if (recipe == null || recipe.UserID != user.Id)
                    {
                        return new RecipeListResponse
                        {
                            Successful = false,
                            ErrorMessage = "Cannot find recipe"
                        };
                    }

                    recipe.Name = request.Name;
                    recipe.IsPublic = request.IsPublic;
                    recipe.Servings = request.Servings;

                    await _recipeFoodRepository.DeleteRange(recipe.Ingredients);

                    recipe.Ingredients = request.Ingredients;

                    await _recipeRepository.Update(recipe);

                    return new RecipeListResponse
                    {
                        Recipes = GetForUser(user.Id, false)
                    };
                }

                return new RecipeListResponse
                {
                    Successful = false,
                    ErrorMessage = "Cannot find user"
                };
            }
            catch (Exception ex)
            {
                return new RecipeListResponse
                {
                    Successful = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<RecipeListResponse> DeleteRecipe(User user, DeleteRecipeRequest request)
        {
            try
            {
                if (user != null)
                {
                    var recipe = _recipeRepository.GetById(request.ID);

                    if (recipe == null || recipe.UserID != user.Id)
                    {
                        return new RecipeListResponse
                        {
                            Successful = false,
                            ErrorMessage = "Cannot find recipe"
                        };
                    }

                    // TODO: Cleanup (Handle logged entries)

                    await _recipeFoodRepository.DeleteRange(recipe.Ingredients);
                    await _recipeRepository.Delete(recipe);

                    return new RecipeListResponse
                    {
                        Recipes = GetForUser(user.Id, false)
                    };
                }

                return new RecipeListResponse
                {
                    Successful = false,
                    ErrorMessage = "Cannot find user"
                };
            }
            catch (Exception ex)
            {
                return new RecipeListResponse
                {
                    Successful = false,
                    ErrorMessage = ex.Message
                };
            }
        }
    }
}