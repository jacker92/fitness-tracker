using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Repositories;
using FitnessTrackerApi.Services;
using FitnessTrackerApi.Tests.Mocks.Repositories;
using Moq;
using System.Collections.Generic;
using System.Linq;
using Xunit;
using Xunit.Abstractions;

namespace FitnessTrackerApi.Tests.Services
{
    public class GearServiceTests
    {
        private readonly ITestOutputHelper _output;

        public GearServiceTests(ITestOutputHelper output)
        {
            _output = output;
        }

        [Fact]
        public void GearService_GetById_ReturnsGear()
        {
            var gear = new Gear
            {
                ID = 1,
                Name = "Running Shoes",
                Active = true,
                UserID = "123",
                User = null
            };

            var gearRepo = new MockRepository<Gear>();
            gearRepo.MockGetById(gear);

            var gearService = new GearService(gearRepo.Object);

            var result = gearService.GetById(1);

            Assert.Equal("Running Shoes", result.Name);
            Assert.True(result.Active);
        }

        [Fact]
        public void GearService_AddGear_Success()
        {
            var request = new AddGearRequest
            {
                Name = "Mountain Bike"
            };

            var user = TestDataRepository.CreateUser();

            var gear = new Gear
            {
                ID = 2,
                Name = "Mountain Bike",
                Active = true,
                UserID = "123",
                User = null
            };

            var userGear = new List<Gear>
            {
                new Gear
                {
                    ID = 1,
                    Name = "Running Shoes",
                    Active = true,
                    UserID = "123",
                    User = null
                },
                gear
            };

            var gearRepo = new MockRepository<Gear>();
            gearRepo.MockAdd(gear);
            gearRepo.MockGet(userGear.AsQueryable());

            var gearService = new GearService(gearRepo.Object);

            var response = gearService.AddGear(user, request).Result;

            Assert.Equal(2, response.Gear.Count);
        }

        [Fact]
        public void GearService_UpdateGear_Success()
        {
            var request = new UpdateGearRequest
            {
                ID = 2,
                Name = "Road Bike"
            };

            var user = TestDataRepository.CreateUser();

            var gear = new Gear
            {
                ID = 2,
                Name = "Mountain Bike",
                Active = true,
                UserID = "123",
                User = null
            };

            var userGear = new List<Gear>
            {
                new Gear
                {
                    ID = 1,
                    Name = "Running Shoes",
                    Active = true,
                    UserID = "123",
                    User = null
                },
                gear
            };

            var gearRepo = new MockRepository<Gear>();
            gearRepo.MockGetById(gear);
            gearRepo.MockUpdate(gear);
            gearRepo.MockGet(userGear.AsQueryable());

            var gearService = new GearService(gearRepo.Object);

            var response = gearService.UpdateGear(user, request).Result;

            Assert.Equal(2, response.Gear.Count);
        }

        [Fact]
        public void GearService_UpdateGear_UserDoesNotOwnGear()
        {
            var request = new UpdateGearRequest
            {
                ID = 2,
                Name = "Road Bike"
            };

            var user = TestDataRepository.CreateUser("456");

            var gear = new Gear
            {
                ID = 2,
                Name = "Mountain Bike",
                Active = true,
                UserID = "123",
                User = null
            };

            var userGear = new List<Gear>
            {
                new Gear
                {
                    ID = 1,
                    Name = "Running Shoes",
                    Active = true,
                    UserID = "123",
                    User = null
                },
                gear
            };

            var gearRepo = new MockRepository<Gear>();
            gearRepo.MockGetById(gear);
            gearRepo.MockUpdate(gear);
            gearRepo.MockGet(userGear.AsQueryable());

            var gearService = new GearService(gearRepo.Object);

            var response = gearService.UpdateGear(user, request).Result;

            Assert.Equal("Cannot find gear", response.ErrorMessage);
        }

        [Fact]
        public void GearService_DeleteGear_Success()
        {
            var request = new DeleteGearRequest
            {
                ID = 2
            };

            var user = TestDataRepository.CreateUser();

            var gear = new Gear
            {
                ID = 2,
                Name = "Mountain Bike",
                Active = true,
                UserID = "123",
                User = null
            };

            var userGear = new List<Gear>
            {
                new Gear
                {
                    ID = 1,
                    Name = "Running Shoes",
                    Active = true,
                    UserID = "123",
                    User = null
                }
            };

            var gearRepo = new MockRepository<Gear>();
            gearRepo.MockGetById(gear);
            gearRepo.MockDelete();
            gearRepo.MockGet(userGear.AsQueryable());

            var gearService = new GearService(gearRepo.Object);

            var response = gearService.DeleteGear(user, request).Result;

            Assert.Single(response.Gear);
        }

        [Fact]
        public void GearService_DeleteGear_UserDoesNotOwnGear()
        {
            var request = new DeleteGearRequest
            {
                ID = 2
            };

            var user = TestDataRepository.CreateUser("456");

            var gear = new Gear
            {
                ID = 2,
                Name = "Mountain Bike",
                Active = true,
                UserID = "123",
                User = null
            };

            var userGear = new List<Gear>
            {
                new Gear
                {
                    ID = 1,
                    Name = "Running Shoes",
                    Active = true,
                    UserID = "123",
                    User = null
                }
            };

            var gearRepo = new MockRepository<Gear>();
            gearRepo.MockGetById(gear);
            gearRepo.MockDelete();
            gearRepo.MockGet(userGear.AsQueryable());

            var gearService = new GearService(gearRepo.Object);

            var response = gearService.DeleteGear(user, request).Result;

            Assert.Equal("Cannot find gear", response.ErrorMessage);
        }

        [Fact]
        public void GearService_SetGearActiveFlag_Success()
        {
            var request = new SetGearActiveFlagRequest
            {
                ID = 2,
                Active = false
            };

            var user = TestDataRepository.CreateUser();

            var gear = new Gear
            {
                ID = 2,
                Name = "Mountain Bike",
                Active = true,
                UserID = "123",
                User = null
            };

            var userGear = new List<Gear>
            {
                new Gear
                {
                    ID = 1,
                    Name = "Running Shoes",
                    Active = true,
                    UserID = "123",
                    User = null
                },
                gear
            };

            var gearRepo = new MockRepository<Gear>();
            gearRepo.MockGetById(gear);
            gearRepo.MockUpdate(gear);
            gearRepo.MockGet(userGear.AsQueryable());

            var gearService = new GearService(gearRepo.Object);

            var response = gearService.SetGearActiveFlag(user, request).Result;

            Assert.Equal(2, response.Gear.Count);
        }

        [Fact]
        public void GearService_SetGearActiveFlag_UserDoesNotOwnGear()
        {
            var request = new SetGearActiveFlagRequest
            {
                ID = 2,
                Active = false
            };

            var user = TestDataRepository.CreateUser("456");

            var gear = new Gear
            {
                ID = 2,
                Name = "Mountain Bike",
                Active = true,
                UserID = "123",
                User = null
            };

            var userGear = new List<Gear>
            {
                new Gear
                {
                    ID = 1,
                    Name = "Running Shoes",
                    Active = true,
                    UserID = "123",
                    User = null
                },
                gear
            };

            var gearRepo = new MockRepository<Gear>();
            gearRepo.MockGetById(gear);
            gearRepo.MockUpdate(gear);
            gearRepo.MockGet(userGear.AsQueryable());

            var gearService = new GearService(gearRepo.Object);

            var response = gearService.SetGearActiveFlag(user, request).Result;

            Assert.Equal("Cannot find gear", response.ErrorMessage);
        }
    }
}