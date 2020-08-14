using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace FitnessTrackerApi.Models.Requests
{
    public class ImageUploadRequest
    {
        [Required]
        public string Filename { get; set; }

        [Required]
        public IFormFile Image { get; set; }
    }
}