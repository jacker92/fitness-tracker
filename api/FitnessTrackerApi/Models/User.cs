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
        public decimal Weight { get; set; }

        [PersonalData]
        [NotMapped]
        public decimal BodyFatPercentage { get; set; }
    }
}