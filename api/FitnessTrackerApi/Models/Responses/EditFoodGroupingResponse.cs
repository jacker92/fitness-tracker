using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class EditFoodGroupingResponse : BaseResponse
    {
        [JsonPropertyName("foodGroupings")]
        public List<FoodGrouping> FoodGroupings { get; set; }
    }
}