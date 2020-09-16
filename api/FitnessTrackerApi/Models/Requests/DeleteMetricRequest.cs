using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Requests
{
    public class DeleteMetricRequest
    {
        [Required]
        [JsonPropertyName("id")]
        public int ID { get; set; }
    }
}