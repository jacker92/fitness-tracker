using System;
using System.ComponentModel.DataAnnotations;

namespace FitnessTrackerApi.Models.Requests
{
    public class RegistrationRequest
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public MeasurementSystem MeasurementSystem { get; set; }

        [Required]
        public DateTime Birthday { get; set; }

        [Required]
        public decimal Height { get; set; }

        [Required]
        public char Gender { get; set; }

        [Required]
        public ActivityLevel ActivityLevel { get; set; }
    }
}