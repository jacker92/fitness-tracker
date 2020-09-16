using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class ToggleUserMetricTrackingResponse : BaseResponse
    {
        [JsonPropertyName("metrics")]
        public List<UserTrackedMetric> Metrics { get; set; }
    }
}