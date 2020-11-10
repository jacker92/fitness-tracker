using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Requests
{
    public class DeleteRecipeRequest
    {
        [JsonPropertyName("id")]
        public int ID { get; set; }
    }
}