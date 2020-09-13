using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class GetActivityResponse : BaseResponse
    {
        [JsonPropertyName("activity")]
        public Activity Activity { get; set; }
    }
}