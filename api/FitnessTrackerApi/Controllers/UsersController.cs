using FitnessTrackerApi.Services;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<IActionResult> Authenticate(AuthenticationRequest req)
        {
            var response = await _userService.Authenticate(req);

            if (response.ErrorMessage != "")
            {
                return BadRequest(new { message = response.ErrorMessage });
            }

            // TODO: Figure out why I need to serialize the response
            return Ok(JsonSerializer.Serialize(response));
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegistrationRequest req)
        {
            var response = await _userService.RegisterUser(req);

            if (response.ErrorMessage != "")
            {
                return BadRequest(new { message = response.ErrorMessage });
            }

            // TODO: Figure out why I need to serialize the response
            return Ok(JsonSerializer.Serialize(response));
        }

        [Authorize]
        [HttpGet("getuser")]
        public async Task<IActionResult> GetUser(string UserID)
        {
            var user = await _userService.GetUserRecord(UserID);

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
    }
}