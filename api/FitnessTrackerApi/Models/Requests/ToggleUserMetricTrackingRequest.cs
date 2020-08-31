using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Requests
{
    public class ToggleUserMetricTrackingRequest
    {
        [Required]
        [JsonPropertyName("userTrackedMetricId")]
        public int UserTrackedMetricID { get; set; }
    }
}