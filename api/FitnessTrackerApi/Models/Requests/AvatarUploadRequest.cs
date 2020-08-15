using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Requests
{
    public class AvatarUploadRequest
    {
        [AllowedExtensions(new string[] { ".jpg", ".png", ".gif" })]
        [MaxFileSize(10 * 1024 * 1024)] // 10 MB
        public IFormFile Image { get; set; }
    }
}