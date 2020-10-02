using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Services
{
    public class ActivityService : IActivityService
    {
        private readonly IRepository<Activity> _activityRepository;
        private readonly IRepository<UserActivity> _userActivityRepository;

        public ActivityService(IRepository<Activity> activityRepo, IRepository<UserActivity> userActivityRepo)
        {
            _activityRepository = activityRepo;
            _userActivityRepository = userActivityRepo;
        }

        public Activity GetById(int id)
        {
            return _activityRepository.GetById(id);
        }

        public async Task<EditActivityResponse> AddActivity(User user, AddActivityRequest request)
        {
            try
            {
                if (user != null)
                {
                    var activity = new Activity
                    {
                        Name = request.Name,
                        EstimatedCaloriesBurnedPerMinute = request.EstimatedCaloriesBurnedPerMinute,
                        Type = request.Type,
                        UserID = user.Id,
                        IsSystem = false
                    };

                    await _activityRepository.Add(activity);

                    var activities = _activityRepository.Get(a => a.UserID == user.Id)
                                            .OrderBy(a => a.Name)
                                            .ToList();

                    return new EditActivityResponse
                    {
                        Activities = activities
                    };
                }

                return new EditActivityResponse
                {
                    Successful = false,
                    ErrorMessage = "Cannot find user"
                };
            }
            catch (Exception ex)
            {
                return new EditActivityResponse
                {
                    Successful = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<EditActivityResponse> UpdateActivity(User user, UpdateActivityRequest request)
        {
            try
            {
                if (user != null)
                {
                    var activity = _activityRepository.GetById(request.ID);

                    // for safety, confirm that the user owns the metric and it's not a system metric
                    if (activity == null || activity.UserID != user.Id || activity.IsSystem)
                    {
                        return new EditActivityResponse
                        {
                            ErrorMessage = "Cannot find activity"
                        };
                    }

                    activity.Name = request.Name;
                    activity.EstimatedCaloriesBurnedPerMinute = request.EstimatedCaloriesBurnedPerMinute;
                    activity.Type = request.Type;

                    await _activityRepository.Update(activity);

                    var activities = _activityRepository.Get(a => a.UserID == user.Id)
                                            .OrderBy(a => a.Name)
                                            .ToList();

                    return new EditActivityResponse
                    {
                        Activities = activities
                    };
                }

                return new EditActivityResponse
                {
                    Successful = false,
                    ErrorMessage = "Cannot find user"
                };
            }
            catch (Exception ex)
            {
                return new EditActivityResponse
                {
                    Successful = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<EditActivityResponse> DeleteActivity(User user, DeleteActivityRequest request)
        {
            try
            {
                if (user != null)
                {
                    var activity = _activityRepository.GetById(request.ID);

                    // for safety, confirm that the user owns the metric and it's not a system metric
                    if (activity == null || activity.UserID != user.Id || activity.IsSystem)
                    {
                        return new EditActivityResponse
                        {
                            ErrorMessage = "Cannot find activity"
                        };
                    }

                    // delete all records from the user activities table
                    await _userActivityRepository.DeleteRange(_userActivityRepository.Get(ua => ua.UserID == user.Id && ua.ActivityID == activity.ID).ToList());

                    // finally delete the metric itself
                    await _activityRepository.Delete(activity);

                    var activities = _activityRepository.Get(a => a.UserID == user.Id)
                                            .OrderBy(a => a.Name)
                                            .ToList();

                    return new EditActivityResponse
                    {
                        Activities = activities
                    };
                }

                return new EditActivityResponse
                {
                    Successful = false,
                    ErrorMessage = "Cannot find user"
                };
            }
            catch (Exception ex)
            {
                return new EditActivityResponse
                {
                    Successful = false,
                    ErrorMessage = ex.Message
                };
            }
        }
    }
}