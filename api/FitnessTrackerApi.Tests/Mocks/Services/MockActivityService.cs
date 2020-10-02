using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Services;
using Moq;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Tests.Mocks.Services
{
    public class MockActivityService : Mock<IActivityService>
    {
        public MockActivityService MockGetById(Activity activity)
        {
            Setup(x => x.GetById(It.IsAny<int>()))
                .Returns(activity);

            return this;
        }

        public MockActivityService MockAddActivity(EditActivityResponse response)
        {
            Setup(x => x.AddActivity(It.IsAny<User>(), It.IsAny<AddActivityRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockActivityService MockUpdateActivity(EditActivityResponse response)
        {
            Setup(x => x.UpdateActivity(It.IsAny<User>(), It.IsAny<UpdateActivityRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockActivityService MockDeleteActivity(EditActivityResponse response)
        {
            Setup(x => x.DeleteActivity(It.IsAny<User>(), It.IsAny<DeleteActivityRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }
    }
}