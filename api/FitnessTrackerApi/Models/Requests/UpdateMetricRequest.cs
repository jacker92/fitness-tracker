using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Requests
{
    public class UpdateMetricRequest
    {
        [Required]
        [JsonPropertyName("id")]
        public int ID { get; set; }

        [Required]
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("units")]
        public string Units { get; set; }

        [Required]
        [JsonPropertyName("type")]
        public MetricType Type { get; set; }
    }
}