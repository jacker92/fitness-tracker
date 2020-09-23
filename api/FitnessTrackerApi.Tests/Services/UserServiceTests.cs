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
    }
}