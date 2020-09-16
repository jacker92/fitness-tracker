using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class UserMetricsResponse : BaseResponse
    {
        [JsonPropertyName("metrics")]
        public List<UserTrackedMetric> Metrics { get; set; }
    }
}