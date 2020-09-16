using FitnessTrackerApi.Models;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class UserResponse : BaseResponse
    {
        [JsonPropertyName("user")]
        public User User { get; set; }
    }
}