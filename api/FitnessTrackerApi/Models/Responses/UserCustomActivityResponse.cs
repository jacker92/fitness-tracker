using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class UserCustomActivityResponse : BaseResponse
    {
        [JsonPropertyName("activities")]
        public List<Activity> Activities { get; set; }
    }
}