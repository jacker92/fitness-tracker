using FitnessTrackerApi.Services;
using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
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
        private readonly IHostEnvironment _hostEnvironment;

        public UsersController(IUserService userService, IHostEnvironment hostEnvironment)
        {
            _userService = userService;
            _hostEnvironment = hostEnvironment;
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

        [Authorize]
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
        public async Task<IActionResult> CreateImage([FromForm] ImageUploadRequest request)
        {
            try
            {
                var user = (User)HttpContext.Items["User"];

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                // todo: check image is an image

                string path = Path.Combine(_hostEnvironment.ContentRootPath, $"Uploads/avatars/{user.Id}.jpg");

                if (System.IO.File.Exists(path))
                {
                    System.IO.File.Delete(path);
                }

                byte[] imageData = await Utilities.SaveImage(request.Image, path);

                if (imageData == null || imageData.Length == 0)
                {
                    return BadRequest(new { message = "Unable to upload image" });
                }

                return File(imageData, "image/jpeg");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error uploading image: {ex.Message}" });
            }
        }
    }
}