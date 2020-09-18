using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Requests
{
    public class RegistrationRequest
    {
        [Required]
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [Required]
        [JsonPropertyName("email")]
        public string Email { get; set; }

        [Required]
        [JsonPropertyName("password")]
        public string Password { get; set; }

        [Required]
        [JsonPropertyName("measurementSystem")]
        public MeasurementSystem MeasurementSystem { get; set; }

        [Required]
        [JsonPropertyName("birthday")]
        public DateTime Birthday { get; set; }

        [Required]
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