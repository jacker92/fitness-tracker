using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Services;
using Microsoft.AspNetCore.Mvc;
using System;
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
                    return OkResult(new GearResponse { Successful = false, ErrorMessage = "Gear not found" });
                }

                var gear = _gearService.GetById(id);

                GearResponse response;

                if (gear == null)
                {
                    response = new GearResponse
                    {
                        Successful = false,
                        ErrorMessage = "Gear not found"
                    };
                }
                else
                {
                    response = new GearResponse
                    {
                        Successful = true,
                        ErrorMessage = "",
                        Gear = gear
                    };
                }

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new GearResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("getusergear")]
        public IActionResult GetUserGear()
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var gear = _gearService.GetUserGear(CurrentUser.Id);

                var response = new GearListResponse
                {
                    Gear = gear
                };

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new UserGearResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }


        [Authorize]
        [HttpPost("save")]
        public async Task<IActionResult> Save(EditGearRequest request)
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                GearListResponse response;
                if (request.ID > 0)
                {
                    response = await _gearService.UpdateGear(CurrentUser, request);
                }
                else
                {
                    response = await _gearService.AddGear(CurrentUser, request);
                }

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new GearListResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("deletegear")]
        public async Task<IActionResult> DeleteGear(DeleteRequest request)
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _gearService.DeleteGear(CurrentUser, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new GearListResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("setgearactiveflag")]
        public async Task<IActionResult> SetGearActiveFlag(SetGearActiveFlagRequest request)
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _gearService.SetGearActiveFlag(CurrentUser, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new GearListResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

    }
}