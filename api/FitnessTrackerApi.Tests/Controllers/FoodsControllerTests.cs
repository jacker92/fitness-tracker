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
    public class FoodsControllerTests
    {
        private readonly ITestOutputHelper _output;

        public FoodsControllerTests(ITestOutputHelper output)
        {
            _output = output;
        }

        [Fact]
        public void FoodsController_GetFoodById_ReturnsFood()
        {
            var food = new Food
            {
                ID = 1,
                ServingSize = "16 oz.",
                Brand = "Wegmans",
                Calories = 300,
                Carbohydrates = 25,
                Fat = 12,
                IsAlcoholic = false,
                IsPublic = false,
                Name = "Ribeye",
                Protein = 30,
                Sugar = 1,
                UserID = "123",
                User = null
            };

            var foodService = new MockFoodService().MockGetById(food);

            var foodsController = new FoodsController(foodService.Object);

            var result = (OkObjectResult)foodsController.GetFoodById(1);

            var response = JsonSerializer.Deserialize<GetFoodResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal(food.Name, response.Food.Name);
            Assert.Equal(food.Carbohydrates, response.Food.Carbohydrates);
        }

        [Fact]
        public void FoodsController_GetFoodById_ReturnsNotFound()
        {
            var foodService = new MockFoodService().MockGetById((Food)null);

            var foodsController = new FoodsController(foodService.Object);

            var result = (OkObjectResult)foodsController.GetFoodById(1);

            var response = JsonSerializer.Deserialize<GetFoodResponse>(result.Value.ToString());

            Assert.False(response.Successful);
            Assert.Equal("Food not found", response.ErrorMessage);
        }

        [Fact]
        public void FoodsController_GetUserCustomFoods_Successful()
        {
            var userFoods = new List<Food>
            {
                new Food { ID = 1, Brand = "Wegmans", ServingSize = "16 oz.", Calories = 300, Carbohydrates = 25, Fat = 12, IsAlcoholic = false, IsPublic = false, Name = "Ribeye", Protein = 30, Sugar = 1, UserID = "123", User = null },
                new Food { ID = 2, Brand = "Wegmans", ServingSize = "12 oz.", Calories = 300, Carbohydrates = 20, Fat = 10, IsAlcoholic = false, IsPublic = false, Name = "NY Strip", Protein = 20, Sugar = 1, UserID = "123", User = null },
                new Food { ID = 3, Brand = "Wegmans", ServingSize = "8 oz.", Calories = 300, Carbohydrates = 15, Fat = 8, IsAlcoholic = false, IsPublic = false, Name = "Delmonico", Protein = 10, Sugar = 1, UserID = "123", User = null }
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var foodService = new MockFoodService().MockGetForUser(userFoods);

            var foodsController = new FoodsController(foodService.Object);
            foodsController.ControllerContext.HttpContext = new DefaultHttpContext();
            foodsController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)foodsController.GetUserCustomFoods();

            var response = JsonSerializer.Deserialize<EditFoodResponse>(result.Value.ToString());

            Assert.Equal(3, response.Foods.Count);
            Assert.Empty(response.Foods.Where(f => f.UserID != "123" && f.IsPublic));
        }

        [Fact]
        public void FoodsController_AddFood_Successful()
        {
            var request = new AddFoodRequest
            {
                Brand = "Wegmans",
                ServingSize = "16 oz.",
                Calories = 300,
                Carbohydrates = 25,
                Fat = 12,
                IsAlcoholic = false,
                IsPublic = false,
                Name = "Ribeye",
                Protein = 30,
                Sugar = 1
            };

            var foodList = new List<Food>
            {
                new Food { ID = 1, Brand = "Wegmans", ServingSize = "16 oz.", Calories = 300, Carbohydrates = 25, Fat = 12, IsAlcoholic = false, IsPublic = false, Name = "Ribeye", Protein = 30, Sugar = 1, UserID = "123", User = null },
                new Food { ID = 2, Brand = "Wegmans", ServingSize = "12 oz.", Calories = 300, Carbohydrates = 20, Fat = 10, IsAlcoholic = false, IsPublic = false, Name = "NY Strip", Protein = 20, Sugar = 1, UserID = "123", User = null },
                new Food { ID = 3, Brand = "Wegmans", ServingSize = "8 oz.", Calories = 300, Carbohydrates = 15, Fat = 8, IsAlcoholic = false, IsPublic = false, Name = "Delmonico", Protein = 10, Sugar = 1, UserID = "123", User = null }
            };

            var addResponse = new EditFoodResponse
            {
                Successful = true,
                ErrorMessage = "",
                Foods = foodList
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var foodService = new MockFoodService().MockAddFood(addResponse);

            var foodsController = new FoodsController(foodService.Object);
            foodsController.ControllerContext.HttpContext = new DefaultHttpContext();
            foodsController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)foodsController.AddFood(request).Result;

            var response = JsonSerializer.Deserialize<EditFoodResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Single(response.Foods.Where(f => f.Name == "Ribeye"));
        }

        [Fact]
        public void FoodsController_UpdateFood_Successful()
        {
            var request = new UpdateFoodRequest
            {
                ID = 1,
                ServingSize = "14 oz.",
                Brand = "Wegmans",
                Calories = 300,
                Carbohydrates = 25,
                Fat = 12,
                IsAlcoholic = false,
                IsPublic = false,
                Name = "Ribeye",
                Protein = 30,
                Sugar = 1
            };

            var foodList = new List<Food>
            {
                new Food { ID = 1, Brand = "Wegmans", ServingSize = "14 oz.", Calories = 300, Carbohydrates = 25, Fat = 12, IsAlcoholic = false, IsPublic = false, Name = "Ribeye", Protein = 30, Sugar = 1, UserID = "123", User = null },
                new Food { ID = 2, Brand = "Wegmans", ServingSize = "12 oz.", Calories = 300, Carbohydrates = 20, Fat = 10, IsAlcoholic = false, IsPublic = false, Name = "NY Strip", Protein = 20, Sugar = 1, UserID = "123", User = null },
                new Food { ID = 3, Brand = "Wegmans", ServingSize = "8 oz.", Calories = 300, Carbohydrates = 15, Fat = 8, IsAlcoholic = false, IsPublic = false, Name = "Delmonico", Protein = 10, Sugar = 1, UserID = "123", User = null }
            };

            var updateResponse = new EditFoodResponse
            {
                Successful = true,
                ErrorMessage = "",
                Foods = foodList
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var foodService = new MockFoodService().MockUpdateFood(updateResponse);

            var foodsController = new FoodsController(foodService.Object);
            foodsController.ControllerContext.HttpContext = new DefaultHttpContext();
            foodsController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)foodsController.UpdateFood(request).Result;

            var response = JsonSerializer.Deserialize<EditFoodResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Single(response.Foods.Where(f => f.Name == "Ribeye"));
        }

        [Fact]
        public void FoodsController_DeleteFood_Successful()
        {
            var request = new DeleteFoodRequest
            {
                ID = 1
            };

            var foodList = new List<Food>
            {
                new Food { ID = 2, Brand = "Wegmans", ServingSize = "12 oz.", Calories = 300, Carbohydrates = 20, Fat = 10, IsAlcoholic = false, IsPublic = false, Name = "NY Strip", Protein = 20, Sugar = 1, UserID = "123", User = null },
                new Food { ID = 3, Brand = "Wegmans", ServingSize = "8 oz.", Calories = 300, Carbohydrates = 15, Fat = 8, IsAlcoholic = false, IsPublic = false, Name = "Delmonico", Protein = 10, Sugar = 1, UserID = "123", User = null }
            };

            var deleteResponse = new EditFoodResponse
            {
                Successful = true,
                ErrorMessage = "",
                Foods = foodList
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var foodService = new MockFoodService().MockDeleteFood(deleteResponse);

            var foodsController = new FoodsController(foodService.Object);
            foodsController.ControllerContext.HttpContext = new DefaultHttpContext();
            foodsController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)foodsController.DeleteFood(request).Result;

            var response = JsonSerializer.Deserialize<EditFoodResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal(2, response.Foods.Count);
            Assert.Empty(response.Foods.Where(f => f.Name == "Ribeye"));
        }

        [Fact]
        public void FoodsController_Search_Success()
        {
            var searchResults = new List<Food>
            {
                new Food { ID = 1, Brand = "Wegmans", ServingSize = "16 oz.", Calories = 300, Carbohydrates = 25, Fat = 12, IsAlcoholic = false, IsPublic = false, Name = "Ribeye", Protein = 30, Sugar = 1, UserID = "123", User = null },
                new Food { ID = 2, Brand = "Wegmans", ServingSize = "12 oz.", Calories = 300, Carbohydrates = 20, Fat = 10, IsAlcoholic = false, IsPublic = true, Name = "NY Strip", Protein = 20, Sugar = 1, UserID = "123", User = null },
                new Food { ID = 3, Brand = "Wegmans", ServingSize = "8 oz.", Calories = 300, Carbohydrates = 15, Fat = 8, IsAlcoholic = false, IsPublic = false, Name = "Delmonico", Protein = 10, Sugar = 1, UserID = "123", User = null }
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };


            var foodService = new MockFoodService().MockSearch(searchResults);

            var foodsController = new FoodsController(foodService.Object);
            foodsController.ControllerContext.HttpContext = new DefaultHttpContext();
            foodsController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)foodsController.SearchFoods("wegmans");

            var response = JsonSerializer.Deserialize<EditFoodResponse>(result.Value.ToString());

            Assert.Equal(3, response.Foods.Count);
        }
    }
}