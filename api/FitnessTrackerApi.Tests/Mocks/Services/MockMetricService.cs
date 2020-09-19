using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Services;
using Moq;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Tests.Mocks.Services
{
    public class MockMetricService : Mock<IMetricService>
    {
        public MockMetricService MockGetById(Metric metric)
        {
            Setup(x => x.GetById(It.IsAny<int>()))
                .Returns(metric);

            return this;
        }

        public MockMetricService MockAddMetric(EditMetricResponse response)
        {
            Setup(x => x.AddMetric(It.IsAny<User>(), It.IsAny<AddMetricRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockMetricService MockUpdateMetric(EditMetricResponse response)
        {
            Setup(x => x.UpdateMetric(It.IsAny<User>(), It.IsAny<UpdateMetricRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockMetricService MockDeleteMetric(EditMetricResponse response)
        {
            Setup(x => x.DeleteMetric(It.IsAny<User>(), It.IsAny<DeleteMetricRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }
    }
}