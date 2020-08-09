using FitnessTrackerApi.Services;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using Microsoft.AspNetCore.Mvc;
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

            if (response == null)
            {
                return BadRequest(new { message = "Invalid email or password" });
            }

            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegistrationRequest model)
        {
            System.Console.WriteLine($"Name: {model.Name}");
            System.Console.WriteLine($"Email: {model.Email}");
            System.Console.WriteLine($"Password: {model.Password}");

            var response = await _userService.RegisterUser(model);

            if (response == null)
            {
                return BadRequest(new { message = "Error registerring user" });
            }

            return Ok(Response);
        }
    }
}