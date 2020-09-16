using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models
{
    public class Activity
    {
        [JsonPropertyName("id")]
        public int ID { get; set; }

        [JsonPropertyName("userId")]
        public string UserID { get; set; }

        [JsonIgnore]
        public virtual User User { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("estimatedCaloriesBurnedPerMinute")]
        public int EstimatedCaloriesBurnedPerMinute { get; set; }

        [JsonPropertyName("type")]
        public ActivityMetricType Type { get; set; }

        [JsonPropertyName("isSystem")]
        public bool IsSystem { get; set; }
    }
}