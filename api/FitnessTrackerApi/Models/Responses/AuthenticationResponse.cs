using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class AuthenticationResponse : BaseResponse
    {
        [JsonPropertyName("userId")]
        public string UserID { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("email")]
        public string Email { get; set; }

        [JsonPropertyName("token")]
        public string Token { get; set; }
    }
}