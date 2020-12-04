using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Services;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Tests.Mocks.Services
{
    public class MockFoodService : Mock<IFoodService>
    {
        public MockFoodService MockGetById(Food food)
        {
            Setup(x => x.GetById(It.IsAny<int>()))
                .Returns(food);

            return this;
        }

        public MockFoodService MockGetForUser(List<Food> foods)
        {
            Setup(x => x.GetForUser(It.IsAny<string>(), It.IsAny<bool>()))
                .Returns(foods);

            return this;
        }

        public MockFoodService MockAddFood(EditFoodResponse response)
        {
            Setup(x => x.AddFood(It.IsAny<User>(), It.IsAny<AddFoodRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }


        public MockFoodService MockUpdateFood(EditFoodResponse response)
        {
            Setup(x => x.UpdateFood(It.IsAny<User>(), It.IsAny<UpdateFoodRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockFoodService MockDeleteFood(EditFoodResponse response)
        {
            Setup(x => x.DeleteFood(It.IsAny<User>(), It.IsAny<DeleteFoodRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockFoodService MockSearch(List<Food> foods)
        {
            Setup(x => x.Search(It.IsAny<User>(), It.IsAny<string>()))
                .Returns(foods);

            return this;
        }
    }
}