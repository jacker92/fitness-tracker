using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class ImageUploadResponse : BaseResponse
    {
        [JsonPropertyName("image")]
        public string Image { get; set; }
    }
}