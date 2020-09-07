using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;


namespace FitnessTrackerApi.Models.Requests
{
    public class AddGearRequest
    {
        [Required]
        [JsonPropertyName("name")]
        public string Name { get; set; }
    }
}