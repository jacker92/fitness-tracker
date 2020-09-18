using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models
{
    public class Metric
    {
        [JsonPropertyName("id")]
        public int ID { get; set; }

        [JsonPropertyName("userId")]
        public string UserID { get; set; }

        [JsonIgnore]
        public virtual User User { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("units")]
        public string Units { get; set; }

        [JsonPropertyName("type")]
        public MetricType Type { get; set; }

        [JsonPropertyName("isSystem")]
        public bool IsSystem { get; set; }
    }
}