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
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("email")]
        public override string Email { get; set; }

        [PersonalData]
        [JsonPropertyName("activities")]
        public List<UserActivity> Activities { get; set; }

        [PersonalData]
        [JsonPropertyName("foods")]
        public List<Food> Foods { get; set; }

        [PersonalData]
        [JsonPropertyName("foodGroupings")]
        public List<FoodGrouping> FoodGroupings { get; set; }

        [PersonalData]
        [JsonPropertyName("foodEaten")]
        public List<FoodIntake> FoodEaten { get; set; }

        [PersonalData]
        [JsonPropertyName("metrics")]
        public List<Metric> Metrics { get; set; }

        [PersonalData]
        [JsonPropertyName("customActivities")]
        public List<Activity> CustomActivities { get; set; }

        [PersonalData]
        [JsonPropertyName("metricMeasurements")]
        public List<UserMetric> MetricMeasurements { get; set; }

        [PersonalData]
        [JsonPropertyName("trackedMetrics")]
        public List<UserTrackedMetric> TrackedMetrics { get; set; }

        [PersonalData]
        [JsonPropertyName("recipes")]
        public List<Recipe> Recipes { get; set; }

        [PersonalData]
        [JsonPropertyName("gear")]
        public List<Gear> Gear { get; set; }

        [PersonalData]
        [JsonPropertyName("dailyTargetId")]
        public int DailyTargetID { get; set; }

        [PersonalData]
        [JsonPropertyName("dailyTarget")]
        public DailyTarget DailyTarget { get; set; }

        [PersonalData]
        [JsonPropertyName("measurementSystem")]
        public MeasurementSystem MeasurementSystem { get; set; }

        [PersonalData]
        [JsonPropertyName("birthday")]
        public DateTime Birthday { get; set; }

        [PersonalData]
        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("height")]
        public decimal Height { get; set; }

        [PersonalData]
        [JsonPropertyName("avatar")]
        public string Avatar { get; set; }

        [PersonalData]
        [JsonPropertyName("caloriesBurnedSetting")]
        public CaloriesBurnedOffset CaloriesBurnedSetting { get; set; } = CaloriesBurnedOffset.Ignore;

        [PersonalData]
        [JsonPropertyName("gender")]
        public char Gender { get; set; }

        [PersonalData]
        [JsonPropertyName("activityLevel")]
        public ActivityLevel ActivityLevel { get; set; }

        [PersonalData]
        [JsonPropertyName("manuallyCalculateCalories")]
        public bool ManuallyCalculateCalories { get; set; } = true;

        [PersonalData]
        [JsonPropertyName("dietMode")]
        public DietMode DietMode { get; set; } = DietMode.Maintenance;

        [PersonalData]
        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("dietPercentage")]
        public decimal DietPercentage { get; set; } = 0;

        [PersonalData]
        [NotMapped]
        [JsonPropertyName("age")]
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
        [JsonPropertyName("bmr")]
        public int BMR
        {
            get
            {
                if (Weight > 0)
                {
                    decimal heightCM;
                    decimal weightKG;

                    if (MeasurementSystem == MeasurementSystem.US)
                    {
                        heightCM = Math.Round(Height * 2.54M, 0);
                        weightKG = Math.Round(Weight * 0.45359M, 0);
                    }
                    else
                    {
                        heightCM = Height * 100;
                        weightKG = Weight;
                    }

                    decimal bmr = 0;

                    switch (Gender)
                    {
                        case 'M':
                            bmr = (heightCM * 6.25M) + (weightKG * 10) - (Age * 5) + 5;
                            break;

                        case 'F':
                            bmr = (heightCM * 6.25M) + (weightKG * 10) - (Age * 5) - 161;
                            break;
                    }

                    return (int)Math.Round(bmr, 0);
                }

                return 0;
            }
        }

        [PersonalData]
        [NotMapped]
        [JsonPropertyName("tdee")]
        public int TDEE
        {
            get
            {
                if (Weight > 0)
                {
                    switch (Gender)
                    {
                        case 'M':
                            switch (ActivityLevel)
                            {
                                case ActivityLevel.Sedentary:
                                    return (int)Math.Round(BMR * 1.2, 0);

                                case ActivityLevel.Light:
                                    return (int)Math.Round(BMR * 1.375, 0);

                                case ActivityLevel.Moderate:
                                    return (int)Math.Round(BMR * 1.55, 0);

                                case ActivityLevel.Very:
                                    return (int)Math.Round(BMR * 1.725, 0);

                                case ActivityLevel.Extremely:
                                    return (int)Math.Round(BMR * 1.9, 0);
                            }
                            break;

                        case 'F':
                            switch (ActivityLevel)
                            {
                                case ActivityLevel.Sedentary:
                                    return (int)Math.Round(BMR * 1.1, 0);

                                case ActivityLevel.Light:
                                    return (int)Math.Round(BMR * 1.275, 0);

                                case ActivityLevel.Moderate:
                                    return (int)Math.Round(BMR * 1.35, 0);

                                case ActivityLevel.Very:
                                    return (int)Math.Round(BMR * 1.525, 0);

                                case ActivityLevel.Extremely:
                                    return (int)Math.Round(BMR * 1.7, 0);
                            }
                            break;
                    }
                }

                return 0;
            }
        }

        [PersonalData]
        [NotMapped]
        [JsonPropertyName("weight")]
        public decimal Weight { get; set; }

        [PersonalData]
        [NotMapped]
        [JsonPropertyName("bodyFatPercentage")]
        public decimal BodyFatPercentage { get; set; }
    }
}