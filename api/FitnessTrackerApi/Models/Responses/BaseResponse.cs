using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class BaseResponse
    {
        [JsonPropertyName("successful")]
        public bool Successful { get; set; } = true;

        [JsonPropertyName("error")]
        public string ErrorMessage { get; set; } = "";
    }
}