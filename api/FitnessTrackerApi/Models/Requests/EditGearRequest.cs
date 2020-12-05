using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Requests
{
    public class EditGearRequest
    {
        [Required]
        [JsonPropertyName("id")]
        public int ID { get; set; } = 0;

        [Required]
        [JsonPropertyName("name")]
        public string Name { get; set; }
    }
}