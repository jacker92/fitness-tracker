using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class GetMetricResponse : BaseResponse
    {
        [JsonPropertyName("metric")]
        public Metric Metric { get; set; }
    }
}