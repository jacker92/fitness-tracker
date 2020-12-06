using FitnessTrackerApi.Controllers;
using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Tests.Mocks.Repositories;
using FitnessTrackerApi.Tests.Mocks.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Text.Json;
using Xunit;
using Xunit.Abstractions;

namespace FitnessTrackerApi.Tests.Controllers
{
    public class MetricsControllerTests
    {
        private readonly ITestOutputHelper _output;

        public MetricsControllerTests(ITestOutputHelper output)
        {
            _output = output;
        }

        [Fact]
        public void MetricController_GetMetric_ReturnsMetric()
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

            var metricService = new MockMetricService().MockGetById(metric);

            var metricController = new MetricsController(metricService.Object);

            var result = (OkObjectResult)metricController.GetMetric(1);

            var response = JsonSerializer.Deserialize<GetMetricResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal(metric.Name, response.Metric.Name);
            Assert.Equal(metric.Units, response.Metric.Units);
        }

        [Fact]
        public void MetricController_GetMetric_MetricNotFound()
        {
            var metricService = new MockMetricService().MockGetById((Metric)null);

            var metricController = new MetricsController(metricService.Object);

            var result = (OkObjectResult)metricController.GetMetric(1);

            var response = JsonSerializer.Deserialize<GetMetricResponse>(result.Value.ToString());

            Assert.False(response.Successful);
            Assert.Equal("Metric not found", response.ErrorMessage);
        }

        [Fact]
        public void MetricController_AddCustomMetric_Successful()
        {
            var request = new AddMetricRequest
            {
                Name = "BMI",
                Type = MetricType.Numeric
            };

            var trackedMetrics = new List<UserTrackedMetric>
            {
                new UserTrackedMetric { ID = 1, MetricID = -2, Metric = new Metric { ID = -2, Name = "Weight", Type = MetricType.Weight, IsSystem = true }, UserID = "123" },
                new UserTrackedMetric { ID = 2, MetricID = -1, Metric = new Metric { ID = -1, Name = "Body Fat %", Type = MetricType.Percentage, IsSystem = true }, UserID = "123" },
                new UserTrackedMetric { ID = 3, MetricID = 1, Metric = new Metric { ID = 1, Name = "BMI", Type = MetricType.Numeric, IsSystem = false }, UserID = "123" }
            };

            var editResponse = new EditMetricResponse
            {
                Successful = true,
                ErrorMessage = "",
                Metrics = trackedMetrics
            };

            var metricService = new MockMetricService().MockAddMetric(editResponse);

            var metricController = new MetricsController(metricService.Object);
            metricController.ControllerContext.HttpContext = new DefaultHttpContext();
            metricController.ControllerContext.HttpContext.Items["User"] = TestDataRepository.CreateUser();

            var result = (OkObjectResult)metricController.AddCustomMetric(request).Result;

            var response = JsonSerializer.Deserialize<EditMetricResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal(3, response.Metrics.Count);
        }

        [Fact]
        public void MetricController_UpdateCustomMetric_Successful()
        {
            var request = new UpdateMetricRequest
            {
                ID = 1,
                Name = "Body Mass Index",
                Type = MetricType.Numeric
            };

            var trackedMetrics = new List<UserTrackedMetric>
            {
                new UserTrackedMetric { ID = 1, MetricID = -2, Metric = new Metric { ID = -2, Name = "Weight", Type = MetricType.Weight, IsSystem = true }, UserID = "123" },
                new UserTrackedMetric { ID = 2, MetricID = -1, Metric = new Metric { ID = -1, Name = "Body Fat %", Type = MetricType.Percentage, IsSystem = true }, UserID = "123" },
                new UserTrackedMetric { ID = 3, MetricID = 1, Metric = new Metric { ID = 1, Name = "Body Mass Index", Type = MetricType.Numeric, IsSystem = false }, UserID = "123" }
            };

            var editResponse = new EditMetricResponse
            {
                Successful = true,
                ErrorMessage = "",
                Metrics = trackedMetrics
            };

            var metricService = new MockMetricService().MockUpdateMetric(editResponse);

            var metricController = new MetricsController(metricService.Object);
            metricController.ControllerContext.HttpContext = new DefaultHttpContext();
            metricController.ControllerContext.HttpContext.Items["User"] = TestDataRepository.CreateUser(); ;

            var result = (OkObjectResult)metricController.UpdateCustomMetric(request).Result;

            var response = JsonSerializer.Deserialize<EditMetricResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal(3, response.Metrics.Count);
        }

        [Fact]
        public void MetricController_DeleteCustomMetric_Successful()
        {
            var request = new DeleteMetricRequest
            {
                ID = 1
            };

            var trackedMetrics = new List<UserTrackedMetric>
            {
                new UserTrackedMetric { ID = 1, MetricID = -2, Metric = new Metric { ID = -2, Name = "Weight", Type = MetricType.Weight, IsSystem = true }, UserID = "123" },
                new UserTrackedMetric { ID = 2, MetricID = -1, Metric = new Metric { ID = -1, Name = "Body Fat %", Type = MetricType.Percentage, IsSystem = true }, UserID = "123" }
            };

            var editResponse = new EditMetricResponse
            {
                Successful = true,
                ErrorMessage = "",
                Metrics = trackedMetrics
            };

            var user = TestDataRepository.CreateUser();

            var metricService = new MockMetricService().MockDeleteMetric(editResponse);

            var metricController = new MetricsController(metricService.Object);
            metricController.ControllerContext.HttpContext = new DefaultHttpContext();
            metricController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)metricController.DeleteCustomMetric(request).Result;

            var response = JsonSerializer.Deserialize<EditMetricResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal(2, response.Metrics.Count);
        }
    }
}