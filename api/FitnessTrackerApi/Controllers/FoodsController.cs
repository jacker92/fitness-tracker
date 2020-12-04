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
    public class FoodsController : BaseController
    {
        private readonly IFoodService _foodService;

        public FoodsController(IFoodService foodService)
        {
            _foodService = foodService;
        }

        [Authorize]
        [HttpGet("getfood")]
        public IActionResult GetFoodById(int id)
        {
            try
            {
                if (id < 0)
                {
                    return OkResult(new GetFoodResponse { Successful = false, ErrorMessage = "Food not found" });
                }

                var food = _foodService.GetById(id);

                GetFoodResponse response;

                if (food == null)
                {
                    response = new GetFoodResponse
                    {
                        Successful = false,
                        ErrorMessage = "Food not found"
                    };
                }
                else
                {
                    response = new GetFoodResponse
                    {
                        Food = food
                    };
                }

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new GetFoodResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("getuserfoods")]
        public IActionResult GetUserFoods()
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var foods = _foodService.GetForUser(CurrentUser.Id, true);

                return OkResult(new EditFoodResponse { Foods = foods });
            }
            catch (Exception ex)
            {
                return OkResult(new EditFoodResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("getusercustomfoods")]
        public IActionResult GetUserCustomFoods()
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var foods = _foodService.GetForUser(CurrentUser.Id, false);

                return OkResult(new EditFoodResponse { Foods = foods });
            }
            catch (Exception ex)
            {
                return OkResult(new EditFoodResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("addfood")]
        public async Task<IActionResult> AddFood(AddFoodRequest request)
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _foodService.AddFood(CurrentUser, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new EditFoodResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("updatefood")]
        public async Task<IActionResult> UpdateFood(UpdateFoodRequest request)
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _foodService.UpdateFood(CurrentUser, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new EditFoodResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("deletefood")]
        public async Task<IActionResult> DeleteFood(DeleteFoodRequest request)
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var response = await _foodService.DeleteFood(CurrentUser, request);

                return OkResult(response);
            }
            catch (Exception ex)
            {
                return OkResult(new EditFoodResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("search")]
        public IActionResult SearchFoods(string keywords)
        {
            try
            {
                if (CurrentUser == null)
                {
                    return BadRequest(new { message = "Unable to retrieve user" });
                }

                var foods = _foodService.Search(CurrentUser, keywords);

                return OkResult(new EditFoodResponse { Foods = foods });
            }
            catch (Exception ex)
            {
                return OkResult(new EditFoodResponse { Successful = false, ErrorMessage = ex.Message });
            }
        }
    }
}