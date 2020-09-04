using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace FitnessTrackerApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MetricsController : ControllerBase
    {
        private readonly IMetricService _metricService;

        public MetricsController(IMetricService metricService)
        {
            _metricService = metricService;
        }

        [Authorize]
        [HttpGet("getmetric")]
        public IActionResult GetMetric(int id)
        {
            System.Console.WriteLine(id);
            if (id < 0)
            {
                return Ok(JsonSerializer.Serialize(new GetMetricResponse
                {
                    ErrorMessage = "Metric not found"
                }));
            }
            System.Console.WriteLine("Valid ID...Continuing...");
            var metric = _metricService.GetById(id);

            GetMetricResponse response;

            if (metric == null)
            {
                response = new GetMetricResponse
                {
                    ErrorMessage = "Metric not found"
                };
            }
            else
            {
                response = new GetMetricResponse
                {
                    Metric = metric
                };
            }

            return Ok(JsonSerializer.Serialize(response));
        }
    }
}