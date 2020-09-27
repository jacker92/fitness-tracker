using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Text.Json;
using System.Threading.Tasks;

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
            if (id < 0)
            {
                return Ok(JsonSerializer.Serialize(new GetMetricResponse
                {
                    Successful = false,
                    ErrorMessage = "Metric not found"
                }));
            }

            var metric = _metricService.GetById(id);

            GetMetricResponse response;

            if (metric == null)
            {
                response = new GetMetricResponse
                {
                    Successful = false,
                    ErrorMessage = "Metric not found"
                };
            }
            else
            {
                response = new GetMetricResponse
                {
                    Successful = true,
                    Metric = metric
                };
            }

            return Ok(JsonSerializer.Serialize(response));
        }

        [Authorize]
        [HttpPost("addmetric")]
        public async Task<IActionResult> AddCustomMetric(AddMetricRequest request)
        {
            try
            {
                var user = (User)HttpContext.Items["User"];

                if (user == null)
                {
                    throw new Exception("Unable to find user");
                }

                var response = await _metricService.AddMetric(user, request);

                // TODO: Figure out why I need to serialize the response
                return Ok(JsonSerializer.Serialize(response));
            }
            catch (Exception ex)
            {
                var response = new EditMetricResponse
                {
                    Successful = false,
                    ErrorMessage = ex.StackTrace
                };

                return Ok(JsonSerializer.Serialize(response));
            }
        }

        [Authorize]
        [HttpPost("updatemetric")]
        public async Task<IActionResult> UpdateCustomMetric(UpdateMetricRequest request)
        {
            try
            {
                var user = (User)HttpContext.Items["User"];

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _metricService.UpdateMetric(user, request);

                if (response.ErrorMessage != "")
                {
                    return BadRequest(new { message = response.ErrorMessage });
                }

                // TODO: Figure out why I need to serialize the response
                return Ok(JsonSerializer.Serialize(response));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("deletemetric")]
        public async Task<IActionResult> DeleteCustomMetric(DeleteMetricRequest request)
        {
            try
            {
                var user = (User)HttpContext.Items["User"];

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _metricService.DeleteMetric(user, request);

                if (response.ErrorMessage != "")
                {
                    return BadRequest(new { message = response.ErrorMessage });
                }

                // TODO: Figure out why I need to serialize the response
                return Ok(JsonSerializer.Serialize(response));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}