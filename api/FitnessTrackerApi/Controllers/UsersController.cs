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
    public class UsersController : BaseController
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

            return OkResult(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegistrationRequest request)
        {
            var response = await _userService.RegisterUser(request);

            return OkResult(response);
        }

        [Authorize]
        [HttpGet("getuser")]
        public async Task<IActionResult> GetUser()
        {
            try
            {
                var contextUser = LoadUser();
                var user = await _userService.GetUserRecord(contextUser.Id);

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user record" });
                }

                var response = new UserResponse
                {
                    Successful = true,
                    User = user
                };

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new UserResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [HttpGet("checkemail")]
        public async Task<IActionResult> CheckUserEmail(string userId, string email)
        {
            try
            {
                var response = await _userService.CheckEmail(userId, email);
                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new CheckEmailResponse { Valid = false, Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("updateprofile")]
        public async Task<IActionResult> UpdateUserProfile(UpdateProfileRequest request)
        {
            try
            {
                var user = LoadUser();

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _userService.UpdateUserProfile(user, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new UpdateProfileResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("uploadavatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] AvatarUploadRequest request)
        {
            try
            {
                var user = LoadUser();

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _userService.UpdateAvatar(user, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new ImageUploadResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("getavatar")]
        public IActionResult GetAvatar()
        {
            try
            {
                var user = LoadUser();

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = new ImageUploadResponse
                {
                    Image = _userService.GetUserAvatar(user)
                };

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new ImageUploadResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("removeavatar")]
        public async Task<IActionResult> RemoveAvatar()
        {
            try
            {
                var user = LoadUser();

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _userService.RemoveAvatar(user);
                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new BaseResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("updateactivitysettings")]
        public async Task<IActionResult> UpdateActivitySettings(UpdateActivitySettingsRequest request)
        {
            try
            {
                var user = LoadUser();

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _userService.UpdateActivitySettings(user, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new UpdateActivitySettingsResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("updatedietsettings")]
        public async Task<IActionResult> UpdateDietSettings(UpdateDietSettingsRequest request)
        {
            try
            {
                var user = LoadUser();

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _userService.UpdateDietSettings(user, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new UpdateDietSettingsResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("changepassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
        {
            try
            {
                var user = LoadUser();

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _userService.ChangePassword(user, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new ChangePasswordResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("getusertrackedmetrics")]
        public IActionResult GetUserTrackedMetrics()
        {
            try
            {
                var user = LoadUser();

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = _userService.GetUserTrackedMetrics(user);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new UserMetricsResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("toggleusertrackedmetric")]
        public async Task<IActionResult> ToggleUserTrackedMetric(ToggleUserMetricTrackingRequest request)
        {
            try
            {
                var user = LoadUser();

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _userService.UpdateUserMetricTracking(user, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new ToggleUserMetricTrackingResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("getusergear")]
        public IActionResult GetUserGear()
        {
            try
            {
                var user = LoadUser();

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = _userService.GetUserGear(user);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new UserGearResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("getusercustomactivities")]
        public IActionResult GetUserCustomActivities()
        {
            try
            {
                var user = LoadUser();

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = _userService.GetUserCustomActivities(user);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new UserCustomActivityResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }
    }
}