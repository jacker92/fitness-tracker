using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class CheckEmailResponse : BaseResponse
    {
        [JsonPropertyName("valid")]
        public bool Valid { get; set; } = true;
    }
}