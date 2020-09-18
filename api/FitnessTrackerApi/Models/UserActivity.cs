using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models
{
    public class UserActivity
    {
        [JsonPropertyName("id")]
        public int ID { get; set; }

        [JsonPropertyName("userId")]
        public string UserID { get; set; }

        [JsonIgnore]
        public virtual User User { get; set; }

        [JsonPropertyName("dateRecorded")]
        public DateTime DateRecorded { get; set; }

        [JsonPropertyName("minutesElapsed")]
        public int MinutesElapsed { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("caloriesBurned")]
        public decimal CaloriesBurned { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("measurement")]
        public decimal Measurement { get; set; }

        [JsonPropertyName("activityId")]
        public int ActivityID { get; set; }

        [JsonPropertyName("activity")]
        public Activity Activity { get; set; }
    }
}