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
    public class ActivitiesController : BaseController
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
                return OkResult(new GetActivityResponse
                {
                    Successful = false,
                    ErrorMessage = "Activity not found"
                });
            }

            var activity = _activityService.GetById(id);

            GetActivityResponse response;

            if (activity == null)
            {
                response = new GetActivityResponse
                {
                    Successful = false,
                    ErrorMessage = "Activity not found"
                };
            }
            else
            {
                response = new GetActivityResponse
                {
                    Successful = true,
                    Activity = activity
                };
            }

            return OkResult(response);
        }

        [Authorize]
        [HttpPost("addactivity")]
        public async Task<IActionResult> AddActivity(AddActivityRequest request)
        {
            try
            {
                var user = LoadUser();

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _activityService.AddActivity(user, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new EditActivityResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("updateactivity")]
        public async Task<IActionResult> UpdateActivity(UpdateActivityRequest request)
        {
            try
            {
                var user = LoadUser();

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _activityService.UpdateActivity(user, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new EditActivityResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("deleteactivity")]
        public async Task<IActionResult> DeleteActivity(DeleteActivityRequest request)
        {
            try
            {
                var user = LoadUser();

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _activityService.DeleteActivity(user, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new EditActivityResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }
    }
}