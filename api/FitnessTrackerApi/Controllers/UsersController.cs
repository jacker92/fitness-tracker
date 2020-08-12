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
        public async Task<IActionResult> Authenticate(AuthenticationRequest model)
        {
            var response = await _userService.Authenticate(model);

            if (response.ErrorMessage != "")
            {
                return BadRequest(new { message = response.ErrorMessage });
            }

            // TODO: Figure out why I need to serialize the response
            return Ok(JsonSerializer.Serialize(response));
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegistrationRequest model)
        {
            var response = await _userService.RegisterUser(model);

            if (response.ErrorMessage != "")
            {
                return BadRequest(new { message = response.ErrorMessage });
            }

            // TODO: Figure out why I need to serialize the response
            return Ok(JsonSerializer.Serialize(response));
        }
    }
}