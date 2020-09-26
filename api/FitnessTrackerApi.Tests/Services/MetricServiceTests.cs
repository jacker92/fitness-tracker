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
    public class MetricServiceTests
    {
        private readonly ITestOutputHelper _output;

        public MetricServiceTests(ITestOutputHelper output)
        {
            _output = output;
        }

        [Fact]
        public void MetricService_GetById_ReturnsMetric()
        {
            var metric = new Metric
            {
                ID = 1,
                Name = "Metric 1",
                Type = MetricType.Numeric,
                Units = "gigawatts",
                IsSystem = false,
                UserID = "123",
                User = null
            };

            var metricRepo = new MockRepository<Metric>();
            metricRepo.MockGetById(metric);

            var userTrackedMetricRepo = Mock.Of<IRepository<UserTrackedMetric>>();
            var userMetricRepo = Mock.Of<IRepository<UserMetric>>();

            var metricService = new MetricService(metricRepo.Object, userTrackedMetricRepo, userMetricRepo);

            var result = metricService.GetById(1);

            Assert.Equal("Metric 1", result.Name);
            Assert.Equal("gigawatts", result.Units);
            Assert.Equal(MetricType.Numeric, result.Type);
        }

        [Fact]
        public void MetricService_AddMetric_Success()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var newMetric = new Metric
            {
                ID = 3,
                Name = "Metric 1",
                Type = MetricType.Numeric,
                Units = "gigawatts",
                IsSystem = false,
                UserID = "123",
                User = null
            };

            var userTrackedMetrics = new List<UserTrackedMetric>
            {
                new UserTrackedMetric { ID = 1, UserID = "123", IsTracked = true, Metric = new Metric { ID = -1, Name = "Test Metric 1", Type = MetricType.Weight, IsSystem = true }, MetricID = -1, User = null },
                new UserTrackedMetric { ID = 2, UserID = "123", IsTracked = false, Metric = new Metric { ID = -2, Name = "Test Metric 2", Type = MetricType.Percentage, IsSystem = true }, MetricID = -2, User = null },
                new UserTrackedMetric { ID = 3, UserID = "123", IsTracked = true, Metric = newMetric, MetricID = 3, User = null },
            };

            var metricRepo = new MockRepository<Metric>();
            metricRepo.MockAdd(newMetric);

            var userTrackedMetricRepo = new MockRepository<UserTrackedMetric>();
            userTrackedMetricRepo.MockGet(userTrackedMetrics.AsQueryable());

            var userMetricRepo = Mock.Of<IRepository<UserMetric>>();

            var metricService = new MetricService(metricRepo.Object, userTrackedMetricRepo.Object, userMetricRepo);

            var response = metricService.AddMetric(user, new AddMetricRequest { Name = newMetric.Name, Type = newMetric.Type, Units = newMetric.Units }).Result;

            Assert.Equal(3, response.Metrics.Count);
        }

        [Fact]
        public void MetricService_UpdateMetric_Success()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var updatedMetric = new Metric
            {
                ID = 3,
                Name = "Metric 1",
                Type = MetricType.Numeric,
                Units = "jiggawatts",
                IsSystem = false,
                UserID = "123",
                User = null
            };

            var userTrackedMetrics = new List<UserTrackedMetric>
            {
                new UserTrackedMetric { ID = 1, UserID = "123", IsTracked = true, Metric = new Metric { ID = -1, Name = "Test Metric 1", Type = MetricType.Weight, IsSystem = true }, MetricID = -1, User = null },
                new UserTrackedMetric { ID = 2, UserID = "123", IsTracked = false, Metric = new Metric { ID = -2, Name = "Test Metric 2", Type = MetricType.Percentage, IsSystem = true }, MetricID = -2, User = null },
                new UserTrackedMetric { ID = 3, UserID = "123", IsTracked = true, Metric = updatedMetric, MetricID = 3, User = null },
            };

            var metricRepo = new MockRepository<Metric>();
            metricRepo.MockGetById(updatedMetric);
            metricRepo.MockUpdate(updatedMetric);

            var userTrackedMetricRepo = new MockRepository<UserTrackedMetric>();
            userTrackedMetricRepo.MockGet(userTrackedMetrics.AsQueryable());

            var userMetricRepo = Mock.Of<IRepository<UserMetric>>();

            var metricService = new MetricService(metricRepo.Object, userTrackedMetricRepo.Object, userMetricRepo);

            var response = metricService.UpdateMetric(user, new UpdateMetricRequest { ID = updatedMetric.ID, Name = updatedMetric.Name, Type = updatedMetric.Type, Units = updatedMetric.Units }).Result;

            Assert.Equal(3, response.Metrics.Count);
        }

        [Fact]
        public void MetricService_UpdateMetric_UserDoesNotOwnMetric()
        {
            var request = new UpdateMetricRequest
            {
                ID = 3,
                Name = "Metric 1",
                Type = MetricType.Numeric,
                Units = "jiggawatts",
            };

            var user = new User
            {
                Id = "456",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var updatedMetric = new Metric
            {
                ID = 3,
                Name = "Metric 1",
                Type = MetricType.Numeric,
                Units = "jiggawatts",
                IsSystem = false,
                UserID = "123",
                User = null
            };

            var userTrackedMetrics = new List<UserTrackedMetric>
            {
                new UserTrackedMetric { ID = 1, UserID = "123", IsTracked = true, Metric = new Metric { ID = -1, Name = "Test Metric 1", Type = MetricType.Weight, IsSystem = true }, MetricID = -1, User = null },
                new UserTrackedMetric { ID = 2, UserID = "123", IsTracked = false, Metric = new Metric { ID = -2, Name = "Test Metric 2", Type = MetricType.Percentage, IsSystem = true }, MetricID = -2, User = null },
                new UserTrackedMetric { ID = 3, UserID = "123", IsTracked = true, Metric = updatedMetric, MetricID = 3, User = null },
            };

            var metricRepo = new MockRepository<Metric>();
            metricRepo.MockGetById(updatedMetric);
            metricRepo.MockUpdate(updatedMetric);

            var userTrackedMetricRepo = new MockRepository<UserTrackedMetric>();
            userTrackedMetricRepo.MockGet(userTrackedMetrics.AsQueryable());

            var userMetricRepo = Mock.Of<IRepository<UserMetric>>();

            var metricService = new MetricService(metricRepo.Object, userTrackedMetricRepo.Object, userMetricRepo);

            var response = metricService.UpdateMetric(user, request).Result;

            Assert.Equal("Cannot find metric", response.ErrorMessage);
        }

        [Fact]
        public void MetricService_UpdateMetric_IsSystemMetric()
        {
            var request = new UpdateMetricRequest
            {
                ID = 3,
                Name = "Metric 1",
                Type = MetricType.Numeric,
                Units = "jiggawatts",
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var updatedMetric = new Metric
            {
                ID = 3,
                Name = "Metric 1",
                Type = MetricType.Numeric,
                Units = "jiggawatts",
                IsSystem = true,
                UserID = "123",
                User = null
            };

            var userTrackedMetrics = new List<UserTrackedMetric>
            {
                new UserTrackedMetric { ID = 1, UserID = "123", IsTracked = true, Metric = new Metric { ID = -1, Name = "Test Metric 1", Type = MetricType.Weight, IsSystem = true }, MetricID = -1, User = null },
                new UserTrackedMetric { ID = 2, UserID = "123", IsTracked = false, Metric = new Metric { ID = -2, Name = "Test Metric 2", Type = MetricType.Percentage, IsSystem = true }, MetricID = -2, User = null },
                new UserTrackedMetric { ID = 3, UserID = "123", IsTracked = true, Metric = updatedMetric, MetricID = 3, User = null },
            };

            var metricRepo = new MockRepository<Metric>();
            metricRepo.MockGetById(updatedMetric);
            metricRepo.MockUpdate(updatedMetric);

            var userTrackedMetricRepo = new MockRepository<UserTrackedMetric>();
            userTrackedMetricRepo.MockGet(userTrackedMetrics.AsQueryable());

            var userMetricRepo = Mock.Of<IRepository<UserMetric>>();

            var metricService = new MetricService(metricRepo.Object, userTrackedMetricRepo.Object, userMetricRepo);

            var response = metricService.UpdateMetric(user, request).Result;

            Assert.Equal("Cannot find metric", response.ErrorMessage);
        }

        [Fact]
        public void MetricService_DeleteMetric_Success()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var deletedMetric = new Metric
            {
                ID = 3,
                Name = "Metric 1",
                Type = MetricType.Numeric,
                Units = "jiggawatts",
                IsSystem = false,
                UserID = "123",
                User = null
            };

            var request = new DeleteMetricRequest
            {
                ID = 3
            };

            var userTrackedMetrics = new List<UserTrackedMetric>
            {
                new UserTrackedMetric { ID = 1, UserID = "123", IsTracked = true, Metric = new Metric { ID = -1, Name = "Test Metric 1", Type = MetricType.Weight, IsSystem = true }, MetricID = -1, User = null },
                new UserTrackedMetric { ID = 2, UserID = "123", IsTracked = false, Metric = new Metric { ID = -2, Name = "Test Metric 2", Type = MetricType.Percentage, IsSystem = true }, MetricID = -2, User = null }
            };

            var metricRepo = new MockRepository<Metric>();
            metricRepo.MockGetById(deletedMetric);
            metricRepo.MockDelete();

            var userTrackedMetricRepo = new MockRepository<UserTrackedMetric>();
            userTrackedMetricRepo.MockGet(userTrackedMetrics.AsQueryable());
            userTrackedMetricRepo.MockDeleteRange();

            var userMetricRepo = new MockRepository<UserMetric>();
            userMetricRepo.MockDeleteRange();

            var metricService = new MetricService(metricRepo.Object, userTrackedMetricRepo.Object, userMetricRepo.Object);

            var response = metricService.DeleteMetric(user, request).Result;

            Assert.Equal(2, response.Metrics.Count);
        }

        [Fact]
        public void MetricService_DeleteMetric_UserDoesNotOwnMetric()
        {
            var user = new User
            {
                Id = "456",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var deletedMetric = new Metric
            {
                ID = 3,
                Name = "Metric 1",
                Type = MetricType.Numeric,
                Units = "jiggawatts",
                IsSystem = false,
                UserID = "123",
                User = null
            };

            var request = new DeleteMetricRequest
            {
                ID = 3
            };

            var userTrackedMetrics = new List<UserTrackedMetric>
            {
                new UserTrackedMetric { ID = 1, UserID = "123", IsTracked = true, Metric = new Metric { ID = -1, Name = "Test Metric 1", Type = MetricType.Weight, IsSystem = true }, MetricID = -1, User = null },
                new UserTrackedMetric { ID = 2, UserID = "123", IsTracked = false, Metric = new Metric { ID = -2, Name = "Test Metric 2", Type = MetricType.Percentage, IsSystem = true }, MetricID = -2, User = null }
            };

            var metricRepo = new MockRepository<Metric>();
            metricRepo.MockGetById(deletedMetric);
            metricRepo.MockDelete();

            var userTrackedMetricRepo = new MockRepository<UserTrackedMetric>();
            userTrackedMetricRepo.MockGet(userTrackedMetrics.AsQueryable());
            userTrackedMetricRepo.MockDeleteRange();

            var userMetricRepo = new MockRepository<UserMetric>();
            userMetricRepo.MockDeleteRange();

            var metricService = new MetricService(metricRepo.Object, userTrackedMetricRepo.Object, userMetricRepo.Object);

            var response = metricService.DeleteMetric(user, request).Result;

            Assert.Equal("Cannot find metric", response.ErrorMessage);
        }

        [Fact]
        public void MetricService_DeleteMetric_IsSystemMetric()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var deletedMetric = new Metric
            {
                ID = 3,
                Name = "Metric 1",
                Type = MetricType.Numeric,
                Units = "jiggawatts",
                IsSystem = true,
                UserID = "123",
                User = null
            };

            var request = new DeleteMetricRequest
            {
                ID = 3
            };

            var userTrackedMetrics = new List<UserTrackedMetric>
            {
                new UserTrackedMetric { ID = 1, UserID = "123", IsTracked = true, Metric = new Metric { ID = -1, Name = "Test Metric 1", Type = MetricType.Weight, IsSystem = true }, MetricID = -1, User = null },
                new UserTrackedMetric { ID = 2, UserID = "123", IsTracked = false, Metric = new Metric { ID = -2, Name = "Test Metric 2", Type = MetricType.Percentage, IsSystem = true }, MetricID = -2, User = null }
            };

            var metricRepo = new MockRepository<Metric>();
            metricRepo.MockGetById(deletedMetric);
            metricRepo.MockDelete();

            var userTrackedMetricRepo = new MockRepository<UserTrackedMetric>();
            userTrackedMetricRepo.MockGet(userTrackedMetrics.AsQueryable());
            userTrackedMetricRepo.MockDeleteRange();

            var userMetricRepo = new MockRepository<UserMetric>();
            userMetricRepo.MockDeleteRange();

            var metricService = new MetricService(metricRepo.Object, userTrackedMetricRepo.Object, userMetricRepo.Object);

            var response = metricService.DeleteMetric(user, request).Result;

            Assert.Equal("Cannot find metric", response.ErrorMessage);
        }
    }
}