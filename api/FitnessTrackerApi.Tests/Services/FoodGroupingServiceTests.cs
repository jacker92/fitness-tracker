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
    public class FoodGroupingServiceTests
    {
        private readonly ITestOutputHelper _output;

        public FoodGroupingServiceTests(ITestOutputHelper outputHelper)
        {
            _output = outputHelper;
        }

        [Fact]
        public void FoodGroupingService_GetById_ReturnsFoodGrouping()
        {
            var foodGrouping = new FoodGrouping
            {
                ID = 1,
                Name = "Lunch",
                SortOrder = 2,
                UserID = "123",
                User = null
            };

            var foodGroupingRepo = new MockRepository<FoodGrouping>();
            foodGroupingRepo.MockGetById(foodGrouping);

            var foodGroupingService = new FoodGroupingService(foodGroupingRepo.Object);

            var result = foodGroupingService.GetById(1);

            Assert.Equal("Lunch", result.Name);
            Assert.Equal(1, result.ID);
        }

        [Fact]
        public void FoodGroupingService_GetForUser_ReturnsList()
        {
            var foodGroupings = new List<FoodGrouping>
            {
                new FoodGrouping { ID = 1, Name = "Breakfast", SortOrder = 1, UserID = "123", User = null },
                new FoodGrouping { ID = 2, Name = "Lunch", SortOrder = 2, UserID = "123", User = null },
                new FoodGrouping { ID = 3, Name = "Dinner", SortOrder = 3, UserID = "123", User = null },
            };

            var foodGroupingRepo = new MockRepository<FoodGrouping>();
            foodGroupingRepo.MockGet(foodGroupings.AsQueryable());

            var foodGroupingService = new FoodGroupingService(foodGroupingRepo.Object);

            var result = foodGroupingService.GetForUser("123");

            Assert.Equal(3, result.Count);
        }

        [Fact]
        public void FoodGroupingService_AddFoodGrouping_Success()
        {
            var request = new AddFoodGroupingRequest
            {
                Name = "Snacks",
                SortOrder = 4
            };

            var user = TestDataRepository.CreateUser();

            var foodGrouping = new FoodGrouping
            {
                ID = 4,
                Name = "Snacks",
                SortOrder = 4,
                UserID = "123",
                User = null
            };

            var userFoodGroupings = new List<FoodGrouping>
            {
                new FoodGrouping { ID = 1, Name = "Breakfast", SortOrder = 1, UserID = "123", User = null },
                new FoodGrouping { ID = 2, Name = "Lunch", SortOrder = 2, UserID = "123", User = null },
                new FoodGrouping { ID = 3, Name = "Dinner", SortOrder = 3, UserID = "123", User = null },
                foodGrouping
            };

            var foodGroupingRepo = new MockRepository<FoodGrouping>();
            foodGroupingRepo.MockAdd(foodGrouping);
            foodGroupingRepo.MockGet(userFoodGroupings.AsQueryable());

            var foodGroupingService = new FoodGroupingService(foodGroupingRepo.Object);

            var response = foodGroupingService.AddFoodGrouping(user, request).Result;

            Assert.Equal(4, response.FoodGroupings.Count);
        }

        [Fact]
        public void FoodGroupingService_UpdateFoodGrouping_Success()
        {
            var request = new UpdateFoodGroupingRequest
            {
                ID = 4,
                Name = "Snackages",
                SortOrder = 4
            };

            var user = TestDataRepository.CreateUser();

            var foodGrouping = new FoodGrouping
            {
                ID = 4,
                Name = "Snackages",
                SortOrder = 4,
                UserID = "123",
                User = null
            };

            var userFoodGroupings = new List<FoodGrouping>
            {
                new FoodGrouping { ID = 1, Name = "Breakfast", SortOrder = 1, UserID = "123", User = null },
                new FoodGrouping { ID = 2, Name = "Lunch", SortOrder = 2, UserID = "123", User = null },
                new FoodGrouping { ID = 3, Name = "Dinner", SortOrder = 3, UserID = "123", User = null },
                foodGrouping
            };

            var foodGroupingRepo = new MockRepository<FoodGrouping>();
            foodGroupingRepo.MockGetById(foodGrouping);
            foodGroupingRepo.MockUpdate(foodGrouping);
            foodGroupingRepo.MockGet(userFoodGroupings.AsQueryable());

            var foodGroupingService = new FoodGroupingService(foodGroupingRepo.Object);

            var response = foodGroupingService.UpdateFoodGrouping(user, request).Result;

            Assert.Equal(4, response.FoodGroupings.Count);
        }

        [Fact]
        public void FoodGroupingService_UpdateFoodGrouping_UserDoesNotOwnFoodGrouping()
        {
            var request = new UpdateFoodGroupingRequest
            {
                ID = 4,
                Name = "Snackages",
                SortOrder = 4
            };

            var user = TestDataRepository.CreateUser("456");

            var foodGrouping = new FoodGrouping
            {
                ID = 4,
                Name = "Snackages",
                SortOrder = 4,
                UserID = "123",
                User = null
            };

            var userFoodGroupings = new List<FoodGrouping>
            {
                new FoodGrouping { ID = 1, Name = "Breakfast", SortOrder = 1, UserID = "123", User = null },
                new FoodGrouping { ID = 2, Name = "Lunch", SortOrder = 2, UserID = "123", User = null },
                new FoodGrouping { ID = 3, Name = "Dinner", SortOrder = 3, UserID = "123", User = null },
                foodGrouping
            };

            var foodGroupingRepo = new MockRepository<FoodGrouping>();
            foodGroupingRepo.MockGetById(foodGrouping);
            foodGroupingRepo.MockUpdate(foodGrouping);
            foodGroupingRepo.MockGet(userFoodGroupings.AsQueryable());

            var foodGroupingService = new FoodGroupingService(foodGroupingRepo.Object);

            var response = foodGroupingService.UpdateFoodGrouping(user, request).Result;

            Assert.Equal("Cannot find food grouping", response.ErrorMessage);
        }

        [Fact]
        public void FoodGroupingService_DeleteFoodGrouping_Success()
        {
            var request = new DeleteFoodGroupingRequest
            {
                ID = 4
            };

            var user = TestDataRepository.CreateUser();

            var foodGrouping = new FoodGrouping
            {
                ID = 4,
                Name = "Snackages",
                SortOrder = 4,
                UserID = "123",
                User = null
            };

            var userFoodGroupings = new List<FoodGrouping>
            {
                new FoodGrouping { ID = 1, Name = "Breakfast", SortOrder = 1, UserID = "123", User = null },
                new FoodGrouping { ID = 2, Name = "Lunch", SortOrder = 2, UserID = "123", User = null },
                new FoodGrouping { ID = 3, Name = "Dinner", SortOrder = 3, UserID = "123", User = null },
            };

            var foodGroupingRepo = new MockRepository<FoodGrouping>();
            foodGroupingRepo.MockGetById(foodGrouping);
            foodGroupingRepo.MockDelete();
            foodGroupingRepo.MockGet(userFoodGroupings.AsQueryable());

            var foodGroupingService = new FoodGroupingService(foodGroupingRepo.Object);

            var response = foodGroupingService.DeleteFoodGrouping(user, request).Result;

            Assert.Equal(3, response.FoodGroupings.Count);
        }

        [Fact]
        public void FoodGroupingService_DeleteFoodGrouping_UserDoesNotOwnFoodGrouping()
        {
            var request = new DeleteFoodGroupingRequest
            {
                ID = 4
            };

            var user = TestDataRepository.CreateUser("456");

            var foodGrouping = new FoodGrouping
            {
                ID = 4,
                Name = "Snackages",
                SortOrder = 4,
                UserID = "123",
                User = null
            };

            var userFoodGroupings = new List<FoodGrouping>
            {
                new FoodGrouping { ID = 1, Name = "Breakfast", SortOrder = 1, UserID = "123", User = null },
                new FoodGrouping { ID = 2, Name = "Lunch", SortOrder = 2, UserID = "123", User = null },
                new FoodGrouping { ID = 3, Name = "Dinner", SortOrder = 3, UserID = "123", User = null },
            };

            var foodGroupingRepo = new MockRepository<FoodGrouping>();
            foodGroupingRepo.MockGetById(foodGrouping);
            foodGroupingRepo.MockDelete();
            foodGroupingRepo.MockGet(userFoodGroupings.AsQueryable());

            var foodGroupingService = new FoodGroupingService(foodGroupingRepo.Object);

            var response = foodGroupingService.DeleteFoodGrouping(user, request).Result;

            Assert.Equal("Cannot find food grouping", response.ErrorMessage);
        }

    }
}