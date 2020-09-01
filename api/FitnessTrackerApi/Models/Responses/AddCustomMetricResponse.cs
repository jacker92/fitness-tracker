using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class AddCustomMetricResponse : BaseResponse
    {
        [JsonPropertyName("metrics")]
        public List<UserTrackedMetric> Metrics { get; set; }
    }
}