using FitnessTrackerApi.Controllers;
using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Tests.Mocks.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Xunit;
using Xunit.Abstractions;

namespace FitnessTrackerApi.Tests.Controllers
{
    public class UsersControllerTests
    {
        private readonly ITestOutputHelper _output;

        public UsersControllerTests(ITestOutputHelper output)
        {
            _output = output;
        }

        [Fact]
        public void UsersController_Authenticate_Successful()
        {
            var request = new AuthenticationRequest
            {
                Email = "testing@testing.com",
                Password = "validPassword123!"
            };

            var authResponse = new AuthenticationResponse
            {
                UserID = "123",
                Email = "testing@testing.com",
                Name = "Test User",
                Token = "supersecrettoken",
                Successful = true
            };

            var userService = new MockUserService().MockAuthenticate(authResponse);

            var usersController = new UsersController(userService.Object);

            var result = (OkObjectResult)usersController.Authenticate(request).Result;

            var response = JsonSerializer.Deserialize<AuthenticationResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal(request.Email, response.Email);
        }

        [Fact]
        public void UsersController_Authenticate_InvalidPassword()
        {
            var request = new AuthenticationRequest
            {
                Email = "testing@testing.com",
                Password = "invalidPassword123!"
            };

            var authResponse = new AuthenticationResponse
            {
                Successful = false,
                ErrorMessage = "Invalid email or password"
            };

            var userService = new MockUserService().MockAuthenticate(authResponse);

            var usersController = new UsersController(userService.Object);

            var result = (OkObjectResult)usersController.Authenticate(request).Result;

            var response = JsonSerializer.Deserialize<AuthenticationResponse>(result.Value.ToString());

            Assert.False(response.Successful);
            Assert.Equal("Invalid email or password", response.ErrorMessage);
        }

        [Fact]
        public void UsersController_Register_Successful()
        {
            var request = new RegistrationRequest
            {
                Name = "Test User",
                Email = "testing@testing.com",
                Password = "validPassword123!",
                MeasurementSystem = MeasurementSystem.US,
                Birthday = new System.DateTime(1985, 6, 15),
                Height = 72,
                Gender = 'M',
                ActivityLevel = ActivityLevel.Moderate
            };

            var registrationResponse = new RegistrationResponse
            {
                UserID = "123",
                Email = "testing@testing.com",
                Name = "Test User",
                Token = "supersecrettoken",
                Successful = true
            };

            var userService = new MockUserService().MockRegisterUser(registrationResponse);

            var usersController = new UsersController(userService.Object);

            var result = (OkObjectResult)usersController.Register(request).Result;

            var response = JsonSerializer.Deserialize<RegistrationResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal(request.Email, response.Email);
            Assert.Equal(request.Name, response.Name);
        }

        [Fact]
        public void UsersController_GetUser_ReturnsUser()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var userService = new MockUserService().MockGetUserRecord(user);

            var usersController = new UsersController(userService.Object);
            usersController.ControllerContext.HttpContext = new DefaultHttpContext();
            usersController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)usersController.GetUser().Result;

            var response = JsonSerializer.Deserialize<UserResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal(user.Name, response.User.Name);
            Assert.Equal(user.Email, response.User.Email);
        }

        [Fact]
        public void UsersController_CheckUserEmail_ReturnsValid()
        {
            var checkResponse = new CheckEmailResponse
            {
                Successful = true,
                Valid = true
            };

            var userService = new MockUserService().MockCheckEmail(checkResponse);
            var usersController = new UsersController(userService.Object);

            var result = (OkObjectResult)usersController.CheckUserEmail("123", "testing@testing.com").Result;

            var response = JsonSerializer.Deserialize<CheckEmailResponse>(result.Value.ToString());

            Assert.True(response.Valid);
        }

        [Fact]
        public void UsersController_CheckUserEmail_ReturnsInvalid()
        {
            var checkResponse = new CheckEmailResponse
            {
                Successful = true,
                Valid = false
            };

            var userService = new MockUserService().MockCheckEmail(checkResponse);
            var usersController = new UsersController(userService.Object);

            var result = (OkObjectResult)usersController.CheckUserEmail("123", "testing@testing.com").Result;

            var response = JsonSerializer.Deserialize<CheckEmailResponse>(result.Value.ToString());

            Assert.False(response.Valid);
        }

        [Fact]
        public void UsersController_UpdateUserProfile_Successful()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var request = new UpdateProfileRequest
            {
                Name = "Test User",
                Email = "testing@testing.com",
                MeasurementSystem = MeasurementSystem.US,
                ActivityLevel = ActivityLevel.Sedentary,
                Birthday = new System.DateTime(1980, 1, 1),
                Gender = 'M',
                Height = 72
            };

            var updateResponse = new UpdateProfileResponse
            {
                Successful = true
            };

            var userService = new MockUserService().MockUpdateUserProfile(updateResponse);

            var usersController = new UsersController(userService.Object);
            usersController.ControllerContext.HttpContext = new DefaultHttpContext();
            usersController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)usersController.UpdateUserProfile(request).Result;

            var response = JsonSerializer.Deserialize<UpdateProfileResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Empty(response.ErrorMessage);
        }

        [Fact]
        public void UsersController_UploadAvatar_Successful()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var request = new AvatarUploadRequest
            {
                Image = null
            };

            var imageResponse = new ImageUploadResponse
            {
                Image = "avatar.jpg"
            };

            var userService = new MockUserService().MockUpdateAvatar(imageResponse);

            var usersController = new UsersController(userService.Object);
            usersController.ControllerContext.HttpContext = new DefaultHttpContext();
            usersController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)usersController.UploadAvatar(request).Result;

            var response = JsonSerializer.Deserialize<ImageUploadResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Empty(response.ErrorMessage);
            Assert.Equal("avatar.jpg", response.Image);
        }

        [Fact]
        public void UsersController_GetAvatar_ReturnsAvatar()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var userService = new MockUserService().MockGetUserAvatar("avatar.jpg");

            var usersController = new UsersController(userService.Object);
            usersController.ControllerContext.HttpContext = new DefaultHttpContext();
            usersController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)usersController.GetAvatar();

            var response = JsonSerializer.Deserialize<ImageUploadResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Empty(response.ErrorMessage);
            Assert.Equal("avatar.jpg", response.Image);
        }

        [Fact]
        public void UsersController_RemoveAvatar_Successful()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var userService = new MockUserService().MockRemoveAvatar(new BaseResponse());

            var usersController = new UsersController(userService.Object);
            usersController.ControllerContext.HttpContext = new DefaultHttpContext();
            usersController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)usersController.RemoveAvatar().Result;

            var response = JsonSerializer.Deserialize<BaseResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Empty(response.ErrorMessage);
        }

        [Fact]
        public void UsersController_UpdateActivitySettings_Successful()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var request = new UpdateActivitySettingsRequest
            {
                ActiveMintueTarget = 30,
                CaloriesBurnedSetting = CaloriesBurnedOffset.Ignore,
                CaloriesBurnedTarget = 300,
                EnableActiveMinuteTarget = true,
                EnableCaloriesBurnedTarget = true
            };

            var userService = new MockUserService().MockUpdateActivitySettings(new UpdateActivitySettingsResponse());

            var usersController = new UsersController(userService.Object);
            usersController.ControllerContext.HttpContext = new DefaultHttpContext();
            usersController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)usersController.UpdateActivitySettings(request).Result;

            var response = JsonSerializer.Deserialize<UpdateActivitySettingsResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Empty(response.ErrorMessage);
        }

        [Fact]
        public void UsersController_UpdateDietSettings_Successful()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var request = new UpdateDietSettingsRequest
            {
                ManuallyCalculateCalories = true,
                MacroTargetMode = MacroTargetMode.Manual,
                DietMode = DietMode.Maintenance,
                DietPercentage = 0.0M,
                EnableCalorieTarget = true,
                CalorieTarget = 2000,
                EnableProteinTarget = true,
                ProteinTarget = 160,
                EnableCarbohydratesTarget = true,
                CarbohydratesTarget = 160,
                EnableFatTarget = true,
                FatTarget = 62,
                EnableColorCoding = true,
                CaloriesYellowStart = 80,
                CaloriesGreenStart = 90,
                CaloriesGreenEnd = 110,
                CaloriesYellowEnd = 120,
                ProteinYellowStart = 80,
                ProteinGreenStart = 90,
                ProteinGreenEnd = 110,
                ProteinYellowEnd = 120,
                CarbohydratesYellowStart = 80,
                CarbohydratesGreenStart = 90,
                CarbohydratesGreenEnd = 110,
                CarbohydratesYellowEnd = 120,
                FatYellowStart = 80,
                FatGreenStart = 90,
                FatGreenEnd = 110,
                FatYellowEnd = 120
            };

            var userService = new MockUserService().MockUpdateDietSettings(new UpdateDietSettingsResponse());

            var usersController = new UsersController(userService.Object);
            usersController.ControllerContext.HttpContext = new DefaultHttpContext();
            usersController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)usersController.UpdateDietSettings(request).Result;

            var response = JsonSerializer.Deserialize<UpdateDietSettingsResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Empty(response.ErrorMessage);
        }

        [Fact]
        public void UsersController_ChangePassword_Successful()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var request = new ChangePasswordRequest
            {
                CurrentPassword = "currentPassword123!",
                NewPassword = "newPassword123!",
                ConfirmNewPassword = "newPassword123!"
            };

            var userService = new MockUserService().MockChangePassword(new ChangePasswordResponse());

            var usersController = new UsersController(userService.Object);
            usersController.ControllerContext.HttpContext = new DefaultHttpContext();
            usersController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)usersController.ChangePassword(request).Result;

            var response = JsonSerializer.Deserialize<ChangePasswordResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Empty(response.ErrorMessage);
        }

        [Fact]
        public void UsersController_GetUserTrackedMetrics_ReturnsMetrics()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var metricsResponse = new UserMetricsResponse
            {
                Metrics = new List<UserTrackedMetric>
                {
                    new UserTrackedMetric { ID = 1, UserID = "123", IsTracked = true, Metric = new Metric { ID = -1, Name = "Test Metric 1", Type = MetricType.Weight, IsSystem = true }, MetricID = -1, User = null },
                    new UserTrackedMetric { ID = 2, UserID = "123", IsTracked = false, Metric = new Metric { ID = -2, Name = "Test Metric 2", Type = MetricType.Percentage, IsSystem = true }, MetricID = -2, User = null },
                    new UserTrackedMetric { ID = 3, UserID = "123", IsTracked = true, Metric = new Metric { ID = 1, Name = "User Metric 1", Type = MetricType.Numeric, IsSystem = false, UserID = "123" }, MetricID = 1, User = null }
                }
            };

            var userService = new MockUserService().MockGetUserTrackedMetrics(metricsResponse);

            var usersController = new UsersController(userService.Object);
            usersController.ControllerContext.HttpContext = new DefaultHttpContext();
            usersController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)usersController.GetUserTrackedMetrics();

            var response = JsonSerializer.Deserialize<UserMetricsResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Empty(response.ErrorMessage);
            Assert.Equal(3, response.Metrics.Count);
        }

        [Fact]
        public void UsersController_ToggleUserTrackedMetric_Successful()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var request = new ToggleUserMetricTrackingRequest
            {
                MetricID = -2
            };

            var toggleResponse = new ToggleUserMetricTrackingResponse
            {
                Metrics = new List<UserTrackedMetric>
                {
                    new UserTrackedMetric { ID = 1, UserID = "123", IsTracked = true, Metric = new Metric { ID = -1, Name = "Test Metric 1", Type = MetricType.Weight, IsSystem = true }, MetricID = -1, User = null },
                    new UserTrackedMetric { ID = 2, UserID = "123", IsTracked = false, Metric = new Metric { ID = -2, Name = "Test Metric 2", Type = MetricType.Percentage, IsSystem = true }, MetricID = -2, User = null },
                    new UserTrackedMetric { ID = 3, UserID = "123", IsTracked = true, Metric = new Metric { ID = 1, Name = "User Metric 1", Type = MetricType.Numeric, IsSystem = false, UserID = "123" }, MetricID = 1, User = null }
                }
            };

            var userService = new MockUserService().MockUpdateUserMetricTracking(toggleResponse);

            var usersController = new UsersController(userService.Object);
            usersController.ControllerContext.HttpContext = new DefaultHttpContext();
            usersController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)usersController.ToggleUserTrackedMetric(request).Result;

            var response = JsonSerializer.Deserialize<ToggleUserMetricTrackingResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Empty(response.ErrorMessage);
            Assert.Equal(3, response.Metrics.Count);
        }

        [Fact]
        public void UsersController_GetUserGear_ReturnsGear()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var gearResponse = new UserGearResponse
            {
                Gear = new List<Gear>
                {
                    new Gear { ID = 1, Active = true, Name = "Gear 1", UserID = "123" },
                    new Gear { ID = 2, Active = true, Name = "Gear 2", UserID = "123" },
                    new Gear { ID = 3, Active = true, Name = "Gear 3", UserID = "123" }
                }
            };

            var userService = new MockUserService().MockGetUserGear(gearResponse);

            var usersController = new UsersController(userService.Object);
            usersController.ControllerContext.HttpContext = new DefaultHttpContext();
            usersController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)usersController.GetUserGear();

            var response = JsonSerializer.Deserialize<UserGearResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Empty(response.ErrorMessage);
            Assert.Equal(3, response.Gear.Count);
        }

        [Fact]
        public void UsersController_GetUserCustomActivities_ReturnsGear()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var activitiesResponse = new UserCustomActivityResponse
            {
                Activities = new List<Activity>
                {
                    new Activity { ID = 1, EstimatedCaloriesBurnedPerMinute = 5, IsSystem = false, Name = "Activity 1", UserID = "123" },
                    new Activity { ID = 2, EstimatedCaloriesBurnedPerMinute = 5, IsSystem = false, Name = "Activity 2", UserID = "123" },
                    new Activity { ID = 3, EstimatedCaloriesBurnedPerMinute = 5, IsSystem = false, Name = "Activity 3", UserID = "123" }
                }
            };

            var userService = new MockUserService().MockGetUserCustomActivities(activitiesResponse);

            var usersController = new UsersController(userService.Object);
            usersController.ControllerContext.HttpContext = new DefaultHttpContext();
            usersController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)usersController.GetUserCustomActivities();

            var response = JsonSerializer.Deserialize<UserCustomActivityResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Empty(response.ErrorMessage);
            Assert.Equal(3, response.Activities.Count);
        }
    }
}