using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Repositories;
using FitnessTrackerApi.Services;
using FitnessTrackerApi.Tests.Mocks.Repositories;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;
using Xunit.Abstractions;

namespace FitnessTrackerApi.Tests.Services
{
    public class UserServiceTests
    {
        private Mock<UserManager<User>> _mockUserManager;
        private Mock<SignInManager<User>> _mockSignInManager;
        private Mock<IHostEnvironment> _mockHostEnvironment;
        private readonly ITestOutputHelper _output;

        public UserServiceTests(ITestOutputHelper output)
        {
            _mockUserManager = new Mock<UserManager<User>>(
                new Mock<IUserStore<User>>().Object,
                new Mock<IOptions<IdentityOptions>>().Object,
                new Mock<IPasswordHasher<User>>().Object,
                new IUserValidator<User>[0],
                new IPasswordValidator<User>[0],
                new Mock<ILookupNormalizer>().Object,
                new Mock<IdentityErrorDescriber>().Object,
                new Mock<IServiceProvider>().Object,
                new Mock<ILogger<UserManager<User>>>().Object);

            _mockSignInManager = new Mock<SignInManager<User>>(
                _mockUserManager.Object,
                new Mock<IHttpContextAccessor>().Object,
                new Mock<IUserClaimsPrincipalFactory<User>>().Object,
                new Mock<IOptions<IdentityOptions>>().Object,
                new Mock<ILogger<SignInManager<User>>>().Object,
                new Mock<IAuthenticationSchemeProvider>().Object,
                new Mock<IUserConfirmation<User>>().Object);

            _mockHostEnvironment = new Mock<IHostEnvironment>();

            _output = output;

            AppSettings config = new AppSettings
            {
                JwtSecret = "94jfdsf98wnkjsdfds93424nsdaifds",
                MaxAvatarSize = 1048576
            };

            Utilities.AppSettings = config;
        }

        [Fact]
        public void UserService_RegisterUser_Successful()
        {
            var request = new RegistrationRequest
            {
                Name = "Test User",
                Email = "testing@testing.com",
                MeasurementSystem = MeasurementSystem.US,
                Gender = 'M',
                Height = 72,
                ActivityLevel = ActivityLevel.Moderate,
                Birthday = new DateTime(1985, 6, 1)
            };

            var systemMetrics = new List<Metric>
            {
                new Metric { ID = -1, Name = "Test Metric 1", Type = MetricType.Weight },
                new Metric { ID = -2, Name = "Test Metric 2", Type = MetricType.None },
                new Metric { ID = 1, Name = "User Metric 1", Type = MetricType.None }
            };

            var mockDailyTargetRepo = Mock.Of<IRepository<DailyTarget>>();
            var mockUserMetricRepo = Mock.Of<IRepository<UserMetric>>();

            var mockUserTrackedMetricRepo = new MockRepository<UserTrackedMetric>();
            mockUserTrackedMetricRepo.MockAdd(new UserTrackedMetric { UserID = "123", MetricID = systemMetrics[0].ID, IsTracked = true });

            var metricRepo = new MockRepository<Metric>();
            metricRepo.MockGet(systemMetrics.AsQueryable());

            var gearRepo = Mock.Of<IRepository<Gear>>();
            var activityRepo = Mock.Of<IRepository<Activity>>();

            _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);

            var userService = new UserService(
                _mockUserManager.Object,
                _mockSignInManager.Object,
                _mockHostEnvironment.Object,
                mockDailyTargetRepo,
                mockUserMetricRepo,
                mockUserTrackedMetricRepo.Object,
                metricRepo.Object,
                gearRepo,
                activityRepo);

            var response = userService.RegisterUser(request).Result;

            Assert.True(response.Successful);
            Assert.NotEmpty(response.Token);
        }

        [Fact]
        public void UserService_Authenticate_Successful()
        {
            var request = new AuthenticationRequest
            {
                Email = "testing@testing.com",
                Password = "validPassword123!"
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com",
            };

            var mockDailyTargetRepo = Mock.Of<IRepository<DailyTarget>>();
            var mockUserMetricRepo = Mock.Of<IRepository<UserMetric>>();
            var metricRepo = Mock.Of<IRepository<Metric>>();
            var mockUserTrackedMetricRepo = Mock.Of<IRepository<UserTrackedMetric>>();
            var gearRepo = Mock.Of<IRepository<Gear>>();
            var activityRepo = Mock.Of<IRepository<Activity>>();

            _mockUserManager.Setup(x => x.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(user);

            _mockSignInManager.Setup(x => x.CheckPasswordSignInAsync(user, request.Password, false))
                .ReturnsAsync(SignInResult.Success);

            var userService = new UserService(
                _mockUserManager.Object,
                _mockSignInManager.Object,
                _mockHostEnvironment.Object,
                mockDailyTargetRepo,
                mockUserMetricRepo,
                mockUserTrackedMetricRepo,
                metricRepo,
                gearRepo,
                activityRepo);

            var response = userService.Authenticate(request).Result;

            Assert.NotEmpty(response.Token);
            Assert.Equal(request.Email, response.Email);
        }

        [Fact]
        public void UserService_Authenticate_UserNotFound()
        {
            var request = new AuthenticationRequest
            {
                Email = "testing@testing.com",
                Password = "validPassword123!"
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com",
            };

            var mockDailyTargetRepo = Mock.Of<IRepository<DailyTarget>>();
            var mockUserMetricRepo = Mock.Of<IRepository<UserMetric>>();
            var metricRepo = Mock.Of<IRepository<Metric>>();
            var mockUserTrackedMetricRepo = Mock.Of<IRepository<UserTrackedMetric>>();
            var gearRepo = Mock.Of<IRepository<Gear>>();
            var activityRepo = Mock.Of<IRepository<Activity>>();

            _mockUserManager.Setup(x => x.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync((User)null);

            _mockSignInManager.Setup(x => x.CheckPasswordSignInAsync(user, request.Password, false))
                .ReturnsAsync(SignInResult.Success);

            var userService = new UserService(
                _mockUserManager.Object,
                _mockSignInManager.Object,
                _mockHostEnvironment.Object,
                mockDailyTargetRepo,
                mockUserMetricRepo,
                mockUserTrackedMetricRepo,
                metricRepo,
                gearRepo,
                activityRepo);

            var response = userService.Authenticate(request).Result;

            Assert.Equal("Invalid email or password", response.ErrorMessage);
        }

        [Fact]
        public void UserService_Authenticate_BadPassword()
        {
            var request = new AuthenticationRequest
            {
                Email = "testing@testing.com",
                Password = "validPassword123!"
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com",
            };

            var mockDailyTargetRepo = Mock.Of<IRepository<DailyTarget>>();
            var mockUserMetricRepo = Mock.Of<IRepository<UserMetric>>();
            var metricRepo = Mock.Of<IRepository<Metric>>();
            var mockUserTrackedMetricRepo = Mock.Of<IRepository<UserTrackedMetric>>();
            var gearRepo = Mock.Of<IRepository<Gear>>();
            var activityRepo = Mock.Of<IRepository<Activity>>();

            _mockUserManager.Setup(x => x.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(user);

            _mockSignInManager.Setup(x => x.CheckPasswordSignInAsync(user, request.Password, false))
                .ReturnsAsync(SignInResult.Failed);

            var userService = new UserService(
                _mockUserManager.Object,
                _mockSignInManager.Object,
                _mockHostEnvironment.Object,
                mockDailyTargetRepo,
                mockUserMetricRepo,
                mockUserTrackedMetricRepo,
                metricRepo,
                gearRepo,
                activityRepo);

            var response = userService.Authenticate(request).Result;

            Assert.Equal("Invalid email or password", response.ErrorMessage);
        }

        [Fact]
        public void UserService_GetUserRecord_ReturnsResult()
        {
            var dailyTargets = new List<DailyTarget>();
            var dailyTarget = new DailyTarget
            {
                ID = 1,
                UserID = "123",
                MacroTargetMode = MacroTargetMode.Manual,
                EnableActiveMinuteTarget = false,
                ActiveMintueTarget = 30,
                EnableCaloriesBurnedTarget = false,
                CaloriesBurnedTarget = 300,
                EnableCalorieTarget = true,
                CalorieTarget = 2320,
                ProteinPercentage = 35,
                CarbohydratesPercentage = 35,
                FatPercentage = 30,
                ProteinTarget = 158,
                CarbohydratesTarget = 158,
                FatTarget = 60,
                EnableProteinTarget = true,
                EnableCarbohydratesTarget = true,
                EnableFatTarget = false
            };

            dailyTargets.Add(dailyTarget);

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com",
                MeasurementSystem = MeasurementSystem.US,
                Birthday = new DateTime(1980, 01, 01),
                Height = 60,
                Gender = 'M',
                ActivityLevel = ActivityLevel.Moderate,
                DailyTargetID = 1
            };

            var userMetrics = new List<UserMetric>();

            var mockDailyTargetRepo = new MockRepository<DailyTarget>().MockGet(dailyTargets.AsQueryable());
            var mockUserMetricRepo = new MockRepository<UserMetric>().MockGet(userMetrics.AsQueryable());
            var mockUserTrackedMetricRepo = Mock.Of<IRepository<UserTrackedMetric>>();
            var metricRepo = Mock.Of<IRepository<Metric>>();
            var gearRepo = Mock.Of<IRepository<Gear>>();
            var activityRepo = Mock.Of<IRepository<Activity>>();

            _mockUserManager.Setup(x => x.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(user);

            var userService = new UserService(
                _mockUserManager.Object,
                _mockSignInManager.Object,
                _mockHostEnvironment.Object,
                mockDailyTargetRepo.Object,
                mockUserMetricRepo.Object,
                mockUserTrackedMetricRepo,
                metricRepo,
                gearRepo,
                activityRepo);



            var response = userService.GetUserRecord("123").Result;

            Assert.Equal(user.Name, response.Name);
            Assert.Equal(user.Email, response.Email);
            Assert.Equal(60, response.DailyTarget.FatTarget);
            Assert.Equal(2320, response.DailyTarget.CalorieTarget);
        }

        [Fact]
        public void UserService_CheckEmail_ReturnsExistingEmail()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com",
                MeasurementSystem = MeasurementSystem.US,
                Birthday = new DateTime(1980, 01, 01),
                Height = 60,
                Gender = 'M',
                ActivityLevel = ActivityLevel.Moderate,
                DailyTargetID = 1
            };

            var mockDailyTargetRepo = Mock.Of<IRepository<DailyTarget>>();
            var mockUserMetricRepo = Mock.Of<IRepository<UserMetric>>();
            var mockUserTrackedMetricRepo = Mock.Of<IRepository<UserTrackedMetric>>();
            var metricRepo = Mock.Of<IRepository<Metric>>();
            var gearRepo = Mock.Of<IRepository<Gear>>();
            var activityRepo = Mock.Of<IRepository<Activity>>();

            _mockUserManager.Setup(x => x.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(user);

            var userService = new UserService(
                _mockUserManager.Object,
                _mockSignInManager.Object,
                _mockHostEnvironment.Object,
                mockDailyTargetRepo,
                mockUserMetricRepo,
                mockUserTrackedMetricRepo,
                metricRepo,
                gearRepo,
                activityRepo);

            var response = userService.CheckEmail("1234", "TestUser123@testing.com").Result;

            Assert.False(response.Valid);
        }

        [Fact]
        public void UserService_CheckEmail_ReturnsAvailableEmail()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com",
                MeasurementSystem = MeasurementSystem.US,
                Birthday = new DateTime(1980, 01, 01),
                Height = 60,
                Gender = 'M',
                ActivityLevel = ActivityLevel.Moderate,
                DailyTargetID = 1
            };

            var mockDailyTargetRepo = Mock.Of<IRepository<DailyTarget>>();
            var mockUserMetricRepo = Mock.Of<IRepository<UserMetric>>();
            var mockUserTrackedMetricRepo = Mock.Of<IRepository<UserTrackedMetric>>();
            var metricRepo = Mock.Of<IRepository<Metric>>();
            var gearRepo = Mock.Of<IRepository<Gear>>();
            var activityRepo = Mock.Of<IRepository<Activity>>();

            _mockUserManager.Setup(x => x.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(user);

            var userService = new UserService(
                _mockUserManager.Object,
                _mockSignInManager.Object,
                _mockHostEnvironment.Object,
                mockDailyTargetRepo,
                mockUserMetricRepo,
                mockUserTrackedMetricRepo,
                metricRepo,
                gearRepo,
                activityRepo);

            var response = userService.CheckEmail("123", "TestUser123@testing.com").Result;

            Assert.True(response.Valid);
        }

        [Fact]
        public void UserService_UpdateUserProfile_Success()
        {
            var request = new UpdateProfileRequest
            {
                Email = "TestUser123@testing.com",
                Name = "Test User",
                Height = 70,
                Birthday = new DateTime(1985, 01, 01),
                Gender = 'M',
                ActivityLevel = ActivityLevel.Moderate
            };

            var user = new User
            {
                Id = "123",
                Email = "TestUser123@testing.com",
                UserName = "TestUser123@testing.com",
                Name = "Test User",
                Height = 70,
                Birthday = new DateTime(1985, 01, 01),
                Gender = 'M',
                ActivityLevel = ActivityLevel.Moderate
            };

            var mockDailyTargetRepo = Mock.Of<IRepository<DailyTarget>>();
            var mockUserMetricRepo = Mock.Of<IRepository<UserMetric>>();
            var mockUserTrackedMetricRepo = Mock.Of<IRepository<UserTrackedMetric>>();
            var metricRepo = Mock.Of<IRepository<Metric>>();
            var gearRepo = Mock.Of<IRepository<Gear>>();
            var activityRepo = Mock.Of<IRepository<Activity>>();

            _mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Success);

            var userService = new UserService(
                _mockUserManager.Object,
                _mockSignInManager.Object,
                _mockHostEnvironment.Object,
                mockDailyTargetRepo,
                mockUserMetricRepo,
                mockUserTrackedMetricRepo,
                metricRepo,
                gearRepo,
                activityRepo);

            var response = userService.UpdateUserProfile(user, request).Result;

            Assert.True(response.Successful);
        }

        [Fact]
        public void UserService_UpdateActivitySettings_Success()
        {
            var request = new UpdateActivitySettingsRequest
            {
                ActiveMintueTarget = 30,
                CaloriesBurnedSetting = CaloriesBurnedOffset.Ignore,
                CaloriesBurnedTarget = 500,
                EnableActiveMinuteTarget = true,
                EnableCaloriesBurnedTarget = true
            };

            var dailyTargets = new List<DailyTarget>();
            var dailyTarget = new DailyTarget
            {
                ID = 1,
                UserID = "123",
                MacroTargetMode = MacroTargetMode.Manual,
                EnableActiveMinuteTarget = false,
                ActiveMintueTarget = 30,
                EnableCaloriesBurnedTarget = true,
                CaloriesBurnedTarget = 500,
                EnableCalorieTarget = true,
                CalorieTarget = 2320,
                ProteinPercentage = 35,
                CarbohydratesPercentage = 35,
                FatPercentage = 30,
                ProteinTarget = 158,
                CarbohydratesTarget = 158,
                FatTarget = 60,
                EnableProteinTarget = true,
                EnableCarbohydratesTarget = true,
                EnableFatTarget = false
            };

            dailyTargets.Add(dailyTarget);

            var user = new User
            {
                Id = "123",
                CaloriesBurnedSetting = request.CaloriesBurnedSetting,
                DailyTarget = dailyTarget
            };

            var mockDailyTargetRepo = new MockRepository<DailyTarget>();
            mockDailyTargetRepo.MockGet(dailyTargets.AsQueryable());
            mockDailyTargetRepo.MockUpdate(dailyTarget);

            var mockUserMetricRepo = Mock.Of<IRepository<UserMetric>>();
            var mockUserTrackedMetricRepo = Mock.Of<IRepository<UserTrackedMetric>>();
            var metricRepo = Mock.Of<IRepository<Metric>>();
            var gearRepo = Mock.Of<IRepository<Gear>>();
            var activityRepo = Mock.Of<IRepository<Activity>>();

            _mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Success);

            var userService = new UserService(
                _mockUserManager.Object,
                _mockSignInManager.Object,
                _mockHostEnvironment.Object,
                mockDailyTargetRepo.Object,
                mockUserMetricRepo,
                mockUserTrackedMetricRepo,
                metricRepo,
                gearRepo,
                activityRepo);

            var response = userService.UpdateActivitySettings(user, request).Result;

            Assert.True(response.Successful);
        }

        [Fact]
        public void UserService_UpdateDietSettings_Success()
        {
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

            var dailyTargets = new List<DailyTarget>();
            var dailyTarget = new DailyTarget
            {
                ID = 1,
                UserID = "123",
                MacroTargetMode = MacroTargetMode.Manual,
                EnableActiveMinuteTarget = false,
                ActiveMintueTarget = 30,
                EnableCaloriesBurnedTarget = true,
                CaloriesBurnedTarget = 500,
                EnableCalorieTarget = request.EnableCalorieTarget,
                CalorieTarget = request.CalorieTarget,
                ProteinPercentage = 35,
                CarbohydratesPercentage = 35,
                FatPercentage = 30,
                ProteinTarget = request.ProteinTarget,
                CarbohydratesTarget = request.CarbohydratesTarget,
                FatTarget = request.FatTarget,
                EnableProteinTarget = request.EnableProteinTarget,
                EnableCarbohydratesTarget = request.EnableCarbohydratesTarget,
                EnableFatTarget = request.EnableFatTarget,
                EnableColorCoding = request.EnableColorCoding,
                CaloriesYellowStart = request.CaloriesYellowStart,
                CaloriesGreenStart = request.CaloriesGreenStart,
                CaloriesGreenEnd = request.CaloriesGreenEnd,
                CaloriesYellowEnd = request.CaloriesYellowEnd,
                ProteinYellowStart = request.ProteinYellowStart,
                ProteinGreenStart = request.ProteinGreenStart,
                ProteinGreenEnd = request.ProteinGreenEnd,
                ProteinYellowEnd = request.ProteinYellowEnd,
                CarbohydratesYellowStart = request.CarbohydratesYellowStart,
                CarbohydratesGreenStart = request.CarbohydratesGreenStart,
                CarbohydratesGreenEnd = request.CarbohydratesGreenEnd,
                CarbohydratesYellowEnd = request.CarbohydratesYellowEnd,
                FatYellowStart = request.FatYellowStart,
                FatGreenStart = request.FatGreenStart,
                FatGreenEnd = request.FatGreenEnd,
                FatYellowEnd = request.FatYellowEnd
            };

            dailyTargets.Add(dailyTarget);

            var user = new User
            {
                Id = "123",
                ManuallyCalculateCalories = request.ManuallyCalculateCalories,
                DietMode = request.DietMode,
                DietPercentage = request.DietPercentage,
                DailyTarget = dailyTarget
            };

            var mockDailyTargetRepo = new MockRepository<DailyTarget>();
            mockDailyTargetRepo.MockGet(dailyTargets.AsQueryable());
            mockDailyTargetRepo.MockUpdate(dailyTarget);

            var mockUserMetricRepo = Mock.Of<IRepository<UserMetric>>();
            var mockUserTrackedMetricRepo = Mock.Of<IRepository<UserTrackedMetric>>();
            var metricRepo = Mock.Of<IRepository<Metric>>();
            var gearRepo = Mock.Of<IRepository<Gear>>();
            var activityRepo = Mock.Of<IRepository<Activity>>();

            _mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Success);

            var userService = new UserService(
                _mockUserManager.Object,
                _mockSignInManager.Object,
                _mockHostEnvironment.Object,
                mockDailyTargetRepo.Object,
                mockUserMetricRepo,
                mockUserTrackedMetricRepo,
                metricRepo,
                gearRepo,
                activityRepo);

            var response = userService.UpdateDietSettings(user, request).Result;

            Assert.True(response.Successful);
        }

        [Fact]
        public void UserService_ChangePassword_Success()
        {
            var request = new ChangePasswordRequest
            {
                CurrentPassword = "currentPassword123!",
                NewPassword = "newPassword123!",
                ConfirmNewPassword = "newPassword123!"
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com",
                MeasurementSystem = MeasurementSystem.US,
                Birthday = new DateTime(1980, 01, 01),
                Height = 60,
                Gender = 'M',
                ActivityLevel = ActivityLevel.Moderate,
                DailyTargetID = 1
            };

            _mockUserManager.Setup(um => um.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword))
                .ReturnsAsync(IdentityResult.Success);

            var mockDailyTargetRepo = Mock.Of<IRepository<DailyTarget>>();
            var mockUserMetricRepo = Mock.Of<IRepository<UserMetric>>();
            var mockUserTrackedMetricRepo = Mock.Of<IRepository<UserTrackedMetric>>();
            var metricRepo = Mock.Of<IRepository<Metric>>();
            var gearRepo = Mock.Of<IRepository<Gear>>();
            var activityRepo = Mock.Of<IRepository<Activity>>();

            _mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Success);

            var userService = new UserService(
                _mockUserManager.Object,
                _mockSignInManager.Object,
                _mockHostEnvironment.Object,
                mockDailyTargetRepo,
                mockUserMetricRepo,
                mockUserTrackedMetricRepo,
                metricRepo,
                gearRepo,
                activityRepo);

            var response = userService.ChangePassword(user, request).Result;

            Assert.True(response.Successful);
        }

        [Fact]
        public void UserService_ChangePassword_InvalidCurrentPassword()
        {
            var request = new ChangePasswordRequest
            {
                CurrentPassword = "currentPassword123!",
                NewPassword = "newPassword123!",
                ConfirmNewPassword = "newPassword123!"
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com",
                MeasurementSystem = MeasurementSystem.US,
                Birthday = new DateTime(1980, 01, 01),
                Height = 60,
                Gender = 'M',
                ActivityLevel = ActivityLevel.Moderate,
                DailyTargetID = 1
            };

            _mockUserManager.Setup(um => um.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword))
                .ReturnsAsync(IdentityResult.Failed());

            var mockDailyTargetRepo = Mock.Of<IRepository<DailyTarget>>();
            var mockUserMetricRepo = Mock.Of<IRepository<UserMetric>>();
            var mockUserTrackedMetricRepo = Mock.Of<IRepository<UserTrackedMetric>>();
            var metricRepo = Mock.Of<IRepository<Metric>>();
            var gearRepo = Mock.Of<IRepository<Gear>>();
            var activityRepo = Mock.Of<IRepository<Activity>>();

            _mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Success);

            var userService = new UserService(
                _mockUserManager.Object,
                _mockSignInManager.Object,
                _mockHostEnvironment.Object,
                mockDailyTargetRepo,
                mockUserMetricRepo,
                mockUserTrackedMetricRepo,
                metricRepo,
                gearRepo,
                activityRepo);

            var response = userService.ChangePassword(user, request).Result;

            Assert.False(response.Successful);
            Assert.NotEmpty(response.ErrorMessage);
        }

        [Fact]
        public void UserService_ChangePassword_NewPasswordsDoNotMatch()
        {
            var request = new ChangePasswordRequest
            {
                CurrentPassword = "currentPassword123!",
                NewPassword = "newPassword123!",
                ConfirmNewPassword = "newPassword123456!"
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com",
                MeasurementSystem = MeasurementSystem.US,
                Birthday = new DateTime(1980, 01, 01),
                Height = 60,
                Gender = 'M',
                ActivityLevel = ActivityLevel.Moderate,
                DailyTargetID = 1
            };

            _mockUserManager.Setup(um => um.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword))
                .ReturnsAsync(IdentityResult.Failed());

            var mockDailyTargetRepo = Mock.Of<IRepository<DailyTarget>>();
            var mockUserMetricRepo = Mock.Of<IRepository<UserMetric>>();
            var mockUserTrackedMetricRepo = Mock.Of<IRepository<UserTrackedMetric>>();
            var metricRepo = Mock.Of<IRepository<Metric>>();
            var gearRepo = Mock.Of<IRepository<Gear>>();
            var activityRepo = Mock.Of<IRepository<Activity>>();

            _mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Success);

            var userService = new UserService(
                _mockUserManager.Object,
                _mockSignInManager.Object,
                _mockHostEnvironment.Object,
                mockDailyTargetRepo,
                mockUserMetricRepo,
                mockUserTrackedMetricRepo,
                metricRepo,
                gearRepo,
                activityRepo);

            var response = userService.ChangePassword(user, request).Result;

            Assert.False(response.Successful);
            Assert.Equal("Passwords do not match", response.ErrorMessage);
        }

        [Fact]
        public void UserService_ChangePassword_InvalidNewPassword()
        {
            var request = new ChangePasswordRequest
            {
                CurrentPassword = "currentPassword123!",
                NewPassword = "paswd",
                ConfirmNewPassword = "paswd"
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com",
                MeasurementSystem = MeasurementSystem.US,
                Birthday = new DateTime(1980, 01, 01),
                Height = 60,
                Gender = 'M',
                ActivityLevel = ActivityLevel.Moderate,
                DailyTargetID = 1
            };

            _mockUserManager.Setup(um => um.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword))
                .ReturnsAsync(IdentityResult.Failed());

            var mockDailyTargetRepo = Mock.Of<IRepository<DailyTarget>>();
            var mockUserMetricRepo = Mock.Of<IRepository<UserMetric>>();
            var mockUserTrackedMetricRepo = Mock.Of<IRepository<UserTrackedMetric>>();
            var metricRepo = Mock.Of<IRepository<Metric>>();
            var gearRepo = Mock.Of<IRepository<Gear>>();
            var activityRepo = Mock.Of<IRepository<Activity>>();

            _mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Success);

            var userService = new UserService(
                _mockUserManager.Object,
                _mockSignInManager.Object,
                _mockHostEnvironment.Object,
                mockDailyTargetRepo,
                mockUserMetricRepo,
                mockUserTrackedMetricRepo,
                metricRepo,
                gearRepo,
                activityRepo);

            var response = userService.ChangePassword(user, request).Result;

            Assert.False(response.Successful);
            Assert.Equal("Password must be at least 8 characters and contain an upper case letter", response.ErrorMessage);
        }

        [Fact]
        public void UserService_GetUserTrackedMetrics_Successful()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var userTrackedMetrics = new List<UserTrackedMetric>
            {
                new UserTrackedMetric { ID = 1, UserID = "123", IsTracked = true, Metric = new Metric { ID = -1, Name = "Test Metric 1", Type = MetricType.Weight, IsSystem = true }, MetricID = -1, User = null },
                new UserTrackedMetric { ID = 2, UserID = "123", IsTracked = false, Metric = new Metric { ID = -2, Name = "Test Metric 2", Type = MetricType.Percentage, IsSystem = true }, MetricID = -2, User = null },
                new UserTrackedMetric { ID = 3, UserID = "123", IsTracked = true, Metric = new Metric { ID = 1, Name = "User Metric 1", Type = MetricType.Numeric, IsSystem = false, UserID = "123" }, MetricID = 1, User = null }
            };

            var mockDailyTargetRepo = Mock.Of<IRepository<DailyTarget>>();
            var mockUserMetricRepo = Mock.Of<IRepository<UserMetric>>();

            var mockUserTrackedMetricRepo = new MockRepository<UserTrackedMetric>();
            mockUserTrackedMetricRepo.MockGet(userTrackedMetrics.AsQueryable());

            var metricRepo = Mock.Of<IRepository<Metric>>();
            var gearRepo = Mock.Of<IRepository<Gear>>();
            var activityRepo = Mock.Of<IRepository<Activity>>();

            var userService = new UserService(
                _mockUserManager.Object,
                _mockSignInManager.Object,
                _mockHostEnvironment.Object,
                mockDailyTargetRepo,
                mockUserMetricRepo,
                mockUserTrackedMetricRepo.Object,
                metricRepo,
                gearRepo,
                activityRepo);

            var response = userService.GetUserTrackedMetrics(user);

            Assert.Equal(3, response.Metrics.Count);
        }

        [Fact]
        public void UserService_UpdateUserMetricTracking_Success()
        {
            var request = new ToggleUserMetricTrackingRequest
            {
                MetricID = -2
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var userTrackedMetrics = new List<UserTrackedMetric>
            {
                new UserTrackedMetric { ID = 1, UserID = "123", IsTracked = true, Metric = new Metric { ID = -1, Name = "Test Metric 1", Type = MetricType.Weight, IsSystem = true }, MetricID = -1, User = null },
                new UserTrackedMetric { ID = 2, UserID = "123", IsTracked = false, Metric = new Metric { ID = -2, Name = "Test Metric 2", Type = MetricType.Percentage, IsSystem = true }, MetricID = -2, User = null },
                new UserTrackedMetric { ID = 3, UserID = "123", IsTracked = true, Metric = new Metric { ID = 1, Name = "User Metric 1", Type = MetricType.Numeric, IsSystem = false, UserID = "123" }, MetricID = 1, User = null }
            };

            var mockDailyTargetRepo = Mock.Of<IRepository<DailyTarget>>();
            var mockUserMetricRepo = Mock.Of<IRepository<UserMetric>>();

            var mockUserTrackedMetricRepo = new MockRepository<UserTrackedMetric>();
            mockUserTrackedMetricRepo.MockGet(userTrackedMetrics.AsQueryable());
            mockUserTrackedMetricRepo.MockUpdate(userTrackedMetrics[0]);

            var metricRepo = Mock.Of<IRepository<Metric>>();
            var gearRepo = Mock.Of<IRepository<Gear>>();
            var activityRepo = Mock.Of<IRepository<Activity>>();

            var userService = new UserService(
                _mockUserManager.Object,
                _mockSignInManager.Object,
                _mockHostEnvironment.Object,
                mockDailyTargetRepo,
                mockUserMetricRepo,
                mockUserTrackedMetricRepo.Object,
                metricRepo,
                gearRepo,
                activityRepo);

            var response = userService.UpdateUserMetricTracking(user, request).Result;

            Assert.Equal(3, response.Metrics.Count);
        }

        [Fact]
        public void UserService_GetUserGear_Successful()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var gear = new List<Gear>
            {
                new Gear { ID = 1, Active = true, Name = "Gear 1", UserID = "123" },
                new Gear { ID = 2, Active = true, Name = "Gear 2", UserID = "123" },
                new Gear { ID = 3, Active = true, Name = "Gear 3", UserID = "123" }
            };

            var mockDailyTargetRepo = Mock.Of<IRepository<DailyTarget>>();
            var mockUserMetricRepo = Mock.Of<IRepository<UserMetric>>();

            var gearRepo = new MockRepository<Gear>();
            gearRepo.MockGet(gear.AsQueryable());

            var metricRepo = Mock.Of<IRepository<Metric>>();
            var mockUserTrackedMetricRepo = Mock.Of<IRepository<UserTrackedMetric>>();
            var activityRepo = Mock.Of<IRepository<Activity>>();

            var userService = new UserService(
                _mockUserManager.Object,
                _mockSignInManager.Object,
                _mockHostEnvironment.Object,
                mockDailyTargetRepo,
                mockUserMetricRepo,
                mockUserTrackedMetricRepo,
                metricRepo,
                gearRepo.Object,
                activityRepo);

            var response = userService.GetUserGear(user);

            Assert.Equal(3, response.Gear.Count);
        }

        [Fact]
        public void UserService_GetUserCustomActivities_Successful()
        {
            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "TestUser123@testing.com"
            };

            var activities = new List<Activity>
            {
                new Activity { ID = 1, EstimatedCaloriesBurnedPerMinute = 5, IsSystem = false, Name = "Activity 1", UserID = "123" },
                new Activity { ID = 2, EstimatedCaloriesBurnedPerMinute = 5, IsSystem = false, Name = "Activity 2", UserID = "123" },
                new Activity { ID = 3, EstimatedCaloriesBurnedPerMinute = 5, IsSystem = false, Name = "Activity 3", UserID = "123" }
            };

            var mockDailyTargetRepo = Mock.Of<IRepository<DailyTarget>>();
            var mockUserMetricRepo = Mock.Of<IRepository<UserMetric>>();

            var activityRepo = new MockRepository<Activity>();
            activityRepo.MockGet(activities.AsQueryable());

            var metricRepo = Mock.Of<IRepository<Metric>>();
            var mockUserTrackedMetricRepo = Mock.Of<IRepository<UserTrackedMetric>>();
            var gearRepo = Mock.Of<IRepository<Gear>>();

            var userService = new UserService(
                _mockUserManager.Object,
                _mockSignInManager.Object,
                _mockHostEnvironment.Object,
                mockDailyTargetRepo,
                mockUserMetricRepo,
                mockUserTrackedMetricRepo,
                metricRepo,
                gearRepo,
                activityRepo.Object);

            var response = userService.GetUserCustomActivities(user);

            Assert.Equal(3, response.Activities.Count);
        }
    }
}