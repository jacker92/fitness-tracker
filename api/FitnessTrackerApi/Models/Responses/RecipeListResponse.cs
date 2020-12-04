using FitnessTrackerApi.Models;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class RecipeListResponse : BaseResponse
    {
        [JsonPropertyName("recipes")]
        public List<Recipe> Recipes { get; set; } = new List<Recipe>();
    }
}