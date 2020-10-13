using FitnessTrackerApi.Models;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class EditFoodResponse : BaseResponse
    {
        [JsonPropertyName("foods")]
        public List<Food> Foods { get; set; }
    }
}