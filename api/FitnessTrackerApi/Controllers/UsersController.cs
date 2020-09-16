using FitnessTrackerApi.Services;
using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate(AuthenticationRequest request)
        {
            var response = await _userService.Authenticate(request);

            if (response.ErrorMessage != "")
            {
                return BadRequest(new { message = response.ErrorMessage });
            }

            // TODO: Figure out why I need to serialize the response
            return Ok(JsonSerializer.Serialize(response));
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegistrationRequest request)
        {
            var response = await _userService.RegisterUser(request);

            if (response.ErrorMessage != "")
            {
                return BadRequest(new { message = response.ErrorMessage });
            }

            // TODO: Figure out why I need to serialize the response
            return Ok(JsonSerializer.Serialize(response));
        }

        [Authorize]
        [HttpGet("getuser")]
        public async Task<IActionResult> GetUser()
        {
            var contextUser = (User)HttpContext.Items["User"];
            var user = await _userService.GetUserRecord(contextUser.Id);

            if (user == null)
            {
                return BadRequest(new { message = "Unable to retrieve user record" });
            }

            var response = new UserResponse
            {
                User = user
            };

            return Ok(JsonSerializer.Serialize(response));
        }

        [HttpGet("checkemail")]
        public async Task<IActionResult> CheckUserEmail(string userId, string email)
        {
            var response = await _userService.CheckEmail(userId, email);
            return Ok(JsonSerializer.Serialize(response));
        }

        [Authorize]
        [HttpPost("updateprofile")]
        public async Task<IActionResult> UpdateUserProfile(UpdateProfileRequest request)
        {
            var user = (User)HttpContext.Items["User"];

            if (user == null)
            {
                return BadRequest(new { message = "Unable to retrieve user" });
            }

            var response = await _userService.UpdateUserProfile(user, request);

            if (response.ErrorMessage != "")
            {
                return BadRequest(new { message = response.ErrorMessage });
            }

            // TODO: Figure out why I need to serialize the response
            return Ok(JsonSerializer.Serialize(response));
        }

        [HttpPost("uploadavatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] AvatarUploadRequest request)
        {
            try
            {
                var user = (User)HttpContext.Items["User"];

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _userService.UpdateAvatar(user, request);

                // TODO: Figure out why I need to serialize the response
                return Ok(JsonSerializer.Serialize(response));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error uploading image: {ex.Message}" });
            }
        }

        [Authorize]
        [HttpGet("getavatar")]
        public IActionResult GetAvatar()
        {
            var user = (User)HttpContext.Items["User"];

            if (user == null)
            {
                return BadRequest(new { message = "Unable to retrieve user" });
            }

            var response = new ImageUploadResponse
            {
                Image = _userService.GetUserAvatar(user)
            };

            return Ok(JsonSerializer.Serialize(response));
        }

        [Authorize]
        [HttpPost("removeavatar")]
        public async Task<IActionResult> RemoveAvatar()
        {
            var user = (User)HttpContext.Items["User"];

            if (user == null)
            {
                return BadRequest(new { message = "Unable to retrieve user" });
            }

            var response = await _userService.RemoveAvatar(user);

            return Ok(JsonSerializer.Serialize(response));
        }

        [Authorize]
        [HttpPost("updateactivitysettings")]
        public async Task<IActionResult> UpdateActivitySettings(UpdateActivitySettingsRequest request)
        {
            try
            {
                var user = (User)HttpContext.Items["User"];

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _userService.UpdateActivitySettings(user, request);

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
        [HttpPost("updatedietsettings")]
        public async Task<IActionResult> UpdateDietSettings(UpdateDietSettingsRequest request)
        {
            try
            {
                var user = (User)HttpContext.Items["User"];

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _userService.UpdateDietSettings(user, request);

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
        [HttpPost("changepassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
        {
            try
            {
                var user = (User)HttpContext.Items["User"];

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _userService.ChangePassword(user, request);

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
        [HttpGet("getusertrackedmetrics")]
        public IActionResult GetUserTrackedMetrics()
        {
            try
            {
                var user = (User)HttpContext.Items["User"];

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = _userService.GetUserTrackedMetrics(user);

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
        [HttpPost("toggleusertrackedmetric")]
        public async Task<IActionResult> ToggleUserTrackedMetric(ToggleUserMetricTrackingRequest request)
        {
            try
            {
                var user = (User)HttpContext.Items["User"];

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _userService.UpdateUserMetricTracking(user, request);

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
        [HttpGet("getusergear")]
        public IActionResult GetUserGear()
        {
            try
            {
                var user = (User)HttpContext.Items["User"];

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = _userService.GetUserGear(user);

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
        [HttpGet("getusercustomactivities")]
        public IActionResult GetUserCustomActivities()
        {
            try
            {
                var user = (User)HttpContext.Items["User"];

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = _userService.GetUserCustomActivities(user);

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