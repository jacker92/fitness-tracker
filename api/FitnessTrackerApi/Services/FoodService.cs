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
    public class FoodService : IFoodService
    {
        private readonly IRepository<Food> _foodRepository;

        public FoodService(IRepository<Food> foodRepo)
        {
            _foodRepository = foodRepo;
        }

        public Food GetById(int id)
        {
            return _foodRepository.GetById(id);
        }

        public List<Food> GetForUser(string userId, bool includePublic = true)
        {
            if (includePublic)
            {
                return _foodRepository.Get(f => f.UserID == userId || f.IsPublic)
                                                .OrderBy(f => f.Name)
                                                .ToList();
            }
            else
            {
                return _foodRepository.Get(f => f.UserID == userId)
                                            .OrderBy(f => f.Name)
                                            .ToList();
            }
        }

        public async Task<EditFoodResponse> AddFood(User user, AddFoodRequest request)
        {
            try
            {
                if (user != null)
                {
                    var food = new Food
                    {
                        UserID = user.Id,
                        Name = request.Name,
                        ServingSize = request.ServingSize,
                        Calories = request.Calories,
                        Protein = request.Protein,
                        Carbohydrates = request.Carbohydrates,
                        Fat = request.Fat,
                        Sugar = request.Sugar,
                        IsAlcoholic = request.IsAlcoholic,
                        IsPublic = request.IsPublic
                    };

                    await _foodRepository.Add(food);

                    var foods = GetForUser(user.Id, false);

                    return new EditFoodResponse
                    {
                        Foods = foods
                    };
                }

                return new EditFoodResponse
                {
                    Successful = false,
                    ErrorMessage = "Cannot find user"
                };
            }
            catch (Exception ex)
            {
                return new EditFoodResponse { Successful = false, ErrorMessage = ex.Message };
            }
        }

        public async Task<EditFoodResponse> UpdateFood(User user, UpdateFoodRequest request)
        {
            try
            {
                if (user != null)
                {
                    var food = _foodRepository.GetById(request.ID);

                    if (food == null || food.UserID != user.Id)
                    {
                        return new EditFoodResponse
                        {
                            Successful = false,
                            ErrorMessage = "Cannot find food"
                        };
                    }

                    food.Name = request.Name;
                    food.ServingSize = request.ServingSize;
                    food.Calories = request.Calories;
                    food.Protein = request.Protein;
                    food.Carbohydrates = request.Carbohydrates;
                    food.Fat = request.Fat;
                    food.Sugar = request.Sugar;
                    food.IsAlcoholic = request.IsAlcoholic;
                    food.IsPublic = request.IsPublic;

                    await _foodRepository.Update(food);

                    var foods = GetForUser(user.Id, false);

                    return new EditFoodResponse
                    {
                        Foods = foods
                    };
                }

                return new EditFoodResponse
                {
                    Successful = false,
                    ErrorMessage = "Cannot find user"
                };
            }
            catch (Exception ex)
            {
                return new EditFoodResponse { Successful = false, ErrorMessage = ex.Message };
            }
        }

        public async Task<EditFoodResponse> DeleteFood(User user, DeleteFoodRequest request)
        {
            try
            {
                if (user != null)
                {
                    var food = _foodRepository.GetById(request.ID);

                    if (food == null || food.UserID != user.Id)
                    {
                        return new EditFoodResponse
                        {
                            Successful = false,
                            ErrorMessage = "Cannot find food"
                        };
                    }

                    // TODO: Cleanup?

                    await _foodRepository.Delete(food);

                    var foods = GetForUser(user.Id, false);

                    return new EditFoodResponse
                    {
                        Foods = foods
                    };
                }

                return new EditFoodResponse
                {
                    Successful = false,
                    ErrorMessage = "Cannot find user"
                };
            }
            catch (Exception ex)
            {
                return new EditFoodResponse { Successful = false, ErrorMessage = ex.Message };
            }
        }
    }
}