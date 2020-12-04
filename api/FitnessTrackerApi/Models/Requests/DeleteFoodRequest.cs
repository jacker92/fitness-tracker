using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Requests
{
    public class DeleteFoodRequest
    {
        [JsonPropertyName("id")]
        public int ID { get; set; }
    }
}