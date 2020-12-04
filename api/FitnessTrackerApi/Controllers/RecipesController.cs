using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RecipesController : BaseController
    {
        private readonly IRecipeService _recipeService;

        public RecipesController(IRecipeService recipeService)
        {
            _recipeService = recipeService;
        }

        [Authorize]
        [HttpGet("getrecipe")]
        public IActionResult GetRecipeById(int id)
        {
            try
            {
                if (id < 0)
                {
                    return OkResult(new GetRecipeResponse { Successful = false, ErrorMessage = "Recipe not found" });
                }

                var recipe = _recipeService.GetById(id);

                GetRecipeResponse response;

                if (recipe == null)
                {
                    response = new GetRecipeResponse
                    {
                        Successful = false,
                        ErrorMessage = "Recipe not found"
                    };
                }
                else
                {
                    response = new GetRecipeResponse
                    {
                        Recipe = recipe
                    };
                }

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new GetRecipeResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("getavailablerecipes")]
        public IActionResult GetAvailableRecipes()
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var recipes = _recipeService.GetForUser(CurrentUser.Id, true);

                return OkResult(new RecipeListResponse { Recipes = recipes });
            }
            catch (Exception ex)
            {
                return OkResult(new RecipeListResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("getuserrecipes")]
        public IActionResult GetUserRecipes()
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var recipes = _recipeService.GetForUser(CurrentUser.Id, false);

                return OkResult(new RecipeListResponse { Recipes = recipes });
            }
            catch (Exception ex)
            {
                return OkResult(new RecipeListResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("save")]
        public async Task<IActionResult> Save(EditRecipeRequest request)
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                RecipeListResponse response;

                if (request.ID > 0)
                {
                    response = await _recipeService.UpdateRecipe(CurrentUser, request);
                }
                else
                {
                    response = await _recipeService.AddRecipe(CurrentUser, request);
                }

                if (response == null)
                {
                    throw new Exception("Unable to save the recipe");
                }

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new RecipeListResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("deleterecipe")]
        public async Task<IActionResult> DeleteRecipe(DeleteRecipeRequest request)
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _recipeService.DeleteRecipe(CurrentUser, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new RecipeListResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }
    }
}