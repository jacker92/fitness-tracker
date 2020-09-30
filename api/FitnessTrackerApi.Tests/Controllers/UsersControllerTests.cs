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
    }
}