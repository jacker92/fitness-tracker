using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Requests
{
    public class UpdateProfileRequest
    {
        [Required]
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [Required]
        [JsonPropertyName("email")]
        public string Email { get; set; }

        [Required]
        [JsonPropertyName("measurementSystem")]
        public MeasurementSystem MeasurementSystem { get; set; }

        [JsonPropertyName("birthday")]
        public DateTime Birthday { get; set; }

        [JsonPropertyName("height")]
        public decimal Height { get; set; }

        [Required]
        [JsonPropertyName("gender")]
        public char Gender { get; set; }

        [Required]
        [JsonPropertyName("activityLevel")]
        public ActivityLevel ActivityLevel { get; set; }
    }
}