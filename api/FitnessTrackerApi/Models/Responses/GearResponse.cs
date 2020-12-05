using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class GearResponse : BaseResponse
    {
        [JsonPropertyName("gear")]
        public Gear Gear { get; set; }
    }
}