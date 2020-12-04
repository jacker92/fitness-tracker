using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Repositories;
using FitnessTrackerApi.Services;
using FitnessTrackerApi.Tests.Mocks.Repositories;
using Moq;
using System.Collections.Generic;
using System.Linq;
using Xunit;
using Xunit.Abstractions;

namespace FitnessTrackerApi.Tests.Services
{
    public class RecipeServiceTests
    {
        private readonly ITestOutputHelper _output;

        public RecipeServiceTests(ITestOutputHelper outputHelper)
        {
            _output = outputHelper;
        }

        [Fact]
        public void RecipeService_GetById_ReturnsRecipe()
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

            var ingredients = new List<RecipeFood>
            {
                new RecipeFood { ID = 1, RecipeID = 1, FoodID = 1, Food = null, Quantity = 3 },
                new RecipeFood { ID = 2, RecipeID = 1, FoodID = 2, Food = null, Quantity = 4 },
                new RecipeFood { ID = 3, RecipeID = 1, FoodID = 3, Food = null, Quantity = 6 }
            };

            var recipeRepo = new MockRepository<Recipe>();
            recipeRepo.MockGetById(recipe);

            var recipeFoodRepo = new MockRepository<RecipeFood>();
            recipeFoodRepo.MockGet(ingredients.AsQueryable());

            var recipeService = new RecipeService(recipeRepo.Object, recipeFoodRepo.Object);

            var result = recipeService.GetById(1);

            Assert.Equal(3, result.Ingredients.Count);
            Assert.Equal("Test Recipe 1", result.Name);
            Assert.Equal(350, result.Calories);
        }

        [Fact]
        public void RecipeService_GetForUser_ReturnsList()
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

            var recipeRepo = new MockRepository<Recipe>();
            recipeRepo.MockGet(userRecipes.AsQueryable());

            var recipeFoodRepo = Mock.Of<IRepository<RecipeFood>>();

            var recipeService = new RecipeService(recipeRepo.Object, recipeFoodRepo);

            var result = recipeService.GetForUser("123", true);

            Assert.Equal(3, result.Count);
            Assert.Single(result.Where(r => r.IsPublic));
            Assert.Empty(result.Where(r => r.Ingredients != null));
        }

        [Fact]
        public void RecipeService_AddRecipe_Success()
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

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var newlyAddedRecipe = new Recipe
            {
                ID = 4,
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
                    new RecipeFood { ID = 3, RecipeID = 1, FoodID = 3, Food = null, Quantity = 6 },
                }
            };

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
                newlyAddedRecipe
            };

            var recipeRepo = new MockRepository<Recipe>();
            recipeRepo.MockAdd(newlyAddedRecipe);
            recipeRepo.MockGet(userRecipes.AsQueryable());

            var recipeFoodRepo = new MockRepository<RecipeFood>();
            recipeFoodRepo.MockAdd(new RecipeFood());

            var recipeService = new RecipeService(recipeRepo.Object, recipeFoodRepo.Object);

            var result = recipeService.AddRecipe(user, request).Result;

            Assert.Equal(4, result.Recipes.Count);
            Assert.Contains(newlyAddedRecipe, result.Recipes);
            Assert.Empty(result.ErrorMessage);
        }

        [Fact]
        public void RecipeService_UpdateRecipe_Success()
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
                Name = "Awesomer Recipe",
                Servings = 4,
                Ingredients = new List<RecipeFood>
                {
                    new RecipeFood { ID = 1, RecipeID = 1, FoodID = 1, Food = null, Quantity = 3 },
                    new RecipeFood { ID = 2, RecipeID = 1, FoodID = 2, Food = null, Quantity = 4 },
                    new RecipeFood { ID = 3, RecipeID = 1, FoodID = 3, Food = null, Quantity = 6 }
                }
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var updatedRecipe = new Recipe
            {
                ID = 2,
                UserID = "123",
                User = null,
                Name = request.Name,
                IsPublic = request.IsPublic,
                IsAlcoholic = request.IsAlcoholic,
                Servings = request.Servings,
                Calories = request.Calories,
                Protein = request.Protein,
                Carbohydrates = request.Carbohydrates,
                Fat = request.Fat,
                Sugar = request.Sugar,
                Ingredients = request.Ingredients
            };

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
                updatedRecipe,
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
                },
            };

            var recipeRepo = new MockRepository<Recipe>();
            recipeRepo.MockGetById(updatedRecipe);
            recipeRepo.MockUpdate(updatedRecipe);
            recipeRepo.MockGet(userRecipes.AsQueryable());

            var recipeFoodRepo = new MockRepository<RecipeFood>();
            recipeFoodRepo.MockDeleteRange();
            recipeFoodRepo.MockAdd(new RecipeFood());

            var recipeService = new RecipeService(recipeRepo.Object, recipeFoodRepo.Object);

            var result = recipeService.UpdateRecipe(user, request).Result;

            Assert.Equal(3, result.Recipes.Count);
            Assert.Contains(updatedRecipe, result.Recipes);
            Assert.Empty(result.ErrorMessage);
        }

        [Fact]
        public void RecipeService_UpdateRecipe_UserDoesNotOwnRecipe()
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
                Name = "Awesomer Recipe",
                Servings = 4,
                Ingredients = new List<RecipeFood>
                {
                    new RecipeFood { ID = 1, RecipeID = 1, FoodID = 1, Food = null, Quantity = 3 },
                    new RecipeFood { ID = 2, RecipeID = 1, FoodID = 2, Food = null, Quantity = 4 },
                    new RecipeFood { ID = 3, RecipeID = 1, FoodID = 3, Food = null, Quantity = 6 }
                }
            };

            var user = new User
            {
                Id = "456",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var updatedRecipe = new Recipe
            {
                ID = 2,
                UserID = "123",
                User = null,
                Name = request.Name,
                IsPublic = request.IsPublic,
                IsAlcoholic = request.IsAlcoholic,
                Servings = request.Servings,
                Calories = request.Calories,
                Protein = request.Protein,
                Carbohydrates = request.Carbohydrates,
                Fat = request.Fat,
                Sugar = request.Sugar,
                Ingredients = request.Ingredients
            };

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
                updatedRecipe,
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
                },
            };

            var recipeRepo = new MockRepository<Recipe>();
            recipeRepo.MockGetById(updatedRecipe);
            recipeRepo.MockUpdate(updatedRecipe);
            recipeRepo.MockGet(userRecipes.AsQueryable());

            var recipeFoodRepo = new MockRepository<RecipeFood>();
            recipeFoodRepo.MockDeleteRange();
            recipeFoodRepo.MockAdd(new RecipeFood());

            var recipeService = new RecipeService(recipeRepo.Object, recipeFoodRepo.Object);

            var result = recipeService.UpdateRecipe(user, request).Result;

            Assert.Equal("Cannot find recipe", result.ErrorMessage);
        }

        [Fact]
        public void RecipeService_DeleteRecipe_Success()
        {
            var request = new DeleteRecipeRequest
            {
                ID = 2
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var recipeToDelete = new Recipe
            {
                ID = 2,
                UserID = "123",
                Calories = 300,
                Carbohydrates = 24,
                Protein = 27,
                Fat = 5,
                Sugar = 3,
                IsPublic = false,
                IsAlcoholic = false,
                Name = "Awesomer Recipe",
                Servings = 4,
                Ingredients = new List<RecipeFood>
                {
                    new RecipeFood { ID = 1, RecipeID = 1, FoodID = 1, Food = null, Quantity = 3 },
                    new RecipeFood { ID = 2, RecipeID = 1, FoodID = 2, Food = null, Quantity = 4 },
                    new RecipeFood { ID = 3, RecipeID = 1, FoodID = 3, Food = null, Quantity = 6 }
                }
            };

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
            };

            var recipeRepo = new MockRepository<Recipe>();
            recipeRepo.MockGetById(recipeToDelete);
            recipeRepo.MockDelete();
            recipeRepo.MockGet(userRecipes.AsQueryable());

            var recipeFoodRepo = new MockRepository<RecipeFood>();
            recipeFoodRepo.MockDeleteRange();

            var recipeService = new RecipeService(recipeRepo.Object, recipeFoodRepo.Object);

            var result = recipeService.DeleteRecipe(user, request).Result;

            _output.WriteLine($"ERROR: {result.ErrorMessage}");

            Assert.Equal(2, result.Recipes.Count);
            Assert.Empty(result.ErrorMessage);
            Assert.DoesNotContain(recipeToDelete, result.Recipes);
        }

        [Fact]
        public void RecipeService_DeleteRecipe_UserDoesNotOwnRecipe()
        {
            var request = new DeleteRecipeRequest
            {
                ID = 2
            };

            var user = new User
            {
                Id = "456",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var recipeToDelete = new Recipe
            {
                ID = 2,
                Calories = 300,
                Carbohydrates = 24,
                Protein = 27,
                Fat = 5,
                Sugar = 3,
                IsPublic = false,
                IsAlcoholic = false,
                Name = "Awesomer Recipe",
                Servings = 4,
                Ingredients = new List<RecipeFood>
                {
                    new RecipeFood { ID = 1, RecipeID = 1, FoodID = 1, Food = null, Quantity = 3 },
                    new RecipeFood { ID = 2, RecipeID = 1, FoodID = 2, Food = null, Quantity = 4 },
                    new RecipeFood { ID = 3, RecipeID = 1, FoodID = 3, Food = null, Quantity = 6 }
                }
            };

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
                },
            };

            var recipeRepo = new MockRepository<Recipe>();
            recipeRepo.MockGetById(recipeToDelete);
            recipeRepo.MockDelete();
            recipeRepo.MockGet(userRecipes.AsQueryable());

            var recipeFoodRepo = new MockRepository<RecipeFood>();
            recipeFoodRepo.MockDeleteRange();

            var recipeService = new RecipeService(recipeRepo.Object, recipeFoodRepo.Object);

            var result = recipeService.DeleteRecipe(user, request).Result;

            Assert.Equal("Cannot find recipe", result.ErrorMessage);
        }
    }
}