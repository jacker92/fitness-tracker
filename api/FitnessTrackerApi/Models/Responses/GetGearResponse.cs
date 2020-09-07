using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class GetGearResponse : BaseResponse
    {
        [JsonPropertyName("gear")]
        public Gear Gear { get; set; }
    }
}