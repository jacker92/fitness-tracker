using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Requests
{
    public class DeleteFoodGroupingRequest
    {
        [Required]
        [JsonPropertyName("id")]
        public int ID { get; set; }
    }
}