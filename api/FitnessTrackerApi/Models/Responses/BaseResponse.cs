using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class BaseResponse
    {
        [JsonPropertyName("error_message")]
        public string ErrorMessage { get; set; } = "";
    }
}