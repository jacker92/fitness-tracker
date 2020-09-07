using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Requests
{
    public class DeleteGearRequest
    {
        [Required]
        [JsonPropertyName("id")]
        public int ID { get; set; }
    }
}