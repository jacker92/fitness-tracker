using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IHostEnvironment _hostEnvironment;
        private readonly IRepository<DailyTarget> _dailyTargetRepository;
        private readonly IRepository<Gear> _gearRespository;
        private readonly IRepository<Metric> _metricRepository;
        private readonly IRepository<UserMetric> _userMetricRepository;
        private readonly IRepository<UserTrackedMetric> _userTrackedMetricRepository;
        private readonly IRepository<Activity> _activityRepository;

        public UserService(UserManager<User> userManager,
                            SignInManager<User> signInManager,
                            IHostEnvironment hostEnvironment,
                            IRepository<DailyTarget> dailyTargetRepo,
                            IRepository<UserMetric> userMetricRepo,
                            IRepository<UserTrackedMetric> userTrackedMetricRepo,
                            IRepository<Metric> metricRepo,
                            IRepository<Gear> gearRepo,
                            IRepository<Activity> activityRepo)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _hostEnvironment = hostEnvironment;
            _dailyTargetRepository = dailyTargetRepo;
            _userMetricRepository = userMetricRepo;
            _userTrackedMetricRepository = userTrackedMetricRepo;
            _metricRepository = metricRepo;
            _gearRespository = gearRepo;
            _activityRepository = activityRepo;
        }

        public async Task<RegistrationResponse> RegisterUser(RegistrationRequest request)
        {
            try
            {
                var user = new User
                {
                    Name = request.Name,
                    Email = request.Email,
                    UserName = request.Email,
                    MeasurementSystem = request.MeasurementSystem,
                    Gender = request.Gender,
                    Height = request.Height,
                    ActivityLevel = request.ActivityLevel,
                    Birthday = request.Birthday
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (result.Succeeded)
                {
                    var dailyTarget = new DailyTarget
                    {
                        UserID = user.Id,
                        User = user
                    };

                    await _dailyTargetRepository.Add(dailyTarget);

                    var systemMetrics = _metricRepository.Get(m => m.ID < 0).ToList();

                    foreach (var metric in systemMetrics)
                    {
                        var trackedMetric = new UserTrackedMetric
                        {
                            UserID = user.Id,
                            MetricID = metric.ID,
                            IsTracked = true
                        };

                        await _userTrackedMetricRepository.Add(trackedMetric);
                    }

                    var token = generateJwtToken(user);

                    return new RegistrationResponse
                    {
                        Successful = true,
                        UserID = user.Id,
                        Name = user.Name,
                        Email = user.Email,
                        Token = token
                    };
                }

                return new RegistrationResponse
                {
                    Successful = false,
                    ErrorMessage = "Unable to save user"
                };
            }
            catch (Exception ex)
            {
                return new RegistrationResponse
                {
                    Successful = false,
                    ErrorMessage = $"Error registerring user: {ex.Message}"
                };
            }
        }

        public async Task<AuthenticationResponse> Authenticate(AuthenticationRequest request)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(request.Email);

                if (user != null)
                {
                    var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

                    if (result.Succeeded)
                    {
                        var token = generateJwtToken(user);

                        return new AuthenticationResponse
                        {
                            Successful = true,
                            UserID = user.Id,
                            Name = user.Name,
                            Email = user.Email,
                            Token = token
                        };
                    }
                    else
                    {
                        return new AuthenticationResponse
                        {
                            Successful = false,
                            ErrorMessage = "Invalid email or password"
                        };
                    }
                }

                return new AuthenticationResponse
                {
                    Successful = false,
                    ErrorMessage = "Invalid email or password"
                };
            }
            catch (Exception ex)
            {
                return new AuthenticationResponse
                {
                    Successful = false,
                    ErrorMessage = $"Error authenticating user: {ex.Message}"
                };
            }

        }

        public async Task<User> GetById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            return user;
        }

        public async Task<User> GetUserRecord(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user != null)
            {
                user.DailyTarget = _dailyTargetRepository.Get(r => r.UserID == user.Id).FirstOrDefault();

                var latestWeight = _userMetricRepository.Get(um => um.UserID == user.Id && um.MetricID == (int)SystemMetrics.Weight).OrderByDescending(um => um.DateTimeRecorded).FirstOrDefault();
                if (latestWeight != null)
                {
                    user.Weight = decimal.Parse(latestWeight.Measurement);
                }

                var latestBodyFat = _userMetricRepository.Get(um => um.UserID == user.Id && um.MetricID == (int)SystemMetrics.BodyFatPercentage).OrderByDescending(um => um.DateTimeRecorded).FirstOrDefault();
                if (latestBodyFat != null)
                {
                    user.BodyFatPercentage = decimal.Parse(latestBodyFat.Measurement);
                }
            }

            return user;
        }

        public async Task<CheckEmailResponse> CheckEmail(string id, string email)
        {
            var response = new CheckEmailResponse
            {
                Successful = true,
                Valid = true
            };

            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return response;
            }

            if (user.Id != id)
            {
                response.Valid = false;
            }

            return response;
        }

        public async Task<UpdateProfileResponse> UpdateUserProfile(User user, UpdateProfileRequest request)
        {
            try
            {
                user.Email = request.Email;
                user.UserName = request.Email;
                user.Name = request.Name;
                user.Height = request.Height;
                user.Birthday = request.Birthday;
                user.Gender = request.Gender;
                user.ActivityLevel = request.ActivityLevel;

                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded)
                {
                    return new UpdateProfileResponse
                    {
                        Successful = true
                    };
                }

                return new UpdateProfileResponse
                {
                    Successful = false,
                    ErrorMessage = "Unable to update profile"
                };
            }
            catch (Exception ex)
            {
                return new UpdateProfileResponse
                {
                    Successful = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<ImageUploadResponse> UpdateAvatar(User user, AvatarUploadRequest request)
        {
            try
            {
                string path = Path.Combine(_hostEnvironment.ContentRootPath, $"Uploads/avatars/{user.Id}.jpg");

                if (System.IO.File.Exists(path))
                {
                    System.IO.File.Delete(path);
                }

                byte[] imageData = await Utilities.SaveImage(request.Image, path);

                if (imageData == null || imageData.Length == 0)
                {
                    return new ImageUploadResponse
                    {
                        Successful = false,
                        ErrorMessage = "Unable to upload image"
                    };
                }

                user.Avatar = $"/Uploads/avatars/{user.Id}.jpg";
                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded)
                {
                    return new ImageUploadResponse
                    {
                        Image = GetUserAvatar(user)
                    };
                }

                return new ImageUploadResponse
                {
                    Successful = false,
                    ErrorMessage = "Unable to update avatar"
                };
            }
            catch (Exception ex)
            {
                return new ImageUploadResponse
                {
                    Successful = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public string GetUserAvatar(User user)
        {
            string path = Path.Combine(_hostEnvironment.ContentRootPath, $"Uploads/avatars/{user.Id}.jpg");
            return Utilities.ConvertImageToBase64(path);
        }

        public async Task<BaseResponse> RemoveAvatar(User user)
        {
            string path = Path.Combine(_hostEnvironment.ContentRootPath, $"Uploads/avatars/{user.Id}.jpg");
            if (System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);
            }

            user.Avatar = "";
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return new BaseResponse();
            }

            return new BaseResponse
            {
                Successful = false,
                ErrorMessage = "Unable to delete avatar"
            };
        }

        public async Task<UpdateActivitySettingsResponse> UpdateActivitySettings(User user, UpdateActivitySettingsRequest request)
        {
            try
            {
                if (user != null)
                {
                    user.DailyTarget = _dailyTargetRepository.Get(r => r.UserID == user.Id).FirstOrDefault();
                }

                user.CaloriesBurnedSetting = request.CaloriesBurnedSetting;

                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded)
                {
                    user.DailyTarget.EnableActiveMinuteTarget = request.EnableActiveMinuteTarget;
                    user.DailyTarget.ActiveMintueTarget = request.ActiveMintueTarget;
                    user.DailyTarget.EnableCaloriesBurnedTarget = request.EnableCaloriesBurnedTarget;
                    user.DailyTarget.CaloriesBurnedTarget = request.CaloriesBurnedTarget;

                    await _dailyTargetRepository.Update(user.DailyTarget);

                    return new UpdateActivitySettingsResponse();
                }

                return new UpdateActivitySettingsResponse
                {
                    Successful = false,
                    ErrorMessage = "Unable to update activity settings"
                };
            }
            catch (Exception ex)
            {
                return new UpdateActivitySettingsResponse
                {
                    Successful = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<UpdateDietSettingsResponse> UpdateDietSettings(User user, UpdateDietSettingsRequest request)
        {
            try
            {
                if (user != null)
                {
                    user.DailyTarget = _dailyTargetRepository.Get(r => r.UserID == user.Id).FirstOrDefault();
                }

                user.ManuallyCalculateCalories = request.ManuallyCalculateCalories;
                user.DietMode = request.DietMode;
                user.DietPercentage = request.DietPercentage;

                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded)
                {
                    user.DailyTarget.MacroTargetMode = request.MacroTargetMode;
                    user.DailyTarget.EnableCalorieTarget = request.EnableCalorieTarget;
                    user.DailyTarget.CalorieTarget = request.CalorieTarget;
                    user.DailyTarget.EnableProteinTarget = request.EnableProteinTarget;
                    user.DailyTarget.ProteinTarget = request.ProteinTarget;
                    user.DailyTarget.ProteinPercentage = request.ProteinPercentage;
                    user.DailyTarget.EnableCarbohydratesTarget = request.EnableCarbohydratesTarget;
                    user.DailyTarget.CarbohydratesTarget = request.CarbohydratesTarget;
                    user.DailyTarget.CarbohydratesPercentage = request.CarbohydratesPercentage;
                    user.DailyTarget.EnableFatTarget = request.EnableFatTarget;
                    user.DailyTarget.FatTarget = request.FatTarget;
                    user.DailyTarget.FatPercentage = request.FatPercentage;
                    user.DailyTarget.EnableColorCoding = request.EnableColorCoding;
                    user.DailyTarget.CaloriesYellowStart = request.CaloriesYellowStart;
                    user.DailyTarget.CaloriesYellowEnd = request.CaloriesYellowEnd;
                    user.DailyTarget.CaloriesGreenStart = request.CaloriesGreenStart;
                    user.DailyTarget.CaloriesGreenEnd = request.CaloriesGreenEnd;
                    user.DailyTarget.ProteinYellowStart = request.ProteinYellowStart;
                    user.DailyTarget.ProteinYellowEnd = request.ProteinYellowEnd;
                    user.DailyTarget.ProteinGreenStart = request.ProteinGreenStart;
                    user.DailyTarget.ProteinGreenEnd = request.ProteinGreenEnd;
                    user.DailyTarget.CarbohydratesYellowStart = request.CarbohydratesYellowStart;
                    user.DailyTarget.CarbohydratesYellowEnd = request.CarbohydratesYellowEnd;
                    user.DailyTarget.CarbohydratesGreenStart = request.CarbohydratesGreenStart;
                    user.DailyTarget.CarbohydratesGreenEnd = request.CarbohydratesGreenEnd;
                    user.DailyTarget.FatYellowStart = request.FatYellowStart;
                    user.DailyTarget.FatYellowEnd = request.FatYellowEnd;
                    user.DailyTarget.FatGreenStart = request.FatGreenStart;
                    user.DailyTarget.FatGreenEnd = request.FatGreenEnd;

                    await _dailyTargetRepository.Update(user.DailyTarget);

                    return new UpdateDietSettingsResponse();
                }

                return new UpdateDietSettingsResponse
                {
                    Successful = false,
                    ErrorMessage = "Unable to update diet settings"
                };
            }
            catch (Exception ex)
            {
                return new UpdateDietSettingsResponse
                {
                    Successful = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<ChangePasswordResponse> ChangePassword(User user, ChangePasswordRequest request)
        {
            try
            {
                var validationResult = request.Validate();

                if (!validationResult.IsValid)
                {
                    return new ChangePasswordResponse
                    {
                        Successful = false,
                        ErrorMessage = validationResult.Message
                    };
                }

                var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

                if (result.Succeeded)
                {
                    return new ChangePasswordResponse();
                }
                else if (result.Errors.Count() > 0)
                {
                    return new ChangePasswordResponse
                    {
                        Successful = false,
                        ErrorMessage = result.Errors.First().Description
                    };
                }

                return new ChangePasswordResponse
                {
                    Successful = false,
                    ErrorMessage = "Unable to change password"
                };
            }
            catch (Exception ex)
            {
                return new ChangePasswordResponse
                {
                    Successful = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public UserMetricsResponse GetUserTrackedMetrics(User user)
        {
            if (user != null)
            {
                var trackedMetrics = _userTrackedMetricRepository.Get(utm => utm.UserID == user.Id, utm => utm.Metric)
                                        .OrderBy(utm => utm.Metric.Name)
                                        .ToList();

                return new UserMetricsResponse
                {
                    Metrics = trackedMetrics
                };
            }

            return new UserMetricsResponse
            {
                ErrorMessage = "Cannot find user"
            };
        }

        public async Task<ToggleUserMetricTrackingResponse> UpdateUserMetricTracking(User user, ToggleUserMetricTrackingRequest request)
        {
            if (user != null)
            {
                var trackedMetric = _userTrackedMetricRepository.Get(utm => utm.MetricID == request.MetricID && utm.UserID == user.Id).FirstOrDefault();

                if (trackedMetric != null)
                {
                    trackedMetric.IsTracked = !trackedMetric.IsTracked;
                    await _userTrackedMetricRepository.Update(trackedMetric);

                    var trackedMetrics = _userTrackedMetricRepository.Get(utm => utm.UserID == user.Id, utm => utm.Metric)
                                        .OrderBy(utm => utm.Metric.Name)
                                        .ToList();

                    return new ToggleUserMetricTrackingResponse
                    {
                        Metrics = trackedMetrics
                    };
                }

                return new ToggleUserMetricTrackingResponse
                {
                    ErrorMessage = "Cannot find metric"
                };
            }

            return new ToggleUserMetricTrackingResponse
            {
                ErrorMessage = "Cannot find user"
            };
        }

        public UserGearResponse GetUserGear(User user)
        {
            if (user != null)
            {
                var gear = _gearRespository.Get(g => g.UserID == user.Id).ToList();

                return new UserGearResponse
                {
                    Gear = gear
                };
            }

            return new UserGearResponse
            {
                ErrorMessage = "Cannot find user"
            };
        }

        public UserCustomActivityResponse GetUserCustomActivities(User user)
        {
            if (user != null)
            {
                var activities = _activityRepository.Get(a => a.UserID == user.Id)
                                        .OrderBy(a => a.Name)
                                        .ToList();

                return new UserCustomActivityResponse
                {
                    Activities = activities
                };
            }

            return new UserCustomActivityResponse
            {
                ErrorMessage = "Cannot find user"
            };
        }

        #region helper functions
        private string generateJwtToken(User user)
        {
            var claims = new[] {
                new Claim("id", user.Id),
                new Claim("name", user.Name),
                new Claim("email", user.Email)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(Utilities.AppSettings.JwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
    #endregion
}