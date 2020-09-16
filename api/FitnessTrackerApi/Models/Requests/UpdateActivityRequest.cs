using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Requests
{
    public class UpdateActivityRequest
    {
        [Required]
        [JsonPropertyName("id")]
        public int ID { get; set; }

        [Required]
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [Required]
        [JsonPropertyName("estimatedCaloriesBurnedPerMinute")]
        public int EstimatedCaloriesBurnedPerMinute { get; set; }

        [Required]
        [JsonPropertyName("type")]
        public ActivityMetricType Type { get; set; }
    }
}