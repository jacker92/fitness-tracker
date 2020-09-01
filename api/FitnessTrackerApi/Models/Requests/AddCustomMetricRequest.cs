using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Requests
{
    public class AddCustomMetricRequest
    {
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