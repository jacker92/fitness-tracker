using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models
{
    public class Image
    {
        [JsonPropertyName("normalImage")]
        public string NormalImage { get; set; }

        [JsonPropertyName("webPImage")]
        public string WebPImage { get; set; }
    }
}