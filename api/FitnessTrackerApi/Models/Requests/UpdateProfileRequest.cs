using System;
using System.ComponentModel.DataAnnotations;

namespace FitnessTrackerApi.Models.Requests
{
    public class UpdateProfileRequest
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public MeasurementSystem MeasurementSystem { get; set; }

        public DateTime Birthday { get; set; }

        public decimal Height { get; set; }
    }
}