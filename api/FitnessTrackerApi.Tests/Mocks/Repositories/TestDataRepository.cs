using FitnessTrackerApi.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FitnessTrackerApi.Tests.Mocks.Repositories
{
    public static class TestDataRepository
    {
        public static User CreateUser(string id = "123")
        {
            //return new User
            // {
            //     Id = id,
            //     Name = "Test User",
            //     Email = "testing@testing.com"
            // };

            return new User
            {
                Id = id,
                Name = "Test User",
                Email = "TestUser123@testing.com",
                MeasurementSystem = MeasurementSystem.US,
                Birthday = new DateTime(1980, 01, 01),
                Height = 60,
                Gender = 'M',
                ActivityLevel = ActivityLevel.Moderate,
                DailyTargetID = 1
            };
        }
    }
}
