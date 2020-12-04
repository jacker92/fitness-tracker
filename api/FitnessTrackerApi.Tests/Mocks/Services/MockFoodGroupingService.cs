using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Services;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Tests.Mocks.Services
{
    public class MockFoodGroupingService : Mock<IFoodGroupingService>
    {
        public MockFoodGroupingService MockGetById(FoodGrouping foodGrouping)
        {
            Setup(x => x.GetById(It.IsAny<int>()))
                .Returns(foodGrouping);

            return this;
        }

        public MockFoodGroupingService MockGetForUser(List<FoodGrouping> foodGroupings)
        {
            Setup(x => x.GetForUser(It.IsAny<string>()))
                .Returns(foodGroupings);

            return this;
        }

        public MockFoodGroupingService MockAddFoodGrouping(EditFoodGroupingResponse response)
        {
            Setup(x => x.AddFoodGrouping(It.IsAny<User>(), It.IsAny<AddFoodGroupingRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }


        public MockFoodGroupingService MockUpdateFoodGrouping(EditFoodGroupingResponse response)
        {
            Setup(x => x.UpdateFoodGrouping(It.IsAny<User>(), It.IsAny<UpdateFoodGroupingRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockFoodGroupingService MockDeleteFoodGrouping(EditFoodGroupingResponse response)
        {
            Setup(x => x.DeleteFoodGrouping(It.IsAny<User>(), It.IsAny<DeleteFoodGroupingRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }
    }
}