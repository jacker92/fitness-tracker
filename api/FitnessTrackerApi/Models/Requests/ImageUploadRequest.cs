using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Requests
{
    public class ImageUploadRequest
    {
        public IFormFile Image { get; set; }
    }
}