using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class GetFoodGroupingResponse : BaseResponse
    {
        [JsonPropertyName("foodGrouping")]
        public FoodGrouping FoodGrouping { get; set; }
    }
}