using FitnessTrackerApi.Controllers;
using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Tests.Mocks.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Xunit;
using Xunit.Abstractions;

namespace FitnessTrackerApi.Tests.Controllers
{
    public class GearControllerTests
    {
        private readonly ITestOutputHelper _output;

        public GearControllerTests(ITestOutputHelper output)
        {
            _output = output;
        }

        [Fact]
        public void GearController_GetGear_ReturnsGear()
        {
            var gear = new Gear
            {
                ID = 1,
                Name = "Running Shoes",
                Active = true,
                UserID = "123",
                User = null
            };

            var gearService = new MockGearService().MockGetById(gear);

            var gearController = new GearController(gearService.Object);

            var result = (OkObjectResult)gearController.GetGear(1);

            var response = JsonSerializer.Deserialize<GetGearResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal(gear.Name, response.Gear.Name);
            Assert.Equal(gear.Active, response.Gear.Active);
        }

        [Fact]
        public void GearController_GetGear_GearNotFound()
        {
            var gearService = new MockGearService().MockGetById((Gear)null);

            var gearController = new GearController(gearService.Object);

            var result = (OkObjectResult)gearController.GetGear(1);

            var response = JsonSerializer.Deserialize<GetGearResponse>(result.Value.ToString());

            Assert.False(response.Successful);
            Assert.Equal("Gear not found", response.ErrorMessage);
        }


        [Fact]
        public void GearController_AddGear_Successful()
        {
            var request = new AddGearRequest
            {
                Name = "New Running Shoes"
            };

            var gearList = new List<Gear>
            {
                new Gear { ID = 1, Name = "Running Shoes", Active = true, UserID = "123", User = null },
                new Gear { ID = 2, Name = request.Name, Active = true, UserID = "123", User = null }
            };

            var editResponse = new EditGearResponse
            {
                Successful = true,
                ErrorMessage = "",
                Gear = gearList
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var gearService = new MockGearService().MockAddGear(editResponse);

            var gearController = new GearController(gearService.Object);
            gearController.ControllerContext.HttpContext = new DefaultHttpContext();
            gearController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)gearController.AddGear(request).Result;

            var response = JsonSerializer.Deserialize<EditGearResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal(2, response.Gear.Count);
        }

        [Fact]
        public void GearController_UpdateGear_Successful()
        {
            var request = new UpdateGearRequest
            {
                ID = 1,
                Name = "Old Running Shoes"
            };

            var gearList = new List<Gear>
            {
                new Gear { ID = 1, Name = request.Name, Active = true, UserID = "123", User = null },
                new Gear { ID = 2, Name = "New Running Shoes", Active = true, UserID = "123", User = null }
            };

            var editResponse = new EditGearResponse
            {
                Successful = true,
                ErrorMessage = "",
                Gear = gearList
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var gearService = new MockGearService().MockUpdateGear(editResponse);

            var gearController = new GearController(gearService.Object);
            gearController.ControllerContext.HttpContext = new DefaultHttpContext();
            gearController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)gearController.UpdateGear(request).Result;

            var response = JsonSerializer.Deserialize<EditGearResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal(2, response.Gear.Count);
        }

        [Fact]
        public void GearController_DeleteActivity_Successful()
        {
            var request = new DeleteGearRequest
            {
                ID = 1
            };

            var gearList = new List<Gear>
            {
                new Gear { ID = 2, Name = "New Running Shoes", Active = true, UserID = "123", User = null }
            };

            var editResponse = new EditGearResponse
            {
                Successful = true,
                ErrorMessage = "",
                Gear = gearList
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var gearService = new MockGearService().MockDeleteGear(editResponse);

            var gearController = new GearController(gearService.Object);
            gearController.ControllerContext.HttpContext = new DefaultHttpContext();
            gearController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)gearController.DeleteGear(request).Result;

            var response = JsonSerializer.Deserialize<EditGearResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Single(response.Gear);
        }

        [Fact]
        public void GearController_SetGearActive_Successful()
        {
            var request = new SetGearActiveFlagRequest
            {
                ID = 1,
                Active = false
            };

            var gearList = new List<Gear>
            {
                new Gear { ID = 1, Name = "Old Running Shoes", Active = false, UserID = "123", User = null },
                new Gear { ID = 2, Name = "New Running Shoes", Active = true, UserID = "123", User = null }
            };

            var editResponse = new EditGearResponse
            {
                Successful = true,
                ErrorMessage = "",
                Gear = gearList
            };

            var user = new User
            {
                Id = "123",
                Name = "Test User",
                Email = "testing@testing.com"
            };

            var gearService = new MockGearService().MockSetGearActiveFlag(editResponse);

            var gearController = new GearController(gearService.Object);
            gearController.ControllerContext.HttpContext = new DefaultHttpContext();
            gearController.ControllerContext.HttpContext.Items["User"] = user;

            var result = (OkObjectResult)gearController.SetGearActiveFlag(request).Result;

            var response = JsonSerializer.Deserialize<EditGearResponse>(result.Value.ToString());

            Assert.True(response.Successful);
            Assert.Equal(2, response.Gear.Count);
            Assert.Single(response.Gear.Where(g => g.Active).ToList());
        }

    }
}