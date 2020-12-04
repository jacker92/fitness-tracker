using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Repositories;
using System.Collections.Generic;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Services
{
    public class FoodGroupingService : IFoodGroupingService
    {
        private readonly IRepository<FoodGrouping> _foodGroupingRepository;

        public FoodGroupingService(IRepository<FoodGrouping> foodGroupingRepo)
        {
            _foodGroupingRepository = foodGroupingRepo;
        }

        public FoodGrouping GetById(int id)
        {
            return _foodGroupingRepository.GetById(id);
        }

        public List<FoodGrouping> GetForUser(string userId)
        {
            return _foodGroupingRepository.Get(fg => fg.UserID == userId)
                                            .OrderBy(fg => fg.SortOrder)
                                            .ToList();
        }

        public async Task<EditFoodGroupingResponse> AddFoodGrouping(User user, AddFoodGroupingRequest request)
        {
            try
            {
                if (user != null)
                {
                    var foodGrouping = new FoodGrouping
                    {
                        UserID = user.Id,
                        Name = request.Name,
                        SortOrder = request.SortOrder
                    };

                    await _foodGroupingRepository.Add(foodGrouping);

                    var foodGroupings = GetForUser(user.Id);

                    return new EditFoodGroupingResponse
                    {
                        FoodGroupings = foodGroupings
                    };
                }

                return new EditFoodGroupingResponse
                {
                    Successful = false,
                    ErrorMessage = "Cannot find user"
                };
            }
            catch (Exception ex)
            {
                return new EditFoodGroupingResponse { Successful = false, ErrorMessage = ex.Message };
            }
        }

        public async Task<EditFoodGroupingResponse> UpdateFoodGrouping(User user, UpdateFoodGroupingRequest request)
        {
            try
            {
                if (user != null)
                {
                    var foodGrouping = _foodGroupingRepository.GetById(request.ID);

                    if (foodGrouping == null || foodGrouping.UserID != user.Id)
                    {
                        return new EditFoodGroupingResponse
                        {
                            Successful = false,
                            ErrorMessage = "Cannot find food grouping"
                        };
                    }

                    foodGrouping.Name = request.Name;
                    foodGrouping.SortOrder = request.SortOrder;

                    await _foodGroupingRepository.Update(foodGrouping);

                    var foodGroupings = GetForUser(user.Id);

                    return new EditFoodGroupingResponse
                    {
                        FoodGroupings = foodGroupings
                    };
                }

                return new EditFoodGroupingResponse
                {
                    Successful = false,
                    ErrorMessage = "Cannot find user"
                };
            }
            catch (Exception ex)
            {
                return new EditFoodGroupingResponse { Successful = false, ErrorMessage = ex.Message };
            }
        }

        public async Task<EditFoodGroupingResponse> DeleteFoodGrouping(User user, DeleteFoodGroupingRequest request)
        {
            try
            {
                if (user != null)
                {
                    var foodGrouping = _foodGroupingRepository.GetById(request.ID);

                    // for safety, confirm that the user owns the gear
                    if (foodGrouping == null || foodGrouping.UserID != user.Id)
                    {
                        return new EditFoodGroupingResponse
                        {
                            Successful = false,
                            ErrorMessage = "Cannot find food grouping"
                        };
                    }

                    // TODO: NULL out all foods that use this grouping

                    await _foodGroupingRepository.Delete(foodGrouping);

                    var foodGroupings = GetForUser(user.Id);

                    return new EditFoodGroupingResponse
                    {
                        FoodGroupings = foodGroupings
                    };
                }

                return new EditFoodGroupingResponse
                {
                    Successful = false,
                    ErrorMessage = "Cannot find user"
                };
            }
            catch (Exception ex)
            {
                return new EditFoodGroupingResponse { Successful = false, ErrorMessage = ex.Message };
            }
        }
    }
}