using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class EditActivityResponse : BaseResponse
    {
        [JsonPropertyName("activities")]
        public List<Activity> Activities { get; set; }
    }
}