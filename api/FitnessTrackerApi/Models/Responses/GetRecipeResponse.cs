using FitnessTrackerApi.Models;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class GetRecipeResponse : BaseResponse
    {
        [JsonPropertyName("recipe")]
        public Recipe Recipe { get; set; }
    }
}