using FitnessTrackerApi.Models;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class GetFoodResponse : BaseResponse
    {
        [JsonPropertyName("food")]
        public Food Food { get; set; }
    }
}