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
    public class ActivitiesController : ControllerBase
    {
        private readonly IActivityService _activityService;

        public ActivitiesController(IActivityService activityService)
        {
            _activityService = activityService;
        }

        [Authorize]
        [HttpGet("getactivity")]
        public IActionResult GetActivity(int id)
        {
            if (id < 0)
            {
                return Ok(JsonSerializer.Serialize(new GetActivityResponse
                {
                    ErrorMessage = "Metric not found"
                }));
            }

            var activity = _activityService.GetById(id);

            GetActivityResponse response;

            if (activity == null)
            {
                response = new GetActivityResponse
                {
                    ErrorMessage = "Metric not found"
                };
            }
            else
            {
                response = new GetActivityResponse
                {
                    Activity = activity
                };
            }

            return Ok(JsonSerializer.Serialize(response));
        }

        [Authorize]
        [HttpPost("addactivity")]
        public async Task<IActionResult> AddActivity(AddActivityRequest request)
        {
            try
            {
                var user = (User)HttpContext.Items["User"];

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _activityService.AddActivity(user, request);

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
        [HttpPost("updateactivity")]
        public async Task<IActionResult> UpdateActivity(UpdateActivityRequest request)
        {
            try
            {
                var user = (User)HttpContext.Items["User"];

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _activityService.UpdateActivity(user, request);

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
        [HttpPost("deleteactivity")]
        public async Task<IActionResult> DeleteActivity(DeleteActivityRequest request)
        {
            try
            {
                var user = (User)HttpContext.Items["User"];

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _activityService.DeleteActivity(user, request);

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