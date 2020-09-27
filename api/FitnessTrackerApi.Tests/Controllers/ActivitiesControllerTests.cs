using FitnessTrackerApi.Controllers;
using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Tests.Mocks.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
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
        public void ActivitiesController_GetActivity_ReturnsActivity()
        {
            var activity = new Activity
            {
                ID = 1,
                Name = "Hockey",
                Type = ActivityMetricType.None,
                EstimatedCaloriesBurnedPerMinute = 10,
                IsSystem = false,
                UserID = "123",
                User = null
            };

            var activityService = new MockActivityService().MockGetById(activity);
            var activitiesController = new ActivitiesController(activityService.Object);

            var result = (OkObjectResult)activitiesController.GetActivity(1);

            var response = JsonSerializer.Deserialize<GetActivityResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal(activity.Name, response.Activity.Name);
            Assert.Equal(activity.EstimatedCaloriesBurnedPerMinute, response.Activity.EstimatedCaloriesBurnedPerMinute);
            Assert.Equal(activity.Type, response.Activity.Type);
        }

        [Fact]
        public void MetricController_GetMetric_MetricNotFound()
        {
            var activityService = new MockActivityService().MockGetById((Activity)null);
            var activitiesController = new ActivitiesController(activityService.Object);

            var result = (OkObjectResult)activitiesController.GetActivity(1);

            var response = JsonSerializer.Deserialize<GetActivityResponse>(result.Value.ToString());

            Assert.False(response.Successful);
            Assert.Equal("Metric not found", response.ErrorMessage);
        }

        [Fact]
        public void ActivitiesController_AddActivity_Successful()
        {
            var request = new AddActivityRequest
            {
                Name = "Table Tennis",
                EstimatedCaloriesBurnedPerMinute = 2,
                Type = ActivityMetricType.None
            };

            var activities = new List<Activity>
            {
                new Activity { ID = 1, Name = "Tennis", Type = ActivityMetricType.None, EstimatedCaloriesBurnedPerMinute = 2, UserID = "123", User = null },
                new Activity { ID = 2, Name = "Kayaking", Type = ActivityMetricType.Distance, EstimatedCaloriesBurnedPerMinute = 4, UserID = "123", User = null },
                new Activity { ID = 3, Name = "Table Tennis", Type = ActivityMetricType.None, EstimatedCaloriesBurnedPerMinute = 2, UserID = "123", User = null }
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
                ID = 3,
                Name = "Table Tennis",
                EstimatedCaloriesBurnedPerMinute = 6,
                Type = ActivityMetricType.None
            };

            var activities = new List<Activity>
            {
                new Activity { ID = 1, Name = "Tennis", Type = ActivityMetricType.None, EstimatedCaloriesBurnedPerMinute = 2, UserID = "123", User = null },
                new Activity { ID = 2, Name = "Kayaking", Type = ActivityMetricType.Distance, EstimatedCaloriesBurnedPerMinute = 4, UserID = "123", User = null },
                new Activity { ID = 3, Name = "Table Tennis", Type = ActivityMetricType.None, EstimatedCaloriesBurnedPerMinute = 6, UserID = "123", User = null }
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
                ID = 3
            };

            var activities = new List<Activity>
            {
                new Activity { ID = 1, Name = "Tennis", Type = ActivityMetricType.None, EstimatedCaloriesBurnedPerMinute = 2, UserID = "123", User = null },
                new Activity { ID = 2, Name = "Kayaking", Type = ActivityMetricType.Distance, EstimatedCaloriesBurnedPerMinute = 4, UserID = "123", User = null }
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