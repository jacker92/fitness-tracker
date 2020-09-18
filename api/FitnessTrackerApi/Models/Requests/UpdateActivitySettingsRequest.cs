using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Requests
{
    public class UpdateActivitySettingsRequest
    {
        [Required]
        [JsonPropertyName("caloriesBurnedSetting")]
        public CaloriesBurnedOffset CaloriesBurnedSetting { get; set; }

        [Required]
        [JsonPropertyName("enableActiveMinuteTarget")]
        public bool EnableActiveMinuteTarget { get; set; }

        [Required]
        [JsonPropertyName("activeMinuteTarget")]
        public int ActiveMintueTarget { get; set; }

        [Required]
        [JsonPropertyName("enableCaloriesBurnedTarget")]
        public bool EnableCaloriesBurnedTarget { get; set; }

        [Required]
        [JsonPropertyName("caloriesBurnedTarget")]
        public int CaloriesBurnedTarget { get; set; }
    }
}