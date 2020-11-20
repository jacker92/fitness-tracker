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

        public async Task<RecipeListResponse> AddRecipe(User user, EditRecipeRequest request)
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
                        Calories = request.Calories,
                        Protein = request.Protein,
                        Carbohydrates = request.Carbohydrates,
                        Fat = request.Fat,
                        Sugar = request.Sugar,
                        IsAlcoholic = request.IsAlcoholic
                    };

                    await _recipeRepository.Add(recipe);

                    foreach (var ingredient in request.Ingredients)
                    {
                        var recipeFood = new RecipeFood
                        {
                            FoodID = ingredient.FoodID,
                            Quantity = ingredient.Quantity,
                            RecipeID = recipe.ID
                        };

                        await _recipeFoodRepository.Add(recipeFood);
                    }

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

        public async Task<RecipeListResponse> UpdateRecipe(User user, EditRecipeRequest request)
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
                    recipe.Calories = request.Calories;
                    recipe.Protein = request.Protein;
                    recipe.Carbohydrates = request.Carbohydrates;
                    recipe.Fat = request.Fat;
                    recipe.Sugar = request.Sugar;
                    recipe.IsAlcoholic = request.IsAlcoholic;

                    await _recipeRepository.Update(recipe);

                    // clear out all the ingredients, we'll just replace them.
                    // no need to identify when ingredients were removed during edit.
                    await _recipeFoodRepository.DeleteRange(recipe.Ingredients);

                    foreach (var ingredient in request.Ingredients)
                    {
                        var recipeFood = new RecipeFood
                        {
                            FoodID = ingredient.FoodID,
                            Quantity = ingredient.Quantity,
                            RecipeID = recipe.ID
                        };

                        await _recipeFoodRepository.Add(recipeFood);
                    }

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