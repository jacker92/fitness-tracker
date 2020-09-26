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
    public class ActivityServiceTests
    {
        private readonly ITestOutputHelper _output;

        public ActivityServiceTests(ITestOutputHelper output)
        {
            _output = output;
        }

        [Fact]
        public void ActivityService_GetById_ReturnsActivity()
        {
            var activity = new Activity
            {
                ID = 1,
                UserID = "123",
                Name = "Hockey",
                EstimatedCaloriesBurnedPerMinute = 10,
                IsSystem = false,
                Type = ActivityMetricType.None,
                User = null
            };

            var activityRepo = new MockRepository<Activity>();
            activityRepo.MockGetById(activity);

            var userActivityRepo = Mock.Of<IRepository<UserActivity>>();

            var activityService = new ActivityService(activityRepo.Object, userActivityRepo);

            var result = activityService.GetById(1);

            Assert.Equal("Hockey", result.Name);
            Assert.Equal(10, result.EstimatedCaloriesBurnedPerMinute);
            Assert.Equal(ActivityMetricType.None, result.Type);
        }

        [Fact]
        public void ActivityService_AddActivity_Success()
        {
            var request = new AddActivityRequest
            {
                Name = "Baseball",
                EstimatedCaloriesBurnedPerMinute = 1,
                Type = ActivityMetricType.None
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var activity = new Activity
            {
                ID = 2,
                UserID = "123",
                Name = request.Name,
                EstimatedCaloriesBurnedPerMinute = request.EstimatedCaloriesBurnedPerMinute,
                IsSystem = false,
                Type = request.Type,
                User = null
            };

            var activities = new List<Activity>
            {
                new Activity
                {
                    ID = 1,
                    UserID = "123",
                    Name = "Hockey",
                    EstimatedCaloriesBurnedPerMinute = 10,
                    IsSystem = false,
                    Type = ActivityMetricType.None,
                    User = null
                },
                activity
            };

            var activityRepo = new MockRepository<Activity>();
            activityRepo.MockAdd(activity);
            activityRepo.MockGet(activities.AsQueryable());

            var userActivityRepo = Mock.Of<IRepository<UserActivity>>();

            var activityService = new ActivityService(activityRepo.Object, userActivityRepo);

            var response = activityService.AddActivity(user, request).Result;

            Assert.Equal(2, response.Activities.Count);
        }

        [Fact]
        public void ActivityService_UpdateActivity_Success()
        {
            var request = new UpdateActivityRequest
            {
                ID = 2,
                Name = "Baseball",
                EstimatedCaloriesBurnedPerMinute = 3,
                Type = ActivityMetricType.None
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var activity = new Activity
            {
                ID = 2,
                UserID = "123",
                Name = request.Name,
                EstimatedCaloriesBurnedPerMinute = request.EstimatedCaloriesBurnedPerMinute,
                IsSystem = false,
                Type = request.Type,
                User = null
            };

            var activities = new List<Activity>
            {
                new Activity
                {
                    ID = 1,
                    UserID = "123",
                    Name = "Hockey",
                    EstimatedCaloriesBurnedPerMinute = 10,
                    IsSystem = false,
                    Type = ActivityMetricType.None,
                    User = null
                },
                activity
            };

            var activityRepo = new MockRepository<Activity>();
            activityRepo.MockGetById(activity);
            activityRepo.MockUpdate(activity);
            activityRepo.MockGet(activities.AsQueryable());

            var userActivityRepo = Mock.Of<IRepository<UserActivity>>();

            var activityService = new ActivityService(activityRepo.Object, userActivityRepo);

            var response = activityService.UpdateActivity(user, request).Result;

            Assert.Equal(2, response.Activities.Count);
        }

        [Fact]
        public void ActivityService_UpdateActivity_UserDoesNotOwnActivity()
        {
            var request = new UpdateActivityRequest
            {
                ID = 2,
                Name = "Baseball",
                EstimatedCaloriesBurnedPerMinute = 3,
                Type = ActivityMetricType.None
            };

            var user = new User
            {
                Id = "456",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var activity = new Activity
            {
                ID = 2,
                UserID = "123",
                Name = request.Name,
                EstimatedCaloriesBurnedPerMinute = request.EstimatedCaloriesBurnedPerMinute,
                IsSystem = false,
                Type = request.Type,
                User = null
            };

            var activities = new List<Activity>
            {
                new Activity
                {
                    ID = 1,
                    UserID = "123",
                    Name = "Hockey",
                    EstimatedCaloriesBurnedPerMinute = 10,
                    IsSystem = false,
                    Type = ActivityMetricType.None,
                    User = null
                },
                activity
            };

            var activityRepo = new MockRepository<Activity>();
            activityRepo.MockGetById(activity);
            activityRepo.MockUpdate(activity);
            activityRepo.MockGet(activities.AsQueryable());

            var userActivityRepo = Mock.Of<IRepository<UserActivity>>();

            var activityService = new ActivityService(activityRepo.Object, userActivityRepo);

            var response = activityService.UpdateActivity(user, request).Result;

            Assert.Equal("Cannot find activity", response.ErrorMessage);
        }

        [Fact]
        public void ActivityService_UpdateActivity_IsSystemActivity()
        {
            var request = new UpdateActivityRequest
            {
                ID = 2,
                Name = "Baseball",
                EstimatedCaloriesBurnedPerMinute = 3,
                Type = ActivityMetricType.None
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var activity = new Activity
            {
                ID = 2,
                UserID = "123",
                Name = request.Name,
                EstimatedCaloriesBurnedPerMinute = request.EstimatedCaloriesBurnedPerMinute,
                IsSystem = true,
                Type = request.Type,
                User = null
            };

            var activities = new List<Activity>
            {
                new Activity
                {
                    ID = 1,
                    UserID = "123",
                    Name = "Hockey",
                    EstimatedCaloriesBurnedPerMinute = 10,
                    IsSystem = false,
                    Type = ActivityMetricType.None,
                    User = null
                },
                activity
            };

            var activityRepo = new MockRepository<Activity>();
            activityRepo.MockGetById(activity);
            activityRepo.MockUpdate(activity);
            activityRepo.MockGet(activities.AsQueryable());

            var userActivityRepo = Mock.Of<IRepository<UserActivity>>();

            var activityService = new ActivityService(activityRepo.Object, userActivityRepo);

            var response = activityService.UpdateActivity(user, request).Result;

            Assert.Equal("Cannot find activity", response.ErrorMessage);
        }

        [Fact]
        public void ActivityService_DeleteActivity_Success()
        {
            var request = new DeleteActivityRequest
            {
                ID = 2
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var activity = new Activity
            {
                ID = 2,
                UserID = "123",
                Name = "Baseball",
                EstimatedCaloriesBurnedPerMinute = 1,
                IsSystem = false,
                Type = ActivityMetricType.None,
                User = null
            };

            var activities = new List<Activity>
            {
                new Activity
                {
                    ID = 1,
                    UserID = "123",
                    Name = "Hockey",
                    EstimatedCaloriesBurnedPerMinute = 10,
                    IsSystem = false,
                    Type = ActivityMetricType.None,
                    User = null
                }
            };

            var activityRepo = new MockRepository<Activity>();
            activityRepo.MockGetById(activity);
            activityRepo.MockDelete();
            activityRepo.MockGet(activities.AsQueryable());

            var userActivityRepo = Mock.Of<IRepository<UserActivity>>();

            var activityService = new ActivityService(activityRepo.Object, userActivityRepo);

            var response = activityService.DeleteActivity(user, request).Result;

            Assert.Single(response.Activities);
        }

        [Fact]
        public void ActivityService_DeleteActivity_UserDoesNotOwnActivity()
        {
            var request = new DeleteActivityRequest
            {
                ID = 2
            };

            var user = new User
            {
                Id = "456",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var activity = new Activity
            {
                ID = 2,
                UserID = "123",
                Name = "Baseball",
                EstimatedCaloriesBurnedPerMinute = 1,
                IsSystem = false,
                Type = ActivityMetricType.None,
                User = null
            };

            var activities = new List<Activity>
            {
                new Activity
                {
                    ID = 1,
                    UserID = "123",
                    Name = "Hockey",
                    EstimatedCaloriesBurnedPerMinute = 10,
                    IsSystem = false,
                    Type = ActivityMetricType.None,
                    User = null
                }
            };

            var activityRepo = new MockRepository<Activity>();
            activityRepo.MockGetById(activity);
            activityRepo.MockDelete();
            activityRepo.MockGet(activities.AsQueryable());

            var userActivityRepo = Mock.Of<IRepository<UserActivity>>();

            var activityService = new ActivityService(activityRepo.Object, userActivityRepo);

            var response = activityService.DeleteActivity(user, request).Result;

            Assert.Equal("Cannot find activity", response.ErrorMessage);
        }

        [Fact]
        public void ActivityService_DeleteActivity_IsSystemActivity()
        {
            var request = new DeleteActivityRequest
            {
                ID = 2
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var activity = new Activity
            {
                ID = 2,
                UserID = "123",
                Name = "Baseball",
                EstimatedCaloriesBurnedPerMinute = 1,
                IsSystem = true,
                Type = ActivityMetricType.None,
                User = null
            };

            var activities = new List<Activity>
            {
                new Activity
                {
                    ID = 1,
                    UserID = "123",
                    Name = "Hockey",
                    EstimatedCaloriesBurnedPerMinute = 10,
                    IsSystem = false,
                    Type = ActivityMetricType.None,
                    User = null
                }
            };

            var activityRepo = new MockRepository<Activity>();
            activityRepo.MockGetById(activity);
            activityRepo.MockDelete();
            activityRepo.MockGet(activities.AsQueryable());

            var userActivityRepo = Mock.Of<IRepository<UserActivity>>();

            var activityService = new ActivityService(activityRepo.Object, userActivityRepo);

            var response = activityService.DeleteActivity(user, request).Result;

            Assert.Equal("Cannot find activity", response.ErrorMessage);
        }
    }
}