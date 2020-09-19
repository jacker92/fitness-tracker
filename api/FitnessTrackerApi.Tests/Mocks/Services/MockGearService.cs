using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Services;
using Moq;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Tests.Mocks.Services
{
    public class MockGearService : Mock<IGearService>
    {
        public MockGearService MockGetById(Gear gear)
        {
            Setup(x => x.GetById(It.IsAny<int>()))
                .Returns(gear);

            return this;
        }

        public MockGearService MockAddGear(EditGearResponse response)
        {
            Setup(x => x.AddGear(It.IsAny<User>(), It.IsAny<AddGearRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockGearService MockUpdateGear(EditGearResponse response)
        {
            Setup(x => x.UpdateGear(It.IsAny<User>(), It.IsAny<UpdateGearRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockGearService MockDeleteGear(EditGearResponse response)
        {
            Setup(x => x.DeleteGear(It.IsAny<User>(), It.IsAny<DeleteGearRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockGearService MockSetGearActiveFlag(EditGearResponse response)
        {
            Setup(x => x.SetGearActiveFlag(It.IsAny<User>(), It.IsAny<SetGearActiveFlagRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }
    }
}