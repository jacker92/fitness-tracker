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
    public class GearController : BaseController
    {
        private readonly IGearService _gearService;

        public GearController(IGearService gearService)
        {
            _gearService = gearService;
        }

        [Authorize]
        [HttpGet("getgear")]
        public IActionResult GetGear(int id)
        {
            try
            {
                if (id < 0)
                {
                    return OkResult(new GetGearResponse { Successful = false, ErrorMessage = "Gear not found" });
                }

                var gear = _gearService.GetById(id);

                GetGearResponse response;

                if (gear == null)
                {
                    response = new GetGearResponse
                    {
                        Successful = false,
                        ErrorMessage = "Gear not found"
                    };
                }
                else
                {
                    response = new GetGearResponse
                    {
                        Successful = true,
                        Gear = gear
                    };
                }

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new GetGearResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("addgear")]
        public async Task<IActionResult> AddGear(AddGearRequest request)
        {
            try
            {
                var user = LoadUser();

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _gearService.AddGear(user, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new EditGearResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("updategear")]
        public async Task<IActionResult> UpdateGear(UpdateGearRequest request)
        {
            try
            {
                var user = LoadUser();

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _gearService.UpdateGear(user, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new EditGearResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("deletegear")]
        public async Task<IActionResult> DeleteGear(DeleteGearRequest request)
        {
            try
            {
                var user = LoadUser();

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _gearService.DeleteGear(user, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new EditGearResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("setgearactiveflag")]
        public async Task<IActionResult> SetGearActiveFlag(SetGearActiveFlagRequest request)
        {
            try
            {
                var user = LoadUser();

                if (user == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _gearService.SetGearActiveFlag(user, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new EditGearResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

    }
}