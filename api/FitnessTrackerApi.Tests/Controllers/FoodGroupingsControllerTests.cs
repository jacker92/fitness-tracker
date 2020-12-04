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
    public class FoodGroupingsControllerTests
    {
        private readonly ITestOutputHelper _output;

        public FoodGroupingsControllerTests(ITestOutputHelper output)
        {
            _output = output;
        }

        [Fact]
        public void FoodGroupingsController_GetFoodGroupingById_ReturnsResult()
        {
            var foodGrouping = new FoodGrouping
            {
                ID = 1,
                Name = "Breakfast",
                SortOrder = 1,
                UserID = "123",
                User = null
            };

            var foodGroupingService = new MockFoodGroupingService().MockGetById(foodGrouping);

            var foodGroupingsController = new FoodGroupingsController(foodGroupingService.Object);

            var result = (OkObjectResult)foodGroupingsController.GetFoodGroupingById(1);

            var response = JsonSerializer.Deserialize<GetFoodGroupingResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal("Breakfast", response.FoodGrouping.Name);
        }

        [Fact]
        public void FoodGroupingsController_GetFoodGroupingById_ReturnsNotFound()
        {
            var foodGroupingService = new MockFoodGroupingService().MockGetById((FoodGrouping)null);

            var foodGroupingsController = new FoodGroupingsController(foodGroupingService.Object);

            var result = (OkObjectResult)foodGroupingsController.GetFoodGroupingById(1);

            var response = JsonSerializer.Deserialize<GetFoodGroupingResponse>(result.Value.ToString());

            Assert.False(response.Successful);
            Assert.Equal("Food grouping not found", response.ErrorMessage);
        }

        [Fact]
        public void FoodGroupingsController_GetUserFoodGroupings_Successful()
        {
            var foodGroupings = new List<FoodGrouping>
            {
                new FoodGrouping { ID = 1, Name = "Breakfast", SortOrder = 1, UserID = "123", User = null },
                new FoodGrouping { ID = 2, Name = "Lunch", SortOrder = 2, UserID = "123", User = null },
                new FoodGrouping { ID = 3, Name = "Dinner", SortOrder = 3, UserID = "123", User = null },
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var foodGroupingService = new MockFoodGroupingService().MockGetForUser(foodGroupings);

            var foodGroupingsController = new FoodGroupingsController(foodGroupingService.Object);
            foodGroupingsController.ControllerContext.HttpContext = new DefaultHttpContext();
            foodGroupingsController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)foodGroupingsController.GetUserFoodGroupings();

            var response = JsonSerializer.Deserialize<EditFoodGroupingResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal(3, response.FoodGroupings.Count);
        }

        [Fact]
        public void FoodGroupingsController_AddFoodGrouping_Successful()
        {
            var request = new AddFoodGroupingRequest
            {
                Name = "Snacks",
                SortOrder = 4
            };

            var foodGroupings = new List<FoodGrouping>
            {
                new FoodGrouping { ID = 1, Name = "Breakfast", SortOrder = 1, UserID = "123", User = null },
                new FoodGrouping { ID = 2, Name = "Lunch", SortOrder = 2, UserID = "123", User = null },
                new FoodGrouping { ID = 3, Name = "Dinner", SortOrder = 3, UserID = "123", User = null },
                new FoodGrouping { ID = 4, Name = "Snacks", SortOrder = 4, UserID = "123", User = null }
            };

            var addResponse = new EditFoodGroupingResponse
            {
                Successful = true,
                ErrorMessage = "",
                FoodGroupings = foodGroupings
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var foodGroupingService = new MockFoodGroupingService().MockAddFoodGrouping(addResponse);

            var foodGroupingsController = new FoodGroupingsController(foodGroupingService.Object);
            foodGroupingsController.ControllerContext.HttpContext = new DefaultHttpContext();
            foodGroupingsController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)foodGroupingsController.AddFoodGrouping(request).Result;

            var response = JsonSerializer.Deserialize<EditFoodGroupingResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Single(response.FoodGroupings.Where(f => f.Name == "Snacks"));
            Assert.Equal(4, response.FoodGroupings.Count);
        }

        [Fact]
        public void FoodGroupingsController_UpdateFoodGrouping_Successful()
        {
            var request = new UpdateFoodGroupingRequest
            {
                Name = "Snackages",
                SortOrder = 4
            };

            var foodGroupings = new List<FoodGrouping>
            {
                new FoodGrouping { ID = 1, Name = "Breakfast", SortOrder = 1, UserID = "123", User = null },
                new FoodGrouping { ID = 2, Name = "Lunch", SortOrder = 2, UserID = "123", User = null },
                new FoodGrouping { ID = 3, Name = "Dinner", SortOrder = 3, UserID = "123", User = null },
                new FoodGrouping { ID = 4, Name = "Snackages", SortOrder = 4, UserID = "123", User = null }
            };

            var updateResponse = new EditFoodGroupingResponse
            {
                Successful = true,
                ErrorMessage = "",
                FoodGroupings = foodGroupings
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var foodGroupingService = new MockFoodGroupingService().MockUpdateFoodGrouping(updateResponse);

            var foodGroupingsController = new FoodGroupingsController(foodGroupingService.Object);
            foodGroupingsController.ControllerContext.HttpContext = new DefaultHttpContext();
            foodGroupingsController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)foodGroupingsController.UpdateFoodGrouping(request).Result;

            var response = JsonSerializer.Deserialize<EditFoodGroupingResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Empty(response.FoodGroupings.Where(f => f.Name == "Snacks"));
            Assert.Single(response.FoodGroupings.Where(f => f.Name == "Snackages"));
            Assert.Equal(4, response.FoodGroupings.Count);
        }

        [Fact]
        public void FoodGroupingsController_DeleteFoodGrouping_Successful()
        {
            var request = new DeleteFoodGroupingRequest
            {
                ID = 4
            };

            var foodGroupings = new List<FoodGrouping>
            {
                new FoodGrouping { ID = 1, Name = "Breakfast", SortOrder = 1, UserID = "123", User = null },
                new FoodGrouping { ID = 2, Name = "Lunch", SortOrder = 2, UserID = "123", User = null },
                new FoodGrouping { ID = 3, Name = "Dinner", SortOrder = 3, UserID = "123", User = null }
            };

            var deleteResponse = new EditFoodGroupingResponse
            {
                Successful = true,
                ErrorMessage = "",
                FoodGroupings = foodGroupings
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var foodGroupingService = new MockFoodGroupingService().MockDeleteFoodGrouping(deleteResponse);

            var foodGroupingsController = new FoodGroupingsController(foodGroupingService.Object);
            foodGroupingsController.ControllerContext.HttpContext = new DefaultHttpContext();
            foodGroupingsController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)foodGroupingsController.DeleteFoodGrouping(request).Result;

            var response = JsonSerializer.Deserialize<EditFoodGroupingResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Empty(response.FoodGroupings.Where(f => f.Name == "Snacks"));
            Assert.Empty(response.FoodGroupings.Where(f => f.Name == "Snackages"));
            Assert.Equal(3, response.FoodGroupings.Count);
        }
    }
}