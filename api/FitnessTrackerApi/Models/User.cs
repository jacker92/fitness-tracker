using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessTrackerApi.Models
{
    public class User : IdentityUser
    {
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
        public bool ManuallyCalculateTargets { get; set; }

        [PersonalData]
        public List<Metric> MetricsTracked { get; set; }
    }
}