using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models
{
    public class User : IdentityUser
    {
        [JsonIgnore]
        [Column(TypeName = "nvarchar(max)")]
        public override string PasswordHash { get; set; }

        [PersonalData]
        public string Name { get; set; }

        [PersonalData]
        public List<UserActivity> Activities { get; set; }

        [PersonalData]
        public List<Food> Foods { get; set; }

        [PersonalData]
        public List<FoodGrouping> FoodGroupings { get; set; }

        [PersonalData]
        public List<FoodIntake> FoodEaten { get; set; }

        [PersonalData]
        public List<UserMetric> Metrics { get; set; }

        [PersonalData]
        public List<Recipe> Recipes { get; set; }

        [PersonalData]
        public int DailyTargetID { get; set; }

        [PersonalData]
        public DailyTarget DailyTarget { get; set; }

        [PersonalData]
        public MeasurementSystem MeasurementSystem { get; set; }

        [PersonalData]
        public DateTime Birthday { get; set; }

        [PersonalData]
        [Column(TypeName = "decimal(18,4)")]
        public decimal Height { get; set; }

        [PersonalData]
        public string Avatar { get; set; }

        [PersonalData]
        public CaloriesBurnedOffset CaloriesBurnedSetting { get; set; } = CaloriesBurnedOffset.Ignore;

        [PersonalData]
        public char Gender { get; set; }

        [PersonalData]
        public ActivityLevel ActivityLevel { get; set; }

        [PersonalData]
        public bool ManuallyCalculateCalories { get; set; } = true;

        [PersonalData]
        public DietMode DietMode { get; set; } = DietMode.Maintenance;

        [PersonalData]
        [Column(TypeName = "decimal(18,4)")]
        public decimal DietPercentage { get; set; } = 0;

        [PersonalData]
        [NotMapped]
        public int Age
        {
            get
            {
                var today = DateTime.Today;
                var age = today.Year - Birthday.Year;

                // Go back to the year the person was born in case of a leap year
                if (Birthday.Date > today.AddYears(-age))
                {
                    age -= 1;
                }

                return age;
            }
        }

        [PersonalData]
        [NotMapped]
        public decimal Weight { get; set; }

        [PersonalData]
        [NotMapped]
        public decimal BodyFatPercentage { get; set; }
    }
}