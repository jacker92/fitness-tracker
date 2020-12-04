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
    public class FoodGroupingsController : BaseController
    {
        private readonly IFoodGroupingService _foodGroupingService;

        public FoodGroupingsController(IFoodGroupingService foodGroupingService)
        {
            _foodGroupingService = foodGroupingService;
        }

        [Authorize]
        [HttpGet("getfoodgrouping")]
        public IActionResult GetFoodGroupingById(int id)
        {
            try
            {
                if (id < 0)
                {
                    return OkResult(new GetFoodGroupingResponse { Successful = false, ErrorMessage = "Food grouping not found" });
                }

                var foodGrouping = _foodGroupingService.GetById(id);

                GetFoodGroupingResponse response;

                if (foodGrouping == null)
                {
                    response = new GetFoodGroupingResponse
                    {
                        Successful = false,
                        ErrorMessage = "Food grouping not found"
                    };
                }
                else
                {
                    response = new GetFoodGroupingResponse
                    {
                        FoodGrouping = foodGrouping
                    };
                }

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new GetFoodGroupingResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("getuserfoodgroupings")]
        public IActionResult GetUserFoodGroupings()
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var foodGroupings = _foodGroupingService.GetForUser(CurrentUser.Id);

                return OkResult(new EditFoodGroupingResponse { FoodGroupings = foodGroupings });
            }
            catch (Exception ex)
            {
                return OkResult(new EditFoodGroupingResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("addfoodgrouping")]
        public async Task<IActionResult> AddFoodGrouping(AddFoodGroupingRequest request)
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _foodGroupingService.AddFoodGrouping(CurrentUser, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new EditFoodGroupingResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("updatefoodgrouping")]
        public async Task<IActionResult> UpdateFoodGrouping(UpdateFoodGroupingRequest request)
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _foodGroupingService.UpdateFoodGrouping(CurrentUser, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new EditFoodGroupingResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("deletefoodgrouping")]
        public async Task<IActionResult> DeleteFoodGrouping(DeleteFoodGroupingRequest request)
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _foodGroupingService.DeleteFoodGrouping(CurrentUser, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new EditFoodGroupingResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }
    }
}