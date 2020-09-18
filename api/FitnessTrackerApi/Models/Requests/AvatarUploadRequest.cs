using Microsoft.AspNetCore.Http;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Requests
{
    public class AvatarUploadRequest
    {
        [AllowedExtensions(new string[] { ".jpg", ".png", ".gif" })]
        [MaxFileSize(10 * 1024 * 1024)] // 10 MB
        [JsonPropertyName("image")]
        public IFormFile Image { get; set; }
    }
}