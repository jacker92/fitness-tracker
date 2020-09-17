using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models
{
    public class UserTrackedMetric
    {
        [JsonPropertyName("id")]
        public int ID { get; set; }

        [JsonPropertyName("userId")]
        public string UserID { get; set; }

        [JsonIgnore]
        public virtual User User { get; set; }

        [JsonPropertyName("metricId")]
        public int MetricID { get; set; }

        [JsonPropertyName("metric")]
        public virtual Metric Metric { get; set; }

        [JsonPropertyName("isTracked")]
        public bool IsTracked { get; set; }
    }
}