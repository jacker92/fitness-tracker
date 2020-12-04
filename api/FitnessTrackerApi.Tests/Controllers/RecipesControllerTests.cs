using FitnessTrackerApi.Controllers;
using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Tests.Mocks.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Xunit;
using Xunit.Abstractions;

namespace FitnessTrackerApi.Tests.Controllers
{
    public class RecipesControllerTests
    {
        private readonly ITestOutputHelper _output;

        public RecipesControllerTests(ITestOutputHelper output)
        {
            _output = output;
        }

        [Fact]
        public void RecipesController_GetRecipeById_ReturnsRecipe()
        {
            var recipe = new Recipe
            {
                ID = 1,
                UserID = "123",
                User = null,
                Name = "Test Recipe 1",
                IsPublic = false,
                IsAlcoholic = false,
                Servings = 4,
                Calories = 350,
                Protein = 20,
                Carbohydrates = 14,
                Fat = 10,
                Sugar = 3,
                Ingredients = null
            };

            var recipeService = new MockRecipeService().MockGetById(recipe);

            var recipesController = new RecipesController(recipeService.Object);

            var result = (OkObjectResult)recipesController.GetRecipeById(1);

            var response = JsonSerializer.Deserialize<GetRecipeResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Empty(response.ErrorMessage);
            Assert.Equal(recipe.Name, response.Recipe.Name);
            Assert.Equal(recipe.Carbohydrates, response.Recipe.Carbohydrates);
        }

        [Fact]
        public void RecipesController_GetRecipeById_ReturnsNotFound()
        {
            var recipeService = new MockRecipeService().MockGetById((Recipe)null);

            var recipesController = new RecipesController(recipeService.Object);

            var result = (OkObjectResult)recipesController.GetRecipeById(1);

            var response = JsonSerializer.Deserialize<GetFoodResponse>(result.Value.ToString());

            Assert.False(response.Successful);
            Assert.Equal("Recipe not found", response.ErrorMessage);
        }

        [Fact]
        public void RecipesController_GetAvailableRecipes_Successful()
        {
            var userRecipes = new List<Recipe>
            {
                new Recipe
                {
                    ID = 1,
                    UserID = "123",
                    User = null,
                    Name = "Test Recipe 2",
                    IsPublic = false,
                    IsAlcoholic = false,
                    Servings = 4,
                    Calories = 350,
                    Protein = 20,
                    Carbohydrates = 14,
                    Fat = 10,
                    Sugar = 3,
                    Ingredients = null
                },
                new Recipe
                {
                    ID = 2,
                    UserID = "123",
                    User = null,
                    Name = "Test Recipe 3",
                    IsPublic = false,
                    IsAlcoholic = false,
                    Servings = 4,
                    Calories = 350,
                    Protein = 20,
                    Carbohydrates = 14,
                    Fat = 10,
                    Sugar = 3,
                    Ingredients = null
                },
                new Recipe
                {
                    ID = 3,
                    UserID = "456",
                    User = null,
                    Name = "Test Recipe 4",
                    IsPublic = true,
                    IsAlcoholic = false,
                    Servings = 4,
                    Calories = 350,
                    Protein = 20,
                    Carbohydrates = 14,
                    Fat = 10,
                    Sugar = 3,
                    Ingredients = null
                }
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var recipeService = new MockRecipeService().MockGetForUser(userRecipes);

            var recipesController = new RecipesController(recipeService.Object);
            recipesController.ControllerContext.HttpContext = new DefaultHttpContext();
            recipesController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)recipesController.GetAvailableRecipes();

            var response = JsonSerializer.Deserialize<RecipeListResponse>(result.Value.ToString());

            Assert.Equal(3, response.Recipes.Count);
            Assert.Empty(response.Recipes.Where(f => f.UserID != "123" && !f.IsPublic));
        }


        [Fact]
        public void RecipesController_GetUserRecipes_Successful()
        {
            var userRecipes = new List<Recipe>
            {
                new Recipe
                {
                    ID = 1,
                    UserID = "123",
                    User = null,
                    Name = "Test Recipe 2",
                    IsPublic = false,
                    IsAlcoholic = false,
                    Servings = 4,
                    Calories = 350,
                    Protein = 20,
                    Carbohydrates = 14,
                    Fat = 10,
                    Sugar = 3,
                    Ingredients = null
                },
                new Recipe
                {
                    ID = 2,
                    UserID = "123",
                    User = null,
                    Name = "Test Recipe 3",
                    IsPublic = false,
                    IsAlcoholic = false,
                    Servings = 4,
                    Calories = 350,
                    Protein = 20,
                    Carbohydrates = 14,
                    Fat = 10,
                    Sugar = 3,
                    Ingredients = null
                },
                new Recipe
                {
                    ID = 3,
                    UserID = "123",
                    User = null,
                    Name = "Test Recipe 4",
                    IsPublic = true,
                    IsAlcoholic = false,
                    Servings = 4,
                    Calories = 350,
                    Protein = 20,
                    Carbohydrates = 14,
                    Fat = 10,
                    Sugar = 3,
                    Ingredients = null
                }
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var recipeService = new MockRecipeService().MockGetForUser(userRecipes);

            var recipesController = new RecipesController(recipeService.Object);
            recipesController.ControllerContext.HttpContext = new DefaultHttpContext();
            recipesController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)recipesController.GetUserRecipes();

            var response = JsonSerializer.Deserialize<RecipeListResponse>(result.Value.ToString());

            Assert.Equal(3, response.Recipes.Count);
            Assert.Empty(response.Recipes.Where(f => f.UserID != "123" && f.IsPublic));
        }

        [Fact]
        public void RecipesController_Save_NewRecipe_Successful()
        {
            var request = new EditRecipeRequest
            {
                ID = 0,
                Calories = 300,
                Carbohydrates = 24,
                Protein = 27,
                Fat = 5,
                Sugar = 3,
                IsPublic = false,
                IsAlcoholic = false,
                Name = "Awesome Recipe",
                Servings = 4,
                Ingredients = new List<RecipeFood>
                {
                    new RecipeFood { ID = 1, RecipeID = 1, FoodID = 1, Food = null, Quantity = 3 },
                    new RecipeFood { ID = 2, RecipeID = 1, FoodID = 2, Food = null, Quantity = 4 },
                    new RecipeFood { ID = 3, RecipeID = 1, FoodID = 3, Food = null, Quantity = 6 }
                }
            };

            var addResponse = new RecipeListResponse
            {
                Successful = true,
                ErrorMessage = "",
                Recipes = new List<Recipe>
                {
                    new Recipe
                    {
                        ID = 1,
                        UserID = "123",
                        User = null,
                        Name = "Test Recipe 2",
                        IsPublic = false,
                        IsAlcoholic = false,
                        Servings = 4,
                        Calories = 350,
                        Protein = 20,
                        Carbohydrates = 14,
                        Fat = 10,
                        Sugar = 3,
                        Ingredients = null
                    },
                    new Recipe
                    {
                        ID = 2,
                        UserID = "123",
                        User = null,
                        Name = "Test Recipe 3",
                        IsPublic = false,
                        IsAlcoholic = false,
                        Servings = 4,
                        Calories = 350,
                        Protein = 20,
                        Carbohydrates = 14,
                        Fat = 10,
                        Sugar = 3,
                        Ingredients = null
                    },
                    new Recipe
                    {
                        ID = 3,
                        UserID = "123",
                        User = null,
                        Name = "Test Recipe 4",
                        IsPublic = false,
                        IsAlcoholic = false,
                        Servings = 4,
                        Calories = 350,
                        Protein = 20,
                        Carbohydrates = 14,
                        Fat = 10,
                        Sugar = 3,
                        Ingredients = null
                    }
                }
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var recipeService = new MockRecipeService().MockAddRecipe(addResponse);

            var recipesController = new RecipesController(recipeService.Object);
            recipesController.ControllerContext.HttpContext = new DefaultHttpContext();
            recipesController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)recipesController.Save(request).Result;

            var response = JsonSerializer.Deserialize<RecipeListResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Empty(response.ErrorMessage);
            Assert.Equal(3, response.Recipes.Count);
        }

        [Fact]
        public void RecipesController_Save_UpdateRecipe_Successful()
        {
            var request = new EditRecipeRequest
            {
                ID = 2,
                Calories = 300,
                Carbohydrates = 24,
                Protein = 27,
                Fat = 5,
                Sugar = 3,
                IsPublic = false,
                IsAlcoholic = false,
                Name = "Awesome Recipe",
                Servings = 4,
                Ingredients = new List<RecipeFood>
                {
                    new RecipeFood { ID = 1, RecipeID = 1, FoodID = 1, Food = null, Quantity = 3 },
                    new RecipeFood { ID = 2, RecipeID = 1, FoodID = 2, Food = null, Quantity = 4 },
                    new RecipeFood { ID = 3, RecipeID = 1, FoodID = 3, Food = null, Quantity = 6 }
                }
            };

            var updateResponse = new RecipeListResponse
            {
                Successful = true,
                ErrorMessage = "",
                Recipes = new List<Recipe>
                {
                    new Recipe
                    {
                        ID = 1,
                        UserID = "123",
                        User = null,
                        Name = "Test Recipe 2",
                        IsPublic = false,
                        IsAlcoholic = false,
                        Servings = 4,
                        Calories = 350,
                        Protein = 20,
                        Carbohydrates = 14,
                        Fat = 10,
                        Sugar = 3,
                        Ingredients = null
                    },
                    new Recipe
                    {
                        ID = 2,
                        UserID = "123",
                        User = null,
                        Calories = 300,
                        Carbohydrates = 24,
                        Protein = 27,
                        Fat = 5,
                        Sugar = 3,
                        IsPublic = false,
                        IsAlcoholic = false,
                        Name = "Awesome Recipe",
                        Servings = 4,
                        Ingredients = null
                    },
                    new Recipe
                    {
                        ID = 3,
                        UserID = "123",
                        User = null,
                        Name = "Test Recipe 4",
                        IsPublic = false,
                        IsAlcoholic = false,
                        Servings = 4,
                        Calories = 350,
                        Protein = 20,
                        Carbohydrates = 14,
                        Fat = 10,
                        Sugar = 3,
                        Ingredients = null
                    }
                }
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var recipeService = new MockRecipeService().MockUpdateRecipe(updateResponse);

            var recipesController = new RecipesController(recipeService.Object);
            recipesController.ControllerContext.HttpContext = new DefaultHttpContext();
            recipesController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)recipesController.Save(request).Result;

            var response = JsonSerializer.Deserialize<RecipeListResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Empty(response.ErrorMessage);
            Assert.Equal(3, response.Recipes.Count);
        }

        [Fact]
        public void RecipesController_DeleteRecipe_Successful()
        {
            var request = new DeleteRecipeRequest
            {
                ID = 1
            };

            var recipeList = new List<Recipe>
            {
                new Recipe
                {
                    ID = 2,
                    UserID = "123",
                    User = null,
                    Name = "Test Recipe 3",
                    IsPublic = false,
                    IsAlcoholic = false,
                    Servings = 4,
                    Calories = 350,
                    Protein = 20,
                    Carbohydrates = 14,
                    Fat = 10,
                    Sugar = 3,
                    Ingredients = null
                },
                new Recipe
                {
                    ID = 3,
                    UserID = "123",
                    User = null,
                    Name = "Test Recipe 4",
                    IsPublic = true,
                    IsAlcoholic = false,
                    Servings = 4,
                    Calories = 350,
                    Protein = 20,
                    Carbohydrates = 14,
                    Fat = 10,
                    Sugar = 3,
                    Ingredients = null
                }
            };

            var deleteResponse = new RecipeListResponse
            {
                Successful = true,
                ErrorMessage = "",
                Recipes = recipeList
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var recipeService = new MockRecipeService().MockDeleteRecipe(deleteResponse);

            var recipesController = new RecipesController(recipeService.Object);
            recipesController.ControllerContext.HttpContext = new DefaultHttpContext();
            recipesController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)recipesController.DeleteRecipe(request).Result;

            var response = JsonSerializer.Deserialize<RecipeListResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Empty(response.ErrorMessage);
            Assert.Equal(2, response.Recipes.Count);
        }
    }
}