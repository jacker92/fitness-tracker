using FitnessTrackerApi.Controllers;
using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Tests.Mocks.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Text.Json;
using Xunit;
using Xunit.Abstractions;

namespace FitnessTrackerApi.Tests.Controllers
{
    public class ActivitiesControllerTests
    {
        private readonly ITestOutputHelper _output;

        public ActivitiesControllerTests(ITestOutputHelper output)
        {
            _output = output;
        }

        [Fact]
        public void ActivitiesController_GetActivity_ReturnsMetric()
        {
            var activity = new Activity
            {
                ID = 1,
                Name = "Hockey",
                EstimatedCaloriesBurnedPerMinute = 12,
                IsSystem = false,
                Type = ActivityMetricType.None,
                UserID = "123",
                User = null
            };

            var activityService = new MockActivityService().MockGetById(activity);

            var activitiesController = new ActivitiesController(activityService.Object);

            var result = (OkObjectResult)activitiesController.GetActivity(1);

            var response = JsonSerializer.Deserialize<GetActivityResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal(activity.Name, response.Activity.Name);
            Assert.Equal(activity.Type, response.Activity.Type);
            Assert.Equal(activity.EstimatedCaloriesBurnedPerMinute, response.Activity.EstimatedCaloriesBurnedPerMinute);
        }

        [Fact]
        public void ActivitiesController_AddActivity_Successful()
        {
            var request = new AddActivityRequest
            {
                Name = "Hockey",
                Type = ActivityMetricType.None,
                EstimatedCaloriesBurnedPerMinute = 12
            };

            var activities = new List<Activity>
            {
                new Activity { ID = -2, Name = "Run", EstimatedCaloriesBurnedPerMinute = 10, Type = ActivityMetricType.Distance, IsSystem = true, UserID = null, User = null },
                new Activity { ID = -1, Name = "Walk", EstimatedCaloriesBurnedPerMinute = 5, Type = ActivityMetricType.Distance, IsSystem = true, UserID = null, User = null },
                new Activity { ID = 1, Name = "Hockey", EstimatedCaloriesBurnedPerMinute = 12, Type = ActivityMetricType.None, IsSystem = false, UserID = "123", User = null }
            };

            var editResponse = new EditActivityResponse
            {
                Successful = true,
                ErrorMessage = "",
                Activities = activities
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var activityService = new MockActivityService().MockAddActivity(editResponse);

            var activitiesController = new ActivitiesController(activityService.Object);
            activitiesController.ControllerContext.HttpContext = new DefaultHttpContext();
            activitiesController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)activitiesController.AddActivity(request).Result;

            var response = JsonSerializer.Deserialize<EditActivityResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal(3, response.Activities.Count);
        }

        [Fact]
        public void ActivitiesController_UpdateActivity_Successful()
        {
            var request = new UpdateActivityRequest
            {
                ID = 1,
                Name = "Ice Hockey",
                Type = ActivityMetricType.None,
                EstimatedCaloriesBurnedPerMinute = 12
            };

            var activities = new List<Activity>
            {
                new Activity { ID = -2, Name = "Run", EstimatedCaloriesBurnedPerMinute = 10, Type = ActivityMetricType.Distance, IsSystem = true, UserID = null, User = null },
                new Activity { ID = -1, Name = "Walk", EstimatedCaloriesBurnedPerMinute = 5, Type = ActivityMetricType.Distance, IsSystem = true, UserID = null, User = null },
                new Activity { ID = 1, Name = "Ice Hockey", EstimatedCaloriesBurnedPerMinute = 12, Type = ActivityMetricType.None, IsSystem = false, UserID = "123", User = null }
            };

            var editResponse = new EditActivityResponse
            {
                Successful = true,
                ErrorMessage = "",
                Activities = activities
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var activityService = new MockActivityService().MockUpdateActivity(editResponse);

            var activitiesController = new ActivitiesController(activityService.Object);
            activitiesController.ControllerContext.HttpContext = new DefaultHttpContext();
            activitiesController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)activitiesController.UpdateActivity(request).Result;

            var response = JsonSerializer.Deserialize<EditActivityResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal(3, response.Activities.Count);
        }

        [Fact]
        public void ActivitiesController_DeleteActivity_Successful()
        {
            var request = new DeleteActivityRequest
            {
                ID = 1
            };

            var activities = new List<Activity>
            {
                new Activity { ID = -2, Name = "Run", EstimatedCaloriesBurnedPerMinute = 10, Type = ActivityMetricType.Distance, IsSystem = true, UserID = null, User = null },
                new Activity { ID = -1, Name = "Walk", EstimatedCaloriesBurnedPerMinute = 5, Type = ActivityMetricType.Distance, IsSystem = true, UserID = null, User = null }
            };

            var editResponse = new EditActivityResponse
            {
                Successful = true,
                ErrorMessage = "",
                Activities = activities
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var activityService = new MockActivityService().MockDeleteActivity(editResponse);

            var activitiesController = new ActivitiesController(activityService.Object);
            activitiesController.ControllerContext.HttpContext = new DefaultHttpContext();
            activitiesController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)activitiesController.DeleteActivity(request).Result;

            var response = JsonSerializer.Deserialize<EditActivityResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal(2, response.Activities.Count);
        }
    }
}