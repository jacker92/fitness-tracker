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
    public class FoodServiceTests
    {
        private readonly ITestOutputHelper _output;

        public FoodServiceTests(ITestOutputHelper outputHelper)
        {
            _output = outputHelper;
        }

        [Fact]
        public void FoodService_GetById_ReturnsFood()
        {
            var food = new Food
            {
                ID = 1,
                ServingSize = "16 oz.",
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

            var foodRepo = new MockRepository<Food>();
            foodRepo.MockGetById(food);

            var foodService = new FoodService(foodRepo.Object);

            var result = foodService.GetById(1);

            Assert.Equal("16 oz.", result.ServingSize);
            Assert.Equal(1, result.ID);
            Assert.Equal(300, result.Calories);
            Assert.False(result.IsAlcoholic);
            Assert.Equal(30, result.Protein);
        }

        [Fact]
        public void FoodService_GetForUser_ReturnsList()
        {
            var userFoods = new List<Food>
            {
                new Food { ID = 1, ServingSize = "16 oz.", Calories = 300, Carbohydrates = 25, Fat = 12, IsAlcoholic = false, IsPublic = false, Name = "Ribeye", Protein = 30, Sugar = 1, UserID = "123", User = null },
                new Food { ID = 2, ServingSize = "12 oz.", Calories = 300, Carbohydrates = 20, Fat = 10, IsAlcoholic = false, IsPublic = true, Name = "NY Strip", Protein = 20, Sugar = 1, UserID = "123", User = null },
                new Food { ID = 3, ServingSize = "8 oz.", Calories = 300, Carbohydrates = 15, Fat = 8, IsAlcoholic = false, IsPublic = false, Name = "Delmonico", Protein = 10, Sugar = 1, UserID = "123", User = null }
            };

            var foodRepo = new MockRepository<Food>();
            foodRepo.MockGet(userFoods.AsQueryable());

            var foodService = new FoodService(foodRepo.Object);

            var result = foodService.GetForUser("123");

            Assert.Equal(3, result.Count);
            Assert.Single(result.Where(f => f.IsPublic));
        }

        [Fact]
        public void FoodService_AddFood_Success()
        {
            var request = new AddFoodRequest
            {
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

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var food = new Food
            {
                ID = 1,
                ServingSize = "16 oz.",
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

            var userFoods = new List<Food>
            {
                new Food { ID = 2, ServingSize = "12 oz.", Calories = 300, Carbohydrates = 20, Fat = 10, IsAlcoholic = false, IsPublic = true, Name = "NY Strip", Protein = 20, Sugar = 1, UserID = "123", User = null },
                new Food { ID = 3, ServingSize = "8 oz.", Calories = 300, Carbohydrates = 15, Fat = 8, IsAlcoholic = false, IsPublic = false, Name = "Delmonico", Protein = 10, Sugar = 1, UserID = "123", User = null },
                food
            };

            var foodRepo = new MockRepository<Food>();
            foodRepo.MockAdd(food);
            foodRepo.MockGet(userFoods.AsQueryable());

            var foodService = new FoodService(foodRepo.Object);

            var response = foodService.AddFood(user, request).Result;

            Assert.Equal(3, response.Foods.Count);
        }

        [Fact]
        public void FoodService_UpdateFood_Success()
        {
            var request = new UpdateFoodRequest
            {
                ID = 1,
                ServingSize = "17 oz.",
                Calories = 300,
                Carbohydrates = 25,
                Fat = 12,
                IsAlcoholic = false,
                IsPublic = false,
                Name = "Ribeye",
                Protein = 30,
                Sugar = 1
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var food = new Food
            {
                ID = 1,
                ServingSize = "16 oz.",
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

            var userFoods = new List<Food>
            {
                new Food { ID = 1, ServingSize = "17 oz.", Calories = 300, Carbohydrates = 25, Fat = 12, IsAlcoholic = false, IsPublic = false, Name = "Ribeye", Protein = 30, Sugar = 1, UserID = "123", User = null },
                new Food { ID = 2, ServingSize = "12 oz.", Calories = 300, Carbohydrates = 20, Fat = 10, IsAlcoholic = false, IsPublic = true, Name = "NY Strip", Protein = 20, Sugar = 1, UserID = "123", User = null },
                new Food { ID = 3, ServingSize = "8 oz.", Calories = 300, Carbohydrates = 15, Fat = 8, IsAlcoholic = false, IsPublic = false, Name = "Delmonico", Protein = 10, Sugar = 1, UserID = "123", User = null }
            };

            var foodRepo = new MockRepository<Food>();
            foodRepo.MockGetById(food);
            foodRepo.MockUpdate(food);
            foodRepo.MockGet(userFoods.AsQueryable());

            var foodService = new FoodService(foodRepo.Object);

            var response = foodService.UpdateFood(user, request).Result;

            Assert.Equal(3, response.Foods.Count);
        }

        [Fact]
        public void FoodService_UpdateFood_UserDoesNotOwnFood()
        {
            var request = new UpdateFoodRequest
            {
                ID = 1,
                ServingSize = "17 oz.",
                Calories = 300,
                Carbohydrates = 25,
                Fat = 12,
                IsAlcoholic = false,
                IsPublic = false,
                Name = "Ribeye",
                Protein = 30,
                Sugar = 1
            };

            var user = new User
            {
                Id = "456",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var food = new Food
            {
                ID = 1,
                ServingSize = "16 oz.",
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

            var userFoods = new List<Food>
            {
                new Food { ID = 1, ServingSize = "16 oz.", Calories = 300, Carbohydrates = 25, Fat = 12, IsAlcoholic = false, IsPublic = false, Name = "Ribeye", Protein = 30, Sugar = 1, UserID = "123", User = null },
                new Food { ID = 2, ServingSize = "12 oz.", Calories = 300, Carbohydrates = 20, Fat = 10, IsAlcoholic = false, IsPublic = true, Name = "NY Strip", Protein = 20, Sugar = 1, UserID = "123", User = null },
                new Food { ID = 3, ServingSize = "8 oz.", Calories = 300, Carbohydrates = 15, Fat = 8, IsAlcoholic = false, IsPublic = false, Name = "Delmonico", Protein = 10, Sugar = 1, UserID = "123", User = null }
            };

            var foodRepo = new MockRepository<Food>();
            foodRepo.MockGetById(food);
            foodRepo.MockUpdate(food);
            foodRepo.MockGet(userFoods.AsQueryable());

            var foodService = new FoodService(foodRepo.Object);

            var response = foodService.UpdateFood(user, request).Result;

            Assert.Equal("Cannot find food", response.ErrorMessage);
        }

        [Fact]
        public void FoodService_DeleteFood_Success()
        {
            var request = new DeleteFoodRequest
            {
                ID = 1
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var food = new Food
            {
                ID = 1,
                ServingSize = "16 oz.",
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

            var userFoods = new List<Food>
            {
                new Food { ID = 2, ServingSize = "12 oz.", Calories = 300, Carbohydrates = 20, Fat = 10, IsAlcoholic = false, IsPublic = true, Name = "NY Strip", Protein = 20, Sugar = 1, UserID = "123", User = null },
                new Food { ID = 3, ServingSize = "8 oz.", Calories = 300, Carbohydrates = 15, Fat = 8, IsAlcoholic = false, IsPublic = false, Name = "Delmonico", Protein = 10, Sugar = 1, UserID = "123", User = null }
            };

            var foodRepo = new MockRepository<Food>();
            foodRepo.MockGetById(food);
            foodRepo.MockDelete();
            foodRepo.MockGet(userFoods.AsQueryable());

            var foodService = new FoodService(foodRepo.Object);

            var response = foodService.DeleteFood(user, request).Result;

            Assert.Equal(2, response.Foods.Count);
        }

        [Fact]
        public void FoodService_DeleteFood_UserDoesNotOwnFood()
        {
            var request = new DeleteFoodRequest
            {
                ID = 1
            };

            var user = new User
            {
                Id = "456",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var food = new Food
            {
                ID = 1,
                ServingSize = "16 oz.",
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

            var userFoods = new List<Food>
            {
                new Food { ID = 2, ServingSize = "12 oz.", Calories = 300, Carbohydrates = 20, Fat = 10, IsAlcoholic = false, IsPublic = true, Name = "NY Strip", Protein = 20, Sugar = 1, UserID = "123", User = null },
                new Food { ID = 3, ServingSize = "8 oz.", Calories = 300, Carbohydrates = 15, Fat = 8, IsAlcoholic = false, IsPublic = false, Name = "Delmonico", Protein = 10, Sugar = 1, UserID = "123", User = null }
            };

            var foodRepo = new MockRepository<Food>();
            foodRepo.MockGetById(food);
            foodRepo.MockDelete();
            foodRepo.MockGet(userFoods.AsQueryable());

            var foodService = new FoodService(foodRepo.Object);

            var response = foodService.DeleteFood(user, request).Result;

            Assert.Equal("Cannot find food", response.ErrorMessage);
        }

    }
}